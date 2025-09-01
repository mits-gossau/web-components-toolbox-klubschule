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
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.appointmentsData = []

    this.requestBookingListener = this.createRequestListener(
      data => { 
        if (!data || !data.course) {
          setTimeout(() => this.renderNoResult(data?.message), 0)
          return
        }
        this.followupRequested = false
        this.bookingData = data || {}
        // this.appointmentsData = (this.bookingData.course && Array.isArray(this.bookingData.course.appointments)) ? this.bookingData.course.appointments : []
        const course = this.bookingData.course || {}
        this.appointmentsData = Array.isArray(course.appointments) ? course.appointments.map(appt => ({ ...appt, appointmentCourseTitle: course.courseShortTitle || '' })) : []
        if (this.modulesLoaded) setTimeout(() => this.renderBooking(), 0) 
        // request followup
        if (this.bookingData?.course?.courseIdFollowUp && !this.followupRequested) {
          this.followupRequested = true
          this.dispatchEvent(new CustomEvent('request-followup', {
            detail: { courseIdFollowUp: this.bookingData.course.courseIdFollowUp },
            bubbles: true,
            cancelable: true,
            composed: true
          }))
        }
        // request document
        if (this.bookingData?.course.documentKey && this.bookingData?.course.documentType) {
          this.dispatchEvent(new CustomEvent('request-document', {
            detail: {
              courseType: this.bookingData.course.courseType,
              courseId: this.bookingData.course.courseId,
              documentKey: this.bookingData.course.documentKey,
              documentType: this.bookingData.course.documentType
            },
            bubbles: true,
            cancelable: true,
            composed: true
          }))
        }
      },
      error => { console.error('Error fetching bookings:', error); setTimeout(() => this.renderNoResult(), 0) }
    )

    this.requestFollowUpListener = this.createRequestListener(
      data => { this.followUpData = data || []; if (this.modulesLoaded) setTimeout(() => this.renderFollowUp(), 0) },
      error => { console.error('Error fetching followUp:', error); setTimeout(() => this.renderNoResult(), 0) }
    )

    this.requestDocumentListener = this.createRequestListener(
      data => {
        if (data instanceof Blob) {
          const url = URL.createObjectURL(data)
          this.documentData = [{ label: 'Rechnung', type: 'PDF', url }]
        } else {
          this.documentData = data || []
        }
        if (this.modulesLoaded) {
          const body = this.shadowRoot?.querySelector('o-grid')?.shadowRoot?.querySelector('ks-o-body-section')?.shadowRoot
          const documentsSection = body?.querySelector('#booking-documents')
          if (documentsSection) documentsSection.style.display = (this.documentData && this.documentData.length > 0) ? 'block' : 'none'
          const documents = body?.querySelector('kp-m-documents')
          if (documents) documents.setAttribute('documents', JSON.stringify(this.documentData))
        }
      },
      error => { console.error('Error fetching document:', error) }
    )
  }

  createRequestListener(onSuccess, onError) {
    return (event) => { event.detail.fetch.then(onSuccess).catch(onError)}
  }

  connectedCallback () {
    if (this.shouldRenderHTML()) this.renderHTML()
    if (this.shouldRenderCSS()) this.renderCSS()
    document.body.addEventListener('update-booking', this.requestBookingListener)
    document.body.addEventListener('update-followup', this.requestFollowUpListener)
    document.body.addEventListener('update-document', this.requestDocumentListener)
    window.addEventListener('hashchange', this.handleCourseIdChange)
    this.dispatchEvent(new CustomEvent('request-booking', { bubbles: true, cancelable: true, composed: true }))
  }

  disconnectedCallback () {
    document.body.removeEventListener('update-booking', this.requestBookingListener)
    document.body.removeEventListener('update-followup', this.requestFollowUpListener)
    document.body.removeEventListener('update-document', this.requestDocumentListener)
    window.removeEventListener('hashchange', this.handleCourseIdChange)
    if (this.followupObserver) { this.followupObserver.disconnect(); this.followupObserver = null }
  }

  handleCourseIdChange = () => {
    const courseId = this.getCourseIdFromUrl()
    if (courseId && courseId !== this.currentCourseId) {
      this.currentCourseId = courseId
      this.dispatchEvent(new CustomEvent('request-booking', {
        detail: { courseId },
        bubbles: true,
        cancelable: true,
        composed: true
      }))
    }
  }

  shouldRenderHTML () {
    return !this.root.querySelector('div#booking')
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  renderCSS () {
    this.css = /* css */`
      :host #detail-page {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
      }
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
        path: `${this.importMetaUrl}../../components/molecules/systemNotification/SystemNotification.js`,
        name: 'ks-m-system-notification'
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
    })

    this.html = ''
    this.html = /* html */`
      <div id="detail-page">
        <div id="top-stage" onclick="window.history.back()">
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
                  <h2 style="display:flex; gap:10px;"><a-icon-mdx icon-name="Calendar" size="1em"></a-icon-mdx> Kurs Termin(e)</h2>
                  <kp-m-appointments appointments='${JSON.stringify(this.appointmentsData)}'></kp-m-appointments>
                  <ks-a-spacing id="notification-spacing" type="l-flex"></ks-a-spacing>
                </section>
                <!-- documents -->
                <section id="booking-documents" style="display:none;">
                  <h2 style="display:flex; gap:10px;"><a-icon-mdx icon-name="FileText" size="1em"></a-icon-mdx> Dokumente</h2>
                  <kp-m-documents documents="${JSON.stringify(this.documentData)}"></kp-m-documents>
                </section>
              </ks-o-body-section>
              <!-- contact -->
              <aside></aside>
            </section>
          </o-grid>
          <!-- followup -->
          <ks-o-body-section content-width-var="100%" no-margin-y background-color="var(--mdx-sys-color-accent-6-subtle1)" has-background>
            <section style="width: var(--body-section-default-width, 86.666%); margin: 0 auto;">
              <div id="followup-wrapper" style="display:none;">
                <div id="continuation-course">
                  <h2 style="display:flex; gap:10px;"><a-icon-mdx icon-name="AddToList" size="1em"></a-icon-mdx> Fortsetzungskurs</h2>
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
                ${this.discoverTiles.map((tile, i) => /* html */`
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
    if (appointmentsSection) appointmentsSection.style.display = 'block'

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

    const course = this.followUpData.course
    if (!course) return

    const start = new Date(course.courseStartDate)
      const end = new Date(course.courseEndDate)
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
            link: `#/booking?courseId=${course.courseId}`
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
        <ks-m-system-notification namespace="system-notification-error-" icon-name="AlertTriangle" icon-size="1.5em">
          <div slot="description">
            <p class="notification-title">Kein Kurs gefunden</p>
            <p class="notification-text">${errorMsg}</p>
          </div>
        </ks-m-system-notification>
      `
      wrapper.innerHTML = notification
      notificationSection.style.display = ''
    }
  }

  getCourseIdFromUrl() {
    const match = window.location.hash.match(/courseId=(\d+)/)
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
