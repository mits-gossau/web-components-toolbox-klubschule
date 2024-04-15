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
  /**
   * @param {any} args
   */
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
    // if (this.shouldRenderHTML()) this.renderHTML(this.dataContent, this.dataSubscription)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', this.updateSubscriptionCourseAppointmentDetailListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
    document.body.addEventListener(this.getAttribute('request-show-dialog-booking') || 'request-show-dialog-booking', this.updateDialogBookingDetailListener)
    document.body.addEventListener(this.getAttribute('request-show-dialog-reversal') || 'request-show-dialog-reversal', this.updateDialogReversalDetailListener)
  }

  disconnectedCallback () {
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', this.updateSubscriptionCourseAppointmentDetailListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
    document.body.removeEventListener(this.getAttribute('request-show-dialog-booking') || 'request-show-dialog-booking', this.updateDialogBookingDetailListener)
    document.body.removeEventListener(this.getAttribute('request-show-dialog-reversal') || 'request-show-dialog-reversal', this.updateDialogReversalDetailListener)
  }

  // details loaded
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

  // reversal success
  updateSubscriptionCourseAppointmentReversalListener = event => {
    if (this.dataset.id === event.detail.id) {
      event.detail.fetch.then(courseDetail => {
        this.html = ''
        this.html = this.closeButton
      })
    }
  }

  // booking success
  updateSubscriptionCourseAppointmentBookingListener = event => {
    if (this.dataset.id === event.detail.id) {
      event.detail.fetch.then(courseDetail => {
        this.html = ''
        this.html = this.closeButton
      })
    }
  }

  // booking final step
  updateDialogBookingDetailListener = event => {
    if (this.dataset.id === event.detail.tags[0]) {
      this.html = ''
      let btn = this.renderDialogActionButton(this.dataset.id, null, subscriptionMode[this.dataSubscription.subscriptionMode], this.courseAppointmentStatus, escapeForHtml(JSON.stringify(this.dataContent)), escapeForHtml(JSON.stringify(this.dataSubscription)))
      btn += this.closeButton
      this.html = btn
    }
  }

  // reversal final step
  updateDialogReversalDetailListener = event => {
    if (this.dataset.id === event.detail.tags[0]) {
      this.html = ''
      let btn = this.renderDialogActionButton(this.dataset.id, null, subscriptionMode[this.dataSubscription.subscriptionMode], this.courseAppointmentStatus, escapeForHtml(JSON.stringify(this.dataContent)), escapeForHtml(JSON.stringify(this.dataSubscription)))
      btn += this.closeButton
      this.html = btn
    }
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  // shouldRenderHTML () {
  //   return !this.wrapper
  // }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        display: flex;
        justify-content: space-between;
        width:100%;
        flex-direction: row-reverse;
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
      case 'status-button-default-':
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
  // renderHTML (content, subscription) {
  //   this.wrapper = this.root.querySelector('div') || document.createElement('div')
  //   const btn = this.renderDialogActionButton(subscriptionMode[subscription.subscriptionMode], content.courseAppointmentStatus, escapeForHtml(JSON.stringify(content)), escapeForHtml(JSON.stringify(subscription)))
  //   this.html = btn
  // }

  renderDialogActionButton (id, type, subscriptionMode, status, content, selectedSubscription) {
    if (type === 'detail' && status === 1) {
      return `<ks-a-button tag="${id}" namespace="button-primary-" tag="[${actionType.bookingFinal}]"  request-event-name="request-show-dialog-booking">Termin buchen</ks-a-button>`
    }

    if (type === 'detail' && status === 5) {
      return `<ks-a-button tag="${id}" namespace="button-primary-" color="quaternary" tag="[${actionType.reversal}]"  request-event-name="request-show-dialog-reversal">Termin stornieren</ks-a-button>`
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
    return `<ks-a-button id="close" request-event-name="dialog-close-${this.dataset.id}" namespace="button-tertiary-" color="secondary">Schliessen</ks-a-button>`
  }
}
