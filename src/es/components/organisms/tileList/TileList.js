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

    this.ppage = 1

    this.clickEventListener = event => {
      if (this.icon) {
        if (this.icon.getAttribute('icon-name') === 'ChevronDown') {
          this.icon.setAttribute('icon-name', 'ChevronUp')
        } else {
          this.icon.setAttribute('icon-name', 'ChevronDown')
        }
      }

      this.details = this.root.querySelector('.o-tile-list__details')
      this.details.classList.toggle('o-tile-list__details--expanded')
      if (this.details.classList.contains('o-tile-list__details--expanded')) {
        // no tiles are delivered as attribute. here we got to fetch the location data for the tiles
        if (!this.data.tiles?.length) {
          return new Promise(resolve => this.dispatchEvent(new CustomEvent('request-locations', {
            detail: {
              resolve,
              filter: this.data.filter
            },
            bubbles: true,
            cancelable: true,
            composed: true
          }))).then(data => this.renderTile(data))
        }
      }
    }

    this.loadMoreClickEventListener = event => new Promise(resolve => this.dispatchEvent(new CustomEvent('request-locations', {
      detail: {
        resolve,
        ppage: this.ppage,
        filter: this.data.filter
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))).then(data => this.renderTile(data, true))
  }

  connectedCallback () {
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
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return this.hasAttribute('id') ? !this.root.querySelector(`:host > style[_css], #${this.getAttribute('id')} > style[_css]`) : !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`) 
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML () {
    return !this.tileList
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
        gap: 0.75rem;
      }

      :host .o-tile-list__top ks-m-tooltip {
        margin-bottom: auto;
      }

      :host .o-tile-list__title {
        font-family: var(--mdx-sys-font-flex-headline3-font-family);
        font-size: var(--mdx-sys-font-flex-headline3-font-size);
        font-weight: var(--mdx-sys-font-flex-headline3-font-weight);
        line-height: var(--mdx-sys-font-flex-headline3-line-height);
        letter-spacing: var(--mdx-sys-font-flex-headline3-letter-spacing);        
      }

      :host a-icon-mdx {
        --icon-mdx-ks-color: var(--icon-color-blue);
      }


      :host .o-tile-list__top + .o-tile-list__bottom {
        margin-top: 2em;
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

      :host .o-tile-list__bottom--grey {
        --button-secondary-border-color: var(--mdx-sys-color-neutral-subtle3);
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
        gap: 1rem;
      }

      :host .o-tile-list__price {
        font-family: var(--mdx-sys-font-fix-label3-font-family);
        font-size: var(--mdx-sys-font-fix-label3-font-size);
        font-weight: var(--mdx-sys-font-fix-label3-font-weight);
        line-height: var(--mdx-sys-font-fix-label3-line-height);
        letter-spacing: var(--mdx-sys-font-fix-label3-letter-spacing);
        text-align: end;
        white-space: nowrap;
      }
      
      :host .o-tile-list__price strong {
        font-family: var(--mdx-sys-font-flex-headline3-font-family);
        font-size: var(--mdx-sys-font-flex-headline3-font-size);
        font-weight: var(--mdx-sys-font-flex-headline3-font-weight);
        line-height: var(--mdx-sys-font-flex-headline3-line-height);
        letter-spacing: var(--mdx-sys-font-flex-headline3-letter-spacing);
        white-space: initial;
      }

      :host .o-tile-list__icons {
        display: flex;
        align-items: center;
        justify-content: flex-end;
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
        justify-content: start;
        padding-top: 3.5em;
        gap: 1em;
      }

      :host ks-m-tile {
        width: 32%;
        flex-grow: 1;
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
        }

        :host .o-tile-list__bottom-right {
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-end;
          gap: 0.75rem;
        }

        :host .o-tile-list__icon-box + .o-tile-list__icon-box {
          margin-left: 1rem;
        }

        :host .o-tile-list__price {
          padding-left: 0;
        }

        :host ks-m-tile {
          margin-right:0;
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
    return Promise.resolve()
  }

  /**
   * Render HTML
   * @returns Promise<void>
   */
  renderHTML (data = TileList.parseAttribute(this.getAttribute('data'))) {
    const warnMandatory = 'data attribute requires: '
    if (!data) return console.error('Data json attribute is missing or corrupted!', this)
    this.data = data
    console.log(data, data.sort !== 2)
    // don't wait for fetchModules to resolve if using "shouldRenderHTML" checks for this.badge it has to be sync
    this.html = /* HTML */`
    <div class="o-tile-list">
        <div class="o-tile-list__head">
          <div class="o-tile-list__top">
            <span class="o-tile-list__title">${data.title || warnMandatory + 'title'}</span>
            ${data.iconTooltip
              ? `
                <ks-m-tooltip namespace="tooltip-right-" text='${data.iconTooltip}'>
                  <a-icon-mdx namespace="icon-mdx-ks-tile-" icon-name="Info" size="1.5em" class="icon-right"></a-icon-mdx>
                </ks-m-tooltip>
                  `
              : ''}          
          </div>
          ${data.sort !== 2 ? /* html */ `
            <div class="o-tile-list__middle">
              ${data.location?.name 
                ? /* html */`
                <span class="o-tile-list__places">${data.location?.name || warnMandatory + 'location'}</span>
                `
                : ''
              }
              ${data.location?.badge
                ? /* html */`
                  <ks-a-button badge namespace="button-secondary-" color="tertiary">
                    <span>${data.location.badge}</span>
                  </ks-a-button>
                `
                : ''
              }
            </div>
          ` : ''}
          <div class="o-tile-list__bottom ${data.sort === 2 ? 'o-tile-list__bottom--grey' : ''}">
            <div class="o-tile-list__bottom-left">
              <ks-m-buttons data-buttons='${JSON.stringify(data.buttons).replace(/'/g, 'ʼ')}' small></ks-m-buttons>
            </div>
            <div class="o-tile-list__bottom-right">
              <div class="o-tile-list__icons">
              ${data.icons.reduce((acc, icon) => acc + /* html */`
                <div class="o-tile-list__icon-box">
                  <ks-m-tooltip namespace="tooltip-right-" text="${icon.text}">
                    <a-icon-mdx namespace="icon-mdx-ks-badge-" icon-name="${icon.iconName || icon.name}" size="1em"></a-icon-mdx>
                  </ks-m-tooltip>
                </div>
              `, '')}           
              </div>
              <span class="o-tile-list__price">${data.price?.from ? data.price?.from + ' ' : ''}<strong>${data.price?.amount || ''}</strong>${data.price?.per ? ' / ' + data.price?.per : ''}</span>
            </div>          
          </div>
        </div>
        <div class="o-tile-list__details">
          <div class="o-tile-list__tiles">
            ${data.tiles?.length ? data.tiles.reduce((acc, tile) => acc + /* html */`<ks-m-tile namespace="tile-default-" data="${JSON.stringify(tile).replace(/"/g, "'")}"></ks-m-tile>`, '') : ''}
          </div>
          <div
            id="request-more-locations"
            class="o-tile-list__foot"
            style="display: none;"
          >
            <ks-a-button
              namespace="button-secondary-" 
              color="secondary" 
            >
              <span>${this.getTranslation('CourseList.MoreLocationsPlaceholder')}</span>
              <a-icon-mdx icon-name="ArrowDownRight" size="1em"></a-icon-mdx>
            </ks-a-button>
          </div>
        </div>
    </div>
    `
    /**
     * Toggle details
     */
    this.icon = this.root.querySelector('a-icon-mdx[icon-name="ChevronDown"]')
    this.toggle = this.root.querySelector('.o-tile-list__bottom-left')
    this.tilesContainer = this.root.querySelector('.o-tile-list__tiles')
    this.loadMore = this.root.querySelector('#request-more-locations')

    this.toggle.addEventListener('click', this.clickEventListener)
    this.loadMore.addEventListener('click', this.loadMoreClickEventListener)
    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../atoms/button/Button.js`,
        name: 'ks-a-button'
      },
      {
        path: `${this.importMetaUrl}../../molecules/buttons/Buttons.js`,
        name: 'ks-m-buttons'
      },
      {
        path: `${this.importMetaUrl}../../molecules/tile/Tile.js`,
        name: 'ks-m-tile'
      },
      {
        path: `${this.importMetaUrl}../../molecules/tooltip/Tooltip.js`,
        name: 'ks-m-tooltip'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ])
  }

  renderTile (tileData, add = false) {
    this.ppage = tileData.ppage || this.ppage
    this.loadMore.style.display = tileData.ppage === -1 ? 'none': 'flex'
    const tileString = Object.assign(this.data, { tiles: tileData.courses }).tiles.reduce((acc, tile) => {
      // according to this ticket, the location title aka. bezeichnung must be the location.name and location.name shall be empty [https://jira.migros.net/browse/MIDUWEB-855]
      tile.bezeichnung = tile.title = tile.location.name || tile.bezeichnung || tile.title
      if (tile.bezeichnung) tile.location.name = ''
      return acc + /* html */`<ks-m-tile namespace="tile-default-" data="${JSON.stringify(tile).replace(/"/g, "'")}"></ks-m-tile>`
    }, '')
    if (add) {
      const div = document.createElement('div')
      div.innerHTML = tileString
      Array.from(div.children).forEach(child => this.tilesContainer.appendChild(child))
    } else {
      this.tilesContainer.innerHTML = tileString
    }
  }

  get tileList () {
    return this.root.querySelector('.o-tile-list')
  }
}
