// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class Radio extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.clickEventListener = event => {
      this.input.checked = !this.input.checked
    }
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()

    this.box = this.root.querySelector('.box')
    this.input = this.root.querySelector('input[type="radio"]')

    /**
     * Handle checked on box
     */
    this.box.addEventListener('click', this.clickEventListener)
  }

  disconnectedCallback () {
    this.box.removeEventListener('click', this.clickEventListener)
  }

  shouldRenderCSS () {
    return !this.root.querySelector(
      `:host > style[_css], ${this.tagName} > style[_css]`
    )
  }

  renderCSS () {
    this.css = /* css */ `
        :host {
          display: flex;
          flex-direction: column;
        }

        :host .wrap img {
          margin-left: var(--mdx-sys-spacing-fix-m)
        }
        :host .wrap {
          display: flex;
          flex-direction: row-reverse;
          justify-content: flex-end;
          align-items: center;
          padding-top: var(--mdx-comp-radiobutton-padding-vertical-default);
          padding-bottom: var(--mdx-comp-radiobutton-padding-vertical-default);
          padding-right: var(--mdx-comp-radiobutton-padding-horizontal-default);
        }

        :host .wrap.disabled {
          pointer-events: none;
          background-color: var(--mdx-comp-radiobutton-unchecked-background-color-disabled);
          opacity: 0.5;
        }
        
        :host .wrap.disabled .box::before {
          background-color: var(--mdx-comp-radiobutton-checked-icon-color-disabled);
        }

        :host .wrap.disabled .box {
          border-color: var(--mdx-comp-radiobutton-checked-icon-border-disabled);
        }

        :host .wrap:hover,
        :host label:hover {
          background-color: var(--mdx-comp-radiobutton-unchecked-background-color-hover);
          cursor: pointer;
        }

        :host label {
          font-size: 1em;
          line-height: 1.25em;
          font-weight: 400;
          padding-left: calc(var(--mdx-comp-radiobutton-padding-horizontal-default) + var(--mdx-comp-radiobutton-sizing-ellipse));
          margin-left: calc(var(--mdx-comp-radiobutton-sizing-ellipse) / 2 * -1);
        }

        :host input[type='radio'] {
          height: 1px;
          width: 1px;
          margin-left: calc(var(--mdx-comp-radiobutton-sizing-ellipse) / 2 * -1);
          position: relative;
          z-index: -1; 
        }

        :host input[type='radio']:checked ~ .box {
          border-color: var(--mdx-comp-radiobutton-checked-icon-border-hover);
        }       

        :host input[type='radio']:checked ~ .box::before {
            display: block;
        }

        :host .box::before {
          display: none;
          content: '';
          position: absolute;
          height: var(--mdx-comp-radiobutton-sizing-ellipse-filled);
          width: var(--mdx-comp-radiobutton-sizing-ellipse-filled);
          background-color: var(--mdx-comp-radiobutton-checked-icon-color-hover);
          border-radius: 50%;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        :host .box {
          position: relative;
          background-color: var(--mdx-comp-radiobutton-unchecked-icon-background-hover);
          border: var(--mdx-comp-radiobutton-border-width-hover) solid var(--mdx-comp-radiobutton-unchecked-icon-border-hover);;
          border-radius: 50%;
          height: var(--mdx-comp-radiobutton-sizing-ellipse);
          width: var(--mdx-comp-radiobutton-sizing-ellipse);
          min-width: var(--mdx-comp-radiobutton-sizing-ellipse);
        }

        :host .custom-error-text p,
        :host span.custom-error-text {
          color: var(--mdx-comp-error-message-color-default);
          font: var(--mdx-comp-error-message-font-default);
          margin-top: var(--mdx-comp-inputfield-gap-content-below) !important;
          order: var(--ks-input-custom-error-text-order, 1000);
        }

        :host .custom-error-text {
          order: var(--ks-input-custom-error-text-order, 1000);
        }
  
        :host .custom-error-text p,
        :host span.custom-error-text {
          display: none;
        }

        :host .custom-error-text p[error-text-id="required"].error-active,
        :host span.custom-error-text[error-text-id="required"].error-active {
          display: block;
        }

        :host .custom-error-text p[error-text-id="required"]::before,
        :host span.custom-error-text[error-text-id="required"]::before {
          content: var(--ks-input-error-icon, url('data:image/svg+xml,<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="alert_circle" clip-path="url(%23clip0_16648_89214)"><path id="Vector" d="M7.99967 5.33398V8.00065M7.99967 10.6673H8.00634M14.6663 8.00065C14.6663 11.6825 11.6816 14.6673 7.99967 14.6673C4.31778 14.6673 1.33301 11.6825 1.33301 8.00065C1.33301 4.31875 4.31778 1.33398 7.99967 1.33398C11.6816 1.33398 14.6663 4.31875 14.6663 8.00065Z" stroke="%23E02805" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_16648_89214"><rect width="16" height="16" fill="white" transform="translate(0 0.000610352)"/></clipPath></defs></svg>'));
          margin-right: var(--mdx-comp-inputfield-gap-content-below);
          position: relative;
          top: var(--ks-input-error-icon-position-top, 3px);
        }

    `
  }
}
