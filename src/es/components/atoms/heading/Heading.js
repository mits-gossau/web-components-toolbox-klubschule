// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Heading
* @type {CustomElementConstructor}
*/
export default class Heading extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.tag = this.getAttribute('tag') || 'h1'
    this.styleAs = this.getAttribute('style-as')
    this.color = this.getAttribute('color') || 'var(--mdx-base-color-grey-975)'

    this.heading = document.createElement(this.tag)
    if (this.styleAs) this.heading.setAttribute('class', this.styleAs)
    // this.heading.setAttribute('style', `color: ${this.color}`)

    // copy attributes to heading
    for (const attrib of this.attributes) {
      if (attrib.name !== 'tag' && attrib.name !== 'style-as' && attrib.name !== 'color') {
        this.heading.setAttribute(attrib.name, attrib.value)
      }
    }

    // copy children to heading
    while (this.firstChild) {
      this.heading.appendChild(this.firstChild)
    }
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
    return !this.root.querySelector(`:host > ${this.tag}, ${this.tagName} > ${this.tag}`)
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        --h-color: ${this.getAttribute('color')};
        --h-font-family: var(--font-family);
        --h-font-size: calc(16rem / 3); /* 96px */
        --h-font-weight: 500;
        --h-line-height: 1;
        --h-margin: 0;
        --h-padding: 0;

        --h1-font-size: calc(96rem / 18); /* 96px */
        --h2-font-size: calc(76rem / 18); /* 76px */
        --h3-font-size: calc(48rem / 18); /* 48px */
        --h4-font-size: calc(36rem / 18); /* 36px */
        --h5-font-size: calc(32rem / 18); /* 32px */
        --h6-font-size: calc(24rem / 18); /* 24px */

        --h1-color: var(--h-color);
        --h2-color: var(--h-color);
        --h3-color: var(--h-color);
        --h4-color: var(--h-color);
        --h5-color: var(--h-color);
        --h6-color: var(--h-color);

        --h1-font-family: var(--h-font-family);
        --h2-font-family: var(--h-font-family);
        --h3-font-family: var(--h-font-family);
        --h4-font-family: var(--h-font-family);
        --h5-font-family: var(--h-font-family);
        --h6-font-family: var(--h-font-family);
    
        --h1-font-weight: var(--h-font-weight);
        --h2-font-weight: var(--h-font-weight);
        --h3-font-weight: var(--h-font-weight);
        --h4-font-weight: var(--h-font-weight);
        --h5-font-weight: var(--h-font-weight);
        --h6-font-weight: var(--h-font-weight);

        --h1-line-height: var(--h-line-height);
        --h2-line-height: var(--h-line-height);
        --h3-line-height: var(--h-line-height);
        --h4-line-height: var(--h-line-height);
        --h5-line-height: var(--h-line-height);
        --h6-line-height: var(--h-line-height);

        --h1-margin: var(--h-margin);
        --h2-margin: var(--h-margin);
        --h3-margin: var(--h-margin);
        --h4-margin: var(--h-margin);
        --h5-margin: var(--h-margin);
        --h6-margin: var(--h-margin);

        --h1-padding: var(--h-padding);
        --h2-padding: var(--h-padding);
        --h3-padding: var(--h-padding);
        --h4-padding: var(--h-padding);
        --h5-padding: var(--h-padding);
        --h6-padding: var(--h-padding);
      }
      :host .h1 {
        font-size: var(--h1-font-size);
        color: var(--h1-color);
        font-family: var(--h1-font-family);
        font-weight: var(--h1-font-weight);
        line-height: var(--h1-line-height);
        margin: var(--h1-margin);
        padding: var(--h1-padding);
      }
      :host .h2 {
        font-size: var(--h2-font-size);
        color: var(--h2-color);
        font-family: var(--h2-font-family);
        font-weight: var(--h2-font-weight);
        line-height: var(--h2-line-height);
        margin: var(--h2-margin);
        padding: var(--h2-padding);
      }
      :host .h3 {
        font-size: var(--h3-font-size);
        color: var(--h3-color);
        font-family: var(--h3-font-family);
        font-weight: var(--h3-font-weight);
        line-height: var(--h3-line-height);
        margin: var(--h3-margin);
        padding: var(--h3-padding);
      }
      :host .h4 {
        font-size: var(--h4-font-size);
        color: var(--h4-color);
        font-family: var(--h4-font-family);
        font-weight: var(--h4-font-weight);
        line-height: var(--h4-line-height);
        margin: var(--h4-margin);
        padding: var(--h4-padding);
      }
      :host .h5 {
        font-size: var(--h5-font-size);
        color: var(--h5-color);
        font-family: var(--h5-font-family);
        font-weight: var(--h5-font-weight);
        line-height: var(--h5-line-height);
        margin: var(--h5-margin);
        padding: var(--h5-padding);
      }
      :host .h6 {
        font-size: var(--h6-font-size);
        color: var(--h6-color);
        font-family: var(--h6-font-family);
        font-weight: var(--h6-font-weight);
        line-height: var(--h6-line-height);
        margin: var(--h6-margin);
        padding: var(--h6-padding);
      }
      /* border top */
      :host([border-top]) [border-top]::before {
        background-color: var(--h-border-top-color, var(--mdx-base-color-klubschule-red-600));
        content: '';
        display: block;
        margin-bottom: var(--h-border-margin-bottom, 16px);
        height: var(--h-border-top-height, 4px);
        width: var(--h-border-top-width, 32px);
      }
      @media only screen and (max-width: _max-width_) {
        :host {
          --h1-font-size-mobile: calc(64rem / 16); /* 64px */
          --h2-font-size-mobile: calc(32rem / 16); /* 32px */
          --h3-font-size-mobile: calc(28rem / 16); /* 28px */
          --h4-font-size-mobile: calc(28rem / 16); /* 28px */
          --h5-font-size-mobile: calc(24rem / 16); /* 24px */
          --h6-font-size-mobile: calc(20rem / 16); /* 20px */
        }
        :host .h1 {
          font-size: var(--h1-font-size-mobile);
        }
        :host .h2 {
          font-size: var(--h2-font-size-mobile);
        }
        :host .h3 {
          font-size: var(--h3-font-size-mobile);
        }
        :host .h4 {
          font-size: var(--h4-font-size-mobile);
        }
        :host .h5 {
          font-size: var(--h5-font-size-mobile);
        }
        :host .h6 {
          font-size: var(--h6-font-size-mobile);
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
      case 'heading-default-':
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
   * @returns void
   */
  renderHTML () {
    this.html = this.heading
  }
}
