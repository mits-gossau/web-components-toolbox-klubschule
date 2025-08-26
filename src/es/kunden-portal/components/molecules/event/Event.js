// @ts-check
import Tile from '../../../../components/molecules/event/Event.js'
import { formatDateForRender } from '../../../helpers/Shared.js'

/**
 * @export
 * @class EventTile
 * @type {CustomElementConstructor}
 */
export default class EventTile extends Tile {
  constructor (options = {}, ...args) {
    super({ ...options }, ...args)
  }

  connectedCallback () {
    super.connectedCallback()
  }

  disconnectedCallback () {
    super.disconnectedCallback()
  }

  renderCSS () {
    super.renderCSS()
    this.css += /* css */`
      :host .top {
        min-height: 48px;
      }
    `
  }

  renderHTML () {
    const { logoUrl, courseTitle, courseStatus, courseStatusText, courseLocation, courseId, courseStartDate, courseEndDate } = this.data.data
    const start = new Date(courseStartDate)
    const end = new Date(courseEndDate)
    const link = `index.html#/booking?courseId=${courseId}`
    this.html = /* HTML */`
      <div class="event">
        <div class="top">
          <div class="state-of-booking"><span>Gebucht</span></div>
          <div class="logo">${this.getLogoHTML(logoUrl)}</div>
        </div>
        <div class="head">
          <div class="dates">
            <span class="date">${courseTitle}</span>
            <div class="time">
              <span class="days">${formatDateForRender(start)} - ${formatDateForRender(end)}</span>
            </div>
          </div>
          <ul class="meta">
              <li>
                <div>
                  <a-icon-mdx namespace="icon-mdx-ks-" icon-url="${this.setIconUrl(courseStatus)}" size="1.5em"></a-icon-mdx>
                </div>
                <span>${courseStatusText}</span>
              </li>
              <li>
                <a-icon-mdx namespace="icon-mdx-ks-event-" icon-name="Location" size="1.5em"></a-icon-mdx>
                <span>${courseLocation}</span>
              </li>
          </ul>      
        </div>
        <div class="controls">
          <div class="controls-left">
            <ks-a-button
              href="${link}" 
              namespace="button-secondary-" 
              color="secondary"
            >
              <span>Details ansehen</span>
            </ks-a-button>
          </div>
        </div>
      </div>
    `
  }

  // renderHTML_old () {
  //   super.renderHTML().then((data) => {
  //   })
  // }

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

  getLogoHTML (logoUrl) {
    // TODO: Check inline style
    return `<img src="${logoUrl}" height="auto" width="40" />`
  }
}
