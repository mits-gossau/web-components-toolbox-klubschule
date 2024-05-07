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
    
    this.translation = {}

    // check if translation data is provided
    console.log(this.getAttribute('translation'))
    if (!this.getAttribute('translation')) {
      console.error('Translation data is wrong or missing')
    }

    // check if each object in translation has "key" and "value" properties
    let translationData = {}
    try {
      translationData = JSON.parse(this.getAttribute('translation'))

      const isValid = translationData.every(item => {
        return item.hasOwnProperty('key') && item.hasOwnProperty('value')
      })
  
      this.translation = isValid ? translationData.reduce((acc, curr) => {
        acc[curr.key] = curr.value
        return acc
      }, {}) : {}
    } catch (error) {
      console.error('Error parsing translation data', error)
    }

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
    document.body.addEventListener('request-translation', this.requestTranslationListener)
  }

  disconnectedCallback () {
    document.body.removeEventListener('request-translation', this.requestTranslationListener)
  }
}
