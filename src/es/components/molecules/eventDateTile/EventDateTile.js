// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class EventDateTile
* @type {CustomElementConstructor}
*/
export default class EventDateTile extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
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
    return !this.root.querySelector('div')
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
      :host .event-date-tile {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      :host .event-status {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      :host .event-label-badge {
        display: inline-block;
        border: 1px solid #262626;
        border-radius: 3px;
        padding: 4px 8px;
      }
      :host .event-datetime {
        display: flex;
        justify-content: space-between;
      }
      :host .event-time {
        text-align: right;
      }
      :host .event-icons-price {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      :host .event-price {
        text-align: right;
      }
    `
  }

  renderHTML () {
    this.html = ''
    this.html = /* html */ `
      <div class="event-date-tile">
        <div class="event-status">
          <a-icon-mdx icon-url="${this.setIconUrl({status:1})}" size="1.5em"></a-icon-mdx>
          <span class="event-status-text">Garantiert durchgeführt</span>
        </div>
        <div class="event-label">
          <span class="event-label-badge">Teil 1 von 3- HybridTeil 1 von 3- Hybrid</span>
        </div>
        <div class="event-datetime">
          <span class="event-date">28.04.2025 - <br />18.08.2025</span>
          <span class="event-time">Mo, Di, Mi, Do, Fr<br />18:00 - 18:50</span>
        </div>
        <div class="event-lessons">
          <span class="event-lessons-text">16 Lektionen</span>
        </div>
        <div class="event-location">
          <span class="event-location-text">Zürich-Altstetten,<br />Präsenz und Online kombiniert</span>
        </div>
        <div class="event-icons-price">
          <span class="wishlist">
            <ks-a-button icon namespace="button-secondary-" color="secondary"><a-icon-mdx icon-name="Heart" size="1em"></a-icon-mdx></ks-a-button>
          </span>
          <span class="info-icons"></span>
          <span class="event-price">
            ab 32000.00 CHF<br />/ Semester
          </span>
        </div>
      </div>
    `
    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      },
      {
        path: `${this.importMetaUrl}../../atoms/button/Button.js`,
        name: 'ks-a-button'
      }
    ])
  }

  setIconUrl (data) {
    let iconName = ''
    if (data.status == '1') {
      iconName = 'garanteed'
    } else if (data.status == '2') {
      iconName = 'started'
    } else if (data.status == '3') {
      iconName = 'await'
    } else if (data.status == '4') {
      iconName = 'almost'
    }

    return `../../../../../../../img/icons/event-state-${iconName}.svg`
  }
}
