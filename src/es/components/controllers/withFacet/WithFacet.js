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
    let initialRequest = this.getAttribute('initial-request')
    this.url = new URL(self.location.href)
    this.params = new URLSearchParams(this.url.search)
    this.isMocked = this.hasAttribute('mock')
    const apiUrl = this.isMocked
      ? `${this.importMetaUrl}./mock/default.json`
      : `${this.getAttribute('endpoint') || 'https://miducabulaliwebappdev.azurewebsites.net/api/CourseSearch/withfacet'}`
    this.initialResponse = {}
    this.lastWithFacetRequest = null

    this.requestWithFacetListener = (event) => {
      if (event.detail?.mutationList && event.detail.mutationList[0].attributeName !== 'checked') return

      console.log('---------------------------------event', event, event.type === 'reset-all-filters' ? 'reset-all-filters' : 'request')

      let request; let shouldResetAllFilters; let isNextPage = false
      // ppage reuse last request
      if (event.detail?.ppage && this.lastWithFacetRequest) {
        request = JSON.stringify(Object.assign(JSON.parse(this.lastWithFacetRequest), { ppage: event.detail.ppage }))
        shouldResetAllFilters = false
        isNextPage = true
        this.updateURLParams()
      } else {
        shouldResetAllFilters = event.type === 'reset-all-filters'
        const shouldResetFilter = event.type === 'reset-filter'
        this.filters = []
        const filter = this.constructFilterItem(event)
        if (filter) this.filters.push(filter)

        if (shouldResetAllFilters) {
          initialRequest = JSON.stringify(Object.assign(JSON.parse(initialRequest), { shouldResetAllFilters }))
          this.removeAllFilterParamsFromURL()
        }

        if (shouldResetFilter) {
          const filterParent = event.detail.this.getAttribute('filter-parent')
          this.params.delete(`${filterParent}`)
          self.history.pushState({}, '', `${this.url.pathname}?${this.params.toString()}`)
        }

        this.updateURLParams()

        const filterRequest = `{
          "filter": ${this.filters.length > 0 ? `[${this.filters.join(',')}]` : '[]'},
          "mandantId": ${this.getAttribute('mandant-id') || 110}
          ${event.detail?.key === 'input-search' ? `,"searchText": "${event.detail.value}"` : ''}
          ${event.detail?.key === 'location-search' ? `,"clat": "${event.detail.lat}"` : ''}
          ${event.detail?.key === 'location-search' ? `,"clong": "${event.detail.lng}"` : ''}
        }`

        request = this.lastWithFacetRequest = this.filters.length > 0 ? filterRequest : initialRequest
      }

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
                return response.json()
              }
              throw new Error(response.statusText)
            }).then(json => {
              // store initial response
              if (!this.filters.length || this.filters.length === 0) {
                this.initialResponse = json
              }

              // url kung fu
              json.filters.forEach(filterItem => {
                if (filterItem.children && filterItem.children.length > 0 && filterItem.visible) {
                  const paramsWithUnderscore = [...this.params.entries()].filter(([key, value]) => key.includes('_') && value.includes('_'))
                  const selectedChildren = []

                  filterItem.children.forEach(child => {
                    // check if the child is already in the url params
                    const containsChild = paramsWithUnderscore.some(array => array.includes(`${child.urlpara ? child.urlpara : 'f'}_${child.id}`))

                    if (containsChild) {
                      selectedChildren.push(`${child.urlpara ? child.urlpara : 'f'}_${child.id}`)
                    }

                    // if selected, add it to the url params
                    if (child.selected) {
                      if (!containsChild && !shouldResetAllFilters) {
                        selectedChildren.push(`${child.urlpara ? child.urlpara : 'f'}_${child.id}`)
                      }

                      if (selectedChildren.length > 0) {
                        this.params.set(`${filterItem.urlpara}_${filterItem.id}`, `${selectedChildren.join(',')}`)
                      }

                    // if unselected, remove it from the url params
                    } else {
                      if (containsChild) {
                        const index = selectedChildren.indexOf(`${child.urlpara ? child.urlpara : 'f'}_${child.id}`)
                        selectedChildren.splice(index, 1)

                        this.params.set(`${filterItem.urlpara}_${filterItem.id}`, selectedChildren.join(','))

                        if (this.params.get(`${filterItem.urlpara}_${filterItem.id}`) === '') {
                          this.params.delete(`${filterItem.urlpara}_${filterItem.id}`)
                        }
                      }
                    }
                  })

                  self.history.pushState({}, '', `${this.url.pathname}?${this.params.toString()}`)
                }
              })

              if (isNextPage) json = Object.assign(json, { isNextPage })
              if (shouldResetAllFilters) json = Object.assign(json, { shouldResetAllFilters })

              return json
            })).get(request)
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }))
    }

    window.addEventListener('popstate', () => {
      this.params = this.catchURLParams()
    })
  }

  connectedCallback () {
    this.addEventListener('request-with-facet', this.requestWithFacetListener)
    this.addEventListener('reset-all-filters', this.requestWithFacetListener)
    this.addEventListener('reset-filter', this.requestWithFacetListener)
  }

  disconnectedCallback () {
    this.removeEventListener('request-with-facet', this.requestWithFacetListener)
    this.removeEventListener('reset-all-filters', this.requestWithFacetListener)
    this.removeEventListener('reset-filter', this.requestWithFacetListener)
  }

  catchURLParams () {
    return new URLSearchParams(self.location.search)
  }

  updateURLParams () {
    if (this.params) {
      const entriesWithUnderscore = [...this.params.entries()].filter(([key, value]) => key.includes('_') && value.includes('_'))

      entriesWithUnderscore.forEach(([key, value]) => {
        const [urlparaKey, idKey] = key.split('_')
        const children = []

        value.split(',').forEach(value => {
          const [urlparaValue, idValue] = value.split('_')

          children.push(`{
              "urlpara": "${urlparaValue}",
              "id": "${idValue}",
              "selected": true
            }`)
        })

        const filter = (`{
            "urlpara": "${urlparaKey}",
            "id": "${idKey}",
            "selected": true,
            "children": [${children.join(',')}]
          }`)

        this.filters.push(filter)
      })
    }
  }

  removeAllFilterParamsFromURL () {
    if (this.params) {
      const keys = [...this.params.keys()]

      keys.forEach(key => {
        if (key.includes('_')) {
          this.params.delete(key)
        }
      })

      self.history.pushState({}, '', `${this.url.pathname}?${this.params.toString()}`)
    }
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
              "selected": ${hasSameLabel
                ? isCheckedNullOrUndefined
                  ? (child.selected || false)
                  : event.detail.target.checked
                : (child.selected || false)},
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
        ${filterItem.urlpara ? `"urlpara": "${filterItem.urlpara}",` : ''}
        "visible": ${filterItem.visible || true}
      }`
      : ''
  }
}
