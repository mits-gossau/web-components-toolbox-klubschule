// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Event
* @type {CustomElementConstructor}
*/
export default class Event extends Shadow() {
  constructor(options = {}, ...args) {
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

      this.renderDetails()
      this.details.classList.toggle('details-expanded')
    }
  }

  connectedCallback() {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()

    this.icon = this.root.querySelector('a-icon-mdx[icon-name="ChevronDown"]')
    this.toggle = this.root.querySelector('.expand');

    this.toggle.addEventListener('click', this.clickEventListener);
  }

  disconnectedCallback() {
    this.toggle.removeEventListener('click', this.clickEventListener)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS() {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML() {
    return !this.badge
  }

  /**
   * renders the css
   */
  renderCSS() {
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
        height: 1.125rem;
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

      :host .meta span {
        font-size: 1rem;
        line-height: 1.25rem;
        margin-left: 0.75rem;
      }

      :host .link-more {
        display: flex;
        flex-direction: row;
        align-items: center;
        border: none;
        background-color: transparent;
        color: var(--mdx-base-color-klubschule-blue-600);
        margin: 0;
        padding: 0;
        margin-top: 1rem;
        cursor: pointer;
        text-decoration: none;
      }

      :host .link-more a-icon-mdx {
        color: var(--mdx-base-color-klubschule-blue-600);
      }

      :host .meta li .link-more {
        margin-top: 0;
      }

      :host .link-more span {
        font-size: 1.125rem;
        line-height: 1.25rem;
        font-weight: 500;
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

      :host .controls-left a-icon-mdx {
        color: var(--mdx-base-color-klubschule-blue-600);
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
        grid-template-columns: 1fr 1fr;
        column-gap: 3rem;
        margin: 1.5rem 0;
        padding: 1.5rem 0;
        width: 100%;
      }

      :host .details-expanded {
        display: grid;
      }

      :host .loading {
        display: block;
      }

      :host .details-left div + div,
      :host .details-right div + div {
        margin-top: 3rem;
      }

      :host h3 {
        font-size: 1.25rem;
        line-height: 1.375rem;
        font-weight: 500;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 1rem;
      }

      :host h3 span {
        margin-left: 0.75rem;
      }

      :host table {
        border-collapse: collapse;
        table-layout: fixed;
        width: 100%;
      }
      
      :host .table-price tr td {
        text-align: right;
      }

      :host .table-price + p + div {
        margin-top: 1rem;
      }

      :host .details-right table tr td {
        width: 33.33%;
      }

      :host table tr {
        border-top: 0.063rem solid var(--mdx-base-color-grey-700);
        padding: 0.5rem 0 0.75rem;
      }

      :host table tr:last-child {
        border-top: 0.063rem solid var(--mdx-base-color-grey-700);
        border-bottom: 0.063rem solid var(--mdx-base-color-grey-700);
      }

      :host table tr th {
        padding: 0.5rem 0 0.75rem;
        text-align: left;
        font-size: 0.875rem;
        line-height: 1rem;
        font-weight: 500;
        width: 50%;
      }

      :host table tr td {
        padding: 0.5rem 0 0.75rem;
        text-align: left;
        font-size: 0.875rem;
        line-height: 1rem;
        font-weight: 400;
        width: 50%;
      }

      :host table tr td strong {
        font-weight: 500;
      }

      :host table + p {
        margin-top: 1rem;
        font-size: 0.875rem;
        line-height: 1.125rem;
        font-weight: 400;
        margin-bottom: 0;
      }

      :host .address div {
        display: flex;
        flex-direction: row;
      }

      :host address {
        font-style: normal;
      }

      :host address a {
        display: flex;
        flex-direction: column;
        color: var(--mdx-base-color-klubschule-blue-600);
        text-decoration: none;
        margin-right: 1rem;
        min-width: 11.25rem;
        font-size: 0.875rem;
        line-height: 1rem;
      }

      :host address a .description {
        font-weight: 500;
      }

      :host address a div span + span {
        margin-left: 0.25rem;
      }

      :host a-icon-mdx {
        color: var(--mdx-base-color-grey-950);
      }

      :host .abo {
        height: 1.75rem;
        width: 1.75rem;
        border: 0.063rem solid var(--mdx-base-color-grey-975);
        border-radius: 0.188rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 400;
      }

      @media only screen and (max-width: _max-width_) {
        :host .event {
          padding: 1rem 0.5rem;
        }

        :host .head {
          grid-template-columns: 1fr;
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

        :host .details {
          grid-template-columns: 100%;
          row-gap: 3rem;
          column-gap: 0;
        }
      }
    `
  }

  /**
   * Render HTML
   * @returns Promise<void>
   */
  renderHTML() {
    const warnMandatory = 'data attribute requires: '

    if (!this.data) return console.error('Data json attribute is missing or corrupted!', this)
    // don't wait for fetchModules to resolve if using "shouldRenderHTML" checks for this.badge it has to be sync
    this.html = /* HTML */`
      <div class="event">
        <div class="head">
          <div class="dates">
            <span class="date">${this.data.gueltig_ab} - ${this.data.gueltig_bis}</span>
            <div class="time">
              <span class="days">${this.data.days}</span>
              ${this.data.badge ? /* html */ `<div class="badge">${this.data.badge}</div>` : ''}
            </div>
          </div>
          <ul class="meta">
            <li>
              <div>
                <a-icon-mdx namespace="icon-mdx-ks-" icon-url="${this.setIconUrl(this.data)}" size="1.5em"></a-icon-mdx>
              </div>
              <span>${this.data.status_label}</span>
            </li>
            <li>
              <a-icon-mdx namespace="icon-mdx-ks-" icon-url="../../../../../../../img/icons/event-list.svg" size="1.5em"></a-icon-mdx>
              <span>${this.data.lektionen_label}</span>
            </li>
            <li>
              <a-icon-mdx namespace="icon-mdx-ks-event-" icon-name="Location" size="1.5em"></a-icon-mdx>
              <span>${this.data.location}</span>
            </li>
            <li>
              <button class="link-more expand">
                <span class="more show">${this, this.data.detail_mehr_label}</span>
                <span class="less">${this, this.data.detail_weniger_label}</span>
                <a-icon-mdx namespace="icon-mdx-ks-event-link-" icon-name="ChevronDown" size="1em"></a-icon-mdx>
              </button>
            </li>
          </ul>      
        </div>
        <div class="details">
          
        </div>
        <div class="controls">
          <div class="controls-left">
              ${this.data.deletable || this.data.merken_label ? `<div>` : ''}
              ${this.data.deletable
        ? `
                <a-icon-mdx namespace="icon-mdx-ks-event-link-" icon-name="Trash" size="1em" class="icon-right"></a-icon-mdx>
                `
        : ''
      }
              ${this.data.merken_label
        ? `
                <ks-a-button namespace="button-secondary-" color="secondary">
                  <a-icon-mdx icon-name="Heart" size="1em" class="icon-left"></a-icon-mdx>${this.data.merken_label}
                </ks-a-button> 
                `
        : ''
      }
              ${this.data.deletable || this.data.merken_label ? `</div>` : ''}
            <div>
              <ks-a-button namespace="button-primary-" color="secondary">${this.data.anmelden_label}</ks-a-button>          
            </div>
          </div>
          <div class="controls-right">
            <div class="icons">
              ${this.data.icons.reduce((acc, icon) => acc + /* html */`
              <div class="icon">
                <ks-m-tooltip namespace="tooltip-right-" text="${icon.iconTooltip}">
                  <a-icon-mdx namespace="icon-mdx-ks-badge-" icon-name="${icon.name}" size="1em"></a-icon-mdx>
                </ks-m-tooltip>
              </div>
              `, '')}
            </div>
            <span class="price">${this.data.price?.from ? this.data.price?.from + ' ' : ''}<strong>${this.data.price?.amount || ''}</strong>${this.data.price?.per ? ' / ' + this.data.price?.per : ''}</span>
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
      }
    ])
  }

  get badge() {
    return this.root.querySelector('[badge]')
  }

  /**
   * Set icon path deepending on state
   * @param {*} data 
   * @returns icon path
   */
  setIconUrl(data) {
    let iconName = '';

    if (data.status == "0") {
      iconName = 'garanteed';
    } else if (data.status == "1") {
      iconName = 'started';
    } else if (data.status == "2") {
      iconName = 'await';
    } else if (data.status == "3") {
      iconName = 'almost';
    }

    return `../../../../../../../img/icons/event-state-${iconName}.svg`;
  }


  /**
    * renderDetails
    * @returns {Promise<void>} The function `renderHTML` returns a Promise.
  */
  async renderDetails() {
    if (!this.details.children.length) {
      this.fetchModules([
        {
          path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/loading/Loading.js`,
          name: 'a-loading'
        }
      ])
      this.details.classList.add('loading')
      this.details.innerHTML = '<a-loading></a-loading>'
      fetch(`${this.isEventSearch}?lang=${this.data.language}&typ=${this.data.typ}&id=${this.data.id}&center_id=${this.data.center_id}`)
        .then((response) => response.json())
        .then((data) => {
          this.details.classList.remove('loading')
          this.details.innerHTML = /* HTML */ `
              <div class="details-left">
                <div>
                  <h3>
                    <a-icon-mdx icon-url="../../../../../../../img/icons/event-list.svg" size="1.75em"></a-icon-mdx>
                    <span>${data.kursdetail_label}</span>
                  </h3>
                  <table>
                    <tr>
                      <th>${data.bezeichnung_label}</th>
                      <td>${data.bezeichnung}</td>
                    </tr>
                    <tr>
                      <th>${data.kurs_id_label}</th>
                      <td>${data.kurs_id}</td>
                    </tr>
                    <tr>
                      <th>${data.sprache_id_label}</th>
                      <td>${data.sprache_id}</td>
                    </tr>
                    <tr>
                      <th>${data.teilnehmer_max_label}</th>
                      <td>${data.teilnehmer_max}</td>
                    </tr>
                    <tr>
                      <th>${data.anzahl_dauer_label}</th>
                      <td>${data.anzahl_kurstage_label}</td>
                    </tr>
                  </table>
                  <p>${data.kurs_zusatzinfo}</p>          
                </div>
                <div class="address">
                  <h3>
                    <a-icon-mdx namespace="icon-mdx-ks-event-" icon-name="Location" size="1.75em" class="icon-right"></a-icon-mdx>
                    <span>${data.location_label}</span>
                  </h3>
                  <div>
                    <address>
                      <a href="${data.durchfuehrungaddresse.link}" target="_blank">
                        <span class="description">${data.durchfuehrungaddresse.beschreibung}</span>
                        <span>${data.durchfuehrungaddresse.strasse}</span>
                        <div>
                          <span>${data.durchfuehrungaddresse.plz}</span>
                          <span>${data.durchfuehrungaddresse.ort}</span>
                        </div>
                      </a>
                    </address>
                    <div class="badge">${data.badge}</div>
                  </div>
                </div>
                <div>
                  <h3>
                    <a-icon-mdx namespace="icon-mdx-ks-event-" icon-name="Download" size="1.75em" class="icon-right"></a-icon-mdx>
                    <span>Downloads</span>
                  </h3>
                  <ks-m-link-list namespace="link-list-download-">
                      <ul>
                      ${data.downloads.reduce((acc, download) => acc + /* html */`
                      <li>
                        <a href="${download.link}">
                            <span>${download.label}</span>
                            <div>
                                <span>${download.link_label}</span>
                                <a-icon-mdx namespace="icon-link-list-" icon-name="Download" size="1.5em" rotate="0" class="icon-right"></a-icon-mdx>
                            </div>
                        </a>                
                      </li>
                      `, '')}
                      </ul>
                  </ks-m-link-list>
                </div>
              </div>
              <div class="details-right">
                <div>
                  <h3>
                    <a-icon-mdx namespace="icon-mdx-ks-event-" icon-name="Wallet" size="1.75em" class="icon-right"></a-icon-mdx>
                    <span>${data.preis_info_label}</span>
                  </h3>
                  <table class="table-price">
                    <tr>
                      <th>${data.preis_kurs_label}</th>
                      <td>${data.preis_kurs}</td>
                    </tr>
                    <tr>
                      <th>${data.preis_lehrmittel_label}</th>
                      <td>${data.preis_lehrmittel}</td>
                    </tr>
                    <tr>
                      <th>${data.preis_material_label}</th>
                      <td>${data.preis_material}</td>
                    </tr>
                    <tr>
                      <th>${data.preis_total_label}</th>
                      <td><strong>${data.preis_total}</strong></td>
                    </tr>
                  </table>
                  <p>${data.preis_info}</p>
                  ${data.kantonsbeitrag_label
              ? `
                    <div>
                      <ks-m-system-notification namespace="system-notification-default-" icon-name="Percent" with-icon-background>
                          <div slot="description">
                              <p>${data.kantonsbeitrag_label}</p>
                              <a-link namespace="underline-">
                                  <a href="${data.kantonsbeitrag_link}">${data.kantonsbeitrag_link_label}</a>
                              </a-link>
                          </div>
                      </ks-m-system-notification>
                    </div>
                    `
              : ''
            }   
                </div>
                <div>
                  <h3>
                    <a-icon-mdx namespace="icon-mdx-ks-event-" icon-name="Calendar" size="1.75em" class="icon-right"></a-icon-mdx>
                    <span>${data.termin_label}</span>
                  </h3>
                  <table>
                    <tr>
                      <th>Wochentag</th>
                      <th>Termin</th>
                      <th>Zeit</th>
                    </tr>
                    ${data.termine.reduce((acc, termin) => acc + /* html */`
                    <tr>
                      <td>${termin.wochentaglabel}</td>                
                      <td>${termin.termin}</td>                
                      <td>${termin.start_zeit} - ${termin.ende_zeit}</td>                
                    </tr>
                    `, '')}              
                  </table>
                  <button class="link-more">
                    <span>${data.termine_alle_label}</span>
                    <a-icon-mdx namespace="icon-mdx-ks-event-link-" icon-name="ChevronDown" size="1em" class="icon-right"></a-icon-mdx>
                  </button>
                </div>   
              </div>
          `
          return this.fetchModules([
            {
              path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
              name: 'a-icon-mdx'
            },
            {
              path: `${this.importMetaUrl}../../atoms/heading/Heading.js`,
              name: 'ks-a-heading'
            },
            {
              path: `${this.importMetaUrl}../../molecules/linkList/LinkList.js`,
              name: 'ks-m-link-list'
            },
            {
              path: `${this.importMetaUrl}../../molecules/systemNotification/SystemNotification.js`,
              name: 'ks-m-system-notification'
            },
            {
              path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/link/Link.js`,
              name: 'a-link'
            }
          ])
        })
    }
  }

  get isEventSearch() {
    return this.hasAttribute('event-detail-url') ? this.getAttribute('event-detail-url') : null
  }

  get details() {
    return this.root.querySelector('.details')
  }

  get data() {
    return Event.parseAttribute(this.getAttribute('data'))
  }
}
