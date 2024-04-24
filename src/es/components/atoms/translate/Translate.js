/* global CustomEvent */

// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Translate
* @type {CustomElementConstructor}
*/
export default class Translate extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, mode: 'false', ...options }, ...args)

    this.setTranslations = async (event) => {
      const translations = await event.detail.fetch
      this.innerHTML = translations[this.key] || this.key
    }
  }

  connectedCallback () {
    this.key = this.innerHTML
    this.addEventListener('translations', this.setTranslations)
    this.dispatchEvent(new CustomEvent('request-translations', {
      detail: this,
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  disconnectedCallback () {}
}
