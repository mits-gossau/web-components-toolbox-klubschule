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
    return !this.root.querySelector(`:host > spacing-${this.type}`)
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
        height: var(--mdx-sys-spacing-flex-large-2xl);
      }

      :host .spacing-xl-flex {
        height: var(--mdx-sys-spacing-flex-large-xl);
      }

      :host .spacing-l-flex {
        height: var(--mdx-sys-spacing-flex-large-l);
      }

      :host .spacing-m-flex {
        height: var(--mdx-sys-spacing-flex-large-m);
      }

      :host .spacing-s-flex {
        height: var(--mdx-sys-spacing-flex-large-s);
      }

      :host .spacing-xs-flex {
        height: var(--mdx-sys-spacing-flex-large-xs);
      }

      :host .spacing-2xs-flex {
        height: var(--mdx-sys-spacing-flex-large-2xs);
      }

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
      
      /* MEDIUM */
      @media (max-width: 1019px) {
          :host .spacing-2xl-flex {
              height: var(--mdx-sys-spacing-flex-medium-2xl);
          }

          :host .spacing-xl-flex {
            height: var(--mdx-sys-spacing-flex-medium-xl);
          }
    
          :host .spacing-l-flex {
            height: var(--mdx-sys-spacing-flex-medium-l);
          }
    
          :host .spacing-m-flex {
            height: var(--mdx-sys-spacing-flex-medium-m);
          }
    
          :host .spacing-s-flex {
            height: var(--mdx-sys-spacing-flex-medium-s);
          }
    
          :host .spacing-xs-flex {
            height: var(--mdx-sys-spacing-flex-medium-xs);
          }
    
          :host .spacing-2xs-flex {
            height: var(--mdx-sys-spacing-flex-medium-2xs);
          }
      }

      /* SMALL */
      @media (max-width: 669px) {
          :host .spacing-2xl-flex {
              height: var(--mdx-sys-spacing-flex-small-2xl);
          }

          :host .spacing-xl-flex {
            height: var(--mdx-sys-spacing-flex-small-xl);
          }
    
          :host .spacing-l-flex {
            height: var(--mdx-sys-spacing-flex-small-l);
          }
    
          :host .spacing-m-flex {
            height: var(--mdx-sys-spacing-flex-small-m);
          }
    
          :host .spacing-s-flex {
            height: var(--mdx-sys-spacing-flex-small-s);
          }
    
          :host .spacing-xs-flex {
            height: var(--mdx-sys-spacing-flex-small-xs);
          }
    
          :host .spacing-2xs-flex {
            height: var(--mdx-sys-spacing-flex-small-2xs);
          }
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
