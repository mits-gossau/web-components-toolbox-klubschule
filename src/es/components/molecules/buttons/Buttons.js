// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Buttons
* @type {CustomElementConstructor}
*/
export default class Buttons extends Shadow() {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
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
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML() {
    return !this.root.querySelector('.buttons-container')
  }

  /**
   * renders the css
   */
  renderCSS() {
    this.css = /* css */`
      :host .buttons-container {
        --border-color-secondary: var(--button-secondary-border-color, var(--color-secondary));
        display: flex;
        gap: 1rem;
      }

      :host m-dialog {
        margin-right: -1rem; /* to compensate the gap */
      }

      :host m-dialog {
        --button-primary-width: 100%;
        --button-secondary-width: 100%;
      }

      .hidden {
        display: none;
      }

      @media only screen and (max-width: _max-width_) {
        :host .dialog-footer ks-a-button {
          --button-primary-width: 100%;
          --button-secondary-width: 100%;
          text-align: center;
        }

        :host .buttons-container {
          justify-content: space-between;
          width: 100%
        }
        :host:has(.buttons-container ks-m-favorite-button + ks-a-button) {
          width: 100%;
        }
      }
    `
    return this.fetchTemplate()
  }

  /**
   * fetches the template
   */
  fetchTemplate() {
    /** @type {import("../../web-components-toolbox/src/es/components/prototypes/Shadow.js").fetchCSSParams[]} */
    const styles = [
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/reset.css`, // no variables for this reason no namespace
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: true
      }
    ]
    switch (this.getAttribute('namespace')) {
      case 'buttons-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles])
      default:
        return this.fetchCSS(styles)
    }
  }

  /**
   * Render HTML
   * @returns void
   */
  renderHTML() {
    this.data = JSON.parse(this.getAttribute('course-data')) || {}
    // @ts-ignore
    const dataButtons = this.data?.buttons?.length ? this.data.buttons : JSON.parse(this.getAttribute('data-buttons')) || [{}]
    const hasButtons = dataButtons.length === 1 && Object.keys(dataButtons[0]).length === 0 ? false : true
    const filteredDataButtons = dataButtons.filter(({ event }) => event !== 'offerlink')
    const optionalBigAttr = this.hasAttribute('big') ? 'big' : ''
    const optionalSmallAttr = this.hasAttribute('small') ? 'small' : ''

    // keep existing url params
    let filteredURLParams = ''
    const shouldKeepURLParams = this.hasAttribute('keep-url-params') && !this.hasAttribute('is-info-events')
    if (shouldKeepURLParams) {
      const urlParams = this.hasAttribute('keep-url-params') ? window.location.search : ''
      const urlParamsMap = new URLSearchParams(urlParams)
      const urlParamsArray = Array.from(urlParamsMap.keys())
      
      // TODO: keys to ignore should be moved to .env file
      const ignoreURLKeys = [
        'rootFolder', 'css', 'login', 'logo', 'nav', 'footer', 'content', // existing fe dev keys
        'sorting', 'sort', // ignore sorting keys
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id', 'utm_source_platform', 'utm_creative_format', 'utm_marketing_tactic', 'xpmld', 'xpcld'
      ] // GA parameters

      const filteredURLKeys = urlParamsArray.filter(key => !ignoreURLKeys.includes(key))
      filteredURLParams = filteredURLKeys.map(key => `${key}=${urlParamsMap.get(key)}`).join('&').split(" ").join("+")

      // for button link: center check of filtered params and replace value with current this.data.centerid 
      const centerFilterKey = ['center', 'centre', 'centro'].find(key => urlParamsArray.includes(key))
      const centerFilterValue = centerFilterKey ? urlParamsMap.get(centerFilterKey) : ''
      if (centerFilterKey && centerFilterValue?.includes(this.data.centerid)) {
        const centerFilterIndex = filteredURLParams.indexOf(centerFilterKey)
        if (centerFilterIndex > -1) {
          const centerFilterValueIndex = filteredURLParams.indexOf(centerFilterValue)
          if (centerFilterValueIndex > -1) {
            filteredURLParams = filteredURLParams.replace(centerFilterValue, this.data.centerid)
          }
        }
      }
    }

    const buttons = filteredDataButtons?.reduce((acc, button) => {
      // keep existing url params
      if (shouldKeepURLParams && button.link && filteredURLParams.length > 0) {
        if (button.link.includes('?')) {
          button.link = button.link + '&' + filteredURLParams
        } else {
          button.link = button.link + '?' + filteredURLParams
        }
      }

      if (button.event?.includes('AdvisoryText')) {
        this.dialogId = this.getAttribute("dialog-id") || 0
        const parentDiv = document.createElement("div")

        this.overLayButton = document.createElement("ks-a-button")
        this.overLayButton.setAttribute("namespace", "button-primary-")
        this.overLayButton.setAttribute("color", "secondary")
        this.overLayButton.setAttribute("request-event-name", `request-advisory-text-api`)
        this.overLayButton.setAttribute("click-no-toggle-active", "")
        this.overLayButton.innerHTML = button.text

        this.addEventListener(`request-advisory-text-api`, () => this.openDialogOverlay(button))
        parentDiv.appendChild(this.overLayButton)

        return acc + parentDiv.innerHTML
      }
      const isBookMarkButton = button.event === 'bookmark'
      const bookMarkButton = isBookMarkButton ? /* html */ `<ks-m-favorite-button course="${this.data.kurs_typ}_${this.data.kurs_id}_${this.data.centerid}" button-typ="${button.typ ? 'button-' + button.typ + '-' : 'button-secondary-'}" ${optionalSmallAttr} course-data='${JSON.stringify(this.data).replace(/'/g, '’')}'></ks-m-favorite-button>` : ''
      const content = button.event === 'bookmark' ? bookMarkButton :  /* html */`
        <ks-a-button 
          ${button.iconName && !button.text ? 'icon' : ''} 
          namespace="${button.typ ? 'button-' + button.typ + '-' : 'button-secondary-'}" 
          color="secondary" 
          ${button.link ? `href=${button.link}` : ''}
          ${optionalBigAttr} 
          ${optionalSmallAttr}
        >
          ${button.text ? '<span>' + button.text + '</span>' : ''}
          ${button.iconName && !button.text ? `<a-icon-mdx icon-name="${button.iconName}" size="1em"></a-icon-mdx>` : ''} 
          ${button.iconName && button.text ? `<a-icon-mdx namespace="icon-mdx-ks-" icon-name="${button.iconName}" size="1em" class="icon-right"></a-icon-mdx>` : ''}
        </ks-a-button>
      `
      return acc + (
        (this.hasAttribute('is-tile') || this.hasAttribute('is-abo')) && !isBookMarkButton ?  /* html */ `
          <ks-c-gtm-event 
            listen-to="click"
            event-data='{
              "event": "${this.hasAttribute('is-abo') ? 'add_to_cart' : 'select_item'}",
              "ecommerce": {    
                "items": [{ 
                  "item_name": "${this.hasAttribute('parent-title') && !this.hasAttribute('sort-nearby') ? this.getAttribute('parent-title') : this.data.title || this.data.bezeichnung || 'No Title'}",                
                  "item_id": "${this.getItemId(this.data)}",
                  "price": ${this.data.price?.oprice || this.data.price?.price || this.data.preis_total || 0},
                  "item_variant": "${this.data.location?.center ? this.data.location.center : this.data.center ? this.data.center.bezeichnung_internet : ''}",
                  ${this.data.spartename?.[0] ? `"item_category": "${this.data.spartename[0]}",` : ''}
                  ${this.data.spartename?.[1] ? `"item_category2": "${this.data.spartename[1]}",` : ''}
                  ${this.data.spartename?.[2] ? `"item_category3": "${this.data.spartename[2]}",` : ''}
                  ${this.data.spartename?.[3] ? `"item_category4": "${this.data.spartename[3]}",` : ''}
                  "quantity": 1
                }]
              }
            }'
        >
            ${content}
          </ks-c-gtm-event>
        ` : content
      )
    }, '')

    this.html = hasButtons ? /* html */`
      <div class="buttons-container">
        ${buttons}
      </div>
    ` : ''

    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/molecules/dialog/Dialog.js`,
        name: 'm-dialog'
      },
      {
        path: `${this.importMetaUrl}../../atoms/button/Button.js`,
        name: 'ks-a-button'
      },
      {
        path: `${this.importMetaUrl}../../atoms/spacing/Spacing.js`,
        name: 'ks-a-spacing'
      },
      {
        path: `${this.importMetaUrl}../../molecules/favoriteButton/FavoriteButton.js`,
        name: 'ks-m-favorite-button'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/translation/Translation.js`,
        name: 'a-translation'
      },
      {
        path: `${this.importMetaUrl}../../controllers/gtmEvent/GtmEvent.js`,
        name: 'ks-c-gtm-event'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ])
  }

  openDialogOverlay(button) {
    // GTM Tracking of Click Register now
    this.dataLayerPush({
      'event': 'add_to_cart',
      'ecommerce': {    
        'items': [{ 
          // @ts-ignore
          'item_name': `${this.data.bezeichnung}`,                
          // @ts-ignore
          'item_id': `${this.getItemId(this.data)}`, 
          // @ts-ignore
          'price': this.data.price.oprice || this.data.price.price,
          'item_category': `${this.data.spartename?.[0] || ''}`,
          'item_category2': `${this.data.spartename?.[1] || ''}`,
          'item_category3': `${this.data.spartename?.[2] || ''}`,
          'item_category4': `${this.data.spartename?.[3] || ''}`,
          'quantity': 1,
          'item_variant':`${this.data.location?.center ? this.data.location.center : this.data.center ? this.data.center.bezeichnung_internet : ''}`,
          'currency': 'CHF'
        }]
      }
    })
    // for local testing add `https://dev.klubschule.ch${button.event}` to the checkoutOverlayAPI
    new Promise(resolveCheckout => {
      this.dispatchEvent(new CustomEvent(`checkout-overlay-api`, {
        detail: {
          resolveCheckout,
          checkoutOverlayAPI: `${button.event}`
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }))
    }).then((data) => {
      // If there is additional Information open Overlay, else redirect directly to checkout
      if (data.texte?.length) {

        // GTM Tracking of Checkout Overlay
        this.dataLayerPush({
          'event': 'virtual_pageview',
          'pageview': '/hinweis-overlay',
        })

        const tempWrapper = document.createElement("div")

        // generate <m-dialog> - Markup
        tempWrapper.innerHTML = /* html */ `
          <m-dialog namespace="dialog-left-slide-in-checkout-" show-event-name="dialog-open-checkout-overlay-${this.dialogId}" close-event-name="backdrop-clicked-${this.dialogId}">
            <div class="container dialog-header" tabindex="0">
              <div></div>
              <h3 id="overlay-title">${data.titel}</h3>
              <div id="close">
                <a-icon-mdx icon-name="Plus" size="2em" ></a-icon-mdx>
              </div>
            </div>
            <ks-a-spacing type="xs-flex" tabindex="0"></ks-a-spacing>
            <div class="container dialog-content">
              <div class="sub-content">
              ${data.texte.reduce(
                (acc, text, index) => acc + /* html */ `
                  ${index > 0 ? /* html */ `<ks-a-spacing type="l-flex" tabindex="0"></ks-a-spacing>` : ''}
                  <h3>${text.titel}</h3>
                  <p>${text.text}</p>
                `, '')}
              </div>
            </div>
            <div class="container dialog-footer">
              ${data.buttons.reduce((acc, button) => acc + /* html */ `
                <ks-a-button 
                  ${button.event === "close" ? 'id="close"' : ''}
                  ${button.iconName && !button.text ? 'icon' : ''} 
                  namespace="${button.typ && button.event != "close" ? 'button-' + button.typ + '-' : 'button-secondary-'}" 
                  color="secondary" 
                  ${button.link ? `href=${button.link}` : ''}
                >
                  ${button.text ? '<span>' + button.text + '</span>' : ''}
                  ${button.iconName && !button.text ? `<a-icon-mdx icon-name="${button.iconName}" size="1em"></a-icon-mdx>` : ''} 
                  ${button.iconName && button.text ? `<a-icon-mdx namespace="icon-mdx-ks-" icon-name="${button.iconName}" size="1em" class="icon-right"></a-icon-mdx>` : ''}
                </ks-a-button>
              `, '')}
            </div>
          </m-dialog>
        `

        // Only add m-dialog if not there already
        if (!this.root.querySelector("m-dialog")) this.root.querySelector('.buttons-container')?.appendChild(tempWrapper.children[0])

        // Trigger Open Dialog event
        this.dispatchEvent(new CustomEvent(`dialog-open-checkout-overlay-${this.dialogId}`,
          {
            detail: {
              command: 'show-modal'
            },
            bubbles: true,
            cancelable: true,
            composed: true
          }
        ))
      } else {
        window.location.href = data.link
      }
    })
  }

  getItemId (data) {
    const itemId = data.kurs_typ + '_' + data.kurs_id
    const centerId = data.centerid ? `_${data.centerid}` : ''
    const parentId = data.parentkey ? data.parentkey.includes(data.centerid) ? data.parentkey : data.parentkey + centerId : data.parent_kurs_id && data.parent_kurs_typ ? `${data.parent_kurs_typ}_${data.parent_kurs_id}${centerId}` : ''
    return parentId ? `${parentId}--${itemId}` : `${itemId}${centerId}--${itemId}`
  }

  dataLayerPush (value) {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.dataLayer) {
      try {
        // @ts-ignore
        window.dataLayer.push(value)
      } catch (err) {
        console.error('Failed to push event data:', err)
      }
    }
  }
}
