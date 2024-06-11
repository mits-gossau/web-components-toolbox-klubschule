// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Buttons
* @type {CustomElementConstructor}
*/
export default class Buttons extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
  }

  disconnectedCallback () {}

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return this.hasAttribute('id') ? !this.root.querySelector(`:host > style[_css], #${this.getAttribute('id')} > style[_css]`) : !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`) 
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML () {
    return !this.root.querySelector('.buttons-container')
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host .buttons-container {
        display: flex;
        gap: 1rem;
      }
    `
    return this.fetchTemplate()
  }

  /**
   * fetches the template
   */
  fetchTemplate () {
    /** @type {import("../../web-components-toolbox/src/es/components/prototypes/Shadow.js").fetchCSSParams[]} */
    const styles = [
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/reset.css`, // no variables for this reason no namespace
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: true
      }
    ]
    switch (this.getAttribute('namespace')) {
      case 'buttons-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles])
      default:
        return this.fetchCSS(styles)
    }
  }

  /**
   * Render HTML
   * @returns void
   */
  renderHTML () {
    const dataButtons = JSON.parse(this.getAttribute('data-buttons')) || [{}]
    const optionalBigAttr = this.hasAttribute('big') ? 'big' : ''
    const optionalSmallAttr = this.hasAttribute('small') ? 'small' : ''

    const buttons = dataButtons?.reduce((acc, button) => acc + (
      button.event === 'bookmark' ? '' : /* html */`
        <ks-a-button 
          ${button.iconName && !button.text ? 'icon' : ''} 
          namespace="${button.typ ? 'button-' + button.typ + '-' : 'button-secondary-'}" 
          color="secondary" 
          ${button.link ? `href=${button.link}` : ''}
          ${optionalBigAttr} 
          ${optionalSmallAttr}
        >
          ${button.text ? '<span>' + button.text + '</span>' : ''}
          ${button.iconName && !button.text ? `<a-icon-mdx icon-name="${button.iconName}" size="1em"></a-icon-mdx>` : ''} 
          ${button.iconName && button.text ? `<a-icon-mdx namespace="icon-mdx-ks-" icon-name="${button.iconName}" size="1em" class="icon-right"></a-icon-mdx>` : ''}
        </ks-a-button>
      `
    ), '')

    this.html = /* html */`
      <div class="buttons-container">
        ${buttons}
      </div>
    `

    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../atoms/button/Button.js`,
        name: 'ks-a-button'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ])
  }
}
