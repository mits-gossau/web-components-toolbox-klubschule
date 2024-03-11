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
 *  {"de"|"fr"|"it"|"en"} [language=document.documentElement.getAttribute('lang') || 'de']
 *  {string|DeepPartial<ThemeInterface>|
 *    "melectronics"|
 *    "bikeworld"|
 *    "daily"|
 *    "doitGarden"|
 *    "exlibris"|
 *    "exlibrispickmup"|
 *    "interio"|
 *    "micasa"|
 *    "migrosService"|
 *    "sportxx"|
 *    "migipedia"|
 *    "migrosApp"|
 *    "alnatura"|
 *    "gesundheitsplattform"|
 *    "intercity"|
 *    "famigros"|
 *    "migrosbank"|
 *    "pickmup"|
 *    "voi"|
 *    "fitnesspark"|
 *    "mgb"|
 *    "migusto"} [theme="alnatura"]
 *  {string} [account="document.documentElement.getAttribute('account') || ''"]
 *  {string} [contact-link="document.documentElement.getAttribute('contact-link') || ''"]
 *  {string} [contact-link-label="document.documentElement.getAttribute('contact-link-label') || ''"]
 *  {"large"|"medium"|"small"} [size="small"]
 *  {string} [loginReturnTo="self.location"]
 *  {string} [logoutReturnTo="self.location"]
 *  {string|Partial<{
 *    authority: string,
 *    language: string,
 *    clientId: string,
 *    clientSecret: string,
 *    redirectURI: string,
 *    scope: string,
 *    claims: { userinfo: { given_name: null, family_name: null, email: null } }
 *  }>} [setup="{}"]
 *
 * }
 */
export default class Login extends Prototype() {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.requestMsrcUserListener = event => {
      if (event.detail.resolve) {
        event.detail.resolve(this.user)
      } else {
        this.dispatchEvent(new CustomEvent(this.getAttribute('msrc-user') || 'msrc-user', {
          detail: {
            origEvent: event,
            user: this.user,
            this: this
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }))
      }
    }
  }

  connectedCallback() {
    this.hidden = true
    const showPromises = []
    if (this.shouldRender()) showPromises.push(this.render())
    Promise.all(showPromises).then(() => (this.hidden = false))
    document.body.addEventListener(this.getAttribute('request-msrc-user') || 'request-msrc-user', this.requestMsrcUserListener)

    this.isCheckout = this.parentElement.getAttribute('is-checkout') === 'true'
    if (this.isCheckout) this.root.querySelector('section').style.display = 'none'
  }

  disconnectedCallback() {
    document.body.removeEventListener(this.getAttribute('request-msrc-user') || 'request-msrc-user', this.requestMsrcUserListener)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRender() {
    return !this.msrcLoginButtonWrapper
  }

  /**
   * renders the html
   *
   * @return {Promise<void>}
   */
  render() {
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
    this.fetchTemplate()
    this.msrcLoginButtonWrapper = this.root.querySelector('div') || document.createElement('div')
    // subscribe to login:authenticate user by calling the getter before starting any msrc stuff
    return this.loadDependency().then(async msrc => {
      // subscribe before login | https://jira.migros.net/browse/MUTOBOTEAM-1964
      this.initUser()
      // Setup OIDC login configuration
      await msrc.utilities.login.setup(this.constructor.parseAttribute(this.getAttribute('setup') || '{}'))
      // Initialize the login button
      await msrc.components.login[this.hasAttribute('profile-flyout')
        ? 'profileFlyout'
        : 'button'](this.msrcLoginButtonWrapper, {
          language: this.getAttribute('language') || self.Environment.language,
          theme: this.getAttribute('theme') || 'alnatura',
          size: this.getAttribute('size') || 'small',
          loginReturnTo: this.getAttribute('loginReturnTo') || '',
          logoutReturnTo: this.getAttribute('logoutReturnTo') || '',
          headerHeight: { mobile: '26px' },
          inlinks: {
            account: this.getAttribute('account') || ''
          },
          links: [{ label: this.getAttribute('contact-link-label') || '', link: this.getAttribute('contact-link') || '' }]
        })
      const getStylesReturn = this.getStyles(document.createElement('style'))
      getStylesReturn[1].then(() => {
        let button
        if ((button = this.msrcLoginButtonWrapper.querySelector('button'))) button.classList.add('font-size-tiny')
      })
      this.html = [this.msrcLoginButtonWrapper, getStylesReturn[0]]
      return getStylesReturn[1] // use this line if css build up should be avoided
    })
  }

  /**
  * fetches the template
  *
  * @return {void}
  */
  fetchTemplate() {
    switch (this.getAttribute('namespace')) {
      case 'login-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }])
    }
  }

  initUser() {
    return this.user
  }

  get user() {
    return this.userPromise || (this.userPromise = new Promise(async resolve => { // eslint-disable-line
      const msrc = await this.loadDependency()
      // https://react-components.migros.ch/?path=/docs/msrc-login-00-readme--page#events
      const instance = await msrc.messenger.getInstance()
      // in case the subscribe event login:authenticate does not fire
      const timeoutId = setTimeout(() => resolve(msrc.utilities.login.getUser()), 3000)
      instance.subscribe('login:authenticate', ({ isManualLogin, loggedIn, error }) => {
        clearTimeout(timeoutId)
        resolve(msrc.utilities.login.getUser())
      })
    }))
  }
}
