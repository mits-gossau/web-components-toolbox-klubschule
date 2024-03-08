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
    switch (this.getAttribute('namespace')) {
      case 'picture-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}/default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }], false)
      default:
        return super.fetchTemplate()
    }
  }
}
