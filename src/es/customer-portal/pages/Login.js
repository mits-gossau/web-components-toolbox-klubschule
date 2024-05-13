// @ts-check
import Index from './Index.js'

/**
 * Login
 *
 * @export
 * @class Login
 * @type {CustomElementConstructor}
 */
export default class Login extends Index {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    this.renderHTML()
  }

  renderHTML () {
    this.html = /* html */ `
      <h1>LOGIN</h1>
    `
  }
}
