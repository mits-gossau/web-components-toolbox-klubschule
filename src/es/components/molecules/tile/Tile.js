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
    // Define button type (default secondary)
    this.buttonType = this.getAttribute('buttonType') || 'secondary';
    this.modifier = this.getAttribute('modifier') || '';

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
      :host .m-tile {
        background-color: var(--background-color);
        border: 0.0625em solid var(--border-color);
      }

      :host .m-tile__wrap {
        position: relative;
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
        padding: 1.5em;
        padding-bottom: 0.75em;
      }

      :host .m-tile__head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5em;
        padding-bottom: 0.75em;
      }
      
      :host .m-tile__title {
          font-size: 1.5em;
          line-height: 1.625em;
          font-weight: 500;
      }
      
      :host .m-tile__body {
          display: flex;
          align-items: center;
          padding: 1.5em;
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
          align-items: var(--foot-align-items);
          padding: var(--foot-padding);
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
      }
      
      :host .m-tile__foot-right {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding-left: 1em;
      }
      
      :host .m-tile__price {
          font-size: 0.875em;
          line-height: 0.9375em;
          font-weight: 500;
          padding-left: 0.75em;
      }
      
      :host .m-tile__price strong {
          font-family: 'Graphik';
          font-size: 1.5em;
          line-height: 1.625em;
          font-weight: 500;    
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
        :host .m-tile {
            padding: 0.5em 0;
        }

        :host .m-tile__title {
            font-size: 1.25em;
            line-height: 1.375em;
        }

        :host .m-tile__content {
            font-size: 0.875em;
            line-height: 1.125em;
        }

        :host .m-tile__price strong {
            font-size: 1.125em;
            line-height: 1.25em;
            padding-top: 0.75em;
            padding-left: 0;
        }

        :host .m-tile__foot-right {
            flex-direction: column;
            align-items: flex-end;
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
        },{
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
    // don't wait for fetchModules to resolve if using "shouldRenderHTML" checks for this.badge it has to be sync
    this.html = /* HTML */`
    <div class="m-tile">
      <div class="m-tile__wrap">
        <div class="m-tile__overlay"></div>
        <div class="m-tile__head">
          <span class="m-tile__title">Title</span>
          <a-icon-mdx namespace="icon-mdx-ks-" icon-name="Info" size="1.5em" class="icon-right"></a-icon-mdx>
        </div>
        <div class="m-tile__body">
          <a-icon-mdx icon-name="Location" size="1em"></a-icon-mdx>
          <span class="m-tile__content">Ort, Straße 123</span>
          <ks-a-button badge namespace="button-secondary-" color="tertiary">
            <span>Blended</span>
          </ks-a-button>
        </div>
        <div class="m-tile__foot">
          <div class="m-tile__foot-left">
            <a-icon-mdx namespace="icon-mdx-ks-" icon-name="Trash" size="1em"></a-icon-mdx>
              <ks-a-button namespace="button-${this.buttonType}-" color="secondary">
              <span>Ortsauswahl</span>
              <a-icon-mdx namespace="icon-mdx-ks-" icon-name="ArrowRight" size="1em" class="icon-right">
            </ks-a-button>
          </div>
          <div class="m-tile__foot-right">
            <div class="m-tile__icons">
              <div class="m-tile__icon-box">
                <a-icon-mdx namespace="icon-mdx-ks-" icon-name="Percent" size="1em"></a-icon-mdx>
              </div>
              <div class="m-tile__icon-box">
                <a-icon-mdx namespace="icon-mdx-ks-" icon-name="Bell" size="1em"></a-icon-mdx>
              </div>             
            </div>
            <span class="m-tile__price">ab <strong>Preis</strong> / Semester</span>
          </div>
        </div>      
      </div>
      <div class="m-tile__foot-passed">
        <span class="m-tile__passed-message">Veranstaltung nicht mehr verfügbar!</span>
        <div class="m-tile__foot-left">
          <a-icon-mdx namespace="icon-mdx-ks-" icon-name="Trash" size="1em"></a-icon-mdx>
          <ks-a-button namespace="button-secondary-" color="secondary">
            <span>Alternativen</span>
            <a-icon-mdx namespace="icon-mdx-ks-" icon-name="ArrowRight" size="1em" class="icon-right">
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
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ])
  }

  get badge () {
    return this.root.querySelector('[badge]')
  }
}