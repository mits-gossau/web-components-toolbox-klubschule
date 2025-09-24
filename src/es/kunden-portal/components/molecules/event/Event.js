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
    const startBefore = courseStatus === 3 ? `Durchführung offen, definitiver Entscheid spätestens am ${formatDateForRender(new Date(start.getTime() - 7 * 24 * 60 * 60 * 1000))}` : ''
    const statusText = startBefore || courseStatusText
    return /* HTML */ `
      <style>
        :host .meta li:last-of-type {
          margin-top: 0;
        }
      </style>
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
                  <span>${statusText}</span>
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

  renderContinuationTile (data) {
    const {
      logoUrl,
      courseTitle,
      courseStatus,
      courseStatusText,
      courseLocation,
      courseId,
      courseType,
      courseStartDate,
      courseEndDate,
      bookingTypeText,
      coursePrice,
      currency,
      bookingType,
      courseFreeSeatFrom
    } = data
    const start = new Date(courseStartDate)
    const end = new Date(courseEndDate)
    const linkBooking = `#/booking?courseId=${courseId}&courseType=${courseType}`
    // TODO: 2688 is hardcoded - replace with real value from api (centerId)
    const linkCheckout = Environment.getEnvUrl() + `/kurs/kp--${courseType}_${courseId}_2668/Configuration`
    const reservationUntilDate = bookingType === 3 ? new Date(courseFreeSeatFrom) : null
    const bookingText = reservationUntilDate ? `${bookingTypeText} bis am ${formatDateForRender(reservationUntilDate)}` : bookingTypeText
    return /* HTML */`
      <div class="event">
        <div class="top">
          <div class="state-of-booking"><span>${bookingText}</span></div>
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
      iconName = 'cancel'
    } else if (data === 2) {
      iconName = 'garanteed'
    } else if (data === 3) {
      iconName = 'await'
    } else if (data === 4) {
      iconName = 'almost'
    } else if (data === 5) {
      // TODO: change this icon if weslam is ready
      // 5 = booked
      iconName = 'garanteed'
    }
    return `../../../../../../../img/icons/event-state-${iconName}.svg`
  }

  getLogoHTML (logoUrl) {
    return `<img src="${logoUrl}" height="auto" width="40" />`
  }
}
