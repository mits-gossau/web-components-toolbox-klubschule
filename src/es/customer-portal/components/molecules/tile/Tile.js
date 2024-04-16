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
  /**
   * @param options
   * @param {any} args
   */
  constructor (options = {}, ...args) {
    super({ ...options }, ...args)
    this.courseData = null
    this.selectedSubscription = null
  }

  connectedCallback () {
    super.connectedCallback()
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
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
      this.html = this.renderTile(this.courseData, this.selectedSubscription)
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
                <div id="status-wrapper" class="icon-info">
                  <!-- !!! -->
                  <a-course-info namespace="course-info-default-" data-id="${courseId}" data-content="${escapeForHtml(JSON.stringify(content))}"></a-course-info>
                </div> 
                <div class="icon-info">
                  <a-icon-mdx icon-name="Location" size="1.5em" tabindex="0"></a-icon-mdx>
                  <span class="m-tile__content">${content.instructorDescription}</span>
                </div>
                <div class="icon-info location-room-info">
                  <a-icon-mdx icon-name="Location" size="1.5em" tabindex="0"></a-icon-mdx>
                  <div class="location-room">
                    <span class="m-tile__content">
                      ${content.courseLocation}
                    </span>
                    <span class="m-tile__content">
                      Raum: ${content.roomDescription}
                    </span>
                  </div>
                </div>
              </div>
            </div><!-- parent body END -->
            <div class="parent-footer">
              <div class="course-booking">
                <!-- !!! -->
                <m-course-dialog data-id="${courseId}" data-content="${escapeForHtml(JSON.stringify(content))}" data-subscription="${escapeForHtml(JSON.stringify(selectedSubscription))}"></m-course-dialog>
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

  // getTileState (data) {
  //   const type = courseAppointmentStatusMapping[data.courseAppointmentStatus]
  //   const { courseAppointmentFreeSeats } = data

  //   return {
  //     css: type.css,
  //     status: data.courseAppointmentStatus === 1 ? courseAppointmentFreeSeats * 1 : type.content.status,
  //     info: type.content.info,
  //     icon: type.content.icon
  //   }
  // }

  formatCourseAppointmentDate (date) {
    const dateObject = new Date(date)
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    // @ts-ignore
    const formatter = new Intl.DateTimeFormat('de-DE', options)
    return formatter.format(dateObject)
  }

  get currentTile () {
    return this.root.querySelector('m-load-template-tag').root.querySelector('div')
  }
}
