// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class WishtlistIcon
* @type {CustomElementConstructor}
*/
export default class WishtlistIcon extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, mode: 'false', ...options }, ...args)

    this.updateIconInitialLoad = event => {
      this.entriesCount = event.detail.wishlist.entriesCount
      this.renderHTML()
    }

    this.updateIconAddOrDeleteItem = event => {
      event.detail.fetch.then((data) => {
        this.entriesCount = data.watchlistEntries?.length
        this.renderHTML()
      })
    }
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
    document.body.addEventListener('wish-list-icon-indicator', this.updateIconInitialLoad)
    document.body.addEventListener('wish-list', this.updateIconAddOrDeleteItem)
  }

  disconnectedCallback () {
    document.body.removeEventListener('wish-list-icon-indicator', this.updateIconInitialLoad)
    document.body.removeEventListener('wish-list', this.updateIconAddOrDeleteItem)
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
    return !this.markUp
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        position: relative;
      }
    `
  }

  /**
   * renders the html
   */
  renderHTML () {
    this.html = ''
    this.html = /* html */ `
      <a>
        <a-icon-mdx 
          icon-name="Heart"
          size="1.5rem"
          mobile-size="1.3rem"
          color="#3d3d3d"
          rotate="0"
          ${this.entriesCount > 0 ? ` custom-notification="
            {
              'height':'.4rem',
              'width':'.4rem',
              'background':'red',
              'borderRadius':'50%',
              'outline':'solid 2px white',
              'right':'-2px',
              'top':'1px'
            }
          "` : ''}
        >
        </a-icon-mdx>
      </a>
    `
  }
}
