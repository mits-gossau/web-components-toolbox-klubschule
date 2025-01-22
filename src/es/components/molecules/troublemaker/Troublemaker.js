// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Troublemaker
* @type {CustomElementConstructor}
*/
export default class Troublemaker extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    // GTM Tracking of Click by making sure the push into the dataLayer took place before following the link
    this.clickEventListener = event => {
      const target = event.composedPath().find(node => node.tagName === 'A')
      if (target) {
        const href = target.getAttribute('href')
        if (href) {
          event.preventDefault()
          const action = () => window.open(href, target.getAttribute('target'))
          const timeout = setTimeout(action, 1000)
          this.dataLayerPush({
            'event': 'interrupter_click',
            'interrupter_name': this.getAttribute('gtm-name'), // name of the troublemaker content
            'eventCallback': () => {
              clearTimeout(timeout)
              action()
            }
          })
        }
      }
    }
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
    this.addEventListener('click', this.clickEventListener)
  }

  disconnectedCallback () {
    this.removeEventListener('click', this.clickEventListener)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML () {
    return !this.container
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host > * {
        padding: 1.5em;
      }
      @media only screen and (max-width: _max-width_) {
        :host > * {
          padding: 1em 0.5em;
        }
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
      case 'troublemaker-default-':
        return this.fetchCSS([
          {
            path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
            namespace: false
          }, ...styles]).then(fetchCSSParams => {
            // make template ${code} accessible aka. set the variables in the literal string
            fetchCSSParams[0].styleNode.textContent = eval('`' + fetchCSSParams[0].style + '`')// eslint-disable-line no-eval
          })
      default:
        return this.fetchCSS(styles)
    }
  }

  /**
   * Render HTML
   * @returns Promise<void>
   */
  renderHTML () {
    this.html = /* HTML */`
      <a href="someplace">
        <div>
          <h3>Headline Lorem Ipsum dolor?</h3>
          <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>
        </div>
        <div>
          <ks-a-button namespace="button-primary-" color="secondary" hover-selector="ks-m-troublemaker">
            Passende Abos anzeigen<a-icon-mdx namespace="icon-mdx-ks-" icon-name="ArrowRight" size="1em" class="icon-right">
          </ks-a-button>
        </div>
      </a>
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

  dataLayerPush (value) {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.dataLayer) {
      try {
        // @ts-ignore
        window.dataLayer.push(value)
      } catch (err) {
        console.error('Failed to push event data:', err)
      }
    }
  }

  get container () {
    return this.root.querySelector(`${this.cssSelector} > *:not(style)`)
  }
}
