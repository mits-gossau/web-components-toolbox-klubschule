// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class CheckoutColorStage
* @type {CustomElementConstructor}
*/
export default class CheckoutColorStage extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, mode: 'false', ...options }, ...args)

    this.backLinkListener = this.backLinkListener.bind(this)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) {
      this.renderHTML().then(() => {
        if (!this.backButton) {
          this.backButton = this.root.querySelector('o-grid').shadowRoot.querySelector('.back-button')
          if (this.backButton) this.backButton.addEventListener('click', this.backLinkListener)
        }
      })
    }
  }

  disconnectedCallback () {
    if (this.backButton) this.backButton.removeEventListener('click', this.backLinkListener)
  }

  backLinkListener (event) {
    // only if there is no back-link url set
    if (!this.hasAttribute('back-link')) {
      event.preventDefault()
      window.history.back()
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
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML () {
    return !this.grid
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        width: 100% !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        background-color: var(--mdx-sys-color-primary-default);
        display: block;
      }
      :host([no-margin-y]) {
        margin: 0 !important;
      }
    `
  }

  /**
   * Render HTML
   * @returns Promise<void>
   */
  renderHTML () {
    this.html = /* HTML */ `
      <o-grid 
          namespace="grid-2columns-content-stage-" 
          first-container-vertical 
          first-column-with="66%" 
          width="100%"
      >
        <section>
          <div class="stage-content">
              <p class="topline link-underline">
                  ${(this.hasAttribute('back-label') && (window.history.length > 1 || this.hasAttribute('back-link')))
                      ? /* html */`
                          <a class="back-button" href="${this.getAttribute('back-link') || '#'}">
                              <a-icon-mdx icon-name="ArrowLeft" size="1em"></a-icon-mdx>
                              <span>${this.getAttribute('back-label')}</span>
                          </a>`
                      : ''
                  }
              </p>
              <ks-a-heading tag="h1" color="white" content-stage>${this.getAttribute('title')}</ks-a-heading>
              ${this.hasAttribute('text')
                      ? /* html */`
                          <p>${this.getAttribute('text')}</p>`
                      : ''
                  }
          </div>
        </section>
      </o-grid>
    `
    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/organisms/grid/Grid.js`,
        name: 'o-grid'
      },
      {
        path: `${this.importMetaUrl}../../atoms/heading/Heading.js`,
        name: 'ks-a-heading'
      }
    ])
  }

  get grid () {
    return this.root.querySelector('o-grid')
  }
}
