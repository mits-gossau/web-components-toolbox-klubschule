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
      :host .appointments-accordion a {
        font-size: 18px;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
      }
      @media only screen and (max-width: _max-width_) {
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
      <div class="appointments-accordion">
        ${visibleAppointments.map((appt, i) => /* html */`
          <div class="appointment-item">
            <div class="appointment-header" data-index="${i}">
              <span>${appt.appointmentDateFormatted}</span>
              <a-icon-mdx icon-name="${i === 0 ? 'ChevronUp' : 'ChevronDown'}" size="1em"></a-icon-mdx>
            </div>
            <div class="appointment-body" style="display:${i === 0 ? 'block' : 'none'};">
              ${appt.participantEnrolled === false && appt.participantStatusText
                ? /* html */`<div class="appointment-status">${appt.participantStatusText || ''}. Sie können Ihre Abwesenheit jederzeit via “Abwesenheiten verwalten” anpassen.</div>`
                : ''}
              <div class="appointment-details">
                <div><a-icon-mdx icon-name="Location" size="1em"></a-icon-mdx> ${appt.appointmentLocation || ''}</div>
                <div><a-icon-mdx icon-name="Calendar" size="1em"></a-icon-mdx> Termin zu Kalender hinzufügen</div>
                <div><a-icon-mdx icon-name="Home" size="1em"></a-icon-mdx> Raum ${appt.roomDescription || ''}</div>
                <div><a-icon-mdx icon-name="UserX" size="1em"></a-icon-mdx> Abwesenheiten verwalten</div>
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

  set appointmentsData(val) {
    this.appointments = val || []
    this.renderHTML()
  }

  get appointmentsData() {
    return this.appointments
  }
}