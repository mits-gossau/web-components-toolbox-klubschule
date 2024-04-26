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
            abonnementsAPI: this.abonnementsURL
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
    this.addEventListener('open-abonnements-dialog', this.requestAbonnements)
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

  /**
    * renderHTML
    * @returns {Promise<void>} The function `renderHTML` returns a Promise.
  */
  renderHTML() {
    this.html = /* html */ `
      <m-dialog namespace="dialog-left-slide-in-wide-" show-event-name="open-abonnements-dialog" id="offers-page-filter-categories" close-event-name="backdrop-clicked">
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
      <button
        class="link-more"
        namespace="button-transparent-"
        request-event-name="open-abonnements-dialog"
        click-no-toggle-active
      >
        <span>${this.linkLabel}</span>
      </button>
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
    * @param data Abonnement Infos
    * @returns {Promise<void>} The function `renderContent` returns a Promise.
  */
  renderContent(data) {
    this.total.innerHTML = data.total_label
    this.content.innerHTML = data.courses?.length ? 
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
    : ''

    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../organisms/tileList/TileList.js`,
        name: 'ks-o-tile-list'
      },
      {
        path: `${this.importMetaUrl}../../molecules/tile/Tile.js`,
        name: 'ks-m-tile'
      }
    ])
  }

  get abonnementsURL() {
    return this.getAttribute('abonnements-api')
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

  get total() {
    return this.innerDialog.querySelector('#total')
  }

  get content() {
    return this.innerDialog.querySelector('#content')
  }
}
