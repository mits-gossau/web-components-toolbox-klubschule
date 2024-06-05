// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class CheckoutLayout
* @type {CustomElementConstructor}
*/
export default class CheckoutLayout extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, mode: 'false', ...options }, ...args)
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
    return !this.root.querySelector('.checkout-layout')
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

      /* style back link */
      #top > ks-a-back-link {
        --back-link-color: var(--mdx-sys-color-primary-default);
        --color: var(--mdx-sys-color-primary-default);
        --a-margin: 0;

        display: block !important;
        padding: var(--mdx-sys-spacing-flex-2xs) var(--mdx-sys-spacing-flex-xs) !important;
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
    const div = document.createElement('div')
    div.innerHTML = /* html */`
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
    let top
    if ((top = this.root.querySelector('#top'))) div.querySelector('slot[name=top]')?.replaceWith(top)
    let main
    if ((main = this.root.querySelector('#main'))) div.querySelector('slot[name=main]')?.replaceWith(main)
    let sidebar
    if ((sidebar = this.root.querySelector('#sidebar'))) div.querySelector('slot[name=sidebar]')?.replaceWith(sidebar)
    let bottom
    if ((bottom = this.root.querySelector('#bottom'))) div.querySelector('slot[name=bottom]')?.replaceWith(bottom)
    this.html = div.children
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
