// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class AutoCompleteList extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.autoCompleteListener = event => this.renderHTML(event.detail.fetch)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
    document.body.addEventListener('auto-complete', this.autoCompleteListener)
  }

  disconnectedCallback () {
    document.body.removeEventListener('auto-complete', this.autoCompleteListener)
  }

  shouldRenderCSS () {
    return !this.root.querySelector(
      `:host > style[_css], ${this.tagName} > style[_css]`
    )
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML () {
    return !this.list
  }

  renderCSS () {
    this.css = /* css */ `
        :host div {
          display: flex;
        }

        :host ul {
          list-style: none;
          padding: 0;
          margin: 0;
          width: 50%;
        }

        :host ul li {
          display: flex;
          align-items: center;
        }

        :host ul li:hover {
          cursor: pointer;
          color: #0053A6; 
        }

        :host ul li + li {
          margin-top: 1em;
        }

        :host a-icon-mdx {
          --icon-mdx-ks-color-hover: #333333;
        }

        :host a-icon-mdx + span {
          margin-left: 1em;
        }

        :host span {
          font-size: 1em;
          line-height: 1.25em;
        }

        :host .content {
          display: flex;
          flex-direction: column;
          width: 50%;
        }

        :host .heading {
          font-size: 0.875em;
          line-height: 1em;
          font-weight: 500;
          margin-bottom: 1em;
        }

        :host .list {
          width: 100%;
        }

        :host .list li:hover .text {
          color: #333333;
        }

        :host .list li div {
          display: flex;
          flex-direction: column;
        }

        :host a-picture + div {
          margin-left: 1em;
        }

        :host .title {
          font-size: 1em;
          line-height: 1.125em;
          font-weight: 500;
        }

        :host .text {
          font-size: 1em;
          line-height: 1.25em;
        }

        :host .title + .text {
          margin-top: 0.25em;
        }

        :host a {
          display: flex;
          align-items: center;
          text-decoration: none;
          font-size: 1.125em;
          line-height: 1.25em;
          font-weight: 500;
          color: #0053A6;
        }

        :host a a-icon-mdx {
          margin-left: 0.25em;
          color: #0053A6;
        }

        :host .list + a {
          margin-top: 1em;
        }

        @media only screen and (max-width: _max-width_) {
          :host div {
            flex-direction: column;
          }

          :host ul,
          :host .content {
            width: 100%;
          }

          :host ul + .content {
            margin-top: 3em;
          }
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

  /**
   *
   *
   * @param {Promise<import("../../controllers/autoComplete/AutoComplete.js").fetchAutoCompleteEventDetail>|null} [fetch=null]
   * @return {void}
   */
  renderHTML (fetch = null) {
    this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ]).then(children => {
      if (fetch) {
        fetch.then(
          (/**
            * @type {{total: number,success: boolean, searchText: string, items: import("../../controllers/autoComplete/AutoComplete.js").Item[], cms: []}}
            */
            { total, success, searchText, items, cms }) => {
            if (total === 0) return
            this.list.innerHTML = items.reduce((acc, curr) => `${acc}<li><a-icon-mdx icon-name="${curr.typ === 1
              ? 'Search'
              : curr.typ === 2
                ? 'ArrowRight'
                : 'Location'}" size="1em"></a-icon-mdx> ${curr.term}</li>`, '')
          })
      } else {
        this.html = /* html */ `
            <ul></ul>
        `
        Array.from(this.root.children).forEach(node => {
          if (node.tagName === 'LI') this.list.appendChild(node)
        })
      }
    })
  }

  get list () {
    return this.root.querySelector('ul')
  }
}
