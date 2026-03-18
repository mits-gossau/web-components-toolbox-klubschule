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
    this.storeCheckoutPath()
  }

  disconnectedCallback () {
    if (this.backButton) this.backButton.removeEventListener('click', this.backLinkListener)
  }

  getOfferPageUrl () {
    const currentPath = window.location.pathname
    return currentPath.replace(/\/(configuration|loginmethod|registration|payment|confirm)$/i, '')
  }

  isCheckoutPage () {
    const currentPath = window.location.pathname.toLowerCase()
    return currentPath.endsWith('/configuration') || 
           currentPath.endsWith('/loginmethod') || 
           currentPath.endsWith('/registration') ||
           currentPath.endsWith('/payment') ||
           currentPath.endsWith('/confirm')
  }

  storeCheckoutPath () {
    const currentPath = window.location.pathname
    let checkoutPath = []
    try {
      checkoutPath = JSON.parse(sessionStorage.getItem('checkoutPath') || '[]')
    } catch {}
    
    if (!this.isCheckoutPage()) return
    
    const existingIndex = checkoutPath.findIndex(p => p.toLowerCase() === currentPath.toLowerCase())
    if (existingIndex >= 0) {
      checkoutPath = checkoutPath.slice(0, existingIndex + 1)
    } else {
      checkoutPath.push(currentPath)
    }
    sessionStorage.setItem('checkoutPath', JSON.stringify(checkoutPath))
  }

  isFirstCheckoutStep () {
    let checkoutPath = []
    try {
      checkoutPath = JSON.parse(sessionStorage.getItem('checkoutPath') || '[]')
    } catch {}
    
    const currentPath = window.location.pathname.toLowerCase()
    const currentIndex = checkoutPath.findIndex(p => p.toLowerCase() === currentPath)
    return currentIndex <= 0
  }

  getPreviousCheckoutStep () {
    let checkoutPath = []
    try {
      checkoutPath = JSON.parse(sessionStorage.getItem('checkoutPath') || '[]')
    } catch {}
    
    const currentPath = window.location.pathname.toLowerCase()
    const currentIndex = checkoutPath.findIndex(p => p.toLowerCase() === currentPath)
    
    if (currentIndex > 0) {
      return checkoutPath[currentIndex - 1]
    }
    return null
  }

  backLinkListener (event) {
    if (!this.isCheckoutPage()) return
    
    const offerPageUrl = this.getOfferPageUrl()
    
    if (this.isFirstCheckoutStep()) {
      event.preventDefault()
      document.body.dispatchEvent(new CustomEvent('checkout-back-navigation', {
        bubbles: true,
        composed: true,
        detail: { targetUrl: offerPageUrl }
      }))
      return
    }
    
    const previousStep = this.getPreviousCheckoutStep()
    if (previousStep) {
      event.preventDefault()
      window.location.href = previousStep
      return
    }

    const backLink = this.getAttribute('back-link')
    if (backLink && backLink.startsWith('javascript:')) {
      event.preventDefault()
      const code = backLink.substring(11) // remove 'javascript:'
      if (code.includes('history.go') || code.includes('history.back')) {
        const tempLink = document.createElement('a')
        tempLink.href = document.referrer || '/'
        tempLink.style.display = 'none'
        document.body.appendChild(tempLink)
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          composed: true
        })
        const originalPreventDefault = clickEvent.preventDefault
        clickEvent.preventDefault = function() { originalPreventDefault.call(this) }
        tempLink.dispatchEvent(clickEvent)
        document.body.removeChild(tempLink)
        if (!clickEvent.defaultPrevented) {
          try {
            eval(code)
          } catch (e) {
            console.error('Error executing JavaScript link:', e)
          }
        }
        return
      }
      try {
        eval(code)
      } catch (e) {
        console.error('Error executing JavaScript link:', e)
      }
      return
    }
    
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
    const backLink = this.getAttribute('back-link') || '#'
    const isJavaScriptLink = backLink.startsWith('javascript:')
    
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
                          <a class="back-button" href="${isJavaScriptLink ? '#' : backLink}">
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
