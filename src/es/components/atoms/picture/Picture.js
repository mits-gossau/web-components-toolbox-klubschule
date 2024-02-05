import Picture from '../../web-components-toolbox/src/es/components/atoms/picture/Picture.js'

/**
* @export
* @class KsPicture
* @type {CustomElementConstructor}
*/
export default class KsPicture extends Picture {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  /**
   * renders the html
   *
   * @return {void}
   */
  renderHTML () {
    super.renderHTML();
    
    if (this.getAttribute('caption')) {
        this.html = /* HTML */`
          ${
            this.hasAttribute('show-caption-line') 
              ? /* HTML */`<span class="picture__line"></span>` 
              : ''
          }
          <p class="picture__caption">
            ${this.getAttribute('caption')}
          </p>
        `;
    }

  }

  /**
   * renders the css
   *
   * @return {Promise<void>}
   */
  renderCSS() {
    super.renderCSS();
    this.css = /* css */ `
      :host {
        width: 100%;
      }
      :host,
      :host > *:not(style) {
        display: block;
      }

      :host picture {
        margin-bottom: var(--wrapper-inner-spacing);
      }

      :host .picture__line {
        width: var(--divider-width);
        height: var(--divider-height);
        background-color: var(--divider-color);
        margin: var(--wrapper-inner-spacing) 0 var(--copy-spacing);
      }
      :host .picture__caption {
        font: var(--copy-typography) !important;
        margin: var(--copy-spacing) 0 0 !important;
      }
      :host([open]) .picture__caption {
        color: white;
      }
      :host iframe {
          width: 100%;
          aspect-ratio: 16/9;
      }
      @media only screen and (max-width: '_max-width_'}) {
        :host .picture__line {
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
  fetchTemplate() {
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
      },
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
