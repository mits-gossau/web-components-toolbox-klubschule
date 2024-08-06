// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Link
* @type {CustomElementConstructor}
*/
export default class Link extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
  }

  disconnectedCallback () {}

  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  shouldRenderHTML () {
    return !this.root.querySelector('.link')
  }

  renderCSS () {
    this.css = /* css */`
      :host span {
        height: var(--a-link-span-height, 1em);
      }
      :host a-icon-mdx {
        color: var(--a-link-color, var(--a-color));
      }
      :host .link:hover a-icon-mdx {
        color: var(--a-link-color-hover, var(--a-color-hover));
      }
    `
  }

  renderHTML () {
    this.fetchModules([{
      path: `${this.importMetaUrl}../../organisms/MdxComponent.js`,
      name: 'mdx-component'
    }, {
      path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
      name: 'a-icon-mdx'
    }])

    this.html = /* html */`
        <mdx-component>
            <mdx-link 
                ${this.hasAttribute('href') ? `href="${this.getAttribute('href')}"` : ''}
                target="${this.hasAttribute('target') ? this.getAttribute('target') : '_self'}"
                variant="standalone" 
                class="link"
            >
                ${this.hasAttribute('icon-left') ? `<a-icon-mdx icon-name="${this.getAttribute('icon-left')}" icon-size="24x24" size="1em" rotate="0" class="icon-left"></a-icon-mdx>` : ''}
                <span><slot></slot><span>
                ${this.hasAttribute('icon-right') ? `<a-icon-mdx icon-name="${this.getAttribute('icon-right')}" icon-size="24x24" size="1em" rotate="0" class="icon-right"></a-icon-mdx>` : ''}
            </mdx-link>
        </mdx-component>
    `
  }
}
