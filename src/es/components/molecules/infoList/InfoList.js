// @ts-check
import CheckoutBookedOffer from '../checkoutBookedOffer/CheckoutBookedOffer.js'

/* global CustomEvent */

/**
* @export
* @class CheckoutBookedOffer
* @type {CustomElementConstructor}
*/
export default class InfoList extends CheckoutBookedOffer {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, mode: 'false', ...options }, ...args)
  }

  connectedCallback() {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
  }

  disconnectedCallback() {
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS() {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML() {
    return !this.root.querySelector(".js-status > *")
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        --ul-margin: 0;
      }
      :host > div > div {
        display: flex;
        gap: var(--mdx-sys-spacing-fix-m);
      }
      :host ul {
        width: 33%;
        list-style: none !important;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-left: 0 !important;
      }

      :host h3 {
        font: var(--mdx-sys-font-fix-label1);
      }

      :host hr {
        height: 1px;
        border: 0;
        background: var(--mdx-sys-color-neutral-subtle3);
        margin-top: var(--mdx-sys-spacing-flex-large-s);
        margin-bottom: var(--mdx-sys-spacing-flex-large-s);
      }

      :host ul li {
        display: flex;
        flex-direction: row;
        gap: .75rem;
        margin-bottom: var(--mdx-sys-spacing-fix-s);
      }

      :host ul li img {
        height: 1.5rem;
        width: 1.5rem;
      }

      :host ul li span {
        padding-top: 0.2em;
      }

      :host .flex:last-child > div > span:first-child {
        display: block;
      }

      :host .total > span,
      :host .total div > span:first-child {
        font: var(--mdx-sys-font-flex-large-headline3);
      }

      :host .total div > span + span {
        color: var(--mdx-sys-color-neutral-bold1);
        font:  var(--mdx-sys-font-fix-body3);
      }

      @media only screen and (max-width: _max-width_) {
        :host > div > div {
          display: block;
        }
        :host ul {
          width: 100%;
          margin-bottom: var(--mdx-sys-spacing-fix-xs);
        }
      }
    `
  }


  /**
   * Render HTML
   * @returns Promise<void>
   */
  renderHTML() {
    this.root.querySelector(".js-status").innerHTML = /* html */ `
      <img src="${this.statusData.iconPath}" />
      <span>${this.statusData.label}</span>
    `
  }
}
