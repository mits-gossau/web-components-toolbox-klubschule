import Picture from '../../web-components-toolbox/src/es/components/atoms/picture/Picture.js'

/**
* @export
* @class KsPicture
* @type {CustomElementConstructor}
*/
export default class KsPicture extends Picture {
  static get responsiveSourceWidths () {
    return '320,480,767,1024,1440,1600,1920'
  }

  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  /**
   * renders the html
   *
   * @return {void}
   */
  renderHTML () {
    // Supplying sizes explicitly opts this implementation into the core
    // component's width-descriptor srcset generation. Pictures without sizes
    // retain the legacy source generation for backwards compatibility.
    if (this.hasAttribute('sizes') && !this.hasAttribute('sources-widths')) {
      this.setAttribute('sources-widths', KsPicture.responsiveSourceWidths)
    }

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
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }], false)
      default:
        return super.fetchTemplate()
    }
  }
}
