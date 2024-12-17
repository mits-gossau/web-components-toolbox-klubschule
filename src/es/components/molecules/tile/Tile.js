// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Tile
* @type {CustomElementConstructor}
*/
export default class Tile extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.tileData = Tile.parseAttribute(this.getAttribute('data'))

    // caution: this searches for the first button with a link assuming this is the correct link for the whole tile,
    // in case other buttons are displayed with a different link, this would need to be changed
    this.tileLink = this.tileData?.buttons?.find(button => button.link)?.link

    this.openLink = () => {
      window.open(this.tileLink, '_self')
    }
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()

    this.tileTitle?.addEventListener('click', this.openLink)
  }

  disconnectedCallback () {
    this.tileTitle?.removeEventListener('click', this.openLink)
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
    return !this.title
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host .m-tile {
        background-color: var(--background-color);
        border: 0.0625em solid var(--border-color);
        height: 100%;
      }

      :host .m-tile__wrap {
        position: relative;
        height: 100%;
        padding: 1.5em;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    
      :host .m-tile__overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          height: 100%;
          width: 100%;
          background-color: var(--overlay-background-color);
          z-index: 1;
          opacity: 0.5;
          display: var(--overlay-display);
      }

      :host .m-tile__head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 0.75em;
        gap: 0.75rem;
      }

      :host .m-tile__head ks-m-tooltip {
        margin-bottom: auto;
      }
      
      :host .m-tile__title {
        font-family: var(--title-font-family);
        font-size: var(--title-font-size);
        line-height: var(--title-line-height);
        font-weight: var(--title-font-weight);   
        cursor: pointer;
      }

      :host .m-tile__title-other-locations {
        color: var(--title-other-locations-color);
        font: var(--title-other-locations-font);
      }

      :host .m-tile__title:hover {
        color: var(--title-color-hover);
      }

      :host .m-tile__body {
        display: flex;
        align-items: center;
        padding-bottom: 2em;
      }
      
      :host .m-tile__content {
          font-size: 1em;
          line-height: 1.25em;
          font-weight: 400;          
          padding: 0 0.5em 0 0;
      }

      :host .m-tile__content__next-start-dates-label {
        color: var(--next-start-dates-label-color);
        font: var(--next-start-dates-label-font);
      }

      :host .m-tile__content__next-start-dates {
        font: var(--next-start-dates-font);
      }

      :host .m-tile__body a-icon-mdx {
        display: inline-flex;
        padding-right: 0.5em;
        color: inherit;
      }
      
      :host .m-tile__foot {
          display: var(--foot-display);
          justify-content: var(--foot-justify-content);
          flex-wrap: wrap;
          align-items: var(--foot-align-items);
          padding: var(--foot-padding);
          gap: 1em;
      }

      :host .m-tile__foot-passed {
        display: var(--foot-passed-display);
        justify-content: var(--foot-passed-justify-content);
        align-items: var(--foot-passed-align-items);
        padding: var(--foot-passed-padding);
        border-top: var(--foot-passed-border-top);
      }
      
      :host .m-tile__foot-left {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 0.5em;
      }
      
      :host .m-tile__foot-right {
          display: flex;
          flex-direction: row;
          align-items: flex-end;
          flex-wrap: wrap;
          justify-content: end;
      }
      
      :host .m-tile__price {
          font: var(--price-font); 
          padding-left: 0.75em;
          text-align: end;
      }
      
      :host .m-tile__price strong {
          font: var(--price-strong-font);
      }
      
      :host a-icon-mdx {
          color: var(--icon-color);
      }
      
      :host a-icon-mdx + ks-a-button {
          margin-left: 0.5em;
      }
      
      :host .m-tile__icons {
          display: flex;
          align-items: center;
          gap: 0.5em;;
      }
      
      :host .m-tile__icon-box {
          background-color: var(--icon-color);
          border-radius:  0.1875em;
          height: var(--icon-box-dimension);
          width: var(--icon-box-dimension);
          display: flex;
          justify-content: center;
          align-items: center;
      }
      
      :host .m-tile__icon-box a-icon-mdx {
        color: var(--icon-box-color);
      }

      :host .m-tile__passed-message {
        font: var(--passed-message-font);
      }

      @media only screen and (max-width: 1024px) {
        :host .m-tile__wrap {
          padding: 1rem 0.5rem;
        }
      }

      @media only screen and (max-width: _max-width_) {

        :host .m-tile__content {
            font-size: 0.875em;
            line-height: 1.125em;
        }

        :host .m-tile__price strong {
            padding-top: 0.75em;
            padding-left: 0;
        }

        :host .m-tile__foot {
          gap: 0;
        }

        :host .m-tile__foot-right {
            flex-direction: column;
            align-items: flex-end;
            gap: 0.5rem;
        }

        :host .m-tile__foot-passed .m-tile__foot-left {
          justify-content: space-between;
        }

        :host .m-tile__foot-passed {
          flex-direction: column;
          align-items: unset;
          gap: 1rem;
        }

        :host .m-tile__icon-box + .m-tile__icon-box {
          margin-left: 1rem;
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
    switch (this.getAttribute('namespace')) {
      case 'tile-default-':
        return this.fetchCSS([
          {
            path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
            namespace: false
          }, ...styles])
      case 'tile-passed-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false,
          replaces: [{
            pattern: '--tile-default-',
            flags: 'g',
            replacement: '--tile-passed-'
          }]
        }, {
          path: `${this.importMetaUrl}./passed-/passed-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles])
      default:
        return this.fetchCSS(styles)
    }
  }

  /**
   * Render HTML
   * @returns Promise<void>
   */
  renderHTML () {
    const warnMandatory = 'data attribute requires: '
    const data = this.tileData
    if (!data) return console.error('Data json attribute is missing or corrupted!', this)
    if (this.hasAttribute('parent-title')) data.parentTitle = this.getAttribute('parent-title')
    // don't wait for fetchModules to resolve if using "shouldRenderHTML" checks for this.badge it has to be sync
    // NOTE: the replace ".replace(/'/g, '’')" avoids the dom to close the attribute string unexpectedly. This replace is also ISO 10646 conform as the character ’ (U+2019) is the preferred character for apostrophe. See: https://www.cl.cam.ac.uk/~mgk25/ucs/quotes.html + https://www.compart.com/de/unicode/U+2019
    this.html = /* HTML */`
    <div class="m-tile">
      <div class="m-tile__wrap">
        <div class="m-tile__overlay"></div>
        <div class="m-tile__head">
          <ks-c-gtm-event
            mode="false" 
            listen-to="click"
            event-data='{
              "event": "select_item",
              "ecommerce": {    
                "items": [{ 
                  "item_name": "${data.parentTitle || data.title || data.bezeichnung || 'No Title'}",                
                  "item_id": "${this.getItemId(data)}",
                  "price": ${data.price?.price || data.preis_total || 0},
                  ${data.spartename?.[0] ? `"item_category": "${data.spartename[0]}",` : ''}
                  ${data.spartename?.[1] ? `"item_category2": "${data.spartename[1]}",` : ''}
                  ${data.spartename?.[2] ? `"item_category3": "${data.spartename[2]}",` : ''}
                  ${data.spartename?.[3] ? `"item_category4": "${data.spartename[3]}",` : ''}
                  "quantity": 1,
                  "item_variant": "${data.location?.center ? data.location.center : data.center ? data.center.bezeichnung_internet : ''}",
                  "currency": "CHF"
                }]
              }
            }'
          >
            <span class="${this.hasAttribute('is-other-locations') ? 'm-tile__title-other-locations' : 'm-tile__title'}">${data.title || data.bezeichnung || warnMandatory + 'title'}</span>
          </ks-c-gtm-event>
          ${data.infotextshort
            ? /* html */`
              <ks-m-tooltip namespace="tooltip-right-" text='${data.infotextshort}'>
                <a-icon-mdx namespace="icon-mdx-ks-tile-" icon-name="Info" size="1.5em" class="icon-right"></a-icon-mdx>
              </ks-m-tooltip>
            `
            : ''
          }
        </div>
        <div class="m-tile__body" ${this.hasAttribute('is-other-locations') ? `style="display:none;"` : ''}>
          ${!this.hasAttribute('is-other-locations') && data.location?.name
            ? /* html */`
              ${data.location?.iconName ? `<a-icon-mdx icon-name="${data.location.iconName}" size="1em"></a-icon-mdx>` : ''}
              <span class="m-tile__content">${data.location?.name || warnMandatory + 'location'}</span>
            `
            : ''
          }
          ${this.hasAttribute('is-other-locations') 
            ? /* html */`
              <!--<span class="m-tile__content">
                <span class="m-tile__content__next-start-dates-label">${this.getAttribute('next-start-dates-text')}</span><br />
                <span class="m-tile__content__next-start-dates">TODO: Termine eintragen</span>
              </span>-->
            `
            : ''
          }
          ${data.location?.badge && !this.isPassed && ((this.isNearbySearch && this.isInsideTileList) || !this.isInsideTileList)
            ? /* html */`
              <ks-a-button badge namespace="button-secondary-" color="tertiary">
                <span>${data.location.badge}</span>
              </ks-a-button>
            `
            : ''
          }
        </div>
        <div class="m-tile__foot">
          <div class="m-tile__foot-left">
            ${this.hasAttribute('is-wish-list') && !this.isPassed && !this.hasAttribute('is-info-events') ? /* html */`<a-icon-mdx namespace="icon-mdx-ks-" icon-name="Trash" size="1em" request-event-name="remove-from-wish-list" course="${data.parentkey ? `${data.parentkey}${data.centerid ? `_${data.centerid}` : ''}` : `${data.kurs_typ}_${data.kurs_id}_${data.centerid}`}"></a-icon-mdx>` : ''}
            ${this.isPassed && this.hasAttribute('is-wish-list') && !data.buttons.length ?  '' : /* html */ `<ks-m-buttons ${this.hasAttribute('sort-nearby') ? 'sort-nearby' : ''} parent-title='${data.parentTitle || data.title || data.bezeichnung || 'No Title'}' course-data='${JSON.stringify(data).replace(/'/g, '’')}' small ${this.hasAttribute('no-url-params') ? '' : 'keep-url-params="'+data.centerid+'"'} is-tile></ks-m-buttons>`}
          </div>
          <div class="m-tile__foot-right">
            <div class="m-tile__icons">
              ${data.icons.reduce((acc, icon) => acc + /* html */`
                <ks-m-tooltip mode="false" namespace="tooltip-right-" text="${icon.text?.replaceAll('"', "'")}">
                  <div class="m-tile__icon-box">
                    <a-icon-mdx namespace="icon-mdx-ks-badge-" icon-name="${icon.iconName || icon.name}" size="1em"></a-icon-mdx>  
                  </div>
                </ks-m-tooltip>
              `, '')}           
            </div>
            ${!this.isPassed ? /* html */ `<span class="m-tile__price">${data.price?.pre ? data.price?.pre + ' ' : ''}<strong>${data.price?.amount || ''}</strong>${data.price?.per ? ' / ' + data.price?.per : ''}</span>` : ''}
          </div>
        </div>      
      </div>
      <div class="m-tile__foot-passed">
        <span class="m-tile__passed-message">${this.getAttribute("passed-message")}</span>
        <div class="m-tile__foot-left">
          ${this.hasAttribute('is-wish-list') && !this.hasAttribute('is-info-events') ? /* html */`<a-icon-mdx namespace="icon-mdx-ks-" icon-name="Trash" size="1em" request-event-name="remove-from-wish-list" course="${data.parentkey ? data.parentkey : `${data.kurs_typ}_${data.kurs_id}_${data.centerid}`}"></a-icon-mdx>` : ''}
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
        path: `${this.importMetaUrl}../../molecules/buttons/Buttons.js`,
        name: 'ks-m-buttons'
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

  get title () {
    return this.root.querySelector('.m-tile')
  }

  get tileTitle () {
    return this.root.querySelector('.m-tile__title')
  }

  get isNearbySearch () {
    return this.hasAttribute('nearby-search')
  }

  get isInsideTileList () {
    return this.hasAttribute('inside-tile-list')
  }

  get isPassed () {
    return this.hasAttribute('is-passed')
  }

  getItemId (data) {
    const itemId = data.kurs_typ + '_' + data.kurs_id
    const centerId = data.centerid ? `_${data.centerid}` : ''
    const parentId = data.parentkey ? data.parentkey.includes(data.centerid) ? data.parentkey : data.parentkey + centerId : data.parent_kurs_id && data.parent_kurs_typ ? `${data.parent_kurs_typ}_${data.parent_kurs_id}${centerId}` : ''
    return parentId ? `${parentId}--${itemId}` : `${itemId}${centerId}--${itemId}`
  }
}
