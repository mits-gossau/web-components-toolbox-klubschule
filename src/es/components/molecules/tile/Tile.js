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
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
  }

  disconnectedCallback () {}

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
          padding: 0 0.5em;
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
          align-items: center;
      }
      
      :host .m-tile__price {
          font-family: var(--price-font-family);
          font-size: var(--price-font-size);
          line-height: var(--price-line-height);
          font-weight: var(--price-font-weight);  
          padding-left: 0.75em;
      }
      
      :host .m-tile__price strong {
          font-family: var(--price-strong-font-family);
          font-size: var(--price-strong-font-size);
          line-height: var(--price-strong-line-height);
          font-weight: var(--price-strong-font-weight);   
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
      
      :host .m-tile__icon-box + .m-tile__icon-box {
          margin-left: 0.5em;
      }
      
      :host .m-tile__icon-box a-icon-mdx {
          color: var(--icon-box-color);
      }

      :host .m-tile__passed-message {
        font-size: 1.5em;
      }

      @media only screen and (max-width: _max-width_) {
        :host .m-tile__wrap {
            padding: 1rem 0.5rem;
        }

        :host .m-tile__content {
            font-size: 0.875em;
            line-height: 1.125em;
        }

        :host .m-tile__price strong {
            padding-top: 0.75em;
            padding-left: 0;
        }

        :host .m-tile__foot-right {
            margin-left: auto;
            flex-direction: column;
            align-items: flex-end;
            gap: 0.5rem;
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
    const data = Tile.parseAttribute(this.getAttribute('data'))
    if (!data) return console.error('Data json attribute is missing or corrupted!', this)
    // don't wait for fetchModules to resolve if using "shouldRenderHTML" checks for this.badge it has to be sync
    this.html = /* HTML */`
    <div class="m-tile">
      <div class="m-tile__wrap">
        <div class="m-tile__overlay"></div>
        <div class="m-tile__head">
          <span class="m-tile__title">${data.title || data.bezeichnung || warnMandatory + 'title'}</span>
          ${data.iconTooltip
            ? /* html */`
              <ks-m-tooltip namespace="tooltip-right-" text='${data.iconTooltip}'>
                <a-icon-mdx namespace="icon-mdx-ks-tile-" icon-name="Info" size="1.5em" class="icon-right"></a-icon-mdx>
              </ks-m-tooltip>
            `
            : ''
          }
        </div>
        <div class="m-tile__body">
          ${data.location?.name
            ? /* html */`
              ${data.location?.iconName ? `<a-icon-mdx icon-name="${data.location.iconName}" size="1em"></a-icon-mdx>` : ''}
              <span class="m-tile__content">${data.location?.name || warnMandatory + 'location'}</span>
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
        <div class="m-tile__foot">
          <div class="m-tile__foot-left">
            ${this.hasAttribute('is-wish-list') ? /* html */`<a-icon-mdx namespace="icon-mdx-ks-" icon-name="Trash" size="1em" request-event-name="remove-from-wish-list" course="${data.parentkey}"></a-icon-mdx>` : ''}
            <ks-m-buttons data-buttons='${JSON.stringify(data.buttons).replace(/'/g, 'ʼ')}' small keep-url-params></ks-m-buttons>
          </div>
          <div class="m-tile__foot-right">
            <div class="m-tile__icons">
              ${data.icons.reduce((acc, icon) => acc + /* html */`
                <div class="m-tile__icon-box">
                  <ks-m-tooltip namespace="tooltip-right-" text="${icon.text}">
                    <a-icon-mdx namespace="icon-mdx-ks-badge-" icon-name="${icon.iconName || icon.name}" size="1em"></a-icon-mdx>
                  </ks-m-tooltip>
                </div>
              `, '')}           
            </div>
            <span class="m-tile__price">${data.price?.pre ? data.price?.pre + ' ' : ''}<strong>${data.price?.amount || ''}</strong>${data.price?.per ? ' / ' + data.price?.per : ''}</span>
          </div>
        </div>      
      </div>
      <div class="m-tile__foot-passed">
        <span class="m-tile__passed-message">${data.passed?.title || warnMandatory + 'passed.title'}</span>
        <div class="m-tile__foot-left">
          ${this.hasAttribute('is-wish-list') ? /* html */`<a-icon-mdx namespace="icon-mdx-ks-" icon-name="Trash" size="1em" request-event-name="remove-from-wish-list" course="${data.parentkey}"></a-icon-mdx>` : ''}
          <ks-a-button namespace="button-secondary-" color="secondary">
            <span>${data.passed?.button.text || warnMandatory + 'passed.button.text'}</span>
            <a-icon-mdx namespace="icon-mdx-ks-" icon-name="${data.passed?.button.iconName || 'ArrowRight'}" size="1em" class="icon-right">
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
}
