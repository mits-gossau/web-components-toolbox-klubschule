// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class BackForward extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, mode: 'false', ...options }, ...args)  

    try {
      this.eventData = this.hasAttribute('event-data') ? JSON.parse(this.getAttribute('event-data')) : null
    } catch (error) {
      console.warn('BackForward.js aka. <ks-m-back-forward> received corrupted event-data and is not going to send event to GTM:', this)
    }
    
    /* close dialog in form overlay */
    this.clickEventListener = () => {
      this.dispatchEvent(new CustomEvent('close-dialog',
        {
          bubbles: true,
          cancelable: true,
          composed: true
        })
      )
    }

    this.submitEventListener = () => { 
      if (this.eventData) {
        this.dataLayerPush(this.eventData)
      }
    }
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()

    this.submitButton = this.root.querySelector('.back-forward__forward-btn[type="submit"]')
    if (this.submitButton) this.submitButton.addEventListener('click', this.submitEventListener)

    this.closeButton = this.root.querySelector('#close')
    if (this.closeButton) this.closeButton.addEventListener('click', this.clickEventListener)
  }

  disconnectedCallback () {
    if (this.submitButton) this.submitButton.removeEventListener('click', this.submitEventListener)
    if (this.closeButton) this.closeButton.removeEventListener('click', this.clickEventListener)
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
      :host {
        display: inline-block;
        width: 100%;
      }

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

        :host ks-a-button,
        :host ks-a-button a[type="button"],
        :host ks-a-button button {
          width: 100%;
        }

      }
    `
  }

  renderHTML () {
    this.html = /* html */`
      <div class="back-forward">
        ${this.hasAttribute('close-label')
          ? /* html */`
            <ks-a-button id="close" big namespace="button-tertiary-" color="secondary" no-pointer-events>
              ${this.getAttribute('close-label')}
            </ks-a-button>
            `
          : ''
        }
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
              ${this.hasAttribute('submit') ? 'type="submit" with-submit-loading mode="false"' : ''} 
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

  dataLayerPush (value) {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.dataLayer) {
      try {
        // @ts-ignore
        window.dataLayer.push(value)
      } catch (err) {
        console.error('Failed to push event data:', err)
      }
    }
  }
}
