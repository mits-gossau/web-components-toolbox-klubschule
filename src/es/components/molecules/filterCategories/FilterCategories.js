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

    this.html = this.mainNav
  }

  connectedCallback () {
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
    Promise.all([
      fetch,
      this.fetchModules([
        {
          path: `${this.importMetaUrl}../../../../css/web-components-toolbox-migros-design-experience/src/es/components/organisms/MdxComponent.js`,
          name: 'mdx-component'
        }, {
          path: `${this.importMetaUrl}../navLevelItem/NavLevelItem.js`,
          name: 'ks-m-nav-level-item'
        }, {
          path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/molecules/dialog/Dialog.js`,
          name: 'm-dialog'
        }
      ])
    ]).then(([response]) => {
      const filterData = response.filters
      // Backend should give us the data sorted, but in case it doesn't, we can sort it here
      // filterData.sort((a, b) => a.sort - b.sort);

      filterData.forEach((filterItem, i) => {
        let subNav = ''
        if (filterItem.children && filterItem.children.length > 0) {
          filterItem.children.forEach(child => {
            const count = child.count ? `(${child.count})` : ''
            const disabled = child.count === 0 ? 'disabled' : ''
            const checked = child.selected ? 'checked' : ''
            const component = /* html */`
              <mdx-component mutation-callback-event-name="request-with-facet">
                <mdx-checkbox ${checked} ${disabled} variant="no-border" label="${child.label} ${count}"></mdx-checkbox>
              </mdx-component>
            `
            subNav += component
          })
        }

        if (this.mainNav.children[i]?.getAttribute('id') === filterItem.id) {
          this.mainNav.children[i].root.querySelector('.sub-level').innerHTML = subNav
        } else {
          const navLevelItem = /* html */ `
            <m-dialog id="${filterItem.id}" namespace="dialog-left-slide-in-without-background-">
              <div class="container dialog-header" tabindex="0">
                <div id="close-back">
                  <a-icon-mdx icon-name="ChevronLeft" size="2em" ></a-icon-mdx>
                </div>
                <h3>${filterItem.label}</h3>
                <div id="close">
                  <a-icon-mdx icon-name="Plus" size="2em" ></a-icon-mdx>
                </div>
              </div>
              <div class="container dialog-content">
                <div class="sub-level">
                  ${subNav}
                </div>       
              </div>
              <div class="container dialog-footer">
                <a-button id="close" namespace="button-secondary-" no-pointer-events>${this.getAttribute('translation-key-close')}</a-button>
                <a-button namespace="button-primary-">${this.getAttribute('translation-key-cta')}</a-button>
              </div>
              <ks-m-nav-level-item namespace="nav-level-item-default-" id="show-modal">
                <span class="text">${filterItem.label}</span>
                <a-icon-mdx namespace="icon-link-list-" icon-name="ChevronRight" size="1.5em" rotate="0" class="icon-right"></a-icon-mdx>
              </ks-m-nav-level-item>
            </m-dialog>
          `
          const div = document.createElement('div')
          div.innerHTML = navLevelItem
          this.mainNav.appendChild(div.children[0])
        }
      })
    })
  }

  get mainNav () {
    if (this.root.querySelector('.main-level')) return this.root.querySelector('.main-level')
    const mainNav = document.createElement('div')
    mainNav.setAttribute('class', 'main-level')
    return mainNav
  }
}
