// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Translation
* @type {CustomElementConstructor}
*/
export default class Translation extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, mode: 'false', ...options }, ...args)

    this.requestTranslationListener = () => {
      this.dispatchEvent(new CustomEvent('translation', {
        detail: {
          translation: this.getAttribute('translation') || '[]'
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }))
    }
  }

  connectedCallback () {
    this.addEventListener('request-translation', this.requestTranslationListener)
  }

  disconnectedCallback () {
    this.removeEventListener('request-translation', this.requestTranslationListener)
  }
}
