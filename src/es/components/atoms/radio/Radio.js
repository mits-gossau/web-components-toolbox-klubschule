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
          padding-left: var(--mdx-comp-radiobutton-padding-horizontal-default);
        }

        :host input[type='radio'] {
          display: none;
        }

        :host input[type='radio']:checked + .box {
          border-color: var(--mdx-comp-radiobutton-checked-icon-border-hover);
        }       

        :host input[type='radio']:checked + .box::before {
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
        }
    `
  }
}
