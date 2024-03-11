// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Stage
* @type {CustomElementConstructor}
*/
export default class Stage extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    const heading = this.root.querySelector('ks-a-heading')
    if (this.getAttribute('namespace') === 'stage-title-' && heading) {
      /* Note: Setting the "centered" attribute on <ks-a-heading> here but keep in mind that
      in this case the <ks-a-heading> component does NOT copy the attribute to the actual html elements (h1, h2...),
      so this might not work for other attributes ... */
      heading.setAttribute('centered', '')
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
    return !this.div
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */''
    return this.fetchTemplate()
  }

  /**
   * fetches the template
   */
  fetchTemplate () {
    /** @type {import("../../web-components-toolbox/src/es/components/prototypes/Shadow.js").fetchCSSParams[]} */
    const styles = []
    switch (this.getAttribute('namespace')) {
      case 'stage-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles])
      case 'stage-title-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./title-/title-.css`, // apply namespace since it is specific and no fallback
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
    /* */
  }
}
