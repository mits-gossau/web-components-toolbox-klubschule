// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class ExtraInfo extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.withFacetEventListener = event => this.renderHTML(event.detail.fetch)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()

    this.eventListenerNode = ExtraInfo.walksUpDomQueryMatches(this, "ks-o-offers-page")
    this.eventListenerNode.addEventListener('with-facet', this.withFacetEventListener)
  }

  disconnectedCallback () {
    this.eventListenerNode.removeEventListener('with-facet', this.withFacetEventListener)
  }

  shouldRenderCSS () {
    return !this.root.querySelector(
      `${this.cssSelector} > style[_css]`
    )
  }

  renderCSS () {
    this.css = /* css */ `
        :host div.wrap {
          background-color: var(--mdx-sys-color-primary-default);
          padding: var(--mdx-sys-spacing-flex-large-xs);
        }

        :host .section {
          display: flex;
          flex-direction: column;
          padding: 0.75rem 0 0.75rem;
        }

        :host .section + .section {
          border-top: 1px solid var(--mdx-sys-color-neutral-on-default);
        }

        :host .section:last-child {
          padding-bottom: 0;
        }

        :host .section .title {
          color: var(--mdx-sys-color-neutral-on-default);
          font: var(--mdx-sys-font-fix-label2);
          margin-top: 0;
        }

        :host .section p {
          margin: 0;
        }

        :host ul {
          margin: 0;
          padding: 0;
          list-style: none;
        } 

        :host .section span,
        :host .section p ,
        :host .section ul {
          color: var(--mdx-sys-color-neutral-on-default);
          font: var(--mdx-sys-font-fix-body2);
          margin-top: var(--mdx-sys-spacing-fix-2xs);
        }
    `
  }

  renderHTML (fetch) {
    Promise.all([fetch]).then(() => {
      fetch.then(response => {
        setTimeout(() => {
          const extraInfoWrapper = this.root.querySelector('.wrap')
          let extraInfoContent = extraInfoWrapper.innerHTML
          extraInfoContent = ''

          response.additionalinfos.forEach(additionalInfo => {
            extraInfoContent += `
              <div class="section">
                <span class="title">${additionalInfo.label}</span>
                <p>${additionalInfo.text}</p>
              </div>
            `
          })

          extraInfoWrapper.innerHTML = extraInfoContent
        }, 0)
      })
    })
  }
  
}
