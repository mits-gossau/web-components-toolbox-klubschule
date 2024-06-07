// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/* global CustomEvent */

/**
* @export
* @class CheckoutBookedOffer
* @type {CustomElementConstructor}
*/
export default class CheckoutBoxWrapper extends Shadow()  {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, mode: 'false', ...options }, ...args)
  }

  connectedCallback() {
    if (this.shouldRenderCSS()) this.renderCSS()
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
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        display: flex;
        gap: var(--mdx-sys-spacing-fix-m);
      }
      :host > *,
      :host ks-m-info-list > * {
        background-color: var(--info-list-bg-color, var(--background-color));
        margin-bottom: var(--mdx-sys-spacing-fix-m);
        padding: var(--mdx-sys-spacing-fix-m);
        width: 100%;
      }

      :host .flex {
        display: flex;
        justify-content: space-between;
        margin: 10px 0;
      }      
      
      :host div:not(.flex) span {
        display: block;
      }

      :host .margin-top-m {
        margin-top: var(--mdx-sys-spacing-flex-large-s);
      }

      :host .icon-text-wrapper {
        gap: var(--mdx-sys-spacing-fix-xs);
      }

      :host .info-wrapper {
        margin: var(--mdx-sys-spacing-flex-large-2xs) 0;
        gap: 10px;
      }

      :host ks-a-heading[tag="h3"] {
        --h3-margin: var(--mdx-sys-spacing-flex-large-s) 0;
        --h3-font-family: var(--mdx-sys-font-fix-label0-font-family);
        --h3-font-weight: var(--mdx-sys-font-fix-label0-font-weight);
        --h3-line-height: var(--mdx-sys-font-fix-label0-line-height);
        --h3-font-size: var(--mdx-sys-font-fix-label0-font-size);
      }

      :host span > strong,
      :host p > strong {
        --font-family-strong: var(--mdx-sys-font-fix-label2-font-family);
        --font-weight-strong: var(--mdx-sys-font-fix-label2-font-weight);
      }

      :host a {
        --a-display: block;
        --a-color: var(--mdx-comp-link-color-default);
        --a-font-weight: var(--mdx-comp-link-font-standalone-font-weight);
        --a-font-size: var(--mdx-comp-link-font-standalone-font-size);
        --a-margin: 0;
      }

      :host a:last-of-type {
        margin-top: var(--mdx-sys-spacing-flex-large-2xs);
      }

      :host a:first-of-type {
        margin-bottom: var(--mdx-sys-spacing-flex-large-m);
        margin-top: var(--mdx-sys-spacing-flex-large-2xs);
      }

      @media only screen and (max-width: _max-width_) {
        :host > *,
        :host ks-m-info-list > * {
          padding: var(--mdx-sys-spacing-fix-m) var(--mdx-sys-spacing-fix-2xs);
        }
        :host {
          gap: 0;
          flex-direction: column;
        }
        :host .flex > span:first-child {
          max-width: 68.26%;
        }
      }
    `
  }
}
