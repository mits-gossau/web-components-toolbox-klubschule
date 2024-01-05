// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class AutoCompleteList extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    this.renderHTML()
  }

  disconnectedCallback () {}

  shouldRenderCSS () {
    return !this.root.querySelector(
      `:host > style[_css], ${this.tagName} > style[_css]`
    )
  }

  renderCSS () {
    this.css = /* css */ `
        :host > ul {
            list-style: none;
            padding: 0;
            margin: 0;
            margin-top: 1.3333333333rem;
            margin-bottom: 2rem;
        }
        :host > ul > li {
            color: var(--color);
            cursor: pointer;
            font-size: 0.8888888888rem;
            padding: 0.4em 1em;
        }
        :host > ul > li:hover {
            background-color: var(--color-hover);
            color: var(--background-color);
        }
        :host > ul > li strong {
            font-family: var(--font-family-secondary);
            font-weight: 500;
        }
        :host > ul > li > a-icon-mdx {
            color: inherit;
            display: inline-block;
            margin-right: 0.5rem;
            position: relative;
            top: 2px;            
        }
        :host > ul > li > a-icon-mdx::part(svg) {
          transition: none;
          will-change: unset;
        }
        
    `
    return this.fetchTemplate()
  }

  fetchTemplate () {
    switch (this.getAttribute('namespace')) {
      case 'auto-complete-list-default-':
        return this.fetchCSS([
          {
            path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
            namespace: false
          }
        ])
      default:
    }
  }

  renderHTML () {
    this.html = /* html */ `
        <ul></ul>
    `

    Array.from(this.root.children).forEach(node => {
      if (node.tagName !== 'UL') this.list.appendChild(node)
    })
  }

  get list () {
    return this.root.querySelector('ul')
  }
}
