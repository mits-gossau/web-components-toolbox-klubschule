// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/* global CustomEvent */

/**
* @export
* @class CheckoutBookedOffer
* @type {CustomElementConstructor}
*/
export default class CheckoutBookedOffer extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.checkoutConfigurationListener = this.checkoutConfigurationListener.bind(this)
  }

  connectedCallback () {
    // initially set the price configuration, this will be overwritten when the user changes his selection
    this.configurationPriceData = CheckoutBookedOffer.parseAttribute(this.getAttribute('initial-configuration-price-data'))

    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()

    document.body.addEventListener('checkout-configuration', this.checkoutConfigurationListener)

    this.dispatchEvent(new CustomEvent('request-checkout-configuration', {
      bubbles: true,
      cancelable: true,
      composed: true
    }))

    this.mitAnnulationskostenversicherung = this.getAttribute('mit-annulationskostenversicherung') === 'true'
  }

  disconnectedCallback () {
    document.removeEventListener('checkout-configuration', this.checkoutConfigurationListener)
  }

  checkoutConfigurationListener (event) {
    event.detail.fetch.then(priceData => {
      this.configurationPriceData = priceData

      // rerendering the whole component, not ideal but leaves the code cleaner
      // consider refactoring if real performance issues appear
      this.html = ''
      this.renderHTML()
    })

    this.mitAnnulationskostenversicherung = event.detail.withInsurance
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
    return !this.div
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      .checkout-booked-offer {
        max-width: 600px;
      }

      .checkout-booked-offer__name {
        font: var(--mdx-sys-font-fix-label1);
      }

      hr {
        height: 1px;
        border: 0;
        background: var(--mdx-sys-color-neutral-subtle3);
        margin-top: var(--mdx-sys-spacing-flex-large-s);
        margin-bottom: var(--mdx-sys-spacing-flex-large-s);
      }

      .checkout-booked-offer__info-list {
        list-style: none !important;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .checkout-booked-offer__info-list li {
        display: flex;
        flex-direction: row;
        gap: .75rem;
      }

      .checkout-booked-offer__info-list li img {
        height: 1.5rem;
        width: 1.5rem;
      }

      .checkout-booked-offer__info-list li div {
        flex: 1;
      }

      .checkout-booked-offer__info-list li span {
        padding-top: 0.2em;
      }

      .checkout-booked-offer__price-info {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .checkout-booked-offer__price-info-line {
        display: flex;
        justify-content: space-between;
      }

      .checkout-booked-offer__bottom {
        display: flex;
        justify-content: space-between;
      }

      .checkout-booked-offer__total {
        font-family: var(--mdx-sys-font-flex-large-headline3-font-family);
        font-size: var(--mdx-sys-font-flex-large-headline3-font-size);
        font-weight: var(--mdx-sys-font-flex-large-headline3-font-weight);
        letter-spacing: var(--mdx-sys-font-flex-large-headline3-letter-spacing);
        line-height: var(--mdx-sys-font-flex-large-headline3-line-height);
      }

      .checkout-booked-offer__total-price {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.5rem;
      }

      .checkout-booked-offer__total-desc {
        color: var(--mdx-sys-color-neutral-bold1);
        font: var(--mdx-sys-font-fix-body3);
      }
    `
  }

  /**
   * Render HTML
   * @returns Promise<void>
   */
  renderHTML () {
    const headline = this.getAttribute('headline')
    const name = this.getAttribute('name')
    const date = this.getAttribute('date')
    const time = this.getAttribute('time')
    const street = this.getAttribute('street')
    const city = this.getAttribute('city')
    const coursePrice = this.getAttribute('course-price')
    const priceData = this.configurationPriceData
    const totalPrice = priceData?.totalPreis

    this.html = /* HTML */ `
        <div class="checkout-booked-offer">
          <ks-a-heading tag="h3">${headline}</ks-a-heading>
          <h4 class="checkout-booked-offer__name">${name}</h4>
          <ul class="checkout-booked-offer__info-list">
            ${this.statusData
              ? `<li>
                  <img src="${this.statusData.iconPath}" />
                  <span>${this.statusData.label}</span>
                </li>`
              : ''
            }
            ${date
              ? `<li>
                  <a-icon-mdx icon-name="Calendar" size="1.5rem"></a-icon-mdx>
                  <span>
                    ${date}<br />
                    ${time}
                  </span>
                </li>`
              : ''
            }
            ${city
              ? `<li>
                  <a-icon-mdx icon-name="Location" size="1.5rem"></a-icon-mdx>
                  <span>
                    ${street}<br />
                    ${city}
                  </span>
                </li>`
              : ''
            }
            <li>
              <a-icon-mdx icon-name="Wallet" size="1.5rem"></a-icon-mdx>
              ${/* Price Data Configuration */
                priceData
                  ? /* html */`
                    <div class='checkout-booked-offer__price-info'>
                      <div class='checkout-booked-offer__price-info-line'>
                        <span><a-translation data-trans-key='Checkout.CoursePrice' /></span>
                        <span>${coursePrice}</span>
                      </div>
                      <div class='checkout-booked-offer__price-info-line'>
                        <span><a-translation data-trans-key='Checkout.Lehrmittel' /></span>
                        <span>${priceData.lehrmittelPreis}</span>
                      </div>
                      <div class='checkout-booked-offer__price-info-line'>
                        <span><a-translation data-trans-key='Checkout.Material' /></span>
                        <span>${priceData.materialPreis}</span>
                      </div>
                      ${this.mitAnnulationskostenversicherung
                        ? /* html */`
                          <div class='checkout-booked-offer__price-info-line'>
                            <span><a-translation data-trans-key='Checkout.Annulationskostenversicherung' /></span>
                            <span>${priceData.annulationskostenversicherungPreis}</span>
                          </div>`
                        : ''
                      }
                    </div>`
                  : ''}
            </li>
          </ul>
          <hr />
          <div class="checkout-booked-offer__bottom">
            <span class="checkout-booked-offer__total">
              <a-translation data-trans-key="Checkout.Total"></a-translation>
            </span>
            <div class="checkout-booked-offer__total-price">
              <span class="checkout-booked-offer__total">${totalPrice}</span>
              <span class="checkout-booked-offer__total-desc"><a-translation data-trans-key="Checkout.Tax"></a-translation></span>
            </div>
          </div>
        </div>
      `
    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/organisms/grid/Grid.js`,
        name: 'o-grid'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      },
      {
        path: `${this.importMetaUrl}../../atoms/heading/Heading.js`,
        name: 'ks-a-heading'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/translation/Translation.js`,
        name: 'a-translation'
      }
    ])
  }

  get div () {
    return this.root.querySelector('div')
  }

  get statusData () {
    const status = CheckoutBookedOffer.parseAttribute(this.getAttribute('status'))
    if (!status.code) return null
    let iconName = ''
    if (status.code === '1') {
      iconName = 'garanteed'
    } else if (status.code === '2') {
      iconName = 'started'
    } else if (status.code === '3') {
      iconName = 'await'
    } else if (status.code === '4') {
      iconName = 'almost'
    }

    return {
      label: status.label,
      iconPath: `${this.importMetaUrl}../../../../img/icons/event-state-${iconName}.svg`
    }
  }
}
