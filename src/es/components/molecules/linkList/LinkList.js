// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class LinkList extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
  }

  disconnectedCallback () {}

  shouldRenderCSS () {
    return !this.root.querySelector(
      `:host > style[_css], ${this.tagName} > style[_css]`
    )
  }

  renderCSS () {
    this.css = /* css */ `
        :host ul {
            list-style: var(--list-style);
            margin: var(--margin);
            padding: var(--padding);
            width: var(--width);
        }

        :host li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.625em 0;
            border-top: 0.0625em solid var(--border-color);
        }

        :host li:last-child {
            border-bottom: 0.0625em solid var(--border-color);
        }

        :host li:hover {
            cursor: pointer;
        }

        :host li div {
            display: flex;
            align-items: center;
        }

        :host li span {
            font-size: 1em;
            line-height: 1.25em;
            font-weight: 500;
            color: #262626;
        }

        :host li div span {
            font-size: 0.875em;
            font-weight: 400;
            display: inline-block;
            margin-right: var(--margin-right);
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
        case 'link-list-default-':
            return this.fetchCSS([
                {
                path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
                namespace: false
            }])
        case 'link-list-extended-':
            return this.fetchCSS([{
                path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
                namespace: false,
                replaces: [{
                pattern: '--link-list-default-',
                flags: 'g',
                replacement: '--link-list-extended-'
                }]
            },{
                path: `${this.importMetaUrl}./extended-/extended-.css`, // apply namespace since it is specific and no fallback
                namespace: false
            }])
    }
  }
}
