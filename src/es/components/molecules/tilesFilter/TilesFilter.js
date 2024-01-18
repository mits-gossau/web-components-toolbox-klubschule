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
      :host .m-tile-filter__search {
        display: flex;
        flex-direction: column;
        margin-bottom: 3em;
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
        :host {
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

  /**
   * Render HTML
   * @returns Promise<void>
   */
  renderHTML () {
    // don't wait for fetchModules to resolve if using "shouldRenderHTML" checks for this.badge it has to be sync
    this.html = /* HTML */`
    <div class="m-tile-filter">
        <div class="m-tile-filter__search">
          <span class="m-tile-filter__title">Angebote in Ihrer Nähe finden</span>
          <a-input namespace="search-input-tiles-" inputid="searchField" placeholder="Ihr Standort" icon-name="Location" icon-size="1.25em" search="?q=" type="search"></a-input>
        </div>
        <div class="m-tile-filter__buttons">
        <ks-a-button filter namespace="button-primary-" color="secondary">
            <a-icon-mdx icon-name="FilterKlubschule" size="1em" class="icon-left"></a-icon-mdx>Alle Filter
        </ks-a-button>
        <m-double-button namespace="double-button-default-" width="100%">
            <ks-a-button filter namespace="button-primary-" color="tertiary" justify-content="space-between">
                <span part="label1">Niveau A2/A2+</span>
                <span part="label2" dynamic></span>
            </ks-a-button>
            <ks-a-button filter namespace="button-primary-" color="tertiary" justify-content="flex-start">
                <a-icon-mdx icon-name="X" size="1em"></a-icon-mdx>
            </ks-a-button>
        </m-double-button>
        <m-double-button namespace="double-button-default-" width="100%">
            <ks-a-button filter namespace="button-primary-" color="tertiary" justify-content="space-between">
                <span part="label1">Label</span>
                <span part="label2" dynamic></span>
            </ks-a-button>
            <ks-a-button filter namespace="button-primary-" color="tertiary" justify-content="flex-start">
                <a-icon-mdx icon-name="X" size="1em"></a-icon-mdx>
            </ks-a-button>
        </m-double-button>
        <ks-a-button namespace="button-secondary-" color="tertiary">
            <span>Wochentag & Tageszeit</span>
            <a-icon-mdx namespace="icon-mdx-ks-" icon-name="ArrowDown" size="1em" class="icon-down">
        </ks-a-button>
        <ks-a-button namespace="button-secondary-" color="tertiary">
            <span>Kategorien</span>
            <a-icon-mdx namespace="icon-mdx-ks-" icon-name="ArrowDown" size="1em" class="icon-down">
        </ks-a-button>
        <ks-a-button namespace="button-secondary-" color="tertiary">
            <span>Label</span>
            <a-icon-mdx namespace="icon-mdx-ks-" icon-name="ArrowDown" size="1em" class="icon-down">
        </ks-a-button>
        <ks-a-button namespace="button-secondary-" color="tertiary">
            <span>Label</span>
            <a-icon-mdx namespace="icon-mdx-ks-" icon-name="ArrowDown" size="1em" class="icon-down">
        </ks-a-button>
        <ks-a-button namespace="button-secondary-" color="tertiary">
            <span>Label</span>
            <a-icon-mdx namespace="icon-mdx-ks-" icon-name="ArrowDown" size="1em" class="icon-down">
        </ks-a-button>
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
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/input/Input.js`,
        name: 'a-input'
      },     
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/molecules/doubleButton/DoubleButton.js`,
        name: 'm-double-button'
      }
    ])
  }
}