// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'
import { subscriptionMode, actionType } from '../../../helpers/mapping.js'

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
    // if (this.shouldRenderCSS()) this.renderCSS()
    // if (this.shouldRenderHTML()) this.renderHTML(this.dataContent, this.dataSubscription)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', this.updateSubscriptionCourseAppointmentDetailListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
    document.body.addEventListener(this.getAttribute('request-show-dialog-booking') || 'request-show-dialog-booking', this.updateDialogBookingDetailListener)
  }

  disconnectedCallback () {
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', this.updateSubscriptionCourseAppointmentDetailListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
    document.body.removeEventListener(this.getAttribute('request-show-dialog-booking') || 'request-show-dialog-booking', this.updateDialogBookingDetailListener)
  }

  updateSubscriptionCourseAppointmentDetailListener = event => {
    const type = event.detail.type
    event.detail.fetch.then(courseDetail => {
      if (this.dataset.id * 1 === event.detail.id) {
        debugger

        // if event.detail.type === 'deteil' = neutral btn
        // if event.detail.type === 'booking' = booking btn

        //  const btnBooking = `<ks-a-button namespace="button-primary-"  request-event-name="request-subscription-course-appointment-booking" tag='[${content},${selectedSubscription}]'>DIATermin buchen</ks-a-button>`
        // const btnCancel = `<ks-a-button color="quaternary" namespace="button-primary-"  request-event-name="request-subscription-course-appointment-reversal" tag='[${content},${selectedSubscription}]'>DIATermin stornieren</ks-a-button>`

        this.courseAppointmentStatus = courseDetail.courseAppointmentStatus

        const btn = this.renderDialogActionButton(this.dataContent.courseId, type, subscriptionMode[this.dataSubscription.subscriptionMode], this.courseAppointmentStatus, this.escapeForHtml(JSON.stringify(this.dataContent)), this.escapeForHtml(JSON.stringify(this.dataSubscription)))

        this.html = ''
        this.html = btn
      }
    })
  }

  updateSubscriptionCourseAppointmentReversalListener = event => {
    const type = event.detail.type
    event.detail.fetch.then(courseDetail => {
      if (this.dataset.id * 1 === event.detail.id) {
        const btn = this.renderDialogActionButton(this.dataContent.courseId, type, subscriptionMode[this.dataSubscription.subscriptionMode], this.courseAppointmentStatus, this.escapeForHtml(JSON.stringify(this.dataContent)), this.escapeForHtml(JSON.stringify(this.dataSubscription)))
        debugger
        this.html = ''
        this.html = btn
      }
    })
  }

  updateDialogBookingDetailListener = event => {
    if (this.dataset.id === event.detail.tags[0]) {
      const btn = this.renderDialogActionButton(this.dataContent.courseId, null, subscriptionMode[this.dataSubscription.subscriptionMode], this.courseAppointmentStatus, this.escapeForHtml(JSON.stringify(this.dataContent)), this.escapeForHtml(JSON.stringify(this.dataSubscription)))
      debugger
      this.html = ''
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
  shouldRenderHTML () {
    return !this.wrapper
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        display:block;
      }
      :host .subscription {
        display: none;
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
  //   const btn = this.renderDialogActionButton(subscriptionMode[subscription.subscriptionMode], content.courseAppointmentStatus, this.escapeForHtml(JSON.stringify(content)), this.escapeForHtml(JSON.stringify(subscription)))
  //   this.html = btn
  // }

  escapeForHtml = (htmlString) => {
    return htmlString
      .replaceAll(/&/g, '&amp;')
      .replaceAll(/</g, '&lt;')
      .replaceAll(/>/g, '&gt;')
      .replaceAll(/"/g, '&quot;')
      .replaceAll(/'/g, '&#39;')
  }

  renderDialogActionButton (id, type, subscriptionMode, status, content, selectedSubscription) {
    if (type === 'detail' && status === 1) {
      return `<ks-a-button tag="${id}" namespace="button-primary-" tag="[${actionType.bookingFinal}]"  request-event-name="request-show-dialog-booking">DO BOOKING</ks-a-button>`
    }

    const btnBooking = `<ks-a-button namespace="button-primary-"  request-event-name="request-subscription-course-appointment-booking" tag='[${content},${selectedSubscription}]'>DIATermin buchen</ks-a-button>`
    const btnCancel = `<ks-a-button color="quaternary" namespace="button-primary-"  request-event-name="request-subscription-course-appointment-reversal" tag='[${content},${selectedSubscription}]'>DIATermin stornieren</ks-a-button>`

    const actionButton = {
      FLAT: {
        1: btnBooking,
        2: '',
        3: '',
        4: '',
        5: btnCancel,
        6: ''
      },
      SUBSCRIPTION: {
        1: btnBooking,
        2: '',
        3: '',
        4: '',
        5: btnCancel,
        6: ''
      }
    }

    return actionButton[subscriptionMode][status]
  }
}
