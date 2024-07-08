// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class LogoList extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
  }

  disconnectedCallback () {}

  shouldRenderCSS () {
    return !this.root.querySelector(
      `${this.cssSelector} > style[_css]`
    )
  }

  renderCSS () {
    this.css = /* css */ `
        :host ul {
            display: flex;
            flex-wrap: wrap;
            gap: 1.5rem;
            list-style: none;
            padding: 0;
            align-items: center;
        }

        :host([centered]) ul {
            text-align: center;
            justify-content: center;
        }
    `
    return this.fetchTemplate()
  }

  /**
   * fetches the template
   */
  fetchTemplate () {
    /** @type {import("../../web-components-toolbox/src/es/components/prototypes/Shadow.js").fetchCSSParams[]} */
    switch (this.getAttribute('namespace')) {
      case 'logo-list-default-':
        return this.fetchCSS([
          {
            path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
            namespace: false
          }])
    }
  }
}
