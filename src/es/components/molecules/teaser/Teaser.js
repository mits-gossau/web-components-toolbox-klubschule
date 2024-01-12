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
        return this.fetchNamespaceTemplate('tile-/tile-.css')
      default:
        return super.fetchTemplate()
    }
  }

  /**
   * fetches the actual teaser namespace template
   *
   * @return {Promise<void>}
   */
  fetchNamespaceTemplate (relativePath) {
    const styles = [
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/style.css`,
        namespace: false
      }
    ]

    return this.fetchCSS([{
      // @ts-ignore
      path: `${this.importMetaUrl}${relativePath}`,
      namespace: false
    }, ...styles
    ]).then(fetchCSSParams => {
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
    /* Emptied this css for now as it did not help for this teaser */
    this.css = /* css */`
        /* tbd */
    `
    return this.fetchTemplate()
  }
}
