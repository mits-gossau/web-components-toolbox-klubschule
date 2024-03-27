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
    const initialRequest = this.getAttribute('initial-request')
    this.url = new URL(self.location.href)
    this.params = new URLSearchParams(this.url.search)
    this.isMocked = this.hasAttribute('mock')
    const apiUrl = this.isMocked
        ? `${this.importMetaUrl}./mock/default.json`
        : `${this.getAttribute('endpoint') || 'https://miducabulaliwebappdev.azurewebsites.net/api/CourseSearch/withfacet'}`
    this.initialResponse = {}

    this.requestWithFacetListener = (event) => {
      if (event.detail?.mutationList && event.detail.mutationList[0].attributeName !== 'checked') return

      console.log('---------------------------------event', event, event.type === 'reset-all-filters' ? 'reset-all-filters' : 'request')

      const shouldResetAllFilters = event.type === 'reset-all-filters'
      const shouldResetFilters = event.type === 'reset-filters'
      this.filters = []
      const filter = this.constructFilterItem(event)
      if (filter) this.filters.push(filter)

      this.updateURLParams()

      const filterRequest = `{
        "filter": ${this.filters.length > 0 ? `[${this.filters.join(',')}]` : '[]'},
        "mandantId": ${this.getAttribute('mandant-id') || 110}
        ${event.detail?.key === 'input-search' ? `,"searchText": "${event.detail.value}"` : ''}
        ${event.detail?.key === 'location-search' ? `,"clat": "${event.detail.lat}"` : ''}
        ${event.detail?.key === 'location-search' ? `,"clong": "${event.detail.lng}"` : ''}
      }`

      let request = this.filters.length > 0 ? filterRequest : initialRequest

      if (shouldResetAllFilters) {
        request = initialRequest
        this.removeURLParams()
        this.updateTotalOffers(this.initialResponse.total, this.initialResponse.total_label)
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
                console.log('response (200, 299)', response)
                return response.json()
              }
              throw new Error(response.statusText)
            }).then(json => {
              console.log('json', json)

              // store initial response
              if (!this.filters.length || this.filters.length === 0) {
                this.initialResponse = json
              }

              // update total offers
              this.updateTotalOffers(json.total, json.total_label)
              
              // url kung fu
              json.filters.forEach(filterItem => {
                if (filterItem.children && filterItem.children.length > 0 && filterItem.visible) {
                  const paramsWithUnderscore = [...this.params.entries()].filter(([key, value]) => key.includes('_') && value.includes('_'))
                  const selectedChildren = []

                  filterItem.children.forEach(child => {
                    // check if the child is already in the url params
                    const containsChild = paramsWithUnderscore.some(array => array.includes(`${child.urlpara ? child.urlpara : 'f'}_${child.id}`))
                    
                    if (containsChild) {
                      console.log('containsChild:', containsChild, `${child.urlpara ? child.urlpara : 'f'}_${child.id}`)
                      selectedChildren.push(`${child.urlpara ? child.urlpara : 'f'}_${child.id}`)
                    }

                    // if selected, add it to the url params
                    if (child.selected) {
                      console.log('child.selected:', child.selected, `${child.urlpara ? child.urlpara : 'f'}_${child.id}`)

                      if (!containsChild && !shouldResetAllFilters) {
                        selectedChildren.push(`${child.urlpara ? child.urlpara : 'f'}_${child.id}`)
                      }

                      if (selectedChildren.length > 0) {
                        this.params.set(`${filterItem.urlpara}_${filterItem.id}`, `${selectedChildren.join(',')}`)
                      }

                    // if unselected, remove it from the url params
                    } else {
                      if (containsChild) {
                        console.log('child.unselected:', child.selected, `${child.urlpara ? child.urlpara : 'f'}_${child.id}`)

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
    this.addEventListener('reset-filters', this.requestWithFacetListener)
  }

  disconnectedCallback () {
    this.removeEventListener('request-with-facet', this.requestWithFacetListener)
    this.removeEventListener('reset-all-filters', this.requestWithFacetListener)
    this.removeEventListener('reset-filters', this.requestWithFacetListener)
  }

  updateTotalOffers (total, label) {
    // update tab
    const totalOffersTab = document.body.querySelector('o-body')?.shadowRoot?.querySelector('ks-o-offers-page')?.shadowRoot?.querySelector('ks-m-tab')?.shadowRoot?.querySelector('#total-offers-tab-heading')
    if (totalOffersTab) {
      totalOffersTab.textContent = total + label
    }

    // update heading
    const totalOffersHeading = this.root.querySelector('#with-facet-body-section')?.shadowRoot.querySelector('o-grid[namespace="grid-12er-"]').shadowRoot.querySelector('#offers-page-main-title')
    if (totalOffersHeading) {
      totalOffersHeading.shadowRoot.querySelector('h1').textContent = total + label
    }

    console.log('total offers updated:', total, label)
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

  removeURLParams () {
    if (this.params) {
      const keys = [...this.params.keys()]

      keys.forEach(key => {
        if (key.includes('_')) {
          this.params.delete(key)
        }
      })

      self.history.pushState({}, '', `${this.url.pathname}?${this.params.toString()}`)
      console.log('removed all filters from url!')
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
                  ? child.selected
                  : event.detail.target.checked
                : child.selected},
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
