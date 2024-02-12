import Picture from '../../web-components-toolbox/src/es/components/atoms/picture/Picture.js'

/**
* @export
* @class KsPicture
* @type {CustomElementConstructor}
*/
export default class KsPicture extends Picture {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  /**
   * renders the html
   *
   * @return {void}
   */
  renderHTML () {
    super.renderHTML()

    if (this.hasAttribute('open-modal')) {
      /* this.closeBtn is actually open modal button in this case */
      this.closeBtn.innerHTML = /* HTML */`
        <a-icon-mdx icon-name="Maximize" size="2rem" icon-size="24x24"></a-icon-mdx>
      `
    }

    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ])
  }

  /**
   * fetches the template
   *
   * @return {Promise<void>}
   */
  fetchTemplate () {
    const styles = [
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/reset.css`, // no variables for this reason no namespace
        namespace: false,
        maxWidth: this.getMobileBreakpoint({})
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: true,
        maxWidth: this.getMobileBreakpoint({})
      }
    ]
    switch (this.getAttribute('namespace')) {
      case 'picture-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}/default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles], false)
          .then(fetchCSSParams => {
            // make template ${code} accessible aka. set the variables in the literal string
            fetchCSSParams[1].styleNode.textContent = eval('`' + fetchCSSParams[1].style + '`')// eslint-disable-line no-eval
          })
      default:
        return this.fetchCSS(styles)
    }
  }
}
