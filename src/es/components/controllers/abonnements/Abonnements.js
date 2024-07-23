// @ts-check

import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * Abonnements are retrieved via the corresponding endpoint as set as an attribute
 * As a controller, this component communicates exclusively through events
 * Example: web-components-toolbox-klubschule
 *
 * @export
 * @class Abonnements
 * @type {CustomElementConstructor}
 */
export default class Abonnements extends Shadow() {
  constructor (options = {}, ...args) {
    super({
      importMetaUrl: import.meta.url,
      mode: 'false',
      ...options
    }, ...args)
    this.isMocked = this.hasAttribute('mock')
    this.response = {}
    this.responseData = {}
    const endpoint = this.getAttribute('endpoint') || 'https://dev.klubschule.ch/Umbraco/Api/CourseApi/Search'

    this.requestAbonnementsListener = (event) => {
      event.detail.resolve(fetch(`${event.detail.abonnementsAPI}`, {
        method: 'GET'
      }).then(response => {
        if (response.status >= 200 && response.status <= 299) {
          this.response = response.json()
          this.response.then(data => this.responseData = data)

          return this.response
        }
        throw new Error(response.statusText)
      }))
    }

    this.abortControllerLocations = null
    this.requestLocations = event => {
      if (this.abortControllerLocations) this.abortControllerLocations.abort()
      this.abortControllerLocations = new AbortController()

      let body = `{
        "filter": ${JSON.stringify(event.detail.filter)},
        "MandantId": ${this.getAttribute('mandant-id') || this.responseData?.mandantId || 111},
        "PortalId": ${this.getAttribute('portal-id') || this.responseData?.portalId || 29},
        "sprachid": "${this.getAttribute('sprach-id') || this.responseData?.sprachid || 'd'}",
        "psize": ${this.getAttribute('p-size') || this.responseData?.psize || 12},
        "sorting": ${this.responseData?.sorting || 2}
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

  connectedCallback () {
    this.addEventListener('request-abo-list', this.requestAbonnementsListener)
    this.addEventListener('request-locations', this.requestLocations)
  }

  disconnectedCallback () {
    this.removeEventListener('request-abo-list', this.requestAbonnementsListener)
    this.removeEventListener('request-locations', this.requestLocations)
  }
}
