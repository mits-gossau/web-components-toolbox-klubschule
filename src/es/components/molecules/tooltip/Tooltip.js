// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Tooltip
* @type {CustomElementConstructor}
*/
export default class Tooltip extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.clickEventListener = event => {
      const target = event.composedPath()?.[0] /* like event target but compatible with shadow dom */

      if (!this.tooltip.contains(target)) {
        this.classList.toggle('open')
      }

      if (this.closeBtn.contains(target)) {
        this.classList.remove('open')
      }

      if (this.classList.contains('open')) {
        setTimeout(() => {
          document.body.addEventListener('click', this.clickOutsideListener)
        }, 50)
      } else {
        document.body.removeEventListener('click', this.clickOutsideListener)
      }
    }
    this.clickOutsideListener = event => {
      const target = event.composedPath()?.[0]
      if (!this.root.contains(target)) {
        this.classList.remove('open')
        document.body.removeEventListener('click', this.clickOutsideListener)
      }
    }
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()

    this.text = this.getAttribute('text') || 'This is a fallback tooltip text!'

    if (this.shouldRenderHTML()) this.renderHTML()

    this.tooltip = this.root.querySelector('.tooltip')

    this.root.addEventListener('click', this.clickEventListener)
  }

  disconnectedCallback () {
    this.root.removeEventListener('click', this.clickEventListener)
    document.body.removeEventListener('click', this.clickOutsideListener)
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
    return !this.hasTooltip
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        position: relative;
        cursor: pointer;
        z-index: 10;
        display: flex;
        align-items: center;
      }

      :host(.open) {
        z-index: 11;
      }

      :host .tooltip {
        display: none;
        background-color: white;
        box-shadow: 0px 0px 12px 0px rgba(51, 51, 51, 0.1);
        padding: 1em;
        width: 23em;
        position: absolute;
        top: var(--top);
        left: var(--left);
        right: var(--right);
        bottom: var(--bottom);
        cursor: default;
      }

      :host .tooltip::before {
        content: '';
        display: block;

        width: 0;
        height: 0;
        position: absolute;
    
        border-left: 1.25em solid transparent;
        border-right: 1.25em solid transparent;
        border-bottom: 1.25em solid #FFFFFF;

        top: var(--before-top);
        left: var(--before-left);
        right: var(--before-right);
        bottom: var(--before-bottom);
      }

      :host(.open) .tooltip {
        display: flex;
        flex-direction: column;
      }

      :host .close {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 1.5em;
        margin-left: auto;
      }

      :host .close a-icon-mdx {
        color: var(--color);
      }

      :host .text {
        width: 100%;
      }

      :host .text a {
        color: var(--a-color);
      }

      @media only screen and (max-width: _max-width_) {
        :host .tooltip {
          position: fixed;
          z-index: 1000;
          height: 18.75em;
          width: 100%;
          top: auto;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 0;
        }

        :host .tooltip::before {
          display: none;
        }

        :host .close,
        :host .text {
          padding: 1em 1em 0 1em;
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
    switch (this.getAttribute('namespace')) {
      case 'tooltip-default-':
        return this.fetchCSS(
          {
            path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
            namespace: false
          })
      case 'tooltip-right-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false,
          replaces: [{
            pattern: '--tooltip-default-',
            flags: 'g',
            replacement: '--tooltip-right-'
          }]
        }, {
          path: `${this.importMetaUrl}./right-/right-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }])
    }
  }

  /**
   * Render HTML
   * @returns Promise<void>
   */
  renderHTML () {
    // don't wait for fetchModules to resolve if using "shouldRenderHTML" checks for this.badge it has to be sync
    this.html = /* HTML */`
      <div class="tooltip">
        <div class="close">
          <a-icon-mdx icon-name="X" size="1.5em" class="icon-right"></a-icon-mdx>
        </div>
        <p class="text">
          ${this.text}
        </p>
      </div>
    `
    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ])
  }

  get hasTooltip () {
    return this.root.querySelector('.tooltip')
  }

  get closeBtn () {
    return this.root.querySelector('.close')
  }
}
