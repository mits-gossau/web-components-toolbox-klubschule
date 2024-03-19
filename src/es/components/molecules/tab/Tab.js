// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class Tab extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.clickEventListener = event => {
      this.tabActive.classList.remove('active')
      this.contentActive.classList.remove('show')

      event.target.classList.add('active')
      this.tabActive = event.target
      this.tabActiveId = event.target.getAttribute('tab-target')
      this.contentActive = this.root.querySelector(`div[tab-content-target]#${this.tabActiveId}`)
      this.contentActive.classList.add('show')
    }
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()

    // Show content of default active tab
    this.tabs = this.root.querySelectorAll('button')
    this.tabActive = this.root.querySelector('button.active')
    this.tabActiveId = this.tabActive.getAttribute('tab-target')
    this.contentActive = this.root.querySelector(`div[tab-content-target]#${this.tabActiveId}`)
    this.contentActive.classList.add('show')

    // Handle changing active tabs
    this.tabs.forEach(tab => {
      tab.addEventListener('click', this.clickEventListener)
    })
  }

  disconnectedCallback () {
    this.tabs.forEach(tab => {
      tab.removeEventListener('click', this.clickEventListener)
    })
  }

  shouldRenderCSS () {
    return !this.root.querySelector(
      `:host > style[_css], ${this.tagName} > style[_css]`
    )
  }

  renderCSS () {
    this.css = /* css */ `
        :host {
          --any-content-width: 100%;
          --any-content-width-mobile: 100%;
        }

        :host ul {
          list-style: none;
          display: flex;
          margin: 0;
          padding: 0;
          overflow-x: auto;
        }

        :host ul.tab-search-result {
          width: var(--body-section-default-width);
          margin: 0 auto;
        }

        :host ul li + li {
          margin-left: 1.5em;
        }

        :host ul li button {
          background-color: transparent;
          border: none;
          font-size: 1.125em;
          line-height: 1.25em;
          font-weight: 500;
          cursor: pointer;
          padding: 1em 0;
        }

        :host ul li button.active {
          color: var(--mdx-base-color-klubschule-blue-600);
          border-bottom: 0.125em solid var(--mdx-base-color-klubschule-blue-600);
        }

        :host div[tab-content-target] {
          display: none;
          padding: 3.375em 0 5em;
        }

        :host div[tab-content-target].show {
          display: block;
          background-color: var(--mdx-base-color-klubschule-creme-400);
        }

        @media only screen and (max-width: _max-width_) {
          :host div[tab-content-target] {
            padding: 3em 0 4em;
          }
        }
    `
  }
}
