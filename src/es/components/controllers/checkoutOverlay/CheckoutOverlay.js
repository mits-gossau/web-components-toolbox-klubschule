
/* global fetch */
/* global self */
/* global CustomEvent */

// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * CheckoutOverlay are retrieved via the corresponding endpoint as set as an attribute
 * As a controller, this component communicates exclusively through events
 * Example: web-components-toolbox-klubschule
 *
 * @export
 * @class CheckoutOverlay
 * @type {CustomElementConstructor}
 */
export default class CheckoutOverlay extends Shadow() {
  constructor (options = {}, ...args) {
    super({
      importMetaUrl: import.meta.url,
      mode: 'false',
      ...options
    }, ...args)

    this.requestCheckoutOverlayListener = (event) => {
      event.detail.resolveCheckout(fetch(event.detail.checkoutOverlayAPI, {
        method: 'GET'
      }).then(response => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json()
        }
        throw new Error(response.statusText)
      }))
    }
  }

  connectedCallback () {
    this.addEventListener('checkout-overlay-api', this.requestCheckoutOverlayListener)
  }

  disconnectedCallback () {
    this.removeEventListener('checkout-overlay-api', this.requestCheckoutOverlayListener)
  }
}
