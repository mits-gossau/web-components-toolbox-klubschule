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

        this.numberOfOffers = 0

        this.abortController = null
        this.isMocked = this.hasAttribute('mock')
        this.requestWithFacetListener = (event) => {
            if (event.detail?.mutationList && event.detail.mutationList[0].attributeName !== 'checked') return

            const request = `{"MandantId":${this.getAttribute('mandant-id')}, "filters": [
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
            console.log('request (WithFacet.js)', request, self.data = event.detail?.wrapper.filterItem)
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
                    fetch: withFacetCache.has(request) ?
                        withFacetCache.get(request)
                        // TODO: withFacetCache key must include all variants as well as future payloads
                        // TODO: know the api data change cycle and use timestamps if that would be shorter than the session life time
                        :
                        withFacetCache.set(request, fetch(url, requestInit).then(response => {
                            if (response.status >= 200 && response.status <= 299) {
                                console.log('response (WithFacet.js)', response)
                                return response.json()
                            }
                            throw new Error(response.statusText)
                        }).then(json => {
                            const filterData = json.filters
                            let numberOfOffers = 0
                            filterData.forEach((filterItem, i) => {
                                if (filterItem.children && filterItem.children.length > 0 && filterItem.visible) {
                                    filterItem.children.forEach(child => {
                                        if (child.selected && child.count > 0) {
                                            numberOfOffers += child.count
                                        }
                                    })
                                }
                            })
                            return {...json, numberOfOffers}
                        })).get(request)
                },
                bubbles: true,
                cancelable: true,
                composed: true
            }))
        }
    }

    connectedCallback() {
        this.addEventListener('request-with-facet', this.requestWithFacetListener)
    }

    disconnectedCallback() {
        this.removeEventListener('request-with-facet', this.requestWithFacetListener)
    }
}