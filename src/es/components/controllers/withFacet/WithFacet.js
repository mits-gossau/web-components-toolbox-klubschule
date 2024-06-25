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
    const timeoutIds = new Map()
    const coordinatesToTerm = new Map()
    // additional setting for initial request
    let initialRequestObj = Object.assign(JSON.parse(this.getAttribute('initial-request')), { searchcontent: !this.hasAttribute('no-search-tab') })
    this.url = new URL(self.location.href)
    this.params = this.catchURLParams()
    this.filters = []
    this.filterKeys = []
    this.ignoreURLKeys = [
      'rootFolder', 'css', 'login', 'logo', 'nav', 'footer', 'content', // existing fe dev keys
      'q', // search term, handled separately
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content' // GA parameters
    ] 
    this.isMocked = this.hasAttribute('mock')
    const apiUrl = this.isMocked
      ? `${this.importMetaUrl}./mock/default.json`
      : `${this.getAttribute('endpoint') || 'https://dev.klubschule.ch/Umbraco/Api/CourseApi/Search'}`
    // simply the last body of the last request
    this.lastResponse = {}
    // simply the payload of the last request
    this.lastRequest = null
    // recursion depth counter
    this.filtersInURLRecursionDepth = 0

    this.requestWithFacetListener = (event) => {
      // mdx prevent double event
      if (event?.detail?.mutationList && event.detail.mutationList[0].attributeName !== 'checked') return

      if (event?.detail?.wrapper?.filterItem) this.updateFilterAndParamsWithSelectedFilter(event)

      let request
      const shouldResetAllFilters = event?.type === 'reset-all-filters'
      const shouldResetFilter = event?.type === 'reset-filter'
      const shouldResetFilterFromFilterSelectButton = event?.detail?.this?.hasAttribute('filter')
      let isNextPage = false

      if (event?.detail?.ppage && this.lastRequest) {
        // ppage reuse last request
        request = JSON.stringify(Object.assign(JSON.parse(this.lastRequest), { ppage: event.detail.ppage }))
        isNextPage = true
      } else {
        // new request
        const initialFilters = initialRequestObj?.filter
        const initialFiltersAsString = initialFilters?.map((filter) => JSON.stringify(filter))

        // construct filter item
        const filter = this.constructFilterItem(event)
        if (filter) this.filters.push(filter)

        // if there is an initial filter set (e.g. for events) we want to keep it
        if (initialFiltersAsString?.length) {
          this.filters.push(initialFiltersAsString)
        }

        if (shouldResetAllFilters) {
          initialRequestObj = Object.assign(initialRequestObj, { shouldResetAllFilters })
          this.removeAllFilterParams()
          withFacetCache.clear()
        }

        if (shouldResetFilter) {
          initialRequestObj = Object.assign(initialRequestObj, { shouldResetFilter })
          this.removeFilterParam(event.detail.this.getAttribute('filter-key'))
          withFacetCache.clear()
        }

        if (shouldResetFilterFromFilterSelectButton) {
          initialRequestObj = Object.assign(initialRequestObj, { shouldResetFilterFromFilterSelectButton })
          withFacetCache.clear()
        }

        // keep the last search location inside initialRequestObj and store it in url params
        if (event?.detail?.key === 'location-search') {
          if (!!event.detail.lat && !!event.detail.lng ) {
            initialRequestObj.clat = event.detail.lat
            initialRequestObj.clong = event.detail.lng
            this.params.set('clat', event.detail.lat)
            this.params.set('clong', event.detail.lng)
            this.params.set('cname', encodeURIComponent(event.detail.description))
          } else {
            if (initialRequestObj.clat) delete initialRequestObj.clat
            if (initialRequestObj.clong) delete initialRequestObj.clong
            this.params.delete('clat')
            this.params.delete('clong')
            this.params.delete('cname')
          }
        } else if (this.params.has('clat') || this.params.has('clong') || this.params.has('cname')) {
          initialRequestObj.clat = this.params.get('clat')
          initialRequestObj.clong = this.params.get('clong')
        }

        this.updateFilterFromURLParams()

        const hasSearchTerm = event?.detail?.key === 'input-search' || this.params.get('q') !== ('' || null)
        let hasSorting = false
        let hasSearchLocation = false
        const filterRequest = `{
          "filter": ${this.filters.length > 0 ? `[${this.filters.join(',')}]` : '[]'},
          "MandantId": ${this.getAttribute('mandant-id') || initialRequestObj.MandantId || 110},
          "PortalId": ${this.getAttribute('portal-id') || initialRequestObj.PortalId || 29},
          "sprachid": "${this.getAttribute('sprach-id') || initialRequestObj.sprachid || 'd'}",
          "psize": ${this.getAttribute('p-size') || initialRequestObj.psize || 12},
          "searchcontent": ${!this.hasAttribute('no-search-tab')}
          ${(hasSorting = (event?.detail?.key === 'sorting' && !!event.detail.id) || (event?.detail?.key === 'location-search')) ? `,"sorting": "${event.detail.id || 2}"` : ''}
          ${hasSearchTerm ? `,"searchText": "${event?.detail?.key === 'input-search' ? event.detail.value : this.params.get('q')}"`: ''}
          ${(hasSearchLocation = !!initialRequestObj.clat) ? `,"clat": "${initialRequestObj.clat}"` : ''}
          ${(hasSearchLocation = !!initialRequestObj.clong) ? `,"clong": "${initialRequestObj.clong}"` : ''}
        }`
        request = this.lastRequest = this.filters.length > 0 || hasSearchTerm || hasSearchLocation || hasSorting ? filterRequest : JSON.stringify(initialRequestObj)
      }

      const LanguageEnum = {
        'd': 'de',
        'f': 'fr',
        'i': 'it'
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
            'Content-Type': 'application/json',
            'Accept-Language': LanguageEnum[this.getAttribute('sprach-id') || initialRequestObj.sprachid || 'd']
          },
          mode: 'cors',
          body: request
        }
      }

      // multiple components ask for this public event dispatch, when the same wait for 50ms until no more of the same request enter
      if (timeoutIds.has(request)) clearTimeout(timeoutIds.get(request))
      timeoutIds.set(request, setTimeout(() => {
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
                // store initial response
                this.lastResponse = json

                this.checkFiltersInURL(json.filters)
                this.updateUrlSearchFromResponse(json)
                this.updateUrlParamsFromResponse(json)
                
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
          if (event?.detail?.description && searchCoordinates) coordinatesToTerm.set(searchCoordinates, event.detail.description)
          this.dispatchEvent(new CustomEvent('location-change', {
            detail: {
              searchTerm: event?.detail?.description || coordinatesToTerm.get(searchCoordinates) || searchCoordinates || '',
              searchCoordinates
            },
            bubbles: true,
            cancelable: true,
            composed: true
          }))
        })
      }, 50))
    }

    this.abortControllerLocations = null
    this.requestLocations = event => {
      if (this.abortControllerLocations) this.abortControllerLocations.abort()
      this.abortControllerLocations = new AbortController()
      let body = `{
        "filter": ${JSON.stringify(event.detail.filter)},
        "MandantId": ${this.getAttribute('mandant-id') || initialRequestObj.MandantId || 110},
        "PortalId": ${this.getAttribute('portal-id') || initialRequestObj.PortalId || 29},
        "sprachid": "${this.getAttribute('sprach-id') || initialRequestObj.sprachid || 'd'}",
        "onlycourse": true
        ${initialRequestObj.clat ? `,"clat": "${initialRequestObj.clat}"` : ''}
        ${initialRequestObj.clong ? `,"clong": "${initialRequestObj.clong}"` : ''}
      }`
      if (event?.detail?.ppage && this.requestLocationsLastBody) {
        // ppage reuse last request
        body = JSON.stringify(Object.assign(JSON.parse(this.requestLocationsLastBody), { ppage: event.detail.ppage }))
      }
      const requestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: (this.requestLocationsLastBody = body),
        signal: this.abortControllerLocations.signal
      }
      // @ts-ignore
      event.detail.resolve(fetch(apiUrl, requestInit).then(response => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json()
        }
        throw new Error(response.statusText)
      }))
    }

    this.popstateListener = event => {
      this.params = this.catchURLParams()
      this.requestWithFacetListener()
    }
  }

  connectedCallback () {
    this.addEventListener('request-with-facet', this.requestWithFacetListener)
    this.addEventListener('reset-all-filters', this.requestWithFacetListener)
    this.addEventListener('reset-filter', this.requestWithFacetListener)
    this.addEventListener('request-locations', this.requestLocations)
    self.addEventListener('popstate', this.popstateListener)
  }
  
  disconnectedCallback () {
    this.removeEventListener('request-with-facet', this.requestWithFacetListener)
    this.removeEventListener('reset-all-filters', this.requestWithFacetListener)
    this.removeEventListener('reset-filter', this.requestWithFacetListener)
    this.removeEventListener('request-locations', this.requestLocations)
    self.removeEventListener('popstate', this.popstateListener)
  }

  catchURLParams () {
    return new URLSearchParams(self.location.search)
  }

  checkFiltersInURL (filters) {
    this.filtersInURLRecursionDepth++

    filters.forEach(filterItem => {
      this.params.forEach((value, key) => {
        if (this.filterKeys.includes(key)) return
        if (key === 'q' || key === 'clat' || key === 'clong' || key === 'cname') {
          this.filterKeys.push(key)
        }
        if (filterItem.urlpara.includes(key)) {
          this.filterKeys.push(key)
        }
        if (filterItem.children && filterItem.children.length > 0) {
          this.checkFiltersInURL(filterItem.children) // Recursive call
        }
      })
    })

    this.filtersInURLRecursionDepth--

    if (this.filtersInURLRecursionDepth === 0) {
      this.updateFilterFromURLParams();
    }
  }

  updateFilterFromURLParams (key = null) {
    if (key) console.log('updateFilterFromURLParams', key)
    this.filters = []
    let filteredURLKeys = Array.from(this.params.keys()).filter(key => !this.ignoreURLKeys.includes(key))
    if (key) filteredURLKeys = [key] // set first filter key
    const filterItems = []

    // if there are filters in the url
    if (this.filterKeys.length !== 0 && this.lastResponse.filters) {
      this.filterKeys.forEach(key => {
        const filterItem = this.lastResponse.filters.find(filterItem => filterItem.urlpara === key)
        if (filterItem) {
          filterItems.push(filterItem)
        } else {
          // remove filter key if it is not in the response
          this.filterKeys = this.filterKeys.filter(filterKey => filterKey !== key)
          filteredURLKeys = filteredURLKeys.filter(urlKey => urlKey !== key)
        }
      })

      // select children based on url params
      filterItems.forEach(item => {
        if (filteredURLKeys.includes(item.urlpara)) {
          item.children.forEach(child => {
            if (this.params.get(item.urlpara)?.split('-').includes(child.urlpara)) {
              child.selected = true
            } else {
              child.selected = false
            }
          })
        }
      })

      // construct filter items
      if (filterItems.length > 0) {
        filterItems.forEach(item => {
          const filter = this.constructFilterItem(item)
          if (filter) this.filters.push(JSON.stringify(filter))
          console.log('updateFilterFromURLParams', filter)
        })
      }
    }
  }

  updateUrlSearchFromResponse (response) {
    if (!response.searchText) {
      this.params.delete('q')
    } else {
      this.params.set('q', response.searchText)
    }
  }

  updateFilterAndParamsWithSelectedFilter(event) {
    const filterId = event?.detail?.mutationList[0].target.getAttribute('filter-id')
    if (!filterId) return
    const [filterKey, filterValue] = filterId.split('-')
    const currentValues = this.params.get(filterKey)?.split('-') || []

    // if filterKey is not in url
    if (!this.params.get(filterKey) && filterValue !== '') {
      this.params.set(filterKey, filterValue)
      this.filterKeys.push(filterKey)
      this.updateFilterFromURLParams(filterKey)
      return
    }

    // if filterKey is in url
    if (!currentValues?.includes(filterValue)) {
      currentValues.push(filterValue)
      this.params.set(filterKey, currentValues.join('-'))

    // if filterValue is not in url
    } else {
      currentValues.splice(currentValues.indexOf(filterValue), 1)

      // if filterValue is the last value
      if (currentValues.length > 0) {
        this.params.delete(filterKey)
        this.params.set(filterKey, currentValues.join('-'))

      // if filterValue is the only value
      } else {
        this.params.delete(filterKey)
        this.filterKeys = this.filterKeys.filter(key => key !== filterKey)
      }
    }

    this.updateFilterFromURLParams()
  }

  updateUrlParamsFromResponse (response) {
    console.log('updateUrlParamsFromResponse', response)
    response.filters.forEach(filterItem => {
      if (filterItem.children && filterItem.children.length > 0 && filterItem.visible) {
        const urlParamsContainsKey = this.params.has(filterItem.urlpara)
        const selectedChildren = []

        // if param is already in url
        if (urlParamsContainsKey) {
          const urlParamsContainsValues = this.params.get(filterItem.urlpara)?.split('-')
          
          filterItem.children.forEach(child => {
            // if value is already present
            if (urlParamsContainsValues?.includes(child.urlpara)) {
              selectedChildren.push(child.urlpara)
            }
            // if value is not present
            if (child.selected && !selectedChildren.includes(child.urlpara)) {
              selectedChildren.push(child.urlpara)
            }
          })
        // if param is not in url
        } else {
          filterItem.children.forEach(child => {
            if (child.selected && !selectedChildren.includes(child.urlpara)) {
              selectedChildren.push(child.urlpara)
            }
          })
        }

        // add filterITtem.urlpara as key with collected values to params
        if (selectedChildren.length > 0) {
          this.params.set(filterItem.urlpara, selectedChildren.join('-'))
        }
      }
    })

    WithFacet.historyPushState({}, '', `${this.url.origin}${this.url.pathname}?${this.params.toString()}`)
  }

  removeAllFilterParams () {
    if (this.params) {
      this.filterKeys.forEach(key => {
        this.params.delete(key)
      })
      
      this.filterKeys = []
      this.filters = []

      WithFacet.historyPushState({}, '', `${this.url.origin}${this.url.pathname}?${this.params.toString()}`)
    }
  }

  removeFilterParam (key) {
    if (this.params) {
      this.params.delete(key)
      this.filterKeys = this.filterKeys.filter(filterKey => filterKey !== key)
      this.filters = this.filters.filter(filter => !filter.includes(`"${key}"`))

      WithFacet.historyPushState({}, '', `${this.url.origin}${this.url.pathname}?${this.params.toString()}`)
    }
  }

  toggleFilterItem(filterItem, filterKey, filterValue, select) {
    if (filterItem.urlpara === filterKey) {
      if (filterItem.children) {
        filterItem.children.forEach(child => {
          this.toggleFilterItem(child, filterKey, filterValue, select) // recursive call
        })
      }
    } else if (filterItem.children) { // continue searching
      filterItem.children.forEach(child => {
        this.toggleFilterItem(child, filterKey, filterValue, select)
      })
    }
  
    if ((filterItem.urlpara || filterItem.id) === filterValue) {
      if (!select) {
        filterItem.selected = false
        console.log('unselect', !select, filterItem)
      }
    }
  }

  constructFilterItem (event) {
    let filterItem = event?.detail?.wrapper?.filterItem
    // if event is not an Event object, it is a filterItem
    if (!(event instanceof Event)) {
      filterItem = event
    }

    if (filterItem && event.detail?.target.getAttribute('filter-id')) {
      const [filterKey, filterValue] = event.detail.target.getAttribute('filter-id').split('-')
      console.log('filter', filterKey, filterValue, event.detail?.target.checked)
      filterItem = this.toggleFilterItem(filterItem, filterKey, filterValue, event.detail?.target.checked)
    }

    if (filterItem) console.log('constructFilterItem', filterItem)

    return filterItem ? filterItem : ''
  }

  static historyPushState (...args) {
    // Avoid multiple empty pushes, otherwise the navigation history becomes jammed
    if ((new URL(args[2])).search !== location.search) {
      // @ts-ignore
      self.history.pushState(...args)
    }
  }
}