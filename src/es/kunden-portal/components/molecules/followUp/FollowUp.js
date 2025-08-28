// @ts-check
import Tile from '../../../../components/molecules/event/Event.js'

/**
 * @export
 * @class FollowUp
 * @type {CustomElementConstructor}
 */
export default class FollowUp extends Tile {
  constructor(options = {}, ...args) {
    super({ ...options }, ...args)
  }

  connectedCallback() {
    super.connectedCallback()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
  }

  renderCSS() {
    super.renderCSS()
    this.css += /* css */`
      :host .top {
        min-height: 48px;
      }
    `
  }

  renderHTML() {
    this.html = ''
    const dataAttr = this.getAttribute('data')
    if (!dataAttr || dataAttr === 'undefined') return

    let course
    try {
      const parsed = typeof dataAttr === 'string' ? JSON.parse(dataAttr) : dataAttr
      course = parsed.course
    } catch (e) {
      console.error('Invalid data for FollowUp:', dataAttr)
      return
    }
    if (!course) return

    const {
      kurs_typ,
      kurs_id,
      datum_label,
      days = [],
      location = {},
      status,
      status_label,
      buttons = [],
      icons = [],
      state_of_booking,
      logo_url
    } = course

    this.html = /* html */`
      <div class="event">
        <div class="top">
          <div class="state-of-booking"><span>${state_of_booking || ''}</span></div>
          <div class="logo">${logo_url ? this.getLogoHTML(logo_url) : ''}</div>
        </div>
        <div class="head">
          <div class="dates">
            <span class="date">${datum_label || ''}</span>
            <div class="time">
              <span class="days">${days.join(', ')}</span>
            </div>
          </div>
          <ul class="meta">
            ${status && status > 0 ? /* html */`
              <li>
                <div>
                  <a-icon-mdx icon-url="${this.setIconUrl(status)}" size="1.5em"></a-icon-mdx>
                </div>
                <span>${status_label || ''}</span>
              </li>
            ` : ''}
            ${location?.name ? /* html */`
              <li>
                <a-icon-mdx icon-name="Location" size="1.5em"></a-icon-mdx>
                <span>${location.name}</span>
              </li>
            ` : ''}
          </ul>
        </div>
        <div class="controls">
          <div class="controls-left">
            ${buttons.map(btn => /* html */`
              <ks-a-button
                href="${btn.link || '#'}"
                namespace="button-${btn.typ}-"
                color="${btn.typ}"
                data-event="${btn.event || ''}"
              >
                <span>${btn.text || ''}</span>
              </ks-a-button>
            `).join('')}
          </div>
        </div>
      </div>
    `
  }

  setIconUrl (data) {
    let iconName = ''
    if (data === 1) {
      iconName = 'garanteed'
    } else if (data === 2) {
      iconName = 'started'
    } else if (data === 3) {
      iconName = 'await'
    } else if (data === 4) {
      iconName = 'almost'
    }
    return `../../../../../../../img/icons/event-state-${iconName}.svg`
  }

  getLogoHTML(logoUrl) {
    return /* html */`<img src="${logoUrl}" height="auto" width="40" />`
  }
}
