// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'
import { subscriptionMode, actionType } from '../../../helpers/Mapping.js'
import { escapeForHtml } from '../../../helpers/Shared.js'

/**
* @export
* @class DialogStatusButton
* @type {CustomElementConstructor}
*/
export default class DialogStatusButton extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this.dataContent = null
    this.dataSubscription = null
    this.courseAppointmentStatus = null
  }

  connectedCallback () {
    this.dataContent = JSON.parse(this.dataset.content)
    this.dataSubscription = JSON.parse(this.dataset.subscription)
    if (this.shouldRenderCSS()) this.renderCSS()
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', this.updateSubscriptionCourseAppointmentDetailListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
    document.body.addEventListener(this.getAttribute('request-show-dialog-booking-confirmation') || 'request-show-dialog-booking-confirmation', this.requestShowDialogBookingConfirmationListener)
    document.body.addEventListener(this.getAttribute('request-show-dialog-reversal-confirmation') || 'request-show-dialog-reversal-confirmation', this.requestShowDialogReversalConfirmationListener)
  }

  disconnectedCallback () {
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', this.updateSubscriptionCourseAppointmentDetailListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
    document.body.removeEventListener(this.getAttribute('request-show-dialog-booking-confirmation') || 'request-show-dialog-booking-confirmation', this.requestShowDialogBookingConfirmationListener)
    document.body.removeEventListener(this.getAttribute('request-show-dialog-reversal-confirmation') || 'request-show-dialog-reversal-confirmation', this.requestShowDialogReversalConfirmationListener)
  }

  /**
   * DETAILS - LOADED
   *
   * @param {CustomEventInit} event
   */
  updateSubscriptionCourseAppointmentDetailListener = event => {
    if (this.dataset.id === event.detail.id) {
      const type = event.detail.type
      event.detail.fetch.then(courseDetail => {
        this.courseAppointmentStatus = courseDetail.courseAppointmentStatus
        let btn = this.renderDialogActionButton(this.dataset.id, type, subscriptionMode[this.dataSubscription.subscriptionMode], this.courseAppointmentStatus, escapeForHtml(JSON.stringify(this.dataContent)), escapeForHtml(JSON.stringify(this.dataSubscription)))
        btn += this.closeButton
        this.html = ''
        this.html = btn
      })
    }
  }

  /**
   * REVERSAL - SUCCESS
   *
   * @param {CustomEventInit} event
   */
  updateSubscriptionCourseAppointmentReversalListener = event => {
    if (this.dataset.id === event.detail.id) {
      event.detail.fetch.then(() => {
        this.html = ''
        this.html = this.closeButton
      })
    }
  }

  /**
   * BOOKING - SUCCESS
   *
   * @param {CustomEventInit} event
   */
  updateSubscriptionCourseAppointmentBookingListener = event => {
    if (this.dataset.id === event.detail.id) {
      event.detail.fetch.then(() => {
        this.html = ''
        this.html = this.closeButton
      })
    }
  }

  /**
   * BOOKING - CONFIRMATION
   * @param {CustomEventInit} event
   */
  requestShowDialogBookingConfirmationListener = event => {
    if (this.dataset.id === event.detail.tags[0]) {
      this.html = ''
      let btn = this.renderDialogActionButton(this.dataset.id, null, subscriptionMode[this.dataSubscription.subscriptionMode], this.courseAppointmentStatus, escapeForHtml(JSON.stringify(this.dataContent)), escapeForHtml(JSON.stringify(this.dataSubscription)))
      btn += this.closeButton
      this.html = btn
    }
  }

  /**
   * REVERSAL - CONFIRMATION
   * @param {CustomEventInit} event
   */
  requestShowDialogReversalConfirmationListener = event => {
    if (this.dataset.id === event.detail.tags[0]) {
      this.html = ''
      let btn = this.renderDialogActionButton(this.dataset.id, null, subscriptionMode[this.dataSubscription.subscriptionMode], this.courseAppointmentStatus, escapeForHtml(JSON.stringify(this.dataContent)), escapeForHtml(JSON.stringify(this.dataSubscription)))
      btn += this.closeButton
      this.html = btn
    }
  }

  /**
   * evaluates if a render is necessary
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
        width: 100%;
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
      case 'dialog-status-button-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles])
      default:
        return this.fetchCSS(styles)
    }
  }

  /**
   * Generates different action buttons based on the provided parameters such as type, subscription mode, and status.
   * @param id - `id`
   * @param {string} type - `type`
   * @param subscriptionMode - It could be either "FLAT" or "SUBSCRIPTION".
   * @param status - Determine which action button should be rendered based on the type and status of the appointment.
   * @param content - `content`
   * @param selectedSubscription - `selectedSubscription`
   * @returns Returns a button element based on the provided parameters
   */
  renderDialogActionButton (id, type, subscriptionMode, status, content, selectedSubscription) {
    if (type === 'detail' && status === 1) {
      return `<ks-a-button tag="${id}" namespace="button-primary-" tag="[${actionType.bookingFinal}]"  request-event-name="request-show-dialog-booking-confirmation">Termin buchen</ks-a-button>`
    }

    if (type === 'detail' && status === 5) {
      return `<ks-a-button tag="${id}" namespace="button-primary-" color="quaternary" tag="[${actionType.reversal}]"  request-event-name="request-show-dialog-reversal-confirmation">Termin stornieren</ks-a-button>`
    }

    const btnBooking = `<ks-a-button namespace="button-primary-"  request-event-name="request-subscription-course-appointment-booking" tag='[${content},${selectedSubscription}]'>Jetzt Termin buchen</ks-a-button>`
    const btnReversal = `<ks-a-button color="quaternary" namespace="button-primary-" request-event-name="request-subscription-course-appointment-reversal" tag='[${content},${selectedSubscription}]'>Jetzt Termin stornieren</ks-a-button>`

    const actionButton = {
      FLAT: {
        1: btnBooking,
        2: '',
        3: '',
        4: '',
        5: btnReversal,
        6: ''
      },
      SUBSCRIPTION: {
        1: btnBooking,
        2: '',
        3: '',
        4: '',
        5: btnReversal,
        6: ''
      }
    }

    return actionButton[subscriptionMode][status]
  }

  get closeButton () {
    return /* html */ `<ks-a-button id="close" request-event-name="dialog-close-${this.dataset.id}" namespace="button-tertiary-" color="secondary">Schliessen</ks-a-button>`
  }
}
