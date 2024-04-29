/* global CustomEvent */

import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * Translators loads json dictionaries from endpoint
 * As a controller, this component communicates exclusively through events
 * Example: web-components-toolbox-klubschule
 *
 * @export
 * @class Translator
 * @type {CustomElementConstructor}
 */
export default class Translator extends Shadow() {
  /**
   * @param {any} args
   */
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, mode: 'false', ...options }, ...args)

    this.storage = []

    this.requestTranslationsListener = (event) => {
      const endpoint = this.getAttribute('endpoint') || 'https://devadmin.klubschule.ch/umbraco/api/1/Dictionaries/all'
      const lang = this.getAttribute('language') || document.documentElement.lang
      const key = this.getAttribute('key') || ''
      const target = event.detail || document.body
      const fetchOptions = {
        method: 'GET'
      }

      target.dispatchEvent(new CustomEvent('translations', {
        detail: {
          fetch: this.fetchContent(`${endpoint}/${lang}/${key}`, fetchOptions)
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }))
    }
  }

  connectedCallback () {
    document.body.addEventListener(
      'request-translations',
      this.requestTranslationsListener
    )
  }

  disconnectedCallback () {
    this.removeEventListener(
      'request-translations',
      this.requestTranslationsListener
    )
  }

  fetchContent (endpoint, fetchOptions) {
    if (endpoint in this.storage) {
      return this.storage[endpoint]
    } else {
      const prom = fetch(endpoint, fetchOptions).then(async response => {
        if (response.status >= 200 && response.status <= 299) {
          const result = await response.json()
          return result
        }
        throw new Error(response.statusText)
      })
      this.storage[endpoint] = prom
      return prom
    }
  }
}
