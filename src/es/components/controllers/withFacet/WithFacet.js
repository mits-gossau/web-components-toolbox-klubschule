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
/* global self */
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

    this.isMocked = this.hasAttribute('mock')
    this.requestWithFacetListener = (event) => {
      if (event.detail?.mutationList && event.detail.mutationList[0].attributeName !== 'checked') return

      console.log('---------------------------------event', event)

      let selectedFilter = ''
      const filters = []
      const filter = this.constructFilterItem(event)
      if (filter) filters.push(filter)
      
      // update filters according to url params
      const url = new URL(self.location.href)
      const params = new URLSearchParams(url.search)
      
      if (params) {
        const entriesWithUnderscore = [...params.entries()].filter(([key, value]) => key.includes('_') && value.includes('_'))
        
        entriesWithUnderscore.forEach(([key, value]) => {
            // console.log(`Key: ${key}, Value: ${value}`)
            const [urlparaKey, idKey] = key.split('_')
            const [urlparaValue, idValue] = value.split('_')

            const filter = (`{
                "urlpara": "${urlparaKey}",
                "id": "${idKey}",
                "selected": true,
                "children": [{
                    "urlpara": "${urlparaValue}",
                    "id": "${idValue}",
                    "selected": true
                }]
            }`)

            filters.push(filter)
        })
      }

      const request = `{
        "filter": ${filters.length > 0 ? `[${filters.join(',')}]` : '[]'},
        "mandantId": ${this.getAttribute('mandant-id') || 110}
        ${event.detail?.key === 'input-search' ? `,"searchText": "${event.detail.value}"` : ''}
      }`

      const apiUrl = this.isMocked
        ? `${this.importMetaUrl}./mock/default.json`
        : `${this.getAttribute('endpoint') || 'https://miducabulaliwebappdev.azurewebsites.net/api/CourseSearch/withfacet'}`

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
          fetch: withFacetCache.has(request)
            ? withFacetCache.get(request)
            // TODO: withFacetCache key must include all variants as well as future payloads
            // TODO: know the api data change cycle and use timestamps if that would be shorter than the session life time
            : withFacetCache.set(request, fetch(apiUrl, requestInit).then(response => {
              if (response.status >= 200 && response.status <= 299) {
                console.log('response (WithFacet.js)', response)
                return response.json()
              }
              throw new Error(response.statusText)
            }).then(json => {
              const filterData = json.filters
              let numberOfOffers = 0

              filterData.forEach(filterItem => {
                console.log('>>> ', filterItem.urlpara, ' <<<', filterItem)

                // set selected filter to url params
                if (filterItem.children && filterItem.children.length > 0 && filterItem.visible) {
                  const currentParams = params.get(filterItem.urlpara)?.split(',')
                  console.log('currentParams', filterItem.urlpara, currentParams)

                  filterItem.children.forEach(child => {
                    if (child.selected) {
                      console.log('selected:', child.urlpara)
                      // API does not answer with number of totals, the line below fixes that issue
                      if (child.count > 0) {
                        numberOfOffers += child.count
                      }
                      
                      const currentValues = params.get(filterItem.urlpara) || ''

                      if (!currentValues || !currentValues.includes(child.urlpara)) {
                        console.log('setting:', child.urlpara)
                        params.set(`${filterItem.urlpara}_${filterItem.id}`, `${currentValues + ',' || ''}${child.urlpara}_${child.id}`)
                      }
                    } else {
                      console.log('not selected:', child.urlpara)
                      const currentValues = params.get(filterItem.urlpara)?.split(',')
                      let index
                      if (currentValues) {
                        console.log(currentValues, currentValues.includes(child.urlpara))

                        if (currentValues.includes(child.urlpara)) {
                          console.log('removing:', child.urlpara)
                          console.log(index, currentValues)
                          index = currentValues.indexOf(child.urlpara)
                          currentValues.splice(index, 1)

                          params.set(`${filterItem.urlpara}_${filterItem.id}`, currentValues.join(','))
                        }
                        if (params.get(filterItem.urlpara) === '') {
                          console.log('deleting:', filterItem.urlpara)
                          params.delete(filterItem.urlpara)
                        }
                      }
                    }
                  })
                  
                  console.log('currentParams', filterItem.urlpara, params.get(filterItem.urlpara)?.split(','))
                  self.history.pushState({}, '', `${url.pathname}?${params.toString()}`)
                }
              })
              return { ...json, numberOfOffers }
            })).get(request)
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

  constructFilterItem (event) {
    const filterItem = event.detail?.wrapper?.filterItem

    return filterItem
      ? `{
        "children": [
          ${filterItem.children.map(child => {
            const count = child.count ? `(${child.count})` : ''
            const label = count ? `${child.label} ${count}` : child.label
            const hasSameLabel = label.trim() === event.detail?.target.label.trim()
            const isCheckedNullOrUndefined = event.detail?.target.checked === null || event.detail?.target.checked === undefined

            return `{
              ${child.count ? `"count": ${child.count},` : ''}
              ${child.eTag ? `"eTag": "${child.eTag.replace(/"/g, '\\"')}",` : ''}
              "hasChilds": ${child.hasChilds},
              "id": "${child.id}",
              "label": "${child.label}",
              ${child.partitionKey ? `"partitionKey": "${child.partitionKey}",` : ''}
              ${child.rowKey ? `"rowKey": "${child.rowKey}",` : ''}
              "selected": ${hasSameLabel ? isCheckedNullOrUndefined ? child.selected : event.detail.target.checked : child.selected},
              ${child.sort ? `"sort": ${child.sort},` : ''}
              ${child.timestamp ? `"timestamp": "${child.timestamp}",` : ''}
              ${child.typ ? `"typ": "${child.typ}",` : ''}
              "urlpara": "${child.urlpara}"
            }`
          })}
        ],
        ${filterItem.disabled ? `"disabled": ${filterItem.disabled},` : ''}
        ${filterItem.eTag ? `"eTag": "${filterItem.eTag.replace(/"/g, '\\"')}",` : ''}
        ${filterItem.hasChilds ? `"hasChilds": ${filterItem.hasChilds},` : ''}
        ${filterItem.id ? `"id": "${filterItem.id}",` : ''}
        ${filterItem.label ? `"label": "${filterItem.label}",` : ''}
        ${filterItem.options ? `"options": ${filterItem.options},` : ''}
        ${filterItem.partitionKey ? `"partitionKey": "${filterItem.partitionKey}",` : ''}
        ${filterItem.rowKey ? `"rowKey": "${filterItem.rowKey}",` : ''}
        ${filterItem.sort ? `"sort": ${filterItem.sort},` : ''}
        ${filterItem.timestamp ? `"timestamp": "${filterItem.timestamp}",` : ''}
        ${filterItem.typ ? `"typ": "${filterItem.typ}",` : ''}
        "visible": ${filterItem.visible || true}
      }`
      : ''
  }
}
