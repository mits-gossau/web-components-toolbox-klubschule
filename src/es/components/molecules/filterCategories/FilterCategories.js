// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* FilterCategories is the filter factory listening to the WithFacet controller
*
* @export
* @class FilterCategories
* @type {CustomElementConstructor}
*/
export default class FilterCategories extends Shadow() {
    constructor (options = {}, ...args) {
        super({ importMetaUrl: import.meta.url, ...options }, ...args)

        this.withFacetEventListener = event => this.renderHTML(event.detail.fetch)
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
        case 'filter-default-':
          return this.fetchCSS([{
            path: `${this.importMetaUrl}./default-/default-.css`,
            namespace: false
          }, ...styles])
        default:
          return this.fetchCSS(styles)
      }
    }

    renderHTML (fetch) {
      fetch.then(response => {
        console.log(response.filters)
        console.log(response.courses)

        this.fetchModules([{
            path: `${this.importMetaUrl}../../../../css/web-components-toolbox-migros-design-experience/src/es/components/organisms/MdxComponent.js`,
            name: 'mdx-component'
        }, {
          path: `${this.importMetaUrl}../navLevelItem/NavLevelItem.js`,
          name: 'ks-m-nav-level-item'
        }])

        const filterData = response.filters
        filterData.sort((a, b) => a.sort - b.sort);

        const nav = document.createElement('nav')

        filterData.forEach(filterItem => {
            console.log(filterItem.label);
            const navLevelItem = /* html */ `<ks-m-nav-level-item namespace="nav-level-item-default-">
                        <span class="text">${filterItem.label}</span>
                        <a-icon-mdx namespace="icon-link-list-" icon-name="ChevronRight" size="1.5em" rotate="0" class="icon-right"></a-icon-mdx>
                    </ks-m-nav-level-item>`

            nav.innerHTML += navLevelItem
            
            if (filterItem.children && filterItem.children.length > 0) {
                filterItem.children.forEach(child => {
                    console.log("  -", child.label);
                });
            }
        });


        const lang = this.getAttribute('lang') || document.documentElement.getAttribute('lang')
  
       
        
  
        
  
        this.html = nav
      })
    }
  }