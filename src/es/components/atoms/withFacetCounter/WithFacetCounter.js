// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class WithFacetCounter
* @type {CustomElementConstructor}
*/
export default class WithFacetCounter extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, mode: 'false', ...options }, ...args)
  }

  connectedCallback () {
    document.body.addEventListener('with-facet', this.receiveData)
    this.initialContent = this.root.children[0]
  }

  disconnectedCallback () {
    document.body.removeEventListener('with-facet', this.receiveData)
  }

  /**
  * Event Listener: Get Data from WithFacet
  */
  receiveData = async (event) => {
    const fetchData = await event?.detail?.fetch
    const total = this.getAttribute('total')?.split('.').reduce((fetchData, propName) => fetchData?.[propName], fetchData) ?? fetchData.total
    const label = fetchData[this.getAttribute('label')] || this.getAttribute('label') || fetchData.total_label
    if (this.initialContent) {
      this.initialContent.textContent = `${total} ${label}`
    } else {
      this.html = ''
      this.html = /* HTML */ `<ks-a-heading tag="h2" no-margin-bottom>${total} ${label}</ks-a-heading>`
    }

    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../atoms/heading/Heading.js`,
        name: 'ks-a-heading'
      }
    ])
  }
}
