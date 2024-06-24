// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Spacing
* @type {CustomElementConstructor}
*/
export default class Spacing extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.type = this.getAttribute('type') || '2xl-flex';
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
    return !this.root.querySelector(`:host > .spacing-${this.type}`)
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        display: block;
      }

      :host .spacing {
        display: block;
      }

      :host .spacing-2xl-flex {
        height: var(--mdx-sys-spacing-flex-2xl);
      }

      :host .spacing-xl-flex {
        height: var(--mdx-sys-spacing-flex-xl);
      }

      :host .spacing-l-flex {
        height: var(--mdx-sys-spacing-flex-l);
      }

      :host .spacing-m-flex {
        height: var(--mdx-sys-spacing-flex-m);
      }

      :host .spacing-s-flex {
        height: var(--mdx-sys-spacing-flex-s);
      }

      :host .spacing-xs-flex {
        height: var(--mdx-sys-spacing-flex-xs);
      }

      :host .spacing-2xs-flex {
        height: var(--mdx-sys-spacing-flex-2xs);
      }

      /* FIX */
      :host .spacing-3xl-fix {
        height: var(--mdx-sys-spacing-fix-3xl);
      }

      :host .spacing-2xl-fix {
        height: var(--mdx-sys-spacing-fix-2xl);
      }

      :host .spacing-xl-fix {
        height: var(--mdx-sys-spacing-fix-xl);
      }

      :host .spacing-l-fix {
        height: var(--mdx-sys-spacing-fix-l);
      }

      :host .spacing-m-fix {
        height: var(--mdx-sys-spacing-fix-m);
      }

      :host .spacing-s-fix {
        height: var(--mdx-sys-spacing-fix-s);
      }

      :host .spacing-xs-fix {
        height: var(--mdx-sys-spacing-fix-xs);
      }

      :host .spacing-2xs-fix {
        height: var(--mdx-sys-spacing-fix-2xs);
      }

      :host .spacing-3xs-fix {
        height: var(--mdx-sys-spacing-fix-3xs);
      }

      :host .spacing-4xs-fix {
        height: var(--mdx-sys-spacing-fix-4xs);
      }
    `
  }

    /**
   * Render HTML
   * @returns Promise<void>
   */
    renderHTML () {
      this.html = /* HTML */`
      <div class="spacing spacing-${this.type}"></div>
      `
    }
}
