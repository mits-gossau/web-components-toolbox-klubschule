// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * Communicates with the src/es/components/controllers/partnerSearch/PartnerSearch.js controller
 * 
 * @export
 * @class PartnerSearch
 * @type {CustomElementConstructor}
 */
export default class PartnerSearch extends Shadow() {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.hiddenMessages = this.hiddenSections
    this.searchText = this.getAttribute('search-text')
    this.tab = this.getAttribute('tab')
    this.partnerSearchListener = event => this.renderHTML(event.detail.fetch)
  }

  connectedCallback(){
    this.hidden = true
    new Promise(resolve => {
      this.dispatchEvent(new CustomEvent('request-translations',
        {
          detail: {
            resolve
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }))
    }).then(async result => {
      await result.fetch
      this.getTranslation = result.getTranslationSync
      const showPromises = []
      if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
      if (this.shouldRenderHTML()) showPromises.push(this.renderHTML())
      Promise.all(showPromises).then(() => {
        this.hidden = false
        if (this.searchText.length) {
          new Promise(resolve => this.dispatchEvent(new CustomEvent('request-partner-search', {
            detail: {
              searchText: this.searchText,
              resolve
            },
            bubbles: true,
            cancelable: true,
            composed: true
          }))).then(fetch => this.renderHTML(fetch))
        } else {
          this.renderHTML(Promise.resolve(() => ({
            items: [],
            success: false
          })))
        }
      })
    })

    document.body.addEventListener('partner-search', this.partnerSearchListener)

  }

  disconnectedCallback () {
    document.body.removeEventListener('partner-search', this.partnerSearchListener)
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
    // TODO: check for something like this.sections
    return !this.loadingBar && !this.sections
  }

  /**
   * renders the css
   * @return {Promise<void>}
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        --picture-teaser-img-height: 48px;
        --h2-margin: 0 0 var(--mdx-sys-spacing-flex-large-m);
        --h3-margin: 0 0 var(--mdx-sys-spacing-flex-large-xs);
        --picture-teaser-display: block;
        --picture-teaser-img-margin: 0;
        --a-text-decoration: underline;
        text-decoration-line: none;
      }
      :host .partner-result-wrapper {
        display: flex;
        gap: var(--mdx-sys-spacing-fix-l);
      }
      :host .partner-result-item-wrapper {
        flex-basis: calc((100% - 2 * 2rem) / 3);
        background-color: var(--m-white);
        text-align: start;
        padding: 1.25rem;
        display: flex;
        gap: var(--mdx-sys-spacing-fix-2xs);
        flex-direction: column;
      }
      :host .partner-result-item-wrapper .button-wrapper {
        margin: var(--mdx-sys-spacing-fix-2xs) 0 0;
      }
      :host .partner-result-item-wrapper span {
        font: var(--mdx-sys-font-fix-body3);
        margin-bottom: auto;
      }
      :host #partner-results {
        --h2-margin: 0 0 var(--mdx-sys-spacing-flex-large-s);
      }
      :host section + section {
        margin: var(--mdx-sys-spacing-flex-large-m) 0 0;
      }
      :host a-picture {
        --picture-teaser-img-max-width: unset;
        --picture-teaser-img-width: unset;
      }
      @media screen and (max-width: _max-width_) {
        :host a-picture {
          margin-right: auto;
        }
        :host .partner-result-wrapper {
          flex-direction: column;
        }
      }
    `
    return this.fetchTemplate()
  }

  /**
   * fetches the template
   * @return {Promise<void>}
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
      default:
        return this.fetchCSS(styles)
    }
  }

  /**
   * Render HTML
   * @param {Promise<any>} [fetch=undefined]
   * @return {Promise<void>}
   */
  async renderHTML(fetch) {
    this.html = ''
    this.renderLoading()
    if (fetch) {
      // fetch.catch(error => (this.html = `<span class=error><a-translation data-trans-key="${this.getAttribute('error-text') ?? 'PartnerSearch.Error'}"></a-translation></span>`))
      const data = this.lastData = await fetch
      this.html = ''      
      if(this.tab == 1) {
        this.hiddenMessages[0].removeAttribute('hidden')
      } else if (this.tab == 2) {
        this.hiddenMessages[1].removeAttribute('hidden')
      } else {
        this.hiddenMessages.forEach(message => message.removeAttribute('hidden'))
      }
      this.html = this.hiddenMessages
      const headline = this.hiddenMessages[this.hiddenMessages.length - 1].querySelector("h2")
      let headlineText = headline.innerText
      headlineText = headlineText.replace("{0}", this.searchText)
      headline.textContent = headlineText

      const partnerResultsSection = this.root.querySelector("#partner-results")

      const filteredItems = data?.items?.filter(item  => item.count > 0)

      if (filteredItems?.length) {
        partnerResultsSection.insertAdjacentHTML('beforeend', /* html */ `
          <div class="partner-result-wrapper">
            ${filteredItems.reduce((acc, item) => 
              acc + /* html */ `
                  <div class="partner-result-item-wrapper">
                    <a-picture namespace="picture-teaser-" alt="${item.label}" picture-load defaultsource="${item.logo}" ></a-picture>
                    <span>${item.text}</span>
                    <div class="button-wrapper">
                      <ks-a-button icon namespace="button-secondary-" color="secondary" target="_blank" href="${item.link}">
                        <span>${item.count} ${this.getTranslation('CourseList.OffersPlaceholder')}</span>
                        <a-icon-mdx namespace="icon-mdx-ks-" icon-name="ArrowUpRight" size="1em" class="icon-right"></a-icon-mdx>
                      </ks-a-button>
                    </div>
                  </div>
              `, '')}
          </div>
        `)
      } else {
        partnerResultsSection?.setAttribute('hidden', '')
      }
    }

    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../atoms/button/Button.js`,
        name: 'ks-a-button'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/picture/Picture.js`,
        name: 'a-picture'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/translation/Translation.js`,
        name: 'a-translation'
      },
      {
        path: `${this.importMetaUrl}../../../../css/web-components-toolbox-migros-design-experience/src/es/components/organisms/MdxComponent.js`,
        name: 'mdx-component'
      }
    ])
  }

  renderLoading () {
    this.html = /* html */`
      <mdx-component>
          <mdx-loading-bar></mdx-loading-bar>
      </mdx-component>
    `
  }

  get loadingBar () {
    return this.root.querySelector('mdx-loading-bar')
  }

  get hiddenSections () {
    return Array.from(this.querySelectorAll('section[hidden]') || this.root.querySelectorAll('section[hidden]'))
  }
}
