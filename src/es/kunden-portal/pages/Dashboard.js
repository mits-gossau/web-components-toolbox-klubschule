// @ts-check
import Index from './Index.js'

/**
 * Appointment List
 *
 * @export
 * @class Dashboard
 * @type {CustomElementConstructor}
 */
export default class Dashboard extends Index {
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
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  renderHTML () {
    // this.fetchModules([
    //   {
    //     path: `${this.importMetaUrl}../components/molecules/appointmentsList/AppointmentsList.js`,
    //     name: 'm-appointments-list'
    //   }
    // ])
    this.html = '<h1>Dashboard</h1>'
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
