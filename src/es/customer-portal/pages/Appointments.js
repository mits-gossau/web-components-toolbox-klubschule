// @ts-check
import Index from './Index.js'

/**
 * Appointment List
 *
 * @export
 * @class AppointmentList
 * @type {CustomElementConstructor}
 */
export default class AppointmentList extends Index {
  /**
   * @param options
   * @param {any} args
   */
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderHTML()) this.renderHTML()
    if (this.shouldRenderCSS()) this.renderCSS()
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML () {
    return !this.appointmentList
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * renders the html
   * @return void
   */
  renderHTML () {
    this.html = /* html */ '<m-appointments-list namespace="appointments-list-default-"></m-appointments-list>'
    this.fetchModules([
      {
        path: `${this.importMetaUrl}../components/molecules/appointmentsList/AppointmentsList.js`,
        name: 'm-appointments-list'
      }
    ])
  }

  /**
   * renders the css
   *
   * @return void
   */
  renderCSS () {
    this.css = /* css */`
    :host {}
    @media only screen and (max-width: _max-width_) {
      :host {}
    }
    `
  }

  get appointmentList () {
    return this.root.querySelector('m-appointments-list')
  }
}
