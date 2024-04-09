// @ts-check
import Tile from '../../../../components/molecules/tile/Tile.js'
import { courseAppointmentStatusMapping, actionType } from '../../../helpers/mapping.js'

/**
 * @export
 * @class AppointmentTile
 * @type {CustomElementConstructor}
 */
export default class AppointmentTile extends Tile {
  /**
   * @param {any} args
   */
  constructor (options = {}, ...args) {
    super({ ...options }, ...args)
    this.dialog = null
    this.currentTile = null
    this.courseContent = null
    this.selectedSubscription = null
    this.tileActionButtonReplace = null
    this.tileActionButtonReplaceIcon = null
    this.actionType = actionType.detail
    this.viewContent = null
    this.courseDetail = null
  }

  connectedCallback () {
    super.connectedCallback()
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', this.updateSubscriptionCourseAppointmentDetailListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
    document.body.addEventListener(this.getAttribute('request-show-dialog-booking') || 'request-show-dialog-booking', this.updateDialogBookingDetailListener)
    document.body.addEventListener(this.getAttribute('request-show-dialog-cancel') || 'request-show-dialog-cancel', this.updateDialogBookingCancelListener)
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', this.updateSubscriptionCourseAppointmentDetailListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
    document.body.removeEventListener(this.getAttribute('request-show-dialog-booking') || 'request-show-dialog-booking', this.updateDialogBookingDetailListener)
    document.body.removeEventListener(this.getAttribute('request-show-dialog-cancel') || 'request-show-dialog-cancel', this.updateDialogBookingCancelListener)
  }

  updateDialogBookingDetailListener = event => {
    if (this.dataset.id === event.detail.tags[0]) {
      if (this.viewContent) {
        this.viewContent.innerHTML = this.renderDialogContentBooking(this.courseContent, this.courseDetail)
      }
    }
  }

  // CANCEL - SHOW FINAL
  updateDialogBookingCancelListener = event => {
    if (this.dataset.id === event.detail.tags[0]) {
      if (this.viewContent) {
        this.viewContent.innerHTML = this.renderDialogContentCancel(this.courseContent, this.courseDetail)
      }
    }
  }

  // DETAIL
  updateSubscriptionCourseAppointmentDetailListener = event => {
    this.actionType = event.detail.type
    event.detail.fetch.then(courseDetail => {
      console.log(courseDetail.courseId, this.dataset.id)
      if (this.dataset.id * 1 === courseDetail.courseId) {
        debugger
        this.dialog = this.root.querySelector('m-dialog')
        if (this.dialog) {
          this.courseDetail = courseDetail

          debugger

          this.viewContent = this.dialog.shadowRoot.getElementById('view-content')
          let newTitle = ''
          if (this.actionType === 'detail') {
            newTitle = 'Termindetails'
            this.viewContent.innerHTML = this.renderDialogContentDetails(this.courseContent, this.courseDetail)
          }
          if (this.actionType === 'booking') {
            newTitle = 'Termin buchen'
            this.viewContent.innerHTML = this.renderDialogContentBooking(this.courseContent, this.courseDetail)
          }
          if (this.actionType === 'cancel') {
            newTitle = 'Termin stornieren'
            this.viewContent.innerHTML = this.renderDialogContentCancel(this.courseContent, this.courseDetail)
          }

          // update dialog title
          const title = this.dialog.shadowRoot.getElementById('title')
          title.innerHTML = newTitle
        }
      }
    })
  }

  // BOOKED
  updateSubscriptionCourseAppointmentBookingListener = event => {
    event.detail.fetch.then(x => {
      if (this.dialog) {
        this.viewContent.innerHTML = this.renderDialogContentBookingSuccess(this.courseContent, this.courseDetail)
        debugger
        this.currentTile = this.root.querySelector('m-load-template-tag').root.querySelector('div')
        const st = this.getTileState(x)
        this.currentTile.classList.add(st.css.border)
      }
    })
  }

  // CANCEL
  updateSubscriptionCourseAppointmentReversalListener = event => {
    event.detail.fetch.then(x => {
      if (this.dialog) {
        console.log('reversal response: ', x)
        this.viewContent = this.dialog.shadowRoot.getElementById('view-content')
        this.viewContent.innerHTML = this.renderDialogContentCancelSuccess(this.courseContent, this.courseDetail)

        // TODO: Refactor
        const st = this.getTileState(x)
        const defaultClass = this.currentTile.classList[0]
        this.currentTile.classList.remove(...this.currentTile.classList)
        this.currentTile.classList.add(defaultClass)
        this.currentTile.classList.add(st.css.border)
      }
    })
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
      border:1px solid #F4001B;
    }
    :host .status-booked-out {
      border: 1px solid #F4001B;
    }
    :host .status-closed {
      border: 1px solid #F4001B;
    }
    :host .status-booked-cancellation-possible {
      border: 1px solid #00997F;
    }
    :host .status-booked-cancellation-not-possible {
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
    @media only screen and (max-width: _max-width_) {
      :host  {}
    }
    `
  }

  /**
   * fetches the template
   */
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

  /**
   * Render HTML
   * @returns Promise<void>
   */
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
      }
    ])
    Promise.all([fetchModules]).then((children) => {
      this.tileActionButtonReplace = children[0][1]
      this.tileActionButtonReplaceIcon = children[0][2]
      this.courseContent = Tile.parseAttribute(this.getAttribute('data'))
      this.selectedSubscription = Tile.parseAttribute(this.dataset.selectedSubscription)
      this.html = this.renderTile(this.courseContent, this.selectedSubscription)
    })
  }

  renderTile (content, selectedSubscription) {
    const tileStatus = this.getTileState(content)
    return /* html */ `
      <m-load-template-tag mode="false">
        <template>
          <div id="tile-wrapper" class="m-tile ${tileStatus.css.border}" data-course-id=${content.courseId}>
            <div class="parent-body">
              <div class="course-info">
                <div>
                  <span class="m-tile__title title"> <a-course-title data-id="${content.courseId}" data-content="${this.escapeForHtml(JSON.stringify(content))}" data-subscription="${this.escapeForHtml(JSON.stringify(selectedSubscription))}"></a-course-title></span>
                </div>
                <div>
                  <span class="m-tile__title date">${this.formatCourseAppointmentDate(content.courseAppointmentDate)}</span>
                </div> 
                <div>
                  <span class="m-tile__title date time">
                    ${content.courseAppointmentTimeFrom} - ${content.courseAppointmentTimeTo} 
                    <ks-a-button badge="" namespace="button-secondary-" color="tertiary">Blended</ks-a-button>
                  </span>
                </div>
              </div>
              <!-- --> 
              <div class="course-info">
                <div id="status-wrapper" class="icon-info">
                  <a-course-info data-id="${content.courseId}" data-content="${this.escapeForHtml(JSON.stringify(content))}"></a-course-info>
                </div> 
                <div class="icon-info">
                  <a-icon-mdx icon-name="Location" size="1.5em" tabindex="0"></a-icon-mdx>
                  <span class="m-tile__content">${content.instructorDescription}</span>
                </div>
                <div class="icon-info">
                  <a-icon-mdx icon-name="Location" size="1.5em" tabindex="0"></a-icon-mdx>
                  <span class="m-tile__content">
                    ${content.courseLocation}
                  </span>
                  <span class="m-tile__content">
                    Raum: ${content.roomDescription}
                  </span>
                </div>
              </div>
            </div><!-- parent body END -->
            <div class="parent-footer">
              <div class="course-booking">
                ${this.renderDialog(content, selectedSubscription)}
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

  getTileState (data) {
    const type = courseAppointmentStatusMapping[data.courseAppointmentStatus]
    const { courseAppointmentFreeSeats } = data

    return {
      css: type.css,
      status: data.courseAppointmentStatus === 1 ? courseAppointmentFreeSeats * 1 : type.content.status,
      info: type.content.info,
      icon: type.content.icon
    }
  }

  escapeForHtml = (htmlString) => {
    return htmlString
      .replaceAll(/&/g, '&amp;')
      .replaceAll(/</g, '&lt;')
      .replaceAll(/>/g, '&gt;')
      .replaceAll(/"/g, '&quot;')
      .replaceAll(/'/g, '&#39;')
  }

  renderDialog (content, selectedSubscription) {
    return /* html */ `
      <m-dialog namespace="dialog-left-slide-in-" show-event-name="dialog-open-${content.courseId}">
        <div class="container dialog-header">
          <div id="back"></div>
          <h3 id="title"></h3>
          <div id="close">
            <a-icon-mdx icon-name="Plus" size="2em"></a-icon-mdx>
          </div>
        </div>
        <div class="container dialog-content">
          <p class="reset-link"></p>
          <div class="sub-content" id="view-content">
            ${this.renderDialogContent(content)}
          </div>
        </div>
        <div class="container dialog-footer">
          <ks-a-button id="close" namespace="button-tertiary-" color="secondary">Close</ks-a-button>
          <a-dialog-status-button data-id="${content.courseId}" data-content="${this.escapeForHtml(JSON.stringify(content))}" data-subscription="${this.escapeForHtml(JSON.stringify(selectedSubscription))}"></a-dialog-status-button>
          <!--<ks-a-button id="btn-action" namespace="button-primary-"  request-event-name="request-subscription-course-appointment-booking" tag='[${this.escapeForHtml(JSON.stringify(content))},${this.escapeForHtml(JSON.stringify(selectedSubscription))}]'>Termin buchen</ks-a-button>
          <ks-a-button id="btn-action-cancel" color="quaternary" namespace="button-primary-"  request-event-name="request-subscription-course-appointment-booking" tag='[${this.escapeForHtml(JSON.stringify(content))},${this.escapeForHtml(JSON.stringify(selectedSubscription))}]'>Termin stornieren</ks-a-button>-->
        </div>
        <a-tile-status-button id="show-modal" data-id="${content.courseId}" data-content="${this.escapeForHtml(JSON.stringify(content))}" data-subscription="${this.escapeForHtml(JSON.stringify(selectedSubscription))}"></a-status-button>  
      </m-dialog>
      `
  }

  renderDialogContent (data) {
    return this.renderDialogContentDetails(data)
    // const expr = this.actionType
    // console.log('TYP', expr)
    // switch (expr) {
    //   case actionType.detail:
    //     return this.renderDialogContentDetails(data)
    //   case actionType.booking:
    //     return this.renderDialogContentBooking(data)
    //   case actionType.cancel:
    //     return this.renderDialogContentBookingSuccess(data)
    //   default:
    //     return this.renderDialogContentDetails(data)
    // }
  }

  // dialog default content view
  renderDialogContentDetails (data, detail = {}) {
    return `
      <div>
        <h2>${data.courseTitle} (${data.courseType}_${data.courseId})</h2>
        <div id="content">
          <p id="description">${detail.courseDescription}</p>
        </div>
      </div>
      `
  }

  // dialog final booking content view
  renderDialogContentBooking (data, detail = {}) {
    return `<div><h2>${data.courseTitle} (${data.courseType}_${data.courseId})</h2>
            <div id="content">
              <p id="description">Buchen?</p>
              <p>Preis: ${data.lessonPrice}</p>
            </div></div>`
  }

  // dialog success booking content view
  renderDialogContentBookingSuccess (data, detail = {}) {
    return '<div><h1>Sie haben den Termin erfolgreich gebucht</h1></div>'
  }

  // cancel really
  renderDialogContentCancel (data, detail = {}) {
    return 'cancel really?'
  }

  // cancel success
  renderDialogContentCancelSuccess (data, detail = {}) {
    return 'cancel successfully'
  }

  formatCourseAppointmentDate (date) {
    const dateObject = new Date(date)
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    // @ts-ignore
    const formatter = new Intl.DateTimeFormat('de-DE', options)
    const formattedDate = formatter.format(dateObject)
    return formattedDate
  }
}
