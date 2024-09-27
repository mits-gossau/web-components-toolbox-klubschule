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
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.messageEvents = this.root.querySelector('#message-events')
    this.messageOffers = this.root.querySelector('#message-offers')
    this.wishListListener = event => this.renderHTML(event.detail.fetch)
  }

  connectedCallback() {
    this.hidden = true
    new Promise(resolve => {
      this.dispatchEvent(new CustomEvent('request-translations',
        {
          detail: {
            resolve
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }))
    }).then(async result => {
      await result.fetch
      this.getTranslation = result.getTranslationSync
      const showPromises = []
      if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
      if (this.shouldRenderHTML()) showPromises.push(this.renderHTML())
      Promise.all(showPromises).then(() => (this.hidden = false))
    })
    document.body.addEventListener('wish-list', this.wishListListener)
    this.dispatchEvent(new CustomEvent('request-wish-list', {
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  disconnectedCallback() {
    document.body.removeEventListener('wish-list', this.wishListListener)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS() {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML() {
    return !this.loadingBar && !this.offersPage
  }

  /**
   * renders the css
   * @return {Promise<void>}
   */
  renderCSS() {
    this.css = /* css */`
      :host {
        width: 100% !important;
      }
      :host > .error {
        color: var(--color-error);
      }
      :host #passed-offers-section {
        padding-top: 1em;
      }
      :host ks-m-tab {
        padding-top: var(--mdx-sys-spacing-flex-large-m);
      }
    `
    return this.fetchTemplate()
  }

  /**
   * fetches the template
   * @return {Promise<void>}
   */
  fetchTemplate() {
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
   * @param {Promise<any>} [fetch=undefined]
   * @return {Promise<void>}
   */
  async renderHTML(fetch) {
    this.html = ''
    this.renderLoading()
    if (fetch) {
      fetch.catch(error => {
        this.html = `<span class=error><a-translation data-trans-key="${this.getAttribute('error-text') ?? 'Wishlist.Error'}"></a-translation></span>`
        if (this.lastData) this.renderHTML(Promise.resolve(this.lastData))
      })
      const data = this.lastData = await fetch
      this.html = ''

      this.baseRequest = {
        MandantId: this.hasAttribute('mandant-id') ? Number(this.getAttribute('mandant-id')) : 111,
        PortalId: this.hasAttribute('portal-id') ? Number(this.getAttribute('portal-id')) : 29,
        sprachid: this.getAttribute('sprach-id') || document.documentElement.getAttribute('lang')?.substring(0, 1) || 'd',
      }

      this.html = /* html */`
          <ks-m-tab>
            <ul class="tab-search-result">
              <li>
                <button class="active" tab-target="content1" id="total-event-offers-tab-heading">${this.getTranslation('Wishlist.Events.Tab')}</button>
              </li>
              <li>
                <button tab-target="content2" id="total-course-offers-tab-heading">${this.getTranslation('Wishlist.Offers.Tab')}</button>
              </li>
            </ul>
            <div>
              <div id="content1" tab-content-target>
                ${this.renderList(data.watchlistEntriesVeranstaltung, true)}
              </div>

              <div id="content2" tab-content-target>
                ${this.renderList(data.watchlistEntriesAngebot, false)}
              </div>
            </div>
          </ks-m-tab>
        `
    }
    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../atoms/button/Button.js`,
        name: 'ks-a-button'
      },
      {
        path: `${this.importMetaUrl}../../molecules/tile/Tile.js`,
        name: 'ks-m-tile'
      },
      {
        path: `${this.importMetaUrl}../../molecules/badgeLegend/BadgeLegend.js`,
        name: 'ks-m-badge-legend'
      },
      {
        path: `${this.importMetaUrl}../../molecules/tab/Tab.js`,
        name: 'ks-m-tab'
      },
      {
        path: `${this.importMetaUrl}../../molecules/event/Event.js`,
        name: 'ks-m-event'
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

  renderMessage(message) {
    if (!message) return console.error("Missing Markup for empty wishlist")
    return /* html */ `
      <ks-o-body-section variant="default" background-color="var(--mdx-sys-color-accent-6-subtle1)" no-margin-y no-padding-y>
        <section id="${message.id}">
          ${message.innerHTML}
        </section>
      </ks-o-body-section>
    `
  }

  renderList(entryList, isEvent) {
    // assemble withfacet filter
    const filter = {
      color: '',
      disabled: false,
      hasChilds: false,
      hideCount: false,
      id: '29',
      label: '',
      level: '',
      selected: false,
      typ: ''
    }

    const initialRequestEntries = {
      ...this.baseRequest,
      filter: [{
        children: [],
        ...filter
      }]
    }

    const activeWatchListEntries = entryList.filter(({ aktiv }) => aktiv)
    const passedWatchListEntries = entryList.filter(({ aktiv }) => !aktiv)
    // id assembly: courseType_courseId_centerid
    initialRequestEntries.filter[0].children = activeWatchListEntries.map(entry => ({ ...structuredClone(filter), id: `${entry.kursTyp}_${entry.kursId}_${entry.centerId}`, selected: true, disabled: true }))

    return entryList?.length ? /* html */ `
        <ks-o-body-section variant="default" no-padding-y no-margin-y background-color="var(--mdx-sys-color-accent-6-subtle1)">
          <div part="delete-btn-wrapper">
              <ks-a-button namespace="button-secondary-" color="tertiary" request-event-name="remove-all-from-wish-list-${isEvent ? "events" : "offers"}">
                <a-icon-mdx icon-name="Trash" size="1em" class="icon-left"></a-icon-mdx>
                <a-translation data-trans-key="${this.getAttribute('delete-all-text') ?? 'Wishlist.DeleteAll'}"></a-translation>
              </ks-a-button>
          </div>
        </ks-o-body-section>
        ${activeWatchListEntries?.length ? /* html */ `
          <ks-o-offers-page
            headless
            is-wish-list
            endpoint="${this.getAttribute('endpoint')}"
            initial-request='${JSON.stringify(initialRequestEntries)}'
            with-facet-target
            ${isEvent ? ` event-detail-url="${this.eventDetailURL}"` : ''}
            ${isEvent ? "" : " no-search-tab"}
          ></ks-o-offers-page>
        ` : ''}
        ${passedWatchListEntries?.length ? /* html */ `
          <ks-c-event-detail endpoint="${this.eventDetailURL}">
            <ks-o-body-section variant="default" no-margin-y background-color="var(--mdx-sys-color-accent-6-subtle1)" id="passed-offers-section" tabindex="0" aria-label="Section">  
              <div class="passed-tile-wrapper">  
                <h2>${isEvent ? this.getTranslation('WishList.Events.Title') : this.getTranslation('WishList.Offers.Title')}</h2>
                ${passedWatchListEntries.map(
                  ({ course }) => /* html */ `
                    <div>
                      ${isEvent ? /* html */ `
                        <ks-m-event 
                          data='{
                            "course": ${JSON.stringify(course).replace(/'/g, '’').replace(/"/g, '\"')},
                            "sprachid": "${course?.sprache_id || "d"}"
                          }'
                          is-wish-list
                          is-passed
                          tabindex="0"
                          passed-message="${this.getTranslation("Wishlist.Events.Copy")}"
                        >
                        </ks-m-event>
                      ` : /* html */ `
                        <ks-m-tile 
                          namespace="tile-passed-"
                          data='${JSON.stringify(course)}'
                          is-wish-list
                          is-passed
                          tabindex="0"
                          passed-message="${this.getTranslation("Wishlist.Offers.Copy")}"
                        >
                        </ks-m-tile>
                      `}
                    </div>
                  `
                )}
              </div>
            ${this.renderLegend()}
          </ks-o-body-section>
        </ks-c-event-detail>
        ` : ''}
      ` : this.renderMessage(isEvent ? this.messageEvents : this.messageOffers)
  }

  renderLegend() {
    return /* html */ `
      <ks-a-spacing type="2xl-fix"></ks-a-spacing>
      <div class="passed-tile-wrapper">
        <ks-m-badge-legend namespace="badge-legend-default-">
          ${this.isEasyPortal ? /* html */`
              <div>
                <div class="badge-icon-only">
                  <a-icon-mdx namespace="icon-mdx-ks-badge-" icon-name="Key" size="1em"></a-icon-mdx>
                </div>
                <span>${this.getTranslation('Badge.Legend.KeyPlaceholder')}</span>
              </div> 
            ` : ''}
          ${this.hasAttribute('hide-abo-legend') ? '' : /* html */`
            <div>
              <div class="badge-icon-only">
                <a-icon-mdx namespace="icon-mdx-ks-badge-" icon-name="Abo" size="1em"></a-icon-mdx>
              </div>
              <span>${this.getTranslation('Badge.Legend.AboPlaceholder')}</span>
            </div>
            <div>
              <div class="badge-icon-only">
                <a-icon-mdx namespace="icon-mdx-ks-badge-" icon-name="AboPlus" size="1em"></a-icon-mdx>
              </div>
              <span>${this.getTranslation('Badge.Legend.AboPlusPlaceholder')}</span>         
            </div>
          `}
          <div>
            <div class="badge-icon-only">
              <a-icon-mdx namespace="icon-mdx-ks-badge-" icon-name="Percent" size="1em"></a-icon-mdx>
            </div>
            <span>${this.getTranslation('Badge.Legend.PercentPlaceholder')}</span>
          </div>
        </ks-m-badge-legend>
      </div>
    `
  }

  renderLoading() {
    this.html = /* html */`
      <mdx-component>
          <mdx-loading-bar></mdx-loading-bar>
      </mdx-component>
    `
  }

  get loadingBar() {
    return this.root.querySelector('mdx-loading-bar')
  }

  get offersPage() {
    return this.root.querySelector('ks-o-offers-page')
  }

  get isEasyPortal() {
    return !!this.hasAttribute('is-easy-portal')
  }

  get eventDetailURL() {
    return this.getAttribute('event-detail-url') || 'https://dev.klubschule.ch/Umbraco/Api/CourseApi/detail/'
  }

}
