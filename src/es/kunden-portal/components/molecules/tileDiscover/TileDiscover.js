// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class TileDiscover
* @type {CustomElementConstructor}
*/
export default class TileDiscover extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  shouldRenderHTML () {
    return !this.root.querySelector('div.tile-discover')
  }

  renderCSS () {
    this.css = /* css */`
      :host {
        display: block;
      }
      .tile-discover-link {
        display: block;
        text-decoration: none;
        color: inherit;
      }
      .tile-discover-link:focus,
      .tile-discover-link:hover {
        outline: 1px solid #0053A6;
        outline-offset: 1px;
      }
      .tile-discover {
        cursor: pointer;
        display: grid;
        grid-template-columns: fit-content(100%) 1fr;
        gap: 24px;
        background-color: white;
        border: 1px solid #737373;
        padding: 24px;
      }
      .tile-discover > div:last-child p {
        margin: 0;
        padding: 0;
      }
      .tile-discover__image {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .tile-discover__label {
        color: var(--mdx-sys-color-neutral-bold4, #333);
        font: var(--mdx-sys-font-fix-body1, inherit);
      }
      .tile-discover__link {
        color: #0053A6;
        text-decoration: none;
      }
      .tile-discover__link a-icon-mdx {
        color: #0053A6;
        display: inline-block;
        position: relative;
        top: 2px;
      }
    `
  }

  renderHTML () {
    this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ])

    this.html = /* html */`
      <a class="tile-discover-link" href="${this.getAttribute('link-href') || '#'}">
        <div class="tile-discover">
          <div class="tile-discover__image">
            <img src="${this.getAttribute('image-src') || ''}" height="40" width="40" alt="" />
          </div>
          <div>
            <p class="tile-discover__label">
              ${this.getAttribute('tile-label') || ''}
            </p>
            <p class="tile-discover__link">
              ${this.getAttribute('link-text') || ''}
              <a-icon-mdx icon-name="ExternalLink" size="1em"></a-icon-mdx>
            </p>
          </div>
        </div>
      </a>
    `
  }
}
