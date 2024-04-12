// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'
import { escapeForHtml } from '../../../helpers/Shared.js'
import { courseAppointmentStatusMapping, actionType } from '../../../helpers/mapping.js'

/* global CustomEvent */

/**
* @export
* @class CourseDialog
* @type {CustomElementConstructor}
*/
export default class CourseDialog extends Shadow() {
  /**
   * @param {any} args
   */
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this.courseData = null
    this.courseSubscription = null
    this.courseId = null
    this.courseDetail = null
  }

  connectedCallback () {
    this.courseData = JSON.parse(this.dataset.content)
    this.courseSubscription = JSON.parse(this.dataset.subscription)
    this.courseId = this.dataset.id
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', this.updateSubscriptionCourseAppointmentDetailListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
    document.body.addEventListener(this.getAttribute('request-show-dialog-booking') || 'request-show-dialog-booking', this.updateDialogBookingDetailListener)
    document.body.addEventListener(this.getAttribute('request-show-dialog-cancel') || 'request-show-dialog-cancel', this.updateDialogBookingCancelListener)
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML(this.courseId, this.courseData, this.courseSubscription)
  }

  /**
   *
   */
  disconnectedCallback () {
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', this.updateSubscriptionCourseAppointmentDetailListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
    document.body.removeEventListener(this.getAttribute('request-show-dialog-booking') || 'request-show-dialog-booking', this.updateDialogBookingDetailListener)
    document.body.removeEventListener(this.getAttribute('request-show-dialog-cancel') || 'request-show-dialog-cancel', this.updateDialogBookingCancelListener)
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

  // DETAIL
  updateSubscriptionCourseAppointmentDetailListener = event => {
    const type = event.detail.type
    if (this.dataset.id === event.detail.id) {
      event.detail.fetch.then(courseDetail => {
        this.courseDetail = courseDetail
        // open dialog
        this.dispatchEvent(new CustomEvent(`dialog-open-${this.dataset.id}`,
          {
            detail: {},
            bubbles: true,
            cancelable: true,
            composed: true
          }
        ))
        this.viewContent.innerHTML = ''
        let newTitle = ''
        debugger
        if (type === actionType.detail) {
          newTitle = 'Termindetails'
          this.viewContent.innerHTML = this.renderDialogContentDetails(this.courseData, this.courseDetail)
        }
        if (type === actionType.booking) {
          newTitle = 'Termin buchen'
          this.viewContent.innerHTML = this.renderDialogContentBooking(this.courseData, this.courseDetail)
        }
        if (type === actionType.cancel) {
          newTitle = 'Termin stornieren'
          this.viewContent.innerHTML = this.renderDialogContentCancel(this.courseData, this.courseDetail)
        }

        // update dialog title
        const title = this.dialog.shadowRoot.getElementById('title')
        title.innerHTML = newTitle
      })
    }
  }

  // BOOKING - SHOW FINAL STEP
  updateDialogBookingDetailListener = event => {
    if (this.dataset.id === event.detail.tags[0]) {
      this.viewContent.innerHTML = ''
      this.viewContent.innerHTML = this.renderDialogContentBooking(this.courseData, this.courseDetail)
    }
  }

  // BOOKED - SUCCESS
  updateSubscriptionCourseAppointmentBookingListener = event => {
    if (this.dataset.id === event.detail.id) {
      debugger
      event.detail.fetch.then(x => {
        this.viewContent.innerHTML = ''
        this.viewContent.innerHTML = this.renderDialogContentBookingSuccess(this.courseData, this.courseDetail)
        // const st = this.getTileState(x)
        // this.currentTile.classList.add(st.css.border)
      })
    }
  }

  // dialog success booking content view
  renderDialogContentBookingSuccess (data, detail = {}) {
    return /* html */`
      <style>
        .success-message{
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 1em;
        }
        .success {
          color:#00997F;
        }
      </style>
      <div class="success-message">
        <a-icon-mdx icon-name="CheckCircle" size="3em" tabindex="0" class="success"></a-icon-mdx>
        <ks-a-heading tag="h2" color="#00997F">Sie haben den Termin erfolgreich gebucht</ks-a-heading>
      </div>`
  }

  // CANCEL - SHOW FINAL STEP
  updateDialogBookingCancelListener = event => {
    if (this.dataset.id === event.detail.tags[0]) {
      this.viewContent.innerHTML = ''
      this.viewContent.innerHTML = this.renderDialogContentCancel(this.courseData, this.courseDetail)
    }
  }

  // cancel really
  renderDialogContentCancel (data, detail = {}) {
    return '<div><ks-a-heading tag="h2" style-as="h3" color="#F4001B">Hiermit stornieren sie diesen Termin</ks-a-heading></div>'
  }

  // CANCEL - SUCCESS
  updateSubscriptionCourseAppointmentReversalListener = event => {
    if (this.dataset.id === event.detail.id) {
      event.detail.fetch.then(x => {
        debugger
        this.viewContent.innerHTML = ''
        this.viewContent.innerHTML = this.renderDialogContentCancelSuccess(this.courseData, this.courseDetail)
      })
    }
  }

  // cancel success
  renderDialogContentCancelSuccess (data, detail = {}) {
    return /* html */`
      <div class="success-message">
        <a-icon-mdx icon-name="CheckCircle" size="3em" tabindex="0" class="success"></a-icon-mdx>
        <ks-a-heading tag="h2" color="#00997F">Sie haben den Termin erfolgreich storniert</ks-a-heading>
      </div>`
  }

  /**
   * evaluates if a render is necessary
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * evaluates if a render is necessary
   * @return {boolean}
   */
  shouldRenderHTML () {
    return !this.dialog
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host {}
      :host * .success-message{
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 1em;
        }
      @media only screen and (max-width: _max-width_) {
        :host {}
      }
    `
    return this.fetchTemplate()
  }

  /**
   * fetches the template
   */
  fetchTemplate () {
    /** @type {import("../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js").fetchCSSParams[]} */
    const styles = [
      {
        path: `${this.importMetaUrl}../../../../../es/components/web-components-toolbox/src/css/reset.css`, // no variables for this reason no namespace
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../../../../es/components/web-components-toolbox/src/css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: true
      }
    ]
    switch (this.getAttribute('namespace')) {
      case 'course-dialog-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles])
      default:
        return this.fetchCSS(styles)
    }
  }

  /**
   * Render HTML
   * @returns void
   */
  renderHTML (courseId, content, selectedSubscription) {
    this.html = /* html */`
    <m-dialog namespace="dialog-left-slide-in-" show-event-name="dialog-open-${courseId}">
        <div class="container dialog-header">
          <div id="back"></div>
          <h3 id="title"></h3>
          <div id="close">
            <a-icon-mdx icon-name="Plus" size="2em"></a-icon-mdx>
          </div>
        </div>
        <div class="container dialog-content">
          <p class="reset-link"></p>
          <div class="sub-content" >
            <h2>${content.courseTitle} (${content.courseType}_${content.courseId})</h2>
            <div id="view-content">${this.renderDialogContentDetails(content)}</div>
          </div>
        </div>
        <div class="container dialog-footer">
          <ks-a-button id="close" namespace="button-tertiary-" color="secondary">Close</ks-a-button>
          <a-dialog-status-button data-id="${courseId}" data-content="${escapeForHtml(JSON.stringify(content))}" data-subscription="${escapeForHtml(JSON.stringify(selectedSubscription))}"></a-dialog-status-button>
        </div>
        <a-tile-status-button id="show-modal" data-id="${courseId}" data-content="${escapeForHtml(JSON.stringify(content))}" data-subscription="${escapeForHtml(JSON.stringify(selectedSubscription))}"></a-status-button>  
      </m-dialog>
    `
  }

  // dialog default content view
  renderDialogContentDetails (data, detail = {}) {
    return /* html */ `
        <div id="content">
          <p id="description">${detail.courseDescription}</p>
        </div>`
  }

  // dialog final booking content view
  renderDialogContentBooking (data, detail = {}) {
    return /* html */ `
      <div id="content">
        <p>Status: ${detail.courseAppointmentFreeSeats} freie Plätze</p>
        <p>Preis: ${data.lessonPrice}</p>
      </div>`
  }

  get dialog () {
    return this.root.querySelector('m-dialog')
  }

  get viewContent () {
    return this.dialog.shadowRoot.getElementById('view-content')
  }
}
