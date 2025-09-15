// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'
import { CalendarHelper } from '../../../helpers/Calendar.js'

/**
 * @typedef {Object} Appointment
 * @property {string} appointmentDateFormatted
 * @property {string} appointmentCourseType
 * @property {string} appointmentCourseTitle
 * @property {boolean} participantEnrolled
 * @property {string} participantStatusText
 * @property {string} appointmentLocation
 * @property {string} roomDescription
 */

/**
 * @typedef {Object} AppointmentsOptions
 * @property {string} [importMetaUrl]
 */

/**
* @export
* @class Appointments
* @type {CustomElementConstructor}
*/
export default class Appointments extends Shadow() {
  /**
   * @param {AppointmentsOptions} [options={}]
   * @param {...any} args
   */
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    /** @type {Appointment[]} */
    this.appointments = []
    this.language = this.getAttribute('language') || CalendarHelper.getLanguage()
  }

  static get observedAttributes() { return ['appointments', 'show-all', 'language'] }

  /**
   * @param {string} name
   * @param {string | null} oldValue
   * @param {string | null} newValue
   */
  // @ts-ignore
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'language') {
      this.language = newValue
      this.renderHTML()
    }
    if (name === 'appointments') {
      try {
        this.appointments = newValue ? JSON.parse(newValue) : []
      } catch {
        this.appointments = []
      }
      this.renderHTML()
    }
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  shouldRenderHTML () {
    return !this.root.querySelector('#appointments')
  }

  renderCSS() {
    this.css = /* css */`
      :host .appointments-meta {
        display: flex;
        gap: 24px;
        margin-bottom: 24px;
      }
      :host .appointments-meta a {
        display: inline-flex;
        margin: 0;
        gap: 6px;
        font-weight: 500;
      }
      :host .appointments-accordion {
        width: calc(100% - 8px);
        border-collapse: collapse;
        background: #fff;
        font-size: 14px;
      }
      :host .appointment-item {
        background: #fff !important;
        border-bottom: 1px solid #000;
      }
      :host .appointment-header {
        font-size: 18px;
        font-weight: 500;
        display: flex; 
        align-items: center; 
        justify-content: space-between; 
        gap: 10px;
        cursor: pointer;
        padding: 16px 0;
      }
      :host .appointment-header-date-title {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      :host .appointment-header-date {
        min-width: 280px;
      }
      :host .appointment-header-title {
        font-weight: 400;
      }
      :host .appointment-status {
        padding-top: 16px;
      }
      :host .appointment-details {
        display: flex; 
        flex-wrap: wrap;
        gap: 16px; 
        padding: 16px 0 24px 0;
      }
      :host .appointment-details > div {
        width: calc(50% - 8px);
        box-sizing: border-box;
      }
      :host .appointment-details > div a-icon-mdx {
        display: inline-block;
        position: relative;
        top: 2px;
      }
      :host .spacing-24 {
        height: 24px;
      }
      :host .appointments-accordion > a {
        font-size: 18px;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
      }
      @media only screen and (max-width: _max-width_) {
        :host .appointments-meta {
          flex-direction: column;
        }
        :host .appointment-details > div {
          width: 100%;
        }
        :host .appointment-header-date-title {
          flex-direction: column;
          align-items: flex-start;
          gap: 0;
        }
        :host .appointment-header-title {
          margin-top: 10px;
        }
      }
    `

    return this.fetchTemplate()
  }

  fetchTemplate () {
    const styles = [
      {
        path: `${this.importMetaUrl}../../../../../es/components/web-components-toolbox/src/css/reset.css`,
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../../../../es/components/web-components-toolbox/src/css/style.css`,
        namespaceFallback: true
      }
    ]

    return this.fetchCSS(styles)
  }

  renderHTML() {
    if (!this.appointments || !Array.isArray(this.appointments) || this.appointments.length === 0) {
      this.html = ''
      return
    }

    const showAll = this._showAll || false
    const visibleAppointments = showAll ? this.appointments : this.appointments.slice(0, 5)
    const hasMore = this.appointments.length > 5

    this.html = ''
    this.html = /* html */`
      <div class="appointments-meta"><a href="${this.getICalAllLink()}" download="${this.getICalAllFilename()}"><a-icon-mdx icon-name="Calendar" size="1em" color="var(--color-secondary)"></a-icon-mdx> Alle Termine zu Kalender hinzufügen</a> <a href="#"><a-icon-mdx icon-name="UserX" size="1em" color="var(--color-secondary)"></a-icon-mdx> Abwesenheiten verwalten</a></div>
      <div class="appointments-accordion">
        ${visibleAppointments.map((appt, i) => /* html */`
          <div class="appointment-item">
            <div class="appointment-header" data-index="${i}">
              <span class="appointment-header-date-title" >
                <span class="appointment-header-date">${appt.appointmentDateFormatted}</span>
                ${appt.appointmentCourseType === 'E' && appt.appointmentCourseTitle !== '' ? /* html */`<span class="appointment-header-title">${appt.appointmentCourseTitle}</span>` : ''}
              </span>
              <a-icon-mdx icon-name="ChevronDown" size="1em"></a-icon-mdx>
            </div>
            <div class="appointment-body" style="display:none;">
              ${appt.participantEnrolled === false && appt.participantStatusText
                ? /* html */`<div class="appointment-status">${appt.participantStatusText || ''}. Sie können Ihre Abwesenheit jederzeit via “Abwesenheiten verwalten” anpassen.</div>`
                : ''}
              <div class="appointment-details">
                ${appt.appointmentLocation ? /* html */`<div><a-icon-mdx icon-name="Location" size="1em"></a-icon-mdx> ${appt.appointmentLocation || ''}</div>` : ''}
                <div><a href="${this.getICalLink(appt)}" download="${this.getICalFilename(appt)}"><a-icon-mdx icon-name="Calendar" size="1em" color="var(--color-secondary)"></a-icon-mdx> Termin zu Kalender hinzufügen</a></div>
                ${appt.roomDescription ? /* html */`<div><a-icon-mdx icon-name="Home" size="1em"></a-icon-mdx> Raum ${appt.roomDescription || ''}</div>` : ''}
                <div><a href="#"><a-icon-mdx icon-name="UserX" size="1em" color="var(--color-secondary)"></a-icon-mdx> Abwesenheiten verwalten</a></div>
              </div>
            </div>
          </div>
        `).join('')}
        ${hasMore ? /* html */`<div class="spacing-24"></div>` : ''}
        ${hasMore && !showAll ? /* html */`<a href="#" class="show-more-appointments-link">Alle Termine anzeigen <a-icon-mdx icon-name="ChevronDown" size="1em"></a-icon-mdx></a>` : ''}
        ${hasMore && showAll ? /* html */`<a href="#" class="hide-more-appointments-link">Termine ausblenden <a-icon-mdx icon-name="ChevronUp" size="1em"></a-icon-mdx></a>` : ''}
      </div>
    `

    /** @type {NodeListOf<HTMLElement>} */
    const headers = this.root.querySelectorAll('.appointment-header')
    headers.forEach(header => {
      header.onclick = () => {
        /** @type {string|null} */
        const idx = header.getAttribute('data-index')
        /** @type {NodeListOf<HTMLElement>} */
        const appointmentBodies = this.root.querySelectorAll('.appointment-body')
    
        appointmentBodies.forEach((body, i) => {
          body.style.display = (i == parseInt(idx || '0') && body.style.display !== 'block') ? 'block' : 'none'
        })
        /** @type {NodeListOf<HTMLElement>} */
        const icons = this.root.querySelectorAll('.appointment-header a-icon-mdx')
    
        icons.forEach((icon, i) => {
          /** @type {HTMLElement|null} */
          const correspondingHeader = headers[i]
          /** @type {Element|null} */
          const nextSibling = correspondingHeader?.nextElementSibling
          
          if (nextSibling && nextSibling instanceof HTMLElement) {
            const iconName = (i == parseInt(idx || '0') && nextSibling.style.display === 'block') ? 'ChevronUp' : 'ChevronDown'
            icon.setAttribute('icon-name', iconName)
          }
        })
      }
    })

    /** @type {HTMLElement|null} */
    const showAllLink = this.root.querySelector('.show-more-appointments-link')
    if (showAllLink) {
      showAllLink.onclick = e => {
        e.preventDefault()
        this._showAll = true
        this.renderHTML()
      }
    }
    /** @type {HTMLElement|null} */
    const hideAllLink = this.root.querySelector('.hide-more-appointments-link')
    if (hideAllLink) {
      hideAllLink.onclick = e => {
        e.preventDefault()
        this._showAll = false
        this.renderHTML()
      }
    }

    /** @type {HTMLElement|null} */
    const downloadAllLink = this.root.querySelector('a[href="#download-all-calendar"]')
    if (downloadAllLink) {
      downloadAllLink.addEventListener('click', (e) => {
        e.preventDefault()
        this.downloadAllCalendarEvents()
      })
    }

    // @ts-ignore
    this.root.querySelectorAll('a[href="#download-calendar"]').forEach(link => {
      // @ts-ignore
      link.addEventListener('click', (e) => {
        e.preventDefault()
        const apptIndex = link.closest('.appointment-item').querySelector('.appointment-header').dataset.index
        this.downloadCalendarEvent(this.appointments[apptIndex])
      })
    })
  }

  /**
   * Get the iCal link for a single appointment
   * @param {Appointment} appt - The appointment to get link for
   * @returns {string} The generated link
   */
  getICalLink(appt) {
    if (CalendarHelper.shouldUseWebcal()) {
      return CalendarHelper.getWebcalLink(appt, this.language)
    } else {
      return '#download-calendar'
    }
  }

  getICalAllLink() {
    if (!this.appointments || !Array.isArray(this.appointments) || this.appointments.length === 0) return '#'
    
    if (CalendarHelper.shouldUseWebcal()) {
      return CalendarHelper.getWebcalAllLink(this.appointments, this.language)
    } else {
      return '#download-all-calendar'
    }
  }

  /**
   * Downloads a single calendar event
   * @param {Appointment} appt - The appointment to download
   */
  downloadCalendarEvent(appt) {
    const icsContent = CalendarHelper.generateIcsContent(appt, this.language)
    const filename = CalendarHelper.generateFilename(appt, this.language)
    CalendarHelper.downloadBlobCalendar(icsContent, filename)
  }

  downloadAllCalendarEvents() {
    const icsContent = CalendarHelper.generateMultipleIcsContent(this.appointments, this.language)
    const filename = CalendarHelper.generateAllFilename(this.appointments, this.language)
    CalendarHelper.downloadBlobCalendar(icsContent, filename)
  }

  /**
   * Get the filename for a single iCal appointment
   * @param {Appointment} appt - The appointment to get filename for
   * @returns {string} The generated filename
   */
  getICalFilename(appt) {
    return CalendarHelper.generateFilename(appt, this.language)
  }

  getICalAllFilename() {
    return CalendarHelper.generateAllFilename(this.appointments, this.language)
  }

  set appointmentsData(val) {
    this.appointments = val || []
    this.renderHTML()
  }

  get appointmentsData() {
    return this.appointments
  }
}