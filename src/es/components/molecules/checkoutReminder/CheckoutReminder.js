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

    
    if (this.getAttribute('page') === 'any') {
      
      this.setAttribute('command-show', 'show')
    } else {
      this.setAttribute('command-show', 'show-modal')
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
        this.dialogPromise.then(dialog => (dialog.textContent = '****CheckoutReminder - any page*****'))
        this.show('show')
        Promise.all(showPromises).then(() => (this.hidden = false))
        break
      case 'checkout':
        console.log('****CheckoutReminder - checkout page*****', this)
        this.dialogPromise.then(dialog => (dialog.textContent = '****CheckoutReminder - checkout page*****'))
        this.show('showModal')
        Promise.all(showPromises).then(() => (this.hidden = false))
        break
      case 'confirmation':
        console.log('****CheckoutReminder - confirmation page*****', this)
        break
    }
    return showPromises
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
      :host > dialog::backdrop {
        cursor: initial;
        pointer-events: none;
      }
      @media only screen and (max-width: _max-width_) {
        :host {}
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
      }
    ])
  }
}
