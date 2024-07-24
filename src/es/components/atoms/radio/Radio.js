// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class Radio extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.boxes = Array.from(this.root.querySelectorAll('.box') || [])
    this.inputs = Array.from(this.root.querySelectorAll('input[type="radio"]') || [])
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
  }

  disconnectedCallback () {
  }

  shouldRenderCSS () {
    return !this.root.querySelector(
      `${this.cssSelector} > style[_css]`
    )
  }

  renderCSS () {
    this.css = /* css */ `
        :host {
          display: flex;
          flex-direction: column;
        }

        :host([row]) {
          flex-direction: row;
          flex-wrap: wrap;
        }

        :host([row]) .message {
          width: 100%;
        }

        :host .wrap img {
          margin-left: var(--mdx-sys-spacing-fix-m)
        }

        :host .wrap {
          display: flex;
          flex-direction: row-reverse;
          justify-content: flex-end;
          align-items: center;
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

        :host .wrap:hover label {
          background-color: var(--mdx-comp-radiobutton-unchecked-background-color-hover);
          cursor: pointer;
        }

        :host label {
          flex: 1;
          display: block;
          font-size: 1em;
          line-height: 1.25em;
          font-weight: 400;
          padding-left: calc(var(--mdx-comp-radiobutton-padding-horizontal-default) + var(--mdx-comp-radiobutton-sizing-ellipse));
          padding-top: var(--mdx-comp-radiobutton-padding-vertical-default);
          padding-bottom: var(--mdx-comp-radiobutton-padding-vertical-default);
          padding-right: var(--mdx-comp-radiobutton-padding-horizontal-default);
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

          /* by setting pointer events to none the input will be clickable as it is behind the box */
          pointer-events: none;
        }

        :host .message.has-error {
          display: flex;
          align-items: center;
        }

        :host .message {
          display: none;
        }

        :host .message span,
        :host .message a-icon-mdx {
          color: var(--mdx-comp-error-message-color-default);
          font: var(--mdx-comp-error-message-font-default);
          display: flex;
          align-items: center;
        }

        :host .message a-icon-mdx {
          --button-primary-icon-right-margin: 0;
          margin-right: var(--mdx-comp-error-message-gap-icon-text-default);
        }
        @media only screen and (max-width: _max-width_) {
          :host .wrap img {
            margin-left: 0;
          }
        }
    `
  }
}
