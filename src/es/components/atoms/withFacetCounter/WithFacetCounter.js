// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class WithFacetCounter
* @type {CustomElementConstructor}
*/
export default class WithFacetCounter extends Shadow() {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, mode: 'false', ...options }, ...args)
  }

  connectedCallback() {
    document.body.addEventListener('with-facet', this.receiveData)
  }

  disconnectedCallback() {
    document.body.removeEventListener('with-facet', this.receiveData)
  }


  /**
   * Event Listener: Get Data from WithFacet
   */
   receiveData = async (event) => {
    const fetchData = await event?.detail?.fetch
    this.html = ''
    this.html = /* HTML */ `<ks-a-heading tag="h1">${fetchData.total} ${this.hasAttribute('headline') ? `${this.getAttribute('headline')}` : ''}</ks-a-heading>`

    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../atoms/heading/Heading.js`,
        name: 'ks-a-heading'
      }
    ])
  }
}