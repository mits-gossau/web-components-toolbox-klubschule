// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Contact
* @type {CustomElementConstructor}
*/
export default class Contact extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, mode: 'false', ...options }, ...args)

    try {
      this.gtm_data = this.hasAttribute('gtm-data') ? JSON.parse(this.getAttribute('gtm-data')) : null
    } catch (error) {
      console.warn('Wishlist FavoriteButton.js aka. <ks-m-favorite-button> received corrupted gtm-data and is not going to send the add to wishlist event to GTM:', this)
    }

    this.clickEventListener = event => {
      if (this.gtm_data) this.dataLayerPush(this.gtm_data)
    }

    this.keydownEventListener = event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        if (this.hasAttribute('onclick')) {
          const onclickCode = this.getAttribute('onclick')
          try {
            const func = new Function(onclickCode)
            func.call(this)
          } catch (error) {
            console.error('Error executing onclick:', error)
            this.click()
          }
        } else {
          this.click()
        }
      }
    }
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
    this.addEventListener('click', this.clickEventListener)
    if (this.hasAttribute('onclick')) {
      this.setAttribute('tabindex', '0')
      this.addEventListener('keydown', this.keydownEventListener)
    }
    this.linkElement = this.root.querySelector('a[href]')
    if (this.linkElement) this.linkElement.addEventListener('click', this.linkClickListener.bind(this))
  }

  disconnectedCallback () {
    this.removeEventListener('click', this.clickEventListener)
    this.removeEventListener('keydown', this.keydownEventListener)
    if (this.linkElement) this.linkElement.removeEventListener('click', this.linkClickListener)
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
    return !this.contactRow
  }

  linkClickListener (event) {
    const href = this.getAttribute('href')
    if (href && href.startsWith('javascript:')) {
      event.preventDefault()
      const code = href.substring(11) // remove 'javascript:'
      try {
        eval(code) // execute the JavaScript code
      } catch (e) {
        console.error('Error executing JavaScript link:', e)
      }
      return
    }
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        --a-text-decoration-hover: underline;
        --icon-mdx-ks-color: var(--a-color);

        display: block;
        margin-bottom: var(--mdx-sys-spacing-fix-m);
      }
      :host([tabindex]):focus-visible {
        outline: var(--outline, 2px solid var(--color-focus, #005fcc));
        outline-offset: var(--outline-offset, 2px);
        border-radius: var(--border-radius-focus, 4px);
      }
      :host a:hover a-icon-mdx {
        --icon-mdx-ks-color: var(--a-color-hover);
      }
      :host a {
        --a-text-decoration: none !important;
        text-decoration: var(--a-text-decoration) !important;
        text-decoration-line: var(--a-text-decoration) !important;
        margin-bottom: 0 !important;
      }
      :host a a-icon-mdx {
        display: block;
      }
      :host .contact-row {
        display: flex !important;
        gap: var(--mdx-sys-spacing-fix-m, 24px);
        margin-bottom: var(--mdx-sys-spacing-fix-xs);
      }
      :host .contact-row > *:nth-child(2) {
        flex-shrink: 10;
      }
      :host a:hover {
        text-decoration: var(--a-text-decoration-hover) !important;
        text-decoration-line: var(--a-text-decoration-hover) !important;
      }
      :host address span {
        display: block;
        font-style: normal;
      }
      :host a-icon-mdx {
        flex-shrink: 0;
      }
      :host a > div > span {
        white-space: break-spaces;
        word-break: break-word;
      }
    `
    return this.fetchCSS([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/reset.css`, // no variables for this reason no namespace
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: true
      }
    ])
  }

  /**
   * Render HTML
   * @returns Promise<void>
   */
  renderHTML () {
    const firstRow = this.getAttribute('name')
    const secondRow = this.getAttribute('street')
    const thirdRow = this.getAttribute('place')
    const isAddress = secondRow && thirdRow
    const id = this.getAttribute('id')
    const target = this.getAttribute('target')
    const tag = this.hasAttribute('href') ? 'a' : 'div'
    const href = this.getAttribute('href')
    const isJavaScriptLink = href && href.startsWith('javascript:')

    this.html = /* HTML */ `
      <${tag} ${href ? `href="${isJavaScriptLink ? '#' : href}"` : ''} ${id ? `id="${id}"` : ''} ${target ? `target="${target}"` : ''} class="contact-row">
        <a-icon-mdx 
          ${href ? 'namespace="icon-mdx-ks-"' : ''}
          size="${this.getAttribute('icon-size') || '1rem'}"
          ${this.getAttribute('icon-url') ? `icon-url="${this.getAttribute('icon-url')}"` : `icon-name="${this.getAttribute('icon-name')}"`} 
        >
        </a-icon-mdx>
        ${isAddress ? /* html */ '<address>' : /* html */ '<div>'}
          ${firstRow ? /* html */ `<span>${firstRow}</span>` : ''}
          ${secondRow ? /* html */ `<span>${secondRow}</span>` : ''}
          ${thirdRow ? /* html */ `<span>${thirdRow}</span>` : ''}
        ${isAddress ? /* html */ '</address>' : /* html */ '</div>'}
      </${tag}>
    `

    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/link/Link.js`,
        name: 'a-link'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ])
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

  get data () {
    return Contact.parseAttribute(this.getAttribute('data'))
  }

  get contactRow () {
    return this.root.querySelector('.contact-row')
  }
}
