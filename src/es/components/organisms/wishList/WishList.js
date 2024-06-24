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

  disconnectedCallback () {
    document.body.removeEventListener('wish-list', this.wishListListener)
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
    return !this.loadingBar && !this.offersPage
  }

  /**
   * renders the css
   * @return {Promise<void>}
   */
  renderCSS () {
    this.css = /* css */`
      :host > ks-o-body-section::part(delete-btn-wrapper) {
        display: flex;
        justify-content: flex-end;
        padding-bottom: 1em;
      }
      :host > .error {
        color: var(--color-error);
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
      fetch.catch(error => {
        this.html = `<span class=error><a-translation data-trans-key="${this.getAttribute('error-text') ?? 'Wishlist.Error'}"></a-translation></span>`
        if (this.lastData) this.renderHTML(Promise.resolve(this.lastData))
      })
      const data = this.lastData = await fetch
      this.html = ''
      if (data?.watchlistEntries.length) {
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
          <ks-o-body-section variant="default" no-margin-y background-color="var(--mdx-sys-color-accent-6-subtle1)">
            <div part="delete-btn-wrapper">
              <ks-a-button namespace="button-secondary-" color="tertiary" request-event-name="remove-all-from-wish-list">
                <a-icon-mdx icon-name="Trash" size="1em" class="icon-left"></a-icon-mdx>
                <a-translation data-trans-key="${this.getAttribute('delete-all-text') ?? 'Wishlist.DeleteAll'}"></a-translation>
              </ks-a-button>
            </div>
          </ks-o-body-section>
          <ks-o-offers-page
            headless
            no-search-tab
            is-wish-list
            endpoint="${this.getAttribute('endpoint')}"
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
        path: `${this.importMetaUrl}../../atoms/button/Button.js`,
        name: 'ks-a-button'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/translation/Translation.js`,
        name: 'a-translation'
      },
      {
        path: `${this.importMetaUrl}../../organisms/bodySection/BodySection.js`,
        name: 'ks-o-body-section'
      },
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