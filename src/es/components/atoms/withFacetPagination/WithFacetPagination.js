// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class WithFacetPagination
* @type {CustomElementConstructor}
*/
export default class WithFacetPagination extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, mode: 'false', ...options }, ...args)

    this.ppage = 1
    this.css = ':host {text-align: center;}'

    this.clickEventListener = event => this.dispatchEvent(new CustomEvent('request-with-facet',
      {
        detail: {
          ppage: this.ppage,
          loadMore: 'without-facet' 
        },
        bubbles: true,
        cancelable: true,
        composed: true
      })
    )
  }

  connectedCallback () {
    this.eventListenerNode = this.hasAttribute('with-facet-target') ? WithFacetPagination.walksUpDomQueryMatches(this, "ks-o-offers-page") : document.body

    this.eventListenerNode.addEventListener('with-facet', this.receiveData)
    this.addEventListener('click', this.clickEventListener)
  }

  disconnectedCallback () {
    this.eventListenerNode.removeEventListener('with-facet', this.receiveData)
    this.removeEventListener('click', this.clickEventListener)
  }

  /**
  * Event Listener: Get Data from WithFacet
  */
  receiveData = async (event) => {
    this.ppage = (await event.detail?.fetch)?.ppage || this.ppage
  }
}
