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
        this.labelWithInsurance = this.root.querySelector('label[insurance-label]')
        this.labelWithInsurance.innerHTML = insuranceData.annulationskostenversicherungLabel
      })
    }
  }

  connectedCallback () {
    if (this.shouldRenderHTML()) this.renderHTML()

    this.root.addEventListener('triggered-by', (event) => {
      let trigger = event.detail.element;
      let triggeredElement = this.root.querySelector(`input[type="checkbox"][triggered-by="${trigger.id}"]`);
      let visibleTrigger = this.root.querySelector(`div[visible-by="${triggeredElement.id}"]`);

      if (triggeredElement) {
        if (trigger.checked) {
          if (!triggeredElement.checked) {
            triggeredElement.checked = true;
            triggeredElement.closest('.wrap').classList.add('disabled');
            visibleTrigger.removeAttribute('hidden');
          }
        } else {
          if (triggeredElement.checked) {
            triggeredElement.checked = false;
            triggeredElement.closest('.wrap').classList.remove('disabled');
            visibleTrigger.setAttribute('hidden', 'true');
          }
        }
      }
    })
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
              id: changeEvent.currentTarget.dataset.lehrmitttelId,
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
