// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class BackForward extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, mode: 'false', ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
  }

  disconnectedCallback () {
  }

  shouldRenderHTML () {
    return !this.wrapper
  }

  shouldRenderCSS () {
    return !this.root.querySelector(
      `${this.cssSelector} > style[_css]`
    )
  }

  renderCSS () {
    this.css = /* css */ `
      :host .back-forward {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      @media screen and (max-width: _max-width_) {
        :host .back-forward {
          display: flex;
          flex-direction: column-reverse;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        :host ks-a-button {
          width: 100%;
        }

      }
    `
  }

  renderHTML () {
    this.html = /* html */`
      <div class="back-forward">
        ${this.hasAttribute('back-link')
          ? /* html */`<ks-a-button big href="${this.getAttribute('back-link')}" namespace="button-tertiary-" color="secondary">
              <a-icon-mdx icon-name="ChevronLeft" size="1em" class="icon-left"></a-icon-mdx>
              ${this.getAttribute('back-label')}
            </ks-a-button>`
          : '<div></div>'
        }
        ${this.hasAttribute('forward-label')
          ? /* html */`
            <ks-a-button 
              class="back-forward__forward-btn"
              big 
              ${this.hasAttribute('submit') ? 'type="submit" mode="false"' : ''} 
              ${this.hasAttribute('forward-link') ? `href="${this.getAttribute('forward-link')}"` : ''} 
              ${this.hasAttribute('forward-disabled') ? 'disabled' : ''}
              namespace="button-primary-" 
              color="secondary"
            >
              ${this.getAttribute('forward-label')}
              <a-icon-mdx icon-name="ChevronRight" size="1em" class="icon-right"></a-icon-mdx>
            </ks-a-button>`
          : '<div></div>'
        }
      </div>
    `

    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../atoms/button/Button.js`,
        name: 'ks-a-button'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ])
  }

  get wrapper () {
    return this.root.querySelector('.back-forward')
  }
}
