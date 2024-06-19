// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class Checkbox extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.clickEventListener = event => {
      this.input.checked = !this.input.checked;

      if (this.input.hasAttribute('trigger')) {
        this.dispatchEvent(new CustomEvent('triggered-by',
          {
            detail: {
              element: this.input
            },
            bubbles: true,
            cancelable: true,
            composed: true
          })
        )
      }

      event.preventDefault();
    }
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()

    this.wrap = this.root.querySelector('.wrap')
    this.input = this.root.querySelector('input[type="checkbox"]')

    /**
     * Handle checked on box
     */
    this.wrap.addEventListener('click', this.clickEventListener)
  }

  disconnectedCallback () {
    this.wrap.removeEventListener('click', this.clickEventListener)
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
            cursor: pointer;
        }

        :host .wrap {
          position: relative;
          display: flex;
          flex-direction: column;
        }

        :host .wrap.disabled {
          pointer-events: none;
          opacity: 0.2;
        }

        :host .control:hover label {
          background-color: var(--background);
          cursor: pointer;
        }

        :host .control {
          flex: 1;
          display: flex;
          flex-direction: row-reverse;
        }

        :host label {
          display: flex;
          flex-direction: column;
          flex: 1;
          font-size: 1em;
          line-height: 1.25em;
          font-weight: 400;
          color: var(--label-color);
          font: var(--label-font);
          padding: 
              var(--padding-top)
              var(--padding-right)
              var(--padding-bottom)
              calc(var(--padding-right) + 1.25em)
          ;
        }

        :host label span {
          color: var(--hint-color);
          font: var(--hint-font);
        }
          
        :host label a {
          display: inline !important;
          font-size: 1em;
          line-height: 1.25em;
          font-weight: 400;
        }

        :host input[type='checkbox'] {
            width: 0;
            min-width: unset;
        }

        :host input[type='checkbox']:checked + .box {
            border-color: var(--color);
        }       

        :host input[type='checkbox']:checked + .box a-icon-mdx {
            display: flex;
            justify-content: center;
            align-items: center;
            color: var(--color);
            margin: 0;
        }

        :host .box {
          position: absolute;
          left: 0;
          top: var(--padding-top);
          background-color: var(--box-background-color);
          border: 0.0625em solid var(--border-color);
          border-radius: var(--border-radius, 0);
          height: 1.25em;
          width: 1.25em;
          margin-right: 0.75em;
          flex: 1 0 1.25em;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        :host .box a-icon-mdx {
            display: none;
        }

        .wrap:not(:has(.has-error)) > .message {
          display: none;
        }

        [dirty] .wrap:has(input:invalid) .message {
          display: flex;
          margin-top: var(--error-gap);
        }

        :host .message span,
        :host .message a-icon-mdx {
          color: var(--error-color);
          display: flex;
          align-items: center;
        }

        :host .message span {
          font: var(--error-font);
        }

        :host .message a-icon-mdx {
          margin-right: var(--error-icon-gap);
        }
    `
    return this.fetchTemplate()
  }

  /**
   * fetches the template
   */
  fetchTemplate () {
    /** @type {import("../../web-components-toolbox/src/es/components/prototypes/Shadow.js").fetchCSSParams[]} */
    switch (this.getAttribute('namespace')) {
      case 'checkbox-default-':
        return this.fetchCSS([
          {
            path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
            namespace: false
          }])
    }
  }
}
