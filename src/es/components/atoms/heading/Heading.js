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
        --h-margin: var(--mdx-sys-spacing-flex-s) 0;
        --h-padding: 0;

        --display1-font-weight: var(--mdx-sys-font-flex-display1-font-weight);
        --display1-line-height: var(--mdx-sys-font-flex-display1-line-height);
        --display1-font-size: var(--mdx-sys-font-flex-display1-font-size);
        --display1-letter-spacing: var(--mdx-sys-font-flex-display1-letter-spacing);
        --display1-padding: var(--mdx-sys-font-flex-display1-paragraph-spacing);
        --display1-text-transform: var(--mdx-sys-font-flex-display1-text-case);
        --display1-text-decoration: var(--mdx-sys-font-flex-display1-text-decoration);

        --display2-font-family: var(--mdx-sys-font-flex-display2-font-family);
        --display2-font-weight: var(--mdx-sys-font-flex-display2-font-weight);
        --display2-line-height: var(--mdx-sys-font-flex-display2-line-height);
        --display2-font-size: var(--mdx-sys-font-flex-display2-font-size);
        --display2-letter-spacing: var(--mdx-sys-font-flex-display2-letter-spacing);
        --display2-padding: var(--mdx-sys-font-flex-display2-paragraph-spacing);
        --display2-text-transform: var(--mdx-sys-font-flex-display2-text-case);
        --display2-text-decoration: var(--mdx-sys-font-flex-display2-text-decoration);

        --display3-font-family: var(--mdx-sys-font-flex-display3-font-family);
        --display3-font-weight: var(--mdx-sys-font-flex-display3-font-weight);
        --display3-line-height: var(--mdx-sys-font-flex-display3-line-height);
        --display3-font-size: var(--mdx-sys-font-flex-display3-font-size);
        --display3-letter-spacing: var(--mdx-sys-font-flex-display3-letter-spacing);
        --display3-padding: var(--mdx-sys-font-flex-display3-paragraph-spacing);
        --display3-text-transform: var(--mdx-sys-font-flex-display3-text-case);
        --display3-text-decoration: var(--mdx-sys-font-flex-display3-text-decoration);

        --h1-font-weight: var(--mdx-sys-font-flex-headline1-font-weight);
        --h1-line-height: var(--mdx-sys-font-flex-headline1-line-height);
        --h1-font-size: var(--mdx-sys-font-flex-headline1-font-size);
        --h1-letter-spacing: var(--mdx-sys-font-flex-headline1-letter-spacing);
        --h1-padding: var(--mdx-sys-font-flex-headline1-paragraph-spacing);
        --h1-text-transform: var(--mdx-sys-font-flex-headline1-text-case);
        --h1-text-decoration: var(--mdx-sys-font-flex-headline1-text-decoration);

        --h2-font-family: var(--mdx-sys-font-flex-headline2-font-family);
        --h2-font-weight: var(--mdx-sys-font-flex-headline2-font-weight);
        --h2-line-height: var(--mdx-sys-font-flex-headline2-line-height);
        --h2-font-size: var(--mdx-sys-font-flex-headline2-font-size);
        --h2-letter-spacing: var(--mdx-sys-font-flex-headline2-letter-spacing);
        --h2-padding: var(--mdx-sys-font-flex-headline2-paragraph-spacing);
        --h2-text-transform: var(--mdx-sys-font-flex-headline2-text-case);
        --h2-text-decoration: var(--mdx-sys-font-flex-headline2-text-decoration);

        --h3-font-family: var(--mdx-sys-font-flex-headline3-font-family);
        --h3-font-weight: var(--mdx-sys-font-flex-headline3-font-weight);
        --h3-line-height: var(--mdx-sys-font-flex-headline3-line-height);
        --h3-font-size: var(--mdx-sys-font-flex-headline3-font-size);
        --h3-letter-spacing: var(--mdx-sys-font-flex-headline3-letter-spacing);
        --h3-padding: var(--mdx-sys-font-flex-headline3-paragraph-spacing);
        --h3-text-transform: var(--mdx-sys-font-flex-headline3-text-case);
        --h3-text-decoration: var(--mdx-sys-font-flex-headline3-text-decoration);

        --h1-margin: var(--h-margin);
        --h2-margin: var(--h-margin);
        --h3-margin: var(--h-margin);

        --h1-padding: var(--h-padding);
        --h2-padding: var(--h-padding);
        --h3-padding: var(--h-padding);
      }
      :host .h1 {
        font-size: var(--h1-font-size);
        color: var(--h-color);
        font-family: var(--h1-font-family);
        font-weight: var(--h1-font-weight);
        line-height: var(--h1-line-height);
        margin: var(--h1-margin);
        padding: var(--h1-padding);
      }
      :host .h2 {
        font-size: var(--h2-font-size);
        color: var(--h-color);
        font-family: var(--h2-font-family);
        font-weight: var(--h2-font-weight);
        line-height: var(--h2-line-height);
        margin: var(--h2-margin);
        padding: var(--h2-padding);
      }
      :host .h3 {
        font-size: var(--h3-font-size);
        color: var(--h-color);
        font-family: var(--h3-font-family);
        font-weight: var(--h3-font-weight);
        line-height: var(--h3-line-height);
        margin: var(--h3-margin);
        padding: var(--h3-padding);
      }
      /* display */
      :host([display-1]) [display-1] {
        font-size: var(--display1-font-size);
      }
      :host([display-2]) [display-2] {
        font-size: var(--display2-font-size);
      }
      :host([display-3]) [display-3] {
        font-size: var(--display3-font-size);
      }
      /* border top */
      :host([border-top]) [border-top]::before {
        background-color: var(--h-border-top-color, var(--mdx-sys-color-accent-1-default));
        content: '';
        display: block;
        margin-bottom: var(--h-border-margin-bottom, 16px);
        height: var(--h-border-top-height, 4px);
        width: var(--h-border-top-width, 32px);
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
