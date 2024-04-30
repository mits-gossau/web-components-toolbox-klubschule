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
    const initialRequestObjFrozen = Object.freeze(JSON.parse(initialRequest))
    this.url = new URL(self.location.href)
    this.params = new URLSearchParams(this.url.search)
    this.isMocked = this.hasAttribute('mock')
    const apiUrl = this.isMocked
      ? `${this.importMetaUrl}./mock/default.json`
      : `${this.getAttribute('endpoint') || 'https://dev.klubschule.ch/Umbraco/Api/CourseApi/Search'}`
    // simply the last body of the last request
    this.lastResponse = {}
    // simply the payload of the last request
    this.lastRequest = null

    this.requestWithFacetListener = (event) => {
      // mdx prevent double event
      if (event.detail?.mutationList && event.detail.mutationList[0].attributeName !== 'checked') return

      console.log('---------------------------------event', event, event.type === 'reset-all-filters' ? 'reset-all-filters' : 'request')

      let request
      const shouldResetAllFilters = event.type === 'reset-all-filters'
      const shouldResetFilter = event.type === 'reset-filter'
      const shouldResetFilterFromFilterSelectButton = event.detail?.this?.hasAttribute('filter')
      let isNextPage = false

      if (event.detail?.ppage && this.lastRequest) {
        // ppage reuse last request
        request = JSON.stringify(Object.assign(JSON.parse(this.lastRequest), { ppage: event.detail.ppage }))
        isNextPage = true
      } else {
        // new request
        const initialFilters = JSON.parse(initialRequest)?.filter
        const initialFiltersAsString = initialFilters?.map((filter) => JSON.stringify(filter))

        this.filters = []
        const filter = this.constructFilterItem(event)
        if (filter) this.filters.push(filter)

        // if there is an initial filter set (e.g. for events) we want to keep it
        if (initialFiltersAsString?.length) {
          this.filters.push(initialFiltersAsString)
        }

        if (shouldResetAllFilters) {
          initialRequest = JSON.stringify(Object.assign(JSON.parse(initialRequest), { shouldResetAllFilters }))
          this.removeAllFilterParamsFromURL()
        }

        if (shouldResetFilter) {
          initialRequest = JSON.stringify(Object.assign(JSON.parse(initialRequest), { shouldResetFilter }))
          this.removeFilterParamsFromURL(event.detail.this.getAttribute('filter-parent'))
        }

        if (shouldResetFilterFromFilterSelectButton) {
          initialRequest = JSON.stringify(Object.assign(JSON.parse(initialRequest), { shouldResetFilterFromFilterSelectButton }))
        }

        this.updateURLParams()

        console.log(this.params.get('q'))

        let hasSearchTerm = false
        let hasSearchLocation = false
        const filterRequest = `{
          "filter": ${this.filters.length > 0 ? `[${this.filters.join(',')}]` : '[]'},
          "MandantId": ${this.getAttribute('mandant-id') || initialRequestObjFrozen.MandantId || 110},
          "PortalId": ${this.getAttribute('portal-id') || initialRequestObjFrozen.PortalId || 29},
          "sprachid": "${this.getAttribute('sprach-id') || initialRequestObjFrozen.sprachid || 'd'}"
          ${(hasSearchTerm = event.detail?.key === 'input-search') ? `,"searchText": "${event.detail.value}"` : ''}
          ${(hasSearchTerm = this.params.get('q') !== ('' || null) ) ? `,"searchText": "${this.params.get('q')}"` : ''}
          ${(hasSearchLocation = event.detail?.key === 'location-search' && !!event.detail.lat) ? `,"clat": "${event.detail.lat}"` : ''}
          ${(hasSearchLocation = event.detail?.key === 'location-search' && !!event.detail.lng) ? `,"clong": "${event.detail.lng}"` : ''}
        }`

        request = this.lastRequest = this.filters.length > 0 || hasSearchTerm || hasSearchLocation ? filterRequest : initialRequest
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

      let fetchPromise = null
      this.dispatchEvent(new CustomEvent('with-facet', {
        detail: {
          /** @type {Promise<fetchAutoCompleteEventDetail>} */
          fetch: (fetchPromise = withFacetCache.has(request)
            ? withFacetCache.get(request)
            // TODO: withFacetCache key must include all variants as well as future payloads
            // TODO: know the api data change cycle and use timestamps if that would be shorter than the session life time
            : withFacetCache.set(request, fetch(apiUrl, requestInit).then(response => {
              if (response.status >= 200 && response.status <= 299) {
                return response.json()
              }
              throw new Error(response.statusText)
            }).then(json => {
              console.log('----------json', json)
              // store initial response
              if (!this.filters.length || this.filters.length === 0) {
                this.lastResponse = json
              }

              // url search text kung fu
              if (json.searchText) {
                this.params.set('q', json.searchText)
              }

              // url filter kung fu
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
              if (shouldResetFilter) json = Object.assign(json, { shouldResetFilter })
              if (shouldResetFilterFromFilterSelectButton) json = Object.assign(json, { shouldResetFilterFromFilterSelectButton })

              return json
            })).get(request))
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }))

      fetchPromise.finally(json => {
        const requestObj = JSON.parse(request)
        // update inputs
        this.dispatchEvent(new CustomEvent('search-change', {
          detail: {
            searchTerm: (json || requestObj)?.searchText
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }))
        const searchCoordinates = !(json || requestObj)?.clat || !(json || requestObj)?.clong ? '' : `${(json || requestObj).clat}, ${(json || requestObj).clong}`
        this.dispatchEvent(new CustomEvent('location-change', {
          detail: {
            searchTerm: event.detail?.description || searchCoordinates || '',
            searchCoordinates
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }))
      })
    }

    this.requestLocations = event => {
      const requestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: `{
          "filter": ${JSON.stringify(event.detail.filter)},
          "MandantId": ${this.getAttribute('mandant-id') || initialRequestObjFrozen.MandantId || 110},
          "PortalId": ${this.getAttribute('portal-id') || initialRequestObjFrozen.PortalId || 29},
          "sprachid": "${this.getAttribute('sprach-id') || initialRequestObjFrozen.sprachid || 'd'}"
        }`
      }
      // @ts-ignore
      event.detail.resolve(fetch(apiUrl, requestInit).then(response => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json()
        }
        throw new Error(response.statusText)
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
    this.addEventListener('request-locations', this.requestLocations)
  }

  disconnectedCallback () {
    this.removeEventListener('request-with-facet', this.requestWithFacetListener)
    this.removeEventListener('reset-all-filters', this.requestWithFacetListener)
    this.removeEventListener('reset-filter', this.requestWithFacetListener)
    this.removeEventListener('request-locations', this.requestLocations)
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

  removeFilterParamsFromURL (filterParent) {
    if (this.params) {
      this.params.delete(`${filterParent}`)
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
