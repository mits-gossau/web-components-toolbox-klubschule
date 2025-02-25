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
      :host([count-section-children="1"]) > section > [wide], :host > section > [wide="100%"] {
        grid-column: span 3;
      }
      :host > section > *.contact > * {
        margin-bottom: var(--mdx-sys-spacing-fix-l, 2rem);
      }
      :host > section > *.contact > ks-m-contact-row {
        margin-bottom: var(--mdx-sys-spacing-fix-m, 1.5rem);
      }
      :host > section > *.contact > *:last-child {
        margin-bottom: 0;
      }
      :host > section > *.contact > a.logo {
        display: inline-block;
        margin-top: 0;
        margin-right: 0;
        margin-left: 0;
      }
      :host > section > *.contact > a.logo > img, :host > section > *.contact > img.logo {
        max-height: 3.125em;
      }
      :host > section > *.contact > div.buttons {
        --button-primary-width: 100%;
        --button-secondary-width: 100%;
        display: grid;
        gap: var(--mdx-sys-spacing-fix-m, 1.5rem);
        width: fit-content;
      }
      @media only screen and (max-width: _max-width_) {
        :host([count-section-children="1"]) > section > [wide], :host > section > [wide], :host > section > [wide="100%"] {
          grid-column: span 1;
        }
      }
    `
    return super.renderCSS()
  }
}
