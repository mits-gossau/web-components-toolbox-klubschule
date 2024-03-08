// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class ContentSearchItem extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
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
          padding-bottom: 1.5rem;
        }

        :host a {
          display: flex;
          text-decoration: none;
          color: var(--mdx-base-color-grey-950);
        }

        :host a div  {
          width: 43.75rem;
        }

        :host a:hover h3 {
          color: var(--mdx-base-color-klubschule-blue-600);
        }

        :host div + a-picture {
          margin-left: 1rem;
        }

        :host h3 {
          font-size: 1rem;
          line-height: 1.125rem;
          font-weight: 500;
          margin: 0;
        }

        :host p {
          font-size: 1rem;
          line-height: 1.25rem;
          font-weight: 400;
          margin: 0;
          margin-top: 0.25rem;
        }

        :host p strong {
          background-color: var(--mdx-base-color-klubschule-blue-600);
          color: var(--mdx-base-color-grey-0);
          font-weight: 400;
          padding: 0 0.25rem;
        }

        @media only screen and (max-width: _max-width_) {
          :host a div {
            width: 15.625rem;
          }
          
          :host h3 {
            line-height: 1.25rem;
          }

          :host p {
            font-size: 0.875rem;
            line-height: 1.125rem;
            margin-top: 0.5rem;
          }
        }
    `
  }
}
