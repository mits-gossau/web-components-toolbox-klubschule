// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class Facts extends Shadow() {
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
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 4rem 0 5rem;
        }

        :host h2 {
          font-size: 2.25rem;
          line-height: 2.5rem;
          font-weight: 500;
          margin: 0;
        }

        :host .facts {
          display: grid;
          grid-template-columns: 33.33% 33.33% 33.33%;
          column-gap: 1.5rem;
        }

        :host h2 + .facts {
          margin-top: 2rem;
        }

        :host .facts + ks-a-button {
          margin-top: 3rem;
        }

        :host .fact {
          background-color: var(--mdx-base-color-grey-100);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 0.5rem;
          width: 16.75rem;
        }
        
        :host .fact div + div {
          margin-top: 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        :host span {
          font-size: 1.5rem;
          line-height: 1.625rem;
          font-weight: 500;
        }

        @media only screen and (max-width: _max-width_) {
          :host {
            padding: 3rem 0 4rem;
          }

          :host h2 {
            font-size: 1.75rem;
            line-height: 1.875rem;
          }

          :host span {
            font-size: 1.25rem;
            line-height: 1.375rem;
          }

          :host .facts {
            grid-template-columns: repeat(auto-fit, minmax(50%, 50%));
            column-gap: 0.5rem;
            row-gap: 0.5rem;
            width: 100%;
          }

          :host .fact {
            width: auto;
          }

          :host .fact:last-child {
            grid-column: span 2;
          }
        }
    `
  }
}
