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
  }

  connectedCallback () {
    this.hidden = true
    const showPromises = []
    if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
    if (this.shouldRenderHTML()) showPromises.push(this.renderHTML())
    Promise.all(showPromises).then(() => (this.hidden = false))
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
   * @return {Promise<void>}
   */
  renderHTML (data) {
    if (data) {
      this.html = /* html */`
        <ks-o-offers-page
          headless
          endpoint="https://dev.klubschule.ch/Umbraco/Api/CourseApi/Search"
          initial-request='{"filter":[
          {
            "hasChilds": false,
            "label": "",
            "id": "26",
            "typ": "",
            "level": "",
            "color": "",
            "selected": false,
            "disabled": false,
            "hideCount": false,
            "children": [
            {
              "hasChilds": false,
              "label": "",
              "id": "D_101312",
              "typ": "",
              "level": "",
              "color": "",
              "selected": true,
              "disabled": false,
              "hideCount": false
            },
            {
              "hasChilds": false,
              "label": "",
              "id": "D_88449",
              "typ": "",
              "level": "",
              "color": "",
              "selected": true,
              "disabled": false,
              "hideCount": false
            },
            {
              "hasChilds": false,
              "label": "",
              "id": "D_90478",
              "typ": "",
              "level": "",
              "color": "",
              "selected": true,
              "disabled": false,
              "hideCount": false
            }
            ]
          }
          ],"PortalId":29,"sprachid":"d","MandantId":111,"ppage":1,"psize":6}'
        ></ks-o-offers-page>
      `
    } else {
      this.html = /* html */`
        <mdx-component>
            <mdx-loading-bar></mdx-loading-bar>
        </mdx-component>
      `
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

  get loadingBar () {
    return this.root.querySelector('mdx-loading-bar')
  }

  get offersPage () {
    return this.root.querySelector('ks-o-offers-page')
  }
}