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
  }

  disconnectedCallback () {
    document.body.removeEventListener('with-facet', this.withFacetEventListener)
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
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
        const filterData = response.filters
        console.log('filterData(FilterSelect.js)', filterData)

        filterData.forEach((filterItem, i) => {
          if (filterItem.children && filterItem.children.length > 0 && filterItem.visible) {
            let childItems = ''
            filterItem.children.forEach(child => {
              if (child.selected) {
                childItems += child.label + ', '
              }
            })

            const doubleButton = /* html */`
              <m-double-button namespace="double-button-default-" width="100%">
                <ks-a-button filter namespace="button-primary-" color="tertiary" justify-content="space-between" request-event-name="dialog-open-first-level,dialog-open-${filterItem.id}" click-no-toggle-active>
                  <span part="label1">${childItems.slice(0, -2)/* remove last comma and space */}</span>
                  <span part="label2" dynamic></span>
                </ks-a-button>
                <ks-a-button filter namespace="button-primary-" color="tertiary" justify-content="flex-start">
                  <a-icon-mdx icon-name="X" size="1em"></a-icon-mdx>
                </ks-a-button>
              </m-double-button>
            `
            const div = document.createElement('div')
            div.innerHTML = doubleButton

            if (childItems.length > 0) {
              this.html = ''
              this.html = div.children[0]
            }
          }
        })
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
