// @ts-check
import { Prototype } from '../../web-components-toolbox/src/es/components/msrc/Prototype.js'

/* global self */
/* global CustomEvent */

/**
 * Login https://react-components.migros.ch/?path=/story/msrc-login-03-widgets-login-button--button-large
 * For Flyout Widget Version set 'profile-flyout' attribute https://react-components.migros.ch/?path=/docs/msrc-login-03-widgets-profile-flyout-widget--profile-flyout
 * Example at: alnatura Home.html
 *
 * @export
 * @class Login
 * @type {CustomElementConstructor}
 * @attribute {
 * }
 */
export default class Login extends Prototype() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.clickLoginButtonEventListener = event => {
      if (this.mdxLoginButton.getAttribute('is-loggedin') === 'false') return
      if (!this.mdxLoginFlyout) return
      event.preventDefault()
      event.stopPropagation()
      if (this.mdxLoginFlyout.hasAttribute('open')) {
        this.mdxLoginFlyout.removeAttribute('open')
      } else {
        this.mdxLoginFlyout.setAttribute('open', 'true')
      }
    }
  }

  connectedCallback () {
    this.hidden = true
    const showPromises = []
    if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
    Promise.all(showPromises).then(() => (this.hidden = false))
    this.addEventListener('click', this.clickLoginButtonEventListener)
    if (!this.mdxLoginFlyoutHTML) this.mdxLoginFlyoutHTML = this.mdxLoginFlyout.outerHTML
  }

  disconnectedCallback () {
    this.removeEventListener('click', this.clickLoginButtonEventListener)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * renders the html
   *
   * @return {Promise<void>}
   */
  renderCSS () {
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
        display: flex;
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
      :host > mdx-component {
        position: relative;
      }
      :host > mdx-component >  mdx-login-button[is-loggedin=false] + mdx-login-flyout {
        display: none;
      }
      :host > mdx-component > mdx-login-flyout {
        position: absolute;
        right: 0;
        top: 100%;
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
      }
    `
    return this.fetchTemplate()
  }

  /**
  * fetches the template
  *
  * @return {Promise<void>}
  */
  fetchTemplate () {
    switch (this.getAttribute('namespace')) {
      case 'login-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }])
    }
    return Promise.resolve()
  }

  get mdxComponent () {
    return this.root.querySelector('mdx-component')
  }

  get mdxLoginButton () {
    return this.root.querySelector('mdx-login-button')
  }

  get mdxLoginFlyout () {
    return this.root.querySelector('mdx-login-flyout')
  }
}
