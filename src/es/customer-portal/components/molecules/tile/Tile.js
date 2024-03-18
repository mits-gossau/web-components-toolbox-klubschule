// @ts-check
import Tile from '../../../../components/molecules/tile/Tile.js'

/**
* @export
* @class AppointmentTile
* @type {CustomElementConstructor}
*/
export default class AppointmentTile extends Tile {
  // constructor (options = {}, ...args) {
  //   super({ importMetaUrl: import.meta.url, ...options }, ...args)
  // }

  // connectedCallback () {
  //   // super.connectedCallback()
  //   // if (this.shouldRenderCSS()) this.renderCSS()
  //   // if (this.shouldRenderHTML()) this.renderHTML()
  // }

  // disconnectedCallback () {
  //   super.disconnectedCallback()
  // }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML () {
    return !this.appointmentWrapper
  }

  /**
   * renders the css
   */
  renderCSS () {
    super.renderCSS()
    this.css = /* css */`
      :host {
           background:pink;
           display:flex;
      }

      @media only screen and (max-width: _max-width_) {
        :host  {
       
        }

      }
    `
    // return this.fetchTemplate()
  }

  /**
   * fetches the template
   */
  fetchTemplate () {
    const styles = [
      {
        path: `${this.importMetaUrl}../../../components/web-components-toolbox/src/css/reset.css`, // no variables for this reason no namespace
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../../components/web-components-toolbox/src/css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: true
      }
    ]
    switch (this.getAttribute('namespace')) {
      case 'tile-default-':
        return this.fetchCSS([
          {
            path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
            namespace: false
          }, ...styles])
      default:
        return this.fetchCSS(styles)
    }
  }

  /**
   * Render HTML
   * @returns Promise<void>
  */
  renderHTML () {
    // console.log(this.getAttribute('data'))
    const content = Tile.parseAttribute(this.getAttribute('data'))
    // super.renderHTML()
    this.appointmentWrapper = this.root.querySelector('div') || document.createElement('div')
    this.html = /* HTML */`
    <div class="m-tile">
    <div class="m-tile__wrap">
        <div class="m-tile__overlay"></div>
        <div class="m-tile__head">
          <span class="m-tile__title">${content?.courseTitle}</span>
      </div>
      </div>
    </div>
    `
  }
}
