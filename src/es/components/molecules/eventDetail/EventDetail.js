// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Event
* @type {CustomElementConstructor}
*/
export default class EventDetail extends Shadow() {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, mode: 'false', ...options }, ...args)
  }

  connectedCallback() {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
  }

  disconnectedCallback() {
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
      :host {
        display: grid !important;
        grid-template-columns: 1fr 1fr;
        column-gap: 3rem;
        margin: 1.5rem 0;
        width: 100%;
      }
      :host table tr:nth-child(even) {
        background-color: inherit;
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

      :host .link-more span {
        font-size: 1.125rem;
        line-height: 1.25rem;
        font-weight: 500;
        margin-left: 0;
        margin-right: 0.25rem;
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
        padding: 0.5rem 0 0.75rem !important;
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
      :host m-dialog {
        --dialog-left-slide-in-max-width-custom: min(100%, 1020px);
      }
      :host m-dialog + ks-a-button {
        --button-transparent-margin: 0;
        --button-transparent-padding: 0;
      }

      :host .with-border {
        padding: var(--mdx-sys-spacing-fix-3xs);
        background-color: tranparent;
        border: var(--mdx-sys-border-width-default) solid var(--mdx-sys-color-neutral-bold4);
        border-radius: 3px;
      }

      @media only screen and (max-width: _max-width_) {
        :host {
          grid-template-columns: 100%;
          row-gap: 3rem;
          column-gap: 0;
        }
        :host .badge {
          margin-top: 0.625rem;
          margin-left: 0;
        }
      }
    `
  }


  /**
    * renderHTML
    * @returns {Promise<void>} The function `renderHTML` returns a Promise.
  */
  renderHTML() {
    if (!this.data) console.error('Data json attribute is missing or corrupted!', this)
    this.html = /* HTML */ `
      <div class="details-left">
        <div>
          <h3>
            <a-icon-mdx icon-url="../../../../../../../img/icons/event-list.svg" size="1em"></a-icon-mdx>
            <span>${this.data.kursdetail_label}</span>
          </h3>
          <table>
            ${this.data.kursdetails?.reduce((acc, kursDetail) => acc + /* html */ `
              <tr>
                <th>${kursDetail.label}</th>
                <td>${kursDetail.text}</td>
              </tr>
            `, '')}
          </table>
          ${this.data.kurs_zusatzinfo ? /* html */ `<p>${this.data.kurs_zusatzinfo}</p>` : ''}          
        </div>
        ${this.data.location_label && this.data.durchfuehrungaddresse?.beschreibung ? /* html */ `
          <div class="address">
            <h3>
              <a-icon-mdx namespace="icon-mdx-ks-event-" icon-name="Location" size="1em"></a-icon-mdx>
              <span>${this.data.location_label}</span>
            </h3>
            <div>
              <address>
                <a href="${this.data.durchfuehrungaddresse.link}" target="_blank">
                  <span class="description">${this.data.durchfuehrungaddresse.beschreibung}</span>
                  <span>${this.data.durchfuehrungaddresse.strasse}</span>
                  <div>
                    <span>${this.data.durchfuehrungaddresse.plz}</span>
                    <span>${this.data.durchfuehrungaddresse.ort}</span>
                  </div>
                </a>
              </address>
              ${this.data.badge ? /* html */ `<div class="badge">${this.data.badge}</div>` : ''}
            </div>
          </div>
        ` : ''}
        <div>
          <h3>
            <a-icon-mdx namespace="icon-mdx-ks-event-" icon-name="Download" size="1em"></a-icon-mdx>
            <span>${this.data.download_label}</span>
          </h3>
          <ks-m-link-list namespace="link-list-download-">
              <ul>
              ${this.data.downloads.reduce((acc, download) => acc + /* html */`
                <li>
                  <a href="${download.link}">
                      <span>${download.label}</span>
                      <div>
                          <span>${download.link_label}</span>
                          <a-icon-mdx namespace="icon-link-list-" icon-name="Download" size="1.5em" rotate="0"></a-icon-mdx>
                      </div>
                  </a>                
                </li>
              `, '')}
              </ul>
          </ks-m-link-list>
        </div>
      </div>
      <div class="details-right">
        ${this.data.preisinfos?.length ? /* html */ `<div>
          <h3>
            <a-icon-mdx namespace="icon-mdx-ks-event-" icon-name="Wallet" size="1em"></a-icon-mdx>
            <span>${this.data.preis_info_label}</span>
          </h3>
          <table class="table-price">
            ${this.data.preisinfos.reduce((acc, preisinfo) => acc + /* html */ `
              <tr>
                <th>${preisinfo.label}</th>
                <td>${preisinfo.text}</td>
              </tr>
            `, '')}
          </table>
          ${this.data.preis_info ? /* html */ `<p>${this.data.preis_info}</p>` : ''}
          ${this.data.kantonsbeitrag_label ? /* html */ `
              <div>
                <ks-m-system-notification namespace="system-notification-default-" icon-name="Percent" with-icon-background>
                    <div slot="description">
                        <p>${this.data.kantonsbeitrag_label}</p>
                        <a-link namespace="underline-">
                            <a href="${this.data.kantonsbeitrag_link}">${this.data.kantonsbeitrag_link_label}</a>
                        </a-link>
                    </div>
                </ks-m-system-notification>
              </div>
          ` : ''}   
        </div>` : ''}
        ${this.data.termine?.length && this.data.termin_label ? /* html */ `
          <div>
            <h3>
              <a-icon-mdx namespace="icon-mdx-ks-event-" icon-name="Calendar" size="1em"></a-icon-mdx>
              <span>${this.data.termin_label}</span>
            </h3>
            <table>
              <tr>
                <th>${this.data.wochentag_label}</th>
                <th>${this.data.date_label}</th>
                <th>${this.data.uhrzeit_label}</th>
              </tr>
              ${this.data.termine.reduce((acc, termin, index) => acc + (index < 5 ? /* html */ `
                <tr>
                  <td>${termin.wochentaglabel}</td>                
                  <td>${termin.termin}</td>                
                  <td>${termin.start_zeit} - ${termin.ende_zeit}</td>                
                </tr>
              ` : ''), '')}              
            </table>
            ${this.data.termin_alle_label ? /* html */ `
              <button class="link-more">
                <span>${this.data.termin_alle_label}</span>
                <a-icon-mdx namespace="icon-mdx-ks-event-link-" icon-name="ChevronDown" size="1em"></a-icon-mdx>
              </button>
            ` : ''}
          </div>
        ` : ''}
        ${this.data.abo_typen_label && (this.data.abo_typen?.length || this.data.abo_typen_link) ? /* html */ `
          <div>
            <h3>
              <div class="with-border">
                <a-icon-mdx namespace="icon-mdx-ks-event-" icon-name="AboPlus" size="1em"></a-icon-mdx>
              </div>
              <span>${this.data.abo_typen_label}</span>
            </h3>
            ${this.data.abo_typen?.length ? this.data.abo_typen.reduce((acc, aboType) => acc + /* html */ `
              <div>
                <ks-m-system-notification namespace="system-notification-default-" icon-name="${aboType.typ === "H" ? "AboPlus" : "Abo"}" with-icon-background>
                    <div slot="description">
                        <p>${aboType.text}</p>
                        <a-link namespace="underline-">
                            <a href="${aboType.link}">${aboType.link_label}</a>
                        </a-link>
                    </div>
                </ks-m-system-notification>
              </div>
            `, '') : ''}
            ${this.data.abo_typen_link && this.data.abo_typen_link_label ? /* html */ `
              <m-dialog namespace="dialog-left-slide-in-wide-" show-event-name="dialog-open" id="offers-page-filter-categories">
                <!-- overlayer -->
                <div class="container dialog-header" tabindex="0">
                    <div>
                    </div>
                    <h3>Passende Abonnements</h3>
                    <div id="close">
                        <a-icon-mdx icon-name="Plus" size="2em"></a-icon-mdx>
                    </div>
                </div>
                <div class="container dialog-content">
                    <ks-o-tile-list data="{
                      'title': 'Abo-Titel Wert Abo CHF 100.-',
                      'iconTooltip': '',
                      'location': {
                        'name': 'Basel, Luzern, Thun, Zürich-Oerlikon +3',
                        'badge': 'Blended'
                      },
                      'buttons': [{
                        'text': 'Ortsauswahl',
                        'iconName': 'ChevronDown'
                      }],
                      'icons': [
                        {
                          'name': 'Percent',
                          'iconTooltip': ''
                        },
                        {
                          'name': 'Bell',
                          'iconTooltip': ''
                        }
                      ],
                      'price': {
                        'from': 'ab',
                        'amount': 'CHF 100.-',
                        'per': 'Semester'
                      },
                      'buttonMore': {
                        'text': 'Weitere Standorte',
                        'iconName': 'ArrowDownRight'
                      },
                      'tiles': [
                        {
                          'title': 'Title',
                          'iconTooltip': '',
                          'location': {
                            'iconName': 'Location',
                            'name': 'Ort, Straße 123',
                            'badge': 'Blended'
                          },
                          'buttons': [{
                            'text': 'Ortsauswahl',
                            'iconName': 'ArrowRight'
                          }],
                          'icons': [
                            {
                              'name': 'Percent',
                              'iconTooltip': ''
                            },
                            {
                              'name': 'Bell',
                              'iconTooltip': ''
                            }
                          ],
                          'price': {
                            'from': 'ab',
                            'amount': 'Price',
                            'per': 'Semester'
                          }
                        },
                        {
                          'title': 'Title',
                          'iconTooltip': '',
                          'location': {
                            'iconName': 'Location',
                            'name': 'Ort, Straße 123',
                            'badge': 'Blended'
                          },
                          'buttons': [{
                            'text': 'Ortsauswahl',
                            'iconName': 'ArrowRight'
                          }],
                          'icons': [
                            {
                              'name': 'Percent',
                              'iconTooltip': ''
                            },
                            {
                              'name': 'Bell',
                              'iconTooltip': ''
                            }
                          ],
                          'price': {
                            'from': 'ab',
                            'amount': 'Price',
                            'per': 'Semester'
                          }
                        },
                        {
                          'title': 'Title',
                          'iconTooltip': '',
                          'location': {
                            'iconName': 'Location',
                            'name': 'Ort, Straße 123',
                            'badge': 'Blended'
                          },
                          'buttons': [{
                            'text': 'Ortsauswahl',
                            'iconName': 'ArrowRight'
                          }],
                          'icons': [
                            {
                              'name': 'Percent',
                              'iconTooltip': ''
                            },
                            {
                              'name': 'Bell',
                              'iconTooltip': ''
                            }
                          ],
                          'price': {
                            'from': 'ab',
                            'amount': 'CHF 100.-',
                            'per': 'Semester'
                          }
                        },
                        {
                          'title': 'Title',
                          'iconTooltip': '',
                          'location': {
                            'iconName': 'Location',
                            'name': 'Ort, Straße 123',
                            'badge': 'Blended'
                          },
                          'buttons': [{
                            'text': 'Ortsauswahl',
                            'iconName': 'ArrowRight'
                          }],
                          'icons': [
                            {
                              'name': 'Percent',
                              'iconTooltip': ''
                            },
                            {
                              'name': 'Bell',
                              'iconTooltip': ''
                            }
                          ],
                          'price': {
                            'from': 'ab',
                            'amount': 'CHF 100.-',
                            'per': 'Semester'
                          }
                        },
                        {
                          'title': 'Title',
                          'iconTooltip': '',
                          'location': {
                            'iconName': 'Location',
                            'name': 'Ort, Straße 123',
                            'badge': 'Blended'
                          },
                          'buttons': [{
                            'text': 'Ortsauswahl',
                            'iconName': 'ArrowRight'
                          }],
                          'icons': [
                            {
                              'name': 'Percent',
                              'iconTooltip': ''
                            },
                            {
                              'name': 'Bell',
                              'iconTooltip': ''
                            }
                          ],
                          'price': {
                            'from': 'ab',
                            'amount': 'Price',
                            'per': 'Semester'
                          }
                        },
                        {
                          'title': 'Title',
                          'iconTooltip': '',
                          'location': {
                            'iconName': 'Location',
                            'name': 'Ort, Straße 123',
                            'badge': 'Blended'
                          },
                          'buttons': [{
                            'text': 'Ortsauswahl',
                            'iconName': 'ArrowRight'
                          }],
                          'icons': [
                            {
                              'name': 'Percent',
                              'iconTooltip': ''
                            },
                            {
                              'name': 'Bell',
                              'iconTooltip': ''
                            }
                          ],
                          'price': {
                            'from': 'ab',
                            'amount': 'Price',
                            'per': 'Semester'
                          }
                        }
                      ]
                    }"></ks-o-tile-list>
                    <ks-o-tile-list data="{
                      'title': 'Title',
                      'iconTooltip': '',
                      'location': {
                        'name': 'Basel, Luzern, Thun, Zürich-Oerlikon +3',
                        'badge': 'Blended'
                      },
                      'buttons': [{
                        'text': 'Ortsauswahl',
                        'iconName': 'ChevronDown'
                      }],
                      'icons': [
                        {
                          'name': 'Percent',
                          'iconTooltip': ''
                        },
                        {
                          'name': 'Bell',
                          'iconTooltip': ''
                        }
                      ],
                      'price': {
                        'from': 'ab',
                        'amount': 'Price',
                        'per': 'Semester'
                      },
                      'buttonMore': {
                        'text': 'Weitere Standorte',
                        'iconName': 'ArrowDownRight'
                      },
                      'tiles': [
                        {
                          'title': 'Title',
                          'iconTooltip': '',
                          'location': {
                            'iconName': 'Location',
                            'name': 'Ort, Straße 123',
                            'badge': 'Blended'
                          },
                          'buttons': [{
                            'text': 'Ortsauswahl',
                            'iconName': 'ArrowRight'
                          }],
                          'icons': [
                            {
                              'name': 'Percent',
                              'iconTooltip': ''
                            },
                            {
                              'name': 'Bell',
                              'iconTooltip': ''
                            }
                          ],
                          'price': {
                            'from': 'ab',
                            'amount': 'CHF 100.-',
                            'per': 'Semester'
                          }
                        },
                        {
                          'title': 'Title',
                          'iconTooltip': '',
                          'location': {
                            'iconName': 'Location',
                            'name': 'Ort, Straße 123',
                            'badge': 'Blended'
                          },
                          'buttons': [{
                            'text': 'Ortsauswahl',
                            'iconName': 'ArrowRight'
                          }],
                          'icons': [
                            {
                              'name': 'Percent',
                              'iconTooltip': ''
                            },
                            {
                              'name': 'Bell',
                              'iconTooltip': ''
                            }
                          ],
                          'price': {
                            'from': 'ab',
                            'amount': 'Price',
                            'per': 'Semester'
                          }
                        },
                        {
                          'title': 'Title',
                          'iconTooltip': '',
                          'location': {
                            'iconName': 'Location',
                            'name': 'Ort, Straße 123',
                            'badge': 'Blended'
                          },
                          'buttons': [{
                            'text': 'Ortsauswahl',
                            'iconName': 'ArrowRight'
                          }],
                          'icons': [
                            {
                              'name': 'Percent',
                              'iconTooltip': ''
                            },
                            {
                              'name': 'Bell',
                              'iconTooltip': ''
                            }
                          ],
                          'price': {
                            'from': 'ab',
                            'amount': 'Price',
                            'per': 'Semester'
                          }
                        },
                        {
                          'title': 'Title',
                          'iconTooltip': '',
                          'location': {
                            'iconName': 'Location',
                            'name': 'Ort, Straße 123',
                            'badge': 'Blended'
                          },
                          'buttons': [{
                            'text': 'Ortsauswahl',
                            'iconName': 'ArrowRight'
                          }],
                          'icons': [
                            {
                              'name': 'Percent',
                              'iconTooltip': ''
                            },
                            {
                              'name': 'Bell',
                              'iconTooltip': ''
                            }
                          ],
                          'price': {
                            'from': 'ab',
                            'amount': 'CHF 100.-',
                            'per': 'Semester'
                          }
                        },
                        {
                          'title': 'Title',
                          'iconTooltip': '',
                          'location': {
                            'iconName': 'Location',
                            'name': 'Ort, Straße 123',
                            'badge': 'Blended'
                          },
                          'buttons': [{
                            'text': 'Ortsauswahl',
                            'iconName': 'ArrowRight'
                          }],
                          'icons': [
                            {
                              'name': 'Percent',
                              'iconTooltip': ''
                            },
                            {
                              'name': 'Bell',
                              'iconTooltip': ''
                            }
                          ],
                          'price': {
                            'from': 'ab',
                            'amount': 'Price',
                            'per': 'Semester'
                          }
                        },
                        {
                          'title': 'Title',
                          'iconTooltip': '',
                          'location': {
                            'iconName': 'Location',
                            'name': 'Ort, Straße 123',
                            'badge': 'Blended'
                          },
                          'buttons': [{
                            'text': 'Ortsauswahl',
                            'iconName': 'ArrowRight'
                          }],
                          'icons': [
                            {
                              'name': 'Percent',
                              'iconTooltip': ''
                            },
                            {
                              'name': 'Bell',
                              'iconTooltip': ''
                            }
                          ],
                          'price': {
                            'from': 'ab',
                            'amount': 'CHF 100.-',
                            'per': 'Semester'
                          }
                        }
                      ]
                    }"></ks-o-tile-list>
                    <ks-o-tile-list data="{
                      'title': 'Title',
                      'iconTooltip': '',
                      'location': {
                        'name': 'Basel, Luzern, Thun, Zürich-Oerlikon +3',
                        'badge': 'Blended'
                      },
                      'buttons': [{
                        'text': 'Ortsauswahl',
                        'iconName': 'ChevronDown'
                      }],
                      'icons': [
                        {
                          'name': 'Percent',
                          'iconTooltip': ''
                        },
                        {
                          'name': 'Bell',
                          'iconTooltip': ''
                        }
                      ],
                      'price': {
                        'from': 'ab',
                        'amount': 'CHF 100.-',
                        'per': 'Semester'
                      },
                      'buttonMore': {
                        'text': 'Weitere Standorte',
                        'iconName': 'ArrowDownRight'
                      },
                      'tiles': [
                        {
                          'title': 'Title',
                          'iconTooltip': '',
                          'location': {
                            'iconName': 'Location',
                            'name': 'Ort, Straße 123',
                            'badge': 'Blended'
                          },
                          'buttons': [{
                            'text': 'Ortsauswahl',
                            'iconName': 'ArrowRight'
                          }],
                          'icons': [
                            {
                              'name': 'Percent',
                              'iconTooltip': ''
                            },
                            {
                              'name': 'Bell',
                              'iconTooltip': ''
                            }
                          ],
                          'price': {
                            'from': 'ab',
                            'amount': 'CHF 100.-',
                            'per': 'Semester'
                          }
                        },
                        {
                          'title': 'Title',
                          'iconTooltip': '',
                          'location': {
                            'iconName': 'Location',
                            'name': 'Ort, Straße 123',
                            'badge': 'Blended'
                          },
                          'buttons': [{
                            'text': 'Ortsauswahl',
                            'iconName': 'ArrowRight'
                          }],
                          'icons': [
                            {
                              'name': 'Percent',
                              'iconTooltip': ''
                            },
                            {
                              'name': 'Bell',
                              'iconTooltip': ''
                            }
                          ],
                          'price': {
                            'from': 'ab',
                            'amount': 'CHF 100.-',
                            'per': 'Semester'
                          }
                        },
                        {
                          'title': 'Title',
                          'iconTooltip': '',
                          'location': {
                            'iconName': 'Location',
                            'name': 'Ort, Straße 123',
                            'badge': 'Blended'
                          },
                          'buttons': [{
                            'text': 'Ortsauswahl',
                            'iconName': 'ArrowRight'
                          }],
                          'icons': [
                              {
                                'name': 'Percent',
                                'iconTooltip': ''
                              },
                              {
                                'name': 'Bell',
                                'iconTooltip': ''
                              }
                          ],
                          'price': {
                            'from': 'ab',
                            'amount': 'CHF 100.-',
                            'per': 'Semester'
                          }
                        },
                        {
                          'title': 'Title',
                          'iconTooltip': '',
                          'location': {
                            'iconName': 'Location',
                            'name': 'Ort, Straße 123',
                            'badge': 'Blended'
                          },
                          'buttons': [{
                            'text': 'Ortsauswahl',
                            'iconName': 'ArrowRight'
                          }],
                          'icons': [
                              {
                                'name': 'Percent',
                                'iconTooltip': ''
                              },
                              {
                                'name': 'Bell',
                                'iconTooltip': ''
                              }
                          ],
                          'price': {
                            'from': 'ab',
                            'amount': 'CHF 100.-',
                            'per': 'Semester'
                          }
                        },
                        {
                          'title': 'Title',
                          'iconTooltip': '',
                          'location': {
                            'iconName': 'Location',
                            'name': 'Ort, Straße 123',
                            'badge': 'Blended'
                          },
                          'buttons': [{
                            'text': 'Ortsauswahl',
                            'iconName': 'ArrowRight'
                          }],
                          'icons': [
                            {
                              'name': 'Percent',
                              'iconTooltip': ''
                            },
                            {
                              'name': 'Bell',
                              'iconTooltip': ''
                            }
                          ],
                          'price': {
                            'from': 'ab',
                            'amount': 'CHF 100.-',
                            'per': 'Semester'
                          }
                        },
                        {
                          'title': 'Title',
                          'iconTooltip': '',
                          'location': {
                            'iconName': 'Location',
                            'name': 'Ort, Straße 123',
                            'badge': 'Blended'
                          },
                          'buttons': [{
                            'text': 'Ortsauswahl',
                            'iconName': 'ArrowRight'
                          }],
                          'icons': [
                            {
                                'name': 'Percent',
                                'iconTooltip': ''
                            },
                            {
                              'name': 'Bell',
                              'iconTooltip': ''
                            }
                          ],
                          'price': {
                            'from': 'ab',
                            'amount': 'CHF 100.-',
                            'per': 'Semester'
                          }
                        }
                      ]
                    }"></ks-o-tile-list>
                </div>
                <div class="container dialog-footer">
                  <a-button id="close" namespace="button-secondary-" no-pointer-events>Schliessen</a-button>
                </div>
              </m-dialog>
              <ks-a-button
                namespace="button-transparent-"
                request-event-name="dialog-open"
                click-no-toggle-active
              >
                <span>${this.data.abo_typen_link_label}</span>
              </ks-a-button>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `
    return this.fetchModules([
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
        path: `${this.importMetaUrl}../../organisms/tileList/TileList.js`,
        name: 'ks-o-tile-list'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/link/Link.js`,
        name: 'a-link'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/button/Button.js`,
        name: 'a-button'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/molecules/dialog/Dialog.js`,
        name: 'm-dialog'
      },
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

  get badge() {
    return this.root.querySelector('[badge]')
  }

  get data() {
    return EventDetail.parseAttribute(this.getAttribute('data'))
  }
}
