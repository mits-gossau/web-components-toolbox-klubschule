// @ts-check
import { Shadow } from '../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * Appointment List
 *
 * @export
 * @class AppointmentList
 * @type {CustomElementConstructor}
 */
export default class AppointmentList extends Shadow() {
  /**
   * @param {any} args
   */
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    this.hidden = true
    const showPromises = []
    if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
    if (this.shouldRenderHTML()) showPromises.push(this.renderHTML())
    Promise.all(showPromises).then(() => {
      this.hidden = false
    })
  }

  shouldRenderHTML () {
    return !this.appointmentWrapper
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * renders the html
   * @return {Promise<void>}
   */
  renderHTML () {
    this.appointmentWrapper = this.root.querySelector('div') || document.createElement('div')
    this.html = /* html */`
        <h1>Abo-Termine buchen</h1>
      `
  }

  /**
   * renders the m-Teaser css
   *
   * @return {Promise<void>}
   */
  renderCSS () {
    this.css = /* css */`
    :host {}
    :host h1 {
      font-size:50px;
    }
    @media only screen and (max-width: _max-width_) {
      :host {}
    }
    `
  }
}
