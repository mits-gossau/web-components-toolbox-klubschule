// @ts-check
import Tile from '../../../../components/molecules/tile/Tile.js'
import { courseAppointmentStatusMapping } from '../../../helpers/Mapping.js'
import { makeUniqueCourseId, escapeForHtml, getTileState } from '../../../helpers/Shared.js'

/**
 * @export
 * @class AppointmentTile
 * @type {CustomElementConstructor}
 */
export default class AppointmentTile extends Tile {
  constructor (options = {}, ...args) {
    super({ ...options }, ...args)
    this.courseData = null
    this.selectedSubscription = null
  }

  connectedCallback () {
    super.connectedCallback()
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
    this.addEventListener('no-scroll', this.noScrollEventListener)
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
    this.removeEventListener('no-scroll', this.noScrollEventListener)
  }

  // BOOKED - SUCCESS
  updateSubscriptionCourseAppointmentBookingListener = event => {
    if (this.dataset.id === event.detail.id) {
      event.detail.fetch.then(data => {
        const tileState = getTileState(courseAppointmentStatusMapping[data.courseAppointmentStatus], data)
        this.currentTile.classList.add(tileState.css.border)
      })
    }
  }

  // REVERSAL - SUCCESS
  updateSubscriptionCourseAppointmentReversalListener = event => {
    if (this.dataset.id === event.detail.id) {
      event.detail.fetch.then(data => {
        const tileState = getTileState(courseAppointmentStatusMapping[data.courseAppointmentStatus], data)
        const defaultClass = this.currentTile.classList[0]
        this.currentTile.classList.remove(...this.currentTile.classList)
        this.currentTile.classList.add(defaultClass)
        this.currentTile.classList.add(tileState.css.border)
        this.dataset.removable = null
      })
    }
  }

  /**
   * renders the css
   */
  renderCSS () {
    super.renderCSS()
    this.css = /* css */`
      :host {}
      :host > div {
        display:flex;
        flex-direction: column;
      }
      :host .parent-body, .parent-footer {
        display:flex;
        padding:1.5em;
      }
      :host .parent-footer {
        align-items: center;
      }
      :host .course-info, .course-booking {
        flex-basis: 50%;
      }
      :host .subscription-info {
        display:flex;
        flex-direction: column;
      }
      :host .course-admin, .course-price {
        flex-grow: 1;
        flex-shrink: 1;
      }
      :host .course-info {
        display:flex;
        flex-direction:column;
      }
      :host .course-execution-info{
        gap:0.5em;
      }
      :host .course-price {
        text-align:right;
      }
      :host .title {
        color:var(--title-color);
      }
      :host .date, .time {
        font-weight:400;
      }
      :host .time {
        display:flex;
        gap:0.5em;
        align-items: center;
      }
      :host .vacancies {
        display:flex;
        padding-bottom:0.75em;
      }
      :host .body, .footer {
        display: grid;
        grid-template-columns: 50% 50%;
        grid-template-rows: auto auto auto;
        align-items: center;
        padding:1.5em 1.5em 0.75em 1.5em;
        gap:0.25em;
      }
      :host .info {
        display:flex;
        align-items:center;
      }
      :host .location-room {
        display:flex;
        flex-direction:column;
      }
      :host .icon-info {
        display:flex;
        align-items: center;
      }
      :host m-load-template-tag {
          min-height:16em;
          display:block;
      }
      :host .sub-content {
        padding-top:1.5em;
      }
      :host .status-not-bookable {
        border: 1px solid #F4001B;
      }
      :host .status-booked-out {
        border: 1px solid #F4001B;
      }
      :host .status-closed {
        border: 1px solid #F4001B;
      }
      :host .status-booked-reversal-possible {
        border: 1px solid #00997F;
      }
      :host .status-booked-reversal-not-possible {
        border: 1px solid #00997F;
      }
      :host .success {
        color:#00997F;
      }
      :host .alert {
        color:#F4001B;
      }
      :host .hide-dialog-action-btn{
        display:none;
      }
      :host .location-room-info {
        align-items: stretch;
      }
      :host .location-room {
        display:flex;
      }
      :host .meta {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      :host .meta li {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      :host .meta li + li {
        margin-top: 1rem;
      }
      :host .meta li:last-of-type {
        align-items: flex-start;
      }
      :host .meta span {
        font-size: 1rem;
        line-height: 1.25rem;
        margin-left: 0.75rem;
      }
      @media only screen and (max-width: _max-width_) {
        :host  {}
      }
    `
  }

  fetchTemplate () {
    switch (this.getAttribute('namespace')) {
      case 'tile-course-appointment-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}../../../../es/components/molecules/tile/default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false,
          replaces: [{
            pattern: '--tile-default-',
            flags: 'g',
            replacement: '--tile-course-appointment-'
          }]
        }, {
          path: `${this.importMetaUrl}../../../../es/customer-portal/components/molecules/tile/course-appointment-/course-appointment-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }], false)
      case 'tile-subscriptions-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}../../../../es/components/molecules/tile/default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false,
          replaces: [{
            pattern: '--tile-default-',
            flags: 'g',
            replacement: '--tile-subscriptions-'
          }]
        }, {
          path: `${this.importMetaUrl}../../../../es/customer-portal/components/molecules/tile/course-appointment-/course-appointment-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }], false)
      default:
        return this.fetchCSS()
    }
  }

  renderHTML () {
    const fetchModules = this.fetchModules([
      {
        path: `${this.importMetaUrl}'../../../../../../es/components/web-components-toolbox/src/es/components/molecules/loadTemplateTag/LoadTemplateTag.js`,
        name: 'm-load-template-tag'
      },
      {
        path: `${this.importMetaUrl}'../../../../../../es/components/atoms/button/Button.js`,
        name: 'ks-a-button'
      },
      {
        path: `${this.importMetaUrl}'../../../../../../es/components/web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      },
      {
        path: `${this.importMetaUrl}'../../../../../../es/components/web-components-toolbox/src/es/components/molecules/dialog/Dialog.js`,
        name: 'm-dialog'
      },
      {
        path: `${this.importMetaUrl}'../../../../../../es/customer-portal/components/atoms/tileStatusButton/TileStatusButton.js`,
        name: 'a-tile-status-button'
      },
      {
        path: `${this.importMetaUrl}'../../../../../../es/customer-portal/components/atoms/dialogStatusButton/DialogStatusButton.js`,
        name: 'a-dialog-status-button'
      },
      {
        path: `${this.importMetaUrl}'../../../../../../es/customer-portal/components/atoms/courseInfo/CourseInfo.js`,
        name: 'a-course-info'
      },
      {
        path: `${this.importMetaUrl}'../../../../../../es/customer-portal/components/atoms/courseTitle/CourseTitle.js`,
        name: 'a-course-title'
      },
      {
        path: `${this.importMetaUrl}'../../../../../../es/components/atoms/heading/Heading.js`,
        name: 'ks-a-heading'
      },
      {
        path: `${this.importMetaUrl}'../../../../../../es/customer-portal/components/molecules/courseDialog/CourseDialog.js`,
        name: 'm-course-dialog'
      }
    ])
    Promise.all([fetchModules]).then((_) => {
      this.courseData = Tile.parseAttribute(this.getAttribute('data'))
      this.selectedSubscription = Tile.parseAttribute(this.dataset.selectedSubscription)
      if (this.dataset.listType === 'subscriptions') {
        this.html = this.renderSubscription(this.courseData)
      } else {
        this.html = this.renderTile(this.courseData, this.selectedSubscription)
      }
    })
  }

  renderTile (content, selectedSubscription) {
    const tileState = getTileState(courseAppointmentStatusMapping[content.courseAppointmentStatus], content)
    const courseId = makeUniqueCourseId(content)
    return /* html */ `
      <m-load-template-tag mode="false">
        <template>
          <div id="tile-wrapper" class="m-tile ${tileState.css.border}" data-course-id=${courseId}>
            <div class="parent-body">
              <div class="course-info">
                <div>
                  <span class="m-tile__title title">
                    <a-course-title namespace="course-title-default-" data-id="${courseId}" data-content="${escapeForHtml(JSON.stringify(content))}" data-subscription="${escapeForHtml(JSON.stringify(selectedSubscription))}"></a-course-title>
                  </span>
                </div>
                <div>
                  <span class="m-tile__title date">${this.formatCourseAppointmentDate(content.courseAppointmentDate)}</span>
                </div> 
                <div>
                  <span class="m-tile__title date time">
                    ${content.courseAppointmentTimeFrom} - ${content.courseAppointmentTimeTo} 
                    <!--<ks-a-button badge="" namespace="button-secondary-" color="tertiary">Blended</ks-a-button>-->
                  </span>
                </div>
              </div>
              <!-- --> 
              <div class="course-info course-execution-info">
                <ul class="meta">
                  <li>
                    <a-course-info namespace="course-info-default-" data-id="${courseId}" data-content="${escapeForHtml(JSON.stringify(content))}"></a-course-info>
                  </li>
                  <li> 
                    <a-icon-mdx icon-name="User" size="1.5em" tabindex="0"></a-icon-mdx>
                    <span>${content.instructorDescription}</span>
                  </li>
                  <li>
                    <a-icon-mdx icon-name="Location" size="1.5em" tabindex="0"></a-icon-mdx>
                    <div class="location-room">
                      <span>${content.courseLocation}</span>
                      <span>Raum: ${content.roomDescription}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div><!-- parent body END -->
            <div class="parent-footer">
              <div class="course-booking">
                <!-- !!! -->
                <m-course-dialog namespace="course-dialog-default-" data-id="${courseId}" data-content="${escapeForHtml(JSON.stringify(content))}" data-subscription="${escapeForHtml(JSON.stringify(selectedSubscription))}"></m-course-dialog>
              </div>
              <div class="course-price">
                <span class="m-tile__title">
                  ${content.lessonPrice}
                </span>
              </div>
            </div><!-- parent footer END -->
          </div>
        </template>
      </m-load-template-tag>
    `
  }

  renderSubscription (subscription) {
    const tileState = getTileState(courseAppointmentStatusMapping[1], subscription)
    const courseId = `${subscription.subscriptionId}_${subscription.subscriptionKindId}`
    const from = this.formatSubscriptionAppointmentDate(subscription.subscriptionValidFrom)
    const to = this.formatSubscriptionAppointmentDate(subscription.subscriptionValidTo)
    return /* html */ `
    <m-load-template-tag mode="false">
      <template>
        <div id="tile-wrapper" class="m-tile ${tileState.css.border}" data-course-id=${courseId}>
              <div class="parent-body">
                <div class="subscription-info">
                  <div>
                    <span class="m-tile__title title">
                      <a-course-title request-detail="request-subscription-detail" data-list-type="subscriptions" namespace="course-title-default-" data-id="${courseId}" data-content="${escapeForHtml(JSON.stringify(subscription))}" data-subscription="${escapeForHtml(JSON.stringify(subscription))}"></a-course-title>
                    </span>
                  </div>
                  <div>
                    <span class="m-tile__title date">Gültigkeitsdauer ${from} - ${to} </span>
                  </div> 
                </div>
                <!-- --> 
              </div><!-- parent body END -->
              <div class="parent-footer">
                <div class="course-booking">
                  <!-- !!! -->
                  <m-course-dialog data-list-type="subscriptions" namespace="course-dialog-default-" data-id="${courseId}" data-content="${escapeForHtml(JSON.stringify(subscription))}" data-subscription="${escapeForHtml(JSON.stringify(subscription))}"></m-course-dialog>
                </div>
              </div><!-- parent footer END -->
            </div>
          </template>
        </m-load-template-tag> 
    `
  }

  /**
   * Formats a given (string) date into a specific format with weekday,
   * day, month, and year.
   * @param date - `date`
   * @returns Returns the formatted date string.
   */
  formatCourseAppointmentDate (date) {
    const dateObject = new Date(date)
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    // @ts-ignore
    // TODO: locale!
    const formatter = new Intl.DateTimeFormat('de-DE', options)
    return formatter.format(dateObject)
  }

  formatSubscriptionAppointmentDate (dateString) {
    const dateObject = new Date(dateString)
    const options = { month: '2-digit', day: '2-digit', year: 'numeric' }
    // @ts-ignore
    // TODO: locale!
    const formatter = new Intl.DateTimeFormat('de-DE', options)
    return formatter.format(dateObject)
  }

  noScrollEventListener (event) {
    if ((!event.detail?.hasNoScroll) && (this.dataset?.listType === 'booked-appointments' && this.dataset?.removable)) {
      this.style.display = 'none'
      if (this.previousElementSibling.tagName === 'KS-A-HEADING' && (this.nextElementSibling === null || this.nextElementSibling.tagName === 'KS-A-HEADING')) {
        this.previousElementSibling.style.display = 'none'
      }
    }
  }

  get currentTile () {
    return this.root.querySelector('m-load-template-tag').root.querySelector('div')
  }

  get templateTag () {
    return this.root.querySelector('m-load-template-tag')
  }

  get currentCourseDialog () {
    return this.root.querySelector('m-course-dialog')
  }
}
