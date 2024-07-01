// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Sort
* @type {CustomElementConstructor}
*/
export default class Sort extends Shadow() {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.closeEventListener = event => this.root.querySelector('.m-sort__tooltip-open')?.classList.remove('m-sort__tooltip-open')

    this.selfCloseEventListener = event => {
      const target = Array.from(event.composedPath()).find(node => node.tagName === 'KS-M-SORT')
      if (target) return event.stopPropagation()
      else  this.root.querySelector('.m-sort__tooltip-open')?.classList.remove('m-sort__tooltip-open')
    }
  }

  connectedCallback() {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()

    this.toggleTooltip()
    if (this.getAttribute('close-event-name')) document.body.addEventListener(this.getAttribute('close-event-name'), this.closeEventListener)

    self.addEventListener('click', this.selfCloseEventListener)
  }

  disconnectedCallback() {
    if (this.getAttribute('close-event-name')) document.body.removeEventListener(this.getAttribute('close-event-name'), this.closeEventListener)

    self.removeEventListener('click', this.selfCloseEventListener)
  }

  /**
   * Toggle tooltip
   */
  toggleTooltip() {
    const toggle = this.root.querySelector('.m-sort')
    if (toggle) {
      toggle.addEventListener('click', () => {
        const tooltip = this.root.querySelector('.m-sort__tooltip')
        tooltip.classList.toggle('m-sort__tooltip-open')
      })
    }
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS() {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML() {
    return !this.sort
  }

  /**
   * renders the css
   */
  renderCSS() {
    this.css = /* css */`
      :host .m-sort {
        position: relative;
        display: flex;
        justify-content: var(--justify-content);
      }

      :host .m-sort:hover {
        cursor: pointer;
      }

      :host .m-sort__tooltip {
        display: none;
        position: absolute;
        top: 2em;
        background-color: #FFFFFF;
        border-radius: 0.5em;
        box-shadow: 0em 0em 0.75em 0em rgba(51, 51, 51, 0.1);
        z-index: 11;
        overflow: hidden;
      }

      :host .m-sort__list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      :host .m-sort__item {
        display: var(--item-display, block);
        padding: var(--item-padding, 1em 1.5em);
        min-width: var(--item-min-width, 18em);
        font-size: 1em;
        line-height: 1.375em;
        color: var(--m-black);
        font-weight: 400;
      }

      :host .m-sort__item:hover {
        background-color: var(--hover-color);
      }

      :host .m-sort__item.m-sort__item-active {
        padding: var(--active-item-padding, 1em 1.5em);
      }

      :host .m-sort__item-active,
      :host .m-sort__item-active * {
        font-weight: 500;
      }

      :host .m-sort__tooltip-open {
        display: block;
      }

      :host .m-sort__item a {
        padding: var(--item-a-padding, 1em);
        width: var(--item-a-width, auto);
      }

      @media only screen and (max-width: _max-width_) {
        :host .m-sort {

        }
      }
    `
    return this.fetchTemplate()
  }

  /**
   * fetches the template
   */
  fetchTemplate() {
    /** @type {import("../../web-components-toolbox/src/es/components/prototypes/Shadow.js").fetchCSSParams[]} */
    const styles = [
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/reset.css`, // no variables for this reason no namespace
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: true
      }
    ]
    switch (this.getAttribute('namespace')) {
      case 'sort-default-':
        return this.fetchCSS([
          {
            path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
            namespace: false
          }, ...styles])
      case 'sort-right-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false,
          replaces: [{
            pattern: '--sort-default-',
            flags: 'g',
            replacement: '--sort-right-'
          }]
        }, {
          path: `${this.importMetaUrl}./right-/right-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles])
      default:
        return this.fetchCSS(styles)
    }
  }

  /**
   * Render HTML
   * @returns Promise<void>
   */
  renderHTML() {
    const ul = this.root.querySelector('ul')
    if (!ul) return console.warn('element empty')
    const currentText = ul.getAttribute('main-text') || ''
    const iconSize = this.getAttribute('icon-size') || '1em'
    const iconName = this.getAttribute('icon-name') || 'ChevronDown'
    const buttonSpanPadding = this.getAttribute('button-span-padding') || '0 0 0 0'

    ul.classList.add('m-sort__list')
    Array.from(ul.children).forEach(li => {
      li.classList.add('m-sort__item')
      if (this.hasAttribute('with-facet')) {
        li.addEventListener('click',
          (event) => {
            if (event.composedPath()[0].getAttribute('id') === '2' && !window.location.search.includes('clat') && !window.location.search.includes('clong')) {
              this.dispatchEvent(
                new CustomEvent('show-location-search-dialog', {
                  detail: {},
                  bubbles: true,
                  cancelable: true,
                  composed: true
                })
              )
            } else {
              this.dispatchEvent(
                new CustomEvent('request-with-facet', {
                  detail: {
                    key: 'sorting',
                    id: event.currentTarget?.id
                  },
                  bubbles: true,
                  cancelable: true,
                  composed: true
                })
              )
            }
          }
        )
      }
    })
    Array.from(ul.querySelectorAll('[active]')).forEach(li => li.classList.add('m-sort__item-active'))

    this.html = ''
    // don't wait for fetchModules to resolve if using "shouldRenderHTML" checks for this.badge it has to be sync
    this.html = /* HTML */`
    <div class="m-sort">
        <ks-a-button namespace="button-secondary-filter-" color="tertiary">
            <span style="padding: ${buttonSpanPadding}">${currentText}</span>
            <a-icon-mdx namespace="icon-mdx-ks-" icon-name=${iconName} size=${iconSize} class="icon-down">
        </ks-a-button>
        <div class="m-sort__tooltip">
        </div>
    </div>
    `
    this.root.querySelector('.m-sort__tooltip').appendChild(ul)
    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../atoms/button/Button.js`,
        name: 'ks-a-button'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ])
  }

  get sort() {
    return this.root.querySelector('.m-sort')
  }
}
