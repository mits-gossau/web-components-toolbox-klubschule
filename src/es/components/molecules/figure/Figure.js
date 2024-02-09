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
    // Wrap children in a figure
    this.root.innerHTML = /* HTML */`
        <figure>
            ${this.root.innerHTML}
        </figure>
    `;
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
        --copy-typography: var(--mdx-sys-font-fix-body1);
        --copy-spacing: var(--mdx-sys-spacing-fix-2xs);

        width: 100%;
      }

      :host,
      :host > *:not(style) {
        display: block;
      }

      :host figure {
        margin: 0;
      }

      /* line before caption */
      :host figcaption::before {
        content: "";
        display: block;
        width: var(--divider-width);
        height: var(--divider-height);
        background-color: var(--divider-color);
        margin: var(--wrapper-inner-spacing) 0 var(--copy-spacing);
      }
      :host figcaption {
        font: var(--copy-typography) !important;
        margin: var(--copy-spacing) 0 0 !important;
      }
      :host([open]) figcaption {
        color: white;
      }

      @media only screen and (max-width: _max-width_) {
        :host figcaption::before {
          width: calc(var(--divider-width) - var(--divider-height));
        }
        :host figcaption {
            padding: 0 var(--mdx-sys-spacing-fix-2xs);
          }
      }

    `
  }
}
