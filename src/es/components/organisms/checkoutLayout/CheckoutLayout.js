// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class CheckoutLayout
* @type {CustomElementConstructor}
*/
export default class CheckoutLayout extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  shouldRenderHTML () {
    return !this.root.querySelector('div')
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        width: 100% !important;
        margin: 0 !important;
      }
    `
  }

  renderHTML () {
    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/organisms/grid/Grid.js`,
        name: 'o-grid'
      },
      {
        path: `${this.importMetaUrl}../../atoms/heading/Heading.js`,
        name: 'ks-a-heading'
      },
      {
        path: `${this.importMetaUrl}../../organisms/bodySection/BodySection.js`,
        name: 'ks-o-body-section'
      }
    ]).then(() => {
      const template = document.createElement('template')

      template.innerHTML = /* html */`
        <div class="checkout-layout">
            <slot name="top"></slot>
            <o-grid mode="false" namespace="grid-2columns-content-section-" first-container-vertical first-column-with="66%" with-border width="100%" switch-aside-order-mobile>
                <div>
                    <slot name="main"></slot>
                </div>
                <div>
                    <slot name="sidebar"></slot>
                </div>
            </o-grid>
            <ks-o-body-section variant="default" mode="false" has-background>
                <slot name="bottom"></slot>
            </ks-o-body-section>
        </div>
      `

      this.root.appendChild(template.content.cloneNode(true))
    })
  }
}
