// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Event
* @type {CustomElementConstructor}
*/
export default class Event extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.clickEventListener = event => {
      if (this.icon) {
        if (this.icon.getAttribute('icon-name') === 'ChevronDown') {
          this.icon.setAttribute('icon-name', 'ChevronUp')
          this.root.querySelector('.more.show').classList.remove('show');
          this.root.querySelector('.less').classList.add('show');
        } else {
          this.icon.setAttribute('icon-name', 'ChevronDown')
          this.root.querySelector('.less.show').classList.remove('show');
          this.root.querySelector('.more').classList.add('show');
        }
      }

      this.details = this.root.querySelector('.details')
      this.details.classList.toggle('details-expanded')
    }
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()

    this.icon = this.root.querySelector('a-icon-mdx[icon-name="ChevronDown"]')
    this.toggle = this.root.querySelector('.expand');

    this.toggle.addEventListener('click', this.clickEventListener);
  }

  disconnectedCallback () {
    this.toggle.removeEventListener('click', this.clickEventListener)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML () {
    return !this.badge
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host .event {
        display: flex;
        flex-direction: column;

        background-color: var(--mdx-base-color-grey-0);
        border: 0.063rem solid var(--mdx-base-color-grey-700);
        padding: 1.5rem;
        color: var(--mdx-base-color-grey-975);
      }

      :host .head {
        display: grid;
        grid-template-columns: 50% 50%;
        column-gap: 3rem;       
      }

      :host .controls {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-top: 1.5rem;
        width: 100%;
      }

      :host .date {
        font-size: 1.5rem;
        line-height: 1.625rem;
        font-weight: 500;
      }

      :host .time {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 0.75rem;
      }

      :host .days {
        font-size: 1.5rem;
        line-height: 1.625rem;
        font-weight: 400;
      }

      :host .badge {
        padding: 0.25rem 0.5rem;
        border: 0.063rem solid var(--mdx-base-color-grey-700);
        border-radius: 0.188rem;
        font-size: 0.875rem;
        line-height: 1.125rem;
        margin-left: 0.625rem;
      }

      :host .meta {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      :host .meta li {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      :host .meta li + li {
        margin-top: 1rem;
      }

      :host .meta li div {
        background-color: var(--mdx-base-color-klubschule-green-600);
        height: 1.5rem;
        width: 1.5rem;
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      :host .meta li span {
        font-size: 1rem;
        line-height: 1.25rem;
        margin-left: 0.75rem;
      }

      :host .meta li .expand {
        display: flex;
        flex-direction: row;
        align-items: center;
        border: none;
        background-color: transparent;
        color: var(--mdx-base-color-klubschule-blue-600);
        font-size: 1.125rem;
        line-height: 1.25rem;
        font-weight: 500;
        margin: 0;
        padding: 0;
        cursor: pointer;
      }

      :host .meta li .expand span {
        margin-left: 0;
        margin-right: 0.25rem;
      }

      :host .meta li .expand .more,
      :host .meta li .expand .less {
        display: none;
      }

      :host .meta li .expand .show {
        display: block;
      }

      :host .controls-left {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      :host .controls-left div + div,
      :host .controls-left div a-icon-mdx + ks-a-button {
        margin-left: 1rem;
      }

      :host .controls-right {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      :host .icons {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      :host .icon {
        background-color: var(--mdx-base-color-klubschule-blue-600);
        border-radius:  0.1875em;
        height: 1.5rem;
        width: 1.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      :host .icon + .icon {
        margin-left: 0.5em;
      }
      
      :host .icon a-icon-mdx {
          color: var(--icon-box-color);
      }

      :host .price {
        font-size: 0.875rem;
        line-height: 0.9375rem;
        font-weight: 500;
        padding-left: 0.75rem;
      }
      
      :host .price strong {
          font-family: 'Graphik';
          font-size: 1.5rem;
          line-height: 1.625rem;
          font-weight: 500;    
      }

      :host .details {
        display: none;
        grid-template-columns: 50% 50%;
        column-gap: 3rem;
        margin: 1.5rem 0;
        padding: 1.5rem 0;
        width: 100%;
      }

      :host .details-expanded {
        display: grid;
      }

      @media only screen and (max-width: _max-width_) {
        :host .event {
          padding: 1rem 0.5rem;
        }

        :host .head {
          grid-template-columns: 100%;
          column-gap: 0;
        }

        :host .meta {
          margin-top: 3rem;
        }

        :host .controls {
          margin-top: 1rem;
        }

        :host .date {
          font-size: 1.25rem;
          line-height: 1.375rem;
        }
  
        :host .time {
          flex-direction: column;
          align-items: flex-start;
          margin-top: 0.75rem;
        }
  
        :host .days {
          font-size: 1.25rem;
          line-height: 1.375rem;
        }
  
        :host .badge {
          margin-top: 0.625rem;
          margin-left: 0;
        }

        :host .controls {
          flex-direction: column-reverse;
        }

        :host .controls-left {
          justify-content: space-between;
          margin-top: 2rem;
          width: 100%;
        }

        :host .controls-right {
          flex-direction: column;
          align-items: flex-end;
          width: 100%;
        }

        :host .price {
          margin-top: 1rem;
        }
      }
    `
  }

  /**
   * Render HTML
   * @returns Promise<void>
   */
  renderHTML () {
    const warnMandatory = 'data attribute requires: '
    const data = Event.parseAttribute(this.getAttribute('data'))
    if (!data) return console.error('Data json attribute is missing or corrupted!', this)
    // don't wait for fetchModules to resolve if using "shouldRenderHTML" checks for this.badge it has to be sync
    this.html = /* HTML */`
    <div class="event">
      <div class="head">
        <div class="dates">
          <span class="date">${data.gueltig_ab} - ${data.gueltig_bis}</span>
          <div class="time">
            <span class="days">${data.days}</span>
            <div class="badge">${data.badge}</div>
          </div>
        </div>
        <ul class="meta">
          <li>
            <div>
              <a-icon-mdx namespace="icon-mdx-ks-event-tick-" icon-name="Check" size="1.25em" class="icon-right"></a-icon-mdx>
            </div>
            <span>${data.status_label}</span>
          </li>
          <li>
            <a-icon-mdx namespace="icon-mdx-ks-event-" icon-name="FileText" size="1.5em" class="icon-right"></a-icon-mdx>
            <span>${data.lektionen_label}</span>
          </li>
          <li>
            <a-icon-mdx namespace="icon-mdx-ks-event-" icon-name="Location" size="1.5em" class="icon-right"></a-icon-mdx>
            <span>${data.location}</span>
          </li>
          <li>
            <button class="expand">
              <span class="more show">${data.detail_mehr_label}</span>
              <span class="less">${data.detail_weniger_label}</span>
              <a-icon-mdx namespace="icon-mdx-ks-event-link-" icon-name="ChevronDown" size="1em" class="icon-right"></a-icon-mdx>
            </button>
          </li>
        </ul>      
      </div>
      <div class="details">
        <div class="details-left">Details Left</div>
        <div class="details-right">Details Right</div>
      </div>
      <div class="controls">
        <div class="controls-left">
          <div>
            <a-icon-mdx namespace="icon-mdx-ks-event-link-" icon-name="Trash" size="1em" class="icon-right"></a-icon-mdx>  
            <ks-a-button namespace="button-secondary-" color="secondary">
                <a-icon-mdx icon-name="Heart" size="1em" class="icon-left"></a-icon-mdx>${data.merken_label}
            </ks-a-button>            
          </div>
          <div>
            <ks-a-button namespace="button-primary-" color="secondary">${data.anmelden_label}</ks-a-button>          
          </div>
        </div>
        <div class="controls-right">
          <div class="icons">
            ${data.icons.reduce((acc, icon) => acc + /* html */`
            <div class="icon">
              <ks-m-tooltip namespace="tooltip-right-" text="${icon.iconTooltip}">
                <a-icon-mdx namespace="icon-mdx-ks-badge-" icon-name="${icon.name}" size="1em"></a-icon-mdx>
              </ks-m-tooltip>
            </div>
            `, '')}
          </div>
          <span class="price">${data.price?.from ? data.price?.from + ' ' : ''}<strong>${data.price?.amount || ''}</strong>${data.price?.per ? ' / ' + data.price?.per : ''}</span>
        </div>
      </div>
    </div>
    `
    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../atoms/button/Button.js`,
        name: 'ks-a-button'
      },
      {
        path: `${this.importMetaUrl}../../molecules/tooltip/Tooltip.js`,
        name: 'ks-m-tooltip'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ])
  }

  get badge () {
    return this.root.querySelector('[badge]')
  }
}
