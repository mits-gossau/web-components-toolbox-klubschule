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

    this.generatedNavLevelItemMap = new Map()
    this.generateCenterFilterMap = new Map()
    this.total = 0
    
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
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  renderCSS () {
    this.css = ''
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

  generateCenterFilter (response, filterItem) {
    let centerNav = []

    filterItem.children.forEach(region => {
      const divRegion = document.createElement('div')
      divRegion.innerHTML = /* html */`<label class="headline">${region.label}</label>`
      centerNav.push(divRegion.children[0])

      region.children.forEach(center => {
        const count = center.count ? `(${center.count})` : ''
        const disabled = center.disabled ? 'disabled' : ''
        const checked = center.selected ? 'checked' : ''
        const visible = center.visible ? 'visible' : ''
        const centerCheckbox = /* html */`
          <mdx-component mutation-callback-event-name="request-with-facet">
            <mdx-checkbox ${checked} ${disabled} ${visible} variant="no-border" label="${center.label} ${count}" filter-id="${region.urlpara}-${center.id}"></mdx-checkbox>
          </mdx-component>
        `
        const div = document.createElement('div')
        div.innerHTML = centerCheckbox
        // @ts-ignore
        div.children[0].filterItem = response.filters.find(filter => filter.id === filterItem.id)
        centerNav.push(div.children[0])
      })
    })

    return centerNav
  }

  updateCenterFilter (centerFilters, filterItem) {
    filterItem.children.forEach(region => {
      region.children.forEach(center => {
        const count = center.count ? `(${center.count})` : ''
        const disabled = center.disabled ? 'disabled' : ''
        const checked = center.selected ? 'checked' : ''
        const visible = center.visible ? 'visible' : ''
        const id = `[filter-id=${region.urlpara}-${center.id}]`
        let centerFilterCheckbox
        if (centerFilters.find(centerFilter => (centerFilterCheckbox = centerFilter.querySelector(id)))) {
          console.log(centerFilterCheckbox)
          // @ts-ignore
          centerFilterCheckbox.setAttribute('label', `${center.label} ${count}`)
          if (disabled) {
            // @ts-ignore
            centerFilterCheckbox.setAttribute('disabled', '')
          } else {
            // @ts-ignore
            centerFilterCheckbox.removeAttribute('disabled')
          }
          if (checked) {
            // @ts-ignore
            centerFilterCheckbox.setAttribute('checked', '')
          } else {
            // @ts-ignore
            centerFilterCheckbox.removeAttribute('checked')
          }
          if (visible) {
            // @ts-ignore
            centerFilterCheckbox.setAttribute('visible', '')
          } else {
            // @ts-ignore
            centerFilterCheckbox.removeAttribute('visible')
          }
        }
      })
    })
  }

  generateFilterElement (response, child, parentItem, firstFilterItemId) {
    const subNav = []
    const count = child.count ? `(${child.count})` : ''
    const disabled = child.disabled ? 'disabled' : ''
    const checked = child.selected ? 'checked' : ''
    const visible = child.visible ? 'visible' : ''
    const isMultipleChoice = parentItem.typ === 'multi'

    const mdxCheckbox = /* html */`
      <mdx-component mutation-callback-event-name="request-with-facet">
        <mdx-checkbox ${checked} ${disabled} ${visible} variant="no-border" label="${child.label} ${count}" filter-id="${parentItem.urlpara}-${child.urlpara}"></mdx-checkbox>
      </mdx-component>
    `
    const navLevelItem = /* html */`
      <ks-m-nav-level-item namespace="${checked ? 'nav-level-item-active-' : 'nav-level-item-default-'}" request-event-name="request-with-facet" filter-id="${parentItem.urlpara}-${child.urlpara}">
        <div class="wrap">
          <span class="text">${child.label} ${count}</span>
        </div>
      </ks-m-nav-level-item>
    `

    if (!visible) return subNav

    const div = document.createElement('div')
    div.innerHTML = isMultipleChoice ? mdxCheckbox : navLevelItem
    // @ts-ignore
    div.children[0].filterItem = response.filters.find(filter => filter.id === firstFilterItemId)
    subNav.push(div.children[0])

    return subNav
  }

  getLastSelectedChild (filterItem) {
    let lastSelectedChild = null
    if (!filterItem.children || filterItem.children.length === 0) return
    if (filterItem.children) {
      for (const child of filterItem.children) {
        if (child.selected) {
          const result = this.getLastSelectedChild(child)
          if (result) lastSelectedChild = result
        }
      }
    }
    
    return lastSelectedChild
  }

  generateNavLevelItem (response, filterItem) {
    const filterIdPrefix = 'filter-'
    const shouldRemainOpen = filterIdPrefix+filterItem.id === this.lastId && !response.shouldResetAllFilters && !response.shouldResetFilterFromFilterSelectButton
    const div = document.createElement('div')
    this.total = response.total

    let childItems = ''
    if (filterItem.typ === 'multi') {
      const selectedChildren = filterItem.children.filter(child => child.selected)
      if (selectedChildren.length > 0) {
        selectedChildren.forEach(child => {
          childItems += `${child.label}, `
        })
      }
    } else {
      childItems = this.getLastSelectedChild(filterItem) ? this.getLastSelectedChild(filterItem).label : ''
    }
    if (filterItem.typ === 'group') {
      const selectedChildren = filterItem.children.filter(child => child.selected)
      if (selectedChildren.length > 0) {
        selectedChildren.forEach(child => {
          if (child.selected) {
            child.children.forEach(subChild => {
              if (subChild.selected) {
                childItems += `${subChild.label}, `
              }
            })
          }
        })
      }
    }

    div.innerHTML = /* html */`
      <m-dialog id="${filterIdPrefix+filterItem.id}" ${shouldRemainOpen ? 'open' : ''} namespace="dialog-left-slide-in-without-background-" show-event-name="dialog-open-${filterItem.id}" close-event-name="backdrop-clicked">
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
            <a-button namespace="button-transparent-" request-event-name="reset-filter" filter-key="${filterItem.urlpara}">
              ${this.getAttribute('translation-key-reset')}<a-icon-mdx class="icon-right" icon-name="RotateLeft" size="1em"></a-icon-mdx>
            </a-button>
          </p>` : ''}
          <div class="sub-level ${this.hasAttribute('translation-key-reset') ? 'margin-bottom' : 'margin-top-bottom'}"></div>       
        </div>
        <div class="container dialog-footer">
          <a-button id="close" namespace="button-tertiary-" no-pointer-events request-event-name="backdrop-clicked">${this.getAttribute('translation-key-close')}</a-button>
          <a-button id="close" class="button-show-all-offers" namespace="button-primary-" no-pointer-events request-event-name="backdrop-clicked">${response.total > 0 ? `${response.total.toString()}` : ''} ${response.total_label}</a-button>
        </div>
        <ks-m-nav-level-item namespace="nav-level-item-default-" id="show-modal" filter-key="${filterItem.urlpara}">
          <div class="wrap">
            <span class="text">${filterItem.label}</span>
            <span class="additional">${childItems.slice(0, -2)}</span>
          </div>
          <a-icon-mdx namespace="icon-link-list-" icon-name="ChevronRight" size="1.5em" rotate="0" class="icon-right"></a-icon-mdx>
        </ks-m-nav-level-item>
      </m-dialog>
    `

    return {
      navLevelItem: div.children[0],
      // @ts-ignore
      subLevel: div.querySelector('m-dialog')?.root.querySelector('.sub-level'),
      id: filterItem.id
    }
  }

  generateFilters (response, filterItem, parentItem = this.mainNav, firstFilterItemId = null, level = 0) {
    if (!filterItem.visible) return
    if (firstFilterItemId === null) firstFilterItemId = filterItem.id
    
    let generatedNavLevelItem
    if (generatedNavLevelItem = this.generatedNavLevelItemMap.get(level + '_' + filterItem.id)) {
      generatedNavLevelItem.navLevelItem.root.querySelector('dialog').querySelector('.dialog-footer').querySelector('.button-show-all-offers').root.querySelector('button > span').textContent = `${response.total.toString()} ${response.total_label}`
    } else {
      this.generatedNavLevelItemMap.set(level + '_' + filterItem.id, (generatedNavLevelItem = this.generateNavLevelItem(response, filterItem)))
    }
    if (!Array.from(parentItem.childNodes).includes(generatedNavLevelItem.navLevelItem)) parentItem.appendChild(generatedNavLevelItem.navLevelItem)
    if (filterItem.children && filterItem.children.length > 0 && filterItem.visible) {
      if (filterItem.id === '13') { // center filters
        const generatedCenterFilters = this.generateCenterFilterMap.get(level + '_' + filterItem.id) || this.generateCenterFilterMap.set(level + '_' + filterItem.id, Array.from(this.generateCenterFilter(response, filterItem))).get(level + '_' + filterItem.id)
        if (Array.from(generatedNavLevelItem.subLevel.childNodes).includes(generatedCenterFilters[0])) {
          this.updateCenterFilter(generatedCenterFilters, filterItem)
        } else {
          generatedCenterFilters.forEach(node => generatedNavLevelItem.subLevel.appendChild(node))
        }
      } else {
        // TODO: for the moment clear has to be removed
        generatedNavLevelItem.subLevel.innerHTML = ''
        filterItem.children.forEach(child => {
          if (child.children && child.children.length > 0) {
            this.generateFilters(response, child, generatedNavLevelItem.subLevel, firstFilterItemId, level++) // recursive call
          } else {
            this.generateFilterElement(response, child, filterItem, firstFilterItemId).forEach(node => generatedNavLevelItem.subLevel.appendChild(node))
          }
        })
      }
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
        setTimeout(() => {
          if (response.filters.length === 0) return
  
          response.filters.forEach((filterItem) => {
            this.generateFilters(response, filterItem)
          })
        }, 0)
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
