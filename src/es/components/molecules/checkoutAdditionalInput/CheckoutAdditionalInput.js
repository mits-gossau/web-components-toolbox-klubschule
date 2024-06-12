// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class CheckoutBookedOffer
* @type {CustomElementConstructor}
*/
export default class CheckoutAdditionalInput extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, mode: 'false', ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
  }

  disconnectedCallback () {
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host > div {
        background-color: var(--info-list-bg-color, var(--background-color));
        margin: var(--any-content-spacing, var(--content-spacing, unset)) auto;
        width: var(--any-content-width, var(--content-width, 55%));
        margin: auto auto var(--mdx-sys-spacing-fix-m);
        padding: var(--mdx-sys-spacing-fix-m);
      }
      @media only screen and (max-width: _max-width_) {
        :host > div {
          padding: var(--mdx-sys-spacing-fix-m) var(--mdx-sys-spacing-fix-2xs);
        }
      }
    `
  }
}
