// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'
import { subscriptionMode } from '../../../helpers/mapping.js'

/**
* @export
* @class StatusButton
* @type {CustomElementConstructor}
*/
export default class StatusButton extends Shadow() {
  /**
   * @param {any} args
   */
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this.dataContent = null
    this.dataSubscription = null
  }

  connectedCallback () {
    this.dataContent = JSON.parse(this.dataset.content)
    this.dataSubscription = JSON.parse(this.dataset.subscription)
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML(this.dataContent, this.dataSubscription)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
  }

  disconnectedCallback () {
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
  }

  updateSubscriptionCourseAppointmentBookingListener = event => {
    event.detail.fetch.then(courseDetail => {
      if (this.dataset.id === event.detail.id) {
        debugger
        const btn = this.renderTileActionButton(subscriptionMode[this.dataSubscription.subscriptionMode], courseDetail.courseAppointmentStatus, this.escapeForHtml(JSON.stringify(this.dataContent)), this.escapeForHtml(JSON.stringify(this.dataSubscription)))
        this.html = ''
        this.html = btn
      }
    })
  }

  updateSubscriptionCourseAppointmentReversalListener = event => {
    event.detail.fetch.then(courseDetail => {
      if (this.dataset.id === event.detail.id) {
        debugger
        const btn = this.renderTileActionButton(subscriptionMode[this.dataSubscription.subscriptionMode], courseDetail.courseAppointmentStatus, this.escapeForHtml(JSON.stringify(this.dataContent)), this.escapeForHtml(JSON.stringify(this.dataSubscription)))
        this.html = ''
        this.html = btn
      }
    })
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
  renderHTML (content, subscription) {
    console.log(content, subscription)
    this.wrapper = this.root.querySelector('div') || document.createElement('div')
    const btn = this.renderTileActionButton(subscriptionMode[subscription.subscriptionMode], content.courseAppointmentStatus, this.escapeForHtml(JSON.stringify(content)), this.escapeForHtml(JSON.stringify(subscription)))
    this.html = btn
  }

  escapeForHtml = (htmlString) => {
    return htmlString
      .replaceAll(/&/g, '&amp;')
      .replaceAll(/</g, '&lt;')
      .replaceAll(/>/g, '&gt;')
      .replaceAll(/"/g, '&quot;')
      .replaceAll(/'/g, '&#39;')
  }

  renderTileActionButton (subscriptionMode, status, content, selectedSubscription) {
    const btnBooking = `<ks-a-button namespace="button-primary-" id="show-modal" request-event-name="request-subscription-course-appointment-detail" tag='[${content},${selectedSubscription}, ${JSON.stringify({ type: 'booking' })}]' color="secondary">COM-Termin buchen</ks-a-button>`
    const btnCancel = `<ks-a-button namespace="button-secondary-" id="show-modal" request-event-name="request-subscription-course-appointment-detail" tag='[${content},${selectedSubscription}, ${JSON.stringify({ type: 'cancel' })}]' color="secondary"><a-icon-mdx icon-name="Trash" size="1em" class="icon-left"></a-icon-mdx>X0X-Stornieren</ks-a-button>`

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
