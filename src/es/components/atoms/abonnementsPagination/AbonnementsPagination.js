// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class AbonnementsPagination
* @type {CustomElementConstructor}
*/
export default class AbonnementsPagination extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, mode: 'false', ...options }, ...args)

    this.css = ':host {text-align: center;}'
    this.clickEventListener = event => {
      new Promise(resolve => {
        this.dispatchEvent(new CustomEvent('request-abo-list', {
          detail: {
            resolve,
            abonnementsAPI: `${this.abonnementsURL}&ppage=${this.ppage}`
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }))
      }).then(data => this.receiveData(data))
    }
  }

  connectedCallback () {
    this.addEventListener('click', this.clickEventListener)
  }

  disconnectedCallback () {
    this.removeEventListener('click', this.clickEventListener)
  }

  get abonnementsURL () {
    return this.getAttribute('abonnements-api')
  }

  /**
  * Event Listener: Get Data from Abonnements
  */
  receiveData = async (event) => {
    this.ppage = (await event.detail?.fetch)?.ppage || this.ppage++
  }
}
