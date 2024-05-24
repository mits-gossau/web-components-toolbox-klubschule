// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class CheckoutInsurance extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()

    document.addEventListener('checkout-configuration', (customEvent) => {
      // @ts-ignore
      console.log(customEvent.detail?.fetch)
      // todo update price according
    })

    // Inside Click listener

    this.dispatchEvent(new CustomEvent('request-checkout-configuration', {
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  disconnectedCallback () {}

  shouldRenderCSS () {
    return !this.root.querySelector(
      `:host > style[_css], ${this.tagName} > style[_css]`
    )
  }

  renderCSS () {
    this.css = /* css */ `
        :host {
          display: block;
          padding-bottom: var(--mdx-sys-spacing-flex-large-l);
        }

        :host h2 {
          color: var(--mdx-sys-color-neutral-bold4);
          font: var(--mdx-sys-font-flex-large-headline1);
          padding-bottom: var(--mdx-sys-spacing-flex-large-s);
          margin: 0;
        }

        :host p {
          color: var(--mdx-sys-color-neutral-bold4);
          font: var(--mdx-sys-font-flex-desktop-body-small);
          margin: 0;
        }

        :host ul {
          margin: 0;
          padding: 0 0 var(--mdx-sys-spacing-flex-large-xs) 1.25rem;
          color: var(--mdx-sys-color-neutral-bold4);
          font: var(--mdx-sys-font-flex-desktop-body-small);
        }
    `
  }
}
