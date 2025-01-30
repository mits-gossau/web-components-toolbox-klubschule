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
    this.generateFilterMap = new Map()
    this.total = 0
    this.firstTreeItem = null

    this.withFacetEventListener = event => this.renderHTML(event.detail.fetch)

    this.keepDialogOpenEventListener = event => {
      this.lastId = event.composedPath().find(node => node.tagName === 'M-DIALOG' && node.hasAttribute('id')).getAttribute('id')
    }

    this.clickNavLevelItemLevel0EventListener = id => {
      return () => {
        this.dispatchEvent(new CustomEvent('request-with-facet', { bubbles: true, cancelable: true, composed: true, detail: { selectedFilterId: id } }))
        this.dispatchEvent(new CustomEvent('hide-all-sublevels', {bubbles: true, cancelable: true, composed: true}))
      }
    }
    
    this.hideAllSublevelsEventListener = () => this.hideSubLevels()
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()

    this.eventListenerNode = this.hasAttribute('with-facet-target') ? FilterCategories.walksUpDomQueryMatches(this, "ks-o-offers-page") : document.body
    this.eventListenerNode.addEventListener('with-facet', this.withFacetEventListener)
    this.dispatchEvent(new CustomEvent('request-with-facet',
      {
        bubbles: true,
        cancelable: true,
        composed: true
      }))

    this.addEventListener('click', this.keepDialogOpenEventListener)
    document.body.addEventListener('hide-all-sublevels', this.hideAllSublevelsEventListener)
  }

  disconnectedCallback () {
    this.eventListenerNode.removeEventListener('with-facet', this.withFacetEventListener)
    this.removeEventListener('click', this.keepDialogOpenEventListener)
    document.body.removeEventListener('hide-all-sublevels', this.hideAllSublevelsEventListener)
  }

  addEventListenersToDialogs = mainNav => {
    const dialogs = mainNav.querySelectorAll('m-dialog')

    dialogs.forEach(dialog => {
      const filterId = dialog.getAttribute('id').replace('filter-', '')
      const navLevelItem = dialog.shadowRoot.querySelector('ks-m-nav-level-item')
      navLevelItem.addEventListener('click', this.clickNavLevelItemLevel0EventListener(filterId))
    })
  }

  observeMainNav = mainNav => {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          this.addEventListenersToDialogs(mainNav)
        }
      }
    })

    observer.observe(mainNav, { childList: true, subtree: true })
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
    const centerNav = []
    let centerUrlpara = 'center'
    if (filterItem.typ === 'group') centerUrlpara = filterItem.urlpara

    filterItem.children.forEach(region => {
      const divRegion = document.createElement('div')
      divRegion.innerHTML = /* html */`<label class="headline">${region.label}</label>`
      centerNav.push(divRegion.children[0])

      // sort region.children by label
      region.children.sort((a, b) => a.label.localeCompare(b.label))

      region.children.forEach(center => {
        const count = center.count ? `(${center.count})` : ''
        const disabled = center.disabled ? 'disabled' : ''
        const checked = center.selected ? 'checked' : ''
        const hidden = center.visible ? '' : 'hidden'
        const centerCheckbox = /* html */`
          <mdx-component mutation-callback-event-name="request-with-facet">
            <mdx-checkbox ${checked} ${disabled} ${hidden} variant="no-border" label="${center.label} ${count}" filter-id="${centerUrlpara}-${center.id}"></mdx-checkbox>
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
    let centerUrlpara = 'center'
    if (filterItem.typ === 'group') centerUrlpara = filterItem.urlpara

    filterItem.children.forEach(region => {
      region.children.forEach(center => {
        const count = center.count ? `(${center.count})` : ''
        const disabled = center.disabled ? 'disabled' : ''
        const checked = center.selected ? 'checked' : ''
        const hidden = center.visible ? '' : 'hidden'
        const id = `[filter-id="${centerUrlpara}-${center.id}"]`
        let centerFilterCheckbox = null

        if (centerFilters.find(centerFilter => (centerFilterCheckbox = centerFilter.querySelector(id) || (centerFilter.matches(id) && centerFilter)))) {
          // @ts-ignore
          centerFilterCheckbox.setAttribute('label', `${center.label} ${count}`)
          const attributes = { disabled, checked, hidden }

          Object.entries(attributes).forEach(([key, value]) => {
            if (value) {
              // @ts-ignore
              centerFilterCheckbox.setAttribute(key, '')
            } else {
              // @ts-ignore
              centerFilterCheckbox.removeAttribute(key)
            }
          })
        }
      })
    })
  }

  generateFilterElement (response, child, parentItem, firstFilterItemId) {
    const subNav = []
    const disabled = child.disabled ? 'disabled' : ''
    const checked = child.selected ? 'checked' : ''
    const hidden = child.visible ? '' : 'hidden'
    const isMultipleChoice = parentItem.typ === 'multi'
    let numberOfOffers = child.count && child.count !== 0 ? `(${child.count})` : '(0)'
    if (child.hideCount) numberOfOffers = ''
    const mdxCheckbox = /* html */`
      <mdx-component mutation-callback-event-name="request-with-facet">
        <mdx-checkbox ${checked} ${disabled} ${hidden} variant="no-border" label='${child.label.replace(/'/g, '’').replace(/"/g, '\"')} ${numberOfOffers}' filter-id="${parentItem.urlpara}-${child.urlpara}"></mdx-checkbox>
      </mdx-component>
    `
    const navLevelItem = /* html */`
      <ks-m-nav-level-item 
        ${disabled}
        ${this.firstTreeItem ? `type="${this.firstTreeItem.typ}"` : ''}
        namespace="${checked ? 'nav-level-item-active-' : 'nav-level-item-default-'}"
        request-event-name="request-with-facet"
        filter-id="${parentItem.urlpara}-${child.urlpara}"
        label="${
          this.firstTreeItem?.label.replace(/'/g, '’').replace(/"/g, '\"')
          || parentItem.label.replace(/'/g, '’').replace(/"/g, '\"')
        }"
      >
        <div class="wrap">
          <span class="text">${child.label.replace(/'/g, '’').replace(/"/g, '\"')} ${numberOfOffers}</span>
        </div>
      </ks-m-nav-level-item>
    `

    if (!child.visible) return subNav

    const div = document.createElement('div')
    div.innerHTML = isMultipleChoice ? mdxCheckbox : navLevelItem
    // @ts-ignore
    div.children[0].filterItem = response.filters.find(filter => filter.id === firstFilterItemId)
    subNav.push(div.children[0])

    return subNav
  }

  updateFilter (generatedFilters, child, parentItem) {
    const disabled = child.disabled ? 'disabled' : ''
    const checked = child.selected ? 'checked' : ''
    const hidden = child.visible ? '' : 'hidden'
    let numberOfOffers = child.count && child.count !== 0 ? `(${child.count})` : '(0)'
    if (child.hideCount) numberOfOffers = ''
    const id = `[filter-id="${parentItem.urlpara}-${child.urlpara}"]`
    let filterItem = null
    if (generatedFilters.find(filter => (filterItem = filter.querySelector(id) || (filter.matches(id) && filter)))) {
      // @ts-ignore
      if (filterItem && filterItem !== null) {
        // @ts-ignore
        const text = filterItem.shadowRoot.querySelector('.text') || filterItem.querySelector('.text')
        // @ts-ignore
        filterItem.setAttribute('label', `${child.label.replace(/'/g, '’').replace(/"/g, '\"')} ${numberOfOffers}`)
        // @ts-ignore
        if (text) text.textContent = `${child.label.replace(/'/g, '’').replace(/"/g, '\"')} ${numberOfOffers}`
      }
      const attributes = { disabled, checked, hidden }
      Object.entries(attributes).forEach(([key, value]) => {
        if (value) {
          filterItem.setAttribute(key, '')
        } else {
          filterItem.removeAttribute(key)
        }
      })
    }
  }

  getSelectedFilters (filterItem, type = '') {
    if (!filterItem.children || filterItem.children.length === 0) return

    let selectedFilters = []

    if (filterItem.typ === 'group') { // get selected centers
      selectedFilters = []
      filterItem.children.forEach(region => {
        region.children.forEach(center => {
          if (center.selected) {
            selectedFilters.push(center)
            const result = this.getSelectedFilters(center) // recursive call
            if (result) selectedFilters = selectedFilters.concat(result)
          }
        })
      })
    }

    if (filterItem.typ === 'multi') { // get selected checkbox filters
      filterItem.children.forEach(child => {
        if (child.selected) {
          selectedFilters.push(child)
          const result = this.getSelectedFilters(child) // recursive call
          if (result) selectedFilters = selectedFilters.concat(result)
        }
      })
    }

    if (filterItem.typ === 'tree' || type === 'tree') { // get sparte filters
      filterItem.children.forEach(child => {
        if (child.selected) {
          selectedFilters.push(child)
        }

        const result = this.getSelectedFilters(child, 'tree') // recursive call
        if (result?.length) {
          selectedFilters = selectedFilters.concat(result)
        }
      })
    }

    if (filterItem.typ === 'value' && type !== 'tree') { // get selected sparte filters
      filterItem.children.forEach(child => {
        if (child.selected) {
          selectedFilters.push(child)
          const result = this.getSelectedFilters(child) // recursive call
          if (result) selectedFilters = selectedFilters.concat(result)
        } else {
          this.getSelectedFilters(child) // recursive call
        }
      })
    }

    return selectedFilters
  }

  generateNavLevelItem (response, parentItem, filterItem, mainNav, level) {
    const filterIdPrefix = 'filter-'
    const shouldRemainOpen = filterIdPrefix + filterItem.id === this.lastId && !response.shouldResetAllFilters && !response.shouldResetFilterFromFilterSelectButton
    const div = document.createElement('div')
    const navLevelItem = document.createElement('div')
    let selectedFilters = this.getSelectedFilters(filterItem)?.map(filter => filter.label.replace(/'/g, '’').replace(/"/g, '\"')).join(', ') || ''
    // @ts-ignore
    if (level === 0 && filterItem.typ === 'tree') selectedFilters = this.getSelectedFilters(filterItem)[0]?.label.replace(/'/g, '’').replace(/"/g, '\"') || ""
    if (this.firstTreeItem && level !== 0) {
      selectedFilters = ''
    }
    
    const checked = filterItem.selected ? 'checked' : ''
    const namespace = checked ? 'nav-level-item-active-' : 'nav-level-item-default-'
    const filterId = `filter-id="${parentItem.urlpara}-${filterItem.urlpara}"`
    
    let numberOfOffers = filterItem.count && filterItem.count !== 0 ? `(${filterItem.count})` : '(0)'
    if (filterItem.hideCount || level === 0) numberOfOffers = ''
    this.total = response.total

    navLevelItem.innerHTML = /* html */`
      <ks-m-nav-level-item ${this.firstTreeItem ? `type="${this.firstTreeItem.typ}"` : ''} namespace="${namespace}" ${level > 0 ? 'request-event-name="request-with-facet"' : ''} id="show-modal" ${filterId} filter-key="${filterItem.urlpara}" label="${this.firstTreeItem?.label.replace(/'/g, '’').replace(/"/g, '\"') || filterItem.label?.replace(/'/g, '’').replace(/"/g, '\"')}">
        <div class="wrap">
          <span class="text">${filterItem.label?.replace(/'/g, '’').replace(/"/g, '\"')} ${numberOfOffers}</span>
          <span class="additional">${selectedFilters}</span>
        </div>
        <a-icon-mdx namespace="icon-link-list-" icon-name="ChevronRight" size="1.5em" rotate="0" class="icon-right"></a-icon-mdx>
      </ks-m-nav-level-item>
    `

    div.innerHTML = /* html */`
      <m-dialog id="${filterIdPrefix + filterItem.id}" ${shouldRemainOpen ? 'open' : ''} namespace="dialog-left-slide-in-without-background-" show-event-name="dialog-open-${filterItem.id}" close-event-name="backdrop-clicked">
        <div class="container dialog-header" tabindex="0">
          <a-button id="close-back">
            <a-icon-mdx icon-name="ChevronLeft" size="2em" id="close"></a-icon-mdx>
          </a-button>
          <h3>${filterItem.label?.replace(/'/g, '’').replace(/"/g, '\"')}</h3>
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
          <div class="sub-level sub-level-${filterItem.id} ${this.hasAttribute('translation-key-reset') ? 'margin-bottom' : 'margin-top-bottom'}"></div>       
        </div>
        <div class="container dialog-footer">
          <a-button id="close" namespace="button-tertiary-" no-pointer-events request-event-name="backdrop-clicked">${this.getAttribute('translation-key-close')}</a-button>
          <a-button id="close" class="button-show-all-offers" namespace="button-primary-" no-pointer-events request-event-name="backdrop-clicked">${response.total > 0 ? `${response.total.toString()}` : ''} ${response.total_label}</a-button>
        </div>
        ${navLevelItem.innerHTML}
      </m-dialog>
    `

    this.subLevel = div.querySelector('m-dialog')?.shadowRoot?.querySelector(`.sub-level-${filterItem.id}`)
    if (this.subLevel) this.subLevel.setAttribute('hidden', '')

    return {
      navLevelItem: div.children[0],
      subLevel: this.subLevel,
      id: filterItem.id
    }
  }

  toggleSubLevels = (show) => {
    const dialogs = this.mainNav.querySelectorAll('m-dialog')
    dialogs.forEach(dialog => {
      const subLevel = dialog.shadowRoot.querySelector('.sub-level')
      if (subLevel) show ? subLevel.removeAttribute('hidden') : subLevel.setAttribute('hidden', '')
    })
  }
  showSubLevels = () => this.toggleSubLevels(true)
  hideSubLevels = () => this.toggleSubLevels(false)

  generateFilters (response, filterItem, mainNav = this.mainNav, parentItem = null, firstFilterItemId = null, level = -1) {
    level++
    if (level === 0 && filterItem.typ === 'tree') this.firstTreeItem = filterItem
    if (level === 0 && filterItem.typ !== 'tree') this.firstTreeItem = null
    if (filterItem.typ === 'tree') this.getSelectedFilters(filterItem, 'tree')
    if (parentItem === null) parentItem = filterItem
    if (firstFilterItemId === null) firstFilterItemId = filterItem.id

    let generatedNavLevelItem
    if (generatedNavLevelItem = this.generatedNavLevelItemMap.get(level + '_' + filterItem.id)) {
      generatedNavLevelItem.navLevelItem.style.display = filterItem.visible ? 'block' : 'none' // check if filter is visible
      if (generatedNavLevelItem.navLevelItem.root.querySelector('dialog')) generatedNavLevelItem.navLevelItem.root.querySelector('dialog').querySelector('.dialog-footer').querySelector('.button-show-all-offers').root.querySelector('button > span').textContent = `${response.total.toString()} ${response.total_label}`
      // update additional text with selected filter(s) only for the first level 
      if (level === 0) generatedNavLevelItem.navLevelItem.root.querySelector('ks-m-nav-level-item').root.querySelector('.additional').textContent = this.getSelectedFilters(filterItem)?.map(filter => filter.label).join(', ')
      generatedNavLevelItem.navLevelItem.root.querySelector('ks-m-nav-level-item').setAttribute('namespace', filterItem.selected ? 'nav-level-item-active-' : 'nav-level-item-default-')
    } else {
      this.generatedNavLevelItemMap.set(level + '_' + filterItem.id, (generatedNavLevelItem = this.generateNavLevelItem(response, parentItem, filterItem, mainNav, level)))
    }

    if (!filterItem.visible) return

    generatedNavLevelItem.subLevel.innerHTML = ''
    
    // Update Count / disabled Status of nav level items after filtering
    if (level !== 0) {
      // update total button / Avoid bug with uBlock not finding the dialog
      generatedNavLevelItem.navLevelItem.root.querySelector('ks-m-nav-level-item').root.querySelector('.text').textContent = `${filterItem.label.replace(/'/g, '’').replace(/"/g, '\"')} ${filterItem.count && filterItem.count !== 0 ? `(${filterItem.count})` : '(0)'}`
      if (filterItem.disabled) {
        generatedNavLevelItem.navLevelItem.root.querySelector('ks-m-nav-level-item').setAttribute('disabled', '')
      } else {
        generatedNavLevelItem.navLevelItem.root.querySelector('ks-m-nav-level-item').removeAttribute('disabled')
      }
    } else if (level === 0) {
      // update additional text with selected filter(s) only for the first level 
      generatedNavLevelItem.navLevelItem.root.querySelector('ks-m-nav-level-item').root.querySelector('.additional').textContent = this.getSelectedFilters(filterItem)?.map(filter => filter.label).join(', ')
    }
    
    if (!Array.from(mainNav.childNodes).includes(generatedNavLevelItem.navLevelItem)) mainNav.appendChild(generatedNavLevelItem.navLevelItem)
    if (filterItem.children && filterItem.children.length > 0 && filterItem.visible) {
      if (filterItem.id === '13') { // center filters
        const generatedCenterFilters = this.generateCenterFilterMap.get(level + '_' + filterItem.id) || this.generateCenterFilterMap.set(level + '_' + filterItem.id, this.generateCenterFilter(response, filterItem)).get(level + '_' + filterItem.id)
        if (Array.from(generatedNavLevelItem.subLevel.childNodes).includes(generatedCenterFilters[0])) {
          this.updateCenterFilter(generatedCenterFilters, filterItem)
        } else {
          generatedCenterFilters.forEach(node => generatedNavLevelItem.subLevel.appendChild(node))
        }
      } else {
        filterItem.children.forEach((child, i) => {
          if (child.children && child.children.length > 0) {
            this.generateFilters(response, child, generatedNavLevelItem.subLevel, filterItem, firstFilterItemId, level) // recursive call
          } else {
            // const generatedFilters = this.generateFilterMap.get(level + '_' + filterItem.id + '_' + i) || this.generateFilterMap.set(level + '_' + filterItem.id + '_' + i, this.generateFilterElement(response, child, filterItem, firstFilterItemId)).get(level + '_' + filterItem.id + '_' + i)
            const generatedFilters = this.generateFilterElement(response, child, filterItem, firstFilterItemId)
            if (Array.from(generatedNavLevelItem.subLevel.childNodes).includes(generatedFilters[0])) {
              this.updateFilter(generatedFilters, child, filterItem)
            } else {
              generatedFilters.forEach(node => generatedNavLevelItem.subLevel.appendChild(node))
            }
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

          this.showSubLevels()
        }, 0)
      })
    })
  }

  get mainNav () {
    if (this.root.querySelector('.main-level')) return this.root.querySelector('.main-level')

    const mainNav = document.createElement('div')
    mainNav.setAttribute('class', 'main-level')
    
    this.observeMainNav(mainNav)
    
    this.html = mainNav

    return mainNav
  }
}
