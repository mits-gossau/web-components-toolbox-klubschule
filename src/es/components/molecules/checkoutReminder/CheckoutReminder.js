// @ts-check
import Dialog from '../../web-components-toolbox/src/es/components/molecules/dialog/Dialog.js'

/** @typedef {'any' | 'checkout'} page */

/**
 * This component covers MIDUWEB-2127/2128/2129 and is a complete component handling all checkout reminder functionality
 * controller, this component does the controller work and communicates with the api, this component does not have a separate controller due to single usage of the api through this one component (unlike the wishlist, which has multiple buttons and views communicating with the api)
 * Use cases:
 *  1. MIDUWEB-2127 - Cancellation Checkout Dialog
 *  2. MIDUWEB-2128 - Cancellation Checkout Confirm "pop-up"
 *  3. MIDUWEB-2129 - Continue Checkout Dialog
 * 
 * TODO: readme and comments
 * TODO: linter
 * 
 * Status:
 *  @attribute {page} [page='any'] possible values: 'any' | 'checkout'
 * 
 * @export
 * @class CheckoutReminder
 * @type {CustomElementConstructor}
*/
export default class CheckoutReminder extends Dialog {
  #selfOpen
  constructor (options = {}, ...args) {
    super({ namespace: 'checkout-reminder-default-', tabindex: 'no-tabindex', ...options }, ...args)

    this.updateCommandShow()

    let timeout = null
    this.resizeListener = event => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.updateCommandShow(true)
        this.updateDraggable()
      }, 200)
    }

    let offsetX, offsetY
    this.dragStartEventListener = event => {
      const rect = this.dialog.getBoundingClientRect()
      offsetX = event.clientX - rect.x
      offsetY = event.clientY - rect.y
      event.dataTransfer.setDragImage(this.dialog, offsetX, offsetY)
    }
    this.dragEndEventListener = event => {
      this.customStyle.textContent = /* css */`
        :host([page='any'][command-show='show']) > dialog:has(>h3[draggable]) {
          top: ${event.clientY - offsetY}px;
          right: auto;
          bottom: auto;
          left: ${event.clientX - offsetX}px;
        }
      `
    }

    this.clickEventListener = event => event.stopPropagation()

    this.checkoutReminderAnyCancelEventListener = event => {
      this.dataLayerPush({
        'event': 'popup_click',
        'popup_name': 'Bestellfortsatz',
        'popup_type': 'Website',
        'button_name': 'close',
        'logged_in': this.hasAttribute('is-logged-in')
      })
      this.close()
      this.fetch('Clear')
    }
    this.checkoutReminderAnyReturnEventListener = event => {
      this.dataLayerPush({
        'event': 'popup_click',
        'popup_name': 'Bestellfortsatz',
        'popup_type': 'Website',
        'button_name': 'to_course_details',
        'logged_in': this.hasAttribute('is-logged-in')
      })
      this.close()
    }
    this.checkoutReminderAddToWishListEventListener = event => {
      this.dataLayerPush({
        'event': 'popup_click',
        'popup_name': 'Bestellabbruch',
        'popup_type': 'Website',
        'button_name': 'add_to_wishlist',
        'logged_in': this.hasAttribute('is-logged-in')
      })
    }
    this.checkoutReminderCheckoutContinueEventListener = event => {
      this.dataLayerPush({
        'event': 'popup_click',
        'popup_name': 'Bestellabbruch',
        'popup_type': 'Website',
        'button_name': 'continue_checkout',
        'logged_in': this.hasAttribute('is-logged-in')
      })
      this.close()
    }
    this.checkoutReminderCheckoutCancelEventListener = event => {
      this.dataLayerPush({
        'event': 'popup_click',
        'popup_name': 'Bestellabbruch',
        'popup_type': 'Website',
        'button_name': 'stop_checkout',
        'logged_in': this.hasAttribute('is-logged-in')
      })
      self.removeEventListener('beforeunload', this.beforeunloadEventListener)
      this.close()
    }

    this.beforeunloadEventListener = event => {
      this.dataLayerPush({
        'event': 'popup_view',
        'popup_name': 'Bestellabbruch',
        'popup_type': 'Browser',
        'logged_in': this.hasAttribute('is-logged-in')
      })
      let beforeunloadTimeout = null
      // this event is triggered when page is not unloaded (cancel) as well as when it is unloaded. visibilitychange is triggered slightly after, which is the clear indication for unload and that will cancel the timeout in this event.
      const focusEventListener = event => {
        beforeunloadTimeout = setTimeout(() => {
          this.dataLayerPush({
            'event': 'popup_click',
            'popup_name': 'Bestellabbruch',
            'popup_type': 'Browser',
            'button_name': 'continue_checkout',
            'logged_in': this.hasAttribute('is-logged-in')
          })
          if (this.dialog?.hasAttribute('open')) this.checkoutReminderCheckoutContinueEventListener()
          document.removeEventListener('visibilitychange', visibilitychangeEventListener)
        }, 200);
      }
      self.addEventListener('focus', focusEventListener, { once: true })
      // this event is triggered when page is unloaded (cancel)
      const visibilitychangeEventListener = event => {
        if (document.visibilityState === 'hidden') {
          this.dataLayerPush({
            'event': 'popup_click',
            'popup_name': 'Bestellabbruch',
            'popup_type': 'Browser',
            'button_name': 'stop_checkout',
            'logged_in': this.hasAttribute('is-logged-in')
          })
          if (this.dialog?.hasAttribute('open')) this.checkoutReminderCheckoutCancelEventListener()
          self.removeEventListener('focus', focusEventListener)
          clearTimeout(beforeunloadTimeout)
        }
      }
      document.addEventListener('visibilitychange', visibilitychangeEventListener, { once: true })
      event.preventDefault()
      event.returnValue = true
    }

    this.documentBodyClickEventListener = event => {
      let link
      if ((link = event.composedPath().find(node => typeof node.getAttribute === 'function' && node.getAttribute('href')))) {
        if (this.preventDefaultNavigation(link.getAttribute('href'), link.getAttribute('target'))) {
          event.stopPropagation()
          event.preventDefault()
        } else {
          self.removeEventListener('beforeunload', this.beforeunloadEventListener)
        }
      } 
    }

    this.formSubmitEventListener = event => self.removeEventListener('beforeunload', this.beforeunloadEventListener)
  }

  connectedCallback () {
    this.hidden = true
    const showPromises = []
    if (this.shouldRenderCustomHTML()) showPromises.push(this.renderCustomHTML())
    showPromises.concat(super.connectedCallback())
    if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
    switch (this.getAttribute('page')) {
      case 'any':
        showPromises.push(this.dialogPromise.then(dialog => this.fetch('Check').then(json => {
          /*
            STATUS Message
            ---- Veranstaltung ----
            – 10=Verfügbar (E/1K noch vorhanden) 
            – 11=Alternativkurs an gleichem Standort (anderes E/1K) 
            – 12=Auf Anfrage (nur D/0K vorhanden)
            – 13=Alternativkurs wieder verfügbar (D/0K hat wieder Veranstaltungen) 
            ---- Angebot ----
            – 20=Verfügbar (D/0K)
            ---- Abonnement ----
            – 30=Verfügbar (6A)
          */
          dialog.innerHTML = /* html */`
            <h3 draggable=true><a-translation data-trans-key="${this.getAttribute('checkout-reminder-any-title') ?? `Checkout.Reminder.Any.Title${json.uncompletedOrder?.messageNumber || ''}`}"></a-translation></h3>
            <a-icon-mdx id=checkout-reminder-any-cancel icon-name="Plus" size="2em" rotate="45deg" no-hover-transform></a-icon-mdx>
            <p><a-translation data-trans-key="${this.getAttribute('checkout-reminder-any-text') ?? `Checkout.Reminder.Any.Text${json.uncompletedOrder?.messageNumber || ''}`}"></a-translation></p>
            <p>${json.message || ''}</p>
            <ks-a-button id=checkout-reminder-any-return namespace="button-primary-" href="${json.uncompletedOrder?.kursUrl || ''}">
              <a-translation data-trans-key="${this.getAttribute('checkout-reminder-any-return') ?? `Checkout.Reminder.Any.Return${json.uncompletedOrder?.messageNumber || ''}`}"></a-translation>
            </ks-a-button>
          `
          return json
        })))
        Promise.all(showPromises).then(data => {
          // TODO: Also check if API handles at same browser session requirement
          if (!data.find(json => json.uncompletedOrderExists && !json.uncompletedOrderSameSession)) return
          this.updateDraggable()
          if (this.isConnected) {
            this.checkoutReminderAnyCancel.addEventListener('click', this.checkoutReminderAnyCancelEventListener)
            this.addEventListener(this.getAttribute('backdrop-clicked') || 'backdrop-clicked', this.checkoutReminderAnyCancelEventListener)
            this.checkoutReminderAnyReturn.addEventListener('click', this.checkoutReminderAnyReturnEventListener)
          }
          this.dataLayerPush({
            'event': 'popup_view',
            'popup_name': 'Bestellfortsatz',
            'popup_type': 'Website',
            'logged_in': this.hasAttribute('is-logged-in')
          })
          this.hidden = false
          this.show(this.getAttribute('command-show'))
        })
        break
      case 'checkout':
        this.setAttribute('no-backdrop-close', '')
        showPromises.push(this.dialogPromise.then(dialog => dialog.innerHTML = /* html */`
          <h3><a-translation data-trans-key="${this.getAttribute('checkout-reminder-checkout-title') ?? 'Checkout.Reminder.Checkout.Title'}"></a-translation></h3>
          <p><a-translation data-trans-key="${this.getAttribute('checkout-reminder-checkout-text') ?? 'Checkout.Reminder.Checkout.Text'}"></a-translation></p>
          <section>
            <ks-m-favorite-button
              no-mobile-view
              button-typ="button-secondary-"
              ${this.hasAttribute('course')
                ? `course="${this.getAttribute('course')}"`
                : ''
              }
              ${this.hasAttribute('course-type')
                ? `course-type="${this.getAttribute('course-type')}"`
                : ''
              }
              ${this.hasAttribute('course-id')
                ? `course-id="${this.getAttribute('course-id')}"`
                : ''
              }
              ${this.hasAttribute('center-id')
                ? `center-id="${this.getAttribute('center-id')}"`
                : ''
              }
              ${this.hasAttribute('event-data')
                ? `event-data="${this.getAttribute('event-data')}"`
                : ''
              }
              ${this.hasAttribute('course-data')
                ? `course-data="${this.getAttribute('course-data')}"`
                : ''
              }
            ></ks-m-favorite-button>
            <ks-a-button id=checkout-reminder-checkout-continue namespace="button-primary-">
              <a-translation data-trans-key="${this.getAttribute('checkout-reminder-checkout-continue') ?? 'Checkout.Reminder.Checkout.Continue'}"></a-translation>
            </ks-a-button>
          </section>
          <a id=checkout-reminder-checkout-cancel href=# class=center>
            <a-translation data-trans-key="${this.getAttribute('checkout-reminder-checkout-cancel') ?? 'Checkout.Reminder.Checkout.Cancel'}"></a-translation>
          </a>
        `))
        // NOTE: Listening to popstate does not work, since the history routes were not set by the history js functions
        self.addEventListener('beforeunload', this.beforeunloadEventListener)
        document.body.addEventListener('click', this.documentBodyClickEventListener)
        document.body.addEventListener('form-submit', this.formSubmitEventListener)
        // overwrite self.open, since that is used at MultiLevelNavigation to open links
        this.#selfOpen = self.open
        // @ts-ignore
        self.open = (url, target, features) => {
          if (!this.preventDefaultNavigation(url, target)) {
            self.removeEventListener('beforeunload', this.beforeunloadEventListener)
            this.#selfOpen(url, target, features)
          }
        }
        Promise.all(showPromises).then(() => {
          if (this.isConnected) {
            this.checkoutReminderCheckoutContinue.addEventListener('click', this.checkoutReminderCheckoutContinueEventListener)
            this.checkoutReminderCheckoutCancel.addEventListener('click', this.checkoutReminderCheckoutCancelEventListener)
            this.checkoutReminderAddToWishList.addEventListener('add-to-wish-list', this.checkoutReminderAddToWishListEventListener)
          }
        })
        break
    }
    this.addEventListener('click', this.clickEventListener)
    self.addEventListener('resize', this.resizeListener)
    return showPromises
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    if (this.h3) {
      this.h3.removeEventListener('dragstart', this.dragStartEventListener)
      document.body.removeEventListener('dragend', this.dragEndEventListener)
    }
    switch (this.getAttribute('page')) {
      case 'any':
        if (this.checkoutReminderAnyCancel) this.checkoutReminderAnyCancel.removeEventListener('click', this.checkoutReminderAnyCancelEventListener)
        this.removeEventListener(this.getAttribute('backdrop-clicked') || 'backdrop-clicked', this.checkoutReminderAnyCancelEventListener)
        if (this.checkoutReminderAnyReturn) this.checkoutReminderAnyReturn.removeEventListener('click', this.checkoutReminderAnyReturnEventListener)
        break
      case 'checkout':
        self.removeEventListener('beforeunload', this.beforeunloadEventListener)
        document.body.removeEventListener('click', this.documentBodyClickEventListener)
        document.body.removeEventListener('form-submit', this.formSubmitEventListener)
        self.open = this.#selfOpen
        if (this.checkoutReminderCheckoutContinue) this.checkoutReminderCheckoutContinue.removeEventListener('click', this.checkoutReminderCheckoutContinueEventListener)
        if (this.checkoutReminderCheckoutCancel) this.checkoutReminderCheckoutCancel.removeEventListener('click', this.checkoutReminderCheckoutCancelEventListener)
        if (this.checkoutReminderAddToWishList) this.checkoutReminderAddToWishList.removeEventListener('add-to-wish-list', this.checkoutReminderAddToWishListEventListener)
        break
    }
    this.removeEventListener('click', this.clickEventListener)
    self.removeEventListener('resize', this.resizeListener)
  }

  /**
     * evaluates if a render is necessary
     *
     * @return {boolean}
     */
  shouldRenderCustomHTML () {
    return !this.root.querySelector(this.cssSelector + ' > dialog')
  }

  /**
   * renders the css
   * @returns Promise<void>
   */
  renderCSS () {
    const result = super.renderCSS()
    // has not namespace
    this.setCss(/* css */`
      :host {
        display: contents !important;
      }
      :host > dialog {
        border: 0;
        box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.25); /* should be: var(--box-shadow); */
        padding: 0;
        width: 52.6dvw;
      }
      :host([page='any'][command-show='show']) > dialog {
        bottom: var(--mdx-sys-spacing-flex-large-xs);
        left: auto;
        position: fixed;
        right: var(--mdx-sys-spacing-flex-large-xs);
        top: auto;
        z-index: 1000000000;
      }
      :host([page='any'][command-show='show']) > dialog > h3 {
        cursor: pointer;
      }
      :host([page='any']) > dialog > p:empty {
        display: none;
      }
      :host([page='any']) > dialog > p:first-of-type {
        --p-margin: 0 auto 1rem;
      }
      :host([page='any']) > dialog > ks-a-button {
        width: 100%;
      }
      :host([page='any'][command-show='show-modal']) > dialog {
        --button-primary-width: 100%;
        --button-secondary-width: 100%;
      }
      :host > dialog::backdrop {
        cursor: initial;
        background-color: var(--dialog-background-color, rgb(0 0 0 / 0));
        backdrop-filter: var(--dialog-backdrop-filter, none);
        transition:
          display var(--dialog-transition-duration, 0.3s) allow-discrete,
          overlay var(--dialog-transition-duration, 0.3s) allow-discrete,
          background-color var(--dialog-transition-duration, 0.3s),
          backdrop-filter var(--dialog-transition-duration, 0.3s);
      }
      :host > dialog[open]::backdrop {
        background-color: var(--dialog-background-color-open, var(--dialog-background-color, rgb(0 0 0 / 0.5)));
        backdrop-filter: var(--dialog-backdrop-filter-open, var(--dialog-backdrop-filter, none));
      }
      :host > dialog > *:first-child {
        padding-top: var(--mdx-sys-spacing-flex-large-xs);
      }
      :host > dialog > * {
        padding-left: var(--mdx-sys-spacing-flex-large-xs) !important;
        padding-right: var(--mdx-sys-spacing-flex-large-xs) !important;
      }
      :host > dialog > *:last-child {
        padding-bottom: var(--mdx-sys-spacing-fix-l);
      }
      :host > dialog > h3 {
        --h3-text-align: center;
        border-bottom: 1px solid #E0E0E0;
        margin-bottom: var(--mdx-sys-spacing-flex-large-xs);
        padding-bottom: var(--mdx-sys-spacing-flex-large-xs);
      }
      :host > dialog > a-icon-mdx {
        bottom: auto;
        display: block;
        left: auto;
        padding: 0 !important;
        position: absolute;
        right: calc(var(--mdx-sys-spacing-flex-large-xs) - 5px);
        top: calc(var(--mdx-sys-spacing-flex-large-xs) - 5px);
      }
      :host > dialog > section {
        --button-primary-width: 100%;
        --button-secondary-width: 100%;
        display: flex;
        gap: var(--mdx-sys-spacing-flex-large-xs);
      }
      :host > dialog > section > * {
        flex: 1;
      }
      :host > dialog > section > ks-m-favorite-button::part(ks-a-button) {
        --button-secondary-not-label-flex-grow: 0;
        width: 100%;
      }
      :host > dialog > a {
        --a-margin: var(--mdx-sys-spacing-fix-l) 0 0;
        --any-a-display: block;
      }
      :host > dialog > a > a-translation {
        text-decoration: underline;
      }
      @media only screen and (max-width: _max-width_) {
        :host > dialog > *:first-child {
          padding-top: var(--mdx-sys-spacing-flex-small-xs);
        }
        :host > dialog > * {
          padding-left: var(--mdx-sys-spacing-flex-small-xs) !important;
          padding-right: var(--mdx-sys-spacing-flex-small-xs) !important;
        }
        :host > dialog > a-icon-mdx {
          right: calc(var(--mdx-sys-spacing-flex-small-xs) - 5px);
          top: calc(var(--mdx-sys-spacing-flex-small-xs) - 5px);
        }
        :host > dialog > h3 {
          padding-bottom: var(--mdx-sys-spacing-flex-small-xs);
        }
        :host > dialog {
          bottom: 0;
          margin: 0;
          max-width: inherit;
          top: auto;
          width: 100dvw;
        }
        :host > dialog > section {
          flex-direction: column;
        }
        :host > dialog > section > ks-m-favorite-button::part(text) {
          display: block;
        }
        :host > dialog > a {
          --a-margin: var(--mdx-sys-spacing-flex-large-xs) 0 0;
        }
      }
    `, undefined, false)
    return result
  }

  /**
   * Render HTML
   * @returns Promise<void>
   */
  renderCustomHTML () {
    this.html = /* html */`<dialog></dialog>`
    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../../../../../atoms/button/Button.js`,
        name: 'ks-a-button'
      },
      {
        path: `${this.importMetaUrl}../../../../../../molecules/favoriteButton/FavoriteButton.js`,
        name: 'ks-m-favorite-button'
      },
      {
        path: `${this.importMetaUrl}../../atoms/translation/Translation.js`,
        name: 'a-translation'
      },
      {
        path: `${this.importMetaUrl}../../atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ])
  }

  updateCommandShow (updateCommand = false) {
    if (this.getAttribute('page') === 'any' && !this.isMobile) {
      this.setAttribute('command-show', 'show')
    } else {
      this.setAttribute('command-show', 'show-modal')
    }
    if (updateCommand) this.dialogPromise.then(dialog => {
      if (dialog.hasAttribute('open')) this.close().then(() => this.show(this.getAttribute('command-show')))
    })
  }

  updateDraggable () {
    if (this.h3?.hasAttribute('draggable')) {
      if (this.isMobile) {
        this.h3.removeEventListener('dragstart', this.dragStartEventListener)
        document.body.removeEventListener('dragend', this.dragEndEventListener)
        this.customStyle.remove()
      } else {
        this.h3.addEventListener('dragstart', this.dragStartEventListener)
        document.body.addEventListener('dragend', this.dragEndEventListener)
        this.html = this.customStyle
      }
    }
  }

  fetch (route) {
    const successCode = 0
    return fetch(`${this.getAttribute('endpoint') || 'https://int.klubschule.ch/umbraco/api/UncompletedOrderApi/'}${route}`, {
      method: 'GET',
    }).then(response => {
      if (response.status >= 200 && response.status <= 299) return route === 'Check' ? response.json() : true
      throw new Error(response.statusText)
    }).then(json => {
      if (json === true) return json
      if (json.code === successCode) {
        if (json.uncompletedOrder) {
          // attributes used at ks-m-favorite-button and gtm
          this.setAttribute('course-id', json.uncompletedOrder.kursId)
          this.setAttribute('course-type', json.uncompletedOrder.kursTyp)
          this.setAttribute('course-url', json.uncompletedOrder.kursUrl)
          this.setAttribute('center-id', json.uncompletedOrder.centerId)
        }
        return json
      } else {
        throw new Error(json.errors)
      }
    })
  }

  /**
   * Prevent link navigation default behavior by showing the dialog
   * 
   * @param {string | URL | undefined} href
   * @param {string | undefined} target
   * @returns {boolean}
   */
  preventDefaultNavigation (href, target) {
    if (target  === '_blank') return false
    let url
    if (href instanceof URL) {
      url = href
    } else if(typeof href === 'string') {
      try {
        url = new URL(href, location.origin)
      } catch (error) {}
    }
    // check if the page would stay inside the course checkout route. Expl.: https://www.klubschule.ch/kurs/yin-yoga-online--E_1818455_2687_1442/loginmethod becomes through the regex https://www.klubschule.ch/kurs/yin-yoga-online--E_1818455_2687_1442 which is included in https://www.klubschule.ch/kurs/yin-yoga-online--E_1818455_2687_1442/registration, etc.
    if (url) {
      if (this.hasAttribute('inside-route') && this.getAttribute('inside-route').some(str => url.origin.includes(str.trim()))) {
        return false
      } else {
        if (url.origin.includes('login.migros')) return false
        if (url.origin.includes('datatrans.com')) return false
      }
      if (url.pathname.includes(location.pathname.replace(/(.*)(\/.*)/, '$1'))) return false
    }
    this.dataLayerPush({
      'event': 'popup_view',
      'popup_name': 'Bestellabbruch',
      'popup_type': 'Website',
      'logged_in': this.hasAttribute('is-logged-in')
    })
    this.checkoutReminderCheckoutCancel.setAttribute('href', href)
    this.hidden = false
    this.show(this.getAttribute('command-show'))
    return true
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

  get h3 () {
    return this.root.querySelector(':host > dialog > h3')
  }

  // returns the page === any close icon
  get checkoutReminderAnyCancel () {
    return this.root.querySelector('#checkout-reminder-any-cancel')
  }

  // returns the page === any return to checkout button
  get checkoutReminderAnyReturn () {
    return this.root.querySelector('#checkout-reminder-any-return')
  }

  // returns the page === checkout favorite at checkout button
  get checkoutReminderAddToWishList () {
    return this.root.querySelector('ks-m-favorite-button')
  }

  // returns the page === checkout continue at checkout button
  get checkoutReminderCheckoutContinue () {
    return this.root.querySelector('#checkout-reminder-checkout-continue')
  }

  // returns the page === checkout cancel checkout link
  get checkoutReminderCheckoutCancel () {
    return this.root.querySelector('#checkout-reminder-checkout-cancel')
  }

  get isMobile () {
    return self.matchMedia(`(max-width: ${this.mobileBreakpoint})`).matches
  }

  get customStyle () {
    return (
      this._customStyle ||
        (this._customStyle = (() => {
          const style = document.createElement('style')
          style.setAttribute('_css', '')
          return style
        })())
    )
  }
}
