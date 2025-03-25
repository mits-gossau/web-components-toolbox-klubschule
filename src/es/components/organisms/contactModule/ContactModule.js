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

    switch (this.getAttribute('grid-template-columns')) {
      case '1':
        this.setAttribute('auto-fill', '100%')
        this.setAttribute('gap', '4em')
        break
      case '2':
        this.setAttribute('auto-fill', 'calc(50% - 0.75em)')
        this.setAttribute('gap', '4em 1.5em')
        break
      case '3':
        this.setAttribute('auto-fill', 'calc(33.33% - 1em)')
        this.setAttribute('gap', '4em 1.5em')
        break
      case '4':
        this.setAttribute('auto-fill', 'calc(25% - 1.125em)')
        this.setAttribute('gap', '4em 1.5em')
        break
      // auto:
      default:
        this.setAttribute('gap', '4em 1.5em')
        break
    }
    this.setAttribute('auto-fill-mobile', '100%')
    this.setAttribute('gap-mobile', '3em')

    let timeout = null
    this.resizeListener = event => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.checkMedia()
      }, 200)
    }

    let currentMedia = null
    this.checkMedia = () => {
      const isMobile = this.isMobile || this.isSectionMobile
      if (isMobile !== currentMedia) {
        currentMedia = isMobile
        this.buttons.forEach(button => {
          if (isMobile) {
            button.setAttribute('small', '')
          } else {
            button.removeAttribute('small')
          }
        })
      }
    }
  }

  connectedCallback () {
    const showPromises = super.connectedCallback() || []
    Promise.all(showPromises).then(() => this.checkMedia())
    self.addEventListener('resize', this.resizeListener)
    return showPromises
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
    const mobileCss = /* css */`
      :host > * {
        --margin: var(--margin-small);
        --p-margin: 0 auto var(--margin-small);
      }
      ${this.hasAttribute('background')
        ? /* css */`
          :host > section {
            padding: var(--mdx-sys-spacing-fix-2xs, 0.5rem);
            margin-left: -0.5rem;
            margin-right: -0.5rem;
          }
        `
        : ''
      }
      :host > section > * > :where(h2, h3):has(+ p) {
        --h-margin-bottom: calc(var(--margin) / 6);
      }
      :host > section > * > figure {
        flex-direction: column;
        gap: calc(var(--margin-smallest) / 1.5);
      }
      :host > section > * > figure > ks-a-picture, :host > section > * > figure > *:not(figcaption) {
        width: 70%;
      }
      :host > section > * > figure > figcaption {
        width: 100%;
      }
      :host > section > * > figure > figcaption > ks-m-contact-row:has(+ .buttons) {
        margin-bottom: var(--margin-small);
      }
      :host > section > * > figure > figcaption > :where(h2, h3) {
        margin-bottom: var(--margin-smaller);
      }
      :host > section > * > figure > figcaption > div.buttons {
        width: 100%;
      }
      :host > section > * div.buttons {
        gap: var(--mdx-sys-spacing-fix-s, 1rem);
        min-width: 75%;
      }
    `
    this.css = /* css */`
      :host {
        --margin: var(--mdx-sys-spacing-fix-l, 2rem);
        --margin-small: var(--mdx-sys-spacing-fix-m, 1.5rem);
        --margin-smaller: var(--mdx-sys-spacing-fix-s, 1rem);
        --margin-smallest: var(--mdx-sys-spacing-fix-xs, 0.75rem);
        display: block;
        container: host / inline-size;
      }
      ${this.hasAttribute('background')
        ? /* css */`
          :host > section {
            background: ${this.getAttribute('background')};
            padding: var(--mdx-sys-spacing-fix-s, 1rem);
          }
        `
        : ''
      }
      :host([count-section-children="1"][grid-template-columns="2"]) > section > * {
        grid-column: span 2;
      }
      :host([count-section-children="1"][grid-template-columns="3"]) > section > * {
        grid-column: span 3;
      }
      :host([count-section-children="1"][grid-template-columns="4"]) > section > * {
        grid-column: span 4;
      }
      :host > section > * > * {
        display: block;
        margin-bottom: var(--margin);
      }
      :host > section > * > a {
        --a-margin: var(--margin);
      }
      :host > section > * > :where(h2, h3):has(+ p) {
        --h-margin-bottom: calc(var(--margin) / 8);
      }
      :host > section > * > :where(h2, h3):has(+ figure) {
        --h-margin-bottom: calc(var(--margin-small) / 2);
      }
      :host > section > * > :where(h2, h3) {
        --h-margin-bottom: var(--margin);
      }
      :host > section > * > ks-m-contact-row:not(:has(+ .buttons)) {
        margin-bottom: var(--margin-small);
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
      :host > section > * > figure {
        --img-object-fit: cover;
        --picture-default-img-object-fit: var(--img-object-fit);
        display: flex;
        gap: var(--margin-smaller);
        margin: 0;
      }
      :host > section > * > figure > ks-a-picture, :host > section > * > figure > *:not(figcaption) {
        width: 30%;
      }
      :host > section > * > figure > figcaption {
        width: calc(70% - var(--margin-smaller));
      }
      :host > section > * > figure > figcaption > p:has(+ p) {
        margin-bottom: 0;
      }
      :host > section > * > figure > figcaption > :where(h2, h3) {
        margin-bottom: var(--margin-small);
      }
      :host > section > * > figure > figcaption > :where(h2, h3):has(+ p) {
        margin-bottom: 0;
      }
      :host > section > * > figure > figcaption > div.buttons {
        gap: var(--margin-smaller);
      }
      :host > section > * > *.logo {
        --img-max-height: 3.125em;
      }
      :host > section > * > *.logo > img, :host > section > * > img.logo {
        max-height: 3.125em;
      }
      :host > section > * div.buttons {
        --button-primary-width: 100%;
        --button-secondary-width: 100%;
        --button-tertiary-width: 100%;
        --button-quaternary-width: 100%;
        display: grid;
        gap: var(--margin-small);
        width: fit-content;
      }
      ${this.hasAttribute('force-mobile-figure')
        ? mobileCss + /* css */`
          :host([force-mobile-figure]) > section {
            gap: 3em 1.5em;
          }
          :host([force-mobile-figure]) > section > * > figure > ks-a-picture, :host([force-mobile-figure]) > section > * > figure > *:not(figcaption) {
            width: 62.5%;
          }
        `
        : ''
      }
      @media only screen and (min-width: calc(_max-width_ + 1px)) {
        :host > section > * > figure > figcaption > div.buttons.horizontal {
          --button-primary-width: fit-content;
          --button-secondary-width: fit-content;
          --button-tertiary-width: fit-content;
          --button-quaternary-width: fit-content;
          display: flex;
          width: 100%;
        }
      }
      @media only screen and (max-width: _max-width_) {
        :host([count-section-children="1"][grid-template-columns="2"]) > section > *, :host([count-section-children="1"][grid-template-columns="3"]) > section > *, , :host([count-section-children="1"][grid-template-columns="4"]) > section > * {
          grid-column: span 1;
        }
        ${mobileCss}
      }
      @container host (max-width: _max-width_) {
        ${mobileCss}
      }
    `
    return super.renderCSS()
  }

  get isMobile () {
    return self.matchMedia(`(max-width: ${this.mobileBreakpoint})`).matches
  }

  get isSectionMobile () {
    return this.section.clientWidth <= Number(this.mobileBreakpoint.replace('px', ''))
  }

  get buttons () {
    return Array.from(this.root.querySelectorAll('.buttons > *'))
  }
}
