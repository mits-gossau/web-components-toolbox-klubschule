import { Shadow } from '../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'
import { escapeForHtml } from '../../helpers/Shared.js'

/**
 * Voting Option
 *
 * @export
 * @class Option
 * @type {CustomElementConstructor}
 */
export default class Option extends Shadow() {
  /**
   * @param {any} args
   */
  constructor (options = {}, ...args) {
    super(
      { importMetaUrl: import.meta.url, mode: 'false', ...options },
      ...args
    )
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()

    const dictKey = this.dataset.dictionaryKey
    const option = this.dataset.option ? JSON.parse(this.dataset.option) : null
    const content = this.innerHTML
    this.html = ''
    this.html = /* html */ `
        <ks-a-heading tag="h3">
          <a-translate>${dictKey}.Title</a-translate>
        </ks-a-heading>
        <p><a-translate>${dictKey}.Text</a-translate></p>
        ${content}
        <p><small><a-translate data-params="${escapeForHtml(JSON.stringify({ amount: option.currentVotes, of: option.maxVotes }))}">CustomerLoyality.PickedByParticipants</a-translate></small></p>
    `
  }

  disconnectedCallback () {}

  shouldRenderCSS () {
    return !this.root.querySelector(
      `:host > style[_css], ${this.tagName} > style[_css]`
    )
  }

  renderCSS () {
    this.css = /* css */ `
      :host {
        --table-even-background-color: transparent;
        --table-padding: 0.5rem 0;
        // --table-width: auto;
        --mdx-sys-spacing-flex-l: 0;

        display: block;
        padding: 1.25rem;
        background: #fff;
        border: 1px solid #ccc;

        display: flex;
        flex-direction: column;
      }

      :host:last-child {
        margin-bottom: 0;
      }

      :host table {
        margin-top: auto !important;
        margin-bottom: 1.5em !important;
      }

      table tbody td:last-child {
        text-align: right;
      }

      :host p {
        margin-left: 0 !important;
        marign-right: 0 !important;
      }

      .bold {
        font-weight: bold;
      }

      ks-a-heading {
        --h3-margin: 0;
      }
      @media only screen and (max-width: _max-width_) {
        :host {}
      }
    `
  }
}
