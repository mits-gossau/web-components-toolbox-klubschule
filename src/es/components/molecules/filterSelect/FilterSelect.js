// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* filterSelect listening to the WithFacet controller
*
* @export
* @class filterSelect
* @type {CustomElementConstructor}
*/
export default class filterSelect extends Shadow() {
    constructor (options = {}, ...args) {
        super({ importMetaUrl: import.meta.url, ...options }, ...args)

        this.withFacetEventListener = event => this.renderHTML(event.detail.fetch)

        this.html = this.filterSelect
    }

    connectedCallback() {
      if (this.shouldRenderCSS()) this.renderCSS()
      document.body.addEventListener('with-facet', this.withFacetEventListener)
      this.dispatchEvent(new CustomEvent('request-with-facet',
      {
        bubbles: true,
        cancelable: true,
        composed: true
      }))
    }

    disconnectedCallback () {
      document.body.removeEventListener('with-facet', this.withFacetEventListener)
    }

    shouldRenderCSS () {
      return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
    }

    renderCSS () {
      return this.fetchTemplate()
    }

    fetchTemplate () {
      const styles = [
        {
          path: `${this.importMetaUrl}../../../../es/components/web-components-toolbox/src/css/reset.css`,
          namespace: false
        },
        {
          path: `${this.importMetaUrl}../../../../es/components/web-components-toolbox/src/css/style.css`,
          namespaceFallback: true
        }
      ]
      switch (this.getAttribute('namespace')) {
        case 'filter-select-default-':
          return this.fetchCSS([{
            path: `${this.importMetaUrl}./default-/default-.css`,
            namespace: false
          }, ...styles])
        default:
          return this.fetchCSS(styles)
      }
    }

    renderHTML (fetch) {
      this.fetchModules([{
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/organisms/grid/Grid.js`,
        name: 'o-grid'
      }, {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/molecules/doubleButton/DoubleButton.js`,
        name: 'm-double-button'
      }, {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }, {
        path: `${this.importMetaUrl}../../atoms/button/Button.js`,
        name: 'ks-a-button'
      }]).then(() => {
        fetch.then(response => {
            console.log('response', response)
            const filterData = response.filters
            
            const filterButtons = /* html */ `
                <o-grid namespace="grid-432-auto-colums-auto-rows-" id="show-modal">
                    <ks-a-button namespace="button-primary-" color="secondary">
                        <a-icon-mdx icon-name="FilterKlubschule" size="1em" class="icon-left"></a-icon-mdx>Alle Filter
                    </ks-a-button>
                    <m-double-button namespace="double-button-default-" width="100%">
                        <ks-a-button filter namespace="button-primary-" color="tertiary" justify-content="space-between">
                            <span part="label1">Label</span>
                            <span part="label2" dynamic></span>
                        </ks-a-button>
                        <ks-a-button filter namespace="button-primary-" color="tertiary" justify-content="flex-start">
                            <a-icon-mdx icon-name="X" size="1em"></a-icon-mdx>
                        </ks-a-button>
                    </m-double-button>
                    <ks-a-button namespace="button-secondary-" color="tertiary" justify-content="flex-start">Label</ks-a-button>
                </o-grid>
            `

            const div = document.createElement('div')
            div.innerHTML = filterButtons
            console.log('div', div.children[0])
           
            this.filterSelect.appendChild(div.children[0])
            console.log('this.filterSelect', this.filterSelect)

        })
      })
    }

    get filterSelect () {
      if (this.root.querySelector('.filter-select')) return this.root.querySelector('.filter-select')
      const filterSelect = document.createElement('div')
      filterSelect.setAttribute('class', 'filter-select')
      return filterSelect
    }
  }