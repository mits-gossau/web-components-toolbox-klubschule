// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class OpeningHours
* @type {CustomElementConstructor}
*/
export default class OpeningHours extends Shadow() {
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
    return !this.table
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        table {
            text-align: left;
            width: 100%;
            max-width: var(--opening-hours-width, 320px);
            table-layout: fixed;
            font: var(--mdx-sys-font-fix-body1);
        }
        tr {
            vertical-align: top;
        }
        .opening-hours__day-label {
            width: 50%;
            font: var(--mdx-sys-font-fix-label2);
        }
        .opening-hours__row > th,
        .opening-hours__row > td {
            padding: 0.25rem 0;
        }
        .opening-hours__start-time,
        .opening-hours__end-time {
            width: 3em;
            text-align: right;
        }
        .opening-hours__dash {
            width: auto;
            text-align: center;
        }
    `
  }

  /**
   * Render HTML
   * @returns Promise<void>
   */
  renderHTML () {
    const data = OpeningHours.parseAttribute(this.getAttribute('data'))
    const closedLabel = this.getAttribute('closed-label') || 'closed'
    if (!data) return console.error('Data json attribute is missing or corrupted!', this)

    this.html = /* html */`<table>
        ${data.map(day => {
            return /* html */`
                <tr class="opening-hours__row">
                    <th class="opening-hours__day-label">${day.label}</th>
                    ${
                    !day.open
                        ? /* html */`<td class="opening-hours__start-time">${closedLabel}</td>`
                        : /* html */`
                            <td>
                                <table>
                                    ${day.hours.map(hours => {
                                        const start = hours[0]
                                        const end = hours[1]
                                        return /* html */`
                                            <tr>
                                                <td class="opening-hours__start-time">${start}</td>
                                                <td class="opening-hours__dash">–</td>
                                                <td class="opening-hours__end-time">${end}</td>
                                            </tr>`
                                    }).join('')}
                                </table>
                            </td>`
                    }
                </tr>
            `
        }).join('')}
    </table>`
  }

  get table () {
    return this.root.querySelector('table')
  }
}
