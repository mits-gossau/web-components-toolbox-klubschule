// @ts-check
import Index from './Index.js'

/**
 * BookingsBooked
 *
 * @export
 * @class BookingsBooked
 * @type {CustomElementConstructor}
 */
export default class BookingsBooked extends Index {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
  }

  shouldRenderHTML () {
    return this.dashboard
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  get dashboard () {
    return !this.root.querySelector('kp-o-dashboard')
  }

  renderCSS () {}

  renderHTML () {
    this.fetchModules([{
      path: `${this.importMetaUrl}../components/organisms/BookingsBooked/BookingsBooked.js`,
      name: 'kp-o-bookings-booked'
    }])
    this.html = ''
    this.html = /* html */ '<kp-o-bookings-booked namespace="bookings-booked-default-"></kp-o-bookings-booked>'
  }
}
