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
            margin-left: 1.25rem;
            margin-bottom: 2rem;
        }
        :host > ul > li {
            font-size: 0.8888888888rem;
            padding: 0.5rem 0;
        }
        :host > ul > li strong {
            font-family: var(--font-family-secondary);
            font-weight: 500;
        }
        :host > ul > li::before {
            content: url("data:image/svg+xml,%3Csvg%20width=%2217%22%20height=%2217%22%20viewBox=%220%200%2017%2017%22%20fill=%22none%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath%20d=%22M3.83398%208.50041H13.1673M13.1673%208.50041L8.50065%203.83374M13.1673%208.50041L8.50065%2013.1671%22%20stroke=%22%23333333%22%20stroke-width=%221.5%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22/%3E%3C/svg%3E");
            margin-right: 0.5rem;
            position: relative;
            top: 2px;
        }
        :host > ul > li.icon-search::before {
            content: url("data:image/svg+xml,%3Csvg%20width=%2217%22%20height=%2217%22%20viewBox=%220%200%2017%2017%22%20fill=%22none%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath%20d=%22M14.5%2014.5002L11.6%2011.6002M13.1667%207.83358C13.1667%2010.7791%2010.7789%2013.1669%207.83333%2013.1669C4.88781%2013.1669%202.5%2010.7791%202.5%207.83358C2.5%204.88806%204.88781%202.50024%207.83333%202.50024C10.7789%202.50024%2013.1667%204.88806%2013.1667%207.83358Z%22%20stroke=%22%23333333%22%20stroke-width=%221.5%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22/%3E%3C/svg%3E");
        }
        @media only screen and (max-width: _max-width_) {
            :host {}
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
          },
        ])
      default:
        return
    }
  }

  renderHTML () {
    this.html = /* html */ `
        <ul></ul>
    `

    Array.from(this.root.children).forEach(node => {
      this.list.appendChild(node)
    })
  }

  get list () {
    return this.root.querySelector('ul')
  }
}
