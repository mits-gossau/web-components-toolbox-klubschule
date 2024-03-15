// @ts-check
import { Shadow } from '../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

/* global Environment */

/**
* Customer Portal
*
* @export
* @class Index
* @type {CustomElementConstructor}
*/
export default class Index extends Shadow() {
  /**
    * @param {any} args
  */
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    this.hidden = true
    const showPromises = []
    // if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
    // if (this.shouldRenderHTML()) showPromises.push(this.renderHTML())
    Promise.all(showPromises).then(() => {
      this.hidden = false
    })
  }

  disconnectedCallback () {
    super.disconnectedCallback()
  }

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
    // @ts-ignore
    return !this.section
  }

  /**
    * renders the css
    *
    * @return {void}
    */
  renderCSS () {
    this.css = /* css */ `
      :host {}
      @media only screen and (max-width: _max-width_) {
        :host {}
     }
    `
  }

  /**
    * renders the html
    *
    * @return {Promise<void>}
    */
  renderHTML () {
    this.html = /* html */`
        <section>
            <cp-m-navigation></cp-m-navigation>
            <main></main>
      </section>
    `
    return this.fetchModules([])
  }

  get section () {
    return this.root.querySelector('section')
  }
}
