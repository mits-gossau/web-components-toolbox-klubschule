// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/* global CustomEvent */

/**
* @export
* @class CheckoutBookedOffer
* @type {CustomElementConstructor}
*/
export default class CheckoutBoxWrapper extends Shadow() {
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
      :host {
        --font-family-strong: var(--mdx-sys-font-fix-label2-font-family);
        --font-weight-strong: var(--mdx-sys-font-fix-label2-font-weight);
        --table-even-background-color: none;
        --total-width: var(--checkbox-wrapper-total-width, 400px);
        --background-color: var(--mdx-sys-color-neutral-on-default, white);
        --any-display: flex;
        gap: var(--mdx-sys-spacing-fix-m);
      }
      :host .full-width {
        padding: var(--mdx-sys-spacing-flex-large-m) 0 var(--mdx-sys-spacing-flex-large-l);
      }
      :host .full-width > span > a {
        --a-font-size: var(--font-size, 16px);
        margin: var(--mdx-sys-spacing-fix-xs) 0;
      }
      :host .full-width > span + div {
        margin-top: 56px;
      }

      :host .total {
        min-width: var(--total-width);
      }
      :host .total > span,
      :host .total div > span:first-child {
        font: var(--mdx-sys-font-flex-large-headline3);
      }

      :host .total span + div {
        text-align: end;
      }

      :host .total div > span + span {
        color: var(--mdx-sys-color-neutral-bold1);
        font:  var(--mdx-sys-font-fix-body3);
      }
      :host > div,
      :host ks-m-info-list > * {
        background-color: var(--background-color);
        padding: var(--mdx-sys-spacing-fix-m);
        width: 100%;
      }

      :host(.ks-o-body-section__last-child) > div {
        margin-bottom: 0;
      }

      :host(.ks-o-body-section__last-child) .full-width ks-a-checkbox {
        width: 66.66%;
      }

      :host .flex {
        display: flex;
        justify-content: space-between;
        margin: 10px 0;
        margin-bottom: 1.5rem;
      }

      :host .flex#agbBox {
        margin-bottom: 1.5rem;
      }
      
      :host div:not(.flex) span {
        display: block;
      }

      :host .margin-top-m {
        margin-top: var(--mdx-sys-spacing-flex-large-s);
      }

      :host .icon-text-wrapper {
        gap: var(--mdx-sys-spacing-fix-xs);
        justify-content: start;
      }

      :host .info-wrapper {
        margin: var(--mdx-sys-spacing-flex-large-2xs) 0;
      }
      :host .info-wrapper table,
      :host .info-wrapper table tr,
      :host .info-wrapper table tr td {
        --table-padding: 0 !important;
        width: 100%;
        margin: 0;
        padding: 0;
      }
      :host .info-wrapper table tr td:first-child {
        min-width: 175px;
        width: auto;
        padding-right: var(--mdx-sys-spacing-fix-xs);
      }
      @media only screen and (max-width: _max-width_) {
        :host .info-wrapper table tr td:first-child {
          min-width: 120px;
        }
      }

      :host ks-a-heading[tag="h3"] {
        --h3-margin: var(--mdx-sys-spacing-flex-s) 0;
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
      :host a.spacing-top {
        margin-top: var(--mdx-sys-spacing-flex-large-2xs);
      }
      :host a.spacing-y {
        margin-bottom: var(--mdx-sys-spacing-flex-large-m);
        margin-top: var(--mdx-sys-spacing-flex-large-2xs);
      }

      :host ks-a-checkbox label {
        display: block;
      }

      :host ks-a-checkbox label a {
        font-size: 1em !important;
        line-height: 1.25em !important;
        font-weight: 400 !important;
      }

      :host .submit-wrapper {
        text-align: end;
      }

      :host .spacing-top:has(a),
      :host a.spacing-top {
        width: fit-content;
      }

      @media only screen and (max-width: _max-width_) {
        :host > div,
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
        :host .full-width > .flex {
          display: block;
        }
        :host .total {
          min-width: unset;
        }

        :host .full-width > .flex > .flex.total {
          margin-top: 56px;
        }
        :host .full-width > span + div {
          margin-top: 0;
        }

        :host(.ks-o-body-section__last-child) .full-width ks-a-checkbox {
          width: 100%;
        }

        :host .submit-wrapper {
          margin-top: var(--mdx-sys-spacing-fix-m);
        }
      }
    `
  }
}
