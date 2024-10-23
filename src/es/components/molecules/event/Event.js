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
          this.root.querySelector('.more.show').classList.remove('show')
          this.root.querySelector('.less').classList.add('show')
        } else {
          this.icon.setAttribute('icon-name', 'ChevronDown')
          this.root.querySelector('.less.show').classList.remove('show')
          this.root.querySelector('.more').classList.add('show')
        }
      }

      this.renderDetails()
      this.details.classList.toggle('details-expanded')
    }
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()

    this.icon = this.root.querySelector('a-icon-mdx[icon-name="ChevronDown"]')
    this.toggle = this.root.querySelector('.expand')

    if (this.toggle) this.toggle.addEventListener('click', this.clickEventListener)
  }

  disconnectedCallback () {
    if (this.toggle) this.toggle.removeEventListener('click', this.clickEventListener)
  }

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
    return !this.root.querySelector('.event')
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host ks-m-badge {
        --button-badge-padding: 4px;
      }
      :host .event {
        display: flex;
        flex-direction: column;

        background-color: var(--mdx-base-color-grey-0);
        border: 0.063rem solid var(--mdx-base-color-grey-700);
        padding: 1.5rem;
        color: var(--mdx-base-color-grey-975);
      }

      :host .event.passed {
        background-color: var(--m-gray-100);
        padding: 1.5rem 1.5rem 0;
      }

      :host .event.passed .head,
      :host .event.passed .details {
        opacity: 0.5;
      }

      :host .event .dates {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      :host .event.wishlist .dates a-button {
        width: fit-content;
      }

      :host .head {
        display: grid;
        grid-template-columns: 1fr 1fr;
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
        flex-wrap: wrap;
        flex-direction: row;
        align-items: center;
        gap: 0.625rem;
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
        height: 1.125rem;
      }

      :host .meta {
        display: flex;
        flex-direction: column;
        list-style: none;
        margin: 0;
        padding: 0;
        gap: 1rem;
      }

      :host .meta li {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      :host .meta li div {
        height: 1.5rem;
        width: 1.5rem;
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      :host .meta li:last-of-type {
        margin-top: auto;
      }

      :host .meta span {
        font-size: 1rem;
        line-height: 1.25rem;
        margin-left: 0.75rem;
      }

      :host .link-more {
        font-family: var(--font-family);
        display: flex;
        flex-direction: row;
        align-items: center;
        border: none;
        background-color: transparent;
        color: var(--mdx-sys-color-primary-default);
        margin: 0;
        padding: 0;
        margin-top: auto;
        cursor: pointer;
        text-decoration: none;
      }

      :host .link-more a-icon-mdx {
        color: var(--mdx-sys-color-primary-default);
      }

      :host .meta li .link-more {
        margin-top: 0;
      }

      :host .link-more,
      :host .link-more span {
        --button-transparent-padding: 0;
        --button-transparent-font-size: 1.125rem;
        --button-transparent-line-height: 1.25rem;
        --button-transparent-font-weight: 500;
        font-size: var(--button-transparent-font-size);
        line-height: var(--button-transparent-line-height);
        font-weight: var(--button-transparent-font-weight);
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
        gap: 1rem;
      }

      :host .controls-left a-icon-mdx, :host .controls-passed__left a-icon-mdx {
        color: var(--mdx-sys-color-primary-default);
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
        gap: 0.5em;
      }
      
      :host ks-m-badge a-icon-mdx {
        color: var(--icon-box-color);
      }

      :host .price {
        font-size: 0.875rem;
        line-height: 0.9375rem;
        font-weight: 500;
        padding-left: 0.75rem;
      }
      
      :host .price strong {
          font-family: var(--mdx-sys-font-flex-large-headline3-font-family);
          font-size: var(--mdx-sys-font-flex-large-headline3-font-size);
          line-height: var(--mdx-sys-font-flex-large-headline3-line-height);
          font-weight: var(--mdx-sys-font-flex-large-headline3-font-weight);   
      }

      :host .details {
        display: none;
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

      :host table + p,
      :host table + ul {
        color: var(--mdx-sys-color-neutral-default);
        font: var(--mdx-sys-font-fix-body2);
        margin: 1rem 0 0;
      }

      :host table + ul {
        padding-left: 1rem;
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
        color: var(--mdx-sys-color-primary-default);
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

      :host .event-loading-bar {
        display: block;
        padding: 1rem 0;
      }

      :host .controls-passed__message {
        font: var(--mdx-sys-font-flex-large-headline3);
      }

      :host .controls-passed__button-wrapper {
        display: flex;
        gap: 0.75rem;
      }

      :host .controls-passed {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 1.5rem;
        border-top: 1px solid var(--m-gray-300);
        background-color: var(--m-white);
        margin-left: -1.5rem;
        margin-right: -1.5em;
        opacity: 1;
        width: auto;
      }
      :host .controls-passed__left {
        display: flex;
        align-items: center;
        gap: 2rem;
      }

      @media only screen and (max-width: _max-width_) {
        :host .event {
          padding: 1rem 0.5rem;
        }

        :host .event.passed {
          padding: 1rem 0.5rem 0;
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
          flex-direction: column-reverse;
        }

        :host .date {
          font-size: 1.25rem;
          line-height: 1.375rem;
        }
  
        :host .time {
          flex-direction: column;
          align-items: flex-start;
        }
  
        :host .days {
          font-size: 1.25rem;
          line-height: 1.375rem;
        }
  
        :host .badge {
          margin-top: 0.625rem;
          margin-left: 0;
        }

        :host .controls-passed {
          flex-direction: column;
          padding: var(--mdx-sys-spacing-fix-s) var(--mdx-sys-spacing-fix-2xs);
          margin-left: -0.5rem;
          margin-right: -0.5rem;
          gap: 1rem;
        }

        :host .controls-passed__left {
          width: 100%;
          gap: 0;
          justify-content: space-between;
        }
        
        :host .controls-passed__message {
          font: var(--mdx-sys-font-flex-large-headline3);
          width: 100%;
        }

        :host .controls-left {
          justify-content: flex-end;
          margin-top: 2rem;
          width: 100%;
        }

        :host .wishlist .controls-left ks-m-buttons {
          margin-left: auto;
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
      zusatztitel
    } = this.data.course
    // don't wait for fetchModules to resolve if using "shouldRenderHTML" checks for this.badge it has to be sync
    // NOTE: the replace ".replace(/'/g, '’')" avoids the dom to close the attribute string unexpectedly. This replace is also ISO 10646 conform as the character ’ (U+2019) is the preferred character for apostrophe. See: https://www.cl.cam.ac.uk/~mgk25/ucs/quotes.html + https://www.compart.com/de/unicode/U+2019
    const offerButton = buttons?.length ? buttons.find(({ event }) => event === 'offerlink') : null

    this.html = /* HTML */`
      <div class="event${this.isWishList ? " wishlist" : ""}${this.isWishList && this.isPassed ? " passed" : ""}">
        <div class="head">
          <div class="dates">
            ${this.isWishList
              ? /* HTML */`
                <span class="date">${bezeichnung}</span>
                <div class="time">
                  <span class="days">${datum_label}</span>
                </div>
              `
              : /* HTML */`<span class="date">${datum_label}</span>`
            }
            <div class="time">
              <span class="days">${days.join(', ')}</span>
              ${zusatztitel ? /* html */ `<div class="badge">${zusatztitel}</div>` : ''}
            </div>
            ${this.isWishList && !this.isPassed && offerButton ? /* html */ `
              <a-button
                class="link-more"
                namespace="button-transparent-"
                href="${offerButton.link}"
                click-no-toggle-active
                icon-right="ArrowRight"
              >
                <span>${offerButton.text}</span>
                <a-icon-mdx icon-name="ArrowRight" size="1em"></a-icon-mdx>
              </a-button>
            ` : ''}
          </div>
          <ul class="meta">
            ${status && status > 0 && !(this.isWishList && this.isPassed) ? /* html */`<li>
              <div>
                <a-icon-mdx namespace="icon-mdx-ks-" icon-url="${this.setIconUrl(this.data.course)}" size="1.5em"></a-icon-mdx>
              </div>
              <span>${status_label}</span>
            </li>` : ''}
            ${lektionen_label && !(this.isWishList && this.isPassed) ? /* html */ `<li>
              <a-icon-mdx namespace="icon-mdx-ks-" icon-url="../../../../../../../img/icons/event-list.svg" size="1.5em"></a-icon-mdx>
              <span>${lektionen_label}</span>
            </li>` : ''}
            ${location?.name && !(this.isWishList && this.isPassed) ? /* html */ `<li>
              <a-icon-mdx namespace="icon-mdx-ks-event-" icon-name="Location" size="1.5em"></a-icon-mdx>
              <span>${location.name}</span>
            </li>` : ''}
            ${!(this.isWishList && this.isPassed) ? /* html */ `<li>
              <button class="link-more expand">
                <span class="more show">${this, detail_label_more}</span>
                <span class="less">${this, detail_label_less}</span>
                <a-icon-mdx namespace="icon-mdx-ks-event-link-" icon-name="ChevronDown" size="1em"></a-icon-mdx>
              </button>
            </li>` : ''}
          </ul>      
        </div>
        <div class="details">
          
        </div>
        <ks-c-checkout-overlay>
          ${this.isWishList && this.isPassed ? '' : /* html */ `
            <div class="controls">
              <div class="controls-left">
                ${this.isWishList && !this.isPassed ? /* html */`<a-icon-mdx namespace="icon-mdx-ks-" icon-name="Trash" size="1em" request-event-name="remove-from-wish-list" course="${kurs_typ}_${kurs_id}_${centerid}"></a-icon-mdx>` : ''}
                ${!ist_abokurs_offen && !this.isPassed? /* html */ `
                  <ks-m-buttons dialog-id="${kurs_id}" status="${status}" course-data='${JSON.stringify(this.data.course).replace(/'/g, '’')}'${this.isWishList ? " is-wish-list" : ""}></ks-m-buttons>
                ` : ''}
              </div>
              <div class="controls-right">
                <div class="icons">
                  ${icons?.length ? icons.reduce((acc, icon) => acc + /* html */ `
                    <ks-m-tooltip mode="false" namespace="tooltip-right-" text="${icon.text?.replaceAll('"', "'")}">
                      <ks-m-badge type="primary" icon-name="${icon.iconName || icon.name}">
                      </ks-m-badge>
                    </ks-m-tooltip>
                  `, '') : ''}
                </div>
                <span class="price">${price?.pre ? price?.pre + ' ' : ''}<strong>${price?.amount || ''}</strong>${price?.per ? ' / ' + price?.per : ''}</span>
              </div>
            </div>
          `}
          ${this.isWishList && this.isPassed ? /* html */ `
            <div class="controls controls-passed">
              <span class="controls-passed__message">${this.getAttribute("passed-message")}</span>
              <div class="controls-passed__left">
                <a-icon-mdx namespace="icon-mdx-ks-" icon-name="Trash" size="1em" request-event-name="remove-from-wish-list" course="${kurs_typ}_${kurs_id}_${centerid}"></a-icon-mdx>
                ${buttons[0]?.text ? /* html */ `
                  <ks-a-button href="${buttons[0].link}" namespace="button-secondary-" color="secondary">
                    <span>${buttons[0].text || warnMandatory + 'passed.button.text'}</span>
                  </ks-a-button>
                ` : ''}
              </div>
            </div>
          ` : ''}
        </ks-c-checkout-overlay>
      </div>
    `

    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/link/Link.js`,
        name: 'a-link'
      },
      {
        path: `${this.importMetaUrl}../../controllers/checkoutOverlay/CheckoutOverlay.js`,
        name: 'ks-c-checkout-overlay'
      },
      {
        path: `${this.importMetaUrl}../../molecules/buttons/Buttons.js`,
        name: 'ks-m-buttons'
      },
      {
        path: `${this.importMetaUrl}../../molecules/badge/Badge.js`,
        name: 'ks-m-badge'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/button/Button.js`,
        name: 'a-button'
      },
      {
        path: `${this.importMetaUrl}../../molecules/tooltip/Tooltip.js`,
        name: 'ks-m-tooltip'
      }
    ])
  }

  /**
   * Set icon path deepending on state
   * @param {*} data
   * @returns icon path
   */
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

  /**
    * renderDetails
  */
  async renderDetails () {
    if (!this.details.children.length) {
      this.fetchModules([
        {
          path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/loading/Loading.js`,
          name: 'a-loading'
        },
        {
          path: `${this.importMetaUrl}../../molecules/eventDetail/EventDetail.js`,
          name: 'ks-m-event-detail'
        },
        {
          path: `${this.importMetaUrl}../../../../css/web-components-toolbox-migros-design-experience/src/es/components/organisms/MdxComponent.js`,
          name: 'mdx-component'
        }
      ])
      this.details.classList.add('loading')
      this.details.innerHTML = '<mdx-component class="event-loading-bar"><mdx-loading-bar></mdx-loading-bar></mdx-component>'
      if (this.hasAttribute('mock')) {
        this.details.innerHTML = /* html */`
          <ks-m-event-detail
            data='${this.mockData}'
          ></ks-m-event-detail>
        `
        return
      }

      new Promise(resolve => this.dispatchEvent(new CustomEvent('request-event-detail', {
        detail: {
          resolve,
          language: this.data.course.language || this.data.sprachid,
          typ: this.data.course.typ || this.data.course.kurs_typ,
          id: this.data.course.id || this.data.course.kurs_id,
          center_id: this.data.course.center_id || this.data.course.centerid
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }))).then((data) => {
        // GTM Tracking of Click on More Details
        // @ts-ignore
        if (typeof window !== 'undefined' && window.dataLayer) {
            try {
              // @ts-ignore
              window.dataLayer.push(
                {
                  'event': 'view_item',
                  'ecommerce': {    
                    'items': [{ 
                      'item_name': `${data.bezeichnung}`,                
                      'item_id': `${data.kurs_typ}_${data.kurs_id}`, 
                      'price': data.preis_total,
                      'quantity': 1,
                      'item_variant': `${data.location?.center ? data.location.center : ''}`,
                      'currency': 'CHF',       
                    }]
                  }
                }
              )
            } catch (err) {
              console.error('Failed to push event data:', err)
            }
        }

        this.details.classList.remove('loading')

        // NOTE: the replace ".replace(/'/g, '’')" avoids the dom to close the attribute string unexpectedly. This replace is also ISO 10646 conform as the character ’ (U+2019) is the preferred character for apostrophe. See: https://www.cl.cam.ac.uk/~mgk25/ucs/quotes.html + https://www.compart.com/de/unicode/U+2019
        this.details.innerHTML = /* html */ `
          <ks-m-event-detail
            data='${JSON.stringify(data).replace(/'/g, '’')}'
          ></ks-m-event-detail>
        `
      })
    }
  }

  get details () {
    return this.root.querySelector('.details')
  }

  get isWishList () {
    return this.hasAttribute("is-wish-list")
  }

  get data () {
    return JSON.parse(this.getAttribute('data'))
  }

  get isPassed () {
    return this.hasAttribute('is-passed')
  }

  get mockData () {
    return `{
      "preis_info": "Ich bin die Preis Info",
      "zusatztitel": "Blended",
      "termine": [
        {
          "wochentag": 1,
          "termin": "2024-03-04",
          "start_zeit": "19:00",
          "ende_zeit": "21:50",
          "wochentaglabel": "Mo"
        },
        {
          "wochentag": 1,
          "termin": "2024-03-11",
          "start_zeit": "19:00",
          "ende_zeit": "21:50",
          "wochentaglabel": "Mo"
        },
        {
          "wochentag": 1,
          "termin": "2024-03-18",
          "start_zeit": "19:00",
          "ende_zeit": "21:50",
          "wochentaglabel": "Mo"
        },
        {
          "wochentag": 1,
          "termin": "2024-03-25",
          "start_zeit": "19:00",
          "ende_zeit": "21:50",
          "wochentaglabel": "Mo"
        },
        {
          "wochentag": 1,
          "termin": "2024-04-08",
          "start_zeit": "19:00",
          "ende_zeit": "21:50",
          "wochentaglabel": "Mo"
        },
        {
          "wochentag": 1,
          "termin": "2024-04-15",
          "start_zeit": "19:00",
          "ende_zeit": "21:50",
          "wochentaglabel": "Mo"
        },
        {
          "wochentag": 1,
          "termin": "2024-04-22",
          "start_zeit": "19:00",
          "ende_zeit": "21:50",
          "wochentaglabel": "Mo"
        },
        {
          "wochentag": 1,
          "termin": "2024-04-29",
          "start_zeit": "19:00",
          "ende_zeit": "21:50",
          "wochentaglabel": "Mo"
        },
        {
          "wochentag": 1,
          "termin": "2024-05-06",
          "start_zeit": "19:00",
          "ende_zeit": "21:50",
          "wochentaglabel": "Mo"
        }
      ],
      "kurs_zusatzinfo": "Vitae proin tellus phasellus in duis eu libero sed cursus. In vehicula placerat sed duis luctus malesuada pellentesque eu sed. Augue in lorem consequat rhoncus lectus sed commodo. Orci pellentesque etiam dui faucibus euismod neque. Commodo quis fringilla purus eu.",
      "durchfuehrungaddresse": {
        "plz": "8132",
        "ort": "Zürich",
        "strasse": "Teststraße 12",
        "beschreibung": "Beschreibung",
        "gebaeude_id": null,
        "link": "#"
      },
      "durchfuehrung_sprache": 0,
      "kursdetail_label": "Kursdetails",
      "location_label": "Durchführungsort",
      "termin_label": "Termine",
      "preis_info_label": "Preisinfos",
      "download_label": "Downloads",
      "wochentag_label": "Wochentag",
      "uhrzeit_label": "Zeit",
      "termin_alle_label": "Alle Termine anzeigen",
      "kantonsbeitrag_label": "Teilnehmende profitieren von einer Vergünstigung (siehe Zusatzinfos). Preis je nach Höhe der Subvention ab CHF 22’900.00.",
      "kantonsbeitrag_link": "#",
      "kantonsbeitrag_link_label": "Kantonsbeitrag Link Label",
      "preisinfos": [
        {
          "id": 1,
          "label": "Kursgeld",
          "text": "1980.00 CHF",
          "tooltip_titel": "",
          "tooltip_text": ""
        },
        {
          "id": 2,
          "label": "Lehrmittel",
          "text": "lontano 60.80 CH",
          "tooltip_titel": "Lehrmittelauswahl",
          "tooltip_text": "Mit der Anmeldung wählen Sie Ihr gewünschtes Lehrmittel (Buch, E-Book, Bundle) aus."
        },
        {
          "id": 4,
          "label": "Total (inkl. allfälliger MwSt.)",
          "text": "1980.00 CHF",
          "tooltip_titel": "",
          "tooltip_text": ""
        }
      ],
      "downloads": [
        {
          "label": "Angebotsdetails",
          "link_label": "PDF",
          "link": "/Umbraco/Api/CourseApi/pdf?lang=&typ=&id=0&center_id=0"
        },
        {
          "label": "Zweiter Link",
          "link_label": "Word",
          "link": "/Umbraco/Api/CourseApi/pdf?lang=&typ=&id=0&center_id=0"
        }
      ],
      "kursdetails": [
        {
          "label": "Kurs/Lehrgang",
          "text": "Kurs1"
        },
        {
          "label": "Kurs Nr",
          "text": "123123123"
        },
        {
          "label": "Kurssprache",
          "text": "Deutsch"
        },
        {
          "label": "max. Teilnehmer",
          "text": "12"
        },
        {
          "label": "Dauer",
          "text": "12 Tage"
        }
      ],
      "abo_typen_label": "Abo Typen Label",
      "abo_typen": [
        {
          "text": "Sport Abo Premium: Lorem ipsum, dolor sit amet consectetur adipisicing elit. Esse, deserunt dolorem. Hic error atque in doloremque ex.",
          "link": "#",
          "link_label": "Link Label"
        }
      ],
      "abo_typen_link_label": "Passende Abonnements finden",
      "abo_typen_link": "https://dev.klubschule.ch/Umbraco/Api/CourseApi/Abonnement?lang=d&typ=6A&id=10375&center_id=10375"
    }
    `
  }
}
