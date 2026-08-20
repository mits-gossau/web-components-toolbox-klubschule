// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * Progressively enhances the server-rendered Klubschule breadcrumb.
 * All navigation links remain in the initial light DOM.
 *
 * @export
 * @class Breadcrumb
 * @type {CustomElementConstructor}
 */
export default class Breadcrumb extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, tabindex: 'no-tabindex', mode: 'false', ...options }, ...args)

    this.resizeObserver = new ResizeObserver(() => this.updateLayout())
    this.handleExpand = () => {
      this.expanded = true
      this.setAttribute('expanded', '')
      this.showAllItems()
      this.ellipsisItem.hidden = true
    }
    this.handleFocus = event => {
      if (this.isMobile && event.target instanceof HTMLElement) {
        event.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
      }
    }
    this.handleScroll = () => this.updateFade()
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()

    this.list = this.querySelector('ol')
    this.ellipsisItem = this.querySelector('.breadcrumb__ellipsis')
    this.ellipsisButton = this.ellipsisItem?.querySelector('button')
    this.items = Array.from(this.querySelectorAll('[data-breadcrumb-item]:not(.breadcrumb__item--current)'))
    this.expanded = false
    this.hasInitialMobilePosition = false

    if (!this.list || !this.ellipsisItem || !this.ellipsisButton) return

    this.ellipsisButton.addEventListener('click', this.handleExpand)
    this.addEventListener('focusin', this.handleFocus)
    this.list.addEventListener('scroll', this.handleScroll, { passive: true })
    this.resizeObserver.observe(this)
    this.updateLayout()
  }

  disconnectedCallback () {
    this.ellipsisButton?.removeEventListener('click', this.handleExpand)
    this.removeEventListener('focusin', this.handleFocus)
    this.list?.removeEventListener('scroll', this.handleScroll)
    this.resizeObserver.disconnect()
  }

  get isMobile () {
    return window.matchMedia('(max-width: 767px)').matches
  }

  shouldRenderCSS () {
    return !this.querySelector(':scope > style[_css]')
  }

  updateLayout () {
    if (!this.list || !this.ellipsisItem) return

    if (this.isMobile) {
      this.removeAttribute('expanded')
      this.showAllItems()
      this.ellipsisItem.hidden = true
      requestAnimationFrame(() => {
        if (!this.hasInitialMobilePosition) {
          this.list.scrollLeft = this.list.scrollWidth
          this.hasInitialMobilePosition = true
        }
        this.updateFade()
      })
      return
    }

    this.hasInitialMobilePosition = false
    this.removeAttribute('has-hidden-start')
    this.showAllItems()

    if (this.expanded) {
      this.ellipsisItem.hidden = true
      return
    }

    this.ellipsisItem.hidden = true
    if (!this.hasOverflow()) return

    this.ellipsisItem.hidden = false
    const hideableItems = this.items.slice(1, -1)
    for (const item of hideableItems) {
      item.hidden = true
      if (!this.hasOverflow()) break
    }
  }

  hasOverflow () {
    return this.list.scrollWidth > this.list.clientWidth + 1
  }

  showAllItems () {
    this.items.forEach(item => { item.hidden = false })
  }

  updateFade () {
    if (!this.list || !this.isMobile) return
    this.toggleAttribute('has-hidden-start', this.list.scrollLeft > 2)
  }

  renderCSS () {
    this.css = /* css */`
      :host([mode="false"]) {
        --breadcrumb-gap: 0.5rem;
        --breadcrumb-color-local: var(--breadcrumb-color, #ffffff);
        color: var(--breadcrumb-color-local);
        display: block;
        font-size: 1rem;
        line-height: 1.5;
        margin: 0 0 1rem !important;
        min-width: 0;
        position: relative;
        text-align: left;
        width: 100%;
      }

      :host([mode="false"]) nav {
        min-width: 0;
      }

      :host([mode="false"]) ol {
        align-items: center;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        gap: var(--breadcrumb-gap);
        justify-content: flex-start;
        list-style: none;
        margin: 0;
        max-width: 100%;
        padding: 0;
      }

      :host([mode="false"]) li {
        align-items: center;
        display: flex;
        flex: 0 0 auto;
        gap: var(--breadcrumb-gap);
        min-width: 0;
        white-space: nowrap;
      }

      :host([mode="false"]) li[hidden] {
        display: none;
      }

      :host([mode="false"]) a,
      :host([mode="false"]) button {
        color: inherit;
        font: inherit;
        font-weight: 700;
      }

      :host([mode="false"]) a {
        margin: 0;
        text-decoration: none;
        text-underline-offset: 0.2em;
      }

      :host([mode="false"]) a:hover,
      :host([mode="false"]) a:focus-visible {
        text-decoration: underline;
      }

      :host([mode="false"]) button {
        appearance: none;
        background: none;
        border: 0;
        cursor: pointer;
        margin: 0;
        padding: 0 0.125rem;
      }

      :host([mode="false"]) button:hover,
      :host([mode="false"]) button:focus-visible {
        text-decoration: underline;
      }

      :host([mode="false"]) .breadcrumb__separator {
        font-weight: 400;
      }

      :host([mode="false"]) .breadcrumb__home {
        align-items: center;
        display: inline-flex;
      }

      :host([mode="false"]) .breadcrumb__item--current {
        border: 0;
        clip: rect(0 0 0 0);
        clip-path: inset(50%);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        white-space: nowrap;
        width: 1px;
      }

      @media only screen and (max-width: 767px) {
        :host([mode="false"])::before {
          background: linear-gradient(90deg, var(--breadcrumb-stage-color, rgba(0, 0, 0, 0.3)), transparent);
          content: '';
          inset: 0 auto 0 0;
          opacity: 0;
          pointer-events: none;
          position: absolute;
          transition: opacity 150ms ease;
          width: 2rem;
          z-index: 1;
        }

        :host([mode="false"][has-hidden-start])::before {
          opacity: 1;
        }

        :host([mode="false"]) ol {
          flex-wrap: nowrap;
          overflow-x: auto;
          overscroll-behavior-x: contain;
          scrollbar-width: none;
        }

        :host([mode="false"]) ol::-webkit-scrollbar {
          display: none;
        }
      }

      @media only screen and (min-width: 768px) {
        :host([mode="false"][expanded]) ol {
          flex-wrap: wrap;
        }
      }
    `
  }
}
