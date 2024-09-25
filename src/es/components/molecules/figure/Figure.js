// @ts-check

/* global HTMLElement */

import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class KsFigure
* @type {CustomElementConstructor}
*/
export default class KsFigure extends Shadow(HTMLElement) {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    super.connectedCallback()
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector(':host > style[_css]')
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML () {
    return !this.root.querySelector('figure')
  }

  /**
   * renders the html
   *
   * @return {void}
   */
  renderHTML () {
    // take an existing figure or create one
    this.figure = this.root.querySelector('figure') || document.createElement('figure')

    // Wrap children in a figure
    Array.from(this.root.children).forEach(node => {
      if (node.tagName !== 'STYLE' && node.tagName !== 'FIGURE') this.figure.appendChild(node)
    })

    if (!this.root.contains(this.figure)) {
      // append figure element to html
      this.html = this.figure
    }
  }

  /**
   * renders the css
   *
   * @return {Promise<void>}
   */
  renderCSS () {
    this.css = /* css */ `
      :host {
        --wrapper-inner-spacing: var(--mdx-sys-spacing-fix-s);
        --divider-color: var(--mdx-sys-color-accent-1-default);
        --divider-width: var(--mdx-sys-sizing-fix-3xl);
        --divider-height: var(--mdx-sys-sizing-fix-2xs);
        --copy-typography: var(--mdx-sys-font-flex-large-custom1);
        --copy-typography-mobile: var(--mdx-sys-font-flex-small-custom1);
        --copy-spacing: var(--mdx-sys-spacing-fix-2xs);

        width: 100%;
      }

      :host,
      :host > *:not(style) {
        display: block;
      }

      :host figure {
        margin: 0;
        width: 100%;
      }

      /* line before caption */
      :host figcaption::before {
        content: "";
        display: ${this.hasAttribute('with-line') ? 'block' : 'none'};
        width: var(--divider-width);
        height: var(--divider-height);
        background-color: var(--divider-color);
        margin: 0 0 var(--wrapper-inner-spacing);
      }
      :host figcaption {
        font: var(--mdx-sys-font-flex-large-custom1);
        margin: var(--mdx-sys-spacing-fix-s) 0 0;
      }
      :host([open]) figcaption {
        color: white;
      }

      :host([brand=ibaw]) figcaption::before {
        background-color: transparent;
        width: 1.3575em;
        height: 1.625em;
        background-size: contain;
        background-image: var(--ibaw-title-brand-shape);
        background-repeat: no-repeat;
      }

      :host([brand=ksos]) figcaption::before {
        background: #495449; /* replace with design system token once available */
      }

      @media only screen and (max-width: _max-width_) {
        /* pulling the picture slightly (8px) out of the container on mobile with negative margin to match the design */
        :host a-picture {
          display: block;
        }
        :host figcaption {
          font: var(--mdx--sys-font-flex-small-custom1);
          margin: var(--mdx-sys-spacing-fix-s) 0 0;
          width: var(--any-content-width-mobile, var(--content-width-mobile, calc(100% - var(--content-spacing-mobile, var(--content-spacing)) * 2)));
        }
        :host figcaption::before {
          width: calc(var(--divider-width) - var(--divider-height));
        }
      }

    `
  }
}

