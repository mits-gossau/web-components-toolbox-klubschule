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

    this.message = this.root.querySelector('#message')
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
      :host > ks-o-body-section::part(delete-btn-wrapper) {
        display: flex;
        justify-content: flex-end;
        padding-bottom: 1em;
      }
      :host > .error {
        color: var(--color-error);
      }
      :host #passed-offers-section {
        padding-top: 1em;
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
   * @param {Promise<{watchlistEntries: {aktiv: boolean, course: any, mandantId: number, centerId: number, kursTyp: number, kursId: number, sprache: string, code: number, message: string}[]}>} [fetch=undefined]
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
          MandantId: this.hasAttribute('mandant-id') ? Number(this.getAttribute('mandant-id')) : 111,
          PortalId: this.hasAttribute('portal-id') ? Number(this.getAttribute('portal-id')) : 29,
          sprachid: this.getAttribute('sprach-id') || document.documentElement.getAttribute('lang')?.substring(0, 1) || 'd',
          filter: [{
            children: [],
            ...filter
          }]
        }
        // id assembly: courseType_courseId_centerid
        // @ts-ignore
        initialRequest.filter[0].children = data.watchlistEntries.map(entry => ({ ...structuredClone(filter), id: `${entry.kursTyp}_${entry.kursId}_${entry.centerId}`, selected: true, disabled: true }))

        const passedWatchListEntries = this.mockDataForPassedCourses.watchlistEntries.filter(({ aktiv }) => !aktiv)
        // <h2>${this.getTranslation('WishList.TitleEvent.Expired')}</h2>


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
          ${passedWatchListEntries.length ? /* html */ `
            <ks-o-body-section variant="default" no-margin-y background-color="var(--mdx-sys-color-accent-6-subtle1)" id="passed-offers-section" tabindex="0" aria-label="Section">  
              <h2>${this.getTranslation('WishList.TitleOffer.Expired')}</h2>
              ${passedWatchListEntries.map(
          ({ course }) => /* html */ `
                  <ks-m-tile 
                    namespace="tile-passed-"
                    data='${JSON.stringify(course)}'
                    is-wish-list
                    tabindex="0"
                  >
                  </ks-m-tile>
                `
        )}

        <ks-a-spacing type="2xl-fix"></ks-a-spacing>
        <ks-m-badge-legend namespace="badge-legend-default-">
                  ${this.isEasyPortal
              ? /* html */`
                    <div>
                      <div class="badge-icon-only">
                        <a-icon-mdx namespace="icon-mdx-ks-badge-" icon-name="Key" size="1em"></a-icon-mdx>
                      </div>
                      <span>${this.getTranslation('Badge.Legend.KeyPlaceholder')}</span>
                    </div> 
                    `
              : ''
            }
                  ${this.hasAttribute('hide-abo-legend')
              ? ''
              : /* html */`
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
                      </div>`
            }
                  <div>
                    <div class="badge-icon-only">
                      <a-icon-mdx namespace="icon-mdx-ks-badge-" icon-name="Percent" size="1em"></a-icon-mdx>
                    </div>
                    <span>${this.getTranslation('Badge.Legend.PercentPlaceholder')}</span>
                  </div>
                </ks-m-badge-legend>
            </ks-o-body-section>
          ` : ''}
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
        path: `${this.importMetaUrl}../../molecules/tile/Tile.js`,
        name: 'ks-m-tile'
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

  get mockDataForPassedCourses() {
    return {
      "watchlistGuid": "3695e69d-4058-4141-ab30-ebd5f71c21ba",
      "portalId": 29,
      "watchlistTitle": "",
      "watchlistEntries": [
        {
          "course": null,
          "aktiv": true,
          "mandantId": 111,
          "centerId": 2671,
          "kursTyp": "D",
          "kursId": 90486,
          "sprache": "D"
        },
        {
          "course": {
            "title": "Deutsch Anfänger*innen",
            "infotextshort": "Sie erwerben Grundkenntnisse und trainieren in erster Linie die mündliche Kommunikation. So lernen Sie mit motivierenden Erfolgserlebnissen, sich im deutschsprachigen Alltag zurechtzufinden. Das Sprachniveau ist in drei Module unterteilt. Auf Anfängerstufe beginnen Sie im ersten Drittel, im zwei...",
            "location": {
              "iconName": "Location",
              "name": "Lausanne, Rue de Genève 33",
              "badge": ""
            },
            "centerid": "2671",
            "kurs_typ": "D",
            "kurs_id": "90486",
            "buttons": [{ "text": "6 Veranstaltung(en)", "link": "/kurs/deutschanfangerinnen--D_90486_2671_324", "typ": "secondary", "event": null, "iconName": "ArrowRight", "filters": null }],
            "icons": [],
            "passed": {
              "title": "Angebot nicht mehr verfügbar"
            },
            "price": {
              "pre": "",
              "amount": "866.00 CHF",
              "per": "",
              "price": 866
            },
            "parentkey": "D_90486_2671"
          },
          "aktiv": false,
          "mandantId": 111,
          "centerId": 2671,
          "kursTyp": "D",
          "kursId": 90486,
          "sprache": "D"
        },
        {
          "course": null,
          "aktiv": true,
          "mandantId": 111,
          "centerId": 1014,
          "kursTyp": "D",
          "kursId": 98010,
          "sprache": "D"
        }
      ],
      "code": 0,
      "message": ""
    }
  }
}
