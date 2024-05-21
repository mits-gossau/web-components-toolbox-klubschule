// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

/* global history */
/* global location */

/**
* @export
* @class CustomerPortalNavigation
* @type {CustomElementConstructor}
*/
export default class Navigation extends Shadow() {
  /**
   * @param options
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

  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  shouldRenderHTML () {
    return !this.navigationWrapper
  }

  renderCSS () {
    this.css = /* css */`
      :host {
        display:flex;
        margin:0;
      }
      :host ul {
        overflow-x: auto;
      }
      :host li {
        padding:1em 0;
      }
      :host ul li + li {
        margin-left: 1.5em;
      }
      :host .active {
        border-bottom: var(--active-border-bottom, 0);
      }
      @media only screen and (max-width: _max-width_) {
        :host {}
      }
    `
    return this.fetchTemplate()
  }

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
      case 'navigation-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles])
      default:
        return this.fetchCSS(styles)
    }
  }

  renderHTML () {
    const fetchModules = this.fetchModules([
      {
        path: `${this.importMetaUrl}'../../../../../../../es/components/molecules/tab/Tab.js`,
        name: 'ks-m-tab'
      }
    ])
    this.navigationWrapper = this.root.querySelector('div') || document.createElement('div')
    Promise.all([fetchModules]).then(() => {
      this.html = /* html */ `
          <ul>
            <li>
              <a href="/" route target="_self">Abo-Termine buchen</a>
            </li>
            <li>
              <a href="/booked" route target="_self">Gebuchte Termine</a>
            </li>
            <li>
              <a href="/subscriptions" route target="_self">Meine Abonnemente</a>
            </li>
          </ul>
      `
    })
  }
}
