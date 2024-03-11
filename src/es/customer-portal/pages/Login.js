// @ts-check
import { Shadow } from '../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class Login extends Shadow() {
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
      *
      * @return {Promise<void>}
      */
  renderHTML () {
    this.html = /* html */`
        <h1>LOGIN</h1>
      `
  }
}
