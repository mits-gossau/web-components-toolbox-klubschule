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
  constructor(options = {}, ...args) {
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
    // complete filter obj, holds all the filters all the time. In opposite to currentRequestObj.filter, which tree shakes not selected filter, to only send the essential to the API (Note: The API fails if all filters get sent)
    let currentCompleteFilterObj = currentRequestObj.filter
    // hold the initial response filters from the very first response call to be able to reset filters for "tree" filters
    let firstRequest = true
    let initialResponseFilters = null
    // this url is not changed but used for url history push stuff
    this.url = new URL(self.location.href)
    this.params = this.catchURLParams()
    const isMocked = this.hasAttribute('mock')
    const endpoint = isMocked
      ? `${this.importMetaUrl}./mock/default.json`
      : `${this.getAttribute('endpoint') || 'https://dev.klubschule.ch/Umbraco/Api/CourseApi/Search'}`
    this.abortController = null
    this.saveLocationDataInLocalStorage = this.hasAttribute('save-location-local-storage')
    this.saveLocationDataInSessionStorage = this.hasAttribute('save-location-session-storage')

    this.fillStorage = storageType => {
      const isLocalStorageType = storageType === 'local'
      // update storage based on url
      if (this.params.has('clat') && this.params.has('clong') && this.params.get('cname')) {
        let locationData = {
          clat: this.params.get('clat'),
          clong: this.params.get('clong'),
          cnameDecoded: decodeURIComponent(this.params.get('cname') || ''),
          cnameCoded: this.params.get('cname')
        }
        // @ts-ignore
        isLocalStorageType ? localStorage.setItem("locationData", JSON.stringify(locationData)) : sessionStorage.setItem("locationData", JSON.stringify(locationData))
      } // update url based storage 
      else if (isLocalStorageType ? localStorage.getItem('locationData') : sessionStorage.getItem('locationData')) this.updateUrlBasedStorage(isLocalStorageType ? 'local' : 'session')
    }

    this.updateStorageBasedEvent = (storageType, event) => {
      const isLocalStorageType = storageType === 'local'
      let locationData = {
        clat: event.detail.lat,
        clong: event.detail.lng,
        cnameDecoded: event.detail.description,
        cnameCoded: encodeURIComponent(event.detail.description)
      }
      // @ts-ignore
      isLocalStorageType ? localStorage.setItem("locationData", JSON.stringify(locationData)) : sessionStorage.setItem("locationData", JSON.stringify(locationData))
    }

    this.updateUrlBasedStorage = storageType => {
      const isLocalStorageType = storageType === 'local'
      // @ts-ignore
      const dataFromStorage = isLocalStorageType ? JSON.parse(localStorage.getItem('locationData')) : JSON.parse(sessionStorage.getItem('locationData'))
      currentRequestObj.clat = dataFromStorage.clat
      currentRequestObj.clong = dataFromStorage.clong
      currentRequestObj.cname = dataFromStorage.cnameCoded
      this.updateURLParam('clat', dataFromStorage.clat)
      this.updateURLParam('clong', dataFromStorage.clong)
      this.updateURLParam('cname', dataFromStorage.cnameCoded)
    }

    // @ts-ignore
    if (this.saveLocationDataInLocalStorage) this.fillStorage('local')

    // @ts-ignore
    if (this.saveLocationDataInSessionStorage) this.fillStorage('session')

    if (this.params.has('q')) currentRequestObj.searchText = this.params.get('q')
    if (this.params.has('clat')) currentRequestObj.clat = this.params.get('clat')
    if (this.params.has('clong')) currentRequestObj.clong = this.params.get('clong')

    // intial sorting when page is refreshed
    if (!currentRequestObj.sorting) {
      currentRequestObj.sorting = 3 // alphabetic
      if (currentRequestObj.clat && currentRequestObj.clong) currentRequestObj.sorting = 2 // distance
    }

    // If shared with active Sorting, keep param for other user
    if (this.params.has('sorting')) currentRequestObj.sorting = Number(this.params.get('sorting'))

    this.requestWithFacetListener = async event => {
      // Reset PPage after filter Change / Reset
      currentRequestObj.ppage = 0

      // mdx prevent double event
      if (event?.detail?.mutationList && event.detail.mutationList[0].attributeName !== 'checked') return
      if (this.abortController) this.abortController.abort()
      this.abortController = new AbortController()

      let filterId = null
      let filterGroupName = null
      if (event?.detail?.ppage) {
        // ppage reuse last request
        currentRequestObj = Object.assign(currentRequestObj, { ppage: event.detail.ppage })
        const result = await this.webWorker(WithFacet.updateFilters, currentCompleteFilterObj, undefined, undefined)
        currentCompleteFilterObj = result[0]
        currentRequestObj.filter = result[1]
      } else if (event?.type === 'reset-all-filters') {
        // reset all filters
        this.deleteAllFiltersFromUrl(currentRequestObj.filter)
        currentRequestObj = structuredClone(initialRequestObj)
        delete currentRequestObj.searchText
        currentRequestObj.sorting = 3
        if ((this.saveLocationDataInLocalStorage || this.saveLocationDataInSessionStorage) && this.params.has('cname')) currentRequestObj.sorting = 2
      } else if (event?.type === 'reset-filter') {
        // reset particular filter, ks-a-button
        const filterKey = event.detail.this.getAttribute('filter-key')
        const result = await this.webWorker(WithFacet.updateFilters, currentCompleteFilterObj, filterKey, undefined, true)
        currentCompleteFilterObj = result[0]
        currentRequestObj.filter = result[1]
        if (filterKey === 'q') {
          delete currentRequestObj.searchText
          this.deleteParamFromUrl('q')
          if (!currentRequestObj.clat) currentRequestObj.sorting = 3 // alphabetic
        }
        if (filterKey === 'cname') {
          this.deleteParamFromUrl('clong')
          this.deleteParamFromUrl('clat')
          delete currentRequestObj.cname
          delete currentRequestObj.clong
          delete currentRequestObj.clat
          if (!this.params.get('q') || this.params.get('q') === '') {
            currentRequestObj.sorting = 3 // alphabetic
          } else {
            currentRequestObj.sorting = 1 // relevance
          }
          if (this.saveLocationDataInLocalStorage) localStorage.removeItem('locationData')
          if (this.saveLocationDataInSessionStorage) sessionStorage.removeItem('locationData')
          this.updateURLParam('sorting', currentRequestObj.sorting)
        }
        this.deleteParamFromUrl(filterKey)
      } else if ((filterGroupName = event?.detail?.wrapper?.filterItem) && (filterId = event.detail?.target?.getAttribute?.('filter-id') || event.detail?.target?.filterId)) {
        // current filter click/touch
        // triggered by component interaction eg. checkbox or nav-level-item
        // build dynamic filters according to the event
        const [filterKey, filterValue] = filterId.split('-')
        const isTree = event?.detail?.target?.type === "tree"
        if (isTree) {
          // replace currentCompleteFilterObj.filter of "typ: tree" with initialResponseFilters.filter of "typ: tree" to avoid multi selection
          const initialResponseFiltersTree = initialResponseFilters.filter(filterItem => filterItem.typ === 'tree')
          currentCompleteFilterObj = currentCompleteFilterObj.filter(filterItem => filterItem.typ !== 'tree')
          currentCompleteFilterObj = [...currentCompleteFilterObj, ...initialResponseFiltersTree]
        }

        // GTM Tracking of Filters
        // @ts-ignore
        if (typeof window !== 'undefined' && window.dataLayer) {
          try {
            // @ts-ignore
            window.dataLayer.push({
              'event': 'filterSelection',
              'filterName': event.detail.target.label, //the name of the clicked filter.
              'filterCategory': filterGroupName.attributes?.label ? filterGroupName.attributes.label.value : filterGroupName.label, //the category that this filter belongs to - IF there is one, if not we can remove this key
            })
          } catch (err) {
            console.error('Failed to push event data:', err)
          }
        }

        this.updateURLParam(filterKey, filterValue, isTree)
        const result = await this.webWorker(WithFacet.updateFilters, currentCompleteFilterObj, filterKey, filterValue, false, true, null, isTree)
        currentCompleteFilterObj = result[0]
        currentRequestObj.filter = [...result[1], ...initialRequestObj.filter]
        if (isTree) {
          currentRequestObj.filter = this.getLastSelectedFilterItem(currentRequestObj.filter)
        }
      } else if (event?.detail?.key === 'location-search') {
        // location search
        // keep the last search location inside currentRequestObj and store it in url params
        if (!!event.detail.lat && !!event.detail.lng) {
          currentRequestObj.clat = event.detail.lat
          currentRequestObj.clong = event.detail.lng
          this.updateURLParam('clat', event.detail.lat)
          this.updateURLParam('clong', event.detail.lng)
          this.updateURLParam('cname', encodeURIComponent(event.detail.description))
          if (this.saveLocationDataInLocalStorage) this.updateStorageBasedEvent('local', event)
          if (this.saveLocationDataInSessionStorage) this.updateStorageBasedEvent('session', event)
          currentRequestObj.sorting = 2
          this.updateURLParam('sorting', 2)
        } else {
          if (this.saveLocationDataInLocalStorage && localStorage.getItem('locationData')) this.updateUrlBasedStorage('local')
          else if (this.saveLocationDataInSessionStorage && sessionStorage.getItem('locationData')) this.updateUrlBasedStorage('session')
          else {
            if (currentRequestObj.clat) delete currentRequestObj.clat
            if (currentRequestObj.clong) delete currentRequestObj.clong
            this.deleteParamFromUrl('clat')
            this.deleteParamFromUrl('clong')
            this.deleteParamFromUrl('cname')
            currentRequestObj.sorting = this.params.get('sorting') || 3
            this.updateURLParam('sorting', currentRequestObj.sorting)
          }
        }
        const result = await this.webWorker(WithFacet.updateFilters, currentCompleteFilterObj, undefined, undefined)
        currentCompleteFilterObj = result[0]
        currentRequestObj.filter = result[1]
      } else if (event?.detail?.key === 'input-search') {
        // text field search
        if (event?.detail?.value) {
          this.updateURLParam('q', event.detail.value)
          currentRequestObj.searchText = event.detail.value
        }
        if (event?.detail?.value === '') {
          delete currentRequestObj.searchText
          this.deleteParamFromUrl('q')
        }
        const result = await this.webWorker(WithFacet.updateFilters, currentCompleteFilterObj, undefined, undefined)
        currentCompleteFilterObj = result[0]
        currentRequestObj.filter = result[1]

        currentRequestObj.sorting = 1 // relevance
        if (event?.detail?.value === '' && !currentRequestObj.clat) {
          delete currentRequestObj.searchText
          currentRequestObj.sorting = 3 // alphabetic
        }
        if (event?.detail?.value !== '' && currentRequestObj.clat) {
          currentRequestObj.sorting = 2 // distance
        }
      } else if (event?.detail?.key === 'sorting' && !!event.detail.id) {
        // sorting
        currentRequestObj.sorting = event.detail.id || 3
        this.updateURLParam('sorting', currentRequestObj.sorting)
        const result = await this.webWorker(WithFacet.updateFilters, currentCompleteFilterObj, undefined, undefined)
        currentCompleteFilterObj = result[0]
        currentRequestObj.filter = result[1]
      } else {
        // default behavior
        // always shake out the response filters to only include selected filters or selected in ancestry
        const result = await this.webWorker(WithFacet.updateFilters, currentCompleteFilterObj, undefined, undefined)
        currentCompleteFilterObj = result[0]
        currentRequestObj.filter = result[1]
      }

      if (!currentRequestObj.filter.length) currentRequestObj.filter = structuredClone(initialRequestObj.filter)
      const LanguageEnum = {
        d: 'de',
        f: 'fr',
        i: 'it'
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
              currentRequestObj.filter = currentCompleteFilterObj = json.filters

              // hold the json.filters from the very first response call
              if (firstRequest) {
                initialResponseFilters = json.filters
                firstRequest = false
              }
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
              const cname = this.params.get('cname')
              if (cname) coordinatesToTerm.set(searchCoordinates, decodeURIComponent(cname))

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
      let subLevelFilter = event.detail.filter

      if (currentRequestObj.filter?.length) subLevelFilter = [...event.detail.filter, ...currentRequestObj.filter]

      const sorting = currentRequestObj.sorting || initialRequestObj.sorting
      const searchText = currentRequestObj.searchText || initialRequestObj.searchText

      let body = `{
        "filter": ${JSON.stringify(subLevelFilter)},
        "MandantId": ${this.getAttribute('mandant-id') || initialRequestObj.MandantId || 110},
        "PortalId": ${this.getAttribute('portal-id') || initialRequestObj.PortalId || 29},
        "sprachid": "${this.getAttribute('sprach-id') || initialRequestObj.sprachid || 'd'}",
        "psize": ${this.getAttribute('p-size') || initialRequestObj.psize || 12},
        "sorting": ${sorting === 2 ? 1 : 2}
        ${searchText ? `,"searchText": "${searchText}"` : ''}
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

  connectedCallback() {
    this.getAttribute('expand-event-name') === 'request-with-facet' ? self.addEventListener('request-with-facet', this.requestWithFacetListener) : this.addEventListener('request-with-facet', this.requestWithFacetListener)
    this.getAttribute('expand-event-name') === 'reset-all-filters' ? self.addEventListener('reset-all-filters', this.requestWithFacetListener) : this.addEventListener('reset-all-filters', this.requestWithFacetListener)
    this.getAttribute('expand-event-name') === 'reset-filter' ? self.addEventListener('reset-filter', this.requestWithFacetListener) : this.addEventListener('reset-filter', this.requestWithFacetListener)
    this.getAttribute('expand-event-name') === 'request-locations' ? self.addEventListener('request-locations', this.requestLocations) : this.addEventListener('request-locations', this.requestLocations)
    self.addEventListener('popstate', this.popstateListener)
  }

  disconnectedCallback() {
    this.getAttribute('expand-event-name') === 'request-with-facet' ? self.removeEventListener('request-with-facet', this.requestWithFacetListener) : this.removeEventListener('request-with-facet', this.requestWithFacetListener)
    this.getAttribute('expand-event-name') === 'reset-all-filters' ? self.removeEventListener('reset-all-filters', this.requestWithFacetListener) : this.removeEventListener('reset-all-filters', this.requestWithFacetListener)
    this.getAttribute('expand-event-name') === 'reset-filter' ? self.removeEventListener('reset-filter', this.requestWithFacetListener) : this.removeEventListener('reset-filter', this.requestWithFacetListener)
    this.getAttribute('expand-event-name') === 'request-locations' ? self.removeEventListener('request-locations', this.requestLocations) : this.removeEventListener('request-locations', this.requestLocations)
    self.removeEventListener('popstate', this.popstateListener)
  }

  // always shake out the response filters to only include selected filters or selected in ancestry
  static updateFilters(filters, filterKey, filterValue, reset = false, zeroLevel = true, selectedParent = null, isTree = false) {
    // @ts-ignore
    const isParentSelected = selectedParent?.urlpara === filterKey
    const treeShookFilters = []

    filters.forEach(filterItem => {
      const isCenterFilter = filterItem.id === filterValue && filterItem.urlpara === filterKey
      const isMatchingKey = (filterItem.urlpara === filterKey) && (filterItem.urlpara !== undefined)
      const isUrlpara = filterItem.urlpara === filterValue

      // only the first level has the urlpara === filterKey check
      if (!zeroLevel || isMatchingKey) {
        if (filterItem.selected && isUrlpara && !isTree && !isCenterFilter) {
          filterItem.selected = false // toggle filterItem if is is already selected, but not in tree
        } else if (filterItem.selected && !isUrlpara && !isCenterFilter) {
          filterItem.selected = true // keep filterItem selected if it is already selected
        } else if (!filterItem.selected && isUrlpara && isParentSelected && !isCenterFilter) {
          filterItem.selected = true // select filterItem if it is not selected
        } else if (isParentSelected && !isCenterFilter) {
          // @ts-ignore
          selectedParent.selected = false // deselect filterItem if it is not selected
        } else if (isCenterFilter) {
          filterItem.selected = !filterItem.selected // toggle filterItem if it is not selected
        }
      }

      let treeShookFilterItem = structuredClone(filterItem)

      if (reset && isMatchingKey) {
        treeShookFilterItem.children = []
      } else if (filterItem.children) {
        [filterItem.children, treeShookFilterItem.children] = WithFacet.updateFilters(filterItem.children, filterKey, filterValue, reset, false, filterItem, isTree)
      }

      // only the first level allows selected falls when including selected children
      if (treeShookFilterItem.children?.length || treeShookFilterItem.selected) treeShookFilters.push(treeShookFilterItem)
    })

    return [filters, treeShookFilters]
  }

  getLastSelectedFilterItem(filterItems) {
    filterItems.forEach(filterItem => {
      if (filterItem.children?.length) {
        filterItem.selected = false
        this.getLastSelectedFilterItem(filterItem.children)
      } else {
        return filterItem.selected = true
      }
    })

    return filterItems
  }

  static cleanRequest(requestObj) {
    // Bad API needs filter for payload but responses with filters
    if (requestObj.filters) delete requestObj.filters
    return requestObj
  }

  catchURLParams() {
    return new URLSearchParams(self.location.search)
  }

  updateURLParam(key, value, isTree = false) {
    if (this.params) {
      if (this.params.has(key) && key !== 'q' && key !== 'clat' && key !== 'clong' && key !== 'cname' && key !== 'sorting' && !isTree) {
        const currentValues = this.params.get(key)?.split('-')
        if (!currentValues?.includes(value)) {
          currentValues?.push(value)
          // @ts-ignore
          this.params.set(key, currentValues?.join('-'))
        } else {
          currentValues?.splice(currentValues.indexOf(value), 1)
          if (currentValues.length > 0) {
            this.params.set(key, currentValues.join('-'))
          } else if (!isTree) { // keep it for tree filters
            this.params.delete(key)
          }
        }
      } else if (key && isTree) {
        // for sector filters (isTree): check all params if key is set as value of another key
        const keys = Array.from(this.params.keys())
        for (const k of keys) {
          const value = this.params.get(k)
          if (value === key) this.params.delete(k)
        }
        this.params.set(key, value)

        // check if key already exists and replace it with new value
        if (this.params.get(key)) {
          this.params.delete(key)
          this.params.set(key, value)
        }
      } else {
        this.params.set(key, value)
      }

      WithFacet.historyReplaceState({}, '', `${this.url.origin}${this.url.pathname}?${this.params.toString()}`)
    }
  }

  deleteAllFiltersFromUrl(filters) {
    if (this.params) {
      filters.forEach(filterItem => {
        if (filterItem.children && filterItem.children.length > 0) {
          this.deleteAllFiltersFromUrl(filterItem.children)
        }
        this.params.delete(filterItem.urlpara)
      })

      this.params.delete('q')
      if (!this.saveLocationDataInLocalStorage && !this.saveLocationDataInSessionStorage) {
        this.params.delete('clat')
        this.params.delete('clong')
        this.params.delete('cname')
      }

      WithFacet.historyReplaceState({}, '', `${this.url.origin}${this.url.pathname}?${this.params.toString()}`)
    }
  }

  deleteParamFromUrl(filterKey) {
    if (this.params) {
      this.params.delete(filterKey)
      WithFacet.historyReplaceState({}, '', `${this.url.origin}${this.url.pathname}?${this.params.toString()}`)
    }
  }

  static historyReplaceState(...args) {
    // Avoid multiple empty pushes, otherwise the navigation history becomes jammed
    if ((new URL(args[2])).search !== location.search) {
      // @ts-ignore
      self.history.replaceState(...args)
    }
  }
}
