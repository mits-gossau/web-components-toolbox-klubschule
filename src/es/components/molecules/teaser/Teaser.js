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
  /**
   * fetches the template
   *
   * @return {Promise<void>}
   */
  fetchTemplate () {
    /* TODO add reset styles */
    // const styles = [
    //     {
    //         path: `${this.importMetaUrl}../../../../css/reset.css`, // no variables for this reason no namespace
    //         namespace: false
    //     },
    // ]

    switch (this.getAttribute('namespace')) {
      case 'teaser-tile-':
        return this.fetchCSS([{
          // @ts-ignore
          path: `${this.importMetaUrl}../../../../../../molecules/teaser/tile-/tile-.css`,
          namespace: false
          // ...styles
        }
        ]).then(fetchCSSParams => {
          // make template ${code} accessible aka. set the variables in the literal string
          fetchCSSParams[0].styleNode.textContent = eval('`' + fetchCSSParams[0].style + '`')// eslint-disable-line no-eval
        })
      default:
        return super.fetchTemplate()
    }
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
