// @ts-check
import Index from './Index.js'

/**
 * Dashboard
 *
 * @export
 * @class Dashboard
 * @type {CustomElementConstructor}
 */
export default class Dashboard extends Index {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
    // this.renderHTML()
  }

  disconnectedCallback () {
    // document.body.removeEventListener('update-bookings', this.requestBookingsListener)
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
      path: `${this.importMetaUrl}../components/organisms/dashboard/Dashboard.js`,
      name: 'kp-o-dashboard'
    }])
    this.html = /* html */ '<kp-o-dashboard namespace="dashboard-default-"></kp-o-dashboard>'
  }
}
