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
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  shouldRenderHTML () {
    return !this.hasAttribute("css-only") && !this.root.querySelector('.checkout-layout')
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        width: 100%${this.hasAttribute("css-only") ? "" : "  !important"};
        margin: 0${this.hasAttribute("css-only") ? "" : "  !important"};
      }

      :host mdx-login-button {
        display: inline-block;
      }

      :host p.wishlist-copy {
        width: 66%;
        font: var(--mdx-sys-font-flex-large-body2);
        margin-left: 0;
      }

      /* spacing utilities */
      /* responsive spacings */
      :host .margin-bottom-l {
          margin-bottom: var(--mdx-sys-spacing-flex-l);
      }
      :host .margin-bottom-m {
          margin-bottom: var(--mdx-sys-spacing-flex-m);
      }
      :host ul.advantages-list {
        list-style: none !important;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: var(--mdx-sys-spacing-flex-2xs);
      }
      :host ul.advantages-list li {
        display: flex;
        gap: 0.75rem;
        padding: 0;
      }
      :host ul.advantages-list a-icon-mdx {
        display: block;
        color: var(--mdx-sys-color-success-default);
      }

      :host #checkout-booking-body-section .flex-wrapper {
        display: flex !important;
        flex-direction: column;
        gap: var(--mdx-sys-spacing-fix-m);
        margin-top: var(--mdx-sys-spacing-flex-large-m) !important;
        margin-bottom: var(--mdx-sys-spacing-flex-large-l) !important;
      }

      :host .flex-wrapper>p.booking-page {
        --p-margin: 0;
        color: var(--mdx-sys-color-neutral-bold4) !important;
        font: var(--mdx-sys-font-flex-desktop-body-small) !important;
      }
      :host .flex-wrapper>ks-a-heading {
        --h2-margin: 0;
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

      .checkout-form-group {
        margin-bottom: var(--mdx-sys-spacing-flex-l);
      }

      :host ks-m-select + p {
        margin: var(--mdx-sys-spacing-flex-large-xs) 0 !important;
      }

      strong {
        font: var(--mdx-sys-font-fix-label2);
      }

      label {
        color: var(--mdx-comp–inputfield-label-color-default);
        font: var(--mdx-comp-inputfield-font-label);
      }

      @media screen and (max-width: _max-width_) {
        .checkout-layout__aside {
          border-top: 1px solid var(--mdx-sys-color-brand-neutral-300);
          /* Override global spacing */
          padding-bottom: 0 !important;
        }

        :host p.wishlist-copy {
          width: 100%;
        }
      }
    `
  }

  renderHTML () {
    const div = document.createElement('div')
    const bottom = this.root.querySelector('#bottom')
    const sidebar = this.root.querySelector('#sidebar')
    div.innerHTML = /* html */`
      <div class="checkout-layout">
          <slot name="top"></slot>
          <o-grid mode="false" namespace="${sidebar ? 'grid-2columns-content-section-' : '1column-align-center-'}" first-container-vertical first-column-with="66%" with-border id="checkout-layout-grid">
              <section>
                  <div>
                      <slot name="main"></slot>
                  </div>
                  ${sidebar ? /* html */ `
                      <aside class="checkout-layout__aside">
                          <slot name="sidebar"></slot>
                      </aside>
                    ` : ''}
              </section>
          </o-grid>
          ${bottom
            ? /* html */`
              <ks-o-body-section variant="default" mode="false" has-padding>
                <slot name="bottom"></slot>
              </ks-o-body-section>`
            : ''
          }
      </div>
    `
    let top
    if ((top = this.root.querySelector('#top'))) div.querySelector('slot[name=top]')?.replaceWith(top)
    let main
    if ((main = this.root.querySelector('#main'))) div.querySelector('slot[name=main]')?.replaceWith(main)
    if (sidebar) {
      div.querySelector('slot[name=sidebar]')?.replaceWith(sidebar)
    }
    if (bottom) { div.querySelector('slot[name=bottom]')?.replaceWith(bottom) }
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
