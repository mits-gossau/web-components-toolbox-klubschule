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
    this.isPassed = this.getAttribute('isPassed') || false;

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
      :host {}
      @media only screen and (max-width: _max-width_) {
        :host {}
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
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
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
    let classNames = '';
    if (this.isPassed == 'true') {
      classNames = 'm-tile m-tile--passed';
    } else {
      classNames = 'm-tile';
    }
    // don't wait for fetchModules to resolve if using "shouldRenderHTML" checks for this.badge it has to be sync
    this.html = /* HTML */`
    <div class="${classNames}">
      <div class="m-tile__wrap">
        <div class="m-tile__overlay"></div>
        <div class="m-tile__head">
          <span class="m-tile__title">Title</span>
          <a-icon-mdx namespace="icon-mdx-ks-" icon-name="Info" size="24px" class="icon-right"></a-icon-mdx>
        </div>
        <div class="m-tile__body">
          <a-icon-mdx icon-name="Location" size="1em"></a-icon-mdx>
          <span class="m-tile__content">Basel, Luzern, Thun, Zürich-Oerlikon +3</span>
          <ks-a-button badge namespace="button-secondary-" color="tertiary">
            <span>Blended</span>
          </ks-a-button>
        </div>
        <div class="m-tile__foot">
          <div class="m-tile__foot-left">
            <a-icon-mdx namespace="icon-mdx-ks-" icon-name="Trash" size="1em"></a-icon-mdx>
              <ks-a-button namespace="button-${this.buttonType}-" color="secondary">
              <span>Ortsauswahl</span>
              <a-icon-mdx namespace="icon-mdx-ks-" icon-name="ArrowRight" size="16px" class="icon-right">
            </ks-a-button>
          </div>
          <div class="m-tile__foot-right">
            <div class="m-tile__icons">
              <a-icon-mdx namespace="icon-mdx-ks-" icon-name="Percent" size="1em"></a-icon-mdx>
            </div>
            <span class="m-tile__price">ab <strong>Preis</strong> / Semester</span>
          </div>
        </div>      
      </div>
      <div class="m-tile__foot m-tile__foot--passed">
        <span class="m-tile__passed-message">Veranstaltung nicht mehr verfügbar!</span>
        <div class="m-tile__foot-left">
          <a-icon-mdx namespace="icon-mdx-ks-" icon-name="Trash" size="1em"></a-icon-mdx>
          <ks-a-button namespace="button-${this.buttonType}-" color="secondary">
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