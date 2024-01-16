// @ts-check
import Teaser from '../../web-components-toolbox/src/es/components/molecules/teaser/Teaser.js'

/* global CustomEvent */

/**
 * Creates a Teaser
 * https://www.figma.com/file/PZlfqoBJ4RnR4rjpj38xai/Design-System-Core-%7C%C2%A0Klubschule-Master?type=design&node-id=67%3A4028&mode=design&t=HCySQ2cRwdTU4B43-1
 *
 * @export
 * @attribute {namespace} namespace
 * @attribute {color} color
 * @type {CustomElementConstructor}
 */
export default class KsTeaser extends Teaser {
  constructor (options = {}, ...args) {
    super({
      importMetaUrl: import.meta.url,
      ...options
    }, ...args)
  }

  /**
   * fetches the template
   *
   * @return {Promise<void>}
   */
  fetchTemplate () {
    switch (this.getAttribute('namespace')) {
      case 'teaser-tile-':
        return this.fetchNamespaceTemplate(['tile-/tile-.css'])
      case 'teaser-story-':
        return this.fetchNamespaceTemplate(['story-/story-.css'])
      default:
        return super.fetchTemplate()
    }
  }

  /**
   * fetches the actual teaser namespace template
   *
   * @return {Promise<void>}
   */
  fetchNamespaceTemplate (relativePaths) {
    const baseStyles = [
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/style.css`,
        namespace: false
      }
    ]

    const allStyles = relativePaths.map((relativePath) => ({
      // @ts-ignore
      path: `${this.importMetaUrl}${relativePath}`,
      namespace: false
    })).concat(baseStyles)

    return this.fetchCSS(allStyles).then(fetchCSSParams => {
      // make template ${code} accessible aka. set the variables in the literal string
      fetchCSSParams[0].styleNode.textContent = eval('`' + fetchCSSParams[0].style + '`')// eslint-disable-line no-eval
    })
  }

  /**
   * renders the m-Teaser css
   *
   * @return {Promise<void>}
   */
  renderCSS () {
    this.setCss(/* css */`
        :host * {
          box-sizing: border-box;
          margin: 0 !important;
        }

        :host a-picture {
          display: block;
          overflow: hidden;
        }

        :host figure {
          display: flex;
          flex-direction: column;
          color: var(--color);
        }

        :host figcaption {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex-shrink: 0;
          width: 100%;
        }

        :host figcaption > * {
          width: 100%;
        }

        :host figcaption > strong:first-child {
          display: block;
          font-family: var(--font-family-bold);
          color: var(--color-${this.getAttribute('color')}, black);
          font-family: var(--mdx-sys-font-fix-title4-font-family);
          font-size: var(--mdx-sys-font-fix-title4-font-size);
          font-weight: var(--mdx-sys-font-fix-title4-font-weight);
          line-height: var(--mdx-sys-font-fix-title4-line-height);
          transition: var(--transition);
        }

        :host h5,
        :host h4,
        :host h3,
        :host h2,
        :host h1 {
          color: inherit !important;
          transition: var(--transition);
          font-family: var(--mdx-sys-font-flex-large-headline3-font-family) !important;
          font-size: var(--mdx-sys-font-flex-large-headline3-font-size) !important;
          font-weight: var(--mdx-sys-font-flex-large-headline3-font-weight) !important;
          line-height: var(--mdx-sys-font-flex-large-headline3-line-height) !important;
        }

        :host p {
          font-size: 1.125rem;
          font-weight: 400;
          line-height: 130%;
          min-height: 5rem;
          transition: var(--transition);
        }

        :host span {
          display: flex;
          gap: 0.25rem;
          font-family: var(--font-family-secondary);
          font-size: 1rem;
          line-height: 110%;
          font-weight: 500;
          transition: var(--transition);
        }
    `, this.cssSelector, '') // unsetting namespace

    return this.fetchTemplate()
  }
}
