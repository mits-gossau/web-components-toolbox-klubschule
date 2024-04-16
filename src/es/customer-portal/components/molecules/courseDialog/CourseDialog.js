// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'
import { escapeForHtml } from '../../../helpers/Shared.js'
import { actionType } from '../../../helpers/Mapping.js'

/* global CustomEvent */

/**
* @export
* @class CourseDialog
* @type {CustomElementConstructor}
*/
export default class CourseDialog extends Shadow() {
  /**
   * @param options
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
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML(this.courseId, this.courseData, this.courseSubscription)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', this.updateSubscriptionCourseAppointmentDetailListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
    document.body.addEventListener(this.getAttribute('request-show-dialog-booking') || 'request-show-dialog-booking', this.requestBookingDetailListener)
    document.body.addEventListener(this.getAttribute('request-show-dialog-reversal') || 'request-show-dialog-reversal', this.requestBookingReversalListener)
    document.body.addEventListener(this.getAttribute(`dialog-close-${this.dataset.id}`) || `dialog-close-${this.dataset.id}`, this.dialogCloseListener)
  }

  /**
   *
   */
  disconnectedCallback () {
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', this.updateSubscriptionCourseAppointmentDetailListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
    document.body.removeEventListener(this.getAttribute('request-show-dialog-booking') || 'request-show-dialog-booking', this.requestBookingDetailListener)
    document.body.removeEventListener(this.getAttribute('request-show-dialog-reversal') || 'request-show-dialog-reversal', this.requestBookingReversalListener)
    document.body.removeEventListener(this.getAttribute(`dialog-close-${this.dataset.id}`) || `dialog-close-${this.dataset.id}`, this.dialogCloseListener)
  }

  // dialog close button event listener
  dialogCloseListener = () => {
    this.viewContent.innerHTML = ''
  }

  // DETAIL
  updateSubscriptionCourseAppointmentDetailListener = event => {
    if (this.dataset.id === event.detail.id) {
      event.detail.fetch.then(courseDetail => {
        this.viewContent.innerHTML = ''
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
        let newTitle = ''
        const type = event.detail.type
        if (type === actionType.detail) {
          newTitle = 'Termindetails'
          this.viewContent.innerHTML = this.renderDialogContentDetails(this.courseData, this.courseDetail)
        }
        if (type === actionType.booking) {
          newTitle = 'Termin buchen'
          this.viewContent.innerHTML = this.renderDialogContentBooking(this.courseData, this.courseDetail)
        }
        if (type === actionType.reversal) {
          newTitle = 'Termin stornieren'
          this.viewContent.innerHTML = this.renderDialogContentReversal(this.courseData, this.courseDetail)
        }

        // update dialog title
        const title = this.dialog.shadowRoot.getElementById('title')
        title.innerHTML = newTitle
      })
    }
  }

  // BOOKING - SHOW FINAL STEP
  requestBookingDetailListener = event => {
    if (this.dataset.id === event.detail.tags[0]) {
      this.viewContent.innerHTML = ''
      this.viewContent.innerHTML = this.renderDialogContentBooking(this.courseData, this.courseDetail)
    }
  }

  // BOOKED - SUCCESS
  updateSubscriptionCourseAppointmentBookingListener = event => {
    if (this.dataset.id === event.detail.id) {
      event.detail.fetch.then(() => {
        this.viewContent.innerHTML = ''
        this.viewContent.innerHTML = this.renderDialogContentBookingSuccess(this.courseData, this.courseDetail)
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

  // REVERSAL - SHOW FINAL STEP
  requestBookingReversalListener = event => {
    if (this.dataset.id === event.detail.tags[0]) {
      this.viewContent.innerHTML = ''
      this.viewContent.innerHTML = this.renderDialogContentReversal(this.courseData, this.courseDetail)
    }
  }

  // reversal really
  renderDialogContentReversal (data, detail = {}) {
    return '<div><ks-a-heading tag="h2" style-as="h3" color="#F4001B">Hiermit stornieren sie diesen Termin</ks-a-heading></div>'
  }

  // REVERSAL - SUCCESS
  updateSubscriptionCourseAppointmentReversalListener = event => {
    if (this.dataset.id === event.detail.id) {
      event.detail.fetch.then(() => {
        this.viewContent.innerHTML = ''
        this.viewContent.innerHTML = this.renderDialogContentReversalSuccess(this.courseData, this.courseDetail)
      })
    }
  }

  // REVERSAL - SUCCESS - RENDER
  renderDialogContentReversalSuccess (data, detail = {}) {
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
        path: `${this.importMetaUrl}../../../../../es/components/web-components-toolbox/src/css/reset.css`,
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../../../../es/components/web-components-toolbox/src/css/style.css`,
        namespaceFallback: true
      }
    ]
    switch (this.getAttribute('namespace')) {
      case 'course-dialog-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`,
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
    this.html = /* html */ `
      <m-dialog namespace="dialog-left-slide-in-" show-event-name="dialog-open-${courseId}" close-event-name="dialog-close-${courseId}">
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
            <a-dialog-status-button data-id="${courseId}" data-content="${escapeForHtml(JSON.stringify(content))}" data-subscription="${escapeForHtml(JSON.stringify(selectedSubscription))}"></a-dialog-status-button>
          </div>
          <a-tile-status-button id="show-modal" data-id="${courseId}" data-content="${escapeForHtml(JSON.stringify(content))}" data-subscription="${escapeForHtml(JSON.stringify(selectedSubscription))}"></a-tile-status-button>  
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
