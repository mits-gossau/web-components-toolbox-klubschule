// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'
import { escapeForHtml, getTileState } from '../../../helpers/Shared.js'
import { actionType, subscriptionMode, courseAppointmentStatusMapping } from '../../../helpers/Mapping.js'

/* global CustomEvent */
/* global self */

/**
* @export
* @class CourseDialog
* @type {CustomElementConstructor}
*/
export default class CourseDialog extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this.courseData = null
    this.courseDetail = null
    this.courseId = null
    this.courseSubscription = null
  }

  connectedCallback () {
    this.courseData = JSON.parse(this.dataset.content)
    this.courseId = this.dataset.id
    this.courseSubscription = JSON.parse(this.dataset.subscription)
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML(this.courseId, this.courseData, this.courseSubscription)
    document.body.addEventListener(this.getAttribute('request-show-dialog-booking-confirmation') || 'request-show-dialog-booking-confirmation', this.requestShowDialogBookingConfirmationListener)
    document.body.addEventListener(this.getAttribute('request-show-dialog-reversal-confirmation') || 'request-show-dialog-reversal-confirmation', this.requestShowDialogReversalConfirmationListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', this.updateSubscriptionCourseAppointmentDetailListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
    document.body.addEventListener(this.getAttribute(`dialog-close-${this.dataset.id}`) || `dialog-close-${this.dataset.id}`, this.dialogCloseListener)
  }

  disconnectedCallback () {
    document.body.removeEventListener(this.getAttribute('request-show-dialog-booking-confirmation') || 'request-show-dialog-booking-confirmation', this.requestShowDialogBookingConfirmationListener)
    document.body.removeEventListener(this.getAttribute('request-show-dialog-reversal-confirmation') || 'request-show-dialog-reversal-confirmation', this.requestShowDialogReversalConfirmationListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', this.updateSubscriptionCourseAppointmentDetailListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
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
   * SHOW course detail
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
          this.viewContent.innerHTML = this.renderDialogContentReversalConfirmation(this.courseData, this.courseDetail)
        }
      })
    }
  }

  /**
   * RENDER course detail
   * @param {*} data
   * @param {*} detail
   * @returns
   */
  renderDialogContentDetails (data, detail = {}) {
    return /* html */ `
      <style>
        .price-info {
          display: flex;
        }
        .details {
          display: flex;
          flex-direction: column;
          gap: 1.5em;
          margin-bottom: 4em;
        }
        .detail {
          display: flex;
          flex-direction: column;
        }
        .detail > span:first-child {
          font-weight: 500;
          line-height: 110%;
        }
        .success {
          color: var(--success-color, #00997F);
        }
        .alert {
          color: var(--alert-color, #F4001B);
        }
        .description {
          margin-bottom: 4rem !important;
        }
        .downloads {
          margin-bottom: 1.5em;
        }
      </style>
      <div id="content">
        <div>
          <p class="description">${detail.courseDescription}</p>
        </div>
        <div class="details">
          ${this.renderPriceInfoContent(data, detail)}
          ${this.courseDetailsContent(detail)}
        </div>
        <div>
          <h3>Downloads</h3>
          <div class="downloads">
            ${this.renderDownloads(data, detail)}
          </div>
        </div>
      </div>
    `
  }

  /**
   * SHOW booking confirmation
   * @param {CustomEventInit} event
   */
  requestShowDialogBookingConfirmationListener = event => {
    if (this.dataset.id === event.detail.tags[0]) {
      this.renderDialogTitle('Termin buchen')
      this.viewContent.innerHTML = ''
      this.viewContent.innerHTML = this.renderDialogContentBookingConfirmation(this.courseData, this.courseDetail)
    }
  }

  /**
   * RENDER booking confirmation
   * @param {*} data
   * @param {*} detail
   * @returns
   */
  renderDialogContentBookingConfirmation (data, detail = {}) {
    return /* html */ `
      <style>
        .details {
          display: flex;
          flex-direction: column;
          gap: 1.5em;
          padding-top: 2em;
        }
        .detail {
          display: flex;
          flex-direction: column;
        }
        .detail > span:first-child {
          font-weight: 500;
          line-height: 110%;
        }
      </style>
      <div id="content">
        <div>
          <span>Termin wird über ihr Abonnement gebucht</span>
        </div>
        <div class="details">
          ${this.courseDetailsContent(detail)}
          <div>
            ${this.renderNotification()}
          </div> 
        </div>
      </div>
    `
  }

  /**
   * SHOW booking success
   * @param {CustomEventInit} event
   */
  updateSubscriptionCourseAppointmentBookingListener = event => {
    if (this.dataset.id === event.detail.id) {
      event.detail.fetch.then(() => {
        this.viewContent.innerHTML = ''
        this.viewContent.innerHTML = this.renderDialogContentBookingSuccess(this.courseData, this.courseDetail)
      })
    }
  }

  /**
   * RENDER booking success
   * @param {*} data
   * @param {*} detail
   * @returns
   */
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
          color: #00997F;
        }
        h2.success {
          color: #00997F !important;
        }
        .downloads {
          margin: 4em 0 1.5em 0;
        }
      </style>
      <div class="success-message">
        <a-icon-mdx icon-name="CheckCircle" size="3em" tabindex="0" class="success"></a-icon-mdx>
        <h2 class="success">Sie haben den Termin erfolgreich gebucht</h2>
      </div>
      <div class="downloads">
        <h3>Downloads</h3>
        <div>${this.renderDownloads(data, detail)}</div>
      </div>
      <div>
        ${this.renderNotification()}
      </div>
    `
  }

  /**
   * SHOW reversal confirmation
   * @param {CustomEventInit} event
   */
  requestShowDialogReversalConfirmationListener = event => {
    if (this.dataset.id === event.detail.tags[0]) {
      this.renderDialogTitle('Termin stornieren')
      this.viewContent.innerHTML = ''
      this.viewContent.innerHTML = this.renderDialogContentReversalConfirmation(this.courseData, this.courseDetail)
    }
  }

  /**
   * RENDER reversal confirmation
   * @param {*} data
   * @param {*} detail
   * @returns
   */
  renderDialogContentReversalConfirmation (data, detail = {}) {
    return /* html */ `
      <style>
        .details {
          display: flex;
          flex-direction:column;
          gap: 1.5em;
          margin: 2em 0;
        }
        .detail {
          display: flex;
          flex-direction: column;
        }
        .detail > span:first-child {
          font-weight: 500;
          line-height: 110%;
        }
        h2.alert{
          color: #F4001B !important;
          margin:0 !important;
        }
        .success {
          color: var(--success-color, #00997F);
        }
        .alert {
          color: var(--alert-color, #F4001B);
        }
      </style>
      <div id="content">
        <div>
          <h2 class="alert">Hiermit stornieren sie diesen Termin</h2>
        </div>
        <div class="details">
          ${this.courseDetailsContent(detail)}
        </div>
      </div>`
  }

  /**
   * SHOW reversal success
   * @param {CustomEventInit} event
   */
  updateSubscriptionCourseAppointmentReversalListener = event => {
    if (this.dataset.id === event.detail.id) {
      event.detail.fetch.then(() => {
        this.viewContent.innerHTML = ''
        this.viewContent.innerHTML = this.renderDialogContentReversalSuccess(this.courseData, this.courseDetail)
      })
    }
  }

  /**
   * RENDER reversal success
   * @param {*} data
   * @param {*} detail
   * @returns
   */
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
          color: #00997F;
        }
      </style>
      <div class="success-message">
        <a-icon-mdx icon-name="CheckCircle" size="3em" tabindex="0" class="success"></a-icon-mdx>
        <ks-a-heading tag="h2" color="#00997F">Sie haben den Termin erfolgreich storniert</ks-a-heading>
      </div>
    `
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
                <div id="view-content">
                  ${this.renderDialogContentDetails(content)}
                </div>
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

  /**
   * Returns HTML content based on the subscription mode of a course.
   * @param courseData - `courseData`
   * @param courseDetail - `courseDetail`
   * @returns {string} Returns an HTML string.
   */
  renderPriceInfoContent (courseData, courseDetail) {
    return subscriptionMode[courseDetail.subscriptionMode] === subscriptionMode.WERTABO
      ? /* html */ `<div class="detail price-info"><span>${courseData.lessonPrice}</span><span> Termin wird über ihr Abonnement gebucht</span></div>`
      : ''
  }

  /**
   * Updates element with the ID 'title' in a dialog component with the provided title.
   * @param {string} title - `title`
   */
  renderDialogTitle (title) {
    const titleElement = this.dialog.shadowRoot.getElementById('title')
    titleElement.innerHTML = title
  }

  /**
   * Generates HTML content displaying details of a course appointment,
   * including date, time, location, instructor, status, and subscription information.
   * @param detail - `detail`
   * @returns {string} Returning an HTML template string.
   */
  courseDetailsContent (detail) {
    const state = getTileState(courseAppointmentStatusMapping[detail.courseAppointmentStatus], detail)
    if (!state) return ''
    const validTo = this.formatCourseAppointmentDate(detail.subscriptionValidTo)
    return /* html */ `
      <div class="detail"><span>Datum, Zeit</span><span>${detail.courseAppointmentDateFormatted}</span><span>${detail.courseAppointmentTimeFrom} - ${detail.courseAppointmentTimeTo}</span></div>
      <div class="detail"><span>Ort/Raum</span><span>${detail.courseLocation} / Raum ${detail.roomDescription}</span></div>
      <div class="detail"><span>Kursleitung</span><span>${detail.instructorDescription}</span></div>
      <div class="detail"><span>Status</span><div><span class="${state.css.status}">${state.status}</span> <span class="${state.css.info}">${state.info}</span></div></div>
      <div class="detail"><span>Abonnement</span><span>${detail.subscriptionDescription}</span><span>Gültig bis ${validTo} / Aktuelles Guthaben ${detail.subscriptionBalance}</span></div> 
    `
  }

  /**
   * Generates HTML code for a system notification with a specific message and icon.
   * @returns {string} Returning an HTML template string
   */
  renderNotification () {
    return /* html */ `
      <ks-m-system-notification namespace="system-notification-default-" icon-name="AlertTriangle">
        <div slot="description">
          <p>Eine Stornierung ist nur bis zwei Stunden vor Terminbeginn möglich!</p>
        </div>
      </ks-m-system-notification>
    `
  }

  /**
   * Generates HTML code for a list of downloadable items with links and icons.
   * @returns {string} Returning an HTML template string
   */
  renderDownloads (courseData, courseDetail) {
    // @ts-ignore
    const pdfLink = `${self.Environment.getApiBaseUrl('customer-portal').apiBaseUrl}/api/customerportal/coursepdf/${courseData.courseType}/${courseData.courseId}/${courseData.centerId}`
    return /* html */ `
      <ks-m-link-list namespace="link-list-download-">
        <ul>
          <li>
            <a href="${pdfLink}">
              <span>Kursdetails als PDF</span>
              <div>
                <span>PDF</span>
                <a-icon-mdx namespace="icon-link-list-" icon-name="Download" size="1.5em" rotate="0" class="icon-right"></a-icon-mdx>
              </div>
            </a>
          </li>
          <li>
            ${this.createDownloadICSFile(courseData)} 
          </li>
        </ul>
      </ks-m-link-list>
    `
  }

  /**
   * Creates a download link for an .ics file with a specified filename and content.
   * @param {string} filename - The name of the .ics file
   * @param {string} fileBody - The content of the .ics file
   * @returns {string} An link element with the specified filename and fileBody encoded as a data URL.
   */
  icsDownload (filename, fileBody) {
    const link = document.createElement('a')
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileBody))
    link.setAttribute('download', filename)
    link.innerHTML = /* html */ `
      <span>Termin in persönlichen Kalender</span><div>
        <span>ICS</span>
        <a-icon-mdx namespace="icon-link-list-" icon-name="Download" size="1.5em" rotate="0" class="icon-right"></a-icon-mdx>
      </div>
    `
    return link.outerHTML
  }

  /**
   * Converts a given date and time to a string in the format YYYYMMDDTHHMM00
   * the format required for an iCalendar event (ICS format).
   * @param {Number} dt
   * @returns {string} The formatted date string
   */
  convertToICSDate (dt) {
    const dateTime = new Date(dt)
    const year = dateTime.getFullYear().toString()
    const month = (dateTime.getMonth() + 1) < 10 ? '0' + (dateTime.getMonth() + 1).toString() : (dateTime.getMonth() + 1).toString()
    const day = dateTime.getDate() < 10 ? '0' + dateTime.getDate().toString() : dateTime.getDate().toString()
    const hours = dateTime.getHours() < 10 ? '0' + dateTime.getHours().toString() : dateTime.getHours().toString()
    const minutes = dateTime.getMinutes() < 10 ? '0' + dateTime.getMinutes().toString() : dateTime.getMinutes().toString()
    return year + month + day + 'T' + hours + minutes + '00'
  }

  /**
   *
   * @param {*} course
   * @returns {string}
   */
  createDownloadICSFile (course) {
    const { courseType, courseId, courseTitle, courseLocation, courseAppointmentDate, courseAppointmentTimeFrom, courseAppointmentTimeTo, roomDescription } = course
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const courseFromDate = courseAppointmentTimeFrom.split(':').map(Number)
    const courseFromDateTime = new Date(courseAppointmentDate).setHours(courseFromDate[0], courseFromDate[1])
    const courseToDate = courseAppointmentTimeTo.split(':').map(Number)
    const courseToDateTime = new Date(courseAppointmentDate).setHours(courseToDate[0], courseToDate[1])
    const summary = `${courseTitle} (${courseType}_${courseId})`
    const description = `Raum: ${roomDescription}`
    const uid = `${courseTitle}_${courseAppointmentDate}_${courseFromDateTime}_${courseToDateTime}`
    const icsBody = 'BEGIN:VCALENDAR\n' +
      'PRODID:-//Migros Klubschule//CustomerPortal//EN\n' +
      'VERSION:2.0\n' +
      'METHOD:PUBLISH\n' +
      'CALSCALE:GREGORIAN\n' +
      'BEGIN:VTIMEZONE\n' +
      'TZID:' + timezone + '\n' +
      'END:VTIMEZONE\n' +
      'BEGIN:VEVENT\n' +
      'SUMMARY:' + summary + '\n' +
      'UID:' + uid + '\n' +
      'SEQUENCE:0\n' +
      'STATUS:CONFIRMED\n' +
      'TRANSP:TRANSPARENT\n' +
      'DTSTART;TZID=' + timezone + ':' + this.convertToICSDate(courseFromDateTime) + '\n' +
      'DTEND;TZID=' + timezone + ':' + this.convertToICSDate(courseToDateTime) + '\n' +
      'LOCATION:' + courseLocation + '\n' +
      'DESCRIPTION:' + description + '\n' +
      'END:VEVENT\n' +
      'END:VCALENDAR\n'
    return this.icsDownload(summary + '.ics', icsBody)
  }

  formatCourseAppointmentDate (dateString) {
    const dateObject = new Date(dateString)
    const options = { month: '2-digit', day: '2-digit', year: 'numeric' }
    // @ts-ignore
    const formatter = new Intl.DateTimeFormat('de-DE', options)
    return formatter.format(dateObject)
  }

  get dialog () {
    return this.root.querySelector('m-dialog')
  }

  get viewContent () {
    return this.dialog.shadowRoot.getElementById('view-content')
  }
}
