// @ts-check
import Dialog from '../../web-components-toolbox/src/es/components/molecules/dialog/Dialog.js'

/* global Environment */
/* global location */

/**
* @export
* @class Dialog
* In Progress
* https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
* @type {CustomElementConstructor}
*/
export default class KsDialog extends Dialog {
  constructor (options = {}, ...args) {
    super({ ...options }, ...args)

    const superClose = this.close
    this.close = async () => {
      return superClose()
    }
  }

  connectedCallback () {
    super.connectedCallback()
    if (this.shouldRenderCustomHTML()) this.renderCustomHTML()
    const result = super.connectedCallback()
    this.addEventListener('message-rendered', this.messageRenderedEventListener)
    return result
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    this.removeEventListener('message-rendered', this.messageRenderedEventListener)
  }

  /**
     * evaluates if a render is necessary
     *
     * @return {boolean}
     */
  shouldRenderCustomHTML () {
    return !this.root.querySelector(this.cssSelector + ' > dialog')
  }

  /**
   * renders the css
   */
  renderCSS () {
    const result = super.renderCSS()
    this.setCss(/* css */`
      :host > dialog {}
    `, undefined, false)
    return result
  }

  /**
   * Render HTML
   * @returns Promise<void>
   */
  renderCustomHTML () {
    const filterIdPrefix = 'filter-'
    const filterItem = this.hasAttribute('filter-item') ? JSON.parse(this.getAttribute('filter-item')) : {}
    const response = this.hasAttribute('filter-data') ? JSON.parse(this.getAttribute('filter-data')) : {}
    const level = this.hasAttribute('filter-level') ? this.getAttribute('filter-level') : 0
    const shouldRemainOpen = this.hasAttribute('remain-open') ? this.getAttribute('remain-open') : false

    this.html = /* html */`
        <m-dialog id="${filterIdPrefix + filterItem.id}" ${shouldRemainOpen ? 'open' : ''} filter-level="level-${level}" namespace="dialog-left-slide-in-without-background-" show-event-name="dialog-open-${filterItem.id}" close-event-name="backdrop-clicked">
            <div class="container dialog-header" tabindex="0">
                <a-button id="close-back">
                    <a-icon-mdx icon-name="ChevronLeft" size="2em" id="close"></a-icon-mdx>
                </a-button>
                <h3>${filterItem.label?.replace(/'/g, '’').replace(/"/g, '\"')}</h3>
                <a-button request-event-name="backdrop-clicked" id="close">
                    <a-icon-mdx icon-name="Plus" size="2em" rotate="45deg" no-hover-transform></a-icon-mdx>
                </a-button>
            </div>
            <div class="dialog-content">
                ${this.hasAttribute('translation-key-reset') ? /* html */`<p class="reset-link">
                    <a-button namespace="button-transparent-" request-event-name="reset-filter" filter-key="${filterItem.urlpara}">
                        ${this.getAttribute('translation-key-reset')}<a-icon-mdx class="icon-right" icon-name="RotateLeft" size="1em"></a-icon-mdx>
                    </a-button>
                </p>` : ''}
                <div class="sub-level sub-level-${filterItem.id} ${this.hasAttribute('translation-key-reset') ? 'margin-bottom' : 'margin-top-bottom'}"></div>       
            </div>
            <div class="container dialog-footer">
                <a-button id="close" namespace="button-tertiary-" no-pointer-events request-event-name="backdrop-clicked">${this.getAttribute('translation-key-close')}</a-button>
                <a-button id="close" class="button-show-all-offers" namespace="button-primary-" no-pointer-events request-event-name="backdrop-clicked">${response.total > 0 ? `${response.total.toString()}` : ''} ${response.total_label}</a-button>
            </div>
            <slot></slot>
        </m-dialog>
    `
    return this.fetchModules([
        {
            path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/button/Button.js`,
            name: 'a-button'
        },
        {
            path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
            name: 'a-icon-mdx'
        }
    ])
  }
}