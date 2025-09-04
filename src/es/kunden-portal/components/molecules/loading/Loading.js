// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * Loading
 * An example at https://github.com/mits-gossau/web-components-toolbox/tree/master/src/es/components/molecules/loading
 *
 * @export
 * @class Loading
 * @type {CustomElementConstructor}
 * @attribute {string} text - Loading text to display
 * @attribute {string} size - Size of spinner (small, medium, large)
 * @attribute {string} color - Color of spinner (defaults to #0053A6)
 */
export default class Loading extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
  }

  shouldRenderHTML () {
    return !this.root.querySelector('div')
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  renderCSS () {
    this.css = /* css */`
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: var(--loading-min-height, 200px);
        padding: var(--loading-padding, 2rem);
      }

      :host .loading-container {
        text-align: center;
      }

      :host .spinner {
        border: var(--loading-spinner-border-width, 4px) solid var(--loading-spinner-bg-color, #f3f3f3);
        border-top: var(--loading-spinner-border-width, 4px) solid var(--loading-spinner-color, #0053A6);
        border-radius: 50%;
        width: var(--loading-spinner-size, 20px);
        height: var(--loading-spinner-size, 20px);
        animation: spin var(--loading-spinner-duration, 1s) linear infinite;
        margin: 0 auto var(--loading-text-margin, 1rem);
      }

      :host([size="small"]) .spinner {
        --loading-spinner-size: 10px;
        --loading-spinner-border-width: 2px;
      }

      :host([size="large"]) .spinner {
        --loading-spinner-size: 30px;
        --loading-spinner-border-width: 6px;
      }

      :host .loading-text {
        color: var(--loading-text-color, inherit);
        font: var(--loading-text-font, inherit);
        margin: 0;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `
    return this.fetchTemplate()
  }

  fetchTemplate () {
    switch (this.getAttribute('namespace')) {
      case 'loading-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`,
          namespace: false
        }], false)
      default:
        return Promise.resolve()
    }
  }

  renderHTML () {
    const text = this.getAttribute('text') || 'Laden...'
    const color = this.getAttribute('color')
    
    this.html = /* html */`
      <div class="loading-container">
        <div class="spinner" ${color ? `style="border-top-color: ${color};"` : ''}></div>
        <p class="loading-text">${text}</p>
      </div>
    `
  }
}