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
      // ChevronDown/Up icon
      this.icon = this.root.querySelector('ks-m-buttons')?.root?.querySelector('ks-a-button')?.root?.querySelector('a-icon-mdx[icon-name="ChevronDown"], a-icon-mdx[icon-name="ChevronUp"]')
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
          /* set loading state */
          this.tilesContainer.innerHTML = /* html */`
              <mdx-component class="o-tile-list__loading-bar">
                  <mdx-loading-bar></mdx-loading-bar>
              </mdx-component>
          `

          return new Promise(resolve => this.dispatchEvent(new CustomEvent('request-locations', {
            detail: {
              resolve,
              filter: this.data.filter,
              isAboList: this.hasAttribute("is-abo-list")
            },
            bubbles: true,
            cancelable: true,
            composed: true
          }))).then(data => this.renderTile(data, false, this.data.location?.name))
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
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
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
        cursor: pointer;
      }

      :host .o-tile-list__title:hover {
        color: var(--mdx-sys-color-primary-default);
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
        overflow: visible; /* to make tooltips fully visible */
      }

      :host .o-tile-list__bottom-right {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
      }

      :host .o-tile-list__price {
        font: var(--mdx-sys-font-fix-label4);
        text-align: end;
        white-space: nowrap;
      }
      
      :host .o-tile-list__price strong {
        font: var(--mdx-sys-font-fix-label1);
        white-space: initial;
      }

      :host .o-tile-list__icons {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.5em;
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
        width: calc(33.333% - 1em * (2 / 3));
      }

      :host .o-tile-list__foot {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 1.5em 0 4em;
      }

      :host .o-tile-list__loading-bar {
        display: block;
        width: 100%;
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
    // don't wait for fetchModules to resolve if using "shouldRenderHTML" checks for this.badge it has to be sync
    // NOTE: the replace ".replace(/'/g, '’')" avoids the dom to close the attribute string unexpectedly. This replace is also ISO 10646 conform as the character ’ (U+2019) is the preferred character for apostrophe. See: https://www.cl.cam.ac.uk/~mgk25/ucs/quotes.html + https://www.compart.com/de/unicode/U+2019
    this.html = /* html */`
    <div class="o-tile-list">
        <div class="o-tile-list__head">
          <div class="o-tile-list__top">
            <span class="o-tile-list__title">${data.title || data.bezeichnung || warnMandatory + 'title'}</span>
            ${data.infotextshort
              ? /* html */`
                <ks-m-tooltip namespace="tooltip-right-" text='${data.infotextshort}'>
                  <a-icon-mdx namespace="icon-mdx-ks-tile-" icon-name="Info" size="1.5em" class="icon-right"></a-icon-mdx>
                </ks-m-tooltip>
                  `
              : ''}          
          </div>
          ${data.sort !== 2 ? /* html */ `
            <div class="o-tile-list__middle">
              ${data.location?.name
                ? /* html */`
                <span class="o-tile-list__places">${data.location?.name.split(', ').join(', ') || warnMandatory + 'location'}</span>
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
              <ks-m-buttons data-buttons='${JSON.stringify(data.buttons).replace(/'/g, '’').replace(/"/g, '\"')}' small></ks-m-buttons>
            </div>
            <div class="o-tile-list__bottom-right">
              ${this.isNearbySearch ? '' : /* html */ `
                <div class="o-tile-list__icons">
                  ${data.icons.reduce((acc, icon) => acc + /* html */`
                    <ks-m-tooltip mode="false" namespace="tooltip-right-" text="${icon.text?.replaceAll('"', "'")}">
                      <div class="o-tile-list__icon-box">
                          <a-icon-mdx namespace="icon-mdx-ks-badge-" icon-name="${icon.iconName || icon.name}" size="1em"></a-icon-mdx>
                      </div>
                    </ks-m-tooltip>
                  `, '')}           
                </div>
              `}
              <span class="o-tile-list__price">${data.price?.pre ? data.price?.pre + ' ' : ''}<strong>${data.price?.amount || ''}</strong>${data.price?.per ? ' / ' + data.price?.per : ''}</span>
            </div>          
          </div>
        </div>
        <div class="o-tile-list__details">
          <div class="o-tile-list__tiles">
            ${data.tiles?.length ? data.tiles.reduce((acc, tile) => acc + /* html */`<ks-m-tile ${this.hasAttribute('no-url-params')? 'no-url-params' : '' } namespace="tile-default-" inside-tile-list parent-title='${data.bezeichnung || data.title || "No Title"}' ${data.sort === 2 ? 'sort-nearby' : ''} data='${JSON.stringify(tile).replace(/'/g, '’').replace(/"/g, '\"')}'${this.hasAttribute('is-wish-list') ? ' is-wish-list' : ''}${this.hasAttribute('is-info-events') ? ' is-info-events' : ''}${this.isNearbySearch ? ' nearby-search' : ''}></ks-m-tile>`, '') : ''}
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
              <span>
                ${data.sort == 2 ? this.getTranslation('CourseList.MoreOffersPlaceholder') : this.getTranslation('CourseList.MoreLocationsPlaceholder')}
              </span>
              <a-icon-mdx icon-name="ArrowDownRight" size="1em"></a-icon-mdx>
            </ks-a-button>
          </div>
        </div>
    </div>
    `
    /**
     * Toggle details
     */
    this.toggle = this.root.querySelector('.o-tile-list__bottom-left')
    this.tilesContainer = this.root.querySelector('.o-tile-list__tiles')
    this.loadMore = this.root.querySelector('#request-more-locations')
    this.tileTitle = this.root.querySelector('.o-tile-list__title')

    this.toggle.addEventListener('click', this.clickEventListener)
    this.tileTitle.addEventListener('click', this.clickEventListener)
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
      },
      {
        path: `${this.importMetaUrl}../../../../css/web-components-toolbox-migros-design-experience/src/es/components/organisms/MdxComponent.js`,
        name: 'mdx-component'
      }
    ])
  }

  renderTile (tileData, add = false, locationsString = '') {
    const locationsList = locationsString.split(', ').map(location => location.trim()) || []
    const locationIndexMap = locationsList.reduce((acc, location, index) => {
      acc[location] = index
      return acc
    }, {})

    if (tileData.courses.length) {
      tileData.courses.sort((a, b) => {
        const nameA = a.location.center
        const nameB = b.location.center
        return locationIndexMap[nameA] - locationIndexMap[nameB];
      })
    }

    this.ppage = tileData.ppage || this.ppage
    this.loadMore.style.display = tileData.ppage === -1 ? 'none' : 'flex'
    const tileString = Object.assign(this.data, { tiles: tileData.courses }).tiles.reduce((acc, tile) => {
      // according to this ticket, the location title aka. bezeichnung must be the location.name and location.name shall be empty [https://jira.migros.net/browse/MIDUWEB-855]
      if (!this.isNearbySearch) {
        tile.bezeichnung = tile.title = tile.location.name || tile.bezeichnung || tile.title
        if (tile.bezeichnung) tile.location.name = ''
      }

      // NOTE: the replace ".replace(/'/g, '’')" avoids the dom to close the attribute string unexpectedly. This replace is also ISO 10646 conform as the character ’ (U+2019) is the preferred character for apostrophe. See: https://www.cl.cam.ac.uk/~mgk25/ucs/quotes.html + https://www.compart.com/de/unicode/U+2019
      return acc + /* html */`<ks-m-tile ${this.hasAttribute('no-url-params')? 'no-url-params' : '' } namespace="tile-default-" inside-tile-list parent-title='${this.data.bezeichnung || this.data.title || "No Title"}' ${this.data.sort === 2 ? 'sort-nearby' : ''} data='${JSON.stringify(tile).replace(/'/g, '’').replace(/"/g, '\"')}'${this.hasAttribute('is-wish-list') ? ' is-wish-list' : ''}${this.hasAttribute('is-info-events') ? ' is-info-events' : ''}${this.isNearbySearch ? ' nearby-search' : ''}></ks-m-tile>`
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

  get isNearbySearch () {
    return this.hasAttribute('nearby-search')
  }
}
