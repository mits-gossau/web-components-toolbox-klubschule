// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * Communicates with the src/es/components/controllers/wishList/WishList.js controller
 * 
 * @export
 * @class WishList
 * @type {CustomElementConstructor}
 */
export default class WishList extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.message = this.root.querySelector('#message')
    this.wishListListener = event => this.renderHTML(event.detail.fetch)
  }

  connectedCallback () {
    this.hidden = true
    const showPromises = []
    if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
    if (this.shouldRenderHTML()) showPromises.push(this.renderHTML())
    Promise.all(showPromises).then(() => (this.hidden = false))
    document.body.addEventListener('wish-list', this.wishListListener)
    this.dispatchEvent(new CustomEvent('request-wish-list', {
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  disconnectedCallback () {}

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
    return !this.loadingBar && !this.offersPage
  }

  /**
   * renders the css
   * @return {Promise<void>}
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
      case 'wish-list-default-':
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
   * @param {Promise<{watchlistEntries: {aktiv: boolean, course: any, mandantId: number, centerId: number, kursTyp: number, kursId: number, sprache: string, code: number, message: string}[]}>} [fetch=undefined]
   * @return {Promise<void>}
   */
  async renderHTML (fetch) {
    this.html = ''
    this.renderLoading()
    if (fetch) {
      const data = await fetch
      this.html = ''
      if (data.watchlistEntries.length) {
        // assemble withfacet filter
        const filter = {
          color: '',
          disabled: false,
          hasChilds: false,
          hideCount: false,
          id: '26',
          label: '',
          level: '',
          selected: false,
          typ: ''
        }
        const initialRequest = {
          MandantId:  111,
          PortalId: 29,
          filter: [{
            children: [],
            ...filter
          }],
          ppage: 1,
          psize: 6,
          sprachid: 'd'
        }
        // id assembly: courseType_courseId_centerid
        // @ts-ignore
        initialRequest.filter[0].children = data.watchlistEntries.map(entry => ({...structuredClone(filter), id: `${entry.kursTyp}_${entry.kursId}_${entry.centerId}`, selected: true}))
        this.html = /* html */`
          <ks-o-offers-page
            headless
            no-search-tab
            endpoint="https://dev.klubschule.ch/Umbraco/Api/CourseApi/Search"
            initial-request='${JSON.stringify(initialRequest)}'
          ></ks-o-offers-page>
        `
      } else {
        this.html = this.message
        this.message.removeAttribute('hidden')
      }
    }
    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../offersPage/OffersPage.js`,
        name: 'ks-o-offers-page'
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

  get offersPage () {
    return this.root.querySelector('ks-o-offers-page')
  }
}