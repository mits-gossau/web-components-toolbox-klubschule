// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class BadgeLegend
* @type {CustomElementConstructor}
*/
export default class KsBadgeLegend extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
  }

  disconnectedCallback () {}

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        display: flex !important;
        flex-wrap: wrap;
      }
      :host > div {
        display: flex;
        flex-basis: calc(25% - var(--mdx-sys-spacing-fix-xs));
        margin: 0 var(--item-spacing, var(--mdx-sys-spacing-fix-xs)) var(--icon-spacing, var(--mdx-sys-spacing-fix-xs)) 0;
      }
      :host > div > span {
        margin: auto 0 auto var(--icon-spacing, var(--mdx-sys-spacing-fix-xs));
      }
      :host ks-m-badge {
        margin: auto 0;
      }
      @media only screen and (max-width: _max-width_) {
        :host > div {
          flex-basis: 100%;
        }
      }
    `
    return this.fetchTemplate()
  }

  /**
   * fetches the template
   */
  fetchTemplate () {
    /** @type {import("../../web-components-toolbox/src/es/components/prototypes/Shadow.js").fetchCSSParams[]} */
    const styles = [
      {
        path: `${this.importMetaUrl}../../../../es/components/web-components-toolbox/src/css/reset.css`, // no variables for this reason no namespace
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../../../es/components/web-components-toolbox/src/css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: true
      }
    ]
    switch (this.getAttribute('namespace')) {
      case 'badge-legend-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles])
      default:
        return this.fetchCSS(styles)
    }
  }
}
