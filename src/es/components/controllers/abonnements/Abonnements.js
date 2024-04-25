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
    const apiUrl = this.isMocked
      ? `${this.importMetaUrl}./mock/default.json`
      : `${this.getAttribute('endpoint') || 'https://dev.klubschule.ch/Umbraco/Api/CourseApi/Abonnement'}`

      this.requestAbonnementsListener = (event) => {
      event.detail.resolve(fetch(`${apiUrl}?lang=${event.detail.language}&typ=${event.detail.typ}&id=${event.detail.id}&center_id=${event.detail.center_id}`, {
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
    this.addEventListener('request-abo-list', this.requestAbonnementsListener)
  }

  disconnectedCallback () {
    this.removeEventListener('request-abo-list', this.requestAbonnementsListener)
  }
}
