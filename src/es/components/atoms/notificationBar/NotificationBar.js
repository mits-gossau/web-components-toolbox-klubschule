// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class NotificationBar
* @type {CustomElementConstructor}
*/
export default class NotificationBar extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    if (this.storage.getItem(this.storageKey)) this.remove()

    this.clickEventListener = event => {
      this.storage.setItem(this.storageKey, 'seen')
      this.remove()
    }
  }

  connectedCallback () {
    this.hidden = true
    const showPromises = []
    if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
    if (this.shouldRenderHTML()) showPromises.push(this.renderHTML())
    Promise.all(showPromises).then(() => (this.hidden = false))
    this.aIconMdx.addEventListener('click', this.clickEventListener)
  }

  disconnectedCallback () {
    this.aIconMdx.removeEventListener('click', this.clickEventListener)
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
    return !this.section
  }

  /**
   * renders the css
   * @returns Promise<void>
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        --a-font-weight: 501;
        --p-font-size: 1rem;
        --p-font-weight: 501;
      }
      :host > section {
        --a-color: var(--color);
        --a-color-hover: var(--color);
        --a-text-decoration: underline;
        --a-text-decoration-hover: var(--a-text-decoration);
        color: var(--color);
        display: flex;
        gap: 0.5em;
        justify-content: space-between;
        padding: 1rem 1.5rem;
      }
      :host(:not([error])) > section {
        background-color: var(--color-secondary);
        --color: var(--background-color);
        --color-hover: var(--color);
      }
      :host([error]) > section {
        background-color: var(--mdx-sys-color-error-subtle3, var(--color-error));
      }
      :host > section a {
        white-space: nowrap;
      }
      :host > section > * {
        flex: 1;
      }
      :host > section > div {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }
      :host > section > a-icon-mdx {
        flex: 2;
      }
      :host > section *:last-child {
        padding-bottom: 0;
        margin-bottom: 0;
      }
      @media only screen and (max-width: _max-width_) {
        :host > section {
          padding: 0.5rem;
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
      default:
        return this.fetchCSS(styles)
    }
  }

  /**
   * Render HTML
   * @returns Promise<void>
   */
  renderHTML () {
    const children = Array.from(this.root.children).filter(node => node.tagName !== 'STYLE')
    this.html = /* html */`
      <section>
        <div></div>
        <a-icon-mdx icon-name="X" size="1.5rem"></a-icon-mdx>
      </section>
    `
    children.forEach(node => this.div.appendChild(node))
    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ])
  }

  get section () {
    return this.root.querySelector('section')
  }

  get div () {
    return this.section?.querySelector('div')
  }

  get aIconMdx () {
    return this.section?.querySelector('a-icon-mdx')
  }

  /**
   * Description
   * 
   * @returns {Storage}
   */
  get storage () {
    // @ts-ignore
    return self[this.getAttribute('storage-type') || 'sessionStorage']
  }

  get storageKey () {
    return this.getAttribute('id') ? `${this.tagName}_${this.getAttribute('id')}` : this.tagName
  }
}
