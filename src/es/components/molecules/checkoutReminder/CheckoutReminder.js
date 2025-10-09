// @ts-check
import Dialog from '../../web-components-toolbox/src/es/components/molecules/dialog/Dialog.js'

/** @typedef {'any' | 'checkout' | 'confirmation'} page */

/**
 * This component covers MIDUWEB-2127/2128/2129 and is a complete component handling all checkout reminder functionality
 * controller, this component does the controller work and communicates with the api, this component does not have a separate controller due to single usage of the api through this one component (unlike the wishlist, which has multiple buttons and views communicating with the api)
 * Use cases:
 *  1. MIDUWEB-2127 - Cancellation Checkout Dialog
 *  2. MIDUWEB-2128 - Cancellation Checkout Confirm "pop-up"
 *  3. MIDUWEB-2129 - Continue Checkout Dialog
 * 
 * Functionalities:
 *  a. Component is placed on base template and triggers different behaviors regarding the page context:
 *    a1. ['any'] Any page - fetch api - has checkout in progress && is new session (has not "checkout is in progress"):
 *      .yes - show: 3. MIDUWEB-2129 - Continue Checkout Dialog
 *    a2. ['checkout'] Any checkout page except confirmation checkout page
 *      a2.1. fetch post api - info to api "checkout is in progress" && session save "checkout is in progress"
 *      a2.2. user navigates away to other page but checkout* by on-page link
 *        .yes - show: 1. MIDUWEB-2127 - Cancellation Checkout Dialog
 *      a2.3. user navigates away to other page but checkout* by closing tab or navigate browser history (forward/back)
 *        .yes - show: 2. MIDUWEB-2128 - Cancellation Checkout Confirm "pop-up"
 *    a3. ['confirmation'] Confirmation checkout page
 *      a3.1. fetch post api - into to api "checkout is completed"
 *    
 *  *other page but checkout: when attribute === 'checkout' then any route but depth https://www.klubschule.ch/kurs/yin-yoga-online--E_1818455_2687_1442/[registration], will be considered as other. Exception: https://login.migros.ch/
 * 
 * Status:
 *  @attribute {page} [page='any'] possible values: 'any' | 'checkout' | 'confirmation'
 * 
* @export
* @class CheckoutReminder
* @type {CustomElementConstructor}
*/
export default class CheckoutReminder extends Dialog {
  constructor (options = {}, ...args) {
    super({ ...options }, ...args)

    this.setAttribute('no-backdrop-close', '')
    this.updateCommandShow()

    let timeout = null
    this.resizeListener = event => {
      this.hidden = true
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.updateCommandShow(true)
        this.updateDraggable()
        this.hidden = false
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
  }

  connectedCallback () {
    this.hidden = true
    if (this.shouldRenderCustomHTML()) this.renderCustomHTML()
    const showPromises = super.connectedCallback()
    if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
    switch (this.getAttribute('page')) {
      case 'any':
        console.log('****CheckoutReminder - any page*****', this)
        // TODO: only when desktop and page === any not for mobile, that is showModal. Also, switch at resize with closing and show or showModal again
        // allowing interaction with content outside of the dialog // https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/show
        showPromises.push(this.dialogPromise.then(dialog => (dialog.innerHTML = /* html */`
          <h3 draggable=true><a-translation data-trans-key="${this.getAttribute('checkout-reminder-continue-title') ?? 'Checkout.Reminder.Continue.Title'}"></a-translation></h3>
          <a-icon-mdx icon-name="Plus" size="2em" rotate="45deg" no-hover-transform></a-icon-mdx>
          <p><a-translation data-trans-key="${this.getAttribute('checkout-reminder-continue-text') ?? 'Checkout.Reminder.Continue.Text'}"></a-translation></p>
          <p>api course text</p>
          <ks-a-button namespace="button-primary-">
            <a-translation data-trans-key="${this.getAttribute('checkout-reminder-continue-return') ?? 'Checkout.Reminder.Cancel.Return'}"></a-translation>
          </ks-a-button>
        `)))
        Promise.all(showPromises).then(() => {
          this.updateDraggable()
          this.hidden = false
          this.show(this.getAttribute('command-show'))
        })
        break
      case 'checkout':
        console.log('****CheckoutReminder - checkout page*****', this)
        showPromises.push(this.dialogPromise.then(dialog => (dialog.innerHTML = /* html */`
          <h3><a-translation data-trans-key="${this.getAttribute('checkout-reminder-cancel-title') ?? 'Checkout.Reminder.Cancel.Title'}"></a-translation></h3>
          <p><a-translation data-trans-key="${this.getAttribute('checkout-reminder-cancel-text') ?? 'Checkout.Reminder.Cancel.Text'}"></a-translation></p>
          <section>
            <ks-m-favorite-button
              no-mobile-view
              button-typ="button-secondary-"
              ${this.hasAttribute('course')
                ? `course="${this.hasAttribute('course')}"`
                : ''
              }
              ${this.hasAttribute('course-type')
                ? `course-type="${this.hasAttribute('course-type')}"`
                : ''
              }
              ${this.hasAttribute('course-id')
                ? `course-id="${this.hasAttribute('course-id')}"`
                : ''
              }
              ${this.hasAttribute('center-id')
                ? `center-id="${this.hasAttribute('center-id')}"`
                : ''
              }
              ${this.hasAttribute('event-data')
                ? `event-data="${this.hasAttribute('event-data')}"`
                : ''
              }
              ${this.hasAttribute('course-data')
                ? `course-data="${this.hasAttribute('course-data')}"`
                : ''
              }
            ></ks-m-favorite-button>
            <ks-a-button namespace="button-primary-">
              <a-translation data-trans-key="${this.getAttribute('checkout-reminder-cancel-continue') ?? 'Checkout.Reminder.Cancel.Continue'}"></a-translation>
            </ks-a-button>
          </section>
          <a href=# class=center>
            <a-translation data-trans-key="${this.getAttribute('checkout-reminder-cancel-cancel') ?? 'Checkout.Reminder.Cancel.Cancel'}"></a-translation>
          </a>
        `)))
        Promise.all(showPromises).then(() => {
          this.hidden = false
          this.show(this.getAttribute('command-show'))
        })
        break
      case 'confirmation':
        console.log('****CheckoutReminder - confirmation page*****', this)
        break
    }
    self.addEventListener('resize', this.resizeListener)
    return showPromises
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    self.removeEventListener('resize', this.resizeListener)
    if (this.h3) {
      this.h3.removeEventListener('dragstart', this.dragStartEventListener)
      document.body.removeEventListener('dragend', this.dragEndEventListener)
    }
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
      :host([page='confirmation']) {
        --show: none;
        display: none !important;
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
        pointer-events: none;
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

  get h3 () {
    return this.root.querySelector(':host > dialog > h3')
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
