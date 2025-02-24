// @ts-check
import Grid from '../../web-components-toolbox/src/es/components/organisms/grid/Grid.js'

/**
* @export
* @class ContactModule
* @type {CustomElementConstructor}
*/
export default class ContactModule extends Grid {
  constructor (...args) {
    super(...args)

    this.setAttribute('auto-fill', 'calc(33.33% - 1em)')
    this.setAttribute('gap', '4em 1.5em')
    this.setAttribute('auto-fill-mobile', '100%')
    this.setAttribute('gap-mobile', '4em')
  }

  /**
   * renders the o-grid css
   *
   * @return {Promise<void>}
   */
  renderCSS () {
    this.css = /* css */`
      :host > section > [wide] {
        grid-column: span 2;
      }
      :host([count-section-children="1"]) > section > *, :host > section > [wide="100%"] {
        grid-column: span 3;
      }
      @media only screen and (max-width: _max-width_) {
        :host([count-section-children="1"]) > section > *, :host > section > [wide], :host > section > [wide="100%"] {
          grid-column: span 1;
        }
      }
    `
    return super.renderCSS()
  }
}
