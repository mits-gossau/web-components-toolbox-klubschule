// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'
import { escapeForHtml, getTileState } from '../../../helpers/Shared.js'
import { subscriptionMode, courseAppointmentStatusMapping } from '../../../helpers/Mapping.js'

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
    this.subscriptionsPdfLink = null
  }

  connectedCallback () {
    document.body.addEventListener(this.getAttribute('request-show-dialog-booking-confirmation') || 'request-show-dialog-booking-confirmation', this.requestShowDialogBookingConfirmationListener)
    document.body.addEventListener(this.getAttribute('request-show-dialog-reversal-confirmation') || 'request-show-dialog-reversal-confirmation', this.requestShowDialogReversalConfirmationListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', this.updateSubscriptionCourseAppointmentDetailListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
    document.body.addEventListener(this.getAttribute('update-subscription-pdf') || 'update-subscription-pdf', this.updateSubscriptionListener)
    document.body.addEventListener('update-subscription-detail', this.updateSubscriptionCourseAppointmentDetailListener)
    this.courseData = JSON.parse(this.dataset.content)
    this.courseId = this.dataset.id
    this.courseSubscription = JSON.parse(this.dataset.subscription)
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) {
      if (this.dataset.listType === 'subscriptions') {
        this.renderSubscriptionsHTML(this.courseId, this.courseData)
      } else {
        this.renderHTML(this.courseId, this.courseData, this.courseSubscription)
      }
    }
  }

  disconnectedCallback () {
    document.body.removeEventListener(this.getAttribute('request-show-dialog-booking-confirmation') || 'request-show-dialog-booking-confirmation', this.requestShowDialogBookingConfirmationListener)
    document.body.removeEventListener(this.getAttribute('request-show-dialog-reversal-confirmation') || 'request-show-dialog-reversal-confirmation', this.requestShowDialogReversalConfirmationListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', this.updateSubscriptionCourseAppointmentDetailListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-pdf') || 'update-subscription-pdf', this.updateSubscriptionListener)
    document.body.removeEventListener(this.getAttribute(`dialog-close-${this.dataset.id}`) || `dialog-close-${this.dataset.id}`, this.dialogCloseListener)
    this.subscriptionsPdfLink?.removeEventListener('click', this.subscriptionPdfLinkListener)
    document.body.removeEventListener('update-subscription-detail', this.updateSubscriptionCourseAppointmentDetailListener)
  }

  /**
   * Trigger Subscription PDF Download
   * @param {any} event
   */
  subscriptionPdfLinkListener = (event) => {
    this.subscriptionPdfLinkLoading('inline')
    event.preventDefault()
    this.dispatchEvent(new CustomEvent('request-subscription-pdf',
      {
        detail: {
          subscription: event.target?.dataset.subscription
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }
    ))
  }

  /**
   * Download subscriptions PDF
   * @param {CustomEventInit} event
   */
  updateSubscriptionListener = event => {
    if (this.dataset.id === event.detail.id) {
      event.detail.fetch.then(subscriptionPdf => {
        const url = URL.createObjectURL(subscriptionPdf)
        const a = document.createElement('a')
        a.href = url
        a.download = `${this.courseData.subscriptionType}_${this.courseData.subscriptionId}.pdf`
        a.click()
        this.subscriptionPdfLinkLoading()
      })
    }
  }

  /**
   * SHOW course detail
   * @param {CustomEventInit} event
   */
  updateSubscriptionCourseAppointmentDetailListener = event => {
    if (this.dataset.id === event.detail.id) {
      this.viewContent.innerHTML = ''
      const { type } = event.detail
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
        if (type === 'detail') {
          // trans value = Termindetails
          this.renderDialogTitle('CP.cpAppointmentDetails')
          this.viewContent.innerHTML = this.renderDialogContentDetails(this.courseData, this.courseDetail)
        }
        if (type === 'booking') {
          // trans value = Termin buchen
          this.renderDialogTitle('CP.cpBookAppointment')
          this.viewContent.innerHTML = this.renderDialogContentBookingConfirmation(this.courseData, this.courseDetail)
        }
        if (type === 'reversal') {
          // trans value = Termin stornieren
          this.renderDialogTitle('CP.cpCancelAppointment')
          this.viewContent.innerHTML = this.renderDialogContentReversalConfirmation(this.courseData, this.courseDetail)
        }
        if (type === 'subscriptions') {
          // trans value = Abonnementdetails
          this.renderDialogTitle('CP.cpSubscriptionDetails')
          this.viewContent.innerHTML = this.renderDialogContentSubscriptionDetail(this.courseData, this.courseDetail)
          // TODO: Own fn() ?
          this.subscriptionsPdfLink = this.viewContent.querySelector('ks-m-link-list')
          this.subscriptionsPdfLink.addEventListener('click', this.subscriptionPdfLinkListener)
          // hide pdf downloading spinner
          this.subscriptionPdfLinkLoading()
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
          margin-bottom:1.5em;
        }
        .price {
          margin: 0 !important;
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
        ${this.renderPriceInfoContent(data, detail)}
        <div class="details">
          ${this.courseDetailsContent(detail)}
        </div>
        <div>
          <h3>Downloads</h3>
          <div class="downloads">${this.renderDownloads(data, detail)}</div>
        </div>
      </div>
    `
  }

  /**
   * RENDER subscription detail
   * @param {*} data
   * @param {*} detail
   * @returns
   */
  renderDialogContentSubscriptionDetail (data, detail = {}) {
    return /* html */ `
      <style>
        .details {
          display: flex;
          flex-direction: column;
          padding-top: 2em;
          gap:1.5em;
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
        .downloads {
          margin-bottom: 1.5em;
        }
      </style>
      <div id="content">
        <div class="details">
          ${this.subscriptionDetailsContent(data)}
        </div>
        <div>
          <h3>Downloads</h3>
          <div class="downloads">
            ${this.renderSubscriptionDownloads(data)}
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
      // trans value = Termin buchen
      this.renderDialogTitle('CP.cpBookAppointment')
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
          <span>
            <!-- trans value = Termin wird über ihr Abonnement gebucht -->
            <a-translation data-trans-key="CP.cpAppointmentBookedViaSubscription"></a-translation>
          </span>
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
        .success-message {
          display: flex;
          align-items: flex-start;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 1em;
          width: fit-content;
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
        <a-icon-mdx icon-name="CheckCircle" size="3em" class="success"></a-icon-mdx>
        <h2 class="success">
          <!-- trans value = Sie haben den Termin erfolgreich gebucht -->
          <a-translation data-trans-key="CP.cpYouHaveBookedTheAppointmentSuccessfully"></a-translation>
        </h2>
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
        <h2 class="alert">
            <!-- trans value = Hiermit stornieren sie diesen Termin -->
            <a-translation data-trans-key="CP.cpHerebyYouCancelThisAppointment"></a-translation>
        </h2>
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
        this.dispatchEvent(new CustomEvent('update-counter',
          {
            detail: {
              counter: 0,
              type: 'decrement'
            },
            bubbles: true,
            cancelable: true,
            composed: true
          }
        ))
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
          align-items: flex-start;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 1em;
          width: fit-content;
        }
        .success {
          color: #00997F;
        }
        h2.success {
          color: #00997F !important;
        }
      </style>
      <div class="success-message">
        <a-icon-mdx icon-name="CheckCircle" size="3em" class="success"></a-icon-mdx>
          <h2 class="success">
            <!-- trans value = Sie haben den Termin erfolgreich storniert -->
            <a-translation data-trans-key="CP.cpYouHaveSuccessfullyCanceledTheAppointment"></a-translation>
          </h2>   
      </div>
    `
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  shouldRenderHTML () {
    return !this.dialog
  }

  renderCSS () {
    this.css = /* css */`
      :host {}
      @media only screen and (max-width: _max-width_) {
        :host {}
      }
    `
    return this.fetchTemplate()
  }

  fetchTemplate () {
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

  renderSubscriptionsHTML (id, data) {
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
        <m-dialog namespace="dialog-left-slide-in-" show-event-name="dialog-open-${id}" close-event-name="dialog-close-${id}">
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
                <h2>${data.subscriptionDescription}</h2>
                <div id="view-content">
                  ${this.renderDialogContentSubscriptionDetail(data)}
                </div>
              </div>
            </div>
            <div class="container dialog-footer">
              <a-dialog-status-button namespace="dialog-status-button-default-" data-id="${id}" data-content="${escapeForHtml(JSON.stringify(data))}" data-subscription="${escapeForHtml(JSON.stringify(data))}"></a-dialog-status-button>
            </div>
            <a-tile-status-button data-list-type="subscriptions" id="show-modal" data-id="${id}" data-content="${escapeForHtml(JSON.stringify(data))}" data-subscription="${escapeForHtml(JSON.stringify(data))}"></a-tile-status-button>  
        </m-dialog>
      `
    })
  }

  renderHTML (courseId, content, selectedSubscription) {
    const fetchModules = this.fetchModules([
      {
        path: `${this.importMetaUrl}'../../../../../../components/molecules/linkList/LinkList.js`,
        name: 'ks-m-link-list'
      },
      {
        path: `${this.importMetaUrl}'../../../../../../components/molecules/systemNotification/SystemNotification.js`,
        name: 'ks-m-system-notification'
      },
      {
        path: `${this.importMetaUrl}../../../../../css/web-components-toolbox-migros-design-experience/src/es/components/organisms/MdxComponent.js`,
        name: 'mdx-component'

      },
      {
        path: `${this.importMetaUrl}../../../../components/web-components-toolbox/src/es/components/atoms/translation/Translation.js`,
        name: 'a-translation'
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
      ? /* html */ `
        <div class="detail price-info">
          <h3 class="price">${courseData.lessonPrice}</h3>
          <span>
            <!-- trans value = Termin wird über ihr Abonnement gebucht -->
            <a-translation data-trans-key="CP.cpAppointmentBookedViaSubscription"></a-translation>
          </span>
        </div>
      `
      : ''
  }

  /**
   * Updates the dialog title.
   * @param {string} title
   */
  renderDialogTitle (title) {
    const titleElement = this.dialog.shadowRoot.getElementById('title')
    titleElement.innerHTML = `<a-translation data-trans-key="${title}"></a-translation>`
  }

  subscriptionDetailsContent (subscription) {
    const subscriptionBalance = (subscriptionMode[subscription.subscriptionMode] === 'SUBSCRIPTION') ? subscription.subscriptionBalance : '-'
    const from = this.formatCourseAppointmentDate(subscription.subscriptionValidFrom)
    const to = this.formatCourseAppointmentDate(subscription.subscriptionValidTo)
    return /* html */ `
      <div class="detail">
        <span>
          <!-- trans value = Guthaben -->
          <a-translation data-trans-key="CP.cpSubscriptionColumnBalance"></a-translation>
        </span>
        <span>${subscriptionBalance}</span>
      </div>
      <div class="detail">
        <span>
          <!-- trans value = Gültigkeitsdauer -->
          <a-translation data-trans-key="CP.cpSubscriptionColumnValidity"></a-translation>
        </span>
        <span>${from} - ${to}</span>
      </div>
    `
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
    const freeSeats = Number(state.status) ? state.status : ''
    return /* html */ `
      <div class="detail">
        <span>
          <!-- trans value = Datum -->
          <a-translation data-trans-key="CP.cpAppointmentListColumnDate"></a-translation>,
          <!-- trans value = Zeit -->
          <a-translation data-trans-key="CP.cpAppointmentListColumnTime"></a-translation>
        </span>
        <span>${detail.courseAppointmentDateFormatted}</span>
        <span>${detail.courseAppointmentTimeFrom} - ${detail.courseAppointmentTimeTo}</span>
      </div>
      <div class="detail">
        <span>
          <!-- trans value = Ort -->
          <a-translation data-trans-key="CP.cpAppointmentListColumnCity"></a-translation>/
          <!-- trans value = Raum -->
          <a-translation data-trans-key="CP.cpAppointmentIcsRoom"></a-translation>
        </span>
        <span>${detail.courseLocation} / <a-translation data-trans-key="CP.cpAppointmentIcsRoom"></a-translation> ${detail.roomDescription}</span>
      </div>
      <div class="detail">
        <span>
          <!-- trans value = Kursleitung -->
          <a-translation data-trans-key="CP.cpAppointmentListFilterByInstructor"></a-translation>
        </span>
        <span>${detail.instructorDescription}</span>
      </div>
      <div class="detail">
        <span>
          <!-- trans value = Status -->
          <a-translation data-trans-key="CP.cpAppointmentListColumnStatus"></a-translation>
        </span>
        <div>
          <span class="${state.css.status}">${freeSeats ? `${freeSeats}` : `<a-translation data-trans-key='${state.statusTransKey}'></a-translation`}</span> 
          <span class="${state.css.info}">${state.infoTransKey ? `<a-translation data-trans-key='${state.infoTransKey}'></a-translation>` : ''}</span>
        </div>
      </div>
      <div class="detail">
        <span>
          <!-- trans value = Abonnement -->
          <a-translation data-trans-key="CP.cpSubscriptionColumnDescription"></a-translation>
        </span>
        <span>${detail.subscriptionDescription}</span>
        <span>
          <!-- trans value = Gültig bis -->
          <a-translation data-trans-key="CP.cpAppointmentListSubscriptionsValidTo"></a-translation> ${validTo} / 
          <!-- trans value = Aktuelles Guthaben -->
          <a-translation data-trans-key="CP.cpBookingActualSubscriptionBalance"></a-translation> ${detail.subscriptionBalance}
        </span>
      </div> 
    `
  }

  /**
   * Generates HTML code for a system notification with a specific message and icon.
   * @returns {string} Returning an HTML template string
   */
  renderNotification () {
    return /* html */ `
      <ks-m-system-notification namespace="system-notification-default-" icon-name="AlertCircle" icon-size="1.5em">
        <style>
          :host {
            --system-notification-default-icon-border-width: 0 !important;
            --system-notification-error-icon-size: 1.5em !important;
          }
        </style>
        <div slot="description">
          <p>
            <!-- trans value = Eine Stornierung ist nur bis zwei Stunden vor Terminbeginn möglich! -->
            <a-translation data-trans-key="CP.cpInfoCancelFlatSubscriptionInBooking"></a-translation>
          </p>
        </div>
      </ks-m-system-notification>
    `
  }

  renderSubscriptionDownloads (subscriptionData) {
    // @ts-ignore
    return /* html */ `
      <ks-m-link-list data-subscription="${escapeForHtml(JSON.stringify(subscriptionData))}"  namespace="link-list-download-">
        <ul>
          <li>
            <a id="subscriptionsPdfLink">
              <span>
                <!-- trans value = Kursdetails als PDF downloaden -->
                <a-translation data-trans-key="CP.cpAppointmentDwnPDF"></a-translation> <mdx-component><mdx-spinner size="small"></mdx-spinner></mdx-component>
              </span>
              <div>
                <span>PDF</span>
                <a-icon-mdx namespace="icon-link-list-" icon-name="Download" size="1.5em" rotate="0" class="icon-right"></a-icon-mdx>
              </div>
            </a>
          </li>
        </ul>
      </ks-m-link-list>
    `
  }

  /**
   * Generates HTML code for a list of downloadable items with links and icons.
   * @returns {string} Returning an HTML template string
   */
  renderDownloads (courseData, courseDetail) {
    // @ts-ignore
    const pdfLink = `${self.Environment.getApiBaseUrl('customer-portal').coursePDF}/${courseData.courseType}/${courseData.courseId}/${courseData.centerId}`
    return /* html */ `
      <ks-m-link-list namespace="link-list-download-">
        <ul>
          <li>
            <a href="${pdfLink}">
              <span>
                <!-- trans value = Kursdetails als PDF downloaden -->
                <a-translation data-trans-key="CP.cpAppointmentDwnPDF"></a-translation>
              </span>
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
      <span>
        <!-- trans value = Termin in Kalender exportieren -->
        <a-translation data-trans-key="CP.cpAppointmentDwnCalendar"></a-translation>
      </span>
      <div>
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
   * Create .ics file
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
    const formatter = new Intl.DateTimeFormat(self.Environment.language, options)
    return formatter.format(dateObject)
  }

  /**
   * Show/Hide loading spinner
   * @param {string} display css display property
  */
  subscriptionPdfLinkLoading = (display = 'none') => {
    this.mdxComponent.style.display = display
  }

  get dialog () {
    return this.root.querySelector('m-dialog')
  }

  get viewContent () {
    return this.dialog.shadowRoot.getElementById('view-content')
  }

  get mdxComponent () {
    return this.dialog.root.querySelector('ks-m-link-list').root.querySelector('mdx-component')
  }
}
