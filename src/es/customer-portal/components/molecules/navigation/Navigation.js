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
      if (target.tagName === 'A' || target.tagName === 'A-TRANSLATION') {
        this.updateActiveStates(target.parentElement.parentElement)
        const url = new URL(location.href)
        url.searchParams.set('page', target.getAttribute('href'))
        history.pushState(history.state, document.title, url.href)
      }
    }
  }

  updateActiveStates (currentElement = null) {
    const links = this.root.querySelectorAll('li')
    const linkElements = Array.from(links)
    if (!currentElement) {
      linkElements[0].classList.add('active')
      return
    }
    linkElements.forEach(link => {
      // @ts-ignore
      if (link.classList.contains('active') && link.id !== currentElement.id) link.classList.remove('active')
      // @ts-ignore
      if (link.id === currentElement.id) link.classList.add('active')
    })
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
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  shouldRenderHTML () {
    return !this.navigationWrapper
  }

  renderCSS () {
    this.css = /* css */`
      :host {
        --any-content-width: 100%;
        --any-content-width-mobile: 100%;
        display:flex;
        margin:0 auto !important;
        background:white;
        width:100% !important;
      }
      :host ul.nav {
        width: var(--ul-width);
        margin: 0 auto;
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
      :host .active > a {
        color:var(--a-active-color, inherit);
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
        path: `${this.importMetaUrl}../../../../components/web-components-toolbox/src/es/components/atoms/translation/Translation.js`,
        name: 'a-translation'
      }
    ])
    this.navigationWrapper = this.root.querySelector('div') || document.createElement('div')
    Promise.all([fetchModules]).then(() => {
      this.html = /* html */ `
          <ul class="nav">
            <li id="1">
              <a href="/" route target="_self">
                <a-translation href="/" route target="_self"  data-trans-key='CP.cpNavigationAppointmentsBooking'></a-translation>
              </a>
            </li>
            <li id="2">
              <a href="/booked" route target="_self">
                <a-translation href="/booked" route target="_self" data-trans-key='CP.cpNavigationBookedAppointments'></a-translation>
              </a>
            </li>
            <li id="3">
              <a href="/subscriptions" route target="_self">
                <a-translation href="/subscriptions" route target="_self" data-trans-key='CP.cpNavigationMySubscriptions' mode="false"></a-translation>
              </a>
            </li>
          </ul>
      `
    }).then(_ => {
      this.updateActiveStates()
    })
  }
}
