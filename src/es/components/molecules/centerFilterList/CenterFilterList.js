// @ts-check

/* global CustomEvent */

import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* CenterFilterList is the filter factory listening to the Centers controller
*
* @export
* @class CenterFilterList
* @type {CustomElementConstructor}
*/
export default class CenterFilterList extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.centersEventListener = event => this.renderHTML(event.detail.fetch)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    document.body.addEventListener('centers', this.centersEventListener)
    this.dispatchEvent(new CustomEvent('request-centers',
      {
        bubbles: true,
        cancelable: true,
        composed: true
      }))
  }

  disconnectedCallback () {
    document.body.removeEventListener('centers', this.centersEventListener)
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
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
      case 'center-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`,
          namespace: false
        }, ...styles])
      default:
        return this.fetchCSS(styles)
    }
  }

  renderHTML (fetch) {
    fetch.then(centers => {
      const lang = this.getAttribute('lang') || document.documentElement.getAttribute('lang')
      const centerFilter = document.createElement('div')

      this.fetchModules([{
        path: `${this.importMetaUrl}../../../../css/web-components-toolbox-migros-design-experience/src/es/components/organisms/MdxComponent.js`,
        name: 'mdx-component'
      }])

      Object.keys(centers[lang]).forEach(region => {
        // label
        const label = document.createElement('label')
        label.classList.add('headline')
        label.textContent = region
        centerFilter.appendChild(label)

        centers[lang][region].forEach(city => {
          // checkbox
          const checkbox = document.createElement('mdx-checkbox')
          checkbox.setAttribute('variant', 'no-border')
          checkbox.setAttribute('label', city)

          const component = document.createElement('mdx-component')

          component.setAttribute('click-event-name', 'mdx-component-click-event')
          component.setAttribute('mutation-callback-event-name', 'mdx-component-mutation-event')
          component.setAttribute('listener-event-name', 'mdx-set-attribute')
          component.setAttribute('listener-detail-property-name', 'attributes')

          component.appendChild(checkbox)

          centerFilter.appendChild(component)
        })
      })

      this.html = centerFilter
    })
  }
}
