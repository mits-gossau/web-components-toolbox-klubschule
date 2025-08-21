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

    this.requestBookingListener = this.createRequestListener(
      data => { this.bookingData = data || []; if (this.modulesLoaded) setTimeout(() => this.renderBooking(), 0) },
      error => { console.error('Error fetching bookings:', error); setTimeout(() => this.renderNoResult(), 0) }
    )

    this.requestFollowUpListener = this.createRequestListener(
      data => { this.followUpData = data || []; if (this.modulesLoaded) setTimeout(() => this.renderFollowUp(), 0) },
      error => { console.error('Error fetching followUp:', error); setTimeout(() => this.renderNoResult(), 0) }
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
    this.dispatchEvent(new CustomEvent('request-booking', { bubbles: true, cancelable: true, composed: true }))
  }

  disconnectedCallback () {
    document.body.removeEventListener('update-booking', this.requestBookingListener)
    document.body.removeEventListener('update-followup', this.requestFollowUpListener)
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
  }

  renderHTML () {
    this.fetchModules([
      {
        path: `${this.importMetaUrl}'../../../../kunden-portal/components/molecules/event/Event.js`,
        name: 'kp-m-event'
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
        path: `${this.importMetaUrl}../../components/molecules/tileBookingDetails/TileBookingDetails.js`,
        name: 'ks-m-tile-booking-details'
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
          <o-grid namespace="grid-2columns-content-section-" first-container-vertical first-column-with="66%" with-border width="100%" count-section-children="2" style="display:none;">
            <section>
              <!-- details -->
              <ks-o-body-section content-width-var="100%" no-margin-y background-color="white"> 
                <!-- notification -->
                <ks-m-system-notification id="booking-notification" namespace="system-notification-default-" icon-name="Info" icon-size="1.5em" icon-plain is-closeable>
                  <div slot="description">
                    <p class="notification-title">Kursbestätigung ist verfügbar</p>
                    <p class="notification-text">Sie finden alle Dokumente zum Kurs auf der Kursdetailseite oder unter Dokumente.</p>
                  </div>
                </ks-m-system-notification>
                <ks-a-spacing id="notification-spacing" type="l-flex"></ks-a-spacing>
                <!-- booking details -->
                <ks-m-tile-booking-details data="${this.bookingDetails}"></ks-m-tile-booking-details>
                <ks-a-spacing id="notification-spacing" type="m-flex"></ks-a-spacing>
                <div class="accordion">
                  <a href="#" class="show-accordion-content-link">Kurs Details anzeigen <a-icon-mdx icon-name="ChevronDown" size="1em"></a-icon-mdx></a>
                  <div id="offer-details" class="accordion-content" style="display:none;">
                    <h3><a-icon-mdx icon-url="../../../../../../../img/icons/event-list.svg" size="1em"></a-icon-mdx> <span>Angebotsdetails</span></h3>
                    <table></table>
                    <style>
                      :host .accordion a {
                        font-size: 18px;
                        font-weight: 500;
                        display: inline-flex;
                        align-items: center;
                      }
                      :host .accordion h3 {
                        display: flex;
                        gap: 10px;
                      }
                      :host .accordion-content {
                        margin-bottom: 24px !important;
                      }
                      :host .accordion-content table {
                        width: 100%;
                        border-collapse: collapse;
                        background: #fff;
                        border-bottom: 1px solid #000;
                        font-size: 14px;
                      }
                      :host .accordion-content tr {
                        background: #fff !important;
                        border-top: 1px solid #000;
                      }
                      :host .accordion-content td {
                        padding: 8px 0;
                        border: none;
                      }
                      :host .accordion-content td:first-child {
                        padding-right: 8px;
                      }
                      :host .accordion-content strong {
                        font-weight: 500;
                      }
                    </style>
                  </div>
                  <a href="#" class="hide-accordion-content-link" style="display:none;">Kurs Details ausblenden <a-icon-mdx icon-name="ChevronUp" size="1em"></a-icon-mdx></a>
                </div>
                <ks-a-spacing id="notification-spacing" type="l-flex"></ks-a-spacing>
                <h2 style="display:flex; gap:10px;"><a-icon-mdx icon-name="Calendar" size="1em"></a-icon-mdx> Kurs Termin(e)</h2>
                <ks-a-spacing id="notification-spacing" type="l-flex"></ks-a-spacing>
                <h2 style="display:flex; gap:10px;"><a-icon-mdx icon-name="FileText" size="1em"></a-icon-mdx> Dokumente</h2>
                <ks-a-spacing id="notification-spacing" type="l-flex"></ks-a-spacing>
              </ks-o-body-section>
              <!-- contact and options -->
              <aside></aside>
            </section>
          </o-grid>
          <ks-o-body-section content-width-var="100%" no-margin-y background-color="var(--mdx-sys-color-accent-6-subtle1)" has-background>
            <div id="continuation-course" style="width: var(--body-section-default-width, 86.666%);">
              <h2 style="display:flex; gap:10px;"><a-icon-mdx icon-name="AddToList" size="1em"></a-icon-mdx> Fortsetzungskurs</h2>
              <div class="container-followup container"></div>
            <div>
          </ks-o-body-section>
        </div>
      </div>
    `
  }

  renderBooking () {
    const body = this.shadowRoot?.querySelector('o-grid').shadowRoot.querySelector('ks-o-body-section').shadowRoot
    if (!this.bookingData) return

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
      details: [
        { label: 'Teilnehmerstatus', text: this.bookingData.course.bookingTypeText},
        { label: 'Nummer', text: this.bookingData.course.courseType + '_' + String(this.bookingData.course.courseId)},
        { label: 'Zeitraum', text: daysEntry},
        { label: 'Ort', text: this.bookingData.course.locationDescription},
        { label: 'Unterrichtssprache', text: this.bookingData.course.courseLanguage},
        { label: 'Max. Teilnehmer', text: this.bookingData.course.capacity},
        { label: 'Dauer', text: `${this.bookingData.course.numberOfAppointments} Kurstag(e)<br />Total ${this.bookingData.course.lessions} Lektion(en) zu ${this.bookingData.course.lessionDuration} Min.`},
      ]
    })
    const tile = body.querySelector('ks-m-tile-booking-details')
    if (tile) tile.setAttribute('data', this.bookingDetails)
    
    // request follow up course
    if (this.bookingData.course.courseIdFollowUp) {
      this.dispatchEvent(new CustomEvent('request-followup', { detail: { courseIdFollowUp: this.bookingData.course.courseIdFollowUp}, bubbles: true, cancelable: true, composed: true }))
    }

    // details (Angebotsdetails)
    const offerDetailsTable = body.querySelector('#offer-details table')
    if (offerDetailsTable && this.bookingDetails) {
      let details = JSON.parse(this.bookingDetails).details || []
      offerDetailsTable.innerHTML = details.map(d => `<tr><td><strong>${d.label}</strong></td><td>${d.text}</td></tr>`).join('')
    }

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

    // Accordions
    const accordions = body.querySelectorAll('.accordion')
    accordions.forEach(accordion => {
      const showLink = accordion.querySelector('.show-accordion-content-link')
      const hideLink = accordion.querySelector('.hide-accordion-content-link')
      const accordionContent = accordion.querySelector('.accordion-content')
      if (showLink && hideLink && accordionContent) {
        showLink.onclick = (e) => {
          e.preventDefault()
          accordionContent.style.display = ''
          showLink.style.display = 'none'
          hideLink.style.display = ''
        }
        hideLink.onclick = (e) => {
          e.preventDefault()
          accordionContent.style.display = 'none'
          showLink.style.display = ''
          hideLink.style.display = 'none'
        }
      }
    })
  }

  renderFollowUp () {
    if (!this.followUpData) return
    console.log('followUp data:', this.followUpData)

    const containerDiv = this.shadowRoot?.querySelector('ks-o-body-section')?.shadowRoot?.querySelector('.container-followup')
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
            link: `index.html#/booking?courseId=${course.courseId}`
          }],
          icons: [],
          state_of_booking: 'Reserviert',
          logo_url: course.logoUrl || ''
        },
        sprachid: 'd'
      }

      const FollowUpTile = customElements.get('kp-m-event')
      if (!FollowUpTile) return

      const event = new FollowUpTile()
      event.setAttribute('class', 'course-event')
      event.setAttribute('data', JSON.stringify(courseData))
      containerDiv.appendChild(event)
  }

  renderNoResult () {
    const container = this.shadowRoot?.querySelector('o-grid').shadowRoot.querySelector('ks-o-body-section').shadowRoot.querySelector('#booking-detail .container')
    console.log(container)
    if (container) {
      container.innerHTML = /* html */`
        <div class="booking-error" style="color: red; font-weight: bold; margin: 2rem 0;">
          Es gibt keinen Kurs mit dieser ID.<br>
          Bitte prüfen Sie Ihre Auswahl oder versuchen Sie es später erneut.
        </div>
      `
    }
  }
}
