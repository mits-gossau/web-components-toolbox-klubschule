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

    this.closeBtn.addEventListener('click', this.closeListener)
  }

  disconnectedCallback () {
    this.closeBtn.removeEventListener('click', this.closeListener)
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
        top: var(--pop-up-window-top);
        left: var(--pop-up-window-left);
        right: var(--pop-up-window-right);
        bottom: var(--pop-up-window-bottom);
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

        top: var(--pop-up-window-before-top);
        left: var(--pop-up-window-before-left);
        right: var(--pop-up-window-before-right);
        bottom: var(--pop-up-window-before-bottom);

        transform: rotate(var(--pop-up-window-before-rotation, 0));
      }

      :host .close {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 1.5em;
      }

      :host hr {
        background: var(--mdx-sys-color-neutral-subtle4, black);
        height: 1px;
        border: none;
        margin: var(--mdx-sys-spacing-flex-large-2xs) 0;
      }

      :host h4 {
        font-family: var(--mdx-sys-font-fix-label1-font-family);
        font-size: var(--mdx-sys-font-fix-label1-font-size);
        font-weight: var(--mdx-sys-font-fix-label1-font-weight);
        line-height: var(--mdx-sys-font-fix-label1-line-height);
        letter-spacing: var(--mdx-sys-font-fix-label1-letter-spacing);
        margin: 0;
      }

      :host .overlay {
          display: none;
      }

      @media only screen and (max-width: _max-width_) {
        @keyframes slide-up {
          from {transform: translateY(100%)}
          to {transform: translateY(0%)}
        }

        :host .pop-up-window {
          position: fixed;
          z-index: 1000;
          min-height: 18.75em;
          width: 100%;
          top: auto;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 0;
          animation: slide-up .5s;
        }

        :host .pop-up-window::before {
          display: none;
        }

        :host .close,
        :host .text {
          padding: 1em 1em 0 1em;
        }

        :host .overlay {
          display: block;
          position: fixed;
          inset: 0;
          background: black;
          opacity: 0.5;
        }
      }
    `
  }

  /**
   * Render HTML
   * @returns Promise<void>
   */
  renderHTML () {
    const innerHTML = Array.from(this.root.children)

    this.html = /* HTML */`
      <div class="overlay"></div>
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
