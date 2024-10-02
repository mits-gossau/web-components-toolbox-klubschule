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
  }

  connectedCallback () {
    this.addEventListener('request-abo-list', this.requestAbonnementsListener)
  }

  disconnectedCallback () {
    this.removeEventListener('request-abo-list', this.requestAbonnementsListener)
  }
}
