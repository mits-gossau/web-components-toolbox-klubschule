// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Appointments
* @type {CustomElementConstructor}
*/
export default class Appointments extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this.appointments = []
  }

  static get observedAttributes() { return ['appointments'] }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'appointments') {
      try {
        this.appointments = JSON.parse(newValue)
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
        cursor: pointer;
        padding: 16px 0;
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
              <span>${appt.appointmentDateFormatted}</span>
              <a-icon-mdx icon-name="${i === 0 ? 'ChevronUp' : 'ChevronDown'}" size="1em"></a-icon-mdx>
            </div>
            <div class="appointment-body" style="display:none;">
              ${appt.participantEnrolled === false && appt.participantStatusText
                ? /* html */`<div class="appointment-status">${appt.participantStatusText || ''}. Sie können Ihre Abwesenheit jederzeit via “Abwesenheiten verwalten” anpassen.</div>`
                : ''}
              <div class="appointment-details">
                <div><a-icon-mdx icon-name="Location" size="1em"></a-icon-mdx> ${appt.appointmentLocation || ''}</div>
                <div><a href="${this.getICalLink(appt)}" download="${this.getICalFilename(appt)}"><a-icon-mdx icon-name="Calendar" size="1em" color="var(--color-secondary)"></a-icon-mdx> Termin zu Kalender hinzufügen</a></div>
                <div><a-icon-mdx icon-name="Home" size="1em"></a-icon-mdx> Raum ${appt.roomDescription || ''}</div>
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

    const headers = this.root.querySelectorAll('.appointment-header')
    headers.forEach(header => {
      header.onclick = () => {
        const idx = header.getAttribute('data-index')
        this.root.querySelectorAll('.appointment-body').forEach((body, i) => {
          body.style.display = (i == idx && body.style.display !== 'block') ? 'block' : 'none'
        })
        this.root.querySelectorAll('.appointment-header a-icon-mdx').forEach((icon, i) => {
          icon.setAttribute('icon-name', (i == idx && headers[i].nextElementSibling.style.display === 'block') ? 'ChevronUp' : 'ChevronDown')
        })
      }
    })

    const showAllLink = this.root.querySelector('.show-more-appointments-link')
    if (showAllLink) {
      showAllLink.onclick = e => {
        e.preventDefault()
        this._showAll = true
        this.renderHTML()
      }
    }
    const hideAllLink = this.root.querySelector('.hide-more-appointments-link')
    if (hideAllLink) {
      hideAllLink.onclick = e => {
        e.preventDefault()
        this._showAll = false
        this.renderHTML()
      }
    }
  }

  getICalLink(appt) {
    // example "Sa, 31.05.2025 10:00 - 11:50"
    const match = appt.appointmentDateFormatted.match(/(\d{2}\.\d{2}\.\d{4}) (\d{2}:\d{2}) - (\d{2}:\d{2})/)
    if (!match) return '#'
    const [ , date, start, end ] = match
    // format for iCal: YYYYMMDDTHHMMSSZ (UTC)
    const [day, month, year] = date.split('.')
    const startDate = `${year}${month}${day}T${start.replace(':','')}00`
    const endDate = `${year}${month}${day}T${end.replace(':','')}00`
    const title = encodeURIComponent(appt.appointmentCourseTitle || 'Kurstermin')
    const location = encodeURIComponent(appt.appointmentLocation || '')
    const description = encodeURIComponent('Kurstermin')
    return `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
DTSTART:${startDate}
DTEND:${endDate}
LOCATION:${location}
DESCRIPTION:${description}
END:VEVENT
END:VCALENDAR`.replace(/\n/g, '\r\n')
  }

  getICalAllLink() {
    if (!this.appointments || !Array.isArray(this.appointments) || this.appointments.length === 0) return '#'
    const events = this.appointments.map(appt => {
      const match = appt.appointmentDateFormatted.match(/(\d{2}\.\d{2}\.\d{4}) (\d{2}:\d{2}) - (\d{2}:\d{2})/)
      if (!match) return ''
      const [ , date, start, end ] = match
      const [day, month, year] = date.split('.')
      const startDate = `${year}${month}${day}T${start.replace(':','')}00`
      const endDate = `${year}${month}${day}T${end.replace(':','')}00`
      const title = encodeURIComponent(appt.appointmentCourseTitle || 'Kurstermin')
      const location = encodeURIComponent(appt.appointmentLocation || '')
      const description = encodeURIComponent('Kurstermin')
      return `BEGIN:VEVENT
SUMMARY:${title}
DTSTART:${startDate}
DTEND:${endDate}
LOCATION:${location}
DESCRIPTION:${description}
END:VEVENT`
    }).join('\r\n')
    return `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
${events}
END:VCALENDAR`.replace(/\n/g, '\r\n')
  }

  getICalFilename(appt) {
    const match = appt.appointmentDateFormatted.match(/(\d{2})\.(\d{2})\.(\d{4})/)
    const date = match ? `${match[3]}-${match[2]}-${match[1]}` : 'termin'
    const title = (appt.appointmentCourseTitle || 'Kurstermin').replace(/[^a-z0-9]+/gi, '-')
    return `${date}_${title}.ics`
  }

  getICalAllFilename() {
    if (this.appointments && this.appointments.length > 0) {
      const title = (this.appointments[0].appointmentCourseTitle || 'termine').replace(/[^a-z0-9]+/gi, '-')
      return `${title}.ics`
    }
    return 'termine.ics'
  }

  set appointmentsData(val) {
    this.appointments = val || []
    this.renderHTML()
  }

  get appointmentsData() {
    return this.appointments
  }
}