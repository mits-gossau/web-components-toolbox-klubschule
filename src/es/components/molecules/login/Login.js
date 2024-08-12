// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/* global self */
/* global CustomEvent */

/**
 * Klubschule Meta Header
 *
 * @export
 * @class Login
 * @type {CustomElementConstructor}
 * @attribute {
 * }
 */
export default class Login extends Shadow() {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this.mdxLoginComponent = this.root.querySelector('mdx-login')

    this.selfClickListener = event => {
      const mdxLoginFlyout = this.mdxLoginComponent.root.querySelector('mdx-login-flyout')
      const mdxLoginFlyoutIsOpen = mdxLoginFlyout.hasAttribute('open')
      if (mdxLoginFlyoutIsOpen) mdxLoginFlyout.removeAttribute('open')
    }

    this.mdxLoginComponentClickListener = event => {
      this.dispatchEvent(new CustomEvent(this.getAttribute('close-other-flyout') || 'close-other-flyout', { bubbles: true, cancelable: true, composed: true }))
    }
  }

  connectedCallback() {
    this.hidden = true
    const showPromises = []
    if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
    if (this.shouldRenderHTML()) showPromises.push(this.renderHTML())
    Promise.all(showPromises).then(() => (this.hidden = false))

    if (this.mdxLoginComponent) {
      self.addEventListener('click', this.selfClickListener)
      self.addEventListener('close-other-flyout', this.selfClickListener)
      this.mdxLoginComponent.addEventListener('click', this.mdxLoginComponentClickListener)
    }
  }

  disconnectedCallback() {
    if (this.mdxLoginComponent) {
      self.removeEventListener('click', this.selfClickListener)
      self.removeEventListener('close-other-flyout', this.selfClickListener)
      this.mdxLoginComponent.removeEventListener('click', this.mdxLoginComponentClickListener)
    }
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS() {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML() {
    return !this.root.querySelector('mdx-login')
  }

  /**
   * renders the css
   *
   * @return {Promise<void>}
   */
  renderCSS() {
    this.css = /* css */`
      :host {
        display: flex;
        align-items: center;
        justify-content: end;
        gap: calc(var(--content-spacing, 1em) * 2);
        margin: calc(var(--content-spacing, unset) / 2) auto;  /* Warning! Keep horizontal margin at auto, otherwise the content width + margin may overflow into the scroll bar */
        width: var(--login-width, max(calc(_max-width_ - var(--content-spacing) * 2), 55%)); /* Environment.js mobileBreakpoint must correspond to the calc 1200px */
      }
      :host > section {
        display: var(--section-display, flex);
        align-items: center;
        justify-content: end;
        gap: calc(var(--content-spacing, 1em) * 2);
      }
      :host .font-size-tiny {
        font-family: var(--button-font-family, inherit);
        font-size: calc(0.75 * var(--p-font-size-mobile, var(--p-font-size, 1em)));
        line-height: var(--line-height-mobile, var(--line-height, normal));
        padding: var(--button-padding, 0 0 0 0);
        border-radius: var(--button-border-radius, 0.5em);
        border: var(--button-border-width, 0px) solid var(--button-border-color, transparent);
        color: var(--button-font-color);
      }
      :host .font-size-tiny:before {
        border-right: 2px solid var(--button-border-color);
        height: 1rem;
        width: 1.3rem;
        margin-top: -2px;
      }
      :host .font-size-tiny:hover{
        background-color: inherit;
        color: inherit;
      }
      :host > section > a {
        color: var(--color);
        text-decoration: none;
        font-weight: var(--font-weight-strong, bold);
      }
      :host > section > div {
        position: relative;
      }
      :host > section > div div[open] {
        top: 15px;
      }
      :host([profile-flyout]) {
          max-height: 2.5em !important;
          z-index: 9999;
      }
      :host > section > m-dialog {
        margin-left: calc(var(--content-spacing, 1em) * -1.5);
      }
      @media only screen and (max-width: _max-width_) {
        :host,
        :host > section {
          gap: calc(var(--content-spacing-mobile, var(--content-spacing, 1em)) * 2);
          margin: calc(var(--content-spacing-mobile, var(--content-spacing, unset)) / 2) auto; /* Warning! Keep horizontal margin at auto, otherwise the content width + margin may overflow into the scroll bar */
          width: var(--content-width-mobile, calc(100% - var(--content-spacing-mobile, var(--content-spacing)) * 2));
        }
        :host .font-size-tiny {
          font-size: calc(0.75 * var(--p-font-size-mobile, var(--p-font-size, 1em)));
          line-height: var(--line-height-mobile, var(--line-height, normal));
          padding: 0;
          border: none;
        }
        :host > section > div div[open] {
          top: 0 !important;
        }
        :host > section > m-dialog {
          margin-left: -1rem;
        }
      }
    `
    return this.fetchTemplate()
  }

  /**
  * fetches the template
  *
  * @return {Promise<void>}
  */
  fetchTemplate() {
    switch (this.getAttribute('namespace')) {
      case 'login-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }])
    }
    return Promise.resolve()
  }

  /**
   * renders the html
   *
   * @return {Promise<void>}
   */
  renderHTML() {
    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../../../css/web-components-toolbox-migros-design-experience/src/es/components/atoms/login/Login.js`,
        name: 'mdx-login'
      }
    ])
  }
}
