// @ts-check
import { Shadow } from '../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * Subscriptions
 *
 * @export
 * @class Subscriptions
 * @type {CustomElementConstructor}
 */
export default class Subscriptions extends Shadow() {
  /**
   * @param {any} args
   */
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
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
        <h1>Meine Abonnemente</h1>
      `
  }
}
