// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class TilesFilter
* @type {CustomElementConstructor}
*/
export default class TilesFilter extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
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
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host .m-tile-filter__search {
        display: flex;
        flex-direction: row;
        margin-bottom: 3em;
        gap: 3em;
      }

      :host .m-tile-filter__search > * {
        width: 100%;
      }

      :host a-input[inputid="searchField"] {
        width: 50%;
      }

      :host a-input[inputid="searchField"] + a-input[inputid="searchField"] {
        margin-left: 3em;
      }

      :host .m-tile-filter__title {
        font-size: 1.125em;
        line-height: 1.5em;
        margin-bottom: 1em;
      }

      :host .m-tile-filter__buttons {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
      }

      :host ks-a-button,
      :host m-double-button {
          margin-right: 0.5em;
          margin-bottom: 1em;
      }

      @media only screen and (max-width: _max-width_) {
        :host .m-tile-filter__search {
          flex-direction: column;
        }

        :host a-input[inputid="searchField"] {
          width: 100%;
        }

        :host a-input[inputid="searchField"] + a-input[inputid="searchField"] {
          margin-left: 0;
          margin-top: 2em
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
      default:
        return this.fetchCSS(styles)
    }
  }
}
