// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'
import { escapeForHtml } from '../../../helpers/Shared.js'
import { actionType, subscriptionMode } from '../../../helpers/Mapping.js'

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
    document.body.addEventListener(this.getAttribute('request-show-dialog-booking-confirmation') || 'request-show-dialog-booking-confirmation', this.requestShowDialogBookingConfirmationListener)
    document.body.addEventListener(this.getAttribute('request-show-dialog-reversal-confirmation') || 'request-show-dialog-reversal-confirmation', this.requestShowDialogReversalConfirmationListener)
    document.body.addEventListener(this.getAttribute(`dialog-close-${this.dataset.id}`) || `dialog-close-${this.dataset.id}`, this.dialogCloseListener)
  }

  /**
   *
   */
  disconnectedCallback () {
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', this.updateSubscriptionCourseAppointmentDetailListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
    document.body.removeEventListener(this.getAttribute('request-show-dialog-booking-confirmation') || 'request-show-dialog-booking-confirmation', this.requestShowDialogBookingConfirmationListener)
    document.body.removeEventListener(this.getAttribute('request-show-dialog-reversal-confirmation') || 'request-show-dialog-reversal-confirmation', this.requestShowDialogReversalConfirmationListener)
    document.body.removeEventListener(this.getAttribute(`dialog-close-${this.dataset.id}`) || `dialog-close-${this.dataset.id}`, this.dialogCloseListener)
  }

  /**
   * Dialog close button listener
   *
   */
  dialogCloseListener = () => {
    this.viewContent.innerHTML = ''
  }

  /**
   * Show course detail view
   *
   * @param {CustomEventInit} event
   */
  updateSubscriptionCourseAppointmentDetailListener = event => {
    if (this.dataset.id === event.detail.id) {
      this.viewContent.innerHTML = ''
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
        const { type } = event.detail
        if (type === actionType.detail) {
          this.renderDialogTitle('Termindetails')
          this.viewContent.innerHTML = this.renderDialogContentDetails(this.courseData, this.courseDetail)
        }
        if (type === actionType.booking) {
          this.renderDialogTitle('Termin buchen')
          this.viewContent.innerHTML = this.renderDialogContentBookingConfirmation(this.courseData, this.courseDetail)
        }
        if (type === actionType.reversal) {
          this.renderDialogTitle('Termin stornieren')
          this.viewContent.innerHTML = this.renderDialogContentReversal(this.courseData, this.courseDetail)
        }
      })
    }
  }

  /**
   * Show booking confirmation view
   *
   * @param {*} event
   */
  requestShowDialogBookingConfirmationListener = event => {
    if (this.dataset.id === event.detail.tags[0]) {
      this.renderDialogTitle('Termin buchen')
      this.viewContent.innerHTML = ''
      this.viewContent.innerHTML = this.renderDialogContentBookingConfirmation(this.courseData, this.courseDetail)
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
          align-items: flex-start;
          gap: 1em;
        }
        .success {
          color:#00997F;
        }
      </style>
      <div class="success-message">
        <a-icon-mdx icon-name="CheckCircle" size="3em" tabindex="0" class="success"></a-icon-mdx>
        <h2>Sie haben den Termin erfolgreich gebucht</h2>
      </div>
      <div>
        <h3>Downloads</h3>
        <div>${this.renderDownloads()}</div>
      </div>
      <div>
        ${this.renderNotification()}
      </div>
      `
  }

  // REVERSAL - SHOW FINAL STEP
  requestShowDialogReversalConfirmationListener = event => {
    if (this.dataset.id === event.detail.tags[0]) {
      this.renderDialogTitle('Termin stornieren')
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
    const fetchModules = this.fetchModules([
      {
        path: `${this.importMetaUrl}'../../../../../../components/molecules/linkList/LinkList.js`,
        name: 'ks-m-link-list'
      },
      {
        path: `${this.importMetaUrl}'../../../../../../components/molecules/systemNotification/SystemNotification.js`,
        name: 'ks-m-system-notification'
      }
    ])
    Promise.all([fetchModules]).then((_) => {
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
              <a-dialog-status-button namespace="dialog-status-button-default-" data-id="${courseId}" data-content="${escapeForHtml(JSON.stringify(content))}" data-subscription="${escapeForHtml(JSON.stringify(selectedSubscription))}"></a-dialog-status-button>
            </div>
            <a-tile-status-button id="show-modal" data-id="${courseId}" data-content="${escapeForHtml(JSON.stringify(content))}" data-subscription="${escapeForHtml(JSON.stringify(selectedSubscription))}"></a-tile-status-button>  
        </m-dialog>
        `
    })
  }

  // dialog default content view
  renderDialogContentDetails (data, detail = {}) {
    return /* html */ `
      <style>
        .price-info {
          display:flex;
        }
        .details {
          display:flex;
          flex-direction:column;
          gap:1em;
          margin-bottom:4em;
          padding-top:2em;
        }
        .detail {
          display:flex;
          flex-direction:column;
        }
        .detail span:first-child {
          font-weight: 500;
          line-height: 110%;
        } 
      </style>
      <div id="content">
        <div>
          <p class="description">${detail.courseDescription}</p>
        </div>
        <div class="details">
          ${this.renderPriceInfoContent(data, detail)}
          ${this.renderCourseDetailsContent(detail)}
        </div>
        <div>
          <h3>Downloads</h3>
          <div>${this.renderDownloads()}</div>
        </div>
      </div>`
  }

  renderPriceInfoContent (courseData, courseDetail) {
    return subscriptionMode[courseDetail.subscriptionMode] === subscriptionMode.WERTABO
      ? /* html */ `<div class="detail price-info"><span>${courseData.lessonPrice}</span><span> Termin wird über ihr Abonnement gebucht</span></div>`
      : ''
  }

  // dialog final booking content view
  renderDialogContentBookingConfirmation (data, detail = {}) {
    return /* html */ `
      <style>
        .details {
          display:flex;
          flex-direction:column;
          gap:1em;
          margin-bottom:4em;
          padding-top:2em;
        }
        .detail {
          display:flex;
          flex-direction:column;
        }
        .detail span:first-child {
          font-weight: 500;
          line-height: 110%;
        }
      </style>
      <div id="content">
        <div>
          <span>Termin wird über ihr Abonnement gebucht</span>
        </div>
        <div class="details">
          ${this.renderCourseDetailsContent(detail)}
          ${this.renderNotification()}
        </div>
      </div>
      `
  }

  renderDialogTitle (title) {
    const titleElement = this.dialog.shadowRoot.getElementById('title')
    titleElement.innerHTML = title
  }

  renderCourseDetailsContent (detail) {
    const state = detail.courseAppointmentStatus === 5 ? '<span>Gebucht</span>' : `<span>${detail.courseAppointmentFreeSeats} freie Plätze</span>`
    return /* html */ `
      <div class="detail"><span>Datum, Zeit</span><span>${detail.courseAppointmentDateFormatted}</span><span>${detail.courseAppointmentTimeFrom} - ${detail.courseAppointmentTimeTo}</span></div>
      <div class="detail"><span>Ort/Raum</span><span>${detail.courseLocation} / Raum ${detail.roomDescription}</span></div>
      <div class="detail"><span>Kursleitung</span><span>${detail.instructorDescription}</span></div>
      <div class="detail"><span>Status</span>${state}</div>
      <div class="detail"><span>Abonnement</span><span>${detail.subscriptionDescription}</span><span>Gültig bis ${detail.subscriptionValidTo} / Aktuelles Guthaben ${detail.subscriptionBalance}</span></div> 
    `
  }

  renderNotification () {
    return /* html */ `
      <ks-m-system-notification namespace="system-notification-default-" icon-name="AlertTriangle">
        <div slot="description">
          <p>Eine Stornierung ist nur bis zwei Stunden vor Terminbeginn möglich!</p>
        </div>
      </ks-m-system-notification>
    `
  }

  renderDownloads () {
    return /* html */ `
        <ks-m-link-list namespace="link-list-download-">
          <ul>
            <li>
              <a href="#">
                <span>Kursdetails als PDF</span>
                <div>
                  <span>PDF</span>
                  <a-icon-mdx namespace="icon-link-list-" icon-name="Download" size="1.5em" rotate="0" class="icon-right"></a-icon-mdx>
                </div>
              </a>
            </li>
            <li>
              <a href="#">
                <span>Termin in persönlichen Kalender</span>
                <div>
                  <span>ICS</span>
                  <a-icon-mdx namespace="icon-link-list-" icon-name="Download" size="1.5em" rotate="0" class="icon-right"></a-icon-mdx>
                </div>
              </a>
            </li>
          </ul>
        </ks-m-link-list>
        `
  }

  get dialog () {
    return this.root.querySelector('m-dialog')
  }

  get viewContent () {
    return this.dialog.shadowRoot.getElementById('view-content')
  }
}
