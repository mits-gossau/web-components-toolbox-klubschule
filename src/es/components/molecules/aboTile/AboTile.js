// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class AboTile
* @type {CustomElementConstructor}
*/
export default class AboTile extends Shadow() {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
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
    return !this.badge
  }

  /**
   * renders the css
   */
  renderCSS() {
    this.css = /* css */`
      :host {
        display: flex;
        flex-direction: column;

        background-color: var(--mdx-base-color-grey-0);
        border: 0.063rem solid var(--mdx-base-color-grey-700);
        padding: 1.5rem;
        color: var(--mdx-base-color-grey-975);
      }
      :host ks-m-event-detail+div {
        margin-top: var(--mdx-sys-spacing-fix-m);
        display: flex;
        gap: var(--mdx-sys-spacing-fix-s);
      }
    `
  }


  /**
    * renderHTML
    * @returns {Promise<void>} The function `renderHTML` returns a Promise.
  */
  renderHTML() {
    this.html = /* HTML */ `
      <ks-m-event-detail
        data="${this.dataStringified}"
      >
      </ks-m-event-detail>
      <div>
        <ks-m-buttons data-buttons='${JSON.stringify(this.dataAsJson.buttons)}'></ks-m-buttons>
      <div>
    `
    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../molecules/eventDetail/EventDetail.js`,
        name: 'ks-m-event-detail'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      },
      {
        path: `${this.importMetaUrl}../../molecules/buttons/Buttons.js`,
        name: 'ks-m-buttons'
      }
    ])
  }

  get dataStringified() {
    return this.getAttribute('data')
  }

  get dataAsJson() {
    return AboTile.parseAttribute(this.dataStringified)
  }
}
