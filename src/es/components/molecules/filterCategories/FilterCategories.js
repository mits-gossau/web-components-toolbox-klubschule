// @ts-check

/* global CustomEvent */

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

    this.keepDialogOpenEventListener = event => {
      this.lastId = event.composedPath().find(node => node.tagName === 'M-DIALOG' && node.hasAttribute('id')).getAttribute('id')
    }
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

    this.addEventListener('click', this.keepDialogOpenEventListener)
  }

  disconnectedCallback () {
    document.body.removeEventListener('with-facet', this.withFacetEventListener)
    this.removeEventListener('click', this.keepDialogOpenEventListener)
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

  generateFilterCheckbox(child, parentItem) {
    const subNav = []

    const count = child.count ? `(${child.count})` : ''
    const disabled = child.disabled || child.count === 0 ? 'disabled' : ''
    const checked = child.selected ? 'checked' : ''
    const visible = child.visible ? 'visible' : ''

    const mdxComponent = /* html */`
      <mdx-component mutation-callback-event-name="request-with-facet">
        <mdx-checkbox ${checked} ${disabled} ${visible} variant="no-border" label="${child.label} ${count}"></mdx-checkbox>
      </mdx-component>
    `
    const navLevelItem = /* html */`
      <ks-m-nav-level-item mutation-callback-event-name="request-with-facet" namespace="${checked ? 'nav-level-item-active-' : 'nav-level-item-default-'}">
        <div class="wrap">
          <span class="text">${child.label} ${count}</span>
        </div>
      </ks-m-nav-level-item>
    `

    const div = document.createElement('div')
    div.innerHTML = mdxComponent
    // @ts-ignore
    div.children[0].filterItem = parentItem
    subNav.push(div.children[0])

    return subNav
  }

  getLastSelectedChild (filterItem) {
    let lastSelectedChild = null;
    if (filterItem.selected && (!filterItem.children || filterItem.children.length === 0)) return filterItem
    if (filterItem.children) {
        for (let child of filterItem.children) {
            let result = this.getLastSelectedChild(child)
            if (result) lastSelectedChild = result
        }
    }

    return lastSelectedChild
  }

  generateNavLevelItem (response, filterItem) {
    const shouldRemainOpen = filterItem.id === this.lastId && !response.shouldResetAllFilters && !response.shouldResetFilterFromFilterSelectButton
    const div = document.createElement('div')

    let childItems = ''
    const selectedChildren = filterItem.children.filter(child => child.selected)
    if (selectedChildren.length > 0) {
      selectedChildren.forEach(child => {
        childItems += `${child.label}, `
      })
    }

    const lastSelectedChild = this.getLastSelectedChild(filterItem)

    div.innerHTML = /* html */`
      <m-dialog id="${filterItem.id}" ${shouldRemainOpen ? 'open' : ''} namespace="dialog-left-slide-in-without-background-" show-event-name="dialog-open-${filterItem.id}" close-event-name="backdrop-clicked">
        <div class="container dialog-header" tabindex="0">
          <a-button id="close-back">
            <a-icon-mdx icon-name="ChevronLeft" size="2em" id="close"></a-icon-mdx>
          </a-button>
          <h3>${filterItem.label}</h3>
          <a-button request-event-name="backdrop-clicked" id="close">
            <a-icon-mdx icon-name="Plus" size="2em" rotate="45deg" no-hover-transform></a-icon-mdx>
          </a-button>
        </div>
        <div class="dialog-content">
          ${this.hasAttribute('translation-key-reset') ? /* html */`<p class="reset-link">
            <a-button namespace="button-transparent-" request-event-name="reset-filter" filter-parent="${filterItem.urlpara}_${filterItem.id}">
              ${this.getAttribute('translation-key-reset')}<a-icon-mdx class="icon-right" icon-name="RotateLeft" size="1em"></a-icon-mdx>
            </a-button>
          </p>` : ''}
          <div class="sub-level ${this.hasAttribute('translation-key-reset') ? 'margin-bottom' : 'margin-top-bottom'}"></div>       
        </div>
        <div class="container dialog-footer">
          <a-button id="close" namespace="button-secondary-" no-pointer-events request-event-name="backdrop-clicked">${this.getAttribute('translation-key-close')}</a-button>
          <a-button id="close" class="button-show-all-offers" namespace="button-primary-" no-pointer-events request-event-name="backdrop-clicked">${response.total > 0 ? `(${response.total.toString()})` : ''}${response.total_label}</a-button>
        </div>
        <ks-m-nav-level-item namespace="nav-level-item-default-" id="show-modal">
          <div class="wrap">
            <span class="text">${filterItem.label}</span>
            ${lastSelectedChild && filterItem.level === "" ? /* html */`<span class="additional">${lastSelectedChild.label}</span>` : ''}
            <!--<span class="additional">${childItems.slice(0, -2)}</span>-->
          </div>
          <a-icon-mdx namespace="icon-link-list-" icon-name="ChevronRight" size="1.5em" rotate="0" class="icon-right"></a-icon-mdx>
        </ks-m-nav-level-item>
      </m-dialog>
    `

    return { 
      navLevelItem: div.children[0],
      // @ts-ignore
      subLevel: div.querySelector('m-dialog')?.root.querySelector('.sub-level')
    }
  }

  generateFilters (response, filterItem, parentItem = this.mainNav) {
    const generatedNavLevelItem = this.generateNavLevelItem(response, filterItem)
    parentItem.appendChild(generatedNavLevelItem.navLevelItem)

    if (filterItem.children && filterItem.children.length > 0 && filterItem.visible) {
      filterItem.children.forEach(child => {
        if (child.children && child.children.length > 0) {
          this.generateFilters(response, child, generatedNavLevelItem.subLevel) // recursively call the function for any nested children
        } else {
          this.generateFilterCheckbox(child, filterItem).forEach(node => generatedNavLevelItem.subLevel.appendChild(node))
        }
      })
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
    ]).then(() => {
      fetch.then(response => {
        this.html = ''

        if (response.filters.length === 0) return

        response.filters.forEach((filterItem) => {
          this.generateFilters(response, filterItem)
        })
      })
    })
  }

  get mainNav () {
    if (this.root.querySelector('.main-level')) return this.root.querySelector('.main-level')

    const mainNav = document.createElement('div')
    mainNav.setAttribute('class', 'main-level')

    this.html = mainNav

    return mainNav
  }
}
