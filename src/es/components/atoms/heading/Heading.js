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
    return !this.root.querySelector(`:host > ${this.tag}, ${this.tagName} > ${this.tag}`)
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        ${this.getAttribute('color') ? `--h-color: ${this.getAttribute('color')};` : ''};
        ${this.getAttribute('content-stage') ? 'font: var(--mdx-sys-font-flex-large-display3);' : ''};
        --h-margin: var(--h-margin-custom, var(--mdx-sys-spacing-flex-s) 0);
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
        color: var(--h-color);
        font-family: var(--display1-font-family);
        font-weight: var(--display1-font-weight);
        line-height: var(--display1-line-height);
        padding: var(--display1-padding);
      }
      :host([display-2]) [display-2] {
        font-size: var(--display2-font-size);
        color: var(--h-color);
        font-family: var(--display2-font-family);
        font-weight: var(--display2-font-weight);
        line-height: var(--display2-line-height);
        padding: var(--display2-padding);
      }
      :host([display-3]) [display-3] {
        font-size: var(--display3-font-size);
        color: var(--h-color);
        font-family: var(--display3-font-family);
        font-weight: var(--display3-font-weight);
        line-height: var(--display3-line-height);
        padding: var(--display3-padding);
      }

      /* content stage */
      :host([content-stage]) [content-stage] {
        font: var(--mdx-sys-font-flex-large-display3);
        margin-top: 1rem;
      }

      /* border top */
      :host([border-top]) [border-top]::before {
        background-color: var(--h-border-top-color, var(--mdx-sys-color-accent-1-default));
        content: '';
        display: block;
        margin-bottom: var(--h-border-margin-bottom, var(--mdx-sys-spacing-fix-s));
        height: var(--h-border-top-height, var(--mdx-sys-sizing-fix-2xs));
        width: var(--h-border-top-width, var(--mdx-sys-sizing-fix-3xl));
      }

      :host([display-1][border-top]) [border-top]::before,
      :host([display-2][border-top]) [border-top]::before,
      :host([display-3][border-top]) [border-top]::before {
        content: '';
        display: block;
        height: .5rem;
        width: 4rem;
        margin: 0 auto var(--mdx-sys-spacing-flex-xs);
        background: var(--mdx-sys-color-accent-1-default);
      }

      :host([brand=ksos][border-top]) [border-top]::before {
        background: #495449 !important; /* replace with design system token once available */
      }
      
      :host([centered][border-top][brand=ibaw]) [border-top]::after,
      :host([border-top][brand=ibaw]) [border-top]::before {
        content: unset;
      }

      :host([border-top][brand=ibaw]) [border-top]::after {
        content: '';
        display: inline-block;
        width: 0.622em;
        height: 0.703em;
        margin-left: 0.25em;
        background-size: contain;
        background-image: var(--ibaw-title-brand-shape);
        background-repeat: no-repeat;
      }

      :host([centered][border-top][brand=ibaw]) [border-top]::before {
        content: '';
        display: block;
        width: 0.622em;
        height: 0.703em;
        margin-left: auto;
        background-size: contain;
        background-image: var(--ibaw-title-brand-shape);
        background-color: transparent; 
        background-repeat: no-repeat;
      }

      :host(:first-child) > * {
        margin-top: inherit;
      }

      :host([border-top][centered]) > [border-top][centered] {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      @media only screen and (max-width: _max-width_) {
        :host([border-top]) [border-top]::before {
          width: var(--h-border-top-width, var(--mdx-sys-sizing-fix-2xl));
        }

        :host([display-1][border-top]) [border-top]::before,
        :host([display-2][border-top]) [border-top]::before,
        :host([display-3][border-top]) [border-top]::before {
          content: '';
          display: block;
          height: .25rem;
          width: 2rem;
        }

        /* content stage */
        :host([content-stage]) [content-stage] {
          font: var(--mdx-sys-font-flex-small-display3);
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
    Array.from(this.childNodes).forEach(node => {
      if (node.nodeName === '#text') {
        this.heading.appendChild(node)
      }
    })
    Array.from(this.root.children).forEach(node => {
      if (node === this.heading || node.getAttribute('slot') || node.nodeName === 'STYLE') return false
      this.heading.appendChild(node)
    })
    this.html = this.heading
  }
}
