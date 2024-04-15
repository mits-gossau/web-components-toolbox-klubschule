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
   * @param {Object} options
   * @param {any} args
   */
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderHTML()) this.renderHTML()
    if (this.shouldRenderCSS()) this.renderCSS()
  }

  shouldRenderHTML () {
    return !this.appointmentList
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  renderHTML () {
    this.fetchModules([
      {
        path: `${this.importMetaUrl}../components/molecules/appointmentsList/AppointmentsList.js`,
        name: 'm-appointments-list'
      }
    ])
    this.html = '<m-appointments-list namespace="appointments-list-default-"></m-appointments-list>'
  }

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
