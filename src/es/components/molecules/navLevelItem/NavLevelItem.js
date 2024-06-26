// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class NavLevelItem extends Shadow() {
  constructor (options = {}, ...args) {
    super({ keepCloneOutsideShadowRoot: true, importMetaUrl: import.meta.url, ...options }, ...args)

    this.clickListener = event => {
      if (this.getAttribute('request-event-name')) {
        event.preventDefault()
        this.dispatchEvent(new CustomEvent(this.getAttribute('request-event-name'), {
          detail: {
            wrapper: {
              filterItem: this.filterItem
            },
            target: {
              checked: this.getAttribute('namespace') !== 'nav-level-item-active-',
              label: this.text.textContent,
              filterId: this.getAttribute('filter-id')
            }
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }))
      }
    }
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    this.addEventListener('click', this.clickListener)
  }

  disconnectedCallback () {
    this.removeEventListener('click', this.clickListener)
  }

  shouldRenderCSS () {
    return !this.root.querySelector(
      `:host > style[_css], ${this.tagName} > style[_css]`
    )
  }

  renderCSS () {
    this.css = /* css */ `
        :host {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--padding, 0.75em);
          cursor: pointer;
          background-color: var(--background-color);
          height: var(--height, auto);
          margin: var(--margin, 0);
          transition: background-color 0.3s ease-in-out;
        }

        :host(:hover) {
          background-color: var(--hover-background-color, #E0F0FF);
        }

        :host(:hover) span {
          color: var(--hover-color,  #0053A6);
        }

        :host .wrap {
          display: flex;
          flex-direction: column;
        }

        :host span {
          display: inline-block;
          color: #262626;
          color: var(--color);
          font-size: var(--font-size, 1.125em);
          line-height: 1.125em;
          font-weight: var(--font-weight, 400);
          transition: color 0.3s ease-in-out;
        }

        :host .additional {
          font-size: 0.75em;
          line-height: 1em;
          margin-top: 0.25em;
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
      case 'nav-level-item-default-':
        return this.fetchCSS([
          {
            path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
            namespace: false
          }])
      case 'nav-level-item-active-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false,
          replaces: [{
            pattern: '--nav-level-item-default-',
            flags: 'g',
            replacement: '--nav-level-item-active-'
          }]
        }, {
          path: `${this.importMetaUrl}./active-/active-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }])
    }
  }

  get text () {
    return this.root.querySelector('.text')
  }
}
