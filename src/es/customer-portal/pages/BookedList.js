// @ts-check
import { Shadow } from '../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * Booked List
 *
 * @export
 * @class BookedList
 * @type {CustomElementConstructor}
 */
export default class BookedList extends Shadow() {
  /**
   * @param {any} args
   */
  constructor (options = {}, ...args) {
    super({
      importMetaUrl: import.meta.url,
      ...options
    }, ...args)
  }

  connectedCallback () {
    this.renderHTML()
  }

  /**
   * renders the html
   * @return {Promise<void>}
   */
  renderHTML () {
    this.html = /* html */`
        <h1>Gebuchte Termine</h1>
      `
  }
}
