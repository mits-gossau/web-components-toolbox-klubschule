// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Counter
* @type {CustomElementConstructor}
*/
export default class Counter extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this.counter = 0
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML(0)
    document.body.addEventListener(this.getAttribute('update-counter') || 'update-counter', this.updateCounterListener)
  }

  disconnectedCallback () {
    document.body.removeEventListener(this.getAttribute('update-counter') || 'update-counter', this.updateCounterListener)
  }

  updateCounterListener = (event) => {
    let counter = event.detail.counter
    if (event.detail.type === 'decrement') {
      counter = this.counter - 1
    }
    this.counter = counter
    this.renderHTML(this.counter)
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
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML () {
    return !this.element
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host {}
      @media only screen and (max-width: _max-width_) {
        :host {}
      }
    `
    return this.fetchTemplate()
  }

  /**
   * fetches the template
   */
  fetchTemplate () {
    /** @type {import("../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js").fetchCSSParams[]} */
    const styles = [
      {
        path: `${this.importMetaUrl}../../../../../es/components/web-components-toolbox/src/css/reset.css`, // no variables for this reason no namespace
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../../../../es/components/web-components-toolbox/src/css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: true
      }
    ]
    switch (this.getAttribute('namespace')) {
      case 'counter-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles])
      default:
        return this.fetchCSS(styles)
    }
  }

  /**
   * Render HTML
   * @param {Number} counter
   * @returns void
   */
  renderHTML (counter) {
    const { headingType, listType, bookedSubscriptionsText, appointmentsText } = this.dataset
    this.element = this.root.querySelector(headingType) || document.createElement(headingType)
    let txt = appointmentsText
    if (listType === 'booked-appointments') txt = bookedSubscriptionsText
    this.element.innerText = `${counter} ${txt}`
    this.html = this.element
  }
}
