// @ts-check
import Index from './Index.js'

/* global CustomEvent */

/**
 * Subscriptions
 *
 * @export
 * @class SubscriptionList
 * @type {CustomElementConstructor}
 */
export default class SubscriptionList extends Index {
  /**
   * @param {any} args
   */
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    document.body.addEventListener(this.getAttribute('update-subscriptions') || 'update-subscriptions', this.subscriptionsListener)
    this.hidden = true
    const showPromises = []
    if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
    Promise.all(showPromises).then(() => {
      this.hidden = false
      this.dispatchEvent(new CustomEvent('request-subscriptions',
        {
          detail: {
            subscriptionType: '',
            userId: ''
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }
      ))
    })
  }

  disconnectedCallback () {
    document.body.removeEventListener(this.getAttribute('update-subscriptions') || 'update-subscriptions', this.subscriptionsListener)
  }

  subscriptionsListener = async (/** @type {{ detail: { fetch: Promise<any>; }; }} */ event) => {
    console.log('subscriptionsListener', event)
    event.detail.fetch.then((/** @type {any} */ subscriptions) => {
      console.log(subscriptions)
      this.html = ''
      this.renderHTML(subscriptions)
    }).catch((/** @type {any} */ error) => {
      console.error(error)
      this.html = ''
      this.html = '<span style="color:red;">🤦‍♂️ Uh oh! The fetch failed! 🤦‍♂️</span>'
    })
  }

  shouldRenderHTML () {
    return !this.subscriptionsWrapper
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * renders the html
   * @return void
   */
  renderHTML (subscriptionsData) {
    console.log('subscriptionsData', subscriptionsData)
    this.subscriptionsWrapper = this.root.querySelector('div') || document.createElement('div')

    this.html = /* html */`
        <h1>Meine Abonnemente</h1>
      `
  }

  /**
   * renders the css
   *
   * @return void
  */
  renderCSS () {
    this.css = /* css */`
    :host {}
    :host h1 {
      font-size:10px;
    }
    @media only screen and (max-width: _max-width_) {
      :host {}
    }
    `
  }
}
