// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'
import { courseAppointmentStatusMapping } from '../../../helpers/Mapping.js'
import { getTileState } from '../../../helpers/Shared.js'

/**
* @class CourseInfo
* @type {CustomElementConstructor}
*/
export default class CourseInfo extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this.dataContent = null
    this.icon = null
  }

  connectedCallback () {
    this.dataContent = JSON.parse(this.dataset.content)
    const tileState = getTileState(courseAppointmentStatusMapping[this.dataContent.courseAppointmentStatus], this.dataContent)
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML(tileState)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
  }

  disconnectedCallback () {
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.updateSubscriptionCourseAppointmentReversalListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
  }

  updateSubscriptionCourseAppointmentBookingListener = event => {
    if (this.dataset.id === event.detail.id) {
      event.detail.fetch.then(courseDetail => {
        this.html = ''
        const tileState = getTileState(courseAppointmentStatusMapping[courseDetail.courseAppointmentStatus], courseDetail)
        this.renderHTML(tileState)
      })
    }
  }

  updateSubscriptionCourseAppointmentReversalListener = event => {
    if (this.dataset.id === event.detail.id) {
      event.detail.fetch.then(courseDetail => {
        this.html = ''
        const tileState = getTileState(courseAppointmentStatusMapping[courseDetail.courseAppointmentStatus], courseDetail)
        this.renderHTML(tileState)
      })
    }
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  shouldRenderHTML () {
    return !this.icon
  }

  renderCSS () {
    this.css = /* css */`
    :host {
      --svg-height: ${this.dataset.iconSize || 'auto'};
      display: flex;
      align-items: center;
    }
    :host .content {
      padding: 0 0.75em;
    }
    :host .success {
      color: var(--success, green);
    }
    :host .alert {
      color: var(--alert, red);
    }
    :host a-icon-mdx {
      color: var(--icon-color, black);
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
      case 'course-info-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`,
          namespace: false
        }, ...styles])
      default:
        return this.fetchCSS(styles)
    }
  }

  renderHTML (data) {
    const { icon, css, status, info } = data
    const hasDash = (status && info) && !Number(status) ? ' - ' : ''
    this.icon = this.root.querySelector('a-icon-mdx') || /* html */ `<a-icon-mdx icon-name="${icon}" size="var(--course-info-default-svg-height)" class="${css.status}"></a-icon-mdx>`
    this.html = /* html */`
      ${this.icon}
      <span class="content">
        <span class="${css.status}">${status}</span>
        <span class="${css.info}">${hasDash}${info}</span>
      </span>`
  }
}
