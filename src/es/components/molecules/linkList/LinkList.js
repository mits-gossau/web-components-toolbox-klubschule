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
        :host {
          font-size: var(--font-size, 1em);
        }

        :host ul {
            list-style: var(--list-style);
            margin: var(--margin);
            padding: var(--padding);
            width: var(--width);
        }

        :host li a {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.625em 0;
            border-top: 0.0625em solid var(--border-color);
        }

        :host li a:hover span {
          color: var(--color-hover);
        }

        :host li:last-child a {
            border-bottom: 0.0625em solid var(--border-color);
        }

        :host([no-border]) li a {
          border: 0;
        }

        :host([no-border-top]) li a {
          border-top: 0;
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
            flex: 1;
        }

        :host li div:has(> a-icon-mdx) span, :host li div span + span {
            font-size: 0.8888em;
            font-weight: 400;
            display: inline-block;
            margin-right: var(--margin-right);
        }

        :host li a > div:has(> span + span) {
          flex-wrap: wrap;
        }

        :host li a > div:has(> span + span) > * {
          flex-basis: 100%;
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
      case 'link-list-download-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false,
          replaces: [{
            pattern: '--link-list-default-',
            flags: 'g',
            replacement: '--link-list-download-'
          }]
        }, {
          path: `${this.importMetaUrl}./download-/download-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }])
    }
  }
}
