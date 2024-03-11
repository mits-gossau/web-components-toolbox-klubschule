// @ts-check
import { Shadow } from '../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * Login
 *
 * @export
 * @class Login
 * @type {CustomElementConstructor}
 */
export default class Login extends Shadow() {
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
        <h1>LOGIN</h1>
      `
  }
}
