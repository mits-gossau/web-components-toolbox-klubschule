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

    // Check if each object in translation has "key" and "value" properties
    const translationData = JSON.parse(this.getAttribute('translation') || '[]')
    const isValid = translationData.every(item => {
      return item.hasOwnProperty('key') && item.hasOwnProperty('value')
    })

    this.translation = isValid ? translationData.reduce((acc, curr) => {
      acc[curr.key] = curr.value
      return acc
    }, {}) : {}

    this.requestTranslationListener = () => {
      this.dispatchEvent(new CustomEvent('translation', {
        detail: {
          translation: this.translation
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
