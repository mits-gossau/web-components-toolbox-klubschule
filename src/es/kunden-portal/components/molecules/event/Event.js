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

  //   connectedCallback () {
  //     super.connectedCallback()
  //   }

  //   disconnectedCallback () {
  //     super.disconnectedCallback()
  //   }

  renderCSS () {
    super.renderCSS()
  }

  renderHTML () {
    super.renderHTML().then((data) => {
    })
    // this.html = 'event'
    // super.renderHTML().then(([data, parentHTML]) => {
    //   debugger
    //   this.html = parentHTML
    // })
  }
}
