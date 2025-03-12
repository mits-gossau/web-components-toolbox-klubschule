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

    let timeout = null
    this.resizeListener = event => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.checkMedia()
      }, 200)
    }

    let currentMedia = null
    this.checkMedia = () => {
      if (this.isMobile !== currentMedia) {
        currentMedia = this.isMobile
        this.buttons.forEach(button => {
          if (this.isMobile) {
            button.setAttribute('small', '')
          } else {
            button.removeAttribute('small')
          }
        })
      }
    }
  }

  connectedCallback () {
    super.connectedCallback()
    this.checkMedia()
    self.addEventListener('resize', this.resizeListener)
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    self.removeEventListener('resize', this.resizeListener)
  }

  /**
   * renders the o-grid css
   *
   * @return {Promise<void>}
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        --margin: var(--mdx-sys-spacing-fix-l, 2rem);
      }
      :host > section > [wide] {
        grid-column: span 2;
      }
      :host([count-section-children="1"]) > section > [wide], :host > section > [wide="100%"] {
        grid-column: span 3;
      }
      :host > section > * > * {
        margin-bottom: var(--margin);
      }
      :host > section > * > a {
        --a-margin: var(--margin);
      }
      :host > section > * > h3 {
        --h-margin-bottom: var(--margin);
      }
      :host > section > * > ks-m-contact-row:not(:has(+ .buttons)) {
        margin-bottom: var(--mdx-sys-spacing-fix-m, 1.5rem);
      }
      :host > section > * > *:last-child {
        margin-bottom: 0;
      }
      :host > section > * > a.logo {
        display: inline-block;
        margin-top: 0;
        margin-right: 0;
        margin-left: 0;
      }
      :host > section > * > a.logo > img, :host > section > * > img.logo {
        max-height: 3.125em;
      }
      :host > section > * > div.buttons {
        --button-primary-width: 100%;
        --button-secondary-width: 100%;
        --button-tertiary-width: 100%;
        --button-quaternary-width: 100%;
        display: grid;
        gap: var(--mdx-sys-spacing-fix-m, 1.5rem);
        width: fit-content;
      }
      @media only screen and (max-width: _max-width_) {
        :host {
          --margin: var(--mdx-sys-spacing-fix-m, 1.5rem);
        }
        :host([count-section-children="1"]) > section > [wide], :host > section > [wide], :host > section > [wide="100%"] {
          grid-column: span 1;
        }
        :host > section > * > div.buttons {
          gap: var(--mdx-sys-spacing-fix-s, 1rem);
        }
      }
    `
    return super.renderCSS()
  }

  get isMobile () {
    return self.matchMedia(`(max-width: ${this.mobileBreakpoint})`).matches
  }

  get buttons () {
    return Array.from(this.root.querySelectorAll('.buttons > *'))
  }
}
