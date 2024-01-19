// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class NavLevelItem extends Shadow() {
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
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75em;
          cursor: pointer;
        }

        :host(:hover) span {
          color: #0053A6;
        }

        :host .wrap {
          display: flex;
          flex-direction: column;
        }

        :host span {
          display: inline-block;
          color: #262626;
          font-size: 1.125em;
          line-height: 1.125em;
          font-weight: 400;
          transition: color 0.3s ease-in-out;
        }

        :host .additional {
          font-size: 0.75em;
          line-height: 1em;
          margin-top: 0.25em;
        }
    `
  }
}
