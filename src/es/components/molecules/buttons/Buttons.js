// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class Buttons
* @type {CustomElementConstructor}
*/
export default class Buttons extends Shadow() {
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
    return !this.root.querySelector('.buttons-container')
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host .buttons-container {
        --border-color-secondary: var(--button-secondary-border-color, var(--color-secondary));
        display: flex;
        gap: 1rem;
      }

      :host m-dialog {
        margin-right: -1rem; /* to compensate the gap */
      }

      @media only screen and (max-width: _max-width_) {
        :host .dialog-footer ks-a-button {
          --button-primary-width: 100%;
          --button-secondary-width: 100%;
          text-align: center;
        }
      }
    `
    return this.fetchTemplate()
  }

  /**
   * fetches the template
   */
  fetchTemplate () {
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
  renderHTML () {
    const dataButtons = JSON.parse(this.getAttribute('data-buttons')) || [{}]
    const optionalBigAttr = this.hasAttribute('big') ? 'big' : ''
    const optionalSmallAttr = this.hasAttribute('small') ? 'small' : ''

    // keep existing url params
    let filteredURLParams = ''
    const shouldKeepURLParams = this.hasAttribute('keep-url-params')
    if (shouldKeepURLParams) {
      const urlParams = this.hasAttribute('keep-url-params') ? window.location.search : ''
      const urlParamsMap = new URLSearchParams(urlParams)
      const urlParamsArray = Array.from(urlParamsMap.keys())
      // TODO: keys to ignore should be moved to .env file (see also WithFacet.js)
      const ignoreURLKeys = [
        'rootFolder', 'css', 'login', 'logo', 'nav', 'footer', 'content', // existing fe dev keys
        // 'q', // ignore search query
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'
      ] // GA parameters
      const filteredURLKeys = urlParamsArray.filter(key => !ignoreURLKeys.includes(key))
      filteredURLParams = filteredURLKeys.map(key => `${key}=${urlParamsMap.get(key)}`).join('&')
    }

    const buttons = dataButtons?.reduce((acc, button) => {
      // keep existing url params
      if (shouldKeepURLParams && button.link) {
        if (button.link.includes('?')) {
          button.link = button.link + '&' + filteredURLParams
        } else {
          button.link = button.link + '?' + filteredURLParams
        }
      }
      if (button.event?.includes('AdvisoryText')) {
        const dialogId = this.getAttribute("dialog-id") || 0
        const parentDiv = document.createElement("div")

        this.overLayButton = document.createElement("ks-a-button")
        this.overLayButton.setAttribute("namespace", "button-primary-")
        this.overLayButton.setAttribute("color", "secondary")
        this.overLayButton.setAttribute("request-event-name", `dialog-open-checkout-overlay-${dialogId}`)
        this.overLayButton.setAttribute("click-no-toggle-active", "")
        this.overLayButton.innerHTML = button.text

        this.addEventListener(`dialog-open-checkout-overlay-${dialogId}`, () => {
          // for local testing add `https://dev.klubschule.ch${button.event}` to the checkoutOverlayAPI
          new Promise(resolveCheckout => {
            this.dispatchEvent(new CustomEvent('checkout-overlay-api', {
              detail: {
                resolveCheckout,
                checkoutOverlayAPI: `${button.event}`
              },
              bubbles: true,
              cancelable: true,
              composed: true
            }))
          }).then((data) => {
            this.renderDialogContent(data)
          })
        })

        parentDiv.innerHTML = /* html */ `
          <m-dialog namespace="dialog-left-slide-in-" mode="false" show-event-name="dialog-open-checkout-overlay-${dialogId}" close-event-name="backdrop-clicked-${dialogId}" id="checkout-overlay-${dialogId}">
            <div class="container dialog-header" tabindex="0">
              <div></div>
              <h3 id="overlay-title"></h3>
              <div id="close">
                <a-icon-mdx icon-name="Plus" size="2em" ></a-icon-mdx>
              </div>
            </div>
            <ks-a-spacing type="xs-flex" tabindex="0"></ks-a-spacing>
            <div class="container dialog-content">
              <div class="sub-content">
              </div>
            </div>
            <div class="container dialog-footer">
              <!-- In order to have the close funtionality we need to render the Close button intially, we only change the label! -->
              <ks-a-button id="close" namespace="button-secondary-" color="secondary">
              </ks-a-button>
            </div>
          </m-dialog>
        `
        parentDiv.appendChild(this.overLayButton)
        return acc + parentDiv.innerHTML;
      }
      return acc + (
        button.event === 'bookmark' ? '' : /* html */`
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
      )
    }, '')

    this.html = /* html */`
      <div class="buttons-container">
        ${buttons}
      </div>
    `

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
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ])
  }

  renderDialogContent(content) {
    if (content.texte?.length) {
      this.root.querySelector(".container.dialog-header #overlay-title").innerHTML = /* html */ `
        ${content.titel}
      `
      this.root.querySelector(".container.dialog-content .sub-content").innerHTML = content.texte.reduce(
        (acc, text, index) => acc + /* html */ `
          ${index > 0 ? /* html */ `<ks-a-spacing type="l-flex" tabindex="0"></ks-a-spacing>` : ''}
          <h3>${text.titel}</h3>
          <p>${text.text}</p>
        `, '')
        
      const buttons = this.root.querySelector(".container.dialog-footer")
      
      // In order to have the close funtionality we need to render the Close button intially, we only change the label!
      content.buttons.forEach((button) => {
        if (button.event === "close") {
          const closeButtonLabel = buttons.querySelector('#close').shadowRoot.querySelector('button > #label')
          closeButtonLabel.textContent = button.text
          closeButtonLabel.classList.remove("hide")
          return
        }
        
        const wrapperDiv = document.createElement('div')
        wrapperDiv.innerHTML = /* html */ `
          <ks-a-button 
            ${button.event === "close" ? 'id="close"' : ''}
            ${button.iconName && !button.text ? 'icon' : ''} 
            namespace="${button.typ ? 'button-' + button.typ + '-' : 'button-secondary-'}" 
            color="secondary" 
            ${button.link ? `href=${button.link}` : ''}
          >
            ${button.text ? '<span>' + button.text + '</span>' : ''}
            ${button.iconName && !button.text ? `<a-icon-mdx icon-name="${button.iconName}" size="1em"></a-icon-mdx>` : ''} 
            ${button.iconName && button.text ? `<a-icon-mdx namespace="icon-mdx-ks-" icon-name="${button.iconName}" size="1em" class="icon-right"></a-icon-mdx>` : ''}
          </ks-a-button>
        `
        if (buttons.children?.length < 2) buttons.appendChild(wrapperDiv.querySelector('ks-a-button'))
      })
    } else {
      window.location.href = content.link
    }
  }
}
