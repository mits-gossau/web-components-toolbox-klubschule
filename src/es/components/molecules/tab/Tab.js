// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class Tab extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()

    const selectors = {
      button: 'button',
      buttonActive: 'button.active',
      contentActive: 'div[tab-content-target]#'
    }

    const attributes = {
      tabTarget: 'tab-target'
    };

    const states = {
      active: 'active',
      show: 'show'
    };

    // Show content of default active tab
    this.tabs = this.root.querySelectorAll(selectors.button);
    this.tabActive = this.root.querySelector(selectors.buttonActive);
    this.tabActiveId = this.tabActive.getAttribute(attributes.tabTarget);
    this.contentActive = this.root.querySelector(`${selectors.contentActive}${this.tabActiveId}`);
    this.contentActive.classList.add(states.show);

    // Handle changing active tabs
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.tabActive.classList.remove(states.active);
        this.contentActive.classList.remove(states.show);

        tab.classList.add(states.active);
        this.tabActive = tab;
        this.tabActiveId = tab.getAttribute(attributes.tabTarget);
        this.contentActive = this.root.querySelector(`${selectors.contentActive}${this.tabActiveId}`);
        this.contentActive.classList.add(states.show);
      });
    });
  }

  disconnectedCallback () {
    this.tabs.forEach(tab => {
      tab.removeEventListener('click');
    });
  }

  shouldRenderCSS () {
    return !this.root.querySelector(
      `:host > style[_css], ${this.tagName} > style[_css]`
    )
  }

  renderCSS () {
    this.css = /* css */ `
        :host ul {
          list-style: none;
          display: flex;
          margin: 0;
          padding: 0;
          overflow-x: auto;
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
          border-bottom: 2px solid var(--mdx-base-color-klubschule-blue-600);
        }

        :host div[tab-content-target] {
          display: none;
          padding: 3.375em 0 5em;
        }

        :host div[tab-content-target].show {
          display: block;
        }

        @media only screen and (max-width: _max-width_) {
          :host div[tab-content-target] {
            padding: 3em 0 4em;
          }
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
        case 'tab-default-':
            return this.fetchCSS([
                {
                path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
                namespace: false
            }])
    }
  }
}
