// @ts-check
import Index from './Index.js'

/**
 * @typedef {Object} Appointment
 * @property {string} appointmentDate
 * @property {string} appointmentStartTime
 * @property {string} appointmentEndTime
 * @property {number} weekday
 * @property {string} weekdayText
 * @property {number} lessonCount
 * @property {string} remark
 * @property {string} appointmentDateFormatted
 * @property {boolean} isActive
 * @property {boolean} isNext
 * @property {string} participantStatus
 * @property {string} participantStatusText
 */

/**
 * @typedef {Object} Course
 * @property {number} mandantId
 * @property {string} courseType
 * @property {number} courseId
 * @property {string} courseTitle
 * @property {string} courseDescription
 * @property {string} courseStartDate
 * @property {string} courseEndDate
 * @property {number} coursePrice
 * @property {string} currency
 * @property {boolean} courseRealisationDecision
 * @property {string} courseRealisationDecisionText
 * @property {number} roomId
 * @property {string} roomDescription
 * @property {string} roomDescriptionShort
 * @property {string} roomCategory
 * @property {number} locationId
 * @property {string} locationDescription
 * @property {number} weekday
 * @property {string} weekdayText
 * @property {number} courseIdFollowUp
 * @property {number} bookingType
 * @property {string} documentType
 * @property {string} documentKey
 * @property {Appointment[]} appointments
 * @property {boolean} isSubscription
 * @property {boolean} isActive
 * @property {string|null} courseFreeSeatFrom
 * @property {string} bookingTypeText
 */

/**
 * @typedef {Object} Center
 * @property {number} centerId
 * @property {string} short
 * @property {string} text
 * @property {string} name
 * @property {string} locationStreet
 * @property {string} locationStreetNumber
 * @property {string} locationZipCode
 * @property {string} locationCity
 * @property {string} locationCountry
 * @property {string} locationRegion
 * @property {string} phoneNumber
 * @property {string} email
 */

/**
 * @typedef {Object} BookingApiResponse
 * @property {Course} course
 * @property {Center} center
 * @property {number} statusCode
 * @property {string} message
 */

/**
 * Booking
 *
 * @export
 * @class Booking
 * @type {CustomElementConstructor}
 */
export default class Booking extends Index {
  // @ts-ignore
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.bookingData = null
    // @ts-ignore
    this.appointmentsData = []
    // @ts-ignore
    this.documentData = []
    this.followUpData = null
    this.bookingDetails = null
    // @ts-ignore
    this.currentCourseId = null
    // @ts-ignore
    this.currentCourseType = null
    this.modulesLoaded = false
    this.followupRequested = false
    this.documentRequested = false

    this.requestBookingListener = this.createRequestListener(
      // @ts-ignore
      data => { 
        if (!data || !data.course) {
          if (this.modulesLoaded) this.renderBookingContent()
          setTimeout(() => this.renderNoResult(data?.message), 0)
          return
        }
        this.followupRequested = false
        this.bookingData = data || {}

        const course = this.bookingData.course || {}
        // @ts-ignore
        this.appointmentsData = Array.isArray(course.appointments) ? course.appointments.map(appt => ({ ...appt })) : []
        
        if (this.modulesLoaded) {
          this.renderBookingContent()
          setTimeout(() => this.renderBooking(), 0)
        }

        // request followup
        if (this.bookingData?.course?.courseIdFollowUp && !this.followupRequested) {
          this.followupRequested = true
          this.dispatchEvent(new CustomEvent('request-followup', {
            detail: { 
              courseIdFollowUp: this.bookingData.course.courseIdFollowUp, 
              courseTypeFollowUp: this.bookingData.course.courseType 
            },
            bubbles: true,
            cancelable: true,
            composed: true
          }))
        }

        // request document
        if (this.bookingData?.course.documentKey && this.bookingData?.course.documentType) {
          this.dispatchEvent(new CustomEvent('request-document', {
            detail: {
              documentKey: this.bookingData.course.documentKey,
              documentType: this.bookingData.course.documentType
            },
            bubbles: true,
            cancelable: true,
            composed: true
          }))
        }
      },
      // @ts-ignore
      error => { console.error('Error fetching bookings:', error); setTimeout(() => this.renderNoResult(), 0) }
    )

    this.requestFollowUpListener = this.createRequestListener(
      // @ts-ignore
      data => { this.followUpData = data || []; if (this.modulesLoaded) setTimeout(() => this.renderFollowUp(), 0) },
      // @ts-ignore
      error => { console.error('Error fetching followUp:', error); setTimeout(() => this.renderNoResult(), 0) }
    )

    this.requestDocumentListener = this.createRequestListener(
      // @ts-ignore
      data => {
        if (data instanceof Blob) {
          const url = URL.createObjectURL(data)
          this.documentData = [{ label: 'Rechnung', type: 'PDF', url }]
        } else {
          this.documentData = data || []
        }
        if (this.modulesLoaded) {
          // const hasRequestConfirmation = this.documentData.length
          const body = this.shadowRoot?.querySelector('o-grid')?.shadowRoot?.querySelector('ks-o-body-section')?.shadowRoot
          const documentsSection = body?.querySelector('#booking-documents')
          if (documentsSection) documentsSection.style.display = (this.documentData && this.documentData.length > 0) ? 'block' : 'none'
          const documentsComponent = body?.querySelector('kp-m-documents')
          // if (hasRequestConfirmation) {
            if (documentsComponent) documentsComponent.setAttribute('documents', JSON.stringify(this.documentData))
            documentsComponent.setAttribute('request-confirmation', '')
            // this.showRequestConfirmationNotification()
          // }
        }
      },
      // @ts-ignore
      error => { console.error('Error fetching document:', error) }
    )

    // @ts-ignore
    this.courseConfirmationListener = (event) => this.requestCourseConfirmation()

    this.sendMessageResponseListener = this.createRequestListener(
      // @ts-ignore
      data => {
        if (data && data.statusCode === 0) { // 200
          this.showRequestConfirmationNotification('success')
        } else {
          this.showRequestConfirmationNotification('error')
        }
      },
      // @ts-ignore
      error => {
        console.error('Error sending message:', error)
        this.showRequestConfirmationNotification('error')
      }
    )
  }

  // @ts-ignore
  createRequestListener(onSuccess, onError) {
    // @ts-ignore
    return (event) => { event.detail.fetch.then(onSuccess).catch(onError)}
  }

  handleCourseIdChange = () => {
    const hash = window.location.hash
    const searchParams = hash.includes('?') ? hash.split('?')[1] : ''
    const urlParams = new URLSearchParams(searchParams)
    const newCourseId = urlParams.get('courseId')
    const newCourseType = urlParams.get('courseType')
    
    if ((newCourseId && newCourseId !== this.currentCourseId) || 
      (newCourseType && newCourseType !== this.currentCourseType)) {

      this.resetBookingData()
      this.showLoading()
      
      this.currentCourseId = newCourseId
      this.currentCourseType = newCourseType

      this.dispatchEvent(new CustomEvent('request-booking', { 
        bubbles: true, 
        cancelable: true, 
        composed: true 
      }))
    }
  }

  resetBookingData() {
    this.bookingData = null
    this.appointmentsData = []
    this.documentData = []
    this.followUpData = null
    this.bookingDetails = null
    
    if (this.modulesLoaded) {
      const body = this.shadowRoot?.querySelector('o-grid')?.shadowRoot?.querySelector('ks-o-body-section')?.shadowRoot
      if (body) {
        const sections = ['#booking-details', '#booking-appointments', '#booking-documents', '#booking-notification']
        sections.forEach(selector => {
          const section = body.querySelector(selector)
          if (section) section.style.display = 'none'
        })
        
        const followUpSection = this.shadowRoot?.querySelector('ks-o-body-section')
        const followupWrapper = followUpSection?.shadowRoot?.querySelector('#followup-wrapper')
        if (followupWrapper) followupWrapper.style.display = 'none'
      }
    }
  }

  showLoading() {
    if (this.modulesLoaded) {
      const existingContent = this.root.querySelector('#detail-page')
      const existingLoading = this.root.querySelector('ks-m-loading')
      
      if (existingContent) existingContent.remove()
      if (!existingLoading) {
        this.html = /* html */`<ks-m-loading text="Kursdaten werden geladen..." color="#0053A6"></ks-m-loading>`
      }
    }
  }

  connectedCallback () {
    if (this.shouldRenderHTML()) this.renderHTML()
    if (this.shouldRenderCSS()) this.renderCSS()
    document.body.addEventListener('update-booking', this.requestBookingListener)
    document.body.addEventListener('update-followup', this.requestFollowUpListener)
    document.body.addEventListener('update-document', this.requestDocumentListener)
    document.body.addEventListener('request-course-confirmation', this.courseConfirmationListener)
    document.body.addEventListener('update-send-message', this.sendMessageResponseListener)
    window.addEventListener('hashchange', this.handleCourseIdChange)
    const hash = window.location.hash
    const searchParams = hash.includes('?') ? hash.split('?')[1] : ''
    const urlParams = new URLSearchParams(searchParams)
    this.currentCourseId = urlParams.get('courseId')
    this.currentCourseType = urlParams.get('courseType')
    this.dispatchEvent(new CustomEvent('request-booking', { bubbles: true, cancelable: true, composed: true }))
  }

  disconnectedCallback () {
    document.body.removeEventListener('update-booking', this.requestBookingListener)
    document.body.removeEventListener('update-followup', this.requestFollowUpListener)
    document.body.removeEventListener('update-document', this.requestDocumentListener)
    document.body.removeEventListener('request-course-confirmation', this.courseConfirmationListener)
    document.body.removeEventListener('update-send-message', this.sendMessageResponseListener)
    window.removeEventListener('hashchange', this.handleCourseIdChange)
    // @ts-ignore
    if (this.followupObserver) { this.followupObserver.disconnect(); this.followupObserver = null }
  }

  shouldRenderHTML () {
    return !this.root.querySelector('div#booking')
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  renderCSS () {
    this.css = /* css */`
      :host #top-stage {
        cursor: pointer;
        background-color: var(--mdx-sys-color-primary-default);
        color: white;
        padding: 24px 96px 24px 24px;
      }
      :host #top-stage > a-icon-mdx {
        display: inline-block;
        position: relative;
        top: 2px;
      }
      :host h2 {
        color: var(--mdx-sys-color-accent-6-onSubtle);
        font: var(--mdx-sys-font-flex-large-headline2);
        display:flex; 
        gap:10px;
      }
      :host h2 > span {
        position: relative;
        top: -4px;
      }
    `

    return this.fetchTemplate()
  }

  fetchTemplate () {
    const styles = [
      {
        path: `${this.importMetaUrl}../../../es/components/web-components-toolbox/src/css/reset.css`,
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../../es/components/web-components-toolbox/src/css/style.css`,
        namespaceFallback: true
      }
    ]

    return this.fetchCSS(styles)
  }

  renderHTML () {
    this.bookingData = null
    this.appointmentsData = []
    this.documentData = []
    this.followUpData = null
    this.bookingDetails = null

    this.html = ''
    this.html = /* html */`
      <kp-m-loading text="Kursdaten werden geladen..." color="#0053A6"></kp-m-loading>
    `

    this.fetchModules([
      {
        path: `${this.importMetaUrl}'../../../../kunden-portal/components/molecules/appointments/Appointments.js`,
        name: 'kp-m-appointments'
      },
      {
        path: `${this.importMetaUrl}'../../../../kunden-portal/components/molecules/documents/Documents.js`,
        name: 'kp-m-documents'
      },
      {
        path: `${this.importMetaUrl}'../../../../kunden-portal/components/molecules/followUp/FollowUp.js`,
        name: 'kp-m-followup'
      },
      {
        path: `${this.importMetaUrl}'../../../../kunden-portal/components/molecules/loading/Loading.js`,
        name: 'kp-m-loading'
      },
      {
        path: `${this.importMetaUrl}'../../../../kunden-portal/components/molecules/systemNotification/SystemNotification.js`,
        name: 'kp-m-system-notification'
      },
      {
        path: `${this.importMetaUrl}'../../../../kunden-portal/components/molecules/tileBookingDetails/TileBookingDetails.js`,
        name: 'kp-m-tile-booking-details'
      },
      {
        path: `${this.importMetaUrl}'../../../../kunden-portal/components/molecules/tileDiscover/TileDiscover.js`,
        name: 'kp-m-tile-discover'
      },
      {
        path: `${this.importMetaUrl}../../components/atoms/button/Button.js`,
        name: 'ks-a-button'
      },
      {
        path: `${this.importMetaUrl}../../components/atoms/heading/Heading.js`,
        name: 'ks-a-heading'
      },
      {
        path: `${this.importMetaUrl}../../components/atoms/spacing/Spacing.js`,
        name: 'ks-a-spacing'
      },
      {
        path: `${this.importMetaUrl}../../components/molecules/contactRow/ContactRow.js`,
        name: 'ks-m-contact-row'
      },
      {
        path: `${this.importMetaUrl}../../components/organisms/bodySection/BodySection.js`,
        name: 'ks-o-body-section'
      },
      {
        path: `${this.importMetaUrl}../../components/web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      },
      {
        path: `${this.importMetaUrl}../../components/web-components-toolbox/src/es/components/molecules/dialog/Dialog.js`,
        name: 'm-dialog'
      },
      {
        path: `${this.importMetaUrl}../../components/web-components-toolbox/src/es/components/organisms/grid/Grid.js`,
        name: 'o-grid'
      }
    ]).then(() => {
      this.modulesLoaded = true

      if (this.bookingData) {
        this.renderBookingContent()
        this.renderBooking()
      }
    })
  }

  renderBookingContent() {
    const loadingElement = this.root.querySelector('kp-m-loading')
    if (loadingElement) loadingElement.remove()

    this.html = ''
    this.html = /* html */`
      <div id="detail-page">
        <div id="top-stage">
          <a-icon-mdx icon-name="ArrowLeft" size="1em" color="white"></a-icon-mdx> Meine Kurse / Lehrgänge
        </div>
        <div id="body-stage">
          <o-grid namespace="grid-2columns-content-section-" first-container-vertical first-column-with="66%" with-border width="100%" count-section-children="2">
            <section>
              <ks-o-body-section content-width-var="100%" no-margin-y background-color="white">
                <!-- notification -->
                <section id="booking-notification" style="display:none;">
                  <div class="notification-wrapper"></div>
                  <ks-a-spacing id="notification-spacing" type="l-flex"></ks-a-spacing>
                </section>
                <!-- details -->
                <section id="booking-details" style="display:none;">
                  <kp-m-tile-booking-details data="${this.bookingDetails || ''}"></kp-m-tile-booking-details>
                  <ks-a-spacing id="notification-spacing" type="l-flex"></ks-a-spacing>
                </section>
                <!-- appointments -->
                <section id="booking-appointments" style="display:none;">
                  <h2><a-icon-mdx icon-name="Calendar" size="1em"></a-icon-mdx> Kurs Termin(e)</h2>
                  <kp-m-appointments appointments='${JSON.stringify(this.appointmentsData)}'></kp-m-appointments>
                  <ks-a-spacing id="notification-spacing" type="l-flex"></ks-a-spacing>
                </section>
                <!-- documents -->
                <section id="booking-documents" style="display:none;">
                  <h2><a-icon-mdx icon-name="FileText" size="1em"></a-icon-mdx> Dokumente</h2>
                  <kp-m-documents documents="${JSON.stringify(this.documentData)}" course-id="${this.currentCourseId}" course-type="${this.currentCourseType}"></kp-m-documents>
                </section>
              </ks-o-body-section>
              <!-- contact -->
              <aside style="background-color: white;"></aside>
            </section>
          </o-grid>
          <!-- followup -->
          <ks-o-body-section content-width-var="100%" no-margin-y background-color="var(--mdx-sys-color-accent-6-subtle1)" has-background>
            <section style="width: var(--body-section-default-width, 86.666%); margin: 0 auto;">
              <div id="followup-wrapper" style="display:none;">
                <div id="continuation-course">
                  <h2><a-icon-mdx icon-name="AddToList" size="1em"></a-icon-mdx> Fortsetzungskurs</h2>
                  <div class="container-followup container"></div>
                </div>
                <ks-a-spacing id="notification-spacing" type="xs-flex"></ks-a-spacing>
              </div>
              <!-- discover -->
              <div class="container-discover">
                <style>
                  :host .container-discover { display: flex; gap: var(--mdx-sys-spacing-flex-xs, 24px); }
                  @media only screen and (max-width:${this.mobileBreakpoint}) { :host .container-discover { flex-direction: column; } }
                </style>
                ${this.discoverTiles.map((tile, 
// @ts-ignore
                i) => /* html */`
                  <kp-m-tile-discover
                    image-src="${tile.imageSrc}"
                    tile-label="${tile.label}"
                    link-href="${tile.href}"
                    link-text="Kurse entdecken">
                  </kp-m-tile-discover>
                `).join('')}
              </div>
            </section>
          </ks-o-body-section>
        </div>
      </div>
    `

    setTimeout(() => {
      const topStage = this.root.querySelector('#top-stage')
      if (topStage) topStage.addEventListener('click', this.goToDashboard)
    }, 0)
  }

  renderBooking () {
    if (!this.bookingData) return
    const body = this.shadowRoot?.querySelector('o-grid').shadowRoot.querySelector('ks-o-body-section').shadowRoot

    // remove notification
    const notificationSection = body.querySelector('#booking-notification')
    const wrapper = body.querySelector('.notification-wrapper')
    if (wrapper) wrapper.innerHTML = ''
    if (notificationSection) notificationSection.style.display = 'none'

    // booking details
    /**
     * @type {Course}
     */
    const course = this.bookingData.course || {}
    if (!course) return

    const start = new Date(course.courseStartDate)
    const end = new Date(course.courseEndDate)
    // @ts-ignore
    const formatDate = d => d ? `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getFullYear()).slice(-2)}` : ''
    const daysEntry = `${formatDate(start)} - ${formatDate(end)}`
    const details = [
      { label: 'Teilnehmerstatus', text: this.bookingData.course.bookingTypeText },
      { label: 'Nummer', text: this.bookingData.course.courseType + '_' + String(this.bookingData.course.courseId) },
      { label: 'Zeitraum', text: daysEntry },
      { label: 'Ort', text: this.bookingData.course.locationDescription },
      { label: 'Unterrichtssprache', text: this.bookingData.course.courseLanguage },
      { label: 'Max. Teilnehmer', text: this.bookingData.course.capacity },
      { label: 'Dauer', text: `${this.bookingData.course.numberOfAppointments} Kurstag(e)<br />Total ${this.bookingData.course.lessions} Lektion(en) zu ${this.bookingData.course.lessionDuration} Min.` },
    ].filter(item => item.text && item.text !== 'undefined' && item.text !== 'null') // only show details with value

    this.bookingDetails = JSON.stringify({
      bookingTypeText: this.bookingData.course.bookingTypeText || 'Gebucht',
      courseTitle: this.bookingData.course.courseTitle || '',
      locationDescription: this.bookingData.course.locationDescription || '',
      daysEntry,
      statusText: this.bookingData.course.courseRealisationDecisionText || 'Gestartet',
      statusIcon: `${this.importMetaUrl}../../kunden-portal/images/icons/Status_Gestartet.svg` || '',
      linkLms: this.bookingData.course.linkLms || '',
      linkTeams: this.bookingData.course.linkTeams || '',
      linkDownload: '', // TODO: to define
      details
    })

    const tile = body.querySelector('kp-m-tile-booking-details')
    if (tile) tile.setAttribute('data', this.bookingDetails)

    const bookingDetailsSection = body.querySelector('#booking-details')
    if (bookingDetailsSection) bookingDetailsSection.style.display = 'block'

    // appointments
    const appointments = body.querySelector('kp-m-appointments')
    if (appointments) appointments.setAttribute('appointments', JSON.stringify(this.appointmentsData || []))
    const appointmentsSection = body.querySelector('#booking-appointments')
    if (this.appointmentsData.length && appointmentsSection) appointmentsSection.style.display = 'block'

    // contact and options
    /**
     * @type {Center}
     */
    const center = this.bookingData.center || {}
    let aside = this.shadowRoot?.querySelector('o-grid').shadowRoot.querySelector('aside')
    if (!aside) {
      aside = document.createElement('aside')
      aside.style.backgroundColor = 'white'
      body.appendChild(aside)
    }
    aside.innerHTML = /* html */'<ks-a-heading tag="h3">Kontakt</ks-a-heading>'

    const address = document.createElement('ks-m-contact-row')
    address.setAttribute('icon-name', 'Home')
    address.setAttribute('name', center.name || '')
    address.setAttribute('street', `${center.locationStreet || ''} ${center.locationStreetNumber || ''}`)
    address.setAttribute('place', `${center.locationZipCode || ''} ${center.locationCity || ''}`)
    address.setAttribute('href', `https://www.google.com/maps?q=${encodeURIComponent(center.name || '')}+${encodeURIComponent(center.locationCity || '')}`)
    address.setAttribute('target', '_blank')
    aside.appendChild(address)

    const phone = document.createElement('ks-m-contact-row')
    phone.setAttribute('icon-name', 'Phone')
    phone.setAttribute('name', center.phoneNumber || '')
    phone.setAttribute('href', `tel:${(center.phoneNumber || '').replace(/ /g, '')}`)
    aside.appendChild(phone)

    const mail = document.createElement('ks-m-contact-row')
    mail.setAttribute('icon-name', 'Mail')
    mail.setAttribute('name', center.email || '')
    mail.setAttribute('href', `mailto:${center.email || ''}`)
    aside.appendChild(mail)

    const heading2 = document.createElement('div')
    heading2.innerHTML = /* html */`
      <ks-a-spacing type="m-flex"></ks-a-spacing>
      <ks-a-heading tag="h3">Weitere Optionen</ks-a-heading>
    `
    aside.appendChild(heading2)

    const edit = document.createElement('ks-m-contact-row')
    edit.setAttribute('icon-name', 'Edit')
    edit.setAttribute('name', 'Meine Buchungen verwalten')
    edit.setAttribute('href', '#')
    aside.appendChild(edit)

    // go to top
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }

  renderFollowUp () {
    if (!this.followUpData) return

    const followUpSection = this.shadowRoot?.querySelector('ks-o-body-section')
    const containerDiv = followUpSection?.shadowRoot?.querySelector('.container-followup')
    if (!containerDiv) return

    containerDiv.innerHTML = ''

    const course = this.followUpData.followUp
    if (!course) return

    const start = new Date(course.courseStartDate)
      const end = new Date(course.courseEndDate)
      // @ts-ignore
      const formatDate = d => d ? `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getFullYear()).slice(-2)}` : ''

      // TODO: format date to dd.mm.yy ? Neet to check if this is needed
      const daysEntry = `${formatDate(start)} - ${formatDate(end)}`

      // TODO: Check this looks wrong
      const courseData = {
        course: {
          kurs_typ: course.courseType,
          kurs_id: course.courseId,
          datum_label: course.courseTitle,
          days: [daysEntry],
          location: {
            name: course.locationDescription,
            badge: course.roomDescription || ''
          },
          status: course.courseStatus,
          status_label: course.courseStatusText,
          buttons: [{
            text: 'Jetzt bestätigen',
            typ: 'primary',
            event: 'confirm-reservation',
            link: '#'
          },{
            text: 'Detail ansehen',
            typ: 'secondary',
            event: 'open-booking-detail',
            link: `#/booking?courseId=${course.courseId}&courseType=${course.courseType}`
          }],
          icons: [],
          state_of_booking: 'Reserviert',
          logo_url: course.logoUrl || ''
        },
        sprachid: 'd'
      }

      const FollowUpTile = customElements.get('kp-m-followup')
      if (!FollowUpTile) return

      const event = new FollowUpTile()
      event.setAttribute('class', 'course-event')
      event.setAttribute('data', JSON.stringify(courseData))
      containerDiv.appendChild(event)

      followUpSection.shadowRoot.querySelector('#followup-wrapper').style.display = 'block'
  }

  // @ts-ignore
  renderNoResult(apiMessage) {
    const body = this.shadowRoot?.querySelector('o-grid')?.shadowRoot?.querySelector('ks-o-body-section')?.shadowRoot
    const notificationSection = body?.querySelector('#booking-notification')
    const wrapper = body?.querySelector('.notification-wrapper')
    let errorMsg = 'Es gibt keinen Kurs mit dieser ID.<br>Bitte prüfen Sie Ihre Auswahl oder versuchen Sie es später erneut.'
    if (apiMessage) {
      try {
        const msgObj = JSON.parse(apiMessage)
        if (msgObj.errorMsg) errorMsg = msgObj.errorMsg
      } catch {}
    }
    if (wrapper) {
      const notification = /* html */`
        <kp-m-system-notification namespace="system-notification-error-" icon-name="AlertTriangle" icon-size="1.5em">
          <div slot="description">
            <p class="notification-title">Kein Kurs gefunden</p>
            <p class="notification-text">${errorMsg}</p>
          </div>
        </kp-m-system-notification>
      `
      wrapper.innerHTML = notification
      notificationSection.style.display = ''
      setTimeout(() => { 
        this.addNotificationCloseListener(notificationSection)
        this.scrollToNotification() 
      }, 100)
    }
  }

  renderLoading() {
    return /* html */`
      <div style="display: flex; justify-content: center; align-items: center; min-height: 200px;">
        <div style="text-align: center;">
          <div style="border: 4px solid #f3f3f3; border-top: 4px solid #0053A6; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
          <p>Kursdaten werden geladen...</p>
        </div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `
  }

  goToDashboard() {
    window.location.hash = '#/'
  }

  requestCourseConfirmation() {
    if (!this.currentCourseId || !this.currentCourseType) {
      console.error('CourseId or CourseType missing for confirmation request')
      return
    }

    this.dispatchEvent(new CustomEvent('request-send-message', {
      detail: {
        language: 'de',
        courseType: this.currentCourseType,
        courseId: parseInt(this.currentCourseId),
        mailNumber: 3,
        cancelReasonNumber: 0,
        cancelReasonText: ''
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  // @ts-ignore
  showRequestConfirmationNotification(status) {
    const body = this.shadowRoot?.querySelector('o-grid')?.shadowRoot?.querySelector('ks-o-body-section')?.shadowRoot
    const notificationSection = body?.querySelector('#booking-notification')
    const wrapper = body?.querySelector('.notification-wrapper')
    
    if (wrapper) {
      let iconName = 'Info'
      let namespace = 'system-notification-default-'
      let title = 'Kursbestätigung ist verfügbar'
      let message = 'Sie finden alle Dokumente zum Kurs auf der Kursdetailseite oder unter Dokumente.'
      
      if (status === 'success') {
        iconName = 'CheckCircle'
        namespace = 'system-notification-default-'
        title = 'Erfolgreich'
        message = 'Ihre Anfrage für eine Kursbestätigung wurde erfolgreich übermittelt.'
      } else if (status === 'error') {
        iconName = 'AlertTriangle'
        namespace = 'system-notification-error-'
        title = 'Fehler'
        message = 'Fehler beim Senden der Anfrage. Bitte versuchen Sie es später erneut.'
      }
      
      const notification = /* html */`
        <kp-m-system-notification 
          namespace="${namespace}" 
          icon-name="${iconName}" 
          icon-size="1.5em" 
          icon-plain 
          is-closeable>
          <div slot="description">
            <p class="notification-title">${title}</p>
            <p class="notification-text">${message}</p>
          </div>
        </kp-m-system-notification>
      `
      wrapper.innerHTML = notification
      notificationSection.style.display = 'block'
      setTimeout(() => { 
        this.addNotificationCloseListener(notificationSection)
        this.scrollToNotification() 
      }, 100)
    }
  }

  scrollToNotification() {
    const body = this.shadowRoot?.querySelector('o-grid')?.shadowRoot?.querySelector('ks-o-body-section')?.shadowRoot
    const notificationSection = body?.querySelector('#booking-notification')
    
    if (notificationSection) {
      const rect = notificationSection.getBoundingClientRect()
      const offsetTop = window.pageYOffset + rect.top - 20 // 20px Abstand vom oberen Rand
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
  }

  // @ts-ignore
  addNotificationCloseListener(notificationSection) {
    const systemNotification = notificationSection?.querySelector('kp-m-system-notification')
    if (systemNotification) {
      // @ts-ignore
      const handleNotificationClick = (event) => {
        const clickedElement = event.target
        if (systemNotification.shadowRoot) {
          const closeBtn = systemNotification.shadowRoot.querySelector('.close-btn')
          if (closeBtn && (clickedElement === closeBtn || closeBtn.contains(clickedElement))) {
            notificationSection.style.display = 'none'
            systemNotification.removeEventListener('click', handleNotificationClick)
          }
        }
      }
      systemNotification.addEventListener('click', handleNotificationClick)
      if (systemNotification.shadowRoot) {
        const closeBtn = systemNotification.shadowRoot.querySelector('.close-btn')
        if (closeBtn) closeBtn.addEventListener('click', () => { notificationSection.style.display = 'none' })
      }
    }
  }

  getCourseIdFromUrl() {
    const match = window.location.hash.match(/courseId=(\d+)/)
    return match ? match[1] : null
  }

  getCourseTypeFromUrl() {
    const match = window.location.hash.match(/coursetype=(\d+)/)
    return match ? match[1] : null
  }

  get discoverTiles () {
    return [
      {
        imageSrc: 'https://www.klubschule.ch/_campuslogo/logo-de.png',
        label: 'Klubschule Kurse',
        href: 'https://www.klubschule.ch/suche/'
      },
      {
        imageSrc: 'https://www.klubschule.ch/media/oz0je4nv/logo-pro-s-neu.png',
        label: 'Klubschule Pro Kurse',
        href: 'https://www.klubschule-pro.ch/suche/'
      },
      {
        imageSrc: 'https://www.klubschule.ch/_campuslogo/logoibaw_zone.png',
        label: 'IBAW Kurse',
        href: 'https://www.ibaw.ch/suche/'
      }
    ]
  }
}
