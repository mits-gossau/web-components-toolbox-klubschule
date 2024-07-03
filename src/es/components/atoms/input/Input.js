// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Input
* @type {CustomElementConstructor}
*/
export default class Input extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.input = this.root.querySelector('input')
    this.textarea = this.root.querySelector('textarea')
    this.counter = this.root.querySelector('.counter')
    this.current = this.root.querySelector('.current')
    this.max = this.root.querySelector('.max')

    if (this.input) {
      this.maxCharInput = this.input.getAttribute('maxlength')

      if (this.max) {
        this.max.innerText = `\u00A0/ ${this.maxCharInput}`
      }
    }

    if (this.textarea) {
      this.maxCharTextarea = this.textarea.getAttribute('maxlength')

      if (this.max) {
        this.max.innerText = `\u00A0/ ${this.maxCharTextarea}`
      }
    }

    this.inputEventListener = event => {
      const charCount = this.input.value.length

      if (charCount <= this.maxCharInput) {
        this.current.innerText = charCount
      } else {
        event.preventDefault()
      }
    }

    this.textareaEventListener = event => {
      const charCount = this.textarea.value.length

      if (charCount <= this.maxCharTextarea) {
        this.current.innerText = charCount
      } else {
        event.preventDefault()
      }
    }
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()

    if (this.counter && this.input) {
      this.input.addEventListener('input', this.inputEventListener)
    }

    if (this.counter && this.textarea) {
      this.textarea.addEventListener('input', this.textareaEventListener)
    }
  }

  disconnectedCallback () {
    if (this.input) {
      this.input.removeEventListener('input', this.inputEventListener)
    }

    if (this.textarea) {
      this.textarea.removeEventListener('input', this.textareaEventListener)
    }
  }

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
   */
  renderCSS () {
    this.css = /* css */`
      :host > div {
        display: flex;
        flex-direction: column;
      }

      :host label {
        display: flex;
        flex-direction: column;
        color: var(--mdx-comp–inputfield-label-color-default);
        font: var(--mdx-comp-inputfield-font-label);
      }

      .wrap:has(.has-error) .hint {
        display: none;
      }

      :host input.has-error,
      :host textarea.has-error {
        border-color: var(--mdx-comp-inputfield-border-color-error);
        background-color: var(--mdx-comp-inputfield-background-color-error);
        color: var(--mdx-comp-error-message-color-default);
      }

      :host .message span,
      :host .message a-icon-mdx {
        color: var(--mdx-comp-error-message-color-default);
        font: var(--mdx-comp-error-message-font-default);
        display: flex;
        align-items: center;
      }

      :host .message span {
        margin-left: var(--mdx-comp-inputfield-gap-content-below);
      }

      :host .custom-error-text p {
        color: var(--mdx-comp-error-message-color-default)  !important;
        font: var(--mdx-comp-error-message-font-default)  !important;
        margin-top: var(--mdx-comp-inputfield-gap-content-below) !important;
      }

      :host .custom-error-text p::before {
        content: var(--ks-input-error-icon, url('data:image/svg+xml,<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="alert_circle" clip-path="url(%23clip0_16648_89214)"><path id="Vector" d="M7.99967 5.33398V8.00065M7.99967 10.6673H8.00634M14.6663 8.00065C14.6663 11.6825 11.6816 14.6673 7.99967 14.6673C4.31778 14.6673 1.33301 11.6825 1.33301 8.00065C1.33301 4.31875 4.31778 1.33398 7.99967 1.33398C11.6816 1.33398 14.6663 4.31875 14.6663 8.00065Z" stroke="%23E02805" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_16648_89214"><rect width="16" height="16" fill="white" transform="translate(0 0.000610352)"/></clipPath></defs></svg>'));
        margin-right: var(--mdx-comp-inputfield-gap-content-below);
        position: relative;
        top: var(--ks-input-error-icon-position-top, 3px);
      }

      :host input,
      :host textarea {
        background-color: var(--mdx-base-color-grey-0);
        padding: var(--mdx-comp-inputfield-padding-vertical-default);
        border: var(--mdx-comp-inputfield-border-width-default) solid var(--mdx-comp-inputfield-border-color-default);
        border-radius: var(--mdx-comp-inputfield-border-radius-default);
        font: var(--mdx-comp-inputfield-font-default);
        margin-top: var(--mdx-comp-inputfield-gap-label-inputfield);
        outline: none;
        width: 100%;
        box-sizing: border-box;
      }

      :host input::placeholder,
      :host textarea::placeholder {
        color: var(--mdx-comp-inputfield-placeholder-color-default);
        font: var(--mdx-comp-inputfield-font-default);
      }

      :host input[type="date"]::-webkit-datetime-edit-text,
      :host input[type="date"]::-webkit-datetime-edit-month-field,
      :host input[type="date"]::-webkit-datetime-edit-day-field,
      :host input[type="date"]::-webkit-datetime-edit-year-field {
          color: var(--mdx-comp-inputfield-placeholder-color-default);
          font: var(--mdx-comp-inputfield-font-default);
      }

      :host input:focus,
      :host textarea:focus {
        color: var(--mdx-comp-inputfield-input-color-focus);
        border-color: var(--mdx-comp-inputfield-border-color-focus);
      }

      :host input:focus-visible,
      :host textarea:focus-visible {
        outline: var(--ks-input-outline-focus-visible, none);
      }

      :host input[disabled],
      :host textarea[disabled] {
        background-color: var(--mdx-comp-inputfield-background-color-disabled);
        pointer-events: none;
        opacity: 0.5;
      }

      :host > div .hint {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }

      :host .message {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      :host .hint span:first-child {
        color: var(--mdx-comp-inputfield-hint-counter-color-focus);
        font: var(--mdx-comp-inputfield–font-supporting);
      }

      :host .hint .counter {
        display: flex;
        flex-direction: row;
        color: var(--mdx-comp-inputfield-hint-counter-color-focus);
        font: var(--mdx-comp-inputfield-font-supporting);
      }

      .wrap:not(:has(.has-error)) > .message {
        display: none;
      }
      
      [dirty] .wrap > input:invalid ~ .message {
        display: flex;
      }
    `
  }
}
