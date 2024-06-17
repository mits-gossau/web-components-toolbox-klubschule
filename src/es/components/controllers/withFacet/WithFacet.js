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
    this.params = new URLSearchParams(this.url.search)
    this.filterParams = []
    this.isMocked = this.hasAttribute('mock')
    const apiUrl = this.isMocked
      ? `${this.importMetaUrl}./mock/default.json`
      : `${this.getAttribute('endpoint') || 'https://dev.klubschule.ch/Umbraco/Api/CourseApi/Search'}`
    // simply the last body of the last request
    this.lastResponse = {}
    // simply the payload of the last request
    this.lastRequest = null
    this.filtersArray = []

    this.requestWithFacetListener = (event) => {
      // mdx prevent double event
      if (event?.detail?.mutationList && event.detail.mutationList[0].attributeName !== 'checked') return

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

        this.filters = []
        // const filter = this.constructFilterItem(event)
        // if (filter) this.filters.push(filter)

        // if there is an initial filter set (e.g. for events) we want to keep it
        if (initialFiltersAsString?.length) {
          this.filters.push(initialFiltersAsString)
        }

        if (shouldResetAllFilters) {
          initialRequestObj = Object.assign(initialRequestObj, { shouldResetAllFilters })
          this.removeAllURLParams()
          // this.removeAllFilterParamsFromURL()
        }

        if (shouldResetFilter) {
          initialRequestObj = Object.assign(initialRequestObj, { shouldResetFilter })
          this.removeURLParams(event.detail.this.getAttribute('filter-urlpara'))
        }

        if (shouldResetFilterFromFilterSelectButton) {
          initialRequestObj = Object.assign(initialRequestObj, { shouldResetFilterFromFilterSelectButton })
        }

        // TODO: @Alex, the location and location name has to be kept in the URL

        // keep the last search location inside initialRequestObj
        if (event?.detail?.key === 'location-search') {
          if (!!event.detail.lat && !!event.detail.lng ) {
            initialRequestObj.clat = event.detail.lat
            initialRequestObj.clong = event.detail.lng
          } else {
            if (initialRequestObj.clat) delete initialRequestObj.clat
            if (initialRequestObj.clong) delete initialRequestObj.clong
          }
        }

        // url kung fu
        this.urlKungFu(event)
        // this.updateURLParams()

        const hasSearchTerm = event?.detail?.key === 'input-search' || this.params.get('q') !== ('' || null)
        let hasSorting = false
        let hasSearchLocation = false
        const filterRequest = `{
          "filter": ${this.filters.length > 0 ? `[${this.filters.join(',')}]` : '[]'},
          "MandantId": ${this.getAttribute('mandant-id') || initialRequestObj.MandantId || 110},
          "PortalId": ${this.getAttribute('portal-id') || initialRequestObj.PortalId || 29},
          "sprachid": "${this.getAttribute('sprach-id') || initialRequestObj.sprachid || 'd'}",
          "searchcontent": ${!this.hasAttribute('no-search-tab')}
          ${(hasSorting = event?.detail?.key === 'sorting' && !!event.detail.id) ? `,"sorting": "${event.detail.id}"` : ''}
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
                if (!this.filters.length || this.filters.length === 0) {
                  this.lastResponse = json
                }

                // check if filter is in url
                this.checkFiltersInURL(json.filters)
               

                // url search text kung fu
                if (!json.searchText) {
                  this.params.delete('q')
                } else {
                  this.params.set('q', json.searchText)
                }


                // url filter kung fu
                // json.filters.forEach(filterItem => {
                //   if (filterItem.children && filterItem.children.length > 0 && filterItem.visible) {
                //     const paramsWithUnderscore = [...this.params.entries()].filter(([key, value]) => key.includes('_') && value.includes('_'))
                //     const selectedChildren = []

                //     filterItem.children.forEach(child => {
                //       // check if the child is already in the url params
                //       const containsChild = paramsWithUnderscore.some(array => array.includes(`${child.urlpara ? child.urlpara : 'f'}_${child.id}`))

                //       if (containsChild) {
                //         selectedChildren.push(`${child.urlpara ? child.urlpara : 'f'}_${child.id}`)
                //       }

                //       // if selected, add it to the url params
                //       if (child.selected) {
                //         if (!containsChild && !shouldResetAllFilters) {
                //           selectedChildren.push(`${child.urlpara ? child.urlpara : 'f'}_${child.id}`)
                //         }

                //         if (selectedChildren.length > 0) {
                //           this.params.set(`${filterItem.urlpara}_${filterItem.id}`, `${selectedChildren.join(',')}`)
                //         }

                //       // if unselected, remove it from the url params
                //       } else {
                //         if (containsChild) {
                //           const index = selectedChildren.indexOf(`${child.urlpara ? child.urlpara : 'f'}_${child.id}`)
                //           selectedChildren.splice(index, 1)

                //           this.params.set(`${filterItem.urlpara}_${filterItem.id}`, selectedChildren.join(','))

                //           if (this.params.get(`${filterItem.urlpara}_${filterItem.id}`) === '') {
                //             this.params.delete(`${filterItem.urlpara}_${filterItem.id}`)
                //           }
                //         }
                //       }
                //     })
                //     WithFacet.historyPushState({}, '', `${this.url.origin}${this.url.pathname}?${this.params.toString()}`)
                //   }
                // })
                

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

    this.requestLocations = event => {
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
        body: (this.requestLocationsLastBody = body)
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

  checkFiltersInURL (filters) {
    filters.forEach(filterItem => {
      this.params.forEach((value, key) => {
        if (this.filterParams.includes(key)) return
        if (key === 'q') {
          console.log('Good catch! --> [', key, '] exists as search text')
          this.filterParams.push(key)
        }
        if (filterItem.urlpara.includes(key)) {
          console.log('Good catch! --> [', key, '] exists as urlpara')
          this.filterParams.push(key)
        }
        if (filterItem.children && filterItem.children.length > 0) {
          this.checkFiltersInURL(filterItem.children)
        }
      })
    })
  }

  urlKungFu (event) {
    const filterId = event?.detail?.target?.getAttribute('filter-id')
    if (filterId) {
      const [key, value] = filterId.split('-')
      console.log('key:', key, 'value:', value)
      if (event.detail.mutationList[0].attributeName === 'checked') {
        this.addOrUpdateURLParams(key, value)
      } else {
        this.removeURLParams(key, value)
      }
    }
  }

  addOrUpdateURLParams (key, value) {
    if (this.params.has(key)) {
      const currentValue = this.params.get(key)
      if (!currentValue?.includes(value)) {
        this.params.set(key, `${currentValue}-${value}`)
      }
    } else {
      this.params.set(key, value)
    }
    
    WithFacet.historyPushState({}, '', `${this.url.origin}${this.url.pathname}?${this.params.toString()}`)
  }

  removeURLParams (key, value) {
    if (this.params.has(key)) {
      const currentValue = this.params.get(key)
      if (currentValue?.includes(value)) {
        this.params.set(key, currentValue.split('-').filter(val => val !== value).join('-'))
      }

      if (this.params.get(key) === '') {
        this.params.delete(key)
      }

      WithFacet.historyPushState({}, '', `${this.url.origin}${this.url.pathname}?${this.params.toString()}`)
    }
  }

  removeAllURLParams () {
    this.filterParams.forEach(filterItem => {
      this.params.delete(`${filterItem}`)
      WithFacet.historyPushState({}, '', `${this.url.origin}${this.url.pathname}?${this.params.toString()}`)
    })
  }

  catchURLParams () {
    return new URLSearchParams(self.location.search)
  }

  constructFilterItem (event) {
    const filterItem = event?.detail?.wrapper?.filterItem

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

  static historyPushState (...args) {
    // Avoid multiple empty pushes, otherwise the navigation history becomes jammed
    if ((new URL(args[2])).search !== location.search) {
      // @ts-ignore
      self.history.pushState(...args)
    }
  }
}