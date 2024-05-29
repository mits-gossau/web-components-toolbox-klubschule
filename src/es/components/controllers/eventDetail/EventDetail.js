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
 * EventDetail are retrieved via the corresponding endpoint as set as an attribute
 * As a controller, this component communicates exclusively through events
 * Example: web-components-toolbox-klubschule
 *
 * @export
 * @class EventDetail
 * @type {CustomElementConstructor}
 */
export default class EventDetail extends Shadow() {
  constructor (options = {}, ...args) {
    super({
      importMetaUrl: import.meta.url,
      mode: 'false',
      ...options
    }, ...args)

    this.isMocked = this.hasAttribute('mock')
    const apiUrl = this.isMocked
      ? `${this.importMetaUrl}./mock/default.json`
      : `${this.getAttribute('endpoint') || 'https://dev.klubschule.ch/Umbraco/Api/CourseApi/detail/'}`
    const apiUrlObj = new URL(apiUrl, apiUrl.charAt(0) === '/' ? location.origin : apiUrl.charAt(0) === '.' ? this.importMetaUrl : undefined)
    this.requestEventDetailListener = (event) => {
      apiUrlObj.searchParams.set('lang', event.detail.language)
      apiUrlObj.searchParams.set('typ', event.detail.typ)
      apiUrlObj.searchParams.set('id', event.detail.id)
      apiUrlObj.searchParams.set('center_id', event.detail.center_id)
      event.detail.resolve(fetch(apiUrlObj.toString(), {
        method: 'GET'
      }).then(response => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json()
        }
        throw new Error(response.statusText)
      }))
    }
  }

  connectedCallback () {
    this.addEventListener('request-event-detail', this.requestEventDetailListener)
  }

  disconnectedCallback () {
    this.removeEventListener('request-event-detail', this.requestEventDetailListener)
  }
}
