// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

import centers from './centers.json' assert { type: "json" };

export default class CenterFilterList extends Shadow() {
    constructor (options = {}, ...args) {
        super({ importMetaUrl: import.meta.url, ...options }, ...args)
    }

    connectedCallback() {
      if (this.shouldRenderCSS()) this.renderCSS()
      this.renderHTML()
    }

    disconnectedCallback () {}

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
        case 'center-default-':
          return this.fetchCSS([{
            path: `${this.importMetaUrl}./default-/default-.css`,
            namespace: false
          }, ...styles])
        default:
          return this.fetchCSS(styles)
      }
    }

    renderHTML () {
      const lang = this.getAttribute('lang') || "de";

      const resetParagraph = document.createElement('p')
      const resetLink = document.createElement('a')
      const resetText = this.getAttribute('reset-text') || "zurücksetzen";
      resetLink.appendChild(document.createTextNode(resetText))
      resetParagraph.appendChild(resetLink)
      resetParagraph.classList.add('reset-link')

      const centerFilter = document.createElement('div')
      centerFilter.appendChild(resetParagraph)

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
          checkbox.setAttribute('variant', "no-border")
          checkbox.setAttribute('label', city)

          const component = document.createElement('mdx-component')

          component.setAttribute('click-event-name', "mdx-component-click-event")
          component.setAttribute('mutation-callback-event-name', "mdx-component-mutation-event")
          component.setAttribute('listener-event-name', "mdx-set-attribute")
          component.setAttribute('listener-detail-property-name', "attributes")

          component.appendChild(checkbox)

          centerFilter.appendChild(component)
        })
      })

      this.html = centerFilter
    }
  }