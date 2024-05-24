// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Checkout
* @type {CustomElementConstructor}
*/
export default class Checkout extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.checkoutConfigurationListener = (event) => {
      console.log(event)
    }
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
    document.body.addEventListener('checkout-configuration', this.checkoutConfigurationListener)
  }

  disconnectedCallback () {
    // this.removeEventListener('checkout-configuration', this.checkoutConfigurationListener)
  }

  shouldRenderCSS () {
    return true
  }

  shouldRenderHTML () {
    return true
  }

  renderCSS () {}

  renderHTML () {
    const children = this.root.querySelectorAll('select')
    Array.from(children).forEach(select => {
      select.addEventListener('change', (changeEvent) => {
        this.dispatchEvent(new CustomEvent('request-checkout-configuration',
          {
            detail: {
              id: changeEvent.currentTarget.id,
              value: changeEvent.currentTarget.value
            },
            bubbles: true,
            cancelable: true,
            composed: true
          }
        ))
      })
    })

    const radioInputs = this.root.querySelectorAll('input[type=radio]')
    Array.from(radioInputs).forEach(input => {
      input.addEventListener('change', () => {
        this.dispatchEvent(new CustomEvent('request-checkout-configuration', {
          bubbles: true,
          cancelable: true,
          composed: true
        }))
      })
    })
  }
}
