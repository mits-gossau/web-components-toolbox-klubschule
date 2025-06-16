// @ts-check

/** @typedef {{
  term: string,
  typ: 1|2 // TYP 1 ist Kurs, TYP 2 ist Sparte
}} Item */

/** @typedef {{
  total: number,
  success: boolean,
  searchText: string,
  items: Item[],
  cms: []
}} fetchAutoCompleteCheckout */

/* global fetch */
/* global self */
/* global CustomEvent */

import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * Checkout are retrieved via the corresponding endpoint as set as an attribute
 * As a controller, this component communicates exclusively through events
 * Example: web-components-toolbox-klubschule
 *
 * @export
 * @class Checkout
 * @type {CustomElementConstructor}
 */
export default class Checkout extends Shadow() {
  constructor (options = {}, ...args) {
    super({
      importMetaUrl: import.meta.url,
      mode: 'false',
      ...options
    }, ...args)

    const initialRequest = this.getAttribute('initial-request')
    const initialRequestObjFrozen = Object.freeze(JSON.parse(initialRequest.replaceAll("'", '"')))
    this.selectedOptions = initialRequestObjFrozen.selectedLehrmittel
    this.withInsurance = initialRequestObjFrozen.mitVersicherung

    this.requestCheckoutListener = (event) => {
      // get value from select

      if (event.detail && 'withInsurance' in event.detail) {
        this.withInsurance = event.detail?.withInsurance
      }

      if (event.detail?.id && event.detail?.value) {
        const hadActiveSelection = this.selectedOptions.find(({ lehrmittelId }) => Number(event.detail.id) === Number(lehrmittelId))
        hadActiveSelection
          ? hadActiveSelection.lehrmittelOption = event.detail.value
          : this.selectedOptions.push({
            lehrmittelId: event.detail?.id,
            lehrmittelOption: event.detail?.value
          })
      }

      const changedRequest = Object.assign({}, initialRequestObjFrozen)
      changedRequest.mitVersicherung = this.withInsurance
      changedRequest.selectedLehrmittel = this.selectedOptions

      // todo emit event with changed data
      this.dispatchEvent(
        new CustomEvent(
          'checkout-configuration',
          {
            detail: {
              fetch: fetch(this.getAttribute('endpoint') || 'https://dev.klubschule.ch/umbraco/api/CommerceApi/Recalculate', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify(changedRequest)
              }).then(response => {
                if (response.status >= 200 && response.status <= 299) return response.json()
                throw new Error(response.statusText)
              })
            },
            bubbles: true,
            cancelable: true,
            composed: true
          }
        )
      )
    }
  }

  connectedCallback () {
    this.addEventListener('request-checkout-configuration', this.requestCheckoutListener)
  }

  disconnectedCallback () {
    this.removeEventListener('request-checkout-configuration', this.requestCheckoutListener)
  }
}
