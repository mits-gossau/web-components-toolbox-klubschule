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
        <div class="option-content">
          ${content}
        </div>
        <p><a-translate data-params="${escapeForHtml(JSON.stringify({ amount: option.currentVotes, of: option.maxVotes }))}">CustomerLoyality.PickedByParticipants</a-translate></p>
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
        --table-padding: 0.5rem;
        --table-width: auto;
        --mdx-sys-spacing-flex-l: 0;

        margin-bottom: var(--content-spacing, 1.5rem);
        display: block;
        padding: 1.25rem;
        background: #fff;
        border: 1px solid #ccc;
      }

      /* overriding inherited styles */
      :host div.option-content:has(table) {
        margin: 0;
        overflow: visible;
        // display: flex;
      }

      table tbody td:last-child {
        text-align: right;
      }

      .bold {
        font-weight: bold;
      }

      .option-content > * {
        flex: 1 1 50%;
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
