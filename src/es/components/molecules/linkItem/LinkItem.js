// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class LinkItem extends Shadow() {
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
  shouldRenderHTML () {
    return !this.root.querySelector('a')
  }

  shouldRenderCSS () {
    return !this.root.querySelector(
      `:host > style[_css], ${this.tagName} > style[_css]`
    )
  }

  renderCSS () {
    this.css = /* css */ `
        :host a {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.625rem 0;
            text-decoration: none;
            color: var(--mdx-sys-color-neutral-bold4);
            max-width: calc(600rem/16);
        }

        :host a:hover {
            color: var(--mdx-sys-color-primary-default);
        }

        :host .link-item__wrap {
            display: flex;
            flex-direction: column;
            gap: var(--mdx-sys-spacing-fix-3xs);
        }

        :host .link-item__text {
            font: var(--mdx-sys-font-fix-label2, inherit);
        }

        :host .link-item__description {
            font: var(--mdx-sys-font-fix-body3, inherit);
        }
    `
  }

  /**
   * Render HTML
   * @returns Promise<void>
   */
  renderHTML () {
    const linkAttributes = ['id', 'href', 'target'].map(attr => {
      return this.hasAttribute(attr) ? `${attr}="${this.getAttribute(attr)}"` : ''
    }).join(' ')

    this.html = /* HTML */ `
      <a ${linkAttributes}>
        <div class="link-item__wrap">
          <span class="link-item__text">${this.getAttribute('label')}</span>
          ${this.hasAttribute('description') ? `<span class="link-item__description">${this.getAttribute('description')}</span>` : ''}
        </div>
        <a-icon-mdx namespace="icon-link-list-" icon-name="ChevronRight" size="1.5em" rotate="0"></a-icon-mdx>
      </a>
    `

    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ])
  }
}
