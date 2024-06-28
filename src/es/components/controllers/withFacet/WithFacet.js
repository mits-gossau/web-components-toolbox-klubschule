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

import { WebWorker } from '../../web-components-toolbox/src/es/components/prototypes/WebWorker.js'

/**
 * WithFacet are retrieved via the corresponding endpoint as set as an attribute
 * As a controller, this component communicates exclusively through events
 * Example: web-components-toolbox-klubschule
 *
 * @export
 * @class WithFacet
 * @type {CustomElementConstructor}
 */
export default class WithFacet extends WebWorker() {
  constructor (options = {}, ...args) {
    super({
      importMetaUrl: import.meta.url,
      mode: 'false',
      ...options
    }, ...args)

    let timeoutId = null
    const coordinatesToTerm = new Map()
    // the initial request object received through the attribute, never changes and is always included
    const initialRequestObj = JSON.parse(this.getAttribute('initial-request'))
    // current request obj holds the current filter states and syncs it to the url (url params are write only, read is synced by cms to the initialRequestObj)
    let currentRequestObj = structuredClone(initialRequestObj)
    // this url is not changed but used for url history push stuff
    this.url = new URL(self.location.href)
    const isMocked = this.hasAttribute('mock')
    const endpoint = isMocked
      ? `${this.importMetaUrl}./mock/default.json`
      : `${this.getAttribute('endpoint') || 'https://dev.klubschule.ch/Umbraco/Api/CourseApi/Search'}`
    this.abortController = null
    
    this.requestWithFacetListener = async event => {
      // mdx prevent double event
      if (event?.detail?.mutationList && event.detail.mutationList[0].attributeName !== 'checked') return
      if (this.abortController) this.abortController.abort()
      this.abortController = new AbortController()

      let isNextPage = false
      let filterId = null
      if (event?.detail?.ppage) {
        // ppage reuse last request
        currentRequestObj = Object.assign(currentRequestObj, { ppage: event.detail.ppage })
        isNextPage = true
        currentRequestObj.filter = await this.webWorker(WithFacet.updateFilters, currentRequestObj.filter, undefined, undefined)
      } else if (event?.type === 'reset-all-filters') {
        // reset all filters
        currentRequestObj = structuredClone(initialRequestObj)
      } else if (event?.type === 'reset-filter') {
        // reset particular filter, ks-a-button
        const filterKey = event.detail.this.getAttribute('filter-key')
        currentRequestObj.filter = await this.webWorker(WithFacet.updateFilters, currentRequestObj.filter, filterKey, undefined, true)
      } else if (event?.detail?.wrapper?.filterItem && (filterId = event.detail?.target?.getAttribute?.('filter-id') || event.detail?.target?.filterId)) {
        // build dynamic filters according to the event
        const [filterKey, filterValue] = filterId.split('-')
        currentRequestObj.filter = await this.webWorker(WithFacet.updateFilters, currentRequestObj.filter, filterKey, filterValue)
      } else if (event?.detail?.key === 'location-search') {
        // keep the last search location inside currentRequestObj and store it in url params
        if (!!event.detail.lat && !!event.detail.lng) {
          currentRequestObj.clat = event.detail.lat
          currentRequestObj.clong = event.detail.lng
        } else {
          if (currentRequestObj.clat) delete currentRequestObj.clat
          if (currentRequestObj.clong) delete currentRequestObj.clong
        }
        currentRequestObj.sorting = event.detail.id || 2
        currentRequestObj.filter = await this.webWorker(WithFacet.updateFilters, currentRequestObj.filter, undefined, undefined)
      } else if (event?.detail?.key === 'input-search') {
        if (event?.detail?.value) {
          currentRequestObj.searchText = event?.detail?.value
        } else {
          if (currentRequestObj.searchText) delete currentRequestObj.searchText
        }
        currentRequestObj.filter = await this.webWorker(WithFacet.updateFilters, currentRequestObj.filter, undefined, undefined)
      } else if ((event?.detail?.key === 'sorting' && !!event.detail.id)) {
        // TODO: Test if sorting still works
        currentRequestObj.sorting = event.detail.id || 2
        currentRequestObj.filter = await this.webWorker(WithFacet.updateFilters, currentRequestObj.filter, undefined, undefined)
      } else {
        // always shake out the response filters to only include selected filters or selected in ancestry
        currentRequestObj.filter = await this.webWorker(WithFacet.updateFilters, currentRequestObj.filter, undefined, undefined)
      }

      if (!currentRequestObj.filter.length) currentRequestObj.filter = structuredClone(initialRequestObj.filter)
   
      const LanguageEnum = {
        'd': 'de',
        'f': 'fr',
        'i': 'it'
      }
      let request = {}
      if (isMocked) {
        request = {
          method: 'GET'
        }
      } else {
        request = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': LanguageEnum[this.getAttribute('sprach-id') || currentRequestObj.sprachid || 'd']
          },
          mode: 'cors',
          body: JSON.stringify({
            ...WithFacet.cleanRequest(structuredClone(currentRequestObj)),
            searchcontent: !this.hasAttribute('no-search-tab')
          }),
          signal: this.abortController.signal
        }
      }

      // multiple components ask for this public event dispatch, when the same wait for 50ms until no more of the same request enter
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        this.dispatchEvent(new CustomEvent('with-facet', {
          detail: {
            /** @type {Promise<fetchAutoCompleteEventDetail>} */
            fetch: fetch(endpoint, request).then(response => {
                if (response.status >= 200 && response.status <= 299) {
                  return response.json()
                }
                throw new Error(response.statusText)
              }).then(json => {
                // update filters with api response
                currentRequestObj.filter = json.filters

                setTimeout(() => {
                  // this.checkFiltersInURL(json.filters)
                  // this.updateUrlSearchFromResponse(json)
                  // this.updateUrlParamsFromResponse(json)

                  // if (event?.detail?.wrapper?.filterItem) this.updateFilterAndParamsWithSelectedFilter(event)
                }, 0)
                /*
                if (isNextPage) json = Object.assign(json, { isNextPage })
                if (shouldResetAllFilters) json = Object.assign(json, { shouldResetAllFilters })
                if (shouldResetFilter) json = Object.assign(json, { shouldResetFilter })
                if (shouldResetFilterFromFilterSelectButton) json = Object.assign(json, { shouldResetFilterFromFilterSelectButton })
                  */

                return json
              }).finally(json => {
                // update inputs
                this.dispatchEvent(new CustomEvent('search-change', {
                  detail: {
                    searchTerm: (json || currentRequestObj)?.searchText
                  },
                  bubbles: true,
                  cancelable: true,
                  composed: true
                }))
                const searchCoordinates = !(json || currentRequestObj)?.clat || !(json || currentRequestObj)?.clong ? '' : `${(json || currentRequestObj).clat}, ${(json || currentRequestObj).clong}`
                if (event?.detail?.description && searchCoordinates) coordinatesToTerm.set(searchCoordinates, event.detail.description)

                // Read location name from URL
                let cname
                if (cname = new URLSearchParams(window.location.search).get("cname")) coordinatesToTerm.set(searchCoordinates, decodeURIComponent(cname))

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
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }))
      }, 50)
    }

    this.abortControllerLocations = null
    this.requestLocations = event => {
      if (this.abortControllerLocations) this.abortControllerLocations.abort()
      this.abortControllerLocations = new AbortController()
      
      // TODO: Fix request locations
      // merge both user Filter with sublevel filter
      const subLevelFilter = event.detail.filter
      if (this.filters?.length) subLevelFilter.push(JSON.parse(this.filters.reduce((acc, filter) => acc + `${filter}`)))

      let body = `{
        "filter": ${JSON.stringify(subLevelFilter)},
        "MandantId": ${this.getAttribute('mandant-id') || currentRequestObj.MandantId || 110},
        "PortalId": ${this.getAttribute('portal-id') || currentRequestObj.PortalId || 29},
        "sprachid": "${this.getAttribute('sprach-id') || currentRequestObj.sprachid || 'd'}",
        "psize": ${this.getAttribute('p-size') || currentRequestObj.psize || 12},
        "onlycourse": true
        ${this.hasSearchTerm ? `,"searchText": "${this.searchTerm}"`: ''}
        ${currentRequestObj.clat ? `,"clat": "${currentRequestObj.clat}"` : ''}
        ${currentRequestObj.clong ? `,"clong": "${currentRequestObj.clong}"` : ''}
      }`
      if (event?.detail?.ppage && this.requestLocationsLastBody) {
        // ppage reuse last request
        body = JSON.stringify(Object.assign(JSON.parse(this.requestLocationsLastBody), { ppage: event.detail.ppage }))
      }
      const request = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: (this.requestLocationsLastBody = body),
        signal: this.abortControllerLocations.signal
      }
      // @ts-ignore
      event.detail.resolve(fetch(endpoint, request).then(response => {
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

  // always shake out the response filters to only include selected filters or selected in ancestry
  static updateFilters (filters, filterKey, filterValue, reset = false, zeroLevel = true) {
    const newFilters = []
    filters.forEach(filterItem => {
      const isMatchingKey = filterItem.urlpara === filterKey
      // only the first level has the urlpara === filterKey check
      if (!zeroLevel || isMatchingKey) {
        const isIdOrUrlpara = filterItem.id === filterValue || filterItem.urlpara === filterValue
        if (filterItem.selected && isIdOrUrlpara) {
          filterItem.selected = false // toggle filterItem if is is already selected 
        } else if (filterItem.selected && !isIdOrUrlpara) {
          filterItem.selected = true // keep filterItem selected if it is already selected
        } else if (!filterItem.selected && isIdOrUrlpara) {
          filterItem.selected = true // select filterItem if it is not selected
        }
      }
      if (reset && isMatchingKey) {
        filterItem.children = []
      } else if (filterItem.children) {
        filterItem.children = WithFacet.updateFilters(filterItem.children, filterKey, filterValue, reset, false)
      }
      // only the first level allows selected falls when including selected children
      if (filterItem.children?.length || filterItem.selected) newFilters.push(filterItem)
    })
    return newFilters
  }

  static cleanRequest (requestObj) {
    // Bad API needs filter for payload but responses with filters
    if (requestObj.filters) delete requestObj.filters
    return requestObj
  }

  catchURLParams () {
    return new URLSearchParams(self.location.search)
  }

  checkFiltersInURL (filters) {
    this.filtersInURLRecursionDepth++

    filters.forEach(filterItem => {
      this.params.forEach((value, key) => {
        
        if (key === 'q' || key === 'clat' || key === 'clong' || key === 'cname') {
          // console.log('🚀 ~ key', key, value)
        }
        if (filterItem.urlpara.includes(key)) {
          // console.log('🚀 ~ key', key, filterItem)
        }
        if (filterItem.children && filterItem.children.length > 0) {
          this.checkFiltersInURL(filterItem.children) // Recursive call
        }
      })
    })

    this.filtersInURLRecursionDepth--

    if (this.filtersInURLRecursionDepth === 0) {
      this.updateFilterFromURLParams()
    }
  }

  findFilterItemByUrlpara(filters, key) {
    for (let filterItem of filters) {
      if (filterItem.urlpara === key) {
        return filterItem
      }
      if (filterItem.children) {
        const child = this.findFilterItemByUrlpara(filterItem.children, key)
        if (child) {
          return child
        }
      }
    }

    return null
  }

  setSelectedByUrlpara(filters, keys) {
    for (let filterItem of filters) {
      if (keys.includes(filterItem.urlpara)) {
        if (!filterItem.selected) {
          filterItem.selected = true
        }
        keys = keys.filter(key => key !== filterItem.urlpara) // Remove the matched key
      }
      if (filterItem.children) {
        this.setSelectedByUrlpara(filterItem.children, keys)
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
    if (!event?.detail) return
    const filterId = event.detail.mutationList?.[0].target.getAttribute('filter-id') || event.detail.target?.filterId
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

  static historyPushState (...args) {
    // Avoid multiple empty pushes, otherwise the navigation history becomes jammed
    if ((new URL(args[2])).search !== location.search) {
      // @ts-ignore
      self.history.pushState(...args)
    }
  }
}