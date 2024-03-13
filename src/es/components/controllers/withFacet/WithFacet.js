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

    this.url = new URL(window.location.href)
    this.params = new URLSearchParams(this.url.search)
    console.log('url + params', this.url, this.params.toString())
    const withFacetCache = new Map()

    this.isMocked = this.hasAttribute('mock')
    this.requestWithFacetListener = (event) => {
      if (event.detail?.mutationList && event.detail.mutationList[0].attributeName !== 'checked') return

      const constructFilterItem = (filterItem) => {
        if (!filterItem) return ''

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
                    }`})}
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

      const filter = constructFilterItem(event.detail?.wrapper.filterItem)
      const filters = []
      if (filter) filters.push(filter)

      const request = `{
                "filter": ${filters.length > 0 ? `[${filters.join(',')}]` : '[]'},
                "mandantId": ${this.getAttribute('mandant-id') || 110}
            }`

      // @ts-ignore
      // console.log('request (WithFacet.js)', request, self.data = event.detail?.wrapper.filterItem)
      const url = this.isMocked
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
            : withFacetCache.set(request, fetch(url, requestInit).then(response => {
              if (response.status >= 200 && response.status <= 299) {
                console.log('response (WithFacet.js)', response)
                return response.json()
              }
              throw new Error(response.statusText)
            }).then(json => {
              const filterData = json.filters
              let selectedFilter = ''
              let numberOfOffers = 0

              filterData.forEach(filterItem => {
                console.log('>>> ', filterItem.urlpara, ' <<<')
                
                // get selected filter from url params
                if (filterItem && this.params.has(filterItem.urlpara)) {
                  if (filterItem.children && filterItem.children.length > 0) {
                    filterItem.children.forEach(child => {
                      selectedFilter = String(this.params.get(filterItem.urlpara)?.split(','))
                      if (selectedFilter?.includes(child.urlpara)) {
                        child.selected = true
                      }
                    })
                  }
                }

                // set selected filter to url params
                if (filterItem.children && filterItem.children.length > 0 && filterItem.visible) {
                  const currentParams = this.params.get(filterItem.urlpara)?.split(',')
                  console.log('currentParams', currentParams)

                  filterItem.children.forEach(child => {
                    if (child.selected) {
                      // API does not answer with number of totals, the line below fixes that issue
                      if (child.count > 0) { 
                        numberOfOffers += child.count
                      }
                      console.log('selected:', child.urlpara)

                    } else {
                      console.log('unselected:', child.urlpara)
                    }
                    // selectedFilter = filterItem.children
                    //   .filter(child => child.selected)
                    //   .map(child => child.urlpara)
                    //   .join(',')

                    // if (selectedFilter) {
                    //   this.params.set(filterItem.urlpara, selectedFilter)
                    //   window.history.pushState({}, '', `${this.url.pathname}?${this.params.toString()}`)
                    // }
                    // if (child.selected && child.count > 0) {
                    //   numberOfOffers += child.count
                    // }
                    // if (!child.selected) {
                      
                    //   let index
                    //   if (currentParams) {
                    //     if ((index = currentParams.indexOf(child.urlpara))) {
                    //       currentParams.splice(index, 1)
                    //       this.params.set(filterItem.urlpara, currentParams.join(','))
                    //     }
                    //     if (this.params.get(filterItem.urlpara) === '') this.params.delete(filterItem.urlpara)
                    //   }
                    // }
                  })
                }
                
                // set selected filter to url params
                // if (filterItem.children && filterItem.children.length > 0 && filterItem.visible) {
                //   const currentParams = this.params.toString()
                //   const key = filterItem.urlpara // Eg.: Tag, Zeit, etc.
                //   // console.log('initial key', key)
                //   filterItem.children.forEach(child => {
                //     if (child.selected) {
                //       // API does not answer with number of totals, the line below fixes that issue
                //       if (child.count > 0) {
                //         numberOfOffers += child.count
                //       }
                //       const currentValues = this.params.get(key) || ''
                //       console.log('key', this.params.get(key))
                //       console.log('child selected', child.urlpara)
                //       console.log('current values', currentValues)
                //       if (!currentValues || currentValues.trim() !== '' || !currentValues.includes(child.urlpara)) this.params.set(key, `${currentValues + ',' || ''}${child.urlpara}`)
                //       console.log('currentValues 1a', this.params.get(key))
                //       console.log('currentValues 1b', currentValues)
                //     } else {
                //       const currentValues = this.params.get(key)?.split(',')
                //       let index
                //       if (currentValues) {
                //         if ((index = currentValues.indexOf(child.urlpara))) {
                //           currentValues.splice(index, 1)
                //           this.params.set(key, currentValues.join(','))
                //         }
                //         if (this.params.get(key) === '') this.params.delete(key)
                //       }
                //     }
                //   })
                //   // console.log('currentParams 2', currentParams, this.params.toString())
                //   // console.log('this params', this.params)
                //   // if (currentParams !== this.params.toString()) {
                //     window.history.pushState({}, '', `${this.url.pathname}?${this.params.toString()}`)
                //     //history.pushState({ ...history.state, pageTitle: (document.title = roomName) }, roomName, url.href) 
                //   // }
                // }
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
}
