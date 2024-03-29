// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Badge
* @type {CustomElementConstructor}
*/
export default class Badge extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()

    this.text = this.getAttribute('text') || null
    this.type = this.getAttribute('type') || 'default'

    if (this.shouldRenderHTML()) this.renderHTML()

    this.toggleTooltip()
  }

  disconnectedCallback () {}

  /**
   * Toggle tooltip
   */
  toggleTooltip () {
    const toggle = this.root.querySelector('.m-badge')
    toggle.addEventListener('click', () => {
      const tooltip = this.root.querySelector('.m-badge__tooltip')
      tooltip.classList.toggle('m-badge__tooltip-open')
    })
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
      :host .m-badge {
        position: relative;
      }

      :host .m-badge:hover {
        cursor: pointer;
      }

      :host .m-badge__tooltip {
        display: none;
        position: absolute;
        top: 3.5em;
        padding: 1em;
        background-color: #ffffff;
        color: var(--m-black);
        border-radius: 0.2em;
        box-shadow: 0em 0em 0.75em 0em #3333331A;
        z-index: 10;
      }

      :host .m-badge__tooltip-open {
        display: flex;
        flex-direction: column;
      }

      :host .m-badge__icon {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 1.5em;
      }

      :host .m-badge__tooltip::before {
        content: '';
        display: block;

        width: 0;
        height: 0;
        position: absolute;
    
        border-left: 1.25em solid transparent;
        border-right: 1.25em solid transparent;
        border-bottom: 1.25em solid #ffffff;

        top: -1em;
        left: 0.5em;
      }

      @media only screen and (max-width: _max-width_) {
        :host .m-badge {

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
      case 'badge-default-':
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
    <div class="m-badge">
        ${this.type === 'primary'
          ? '<ks-a-button badge namespace="button-primary-" color="secondary">'
          : '<ks-a-button badge namespace="button-primary-" color="tertiary">'
        }
            ${this.text == null
              ? ''
              : `${this.text}`
            }
            <a-icon-mdx icon-name="Scan_2" size="1em" class="icon-right"></a-icon-mdx>
        </ks-a-button>
        <div class="m-badge__tooltip">
          <div class="m-badge__icon">
            <a-icon-mdx icon-name="x" size="1.5em" class="icon-right"></a-icon-mdx>
          </div>
          <span>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span>
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
}
