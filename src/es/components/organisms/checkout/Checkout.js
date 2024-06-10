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

    /**
     * Replace label text
     * @param {*} event 
     */
    this.checkoutConfigurationListener = (event) => {
      event.detail.fetch.then(insuranceData => {
        this.labelWithInsurance = this.root.querySelector('label[insurance-label]');
        this.labelWithInsurance.innerHTML = insuranceData.annulationskostenversicherungLabel;
      })
    }
  }

  connectedCallback () {
    if (this.shouldRenderHTML()) this.renderHTML()
  }

  disconnectedCallback () {}

  shouldRenderHTML () {
    return !this.componentWasRendered
  }

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
      input.addEventListener('change', (event) => {
        this.dispatchEvent(new CustomEvent('request-checkout-configuration', {
          detail: {
            withInsurance: event.currentTarget.value
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }))
      })
    })

    this.componentWasRendered = true;
  }
}
