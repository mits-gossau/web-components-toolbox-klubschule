// @ts-check
import Tile from '../../../../components/molecules/event/Event.js'

/**
 * @export
 * @class EventTile
 * @type {CustomElementConstructor}
 */
export default class EventTile extends Tile {
  constructor (options = {}, ...args) {
    super({ ...options }, ...args)
  }

  connectedCallback () {
    super.connectedCallback()
  }

  disconnectedCallback () {
    super.disconnectedCallback()
  }

  renderCSS () {
    super.renderCSS()
    this.css += /* css */`
      :host .top {
        min-height: 48px;
      }
    `
  }

  renderHTML () {
    const warnMandatory = 'data attribute requires: '
    if (!this.data) return console.error('Data json attribute is missing or corrupted!', this)
    const {
      bezeichnung,
      centerid,
      datum_label,
      detail_label_less,
      detail_label_more,
      days,
      icons,
      ist_abokurs_offen,
      kurs_id,
      kurs_typ,
      lektionen_label,
      location,
      buttons,
      parentkey,
      price,
      status,
      status_label,
      zusatztitel,
      state_of_booking,
      logo_url
    } = this.data.course
    debugger
    this.html = /* HTML */`
      <div class="event">
        <div class="top">
          <div class="state-of-booking"><span>${state_of_booking || ''}</span></div>
          <div class="logo">${logo_url ? this.getLogoHTML(logo_url) : ''}</div>
        </div>
        <div class="head">
          <div class="dates">
            <span class="date">${datum_label}</span>
            <div class="time">
              <span class="days">${days.join(', ')}</span>
              ${zusatztitel ? /* html */ `<div class="badge">${zusatztitel}</div>` : ''}
            </div>
          </div>
          <ul class="meta">
            ${status && status > 0 && !(this.isWishList && this.isPassed) ? /* html */`
              <li>
                <div>
                  <a-icon-mdx namespace="icon-mdx-ks-" icon-url="${this.setIconUrl(this.data.course)}" size="1.5em"></a-icon-mdx>
                </div>
                <span>${status_label}</span>
            </li>
            ` : ''}           

            ${location?.name && !(this.isWishList && this.isPassed) ? /* html */ `<li>
              <a-icon-mdx namespace="icon-mdx-ks-event-" icon-name="Location" size="1.5em"></a-icon-mdx>
              <span>${location.name}</span>
            </li>` : ''}
          </ul>      
        </div>
            <div class="controls">
              <div class="controls-left">
              <ks-a-button
                    href="${kurs_id}" 
                    namespace="button-secondary-" 
                    color="secondary"
                  >
                    <span>Details ansehen</span>
                  </ks-a-button>
                  
                  <!--<ks-m-buttons dialog-id="${kurs_id}" status="${status}" course-data='${JSON.stringify(this.data.course).replace(/'/g, '’')}'${this.isWishList ? ' is-wish-list' : ''}></ks-m-buttons>-->
              </div>
            </div>
      </div>
    `

    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      },
      {
        path: `${this.importMetaUrl}../../atoms/buttons/Buttons.js`,
        name: 'ks-a-buttons'
      }
    ])
  }

  renderHTML_old () {
    super.renderHTML().then((data) => {
    })
  }

  getLogoHTML (logoUrl) {
    // TODO: Check inline style
    return `<img src="${logoUrl}" height="auto" width="40" />`
  }
}
