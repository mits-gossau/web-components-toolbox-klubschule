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
      :host span {
        width: var(--divider-width);
        height: var(--divider-height);
        background-color: var(--divider-color);
        margin: var(--wrapper-inner-spacing) 0 var(--copy-spacing);
      }
      :host p {
        font: var(--copy-typography) !important;
        margin: var(--copy-spacing) !important 0 0;
      }
      :host iframe {
          width: 100%;
          aspect-ratio: 16/9;
      }
      @media only screen and (max-width: '_max-width_'}) {
        :host span {
          width: calc(var(--divider-width) - var(--divider-height));
        }
      }

    `
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
      case 'video-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}/default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles], false)
          .then(fetchCSSParams => {
            // make template ${code} accessible aka. set the variables in the literal string
            fetchCSSParams[1].styleNode.textContent = eval('`' + fetchCSSParams[1].style + '`')// eslint-disable-line no-eval
          })
      case 'video-stage-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}/stage-/stage-.css`, // apply namespace since it is specific and no fallback
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
