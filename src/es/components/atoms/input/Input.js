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

    this.input = this.root.querySelector('input');
    this.counter = this.root.querySelector('.counter');
    this.current = this.root.querySelector('.current');
    this.max = this.root.querySelector('.max');

    this.maxChar = this.input.getAttribute('maxlength');

    if (this.max) {
      this.max.innerText = `\u00A0/ ${this.maxChar}`;
    }

    this.inputEventListener = event => {
      let charCount = this.input.value.length;

      if (charCount <= this.maxChar) {
        this.current.innerText = charCount;
      } else {
        event.preventDefault();
      }
    }
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()

    if (this.counter) {
      this.input.addEventListener('input', this.inputEventListener)
    }
  }

  disconnectedCallback () {
    this.input.removeEventListener('input', this.inputEventListener)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host div {
        display: flex;
        flex-direction: column;
      }

      :host label {
        display: flex;
        flex-direction: column;
        color: var(--mdx-comp–inputfield-label-color-default);
        font: var(--mdx-comp-inputfield-font-label);
      }

      :host div .error {
        display: none;
      }

      :host .error .hint {
        display: none;
      }

      :host .error input {
        border-color: var(--mdx-comp-inputfield-border-color-error);
        background-color: var(--mdx-comp-inputfield-background-color-error);
        color: var(--mdx-comp-error-message-color-default);
      }

      :host .error span,
      :host .error a-icon-mdx {
        color: var(--mdx-comp-error-message-color-default);
        display: flex;
      }

      :host .error span {
        margin-left: var(--mdx-comp-inputfield-gap-content-below);
      }

      :host input {
        background-color: var(--mdx-base-color-grey-0);
        padding: var(--mdx-comp-inputfield-padding-vertical-default);
        border: var(--mdx-comp-inputfield-border-width-default) solid var(--mdx-comp-inputfield-border-color-default);
        border-radius: var(--mdx-comp-inputfield-border-radius-default);
        margin-top: var(--mdx-comp-inputfield-gap-label-inputfield);
        outline: none;
        width: 100%;
        box-sizing: border-box;
      }

      :host input::placeholder {
        color: var(--mdx-comp-inputfield-placeholder-color-default);
        font: var(--mdx-comp-inputfield-font-default);
      }

      :host input:focus {
        color: var(--mdx-comp-inputfield-input-color-focus);
        font: var(--mdx-comp-inputfield-font-default);
        border-color: var(--mdx-comp-inputfield-border-color-focus);
      }

      :host input[disabled] {
        background-color: var(--mdx-comp-inputfield-background-color-disabled);
        pointer-events: none;
        opacity: 0.5;
      }

      :host div .hint {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }

      :host .error .error {
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

      @media only screen and (max-width: _max-width_) {
        :host {}
      }
    `
  }
}
