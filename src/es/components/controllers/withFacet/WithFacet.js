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
    
    const withFacetCache = new Map()

    this.abortController = null
    this.requestWithFacetListener = (event) => {
      // console.log('request-with-facet', event.detail)
      if (event.detail?.mutationList && event.detail.mutationList[0].attributeName !== 'checked') return
      const url = this.hasAttribute('mock')
        ? `${this.importMetaUrl}./mock/default.json`
        : `${this.getAttribute('endpoint') || 'https://dev.klubschule.ch/Umbraco/Api/coursesearch/withfacet'}`

      this.dispatchEvent(new CustomEvent('with-facet', {
        detail: {
          /** @type {Promise<fetchAutoCompleteEventDetail>} */
          fetch: withFacetCache.has(url)
           ? withFacetCache.get(url)
           // TODO: withFacetCache key must include all variants as well as future payloads
           // TODO: know the api data change cycle and use timestamps if that would be shorter than the session life time
           : withFacetCache.set(url, fetch(url, {
              method: 'GET'
            }).then(response => {
              if (response.status >= 200 && response.status <= 299) {
                // console.log('response', response.status, response.statusText, response)
                return response.json()
              }
              throw new Error(response.statusText)
            })).get(url)
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
