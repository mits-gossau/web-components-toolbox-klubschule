// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'
import { subscriptionMode } from '../../../helpers/Mapping.js'
import { escapeForHtml } from '../../../helpers/Shared.js'

/* global self */

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
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', this.updateSubscriptionCourseAppointmentDetailListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
    document.body.addEventListener(this.getAttribute('request-show-dialog-booking-confirmation') || 'request-show-dialog-booking-confirmation', this.requestShowDialogBookingConfirmationListener)
    document.body.addEventListener(this.getAttribute('request-show-dialog-reversal-confirmation') || 'request-show-dialog-reversal-confirmation', this.requestShowDialogReversalConfirmationListener)
    this.dataContent = JSON.parse(this.dataset.content)
    this.dataSubscription = JSON.parse(this.dataset.subscription)
    if (this.shouldRenderCSS()) this.renderCSS()
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
    if (this.dataset.id === event.detail.id) this.renderOnlyCloseButton()
  }

  /**
   * BOOKING - SUCCESS
   *
   * @param {CustomEventInit} event
   */
  updateSubscriptionCourseAppointmentBookingListener = event => {
    if (this.dataset.id === event.detail.id) this.renderOnlyCloseButton()
  }

  /**
   * BOOKING - CONFIRMATION
   * @param {CustomEventInit} event
   */
  requestShowDialogBookingConfirmationListener = event => {
    if (this.dataset.id === event.detail.tags[0]) this.renderConfirmation()
  }

  /**
   * REVERSAL - CONFIRMATION
   * @param {CustomEventInit} event
   */
  requestShowDialogReversalConfirmationListener = event => {
    if (this.dataset.id === event.detail.tags[0]) this.renderConfirmation()
  }

  /**
   * Render confirmation button for booking and reversal state
   */
  renderConfirmation () {
    this.html = ''
    let btn = this.renderDialogActionButton(this.dataset.id, '', subscriptionMode[this.dataSubscription.subscriptionMode], this.courseAppointmentStatus, escapeForHtml(JSON.stringify(this.dataContent)), escapeForHtml(JSON.stringify(this.dataSubscription)))
    btn += this.closeButton
    this.html = btn
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  renderCSS () {
    this.css = /* css */`
      :host {
        align-items: center;
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
   * @param {string} id - `id`
   * @param {string} type - `type`
   * @param subscriptionMode - It could be either "FLAT" or "SUBSCRIPTION".
   * @param {number} status - Determine which action button should be rendered based on the type and status of the appointment.
   * @param content - `content`
   * @param selectedSubscription - `selectedSubscription`
   * @returns Returns a button element based on the provided parameters
   */
  renderDialogActionButton (id, type, subscriptionMode, status, content, selectedSubscription) {
    switch (true) {
      case (type === 'detail' && status === 1):
        return /* html */ `
          <ks-a-button
            namespace="button-primary-" 
            request-event-name="request-show-dialog-booking-confirmation"
            tag="${id}">
              <a-translation data-trans-key='CP.cpBookAppointment'/></a-translation>
          </ks-a-button>
        `
      case (type === 'detail' && status === 5):
        return /* html */ `
          <ks-a-button
            color="quaternary" 
            namespace="button-primary-" 
            request-event-name="request-show-dialog-reversal-confirmation"
            tag="${id}"> 
              <a-translation data-trans-key='CP.cpCancelAppointment'/></a-translation>
          </ks-a-button>
        `
      case (type === 'subscriptions'): {
        // @ts-ignore
        const url = `${self.Environment.getApiBaseUrl('customer-portal').subscriptionRenewSearchLinkUrl}${this.dataContent.subscriptionKindType}_${this.dataContent.subscriptionKindId}`
        return /* html */ `
          <ks-a-button
            href="${url}" 
            namespace="button-primary-">
              <a-translation data-trans-key='CP.cpSubscriptionRenew'/></a-translation>
          </ks-a-button>
        `
      }
      case (type === 'reversal' || status === 5):
        return /* html */ `
          <ks-a-button
            color="quaternary"
            namespace="button-primary-"
            request-event-name="request-subscription-course-appointment-reversal"
            tag='[${content},${selectedSubscription}]'>
              <a-translation data-trans-key='CP.cpCancelAppointmentNow'/></a-translation>
          </ks-a-button>
        `
      case (type === 'booking' || status === 1):
        return /* html */ `
          <ks-a-button
            namespace="button-primary-"
            request-event-name="request-subscription-course-appointment-booking"
            tag='[${content},${selectedSubscription}]'>
              <a-translation data-trans-key='CP.cpBookAppointmentNow'/></a-translation>
          </ks-a-button>
        `
      default:
        return ''
    }
  }

  renderOnlyCloseButton () {
    this.html = ''
    this.html = this.closeButton
  }

  get closeButton () {
    return /* html */ `
      <ks-a-button
        color="secondary"
        id="close"
        namespace="button-tertiary-" 
        request-event-name="dialog-close-${this.dataset.id}">
          <a-translation data-trans-key='CP.cpAppointmentClose'/></a-translation>
      </ks-a-button>
    `
  }
}
