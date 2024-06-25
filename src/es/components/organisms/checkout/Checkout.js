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
      console.log("triggered")
      event.detail.fetch.then(insuranceData => {
        this.labelWithInsurance = this.root.querySelector('label[insurance-label]')
        this.labelWithInsurance.innerHTML = insuranceData.annulationskostenversicherungLabel
      })
    }

    this.triggeredByListener = event => {
      let trigger = event.detail.element;
      let triggeredElement = this.root.querySelector(`input[type="checkbox"][triggered-by="${trigger.id}"]`);

      if (triggeredElement) {
        if (event.detail.element.checked && !triggeredElement.checked || !event.detail.element.checked && triggeredElement.checked) triggeredElement.click()
        triggeredElement.closest('.wrap').classList[event.detail.element.checked ? 'add' : 'remove']('disabled')
      }
    }
  }

  connectedCallback () {
    if (this.shouldRenderHTML()) this.renderHTML()
    this.root.addEventListener('triggered-by', this.triggeredByListener)
    document.body.addEventListener('checkout-configuration', this.checkoutConfigurationListener)
  }
    
  disconnectedCallback () {
    this.root.removeEventListener('triggered-by', this.triggeredByListener)
    document.body.removeEventListener('checkout-configuration', this.checkoutConfigurationListener)
  }

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
              id: changeEvent.currentTarget.dataset.lehrmittelId,
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

    this.componentWasRendered = true
  }
}
