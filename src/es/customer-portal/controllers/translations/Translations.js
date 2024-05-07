// @ts-check

/* global AbortController */
/* global CustomEvent */
/* global fetch */
/* global HTMLElement */
/* global self */

/**
* @export
* @class Translations
* @type {CustomElementConstructor}
*/
export default class Translations extends HTMLElement {
  constructor () {
    super()
    this.abortControllerTranslations = null
  }

  connectedCallback () {
    this.addEventListener(this.getAttribute('request-translations') || 'request-translations', this.requestTranslationsListener)
  }

  disconnectedCallback () {
    this.removeEventListener(this.getAttribute('request-subscriptions') || 'request-translations', this.requestTranslationsListener)
  }

  /**
   * Get translations
   * @param {CustomEventInit} event
   */
  requestTranslationsListener = async (event) => {
    if (this.abortControllerTranslations) this.abortControllerTranslations.abort()
    this.abortControllerTranslations = new AbortController()
    const fetchOptions = {
      method: 'GET',
      signal: this.abortControllerTranslations.signal
    }
    // @ts-ignore
    // const endpoint = `${self.Environment.getApiBaseUrl('customer-portal').translations}`
    const endpoint = '../../../../src/es/customer-portal/controllers/translations/dummy.json'
    this.dispatchEvent(new CustomEvent(this.getAttribute('update-translations') || 'update-translations', {
      detail: {
        fetch: fetch(endpoint, fetchOptions).then(async response => {
          if (response.status >= 200 && response.status <= 299) return await response.json()
          throw new Error(response.statusText)
        }),
        keys: [event.detail.keys] // TODO
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }
}
