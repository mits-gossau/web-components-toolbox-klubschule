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
    // NOTE: The api has on payload filter and on response filters. Now both are filters, below if is for fixing old payloads as initial request objects.
    if (initialRequestObj.filter) {
      initialRequestObj.filters = initialRequestObj.filter
      delete initialRequestObj.filter
    }
    // current request obj holds the current filter states and syncs it to the url (url params are write only, read is synced by cms to the initialRequestObj)
    let currentRequestObj = structuredClone(initialRequestObj)
    // complete filter obj, holds all the filters all the time. In opposite to currentRequestObj.filters, which tree shakes not selected filter, to only send the essential to the API (Note: The API fails if all filters get sent)
    let currentCompleteFilterObj = currentRequestObj.filters || []
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
    const isSearchPage = this.hasAttribute('search-page') || ['/suche', '/recherche', '/ricerca'].some(path => window.location.pathname.startsWith(path))
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

    // check if the page was refreshed
    const navigationEntry = window.performance.getEntries().find(entry => entry.entryType === 'navigation')
    // @ts-ignore
    const isPageRefreshed = navigationEntry && navigationEntry.type === 'reload'

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
      if (!this.params.has('sorting')) {
        if (sessionStorage.getItem('currentSorting')) {
          this.updateURLParam('sorting', sessionStorage.getItem('currentSorting'))
        } else {
          if (isSearchPage && currentRequestObj.clat) {
            this.updateURLParam('sorting', 1)
            sessionStorage.setItem('currentSorting', '1')
          } else {
            this.updateURLParam('sorting', 2)
            sessionStorage.setItem('currentSorting', '2')
          }
        }
      }
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
      if (currentRequestObj.clat && currentRequestObj.clong && !currentRequestObj.searchText) currentRequestObj.sorting = 2 // distance
    }

    // If shared with active Sorting, keep param for other user
    if (this.params.has('sorting')) currentRequestObj.sorting = Number(this.params.get('sorting'))

    // if the user has a location search, set the sorting to distance, but not on page refresh
    const isSamePath = sessionStorage.getItem('currentPathname') === window.location.pathname
    if (this.params.has('clat') && !isSamePath && !currentRequestObj.searchText) {
      currentRequestObj.sorting = 2
      this.updateURLParam('sorting', 2)
    }
    sessionStorage.setItem('currentPathname', window.location.pathname)
    
    // if performing a search query, always sort by relevance unless the page is refreshed
    if (this.params.has('q') && isSearchPage && !isPageRefreshed) {
      currentRequestObj.sorting = 1 // relevance
      this.updateURLParam('sorting', 1)
      sessionStorage.setItem('currentSorting', '1')
    }

    this.requestWithFacetListener = async event => {
      // Reset PPage after filter Change / Reset
      currentRequestObj.ppage = 0
      // mdx prevent double event
      if (event?.detail?.mutationList && event.detail.mutationList[0].attributeName !== 'checked') return
      if (this.abortController) this.abortController.abort()
      this.abortController = new AbortController()

      let filterId = null
      let filterGroupName = null
      let hasSelectedFilter = false
      if (event?.detail?.ppage) {
        // ppage reuse last request
        currentRequestObj = Object.assign(currentRequestObj, { ppage: event.detail.ppage })
        if (!currentRequestObj.filters?.length) currentCompleteFilterObj = sessionStorage.getItem('currentFilter') ? JSON.parse(sessionStorage.getItem('currentFilter') || '[]') : initialFilter
        const result = await this.webWorker(WithFacet.updateFilters, currentCompleteFilterObj, undefined, undefined)
        hasSelectedFilter = result[2]
        currentCompleteFilterObj = result[0]
        currentRequestObj.filters = [...result[1], ...initialFilter.filter(filter => !result[1].find(resultFilterItem => resultFilterItem.id === filter.id))]
      } else if (event?.type === 'reset-all-filters') {
        // take the params from url
        // check the key with the urlpara from filter in currentRequestObj.filters
        // find filter with same id in initialRequestObj.filters
        // remove filters with same id from initialRequestObj.filters
        const filtersToRemove = []
        currentRequestObj.filters.forEach(filter => {
          if (filter.urlpara && this.params.has(filter.urlpara)) {
            const idx = (initialRequestObj.filters || []).findIndex(f => f.id === filter.id)
            if (idx !== -1) filtersToRemove.push(idx)
          }
        })
        filtersToRemove.sort((a, b) => b - a).forEach(idx => initialRequestObj.filters.splice(idx, 1))
        // exclude selected filters from initialRequestObj.filters that are not in URL params
        const excludeIds = (initialRequestObj.filters || []).filter(f => f.selected && f.urlpara && !this.params.has(f.urlpara)).map(f => f.id)
        // reset all filters
        this.deleteAllFiltersFromUrl(currentRequestObj.filters)
        // keep quick filters
        let quickFilters = (currentRequestObj.filters || []).filter(f => f.isquick)
        quickFilters = quickFilters.map(f => ({ ...f, selected: false, children: [] }))
        if (isSearchPage) {
          currentRequestObj.filters = [...quickFilters, ...(initialFilter || []).filter(f => f.isquick)]
        } else { 
          // build currentRequestObj.filters:
          // 1. first, keep all filters from initialRequestObj.filters whose ID is in excludeIds (untouched)
          // 2. then, add quickFilters, but only if not already included above
          // 3. finally, add all remaining filters from initialRequestObj.filters that are not in excludeIds and not in quickFilters
          currentRequestObj.filters = [
            ...initialRequestObj.filters.filter(f => excludeIds.includes(f.id)),
            ...quickFilters.filter(qf => !excludeIds.includes(qf.id)),
            ...initialRequestObj.filters.filter(f =>
              !excludeIds.includes(f.id) &&
              !quickFilters.some(qf => qf.id === f.id)
            )
          ]
        }
        // reset all other params
        delete currentRequestObj.searchText
        currentRequestObj.sorting = 3
        if ((this.saveLocationDataInLocalStorage || this.saveLocationDataInSessionStorage) && this.params.has('cname')) currentRequestObj.sorting = 2
        this.filterOnly = true
      } else if (event?.type === 'reset-filter') {
        // reset particular filter, ks-a-button
        const filterKey = event.detail.this?.getAttribute?.('filter-key') || event.detail.filterKey
        if (!currentRequestObj.filters?.length) currentCompleteFilterObj = sessionStorage.getItem('currentFilter') ? JSON.parse(sessionStorage.getItem('currentFilter') || '[]') : initialFilter
        const result = await this.webWorker(WithFacet.updateFilters, currentCompleteFilterObj, filterKey, undefined, true)
        hasSelectedFilter = result[2]
        currentCompleteFilterObj = result[0]
        if (isSearchPage) {
          currentRequestObj.filters = [...result[1], ...initialFilter.filter(filter => !result[1].find(resultFilterItem => resultFilterItem.id === filter.id))]
        } else {
          currentRequestObj.filters = [...result[1], ...initialRequestObj.filters.filter(filter => !result[1].find(resultFilterItem => resultFilterItem.id === filter.id))]
          Array.from(this.params.keys()).forEach(paramKey => {
            if (paramKey === filterKey) {
              // check if filter has value in "isquick", then keep it, set "selected:false" and remove children []
              // otherwise just remove it
              currentRequestObj.filters = (currentRequestObj.filters || []).map(f => (f.urlpara === filterKey && f.isquick) ? { ...f, selected: false, children: [] } : f).filter(f => !(f.urlpara === filterKey && !f.isquick))
              initialRequestObj.filters = (initialRequestObj.filters || []).map(f => (f.urlpara === filterKey && f.isquick) ? { ...f, selected: false, children: [] } : f).filter(f => !(f.urlpara === filterKey && !f.isquick))
            }
          })
        }
        const isTree = event?.detail?.this?.attributes['filter-type']?.value === 'tree'
        if (isTree) {
          currentRequestObj.filters = await this.webWorker(WithFacet.getSectorFilterWithInitialFallback, currentRequestObj.filters, initialRequestObj.filters)
          currentRequestObj.filters = await this.webWorker(WithFacet.getLastSelectedFilterItem, currentRequestObj.filters)
        }
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
        if (!currentRequestObj.filters?.length && sessionStorage.getItem('currentFilter')) currentRequestObj.filters = JSON.parse(sessionStorage.getItem('currentFilter') || '[]')
        if (!currentCompleteFilterObj.length && sessionStorage.getItem('currentFilter')) currentCompleteFilterObj = JSON.parse(sessionStorage.getItem('currentFilter') || '[]')
        // exception, because parent id matches with children urlpara in case of start time filter (Startzeitpunkt)
        // exception only on click on filter pills, on filter navLevelItem everything works as expected
        // this would not be needed if filter ids where unique and urlparas would match
        const isStartTimeSelectedFromFilterPills = event.detail.selectedFilterId === '6'
        const isMulti = event.detail?.selectedFilterType === 'multi' || event.detail?.filterType === 'multi' || false
        const isTree = event.detail?.selectedFilterType === 'tree' || event.detail?.filterType === 'tree' || false
        if (isTree) currentRequestObj.filters = await this.webWorker(WithFacet.getLastSelectedFilterItem, currentRequestObj.filters)
        // find the selected filter item (not tree)
        let selectedFilterItem = currentCompleteFilterObj.find((filter) => filter.id === event.detail.selectedFilterId)
        if (!selectedFilterItem) return
        selectedFilterItem.skipCountUpdate = true
        const result = await this.webWorker(WithFacet.updateFilters, currentCompleteFilterObj, selectedFilterItem.urlpara, selectedFilterItem.id, false, true, null, false, false, isMulti, isStartTimeSelectedFromFilterPills)
        hasSelectedFilter = result[2]
        currentCompleteFilterObj = result[0]
        currentRequestObj.filters.forEach((filter) => { if (filter.id === selectedFilterItem.id) filter.skipCountUpdate = true })
        currentRequestObj.filters = [...result[1], ...initialFilter.filter(filter => !result[1].find(resultFilterItem => resultFilterItem.id === filter.id))]
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
        hasSelectedFilter = result[2]
        currentCompleteFilterObj = result[0]
        currentRequestObj.filters = [...result[1], ...initialFilter.filter(filter => !result[1].find(resultFilterItem => resultFilterItem.id === filter.id))]
        if (isTree) currentRequestObj.filters = await this.webWorker(WithFacet.getLastSelectedFilterItem, currentRequestObj.filters)
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
          this.updateURLParam('sorting', currentRequestObj.sorting)
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
        hasSelectedFilter = result[2]
        currentCompleteFilterObj = result[0]
        currentRequestObj.filters = [...result[1], ...initialFilter.filter(filter => !result[1].find(resultFilterItem => resultFilterItem.id === filter.id))]
      } else if (event?.detail?.key === 'input-search') {
        // text field search
        if (event?.detail?.value) {
          this.updateURLParam('q', event.detail.value)
          currentRequestObj.searchText = event.detail.value
          if (currentRequestObj.clat && currentRequestObj.clong) currentRequestObj.sorting = 1
        }
        if (event?.detail?.value === '') {
          delete currentRequestObj.searchText
          this.deleteParamFromUrl('q')
          if (!currentRequestObj.clat) currentRequestObj.sorting = 3
        }
        const result = await this.webWorker(WithFacet.updateFilters, currentCompleteFilterObj, undefined, undefined)
        hasSelectedFilter = result[2]
        currentCompleteFilterObj = result[0]
        currentRequestObj.filters = result[1]

        if (!this.params.has('sorting')) {
          currentRequestObj.sorting = 1 // relevance
          if (event?.detail?.value === '' && !currentRequestObj.clat) {
            delete currentRequestObj.searchText
            currentRequestObj.sorting = 3 // alphabetic
          }
          if (event?.detail?.value !== '' && currentRequestObj.clat) {
            currentRequestObj.sorting = 2 // distance
          }
        }
      } else if (event?.detail?.key === 'sorting' && !!event.detail.id) {
        // sorting
        currentRequestObj.sorting = event.detail.id || 3
        this.updateURLParam('sorting', currentRequestObj.sorting)
        sessionStorage.setItem('currentSorting', currentRequestObj.sorting)
        const result = await this.webWorker(WithFacet.updateFilters, currentCompleteFilterObj, undefined, undefined)
        hasSelectedFilter = result[2]
        currentCompleteFilterObj = result[0]
        currentRequestObj.filters = result[1]
      } else {
        // default behavior
        // always shake out the response filters to only include selected filters or selected in ancestry
        const isTree = event?.detail?.this?.attributes['filter-type']?.value === 'tree'
        const result = await this.webWorker(WithFacet.updateFilters, currentCompleteFilterObj, undefined, undefined)
        hasSelectedFilter = result[2]
        currentCompleteFilterObj = result[0]
        if (isSearchPage) {
          currentRequestObj.filters = [...result[1], ...initialFilter.filter(filter => !result[1].find(resultFilterItem => resultFilterItem.id === filter.id))]
        } else {
          currentRequestObj.filters = [...result[1], ...(initialRequestObj.filters || []).filter(filter => !result[1].find(resultFilterItem => resultFilterItem.id === filter.id))]
        }
        if (isTree) currentRequestObj.filters = await this.webWorker(WithFacet.getLastSelectedFilterItem, currentRequestObj.filters)
        // check, if filter of initialRequestObj.filters with id="7" is selected
        // if true, replace it with filter id="7" in currentRequestObj.filters
        const initialSectorFilter = (initialRequestObj.filters || []).find(f => String(f.id) === "7" && f.selected)
        if (initialSectorFilter) {
          const idx = (currentRequestObj.filters || []).findIndex(f => String(f.id) === "7")
          idx !== -1 ? currentRequestObj.filters[idx] = structuredClone(initialSectorFilter) : currentRequestObj.filters.push(structuredClone(initialSectorFilter))
        }
      }

      // filter only
      this.filterOnly ? currentRequestObj.onlyfaceted = 1 : delete currentRequestObj.onlyfaceted

      // load more 
      event?.detail?.loadCoursesOnly ? currentRequestObj.onlycourse = true : delete currentRequestObj.onlycourse
      // remove filter with id 30 from array currentRequestObj.filters, if onlycourse is true, to keep the filter on load more
      if (currentRequestObj.onlycourse) currentRequestObj.filters = currentRequestObj.filters.filter(filter => filter.id !== "30")

      if (!currentRequestObj.filters.length) currentRequestObj.filters = initialFilter

      if (isInfoEvents) {
        const endpointInfoEventsUrl = new URL(endpointInfoEvents)
        currentRequestObj.psize = endpointInfoEventsUrl.searchParams.has('psize') ? Number(endpointInfoEventsUrl.searchParams.get('psize')) : 3
        currentRequestObj.ppage = endpointInfoEventsUrl.searchParams.has('ppage') ? Number(endpointInfoEventsUrl.searchParams.get('ppage')) : 0
        currentRequestObj.searchText = ''
        currentRequestObj.PortalId = endpointInfoEventsUrl.searchParams.has('portal_id') ? Number(endpointInfoEventsUrl.searchParams.get('portal_id')) : 29
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
            ...structuredClone(currentRequestObj),
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
            if (event?.detail?.ppage && !json.filters.length) json.filters = sessionStorage.getItem('currentFilter') ? JSON.parse(sessionStorage.getItem('currentFilter') || '[]') : currentRequestObj.filters || initialFilter || []
            json.hasSelectedFilter = hasSelectedFilter

            // sort courses by start date (ascending) 
            if (this.hasAttribute('no-search-tab') && json.courses && Array.isArray(json.courses)) {
              json.courses.sort((a, b) => {
                const dateA = new Date(a.gueltig_ab)
                const dateB = new Date(b.gueltig_ab)
                return dateA - dateB
              })
            }

            // update filters with api response
            currentRequestObj.filters = currentCompleteFilterObj = json.filters

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

      if (currentRequestObj.filters?.length && !isAboList) subLevelFilter = [...event.detail.filter, ...currentRequestObj.filters]

      const searchText = isAboList ? null : currentRequestObj.searchText || initialRequestObj.searchText

      let mandantId = this.getAttribute('mandant-id') || initialRequestObj.MandantId || 111
      if (isInfoEvents) {
        const endpointInfoEventsUrl = new URL(endpointInfoEvents)
        if (endpointInfoEventsUrl.searchParams.has('mandant_id')) mandantId = endpointInfoEventsUrl.searchParams.get('mandant_id')
      }

      let body = `{
        "filters": ${JSON.stringify(subLevelFilter)},
        "MandantId": ${mandantId},
        "PortalId": ${this.getAttribute('portal-id') || initialRequestObj.PortalId || currentRequestObj.PortalId || 29},
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
    this.addEventListener('backdrop-clicked', this.handleBackdropClicked)
    this.addEventListener('request-advisory-text-api', this.handleRequestAdvisoryTextApi)
    window.addEventListener('reset-filter', this.requestWithFacetListener)
  }

  disconnectedCallback() {
    this.getAttribute('expand-event-name') === 'request-with-facet' ? self.removeEventListener('request-with-facet', this.requestWithFacetListener) : this.removeEventListener('request-with-facet', this.requestWithFacetListener)
    this.getAttribute('expand-event-name') === 'reset-all-filters' ? self.removeEventListener('reset-all-filters', this.requestWithFacetListener) : this.removeEventListener('reset-all-filters', this.requestWithFacetListener)
    this.getAttribute('expand-event-name') === 'reset-filter' ? self.removeEventListener('reset-filter', this.requestWithFacetListener) : this.removeEventListener('reset-filter', this.requestWithFacetListener)
    this.getAttribute('expand-event-name') === 'request-locations' ? self.removeEventListener('request-locations', this.requestLocations) : this.removeEventListener('request-locations', this.requestLocations)
    this.removeEventListener('backdrop-clicked', this.handleBackdropClicked)
    this.removeEventListener('request-advisory-text-api', this.handleRequestAdvisoryTextApi)
    window.removeEventListener('reset-filter', this.requestWithFacetListener)
  }

  handleBackdropClicked = () => {
    if (this.skipNextFacetRequest) {
      this.skipNextFacetRequest = false
      return
    }

    this.filterOnly = false
    this.dispatchEvent(new CustomEvent('request-with-facet'))
  }

  handleRequestAdvisoryTextApi = () => { this.skipNextFacetRequest = true }

  // always shake out the response filters to only include selected filters or selected in ancestry
  static updateFilters(filters, filterKey, filterValue, reset = false, zeroLevel = true, selectedParent = null, isSectorFilter = false, isTree = false, isMulti = false, isStartTimeSelectedFromFilterPills = false, hasSelectedFilter = false) {
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

      if (!hasSelectedFilter && filterItem.selected && !filterItem.disabled) hasSelectedFilter = true
      if (reset && isMatchingKey) {
        treeShookFilterItem.children = []
      } else if (filterItem.children && !isMulti) {
        [filterItem.children, treeShookFilterItem.children, hasSelectedFilter] = WithFacet.updateFilters(filterItem.children, filterKey, filterValue, reset, false, filterItem, isSectorFilter, isTree, isMulti, isStartTimeSelectedFromFilterPills, hasSelectedFilter)
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
    return [filters, treeShookFilters, hasSelectedFilter]
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

  static getSectorFilterWithInitialFallback(currentFilter, initialFilter) {
    const initialSectorFilter = initialFilter.find((filter) => Number(filter.id) === 7)
    let index = 0
    const sectorFilter = currentFilter.find((filter, i) => {
      index = i
      return Number(filter.id) === 7 && (!filter.selected || filter.children.every(child => !child.selected))
    })
    if (initialSectorFilter && sectorFilter) {
      sectorFilter.children = initialSectorFilter.children
      sectorFilter.selected = true
      currentFilter[index] = sectorFilter
    }
    return currentFilter
  }

  dataLayerPush(value) {
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