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

  createFilterButton (filterItem, selectedFilter, treeIds = [], filterGroupUrlPara = null) {
    let requestEventName = 'dialog-open-first-level'

    treeIds && treeIds['parents']?.length > 0 ? requestEventName += ','+treeIds['parents']?.map(id => `dialog-open-${id}`).join(',') : requestEventName += ','+`dialog-open-${filterItem.id}`

    return /* html */`
      <m-double-button namespace="double-button-default-" width="100%">
        <ks-a-button small namespace="button-primary-" color="tertiary" justify-content="space-between" request-event-name="${requestEventName}" click-no-toggle-active>
          <span part="label1">${selectedFilter}</span>
          <span part="label2" dynamic></span>
        </ks-a-button>
        <ks-a-button small namespace="button-primary-" color="tertiary" justify-content="flex-start" request-event-name="reset-filter" filter-key="${filterGroupUrlPara || filterItem.urlpara}" filter-value="${selectedFilter}">
          <a-icon-mdx icon-name="X" size="1em"></a-icon-mdx>
        </ks-a-button>
      </m-double-button>
    `
  }

  generateFilterButtons(filterData) {
    let treeIds = null
    let treeUrlPara = null
    const processFilterItem = (filterItem) => {
      const isCenterFilter = filterItem.typ === 'group'
      const isSectorFilter = filterItem.typ === 'tree'
      
      let selectedFilterItems = []
      
      if (isSectorFilter) {
        filterData.map(filter => {
          if (filter.typ === 'tree') {
            treeIds = this.findSelectedAndParents(filter)
            treeUrlPara = this.findSelectedAndParents(filter, [], !filter.level && filter.urlpara)
          }
        }).find(item => item)
      }

      if (isCenterFilter && filterItem.visible) {
        filterItem.children.forEach(region => {
          region.children.forEach(center => {
            if (center.selected) {
              selectedFilterItems.push(`${center.label.replace(/'/g, '’').replace(/"/g, '\"')}`)
            }
          })
        })

        if (selectedFilterItems.length > 0) {
          this.html = this.createFilterButton(filterItem, selectedFilterItems, [])
        }
      } else if (!isCenterFilter && filterItem.children && filterItem.children.length > 0 && filterItem.visible) {
        const selectedChildren = filterItem.children.filter(child => child.selected)

        if (selectedChildren.length > 0) {
          selectedChildren.forEach(child => {
            selectedFilterItems.push(`${child.label.replace(/'/g, '’').replace(/"/g, '\"')}`)
          })
        }

        if (selectedFilterItems.length > 0) {
          this.html = this.createFilterButton(filterItem, selectedFilterItems, treeIds && treeIds['parents']?.includes(filterItem.id) ? treeIds : [], filterItem.level?.length && treeIds && treeUrlPara && treeUrlPara['parents'][0])
        }
      
        filterItem.children.forEach(child => processFilterItem(child)) // recursive call
      }
    }
  
    filterData.forEach(filterItem => {
      processFilterItem(filterItem)
    })
  }

  findSelectedAndParents(obj, parents = [], parentValue) {
    if (obj.selected) {
      return { selected: true, parents: parents.map(parent => parentValue ? parentValue : parent.id) }
    }
    if (obj.children && Array.isArray(obj.children)) {
      for (const child of obj.children) {
        const result = this.findSelectedAndParents(child, [...parents, obj], parentValue)
        if (result && result.selected) {
          return result
        }
      }
    }

    return null
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
        this.html = ''

        // render search button at first
        if (response.searchText && this.hasAttribute('with-filter-search-button')) {
          this.html = /* html */`
            <m-double-button namespace="double-button-default-" width="100%">
              <ks-a-button small namespace="button-primary-" color="tertiary" justify-content="space-between" request-event-name="show-search-dialog" click-no-toggle-active>
                <span part="label1">${response.searchText}</span>
                <span part="label2" dynamic></span>
              </ks-a-button>
              <ks-a-button small namespace="button-primary-" color="tertiary" justify-content="flex-start" request-event-name="reset-filter" filter-key="q" filter-value="${response.searchText}">
                <a-icon-mdx icon-name="X" size="1em"></a-icon-mdx>
              </ks-a-button>
            </m-double-button>
          `
        }

        this.generateFilterButtons(response?.filters)
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
