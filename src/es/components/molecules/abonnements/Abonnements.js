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
    this.requestAbonnements = () => {
      new Promise(resolve => {
        this.dispatchEvent(new CustomEvent('request-abo-list', {
          detail: {
            resolve,
            language: this.data.language || this.data.parentkey.split('_')[0],
            typ: this.data.typ || this.data.kurs_typ,
            id: this.data.id || this.data.kurs_id,
            center_id: this.data.center_id || this.data.centerid
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }))
      }).then(data => {
        this.renderContent(data)
      })
    }
  }

  connectedCallback() {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
    document.body.addEventListener('open-abonnements-dialog', this.requestAbonnements)
  }

  disconnectedCallback() {
    this.removeEventListener('open-abonnements-dialog', this.requestAbonnements)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS() {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
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
        --dialog-left-slide-in-max-width-custom: min(100%, 1020px);
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

  renderHTML() {
      this.html = /* html */ `
        <m-dialog namespace="dialog-left-slide-in-wide-" show-event-name="open-abonnements-dialog" id="offers-page-filter-categories" close-event-name="backdrop-clicked">
        </m-dialog>
        <ks-a-button
          namespace="button-transparent-"
          request-event-name="open-abonnements-dialog"
          click-no-toggle-active
        >
          <span>${this.linkLabel}</span>
        </ks-a-button>
      `
  }

  /**
    * renderHTML
    * @returns {Promise<void>} The function `renderHTML` returns a Promise.
  */
  renderContent(data) {
    if (!this.data) console.error('Data json attribute is missing or corrupted!', this)
    this.innerDialog.innerHTML = /* HTML */ `
      <div class="container dialog-header" tabindex="0">
        <div>
        </div>
        <h3>${data.total_label}</h3>
        <div id="close">
          <a-icon-mdx icon-name="Plus" size="2em"></a-icon-mdx>
        </div>
      </div>
      <div class="container dialog-content">
        ${data.courses?.length ? 
          data.courses.reduce(
            (acc, abonnement) => acc + (
              abonnement.locations?.length ? /* html */ `
                <ks-o-tile-list data='${JSON.stringify(abonnement)}'>
                </ks-o-tile-list>
              ` : /* html */ `
                <ks-m-tile namespace="tile-default-" data='${JSON.stringify(abonnement)}'>
                </ks-m-tile>
              `
            ),
          '')
        : ''}
      </div>
      <div class="container dialog-footer">
        <a-button id="close" namespace="button-secondary-" no-pointer-events>${this.buttonCloseLabel}</a-button>
      </div>
    `
    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../atoms/heading/Heading.js`,
        name: 'ks-a-heading'
      },
      {
        path: `${this.importMetaUrl}../../atoms/button/Button.js`,
        name: 'ks-a-button'
      },
      {
        path: `${this.importMetaUrl}../../organisms/tileList/TileList.js`,
        name: 'ks-o-tile-list'
      },
      {
        path: `${this.importMetaUrl}../../molecules/tile/Tile.js`,
        name: 'ks-m-tile'
      },
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

  get data() {
    return Abonnements.parseAttribute(this.getAttribute('data'))
  }

  get buttonCloseLabel() {
    return this.getAttribute('button-close-label') || "Schliessen"
  }

  get linkLabel() {
    return this.getAttribute('link-label')
  }

  get dialog() {
    return this.root.querySelector('m-dialog')
  }

  get innerDialog() {
    return this.dialog.root.querySelector('dialog')
  }
}
