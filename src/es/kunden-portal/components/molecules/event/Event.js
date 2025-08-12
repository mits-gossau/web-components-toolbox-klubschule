// @ts-check
import Tile from '../../../../components/molecules/event/Event.js'

/* global self */

/**
 * @export
 * @class EventTile
 * @type {CustomElementConstructor}
 */
export default class EventTile extends Tile {
  constructor (options = {}, ...args) {
    super({ ...options }, ...args)
  }

  connectedCallback () {
    super.connectedCallback()
  }

  disconnectedCallback () {
    super.disconnectedCallback()
  }

  renderCSS () {
    super.renderCSS()
  }

  renderHTML () {
    debugger
    const parentHTML = super.renderHTML()
    this.html = parentHTML
  }
}
