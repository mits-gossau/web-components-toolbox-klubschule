// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class Checkbox extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.clickEventListener = event => this.input.click()
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()

    this.box = this.root.querySelector('.box')
    this.input = this.root.querySelector('input[type="checkbox"]')

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
        }

        :host .wrap {
          display: flex;
          flex-direction: row-reverse;
          justify-content: flex-start;
          align-items: center;
          padding-top: var(--padding-top);
          padding-bottom: var(--padding-bottom);
          padding-right: var(--padding-right);
        }

        :host .wrap.disabled {
          pointer-events: none;
          opacity: 0.2;
        }

        :host .wrap:hover,
        :host label:hover {
          background-color: var(--background);
          cursor: pointer;
        }

        :host label {
          font-size: 1em;
          line-height: 1.25em;
          font-weight: 400;
          padding: var(--label-padding, 0);   
        }

        :host input[type='checkbox'] {
            width: 0;
        }

        :host input[type='checkbox']:checked + .box {
            border-color: var(--color);
        }       

        :host input[type='checkbox']:checked + .box a-icon-mdx {
            display: block;
            color: var(--color);;
        }

        :host .box {
            background-color: var(--box-background-color);
            border: 0.0625em solid var(--border-color);
            border-radius: var(--border-radius, 0);
            height: 1.25em;
            width: 1.25em;
            margin-right: 0.75em;
            flex: 1 0 1.25em;
        }

        :host .box a-icon-mdx {
            display: none;
        }

        .wrap:not(:has(.has-error)) > .message {
          display: none;
        }
        [dirty] .wrap > input:invalid ~ .message {
          display: block;
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
      case 'center-list-':
        return this.fetchCSS([
          {
            path: `${this.importMetaUrl}./center-list-/center-list-.css`,
            namespace: false
          }])
    }
  }
}
