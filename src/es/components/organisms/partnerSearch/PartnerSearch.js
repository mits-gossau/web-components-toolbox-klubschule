// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * Communicates with the src/es/components/controllers/partnerSearch/PartnerSearch.js controller
 * 
 * @export
 * @class PartnerSearch
 * @type {CustomElementConstructor}
 */
export default class PartnerSearch extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.hiddenMessages = this.hiddenSections
    this.partnerSearchListener = event => this.renderHTML(event.detail.fetch)
  }

  connectedCallback () {
    this.hidden = true
    const showPromises = []
    if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
    if (this.shouldRenderHTML()) showPromises.push(this.renderHTML())
    Promise.all(showPromises).then(() => (this.hidden = false))
    document.body.addEventListener('partner-search', this.partnerSearchListener)
    new Promise(resolve => this.dispatchEvent(new CustomEvent('request-partner-search', {
      detail: {
        searchText: this.getAttribute('search-text'),
        resolve
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))).then(fetch => this.renderHTML(fetch))
  }

  disconnectedCallback () {
    document.body.removeEventListener('partner-search', this.partnerSearchListener)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML () {
    // TODO: check for something like this.sections
    return !this.loadingBar && !this.sections
  }

  /**
   * renders the css
   * @return {Promise<void>}
   */
  renderCSS () {
    this.css = /* css */``
    return this.fetchTemplate()
  }

  /**
   * fetches the template
   * @return {Promise<void>}
   */
  fetchTemplate () {
    /** @type {import("../../web-components-toolbox/src/es/components/prototypes/Shadow.js").fetchCSSParams[]} */
    const styles = [
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/reset.css`, // no variables for this reason no namespace
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: true
      }
    ]
    switch (this.getAttribute('namespace')) {
      default:
        return this.fetchCSS(styles)
    }
  }

  /**
   * Render HTML
   * @param {Promise<{}>} [fetch=undefined]
   * @return {Promise<void>}
   */
  async renderHTML (fetch) {
    this.html = ''
    this.renderLoading()
    if (fetch) {
      console.log('*********', fetch, this.hiddenMessages)
      // fetch.catch(error => (this.html = `<span class=error><a-translation data-trans-key="${this.getAttribute('error-text') ?? 'PartnerSearch.Error'}"></a-translation></span>`))
      // const data = this.lastData = await fetch
      this.html = ''
      this.hiddenMessages.forEach(message => message.removeAttribute('hidden'))
      this.html = this.hiddenMessages
      // if (data?.partnerListEntries.length) {
      //   this.html = /* html */`Duuuuude`
      // } else {
      //   /*
      //   this.html = this.message
      //   this.message.removeAttribute('hidden')
      //   */
      // }
    }
    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/translation/Translation.js`,
        name: 'a-translation'
      },
      {
        path: `${this.importMetaUrl}../../../../css/web-components-toolbox-migros-design-experience/src/es/components/organisms/MdxComponent.js`,
        name: 'mdx-component'
      }
    ])
  }

  renderLoading () {
    this.html = /* html */`
      <mdx-component>
          <mdx-loading-bar></mdx-loading-bar>
      </mdx-component>
    `
  }

  get loadingBar () {
    return this.root.querySelector('mdx-loading-bar')
  }

  get hiddenSections () {
    return Array.from(this.querySelectorAll('section[hidden]') || this.root.querySelectorAll('section[hidden]'))
  }
}
