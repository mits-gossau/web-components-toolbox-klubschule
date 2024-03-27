import Video from '../../web-components-toolbox/src/es/components/atoms/video/Video.js'

/**
* @export
* @class Heading
* @type {CustomElementConstructor}
*/
export default class KsVideo extends Video {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  /**
   * renders the css
   *
   * @return {Promise<void>}
   */
  renderCSS () {
    super.renderCSS()
    this.css = /* css */ `
      :host {
        width: 100%;
      }
      :host,
      :host > *:not(style) {
        display: block;
      }
      :host iframe {
          width: 100%;
          aspect-ratio: 16/9;
      }
    `
  }

  /**
   * fetches the template
   *
   * @return {Promise<void>}
   */
  fetchTemplate () {
    return this.fetchCSS([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/reset.css`, // no variables for this reason no namespace
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: true
      }
    ])
  }
}
