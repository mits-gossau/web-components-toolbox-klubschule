// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class Tab extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    // Add click event to tabs
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

    this.tabs = this.root.querySelectorAll('button')
    this.tabActive = this.root.querySelector('button.active')
    this.tabActiveId = this.tabActive.getAttribute('tab-target')
    this.contents = this.root.querySelector(`div[tab-content-target]`)
    this.contentActive = this.root.querySelector(`div[tab-content-target]#${this.tabActiveId}`)
    this.contentActive.classList.add('show')

    this.tabs.forEach(tab => {
      tab.addEventListener('click', this.clickEventListener)
    })

    // Get url parameter and set active tab, if any, else set first tab active
    const urlParams = new URLSearchParams(window.location.search)
    const tabParam = urlParams.get('tab')

    if (tabParam) {
      this.tabs.forEach((tab, index) => {
        tab.classList.remove('active')
        const dataTab = tab.getAttribute('tab-target') ? tab.getAttribute('tab-target').toString() : ''

        if (tabParam === dataTab) {
          tab.classList.add('active')
          this.contentActive.classList.remove('show')
          this.contentActive = this.root.querySelector(`div[tab-content-target]#${dataTab}`)
          this.contentActive.classList.add('show')
        }
      })
    }

    // Set first tab active by default
    if (!tabParam && this.tabs.length && this.contents.length) {
      this.tabs[0].classList.add('active')
      this.contents[0].classList.add('show')
    }
  }

  disconnectedCallback () {
    this.tabs.forEach(tab => {
      tab.removeEventListener('click', this.clickEventListener)
    })
  }

  shouldRenderCSS () {
    return !this.root.querySelector(
      `${this.cssSelector} > style[_css]`
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
          font-family: var(--mdx-comp-tabs-font-label-default-font-family, inherit);
          font-size: var(--mdx-comp-tabs-font-label-default-font-size, 1.125em);
          line-height: 1.25em;
          font-weight: var(--mdx-comp-tabs-font-label-default-font-weight, 500);
          cursor: pointer;
          padding: 1em 0;
          color: var(--mdx-comp-tabs-label-color-default);
          white-space: nowrap;
        }

        :host ul li button.active {
          color: var(--mdx-sys-color-primary-default);
          border-bottom: 0.125em solid var(--mdx-sys-color-primary-default);
        }

        :host div[tab-content-target] {
          display: none;
          padding: 3.375em 0 5em;
        }

        :host div[tab-content-target].show {
          display: block;
          background-color: var(--mdx-sys-color-accent-6-subtle1);
        }

        @media only screen and (max-width: _max-width_) {
          :host div[tab-content-target] {
            padding: 3em 0 4em;
          }
        }
    `
  }
}
