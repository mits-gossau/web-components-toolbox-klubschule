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
    if (this.shouldRenderHTML()) {
      new Promise(resolve => {
        this.dispatchEvent(new CustomEvent('request-event-detail', {
          detail: {
            resolve,
            language: this.dataAsJson.language,
            typ: this.dataAsJson.typ,
            id: this.dataAsJson.id,
            center_id: this.dataAsJson.center_id
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }))
      }).then((data) => {
        this.renderHTML(data)
      })
    }
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
    return !this.root.querySelector('ks-m-event-detail')
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

  get dataStringified() {
    return this.getAttribute('data')
  }

  get dataAsJson() {
    return AboTile.parseAttribute(this.dataStringified)
  }

  get details() {
    return this.root.querySelector("#aboDetails")
  }

  /**
  * renderHTML
  * @param {any} data - An array of course fetch objects.
  * @returns {Promise<void>} The function `renderHTML` returns a Promise.
  */
  renderHTML(data) {
    this.html = ''
    this.html = /* html */ `
      <ks-m-event-detail
        data='${JSON.stringify(data)}'
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
}
