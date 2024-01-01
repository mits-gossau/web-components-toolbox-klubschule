// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Tile List
* @type {CustomElementConstructor}
*/
export default class TileList extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()

    this.toggleDetails();
  }

  disconnectedCallback () {}

  /**
   * Toggle details
   */
  toggleDetails() {
    const toggle = this.root.querySelector('.o-tile-list__bottom-left');
    toggle.addEventListener('click', () => {
      const details = this.root.querySelector('.o-tile-list__details');
      details.classList.toggle('o-tile-list__details--expanded')
    });
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
    return !this.badge
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host .o-tile-list {
        background-color: var(--m-white);
        border: 0.0625em solid var(--m-gray-700);
        padding: 1.5em;
      }

      :host .o-tile-list__top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75em;
      }

      :host .o-tile-list__title {
        font-size: 1.5em;
        line-height: 1.625em;
        font-weight: 500;        
      }

      :host a-icon-mdx {
        --icon-mdx-ks-color: var(--icon-color-blue);
      }

      :host .o-tile-list__middle {
        margin-bottom: 2em;
      }

      :host .o-tile-list__places {
        font-size: 1em;
        line-height: 1.25em;
        font-weight: 400;
      }

      :host .o-tile-list__bottom {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }

      :host .o-tile-list__details {
        height: 0;
        overflow: hidden;
      }

      :host .o-tile-list__details--expanded {
        height: auto;
      }

      :host .o-tile-list__bottom-right {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      :host .o-tile-list__price {
        font-size: 0.875em;
        line-height: 0.9375em;
        font-weight: 500;
        padding-left: 0.75em;
      }
      
      :host .o-tile-list__price strong {
        font-family: 'Graphik';
        font-size: 1.5em;
        line-height: 1.625em;
        font-weight: 500;
      }

      :host .o-tile-list__icons {
        display: flex;
        align-items: center;
      }
    
      :host .o-tile-list__icon-box {
        background-color: var(--icon-color-blue);
        border-radius:  0.1875em;
        height: 1.625em;
        width: 1.625em;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      
      :host .o-tile-list__icon-box + .o-tile-list__icon-box {
          margin-left: 0.5em;
      }
      
      :host .o-tile-list__icon-box a-icon-mdx {
          --icon-mdx-ks-color: var(--m-white);
      }

      :host .o-tile-list__tiles {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        padding-top: 3.5em;
      }

      :host ks-m-tile {
        margin-right: 1em;
        margin-bottom: 2em;
        width: 32%
      }

      :host ks-m-tile:nth-child(3n) {
        margin-right: 0;
      }

      :host ks-m-tile:last-child {
        margin-right: 0;
      }

      :host .o-tile-list__foot {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 1.5em 0 4em;
      }

      @media only screen and (min-width: 1025px) and (max-width: 1600px) {
        :host ks-m-tile {
          width: 49%
        }

        :host ks-m-tile:nth-child(2n) {
          margin-right: 0;
        }
      }

      @media only screen and (max-width: 1024px) {
        :host .o-tile-list {
          padding: 1em 0.5em;
        }

        :host .o-tile-list__bottom {
          align-items: flex-end;
          margin-bottom: 2em;
        }

        :host .o-tile-list__bottom-right {
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
        }

        :host .o-tile-list__price {
          padding-left: 0;
        }


        :host ks-m-tile {
          margin-right:0;
          margin-bottom: 1em;
          width: 100%
        }

        :host ks-m-tile:last-child {
          margin-bottom: 0;
        }

        :host .o-tile-list__foot {
          padding: 3em 0 2.5em;
        }
      }
    `
    return this.fetchTemplate()
  }

  /**
   * fetches the template
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
  }

  /**
   * Render HTML
   * @returns Promise<void>
   */
  renderHTML () {
    // don't wait for fetchModules to resolve if using "shouldRenderHTML" checks for this.badge it has to be sync
    this.html = /* HTML */`
    <div class="o-tile-list">
        <div class="o-tile-list__head">
          <div class="o-tile-list__top">
            <span class="o-tile-list__title">Title</span>
            <a-icon-mdx namespace="icon-mdx-ks-" icon-name="Info" size="1.5em" class="icon-right"></a-icon-mdx>            
          </div>
          <div class="o-tile-list__middle">
            <span class="o-tile-list__places">Basel, Luzern, Thun, Zürich-Oerlikon +3</span>
            <ks-a-button badge namespace="button-secondary-" color="tertiary">
              <span>Blended</span>
            </ks-a-button>
          </div>
          <div class="o-tile-list__bottom">
            <div class="o-tile-list__bottom-left">
              <ks-a-button namespace="button-quaternary-" color="secondary">
                <span>Ortsauswahl</span>
                <a-icon-mdx namespace="icon-mdx-ks-" icon-name="ArrowRight" size="1em" class="icon-right">
              </ks-a-button>
            </div>
            <div class="o-tile-list__bottom-right">
              <div class="o-tile-list__icons">
                <div class="o-tile-list__icon-box">
                  <a-icon-mdx namespace="icon-mdx-ks-" icon-name="Percent" size="1em"></a-icon-mdx>
                </div>
                <div class="o-tile-list__icon-box">
                  <a-icon-mdx namespace="icon-mdx-ks-" icon-name="Bell" size="1em"></a-icon-mdx>
                </div>             
              </div>
              <span class="o-tile-list__price">ab <strong>Preis</strong> / Semester</span>
            </div>          
          </div>
        </div>
        <div class="o-tile-list__details">
          <div class="o-tile-list__tiles">
            <ks-m-tile namespace="tile-default-"></ks-m-tile>
            <ks-m-tile namespace="tile-default-"></ks-m-tile>
            <ks-m-tile namespace="tile-default-"></ks-m-tile>
            <ks-m-tile namespace="tile-default-"></ks-m-tile>
            <ks-m-tile namespace="tile-default-"></ks-m-tile>
            <ks-m-tile namespace="tile-default-"></ks-m-tile>
          </div>
          <div class="o-tile-list__foot">
            <ks-a-button namespace="button-secondary-" color="secondary">
              <span>Weitere Standorte</span>
              <a-icon-mdx namespace="icon-mdx-ks-" icon-name="ArrowDownRight" size="1em" class="icon-right">
            </ks-a-button>
          </div>        
        </div>
    </div>
    `
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
      }
    ])
  }

  get badge () {
    return this.root.querySelector('[badge]')
  }
}