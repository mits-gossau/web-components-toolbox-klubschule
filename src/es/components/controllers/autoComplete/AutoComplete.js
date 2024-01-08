// @ts-check
/* global fetch */
/* global AbortController */
/* global location */
/* global sessionStorage */
/* global CustomEvent */
/* global history */
/* global self */

import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * AutoComplete are retrieved via the corresponding endpoint as set as an attribute
 * As a controller, this component communicates exclusively through events
 * Example: web-components-toolbox-klubschule
 *
 * @export
 * @class AutoComplete
 * @type {CustomElementConstructor}
 */
export default class AutoComplete extends Shadow() {
  constructor (options = {}, ...args) {
    super({
      importMetaUrl: import.meta.url,
      mode: 'false',
      ...options
    }, ...args)

    this.abortController = null
    this.requestAutoCompleteListener = event => {
      return this.dispatchEvent(new CustomEvent(this.getAttribute('auto-complete') || 'auto-complete', {
        detail: {
          // TYP 1 ist Kurs, TYP 2 ist Sparte
          fetch: Promise.resolve({
            "total": 10,
            "success": true,
            "searchText": "englisch",
            "items": [
                {
                    "term": "englisch",
                    "typ": 1
                },
                {
                    "term": "englisch   privatunterricht  wann und wo sie wolle",
                    "typ": 1
                },
                {
                    "term": "englisch a1 ganz entspannt",
                    "typ": 1
                },
                {
                    "term": "englisch anfanger innen",
                    "typ": 1
                },
                {
                    "term": "englisch anfanger innen   onlinekurs",
                    "typ": 1
                },
                {
                    "term": "Englisch Business",
                    "typ": 2
                },
                {
                    "term": "Englisch Diplome",
                    "typ": 2
                },
                {
                    "term": "Englisch Konversation",
                    "typ": 2
                },
                {
                    "term": "Englisch Konversation B1",
                    "typ": 2
                },
                {
                    "term": "Englisch Konversation B2",
                    "typ": 2
                }
            ],
            "cms": []
        })
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }))


      const token = event.detail.value
      if (!token) return
      if (this.abortController) this.abortController.abort()
      this.abortController = new AbortController()
      this.dispatchEvent(new CustomEvent(this.getAttribute('auto-complete') || 'auto-complete', {
        detail: {
          fetch: fetch(`${this.getAttribute('endpoint') || 'http://miducawebappdev.azurewebsites.net/Umbraco/Api/Autocomplete/search'}?token=${token}`, {
            method: 'GET',
            signal: this.abortController.signal,
          }).then(response => {
            if (response.status >= 200 && response.status <= 299) return response.json()
            throw new Error(response.statusText)
          })
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }))
    }
  }

  connectedCallback () {
    this.addEventListener(this.getAttribute('request-auto-complete') || 'request-auto-complete', this.requestAutoCompleteListener)
  }

  disconnectedCallback () {
    this.removeEventListener(this.getAttribute('request-auto-complete') || 'request-auto-complete', this.requestAutoCompleteListener)
  }
}
