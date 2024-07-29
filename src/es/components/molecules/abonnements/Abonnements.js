// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Event
* @type {CustomElementConstructor}
*/
export default class Abonnements extends Shadow() {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, mode: 'false', ...options }, ...args)
    this.ppage = 0
    this.requestAbonnements = (event) => {
      new Promise(resolve => {
        this.dispatchEvent(new CustomEvent('request-abo-list', {
          detail: {
            resolve,
            abonnementsAPI: `${this.abonnementsURL}&ppage=${this.ppage}`
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }))
      }).then(data => {
        if (data) {
          this.renderContent(data)
          this.receiveData(data)
        }
      })
    }
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

    this.addEventListener(`open-abonnements-dialog-${this.aboId}`, this.requestAbonnements)
    this.addEventListener("load-more", this.requestAbonnements)
  }

  disconnectedCallback() {
    this.removeEventListener(`open-abonnements-dialog-${this.aboId}`, this.requestAbonnements)
    this.removeEventListener("load-more", this.requestAbonnements)

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
    return !this.dialog
  }

  /**
   * renders the css
   */
  renderCSS() {
    this.css = /* css */`
      :host h3 {
        font-size: 1.25rem;
        line-height: 1.375rem;
        font-weight: 500;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 1rem;
      }

      :host a-icon-mdx {
        color: var(--mdx-base-color-grey-950);
      }
      :host m-dialog {
        --dialog-left-slide-in-max-width-custom: min(100%, 1270px);
      }
      :host m-dialog + a-button {
        --button-transparent-padding: 0;
        width: fit-content;
        margin-top: 1rem;
        --button-transparent-font-size: 1.125rem;
      }

      @media only screen and (max-width: _max-width_) {
        :host {
          grid-template-columns: 100%;
          row-gap: 3rem;
          column-gap: 0;
        }
      }
    `
  }

  /**
    * renderHTML
    * @returns {Promise<void>} The function `renderHTML` returns a Promise.
  */
  renderHTML() {
    this.html = /* html */ `
      <m-dialog namespace="dialog-left-slide-in-wide-" show-event-name="open-abonnements-dialog-${this.aboId}" id="offers-page-filter-categories" close-event-name="backdrop-clicked">
        <div class="container dialog-header" tabindex="0">
          <div>
          </div>
          <h3 id="total"></h3>
          <div id="close">
            <a-icon-mdx icon-name="Plus" size="2em"></a-icon-mdx>
          </div>
        </div>
        <div id="content" class="container dialog-content">
        </div>
        <div class="container dialog-footer">
          <a-button id="close" namespace="button-secondary-" no-pointer-events>${this.buttonCloseLabel}</a-button>
        </div>
      </m-dialog>
      <a-button
        namespace="button-transparent-"
        request-event-name="open-abonnements-dialog-${this.aboId}"
        click-no-toggle-active
        icon-right="ArrowRight"
      >
        <span>${this.linkLabel}</span>
        <a-icon-mdx icon-name="ArrowRight" size="1em"></a-icon-mdx>
      </a-button>
    `
    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/button/Button.js`,
        name: 'a-button'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/molecules/dialog/Dialog.js`,
        name: 'm-dialog'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ])
  }

  /**
    * renderContent
    * NOTE: the replace ".replace(/'/g, '’')" avoids the dom to close the attribute string unexpectedly. This replace is also ISO 10646 conform as the character ’ (U+2019) is the preferred character for apostrophe. See: https://www.cl.cam.ac.uk/~mgk25/ucs/quotes.html + https://www.compart.com/de/unicode/U+2019
    * @param data Abonnement Infos
  */
  renderContent(data) {
    this.fetchModules([
      {
        path: `${this.importMetaUrl}../../organisms/tileList/TileList.js`,
        name: 'ks-o-tile-list'
      },
      {
        path: `${this.importMetaUrl}../../molecules/tile/Tile.js`,
        name: 'ks-m-tile'
      },
      {
        path: `${this.importMetaUrl}../../atoms/button/Button.js`,
        name: 'ks-a-button'
      }
    ]).then(() => {
      this.total.innerHTML = data.total_label
      this.tiles = this.tiles || []
      data.courses.forEach((course) => {
        this.tiles.push(course.locations?.length ? /* html */ `<ks-o-tile-list data='${JSON.stringify(course).replace(/'/g, '’').replace(/"/g, '\"')}'></ks-o-tile-list>` : /* html */ `<ks-m-tile no-url-params namespace="tile-default-" data='${JSON.stringify(course).replace(/'/g, '’').replace(/"/g, '\"')}'></ks-m-tile>`)
      })

      this.content.innerHTML = /* html */ `
        ${this.tiles.reduce((acc, tile) => acc + tile, '')}   
        <ks-a-button namespace="button-primary-" color="secondary" request-event-name="load-more">
          <span>${this.getTranslation('CourseList.MoreOffersPlaceholder')}</span>
          <a-icon-mdx namespace="icon-mdx-ks-" icon-name="ArrowDownRight" size="1em" class="icon-right">
        </ks-a-button>
      `
    })

  }

  get abonnementsURL() {
    return this.getAttribute('abonnements-api')
  }

  get buttonCloseLabel() {
    return this.getAttribute('button-close-label') || 'Schliessen'
  }

  get linkLabel() {
    return this.getAttribute('link-label')
  }

  get aboId() {
    return this.getAttribute('abo-id')
  }

  get dialog() {
    return this.root.querySelector('m-dialog')
  }

  get innerDialog() {
    return this.dialog.root.querySelector('dialog')
  }

  get total() {
    return this.innerDialog.querySelector('#total')
  }

  get content() {
    return this.innerDialog.querySelector('#content')
  }

  /**
  * Event Listener: Get Data from Abonnements
  */
  receiveData = async (data) => {
    this.ppage = data?.ppage || this.ppage
  }
}
