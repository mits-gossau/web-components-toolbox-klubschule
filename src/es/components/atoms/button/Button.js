// @ts-check
import Button from '../../web-components-toolbox/src/es/components/atoms/button/Button.js'

/**
 * Creates an Button
 * https://www.figma.com/file/PZlfqoBJ4RnR4rjpj38xai/Design-System-Core-%7C%C2%A0Klubschule-Master?type=design&node-id=6-4853&mode=design&t=nLXc9nA9gjQUslCi-0
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
    if (!this.hasAttribute('color') && !this.hasAttribute('justify-content') && !this.hasAttribute('small') && !this.hasAttribute('big')) return super.fetchTemplate()
    const replaces = this.buttonTagName === 'a'
      ? [{
          pattern: '([^-=]{1})button',
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
      case 'button-tertiary-':
        return this.fetchCSS([{
          // @ts-ignore
          path: `${this.importMetaUrl}./tertiary-/tertiary-.css`,
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
      case 'button-quaternary-':
        return this.fetchCSS([{
          // @ts-ignore
          path: `${this.importMetaUrl}./quaternary-/quaternary-.css`,
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
