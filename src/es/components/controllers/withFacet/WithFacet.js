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
}} fetchAutoCompleteEventDetail */

/* global fetch */
/* global AbortController */
/* global CustomEvent */

import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* WithFacet are retrieved via the corresponding endpoint as set as an attribute
* As a controller, this component communicates exclusively through events
* Example: web-components-toolbox-klubschule
*
* @export
* @class WithFacet
* @type {CustomElementConstructor}
*/
export default class WithFacet extends Shadow() {
  constructor (options = {}, ...args) {
    super({
      importMetaUrl: import.meta.url,
      mode: 'false',
      ...options
    }, ...args)
    
    this.abortController = null
    this.requestWithFacetListener = () => {
      if (this.abortController) this.abortController.abort()
      this.abortController = new AbortController()
      this.dispatchEvent(new CustomEvent('with-facet', {
        detail: {
          /** @type {Promise<fetchAutoCompleteEventDetail>} */
          fetch: fetch(this.hasAttribute('mock')
            ? `${this.importMetaUrl}./mock/default.json`
            : `${this.getAttribute('endpoint') || 'https://dev.klubschule.ch/Umbraco/Api/coursesearch/withfacet'}`, {
          method: 'GET',
          signal: this.abortController.signal
        }).then(response => {
          if (response.status >= 200 && response.status <= 299) return response.json()
          throw new Error(response.statusText)
        })
      },
        bubbles: true,
        cancelable: true,
        composed: true
      }))
    }
  }

  connectedCallback () {
    this.addEventListener('request-with-facet', this.requestWithFacetListener)
  }

  disconnectedCallback () {
    this.removeEventListener('request-with-facet', this.requestWithFacetListener)
  }
}
