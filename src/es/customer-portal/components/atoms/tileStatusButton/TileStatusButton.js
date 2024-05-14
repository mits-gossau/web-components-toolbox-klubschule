// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'
import { escapeForHtml } from '../../../helpers/Shared.js'

/**
* @export
* @class StatusButton
* @type {CustomElementConstructor}
*/
export default class StatusButton extends Shadow() {
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
    if (this.dataset.id === event.detail.id) {
      event.detail.fetch.then(courseDetail => {
        const btn = this.renderTileActionButton(courseDetail.courseAppointmentStatus, escapeForHtml(JSON.stringify(this.dataContent)), escapeForHtml(JSON.stringify(this.dataSubscription)))
        this.html = ''
        this.html = btn
      })
    }
  }

  updateSubscriptionCourseAppointmentReversalListener = event => {
    if (this.dataset.id === event.detail.id) {
      event.detail.fetch.then(courseDetail => {
        const btn = this.renderTileActionButton(courseDetail.courseAppointmentStatus, escapeForHtml(JSON.stringify(this.dataContent)), escapeForHtml(JSON.stringify(this.dataSubscription)))
        this.html = ''
        this.html = btn
      })
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
    this.wrapper = this.root.querySelector('div') || document.createElement('div')
    if (this.dataset.listType === 'subscriptions') {
      this.html = /* html */ `<ks-a-button namespace="button-primary-" id="show-modal" request-event-name="request-subscription-detail" tag='[${escapeForHtml(JSON.stringify(content))}, ${escapeForHtml(JSON.stringify(content))}, ${JSON.stringify({ type: 'subscriptions' })}]' color="secondary"><a-translation data-trans-key='CP.cpSubscriptionRenew'/></a-translation></ks-a-button>`
    } else {
      this.html = this.renderTileActionButton(content.courseAppointmentStatus, escapeForHtml(JSON.stringify(content)), escapeForHtml(JSON.stringify(subscription)))
    }
  }

  /**
   * Generates HTML code for a button - based on the provided status, content, and selected subscription.
   * @param {number} status - Appointment status (1-6).
   * @param {string} content - Tag data
   * @param {string} selectedSubscription - Tag data
   * @returns {string} Returns an HTML button element
   */
  renderTileActionButton (status, content, selectedSubscription) {
    switch (status) {
      case 1:
        return /* html */ `<ks-a-button namespace="button-primary-" id="show-modal" request-event-name="request-subscription-course-appointment-detail" tag='[${content},${selectedSubscription}, ${JSON.stringify({ type: 'booking' })}]' color="secondary"><a-translation data-trans-key='CP.cpBookAppointment'/></a-translation></ks-a-button>`
      case 5:
        return /* html */ `<ks-a-button namespace="button-secondary-" id="show-modal" request-event-name="request-subscription-course-appointment-detail" tag='[${content},${selectedSubscription}, ${JSON.stringify({ type: 'reversal' })}]' color="secondary"><a-icon-mdx icon-name="Trash" size="1em" class="icon-left"></a-icon-mdx><a-translation data-trans-key='CP.cpBookedStatus5'/></a-translation></ks-a-button>`
      default:
        return ''
    }
  }
}
