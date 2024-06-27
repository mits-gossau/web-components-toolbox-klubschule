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

    let timeoutId = null
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

    this.abortController = null
    this.requestWithFacetListener = (event) => {
      // mdx prevent double event
      if (event?.detail?.mutationList && event.detail.mutationList[0].attributeName !== 'checked') return
      // if (this.abortController) this.abortController.abort()
      // this.abortController = new AbortController()
      
      if (event?.detail?.wrapper?.filterItem) this.updateFilterAndParamsWithSelectedFilter(event)

      let request
      const shouldResetAllFilters = event?.type === 'reset-all-filters'
      const shouldResetFilter = event?.type === 'reset-filter'
      const shouldResetFilterFromFilterSelectButton = event?.detail?.this?.hasAttribute('filter')
      let isNextPage = false

      if (event?.detail?.ppage && this.lastRequest) {
        const lastRequestAsJson = JSON.parse(this.lastRequest)
        lastRequestAsJson.psize = 2 * lastRequestAsJson.psize
        // ppage reuse last request
        request = JSON.stringify(Object.assign(lastRequestAsJson, { ppage: event.detail.ppage }))
        isNextPage = true
      } else {
        // new request
        const initialFilters = initialRequestObj?.filter
        const initialFiltersAsString = initialFilters?.map((filter) => JSON.stringify(filter))

        this.updateFilterFromURLParams()

        // construct filter item
        const filter = this.constructFilterItem(event)
        if (filter) this.filters.push(JSON.stringify(filter))

        // if there is an initial filter set (e.g. for events) we want to keep it
        if (initialFiltersAsString?.length) {
          this.filters.push(initialFiltersAsString)
        }

        if (shouldResetAllFilters) {
          initialRequestObj = Object.assign(initialRequestObj, { shouldResetAllFilters })
          this.removeAllFilterParams()
        }

        if (shouldResetFilter) {
          initialRequestObj = Object.assign(initialRequestObj, { shouldResetFilter })
          this.removeFilterParam(event.detail.this.getAttribute('filter-key'))
        }

        if (shouldResetFilterFromFilterSelectButton) {
          initialRequestObj = Object.assign(initialRequestObj, { shouldResetFilterFromFilterSelectButton })
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

        this.hasSearchTerm = event?.detail?.key === 'input-search' || this.params.get('q') !== ('' || null)
        if (this.hasSearchTerm) this.searchTerm = event?.detail?.value || this.params.get('q')
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
          ${this.hasSearchTerm ? `,"searchText": "${this.searchTerm}"`: ''}
          ${(hasSearchLocation = !!initialRequestObj.clat) ? `,"clat": "${initialRequestObj.clat}"` : ''}
          ${(hasSearchLocation = !!initialRequestObj.clong) ? `,"clong": "${initialRequestObj.clong}"` : ''}
        }`
        request = this.lastRequest = this.filters.length > 0 || this.hasSearchTerm || hasSearchLocation || hasSorting ? filterRequest : JSON.stringify(initialRequestObj)
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
          body: request,
          // signal: this.abortController.signal
        }
      }

      // multiple components ask for this public event dispatch, when the same wait for 50ms until no more of the same request enter
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        this.dispatchEvent(new CustomEvent('with-facet', {
          detail: {
            /** @type {Promise<fetchAutoCompleteEventDetail>} */
            fetch: fetch(apiUrl, requestInit).then(response => {
                if (response.status >= 200 && response.status <= 299) {
                  return response.json()
                }
                throw new Error(response.statusText)
              }).then(json => {
                // store initial response
                this.lastResponse = json

                setTimeout(() => {
                  this.checkFiltersInURL(json.filters)
                  this.updateUrlSearchFromResponse(json)
                  this.updateUrlParamsFromResponse(json)
                }, 0)
                
                if (isNextPage) json = Object.assign(json, { isNextPage })
                if (shouldResetAllFilters) json = Object.assign(json, { shouldResetAllFilters })
                if (shouldResetFilter) json = Object.assign(json, { shouldResetFilter })
                if (shouldResetFilterFromFilterSelectButton) json = Object.assign(json, { shouldResetFilterFromFilterSelectButton })

                return json
              }).finally(json => {
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
      
      // merge both user Filter with sublevel filter
      const subLevelFilter = event.detail.filter
      if (this.filters?.length) subLevelFilter.push(JSON.parse(this.filters.reduce((acc, filter) => acc + `${filter}`)))

      let body = `{
        "filter": ${JSON.stringify(subLevelFilter)},
        "MandantId": ${this.getAttribute('mandant-id') || initialRequestObj.MandantId || 110},
        "PortalId": ${this.getAttribute('portal-id') || initialRequestObj.PortalId || 29},
        "sprachid": "${this.getAttribute('sprach-id') || initialRequestObj.sprachid || 'd'}",
        "psize": ${this.getAttribute('p-size') || initialRequestObj.psize || 12},
        "onlycourse": true
        ${this.hasSearchTerm ? `,"searchText": "${this.searchTerm}"`: ''}
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


  updateFilterFromURLParams (key = null, filters = []) {
    this.filters = filters
    let filteredURLKeys = Array.from(this.params.keys()).filter(key => !this.ignoreURLKeys.includes(key))
    if (key) filteredURLKeys = [key] // set first filter key
    const filterItems = []

    // TODO: @Alex get center filter from url
    // console.log(filteredURLKeys, this.filterKeys, this.lastResponse.filters, this.filters)
    // if (this.lastResponse.filters) this.filters = this.lastResponse.filters

    // if there are filters in the url
    if (this.filterKeys.length !== 0 && this.lastResponse.filters) {
      console.log('🚀', this.filterKeys, this.lastResponse.filters)
      // this.filterKeys.forEach(key => {
        // let filterItem = this.findFilterItemByUrlpara(this.lastResponse.filters, key)
        // console.log(filterItem)

        let filterItem = this.setSelectedByUrlpara(this.lastResponse.filters, this.filterKeys)
        console.log('🚀 ~ filterItem', filterItem)


        // filterItem.children.forEach(child => {
      //     if (this.params.get(filterItem.urlpara)?.split('-').includes(child.urlpara || child.id)) {
      //       child.selected = true
      //     } else {
      //       child.selected = false
      //     }
      //   })

      //   if (filterItem) {
      //     filterItems.push(filterItem)
      //   } else {
      //     // remove filter key if it is not in the response
      //     this.filterKeys = this.filterKeys.filter(filterKey => filterKey !== key)
      //     filteredURLKeys = filteredURLKeys.filter(urlKey => urlKey !== key)
      //   }
      // })

      // // construct filter items
      // if (filterItems.length > 0) {
      //   filterItems.forEach(item => {
      //     const filter = this.constructFilterItem(item)
      //     if (filter) this.filters.push(JSON.stringify(filter))
      //       console.log('🚀 ~ filter', filter)
      //   })
      // }
      // })
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

  toggleFilterItem(filterItem, filterKey, filterValue, event) {
    if (filterItem.children) {
      filterItem.children.forEach(child => {
        const count = child.count ? `(${child.count})` : ''
        const label = count ? `${child.label} ${count}` : child.label
        const hasSameLabel = label.trim() === event.detail?.target.label.trim()
        const isCheckedNullOrUndefined = event.detail?.target.checked === null || event.detail?.target.checked === undefined

        child.selected = hasSameLabel
          ? isCheckedNullOrUndefined
            ? (child.selected || false)
            : event.detail.target.checked
          : (child.selected || false)
      
        if (filterItem.urlpara !== filterKey || filterItem.id !== filterValue) {
          this.toggleFilterItem(child, filterKey, filterValue, event) // recursive call
        }
      })

      // if all children are deselected, remove filterKey from url
      const allChildrenDeselected = filterItem.children.every(child => !child.selected)
      if (allChildrenDeselected) {
        this.removeFilterParam(filterItem.urlpara)
      }
    }

    return filterItem
  }

  constructFilterItem (event) {
    let filterItem = event?.detail?.wrapper?.filterItem
    if (filterItem) console.log('🚀 ~ constructFilterItem ~ filterItem', filterItem)
    if (!event) return
    const filterId = (typeof event.detail?.target?.getAttribute === 'function' && event.detail?.target?.getAttribute('filter-id')) || event.detail?.target?.filterId
    // if event is not an Event object, it is a filterItem
    if (!(event instanceof Event)) {
      filterItem = event
    }

    if (filterItem && filterId) {
      const [filterKey, filterValue] = filterId.split('-')
      filterItem = this.toggleFilterItem(filterItem, filterKey, filterValue, event)
    }

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