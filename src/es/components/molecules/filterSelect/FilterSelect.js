// @ts-check

/* global CustomEvent */

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
    this.translationPromise = new Promise(resolve => {
      this.dispatchEvent(new CustomEvent('request-translations',
        {
          detail: {
            resolve
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }))
    }).then(async result => {
      await result.fetch
      this.getTranslation = result.getTranslationSync
      const showPromises = []
    })
  }

  disconnectedCallback () {
    document.body.removeEventListener('with-facet', this.withFacetEventListener)
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  renderCSS () {
    this.css = /* css */`
      :host {
        display: contents;
      }
    `
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

  getLastSelectedChild (filterItem) {
    let lastSelectedChild = null
    if (filterItem.selected && (!filterItem.children || filterItem.children.length === 0)) return filterItem
    if (filterItem.children) {
      for (const child of filterItem.children) {
        const result = this.getLastSelectedChild(child)
        if (result) lastSelectedChild = result
      }
    }

    return lastSelectedChild
  }

  renderHTML (fetch) {
    this.fetchModules([{
      path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/organisms/grid/Grid.js`,
      name: 'o-grid'
    },
    {
      path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/molecules/doubleButton/DoubleButton.js`,
      name: 'm-double-button'
    },
    {
      path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
      name: 'a-icon-mdx'
    },
    {
      path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/molecules/dialog/Dialog.js`,
      name: 'm-dialog'
    },
    {
      path: `${this.importMetaUrl}../../atoms/button/Button.js`,
      name: 'ks-a-button'
    },
    {
      path: `${this.importMetaUrl}../../controllers/autoComplete/AutoComplete.js`,
      name: 'ks-c-auto-complete'
    },
    {
      path: `${this.importMetaUrl}../../molecules/autoCompleteList/AutoCompleteList.js`,
      name: 'ks-m-auto-complete-list'
    }]).then(() => {
      Promise.all([this.translationPromise, fetch]).then(([translation, response]) => {
        const filterData = response?.filters
        
        this.html = ''

        // loop through the filter data and generate the filter select
        filterData.forEach((filterItem) => {
          if (filterItem.children && filterItem.children.length > 0 && filterItem.visible) {
            let childItems = ''
            if (filterItem.typ === 'multi') {
              const selectedChildren = filterItem.children.filter(child => child.selected)
              if (selectedChildren.length > 0) {
                selectedChildren.forEach(child => {
                  childItems += `${child.label}, `
                })
              }
            } else {
              const lastSelectedChild = this.getLastSelectedChild(filterItem)
              if (lastSelectedChild) childItems = `${lastSelectedChild.label}, `
            }

            const doubleButton = /* html */`
              <m-double-button namespace="double-button-default-" width="100%">
                <ks-a-button filter namespace="button-primary-" color="tertiary" justify-content="space-between" request-event-name="dialog-open-first-level,dialog-open-${filterItem.id}" click-no-toggle-active>
                  <span part="label1">${childItems.slice(0, -2)/* remove last comma and space */}</span>
                  <span part="label2" dynamic></span>
                </ks-a-button>
                <ks-a-button filter namespace="button-primary-" color="tertiary" justify-content="flex-start" request-event-name="reset-filter" filter-key="${filterItem.urlpara}" filter-value="${childItems.slice(0, -2)}">
                  <a-icon-mdx icon-name="X" size="1em"></a-icon-mdx>
                </ks-a-button>
              </m-double-button>
            `

            if (childItems.length > 0) {
              this.html = doubleButton
            }
          }
        })

        // render search button
        if (this.hasAttribute('with-search') && response.searchText) {
          this.html = /* html */`
            <m-double-button namespace="double-button-default-" width="100%">
              <ks-a-button namespace="button-primary-" color="tertiary" justify-content="space-between" request-event-name="show-search-dialog" click-no-toggle-active>
                <span part="label1">${response.searchText}</span>
                <span part="label2" dynamic></span>
              </ks-a-button>
              <ks-a-button search-filter namespace="button-primary-" color="tertiary" justify-content="flex-start" request-event-name="reset-filter" filter-key="q" filter-value="${response.searchText}">
                <a-icon-mdx icon-name="X" size="1em"></a-icon-mdx>
              </ks-a-button>
            </m-double-button>
          `
        }
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
