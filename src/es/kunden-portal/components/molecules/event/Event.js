// @ts-check
import Event from '../../../../components/molecules/event/Event.js'
import { formatDateForRender } from '../../../helpers/Shared.js'

/**
 * @export
 * @class EventTile
 * @type {CustomElementConstructor}
 */
export default class EventTile extends Event {
  constructor (options = {}, ...args) {
    super({ ...options }, ...args)
  }

  connectedCallback () {
    super.connectedCallback()
    this.eventData = Event.parseAttribute(this.getAttribute('data'))
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
    return Promise.all([]).then((_) => {
      switch (this.eventData.type) {
        case 'course':
          this.html = this.renderCourseTile(this.eventData.data)
          break
        case 'continuation':
          this.html = this.renderContinuationTile(this.eventData.data)
          break
        default:
          this.html = ''
      }
    })
  }

  renderCourseTile (data) {
    const { logoUrl, courseTitle, courseStatus, courseStatusText, courseLocation, courseId, courseType, courseStartDate, courseEndDate, bookingTypeText } = data
    const start = new Date(courseStartDate)
    const end = new Date(courseEndDate)
    const link = `#/booking?courseId=${courseId}&courseType=${courseType}`
    return /* HTML */`
      <m-load-template-tag mode="false">
        <template>
        <div class="event">
          <div class="top">
            <div class="state-of-booking"><span>${bookingTypeText}</span></div>
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
        </template> 
      </m-load-template-tag>
    `
  }

  renderContinuationTile (data) {
    const { logoUrl, courseTitle, courseStatus, courseStatusText, courseLocation, courseId, courseType, courseStartDate, courseEndDate, bookingTypeText, coursePrice, currency } = data
    const start = new Date(courseStartDate)
    const end = new Date(courseEndDate)
    const linkBooking = `#/booking?courseId=${courseId}&courseType=${courseType}`
    // TODO: Change linkCheckout when checkout page is ready
    const linkCheckout = `#/booking?courseId=${courseId}&courseType=${courseType}`
    return /* HTML */`
      <div class="event">
        <div class="top">
          <div class="state-of-booking"><span>${bookingTypeText}</span></div>
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
                href="${linkCheckout}" 
                namespace="button-primary-" 
                color="secondary"
            >
              <span>Jetzt buchen</span>
            </ks-a-button>
            <ks-a-button
               href="${linkBooking}" 
               namespace="button-secondary-" 
               color="secondary"
            >
              <span>Details ansehen</span>
            </ks-a-button>
          </div>
          <div class="controls-right">
            <span class="price"><strong>${parseFloat(coursePrice).toFixed(2)} ${currency}</strong></span>
          </div>
        </div>
      </div>
    `
  }

  setIconUrl (data) {
    let iconName = ''
    if (data === 1) {
      // TODO: This is wrong! Icon should be cancelled
      iconName = 'await'
    } else if (data === 2) {
      iconName = 'garanteed'
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
