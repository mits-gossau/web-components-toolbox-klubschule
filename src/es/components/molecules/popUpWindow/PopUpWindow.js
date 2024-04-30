// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class PopUpWindow
* @type {CustomElementConstructor}
*/
export default class PopUpWindow extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.closeListener = this.closeListener.bind(this)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()

    this.closeBtn.addEventListener('click', () => {
        console.log(this)
      this.closeListener()
    })
  }

  closeListener () {
    this.setAttribute('show', 'false')
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
    return !this.hasTooltip
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        position: relative;
        z-index: 10;
        display: flex;
        align-items: center;
        font-size: 1rem;
      }

      :host([show=false]) {
        display: none;
      }

      :host .pop-up-window {
        display: block;
        background-color: white;
        box-shadow: 0px 0px 12px 0px rgba(51, 51, 51, 0.1);
        padding: 1em;
        width: 23em;
        position: absolute;
        top: var(--top);
        left: var(--left);
        right: var(--right);
        bottom: var(--bottom);
      }

      :host .pop-up-window::before {
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

      :host .close {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 1.5em;
      }

      @media only screen and (max-width: _max-width_) {
        :host .pop-up-window {
          // position: fixed;
          z-index: 1000;
          height: 18.75em;
          width: 100%;
          top: auto;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 0;
        }

        :host .pop-up-window::before {
          display: none;
        }

        :host .close,
        :host .text {
          padding: 1em 1em 0 1em;
        }
      }

      hr {
        background: var(--mdx-sys-color-neutral-subtle4, black);
        height: 1px;
        border: none;
      }
    `
  }

  /**
   * Render HTML
   * @returns Promise<void>
   */
  renderHTML () {
    const innerHTML = Array.from(this.root.children)

    // don't wait for fetchModules to resolve if using "shouldRenderHTML" checks for this.badge it has to be sync
    this.html = /* HTML */`
      <div class="pop-up-window">
        <div class="close">
          <a-icon-mdx icon-name="X" size="1.5em" class="icon-right"></a-icon-mdx>
        </div>
        <p class="text">
        ${/* innerHTML... */''}
        </p>
      </div>
    `

    innerHTML.forEach(child => {
      this.root.querySelector('.text').appendChild(child)
    })

    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ])
  }

  get hasTooltip () {
    return this.root.querySelector('.pop-up-window')
  }

  get closeBtn () {
    return this.root.querySelector('.close')
  }
}
