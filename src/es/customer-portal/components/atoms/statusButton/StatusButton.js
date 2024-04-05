// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

/* global history */
/* global location */

/**
* @export
* @class StatusButton
* @type {CustomElementConstructor}
*/
export default class StatusButton extends Shadow() {
  /**
   * @param {any} args
   */
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.clickEventListener = event => {
      event.preventDefault()
      event.stopPropagation()
      const target = event.composedPath()[0]
      if (target.tagName === 'A') {
        const url = new URL(location.href)
        url.searchParams.set('page', target.getAttribute('href'))
        console.log('changed', new URL(url.href))
        history.pushState(history.state, document.title, url.href)
      }
    }
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
    this.addEventListener('click', this.clickEventListener)
  }

  disconnectedCallback () {
    this.removeEventListener('click', this.clickEventListener)
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
    return !this.wrapper
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        display:flex;
        background-color:#dfdfdf;
      }
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
      case 'status-button-default-':
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
   * @returns void
   */
  renderHTML () {
    this.wrapper = this.root.querySelector('div') || document.createElement('div')
    this.html = /* html */ `
      <div>
        <ks-a-button namespace="button-primary-"  request-event-name="request-subscription-course-appointment-detail" tag='' color="secondary">Termin buchen</ks-a-button>
      </div>
    `
  }
}
