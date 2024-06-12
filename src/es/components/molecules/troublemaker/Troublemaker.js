// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Troublemaker
* @type {CustomElementConstructor}
*/
export default class Troublemaker extends Shadow() {
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
    return !this.troublemaker
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host .m-troublemaker {
        padding: 1.5em;
        background-color: #EFEBE7;
        border: 0.0625em solid var(--m-gray-700);
        display: flex;
        justify-content: space-between;
      }

      :host .m-troublemaker__container {
        width: 50%;
      }

      :host .m-troublemaker__title {
        font-size: 1.5em;
        line-height: 1.625em;
        color: #0053A6;
        
      }

      :host .m-troublemaker__text {
        font-size: 1.125em;
        line-height: 1.5em;
        color: #222222;
        margin-top: 1.125em;
      }

      :host .m-troublemaker__container-right {
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
      }

      @media only screen and (max-width: _max-width_) {
        :host .m-troublemaker {
          flex-direction: column;
        }

        :host .m-troublemaker__text {
          margin: 0.5em 0;
        }

        :host .m-troublemaker__container {
          width: 100%;
        }

        :host .m-troublemaker__container-right {
          justify-content: flex-start;
          align-items: flex-start;
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
      case 'troublemaker-default-':
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
    <div class="m-troublemaker">
      <div class="m-troublemaker__container">
        <span class="m-troublemaker__title">Headline Lorem Ipsum dolor?</span>
        <p class="m-troublemaker__text">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>
      </div>
      <div class="m-troublemaker__container m-troublemaker__container-right">
        <ks-a-button namespace="button-primary-" color="secondary">
          <span>Passende Abos anzeigen</span>
          <a-icon-mdx namespace="icon-mdx-ks-" icon-name="ArrowRight" size="1em" class="icon-right">
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
      }
    ])
  }

  get troublemaker () {
    return this.root.querySelector('.m-troublemaker')
  }
}
