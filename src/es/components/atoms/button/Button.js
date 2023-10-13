// @ts-check
import Button from '../../web-components-toolbox/src/es/components/atoms/button/Button.js'

/* global CustomEvent */

/**
 * Creates an Button
 * https://www.figma.com/file/HrjrCOkZtYdODEUO6qrGij/%F0%9F%8E%A8-MGB-Klubschule%2FMiduca-Design?node-id=238%3A4391&mode=dev
 *
 * @export
 * @attribute {namespace} namespace
 * @type {CustomElementConstructor}
 */
export default class KsButton extends Button {
  /**
   * fetches the template
   *
   * @return {Promise<void>}
   */
  fetchTemplate () {
    if (!this.hasAttribute('color') && !this.hasAttribute('justify-content')) return super.fetchTemplate()
    const replaces = this.buttonTagName === 'a'
      ? [{
          pattern: '([^-]{1})button',
          flags: 'g',
          replacement: '$1a'
        }]
      : []
    switch (this.getAttribute('namespace')) {
      case 'button-primary-':
        return this.fetchCSS([{
          // @ts-ignore
          path: `${this.importMetaUrl}./primary-/primary-.css`,
          namespace: false,
          replaces
        },
        {
          // @ts-ignore
          path: `${this.importMetaUrl}../../../../../../atoms/button/variant/variant.css`,
          namespace: false,
          replaces
        }]).then(fetchCSSParams => {
          // make template ${code} accessible aka. set the variables in the literal string
          fetchCSSParams[1].styleNode.textContent = eval('`' + fetchCSSParams[1].style + '`')// eslint-disable-line no-eval
        })
      case 'button-secondary-':
          return this.fetchCSS([{
            // @ts-ignore
            path: `${this.importMetaUrl}./secondary-/secondary-.css`,
            namespace: false,
            replaces
          },
          {
            // @ts-ignore
            path: `${this.importMetaUrl}../../../../../../atoms/button/variant/variant.css`,
            namespace: false,
            replaces
          }]).then(fetchCSSParams => {
            // make template ${code} accessible aka. set the variables in the literal string
            fetchCSSParams[1].styleNode.textContent = eval('`' + fetchCSSParams[1].style + '`')// eslint-disable-line no-eval
          })
      default:
        return super.fetchTemplate()
    }
  }
}
