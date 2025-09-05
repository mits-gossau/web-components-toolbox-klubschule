// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Header
* @type {CustomElementConstructor}
*/
export default class Header extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    this.hidden = true
    const showPromises = []
    if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
    if (this.shouldRenderHTML()) showPromises.push(this.renderHTML())
    Promise.all(showPromises).then(() => (this.hidden = false))
  }

  disconnectedCallback () {}

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML () {
    return !this.div
  }

  /**
   * renders the css
   * @returns Promise<void>
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        display: block;
      }
      @media only screen and (max-width: _max-width_) {
        :host {}
      }
    `
    return this.fetchTemplate()
  }

  /**
   * fetches the template
   */
  fetchTemplate () {
    const styles = [
      {
        path: `${this.importMetaUrl}../../../../../es/components/web-components-toolbox/src/css/reset.css`,
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../../../../es/components/web-components-toolbox/src/css/style.css`,
        namespaceFallback: true
      }
    ]
    switch (this.getAttribute('namespace')) {
      case 'header-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles], false) // using showPromises @connectedCallback makes hide action inside Shadow.fetchCSS obsolete, so second argument hide = false
      default:
        return this.fetchCSS(styles)
    }
  }

  /**
   * Render HTML
   * @returns Promise<void>
   */
  renderHTML () {
    this.html = /* html */ `
      <ks-o-body-section variant="default" no-margin-y="" background-color="#0053A6">
        <o-grid namespace="grid-12er-">
          <style>
            :host {
              --h1-color: white;
              --h1-margin: 0 0 0.7em 0;
            }
            :host p {
              color: white;
            }
            :host > section > div {
              padding-top: 2.5em;
            }
          </style>
          <div col-lg="12" col-md="12" col-sm="12">
            <h1>${this.getGreeting()} Uservorname Usernachname</h1>
            <p>Hier können Sie Ihre Kurse verwalten und erhalten alle relevanten Informationen.</p>
          </div>
        </o-grid>
      </ks-o-body-section>
    `
  }

  getGreeting (date = new Date()) {
    const hour = date.getHours()
    if (hour >= 5 && hour < 11) {
      return 'Guten Morgen'
    } else if (hour >= 11 && hour < 17) {
      return 'Guten Tag'
    } else if (hour >= 17 && hour < 22) {
      return 'Guten Abend'
    } else {
      return 'Gute Nacht'
    }
  }

  get div () {
    return this.root.querySelector('ks-o-body-section')
  }
}
