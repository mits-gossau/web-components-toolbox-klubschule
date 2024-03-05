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
    constructor(options = {}, ...args) {
        super({
            importMetaUrl: import.meta.url,
            mode: 'false',
            ...options
        }, ...args)
        const withFacetCache = new Map()

        const numberOfOffers = 123

        this.abortController = null
        this.isMocked = this.hasAttribute('mock')
        this.requestWithFacetListener = (event) => {
            if (event.detail?.mutationList && event.detail.mutationList[0].attributeName !== 'checked') return
            const request = `{"MandantId":111, "filters": [
              ${event.detail?.wrapper.filterItem
                ? `{
                  "id": ${event.detail?.wrapper.filterItem.id},
                  "disabled": ${event.detail?.wrapper.filterItem.disabled},
                  "visible": ${event.detail?.wrapper.filterItem.visible},
                  "children": [
                    ${event.detail?.wrapper.filterItem.children.map(child => `{
                      "label": ${child.label},
                      "id": ${child.id},
                      ${child.count ? `"count": ${child.count},` : ''}
                      "urlpara": ${child.urlpara},
                      "selected": ${child.selected},
                      "hasChilds": ${child.hasChilds},
                    }`)}
                    }
                  ]
                }`
                : ''
              }
            ]}`

            // @ts-ignore
            console.log(request, self.data = event.detail?.wrapper.filterItem)
            const url = this.isMocked ?
                `${this.importMetaUrl}./mock/default.json` :
                `${this.getAttribute('endpoint') || 'https://miducabulaliwebappdev.azurewebsites.net/api/CourseSearch/withfacet'}`

            let requestInit = {}
            if (this.isMocked) {
                requestInit = {
                    method: 'GET'
                }
            } else {
                requestInit = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    body: request
                }
            }

            this.dispatchEvent(new CustomEvent('with-facet', {
                detail: {
                    /** @type {Promise<fetchAutoCompleteEventDetail>} */
                    fetch: withFacetCache.has(url) ?
                        withFacetCache.get(url)
                        // TODO: withFacetCache key must include all variants as well as future payloads
                        // TODO: know the api data change cycle and use timestamps if that would be shorter than the session life time
                        :
                        withFacetCache.set(url, fetch(url, requestInit).then(response => {
                            console.log('response', response)
                            if (response.status >= 200 && response.status <= 299) {
                                // Promise.resolve(response.json()).then(data => {
                                //   console.log('data', data)
                                // })

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

        const numberOfOffersElement = this.root.querySelector('.button-show-all-offers')
        console.log('numberOfOffersElement', numberOfOffersElement)
        if (numberOfOffers > 0 && numberOfOffersElement) {
            console.log('numberOfOffersElement.innerHTML', numberOfOffersElement.innerHTML)
            numberOfOffersElement.innerHTML = `(${numberOfOffers}) ` + numberOfOffersElement.innerHTML
        }
    }

    connectedCallback() {
        this.addEventListener('request-with-facet', this.requestWithFacetListener)
    }

    disconnectedCallback() {
        this.removeEventListener('request-with-facet', this.requestWithFacetListener)
    }
}