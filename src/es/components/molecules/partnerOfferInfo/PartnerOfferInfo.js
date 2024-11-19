// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class PartnerOfferInfo
* @type {CustomElementConstructor}
*/
export default class PartnerOfferInfo extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
  }

  disconnectedCallback () {}

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
   * @returns Promise<void>
   */
  renderCSS () {
    this.css = /* css */`
      :host > p {
        display: flex;
        gap: 1em;
        align-content: flex-end;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: flex-end;

        font: var(--mdx-sys-font-flex-large-body3);
        text-align: var(--p-text-align, start);
        text-transform: var(--p-text-transform, none);
        margin: var(--p-margin, 0 auto var(--content-spacing));
      }
      :host a {
        display: inline-block;
        margin: 0;
      }
      :host a > img {
        height: var(--partner-offer-info-logo-height, 40px);
        max-height: var(--partner-offer-info-logo-height, 40px);
        width: auto;
      }
      @media only screen and (max-width: _max-width_) {
        :host > p {
          gap: 0;
          align-content: flex-start;
          flex-direction: column;
          flex-wrap: wrap;
          align-items: flex-start;
        }
      }
    `
  }
}
