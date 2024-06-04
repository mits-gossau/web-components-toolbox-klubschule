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
      :host > div {
        background-color: var(--info-list-bg-color, var(--background-color));
        margin: var(--any-content-spacing, var(--content-spacing, unset)) auto;
        width: var(--any-content-width, var(--content-width, 55%));
        margin: auto auto var(--mdx-sys-spacing-fix-m);
        padding: var(--mdx-sys-spacing-fix-m);
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
        margin-inline: 0;
        margin-block: 0;
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

      :host ul li div {
        flex: 1;
      }

      :host ul li span {
        padding-top: 0.2em;
      }

      :host a {
        display: block;
        color: var(--mdx-comp-link-color-default);
        font: var(--mdx-comp-link-font-standalone);
      }

      :host div > div > div > a:last-of-type {
        margin-top: var(--mdx-sys-spacing-flex-large-2xs);
      }

      :host div > div > div > a:first-of-type {
        margin-bottom: var(--mdx-sys-spacing-flex-large-m);
      }

      :host div > div > div > ks-a-heading {
        --h4-margin: var(--mdx-sys-spacing-flex-large-s) 0;
        font: var(--mdx-sys-font-fix-label0);
      }

      :host div > div > div > ks-a-heading + div ~ div {
        display: flex;
        justify-content: space-between;
        margin: 10px 0;
      }

      :host div > div > div > ks-a-heading + div + div {
        margin: var(--mdx-sys-spacing-flex-large-2xs) 0;
        gap: 10px;
      }

      :host div > div > div > ks-a-heading + div ~ div:last-child span {
        display: block;
      }

      :host div > div > div > p {
        margin-block: 0;
      }

      :host div > div > div > span > strong {
        font: var(--mdx-sys-font-fix-label2);
      }

      @media only screen and (max-width: _max-width_) {
        :host > div {
          padding: var(--mdx-sys-spacing-fix-m) var(--mdx-sys-spacing-fix-2xs);
        }
        :host > div > div {
          display: block;
        }
        :host ul {
          width: 100%;
          margin-bottom: var(--mdx-sys-spacing-fix-xs);
        }
        :host div > div > div > ks-a-heading + div ~ div span:first-child {
          max-width: 68.26%;
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
