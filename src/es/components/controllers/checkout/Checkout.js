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
  constructor(options = {}, ...args) {
    super({
      importMetaUrl: import.meta.url,
      mode: 'false',
      ...options
    }, ...args)

    this.selectedOptions = []

    this.requestCheckoutListener = (event) => {
      // get value from select
      let initialRequest = this.getAttribute('initial-request')
      const initialRequestObjFrozen = Object.freeze(JSON.parse(initialRequest.replaceAll("'", '"')))
      const basicRequest = `
        "portalId": ${initialRequestObjFrozen.portalId},
        "mandantId": ${initialRequestObjFrozen.mandantId},
        "kursTyp": "${initialRequestObjFrozen.kursTyp}",
        "kursId": ${initialRequestObjFrozen.kursId},
        "centerId": ${initialRequestObjFrozen.centerId},
        "spracheId": "${initialRequestObjFrozen.spracheId}"
      `
      if (event.detail?.id && event.detail?.value) {
        const hadActiveSelection = this.selectedOptions.find(({ lehrmittelId }) => event.detail.id === lehrmittelId)
        hadActiveSelection ? hadActiveSelection.lehrmittelOption = event.detail.value : this.selectedOptions.push({
          lehrmittelId: event.detail?.id,
          lehrmittelOption: event.detail?.value
        })
      }

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
                body: this.selectedOptions.length ? `{
                    ${basicRequest},
                    "selectedLehrmittel": [${this.selectedOptions.reduce((acc, selectedOption, index) => acc + `${JSON.stringify(selectedOption)}${this.selectedOptions.length - 1 === index ? "" : ","}`, "")}]
                  }` : `{
                    ${basicRequest}
                  }`
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

  connectedCallback() {
    this.addEventListener('request-checkout-configuration', this.requestCheckoutListener)
  }

  disconnectedCallback() {
    this.removeEventListener('request-checkout-configuration', this.requestCheckoutListener)
  }
}
