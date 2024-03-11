// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class BackLink
* @type {CustomElementConstructor}
*/
export default class BackLink extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
  }

  disconnectedCallback () {}

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML () {
    return !this.root.querySelector('.back-link')
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        font: var(--mdx-sys-font-fix-label1);
        color: var(--mdx-sys-color-neutral-bold4);
      }
      :host .back-link {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: var(--mdx-sys-color-neutral-bold4);
        gap: var(--a-back-link-gap, 0.2em);
      }
      :host .back-link:hover {
        color: var(--a-color);
      }
      :host a-icon-mdx {
        display: inline-block;
        position: relative;
        top: var(--a-back-link-icon-top, 0.1em);
      }
      :host .back-link:hover a-icon-mdx {
        color: var(--a-color);
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
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/reset.css`, // no variables for this reason no namespace
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: true
      }
    ]
    switch (this.getAttribute('namespace')) {
      case 'back-link-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles])
      default:
        return this.fetchCSS(styles)
    }
  }

  /**
   * Render HTML
   * @returns void
   */
  renderHTML () {
    this.fetchModules([{
      path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
      name: 'a-icon-mdx'
    }])

    this.html = /* html */`
      <a href="${this.getAttribute('href')}" alt="${this.getAttribute('alt')}" class="back-link">
        <a-icon-mdx icon-name="${this.getAttribute('icon') || 'ArrowLeft'}" size="1em" rotate="0" class="icon-left"></a-icon-mdx>
        <slot></slot>
      </a>
    `
  }
}
