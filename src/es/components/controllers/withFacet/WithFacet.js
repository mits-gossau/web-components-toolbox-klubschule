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

    this.filterOnly = false

    let timeoutId = null
    const coordinatesToTerm = new Map()
    // the initial request object received through the attribute, never changes and is always included
    const initialRequestObj = JSON.parse(this.getAttribute('initial-request')) || {}
    // current request obj holds the current filter states and syncs it to the url (url params are write only, read is synced by cms to the initialRequestObj)
    let currentRequestObj = structuredClone(initialRequestObj)
    // complete filter obj, holds all the filters all the time. In opposite to currentRequestObj.filter, which tree shakes not selected filter, to only send the essential to the API (Note: The API fails if all filters get sent)
    let currentCompleteFilterObj = currentRequestObj.filter || []
    // base request nullFilter
    let initialFilter = this.getInitialBaseFilters(currentCompleteFilterObj)
    // Set "null" Filter as base Filter, if no prefiltering is happening. e.g. "Sprachen"
    if (initialFilter.length < 1) {
      this.filterOnly = false
      initialFilter = this.getNullFilter()
    }

    // this url is not changed but used for url history push stuff
    this.url = new URL(self.location.href)
    this.params = new URLSearchParams(self.location.search)
    const isMocked = this.hasAttribute('mock')
    const isMockedInfoEvents = this.hasAttribute('mock-info-events')    
    let endpoint = isMocked
      ? `${this.importMetaUrl}./mock/default.json`
      : `${this.getAttribute('endpoint') || 'https://dev.klubschule.ch/Umbraco/Api/CourseApi/Search'}`
    const isInfoEvents = this.hasAttribute('endpoint-info-events')
    const isOtherLocations = this.hasAttribute('is-other-locations')
    let endpointInfoEvents = this.getAttribute('endpoint-info-events') || 'https://dev.klubschule.ch/Umbraco/Api/CourseApi/Informationevent'
    if (!endpointInfoEvents.startsWith('http://') && !endpointInfoEvents.startsWith('https://')) {
      endpointInfoEvents = `${this.url.origin}${endpointInfoEvents}`
    }
    if (isMockedInfoEvents) endpoint = new URL('./mock/info-events.json', import.meta.url).href
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
        if (!currentRequestObj.filter?.length) currentCompleteFilterObj = sessionStorage.getItem('currentFilter') ? JSON.parse(sessionStorage.getItem('currentFilter') || '[]') : initialFilter
        const result = await this.webWorker(WithFacet.updateFilters, currentCompleteFilterObj, undefined, undefined)
        currentCompleteFilterObj = result[0]
        currentRequestObj.filter = [...result[1], ...initialFilter.filter(filter => !result[1].find(resultFilterItem => resultFilterItem.id === filter.id))]
      } else if (event?.type === 'reset-all-filters') {
        // reset all filters
        this.deleteAllFiltersFromUrl(currentRequestObj.filter)
        currentRequestObj = structuredClone(initialRequestObj)
        delete currentRequestObj.searchText
        currentRequestObj.filter = initialFilter
        currentRequestObj.sorting = 3
        if ((this.saveLocationDataInLocalStorage || this.saveLocationDataInSessionStorage) && this.params.has('cname')) currentRequestObj.sorting = 2
      } else if (event?.type === 'reset-filter') {
        // reset particular filter, ks-a-button
        const filterKey = event.detail.this.getAttribute('filter-key')
        if (!currentRequestObj.filter?.length) currentCompleteFilterObj = sessionStorage.getItem('currentFilter') ? JSON.parse(sessionStorage.getItem('currentFilter') || '[]') : initialFilter
        const result = await this.webWorker(WithFacet.updateFilters, currentCompleteFilterObj, filterKey, undefined, true)
        currentCompleteFilterObj = result[0]
        currentRequestObj.filter = [...result[1], ...initialRequestObj.filter]
        if (filterKey === 'q') {
          delete currentRequestObj.searchText
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
      } else if (event?.detail?.selectedFilterId) {
        // selected filter click/touch on filter pills or filter navLevelItem on level 0
        // triggered by FilterSelect or FilterCategories
        if (!currentRequestObj.filter?.length && sessionStorage.getItem('currentFilter')) currentRequestObj.filter = JSON.parse(sessionStorage.getItem('currentFilter') || '[]')
        if (!currentCompleteFilterObj.length && sessionStorage.getItem('currentFilter')) currentCompleteFilterObj = JSON.parse(sessionStorage.getItem('currentFilter') || '[]')
        
        // exception, because parent id matches with children urlpara in case of start time filter (Startzeitpunkt)
        // exception only on click on filter pills, on filter navLevelItem everything works as expected
        // this would not be needed if filter ids where unique and urlparas would match
        const isStartTimeSelectedFromFilterPills = event.detail.selectedFilterId === '6'
        const isMulti = event.detail?.selectedFilterType === 'multi' || event.detail?.filterType === 'multi' || false
        const isTree = event.detail?.selectedFilterType === 'tree'
        if (isTree) currentRequestObj.filter = await this.webWorker(WithFacet.getLastSelectedFilterItem, currentRequestObj.filter)
        
        // find the selected filter item (not tree)
        const selectedFilterItem = currentCompleteFilterObj.find((filter) => filter.id === event.detail.selectedFilterId)
        if (!selectedFilterItem) return
        selectedFilterItem.skipCountUpdate = true
        const result = await this.webWorker(WithFacet.updateFilters, currentCompleteFilterObj, selectedFilterItem.urlpara, selectedFilterItem.id, false, true, null, false, false, isMulti, isStartTimeSelectedFromFilterPills)
        currentCompleteFilterObj = result[0]
        currentRequestObj.filter = [...result[1], ...initialFilter.filter(filter => !result[1].find(resultFilterItem => resultFilterItem.id === filter.id))]
        this.filterOnly = true
      } else if ((filterGroupName = event?.detail?.wrapper?.filterItem) && (filterId = event.detail?.target?.getAttribute?.('filter-id') || event.detail?.target?.filterId)) {
        // current filter click/touch
        // triggered by component interaction eg. checkbox or nav-level-item
        // build dynamic filters according to the event
        const [filterKey, filterValue] = filterId.split('-')
        // tree === angebotsbereich (offers filter)
        const isTree = event?.detail?.target?.type === "tree"
        if (isTree) {
          this.updateURLParam(currentCompleteFilterObj.find((filter) => Number(filter.id) === 7)?.urlpara, filterValue, true)
        } else {
          this.updateURLParam(filterKey, filterValue, false)
        }

        // GTM Tracking of Filters
        if (event.detail?.target?.checked) this.dataLayerPush({
          'event': 'filterSelection',
          'filterName': event.detail.target.label, //the name of the clicked filter.
          'filterCategory': filterGroupName.attributes?.label ? filterGroupName.attributes.label.value : filterGroupName.label, //the category that this filter belongs to - IF there is one, if not we can remove this key
        })
        const result = await this.webWorker(WithFacet.updateFilters, currentCompleteFilterObj, filterKey, filterValue, false, true, null, false, isTree)
        currentCompleteFilterObj = result[0]
        currentRequestObj.filter = [...result[1], ...initialFilter.filter(filter => !result[1].find(resultFilterItem => resultFilterItem.id === filter.id))]
        if (isTree) currentRequestObj.filter = await this.webWorker(WithFacet.getLastSelectedFilterItem, currentRequestObj.filter)
        this.filterOnly = true
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
        currentRequestObj.filter = [...result[1], ...initialFilter.filter(filter => !result[1].find(resultFilterItem => resultFilterItem.id === filter.id))]
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
        const isTree = event?.detail?.this?.attributes['filter-type']?.value === 'tree'
        const result = await this.webWorker(WithFacet.updateFilters, currentCompleteFilterObj, undefined, undefined)
        currentCompleteFilterObj = result[0]
        currentRequestObj.filter = [...result[1], ...initialFilter.filter(filter => !result[1].find(resultFilterItem => resultFilterItem.id === filter.id))]
        if (isTree) currentRequestObj.filter = await this.webWorker(WithFacet.getLastSelectedFilterItem, currentRequestObj.filter)
      }

      // filter only
      this.filterOnly ? currentRequestObj.onlyfaceted = 1 : delete currentRequestObj.onlyfaceted

      // load more 
      event?.detail?.loadCoursesOnly ? currentRequestObj.onlycourse = true : delete currentRequestObj.onlycourse

      if (!currentRequestObj.filter.length) currentRequestObj.filter = initialFilter

      if (isInfoEvents) {
        const endpointInfoEventsUrl = new URL(endpointInfoEvents)
        currentRequestObj.psize = endpointInfoEventsUrl.searchParams.has('psize') ? Number(endpointInfoEventsUrl.searchParams.get('psize')) : 3
        currentRequestObj.ppage = endpointInfoEventsUrl.searchParams.has('ppage') ? Number(endpointInfoEventsUrl.searchParams.get('ppage')) : 0
        currentRequestObj.searchText = ''
      } else {
        currentRequestObj.psize = this.getAttribute('psize') || initialRequestObj.psize || 12
      }
      
      if (isOtherLocations) {
        if (!endpoint.startsWith('http://') && !endpoint.startsWith('https://')) {
          endpoint = `${this.url.origin}${endpoint}`
        }
        const endpointOtherLocationsUrl = new URL(endpoint)
        currentRequestObj.psize = endpointOtherLocationsUrl.searchParams.has('psize') ? Number(endpointOtherLocationsUrl.searchParams.get('psize')) : 6
        currentRequestObj.ppage = endpointOtherLocationsUrl.searchParams.has('ppage') ? Number(endpointOtherLocationsUrl.searchParams.get('ppage')) : 0
        currentRequestObj.searchText = ''
      } else {
        currentRequestObj.psize = this.getAttribute('psize') || initialRequestObj.psize || 12
      }

      // escape quotation marks from search text
      if (currentRequestObj.searchText && !currentRequestObj.searchText.includes('\\"')) currentRequestObj.searchText = currentRequestObj.searchText.replace(/"/g, '\\"')

      const LanguageEnum = {
        d: 'de',
        f: 'fr',
        i: 'it'
      }
      let request = {}
      if (isMocked || isMockedInfoEvents) {
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
        const detail = {
          /** @type {Promise<fetchAutoCompleteEventDetail>} */
          fetch: fetch(isInfoEvents ? endpointInfoEvents : endpoint, request).then(response => {
            if (response.status >= 200 && response.status <= 299) {
              return response.json()
            }
            throw new Error(response.statusText)
          }).then(json => {
            // TODO/ERROR: Api answers with empty filter payload when using ppage (next page). Workaround for keeping filters when returned empty.
            if (event?.detail?.ppage && !json.filters.length) json.filters = sessionStorage.getItem('currentFilter') ? JSON.parse(sessionStorage.getItem('currentFilter') || '[]') : currentRequestObj.filter || initialFilter || []  
            
            // update filters with api response
            currentRequestObj.filter = currentCompleteFilterObj = json.filters

            if (json.courses.length) sessionStorage.setItem('currentCourses', JSON.stringify(json.courses))
            if (json.filters.length) sessionStorage.setItem('currentFilter', JSON.stringify(json.filters))
            if (isInfoEvents && !json.courses.length) this.dispatchEvent(new CustomEvent('info-events-empty', { bubbles: true, composed: true, cancelable: true }))
            if (!json.filters.length && sessionStorage.getItem('currentFilter')) json.filters = JSON.parse(sessionStorage.getItem('currentFilter') || '[]')

            return json
          }),
          onlyfaceted: currentRequestObj.onlyfaceted
        }
        if (event.detail?.resolve) return event.detail.resolve(detail)
        this.dispatchEvent(new CustomEvent('with-facet', {
          detail,
          bubbles: true,
          cancelable: true,
          composed: true
        }))
        detail.fetch.finally(json => {
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

        // update ppage
        if (isOtherLocations) endpoint = this.updatePpage(endpoint, currentRequestObj.ppage)
        if (isInfoEvents) endpointInfoEvents = this.updatePpage(endpointInfoEvents, currentRequestObj.ppage)
      }, event.detail?.resolve ? 0 : 50)
    }

    this.abortControllerLocations = null
    this.requestLocations = event => {
      if (this.abortControllerLocations) this.abortControllerLocations.abort()
      this.abortControllerLocations = new AbortController()

      // merge both user Filter with sublevel filter
      let subLevelFilter = event.detail.filter
      const isAboList = event.detail.isAboList

      if (currentRequestObj.filter?.length && !isAboList) subLevelFilter = [...event.detail.filter, ...currentRequestObj.filter]

      const searchText = isAboList ? null : currentRequestObj.searchText || initialRequestObj.searchText

      let mandantId = this.getAttribute('mandant-id') || initialRequestObj.MandantId || 111
      if (isInfoEvents) {
        const endpointInfoEventsUrl = new URL(endpointInfoEvents)
        if (endpointInfoEventsUrl.searchParams.has('mandant_id')) mandantId = endpointInfoEventsUrl.searchParams.get('mandant_id')
      }

      let body = `{
        "filter": ${JSON.stringify(subLevelFilter)},
        "MandantId": ${mandantId},
        "PortalId": ${this.getAttribute('portal-id') || initialRequestObj.PortalId || 29},
        "sprachid": "${this.getAttribute('sprach-id') || initialRequestObj.sprachid || 'd'}",
        "psize": ${this.getAttribute('p-size') || initialRequestObj.psize || 12},
        "sorting": 2
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
  }

  connectedCallback() {
    this.getAttribute('expand-event-name') === 'request-with-facet' ? self.addEventListener('request-with-facet', this.requestWithFacetListener) : this.addEventListener('request-with-facet', this.requestWithFacetListener)
    this.getAttribute('expand-event-name') === 'reset-all-filters' ? self.addEventListener('reset-all-filters', this.requestWithFacetListener) : this.addEventListener('reset-all-filters', this.requestWithFacetListener)
    this.getAttribute('expand-event-name') === 'reset-filter' ? self.addEventListener('reset-filter', this.requestWithFacetListener) : this.addEventListener('reset-filter', this.requestWithFacetListener)
    this.getAttribute('expand-event-name') === 'request-locations' ? self.addEventListener('request-locations', this.requestLocations) : this.addEventListener('request-locations', this.requestLocations)
    document.addEventListener('backdrop-clicked', this.handleBackdropClicked)
  }

  disconnectedCallback() {
    this.getAttribute('expand-event-name') === 'request-with-facet' ? self.removeEventListener('request-with-facet', this.requestWithFacetListener) : this.removeEventListener('request-with-facet', this.requestWithFacetListener)
    this.getAttribute('expand-event-name') === 'reset-all-filters' ? self.removeEventListener('reset-all-filters', this.requestWithFacetListener) : this.removeEventListener('reset-all-filters', this.requestWithFacetListener)
    this.getAttribute('expand-event-name') === 'reset-filter' ? self.removeEventListener('reset-filter', this.requestWithFacetListener) : this.removeEventListener('reset-filter', this.requestWithFacetListener)
    this.getAttribute('expand-event-name') === 'request-locations' ? self.removeEventListener('request-locations', this.requestLocations) : this.removeEventListener('request-locations', this.requestLocations)
    document.removeEventListener('backdrop-clicked', this.handleBackdropClicked)
  }

  handleBackdropClicked = () => {
    this.filterOnly = false
    this.dispatchEvent(new CustomEvent('request-with-facet'))
  }

  // always shake out the response filters to only include selected filters or selected in ancestry
  static updateFilters(filters, filterKey, filterValue, reset = false, zeroLevel = true, selectedParent = null, isSectorFilter = false, isTree = false, isMulti = false, isStartTimeSelectedFromFilterPills = false) {
    // @ts-ignore
    const isParentSelected = selectedParent?.urlpara === filterKey
    const treeShookFilters = []

    filters.forEach(filterItem => {
      // TODO: Is there a better way to check if it is a center filter? For expl.: (filterItem.urlpara === filterKey)?
      const isCenterFilter = filterItem.id === filterValue && ['center', 'centre', 'centro'].includes(filterKey.toLowerCase())
      const isMatchingKey = (filterItem.urlpara === filterKey) && (filterItem.urlpara !== undefined)
      const isUrlpara = filterItem.urlpara === filterValue
      if (zeroLevel) isSectorFilter = Number(filterItem.id) === 7 && filterItem.typ === "tree"

      filterItem.skipCountUpdate = false

      // only the first level has the urlpara === filterKey check
      if (!zeroLevel || isMatchingKey) {
        if (isCenterFilter) {
          filterItem.selected = !filterItem.selected // toggle filterItem if it is not selected
        } else if (isSectorFilter && isTree) { // sector filter ("Angebotsbereich")
          if (!filterItem.selected && isUrlpara) {
            filterItem.selected = true
          } else if (filterItem.selected && !isUrlpara) {
            filterItem.selected = false 
          }
        } else if (filterItem.selected && isUrlpara && !isStartTimeSelectedFromFilterPills) {
          filterItem.selected = false // toggle filterItem if is is already selected, but not in tree
        } else if (filterItem.selected && !isUrlpara) {
          filterItem.selected = true // keep filterItem selected if it is already selected
        } else if (!filterItem.selected && isUrlpara && isParentSelected && !isStartTimeSelectedFromFilterPills) {
          filterItem.selected = true // select filterItem if it is not selected
        } else if (isParentSelected) {
          // @ts-ignore
          selectedParent.selected = false // deselect filterItem if it is not selected
        } 
      } else if (zeroLevel && isTree && isSectorFilter) {
        filterItem.skipCountUpdate = true
      }

      let treeShookFilterItem = structuredClone(filterItem)

      if (reset && isMatchingKey) {
        treeShookFilterItem.children = []
      } else if (filterItem.children && !isMulti) {
        [filterItem.children, treeShookFilterItem.children] = WithFacet.updateFilters(filterItem.children, filterKey, filterValue, reset, false, filterItem, isSectorFilter, isTree, isMulti, isStartTimeSelectedFromFilterPills)
      }

      // only the first level allows selected falls when including selected children
      if (treeShookFilterItem.children?.length || treeShookFilterItem.selected || treeShookFilterItem.isquick > 0) {
        if (treeShookFilterItem.urlpara === filterKey) {
          treeShookFilterItem.skipCountUpdate = true
        }
        treeShookFilters.push(treeShookFilterItem)
      }
    })

    // returns [0] unmutated filters
    return [filters, treeShookFilters]
  }

  static getLastSelectedFilterItem(filterItems) {
    filterItems.forEach(filterItem => {
      if (filterItem.children?.length) {
        filterItem.skipCountUpdate = false
        if (filterItem.level === '') filterItem.skipCountUpdate = true
        this.getLastSelectedFilterItem(filterItem.children) // recursive call
      }
    })

    return filterItems
  }

  static cleanRequest(requestObj) {
    // Bad API needs filter for payload but responses with filters
    if (requestObj.filters) delete requestObj.filters
    return requestObj
  }

  updatePpage(endpointUrl, currentPpage) {
    const url = new URL(endpointUrl);
    url.searchParams.set('ppage', currentPpage + 1);
    return url.href;
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
      // delete sector filter
      const sectorRegex = /^[0-9]{1}N[0-9]{5}$/
      if (sectorRegex.test(filterKey)) {
        const keys = Array.from(this.params.keys())
        for (const key of keys) {
          const value = this.params.get(key)
          if (value && sectorRegex.test(value)) this.params.delete(key)
        }
      }
      // delete all other filters
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

  /** 
   * Recursive function to get only the "initial"-filters, which are not editable by the user
   * Needs to be done, since Backend is writing filterqueries into the initial request, when the page is refreshed/ shared
   * For more Informations: https://jira.migros.net/browse/MIDUWEB-1452
   * @returns Array with Filter Objects, which are non editable by the user
  */ 
  getInitialBaseFilters(filters) {
    return filters.filter(
      (filter) => {
        if (filter.selected && filter.disabled) {
          return true
        }
        if (filter.children?.length) {
          return this.getInitialBaseFilters(filter.children).length > 0
        }
        return false
      }
    )
  }

  /**
   * Returns a null Filter Object, which is used for a plain search on /search/ level
   * @return a "null" Filter Object
   */
  getNullFilter() {
    return [
      {
        "PartitionKey": null,
        "RowKey": null,
        "label": null,
        "id": "",
        "typ": null,
        "level": "",
        "count": 0,
        "color": "",
        "urlpara": "",
        "selected": false,
        "disabled": false,
        "visible": false,
        "sort": 0,
        "hideCount": false,
        "children": null,
        "HasChilds": false
      }
    ]
  }

  dataLayerPush (value) {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.dataLayer) {
      try {
        // @ts-ignore
        window.dataLayer.push(value)
      } catch (err) {
        console.error('Failed to push event data:', err)
      }
    }
  }
}
