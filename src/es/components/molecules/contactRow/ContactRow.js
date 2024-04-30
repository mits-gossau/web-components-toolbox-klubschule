// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Contact
* @type {CustomElementConstructor}
*/
export default class Contact extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, mode: 'false', ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
  }

  disconnectedCallback () {
  }

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
    return !this.a
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        --a-text-decoration-hover: underline;
        --icon-mdx-ks-color: var(--a-color);
      }
      :host a:hover a-icon-mdx {
        --icon-mdx-ks-color: var(--a-color-hover);
      }
      :host a {
        --a-text-decoration: none !important;
        text-decoration: var(--a-text-decoration) !important;
        text-decoration-line: var(--a-text-decoration) !important;
        display: flex !important;
        gap: var(--mdx-sys-spacing-fix-m, 24px);
      }
      :host a:hover {
        text-decoration: var(--a-text-decoration-hover) !important;
        text-decoration-line: var(--a-text-decoration-hover) !important;
      }
      :host address span {
        display: block;
        font-style: normal;
      }
    `
    return this.fetchCSS([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/reset.css`, // no variables for this reason no namespace
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: true
      }
    ])
  }

  /**
   * Render HTML
   * @returns Promise<void>
   */
  renderHTML () {
    const firstRow = this.getAttribute('name')
    const secondRow = this.getAttribute('street')
    const thirdRow = this.getAttribute('place')
    const isAddress = secondRow && thirdRow
    const id = this.getAttribute('id')
    const target = this.getAttribute('target')

    this.html =   /* HTML */ `
      <a href="${this.getAttribute('href')}" ${id ? `id="${id}"` : ''} ${target ? `target="${target}"` : ''} >
        <a-icon-mdx 
          namespace="icon-mdx-ks-" 
          size="${this.getAttribute('icon-size') || '1em'}"
          ${this.getAttribute('icon-url') ? `icon-url="${this.getAttribute('icon-url')}"` : `icon-name="${this.getAttribute('icon-name')}"`} 
        >
        </a-icon-mdx>
        ${isAddress ? /* html */ '<address>' : /* html */ '<div>'}
          <span>
            ${firstRow}
          </span>
          ${secondRow ? /* html */ `<span>${secondRow}</span>` : ''}
          ${thirdRow ? /* html */ `<span>${thirdRow}</span>` : ''}
        ${isAddress ? /* html */ '</address>' : /* html */ '</div>'}
      </a>
    `

    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/Link/Link.js`,
        name: 'a-link'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ])
  }

  get data () {
    return Contact.parseAttribute(this.getAttribute('data'))
  }

  get a () {
    return this.root.querySelector('a')
  }
}
