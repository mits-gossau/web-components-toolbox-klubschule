// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class Select extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
  }

  disconnectedCallback () {}

  shouldRenderCSS () {
    return !this.root.querySelector(
      `${this.cssSelector} > style[_css]`
    )
  }

  renderCSS () {
    this.css = /* css */ `
        :host .wrap {
          display: flex;
          flex-direction: column;
        }
  
        .wrap:has(.has-error) .hint {
          display: none;
        }

        :host label {
          display: flex;
          flex-direction: column;
          color: var(--mdx-comp-select-label-color-default);
          font: var(--mdx-comp-select-font-label);
        }

        :host select {
          padding: var(--mdx-comp-select-padding-vertical-default) var(--mdx-comp-select-padding-horizontal-default);
          background-color: var(--mdx-comp-select-background-color-default);
          border: var(--mdx-comp-select-border-width-default) solid var(--mdx-comp-select-border-color-default);
          border-radius: var(--mdx-comp-select-border-radius-default);
          box-shadow: var(--mdx-comp-select-box-shadow-default);
          color: var(--mdx-comp-select-placeholder-color-default);
          font: var(--mdx-comp-select-font-default);
          margin-top: var(--mdx-comp-select-gap-label-select);
          width: 100%;
        }

        :host select[disabled] {
          background-color: var(--mdx-comp-select-background-color-disabled);
          border-color: var(--mdx-comp-select-border-color-disabled);
          box-shadow: var(--mdx-comp-select-box-shadow-disabled);
          pointer-events: none;
          opacity: 0.5;
        }

        :host .message span,
        :host .message a-icon-mdx {
          color: var(--mdx-comp-error-message-color-default);
          display: flex;
          align-items: center;
        }

        :host .message span {
          margin-left: var(--mdx-comp-error-message-gap-icon-text-default);
          font: var(--mdx-comp-error-message-font-default);
        }

        :host .wrap .hint {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        :host .hint span:first-child {
          color: var(--mdx-comp-select-hint-color-default);
          font: var(--mdx-comp-select-font-supporting);
        }

        .wrap:not(:has(.has-error)) > .message {
          display: none;
        }
        
        [dirty] .wrap > select:invalid ~ .message {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
    `
  }
}
