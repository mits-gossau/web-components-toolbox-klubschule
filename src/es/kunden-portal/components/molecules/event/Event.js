// @ts-check
import Tile from '../../../../components/molecules/event/Event.js'

/**
 * @export
 * @class EventTile
 * @type {CustomElementConstructor}
 */
export default class EventTile extends Tile {
  constructor (options = {}, ...args) {
    super({ ...options }, ...args)
  }

  renderCSS () {
    super.renderCSS()
    this.css += /* css */`
      :host .top {
        min-height: 64px;
      }
      :host .top .logo {
        height: 40px;
        display: grid;
        align-content: center;
        justify-items: end;
      }
    `
  }

  renderHTML () {
    super.renderHTML().then((data) => {})
  }

  getLogoHTML(logo_url) {
    return `<img src="${logo_url}" height="auto" width="40" />`
  }
}
