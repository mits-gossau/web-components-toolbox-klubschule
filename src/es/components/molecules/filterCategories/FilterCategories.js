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

    // this.html = this.mainNav
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
    ]).then(() => {
      fetch.then(response => {
        // console.log('response (FilterCategories.js)', response)
        const filterData = response.filters
        // Backend should give us the data sorted, but in case it doesn't, we can sort it here
        // filterData.sort((a, b) => a.sort - b.sort);
        let numberOfOffers = 0

        this.html = ''
        filterData.forEach((filterItem, i) => {
          let childItems = ''
          const subNav = []
          
          if (filterItem.children && filterItem.children.length > 0 && filterItem.visible) {
            filterItem.children.forEach(child => {
              if (child.selected) {
                childItems += child.label + ', '
              }
              const count = child.count ? `(${child.count})` : ''
              const disabled = child.disabled || child.count === 0 ? 'disabled' : ''
              const checked = child.selected ? 'checked' : ''
              const visible = child.visible ? 'visible' : ''
              const div = document.createElement('div')
              div.innerHTML = /* html */`
                <mdx-component mutation-callback-event-name="request-with-facet">
                  <mdx-checkbox ${checked} ${disabled} ${visible} variant="no-border" label="${child.label} ${count}"></mdx-checkbox>
                </mdx-component>
              `
              // @ts-ignore
              div.children[0].filterItem = filterItem
              subNav.push(div.children[0])

              if (child.selected && child.count > 0) {
                numberOfOffers += child.count
              }
            })

            this.html = this.mainNav
          }

          let resetButton = ''
          if (this.hasAttribute('translation-key-reset')) {
            resetButton = /* html */`
              <p class="reset-link"><a-button namespace="button-transparent-">${this.getAttribute('translation-key-reset')}<a-icon-mdx class="icon-right" icon-name="RotateLeft" size="1em"></a-icon-mdx></a-button></p>
            `
          }

          if (this.mainNav.children[i]?.getAttribute('id') === filterItem.id) {
            const targetNode = this.mainNav.children[i].root.querySelector('.sub-level')
            targetNode.innerHTML = ''
            subNav.forEach(node => targetNode.appendChild(node))
          } else {
            if (filterItem.visible === false || filterItem.children?.length === 0) return

            const navLevelItem = /* html */ `
              <m-dialog id="${filterItem.id}" namespace="dialog-left-slide-in-without-background-" show-event-name="dialog-open-${filterItem.id}" close-event-name="backdrop-clicked">
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
                  ${this.hasAttribute('translation-key-reset') ? resetButton : ''}
                  <div class="sub-level ${this.hasAttribute('translation-key-reset') ? 'margin-bottom' : 'margin-top-bottom'}"></div>       
                </div>
                <div class="container dialog-footer">
                  <a-button id="close" namespace="button-secondary-" no-pointer-events request-event-name="backdrop-clicked">${this.getAttribute('translation-key-close')}</a-button>
                  <a-button id="close" class="button-show-all-offers" namespace="button-primary-" no-pointer-events request-event-name="backdrop-clicked">${numberOfOffers > 0 ? `(${numberOfOffers}) ` : ''}${this.getAttribute('translation-key-cta')}</a-button>
                </div>
                <ks-m-nav-level-item namespace="nav-level-item-default-" id="show-modal">
                  <div class="wrap">
                    <span class="text">${filterItem.label}</span>
                    <span class="additional">${childItems.slice(0, -2)}</span>
                  </div>
                  <a-icon-mdx namespace="icon-link-list-" icon-name="ChevronRight" size="1.5em" rotate="0" class="icon-right"></a-icon-mdx>
                </ks-m-nav-level-item>
              </m-dialog>
            `
            const div = document.createElement('div')

            div.innerHTML = navLevelItem
            // @ts-ignore
            const targetNode = div.children[0].root.querySelector('.sub-level')
            subNav.forEach(node => targetNode.appendChild(node))
            this.mainNav.appendChild(div.children[0])
          }
        })
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
