// @ts-check
import Index from './Index.js'

/**
 * Subscriptions
 *
 * @export
 * @class SubscriptionList
 * @type {CustomElementConstructor}
 */
export default class SubscriptionList extends Index {
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
    return !this.subscriptionsList
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  renderHTML () {
    this.fetchModules([
      {
        path: `${this.importMetaUrl}../components/molecules/subscriptionsList/SubscriptionsList.js`,
        name: 'm-subscriptions-list'
      }
    ])
    this.html = '<m-subscriptions-list namespace="subscriptions-list-default-" data-request-subscription="request-subscriptions" data-list-type="subscriptions"></m-subscriptions-list>'
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

  get subscriptionsList () {
    return this.root.querySelector('m-subscriptions-list')
  }
}
