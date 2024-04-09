// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'
import { courseAppointmentStatusMapping } from '../../../helpers/mapping.js'

/**
* @export
* @class CourseInfo
* @type {CustomElementConstructor}
*/
export default class CourseInfo extends Shadow() {
  /**
   * @param {any} args
   */
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this.dataContent = null
    this.icon = null
  }

  connectedCallback () {
    this.dataContent = JSON.parse(this.dataset.content)
    const tileStatus = this.getTileState(this.dataContent)
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML(tileStatus)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
  }

  disconnectedCallback () {
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
  }

  updateSubscriptionCourseAppointmentBookingListener = event => {
    event.detail.fetch.then(courseDetail => {
      if (this.dataset.id * 1 === event.detail.id) {
        //
        const st = this.getTileState(courseDetail)
        this.html = ''
        this.renderHTML(st)
      }
    })
  }

  updateSubscriptionCourseAppointmentReversalListener = event => {
    event.detail.fetch.then(courseDetail => {
      if (this.dataset.id * 1 === event.detail.id) {
        //
        const st = this.getTileState(courseDetail)
        this.html = ''
        this.renderHTML(st)
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
    return !this.icon
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        display:flex;
        align-items: center;
      }
      :host .content {
        padding: 0 0.5em;
      }
      :host .success {
        color:#00997F;
      }
      :host .alert {
        color:#F4001B;
      }
      :host a-icon-mdx {
        color: var(--mdx-sys-color-primary-default);
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
  renderHTML (data) {
    this.icon = `<a-icon-mdx icon-name="${data.icon}" size="1.5em" tabindex="0" class="${data.css.status}"></a-icon-mdx>`
    this.html = `
      ${this.icon}
      <span class="content">
        <span class="${data.css.status}">${data.status}</span>
        <span class="${data.css.info}">${data.info}</span>
      </span>`
  }

  getTileState (data) {
    const type = courseAppointmentStatusMapping[data.courseAppointmentStatus]
    const { courseAppointmentFreeSeats } = data

    return {
      css: type.css,
      status: data.courseAppointmentStatus === 1 ? courseAppointmentFreeSeats * 1 : type.content.status,
      info: type.content.info,
      icon: type.content.icon
    }
  }
}
