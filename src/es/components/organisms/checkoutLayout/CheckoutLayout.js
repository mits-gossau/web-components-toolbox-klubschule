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

      @media screen and (max-width: _max-width_) {
        .checkout-layout__aside {
          border-top: 1px solid var(--mdx-sys-color-brand-neutral-300);
        }
      }
    `
  }

  renderHTML () {
    this.html = /* html */`
        <div class="checkout-layout">
            <slot name="top"></slot>
            <o-grid mode="false" namespace="grid-2columns-content-section-" first-container-vertical first-column-with="66%" with-border>
              <section>
                <div>
                    <slot name="main"></slot>
                </div>
                <aside class="checkout-layout__aside">
                    <slot name="sidebar"></slot>
                </aside>
              </section>
            </o-grid>
            <ks-o-body-section variant="default" mode="false" has-background>
                <slot name="bottom"></slot>
            </ks-o-body-section>
        </div>
      `

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
    ])
  }
}
