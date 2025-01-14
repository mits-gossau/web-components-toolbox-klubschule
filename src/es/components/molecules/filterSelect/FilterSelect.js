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
export default class FilterSelect extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.withFacetEventListener = event => this.renderHTML(event.detail.fetch)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()

    this.eventListenerNode = this.hasAttribute('with-facet-target') ? FilterSelect.walksUpDomQueryMatches(this, "ks-o-offers-page") : document.body
    this.eventListenerNode.addEventListener('with-facet', this.withFacetEventListener)
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
    this.eventListenerNode.removeEventListener('with-facet', this.withFacetEventListener)
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

  generateQuickFilters(filterData) {
    let quickFilters = []

    filterData.forEach(filterItem => {
      if (filterItem.isquick) {
        quickFilters.push({id: filterItem.id, order: filterItem.isquick, label: filterItem.label})
      }
      // check recursive if filterItem or its children is selected and remove the parent filterItem from quickFilters
      const selectedFilter = this.findSelectedAndParents(filterItem)
      if (selectedFilter && selectedFilter.selected) {
        quickFilters = quickFilters.filter(quickFilter => quickFilter.id !== filterItem.id)
      }
    })

    if (quickFilters.length === 0) return

    this.html = quickFilters.sort((a, b) => a.order - b.order).map(quickFilter => {
      const requestEventName = `dialog-open-first-level,dialog-open-${quickFilter.id}`

      return /* html */`
        <ks-c-gtm-event 
          listen-to="click"
          event-data='{
            "event": "quick_filter_selection",
            "quick_filter_category": "${quickFilter.label}"
          }'
        >
          <ks-a-button small namespace="button-secondary-" color="tertiary" justify-content="flex-start" request-event-name="${requestEventName}" click-no-toggle-active>
            <style>
              :host,
              :host button {
                width: 100% !important;
              }
              :host button span {
                text-align: left;
              }
              </style>
            <span>${quickFilter.label}</span>
            <a-icon-mdx icon-name="ChevronDown" size="1em"></a-icon-mdx>
          </ks-a-button>
        </ks-c-gtm-event>
      `
    }).join('')
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
      path: `${this.importMetaUrl}../../controllers/gtmEvent/GtmEvent.js`,
      name: 'ks-c-gtm-event'
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
              <ks-a-button small namespace="button-primary-" color="tertiary" justify-content="space-between" request-event-name="dialog-open-first-level" click-no-toggle-active>
                <span part="label1">${this.getTranslation('FilterButton.SearchInputLabel')} ${response.searchText}</span>
                <span part="label2" dynamic></span>
              </ks-a-button>
              <ks-a-button small namespace="button-primary-" color="tertiary" justify-content="flex-start" request-event-name="reset-filter" filter-key="q" filter-value="${response.searchText}">
                <a-icon-mdx icon-name="X" size="1em"></a-icon-mdx>
              </ks-a-button>
            </m-double-button>
          `
        }

        this.generateFilterButtons(response?.filters)

        this.generateQuickFilters(response?.filters)
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
