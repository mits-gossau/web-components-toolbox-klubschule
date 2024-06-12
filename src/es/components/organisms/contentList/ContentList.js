// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Content List
* @type {CustomElementConstructor}
*/
export default class ContentList extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    this.hidden = true
    const showPromises = []
    if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
    if (this.shouldRenderHTML()) showPromises.push(this.renderHTML())
    Promise.all(showPromises).then(() => (this.hidden = false))
  }

  disconnectedCallback () {}

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
    return !this.contentList
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host .o-content-list {
        display: flex;
        flex-direction: column;
      }

      :host ks-m-content-search-item + ks-m-content-search-item {
        margin-top: 1.5rem;
      }

      :host .o-content-list__items + .o-content-list__foot {
        margin-top: 3rem;
      }
    `
    return Promise.resolve()
  }

  /**
   * Render HTML
   * @returns Promise<void>
   */
  renderHTML () {
    const warnMandatory = 'data attribute requires: '
    const data = ContentList.parseAttribute(this.getAttribute('data'))
    if (!data) return console.error('Data json attribute is missing or corrupted!', this)
    // don't wait for fetchModules to resolve if using "shouldRenderHTML" checks for this.badge it has to be sync
    this.html = /* HTML */`
    <div class="o-content-list">
        <div class="o-content-list__items">
          ${data.items.reduce((acc, item) => acc + /* html */`
          <ks-m-content-search-item>
            <a href="${item.link}">
              <div>
                <h3>${item.text}</h3>
                <p>${item.title}</p>
              </div>
              ${item.image
                ? /* html */`
                <a-picture picture-load defaultSource="${item.image.src}" alt="${item.image.alt}"></a-picture>
                `
                : ''
              }
            </a>
          </ks-m-content-search-item>      
          `, '')}
        </div>
        ${data.buttonMore
          ? /* html */`
            <div class="o-content-list__foot">
              <ks-a-button namespace="button-secondary-" color="secondary">
                <span>${data.buttonMore.text || warnMandatory + 'buttonMore.text'}</span>
                <a-icon-mdx namespace="icon-mdx-ks-" icon-name="${data.buttonMore.iconName || 'ArrowRight'}" size="1em" class="icon-right">
              </ks-a-button>
            </div> 
          `
          : ''
        }      
    </div>
    `
    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../atoms/button/Button.js`,
        name: 'ks-a-button'
      },
      {
        path: `${this.importMetaUrl}../contentSearchItem/ContentSearchItem.js`,
        name: 'ks-m-content-search-item'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ])
  }

  get contentList () {
    return this.root.querySelector('.o-content-list')
  }
}
