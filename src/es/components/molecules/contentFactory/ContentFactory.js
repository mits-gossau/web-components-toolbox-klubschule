// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/* global CustomEvent */

export default class ContentFactory extends Shadow() {
  /**
  * @param options
  * @param {any} args
  */
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.withFacetEventNameListener = event => this.renderHTML(event.detail.fetch)
    this.hiddenMessages = this.hiddenSectionsPartnerSearch
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()

    this.eventListenerNode = this.hasAttribute('with-facet-target') ? ContentFactory.walksUpDomQueryMatches(this, "ks-o-offers-page") : document.body
    this.eventListenerNode.addEventListener('with-facet', this.withFacetEventNameListener)
    this.dispatchEvent(new CustomEvent('request-with-facet',
      {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    ))
  }

  disconnectedCallback () {
    this.eventListenerNode.removeEventListener('with-facet', this.withFacetEventNameListener)
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  /**
  * renders css
  *
  * @return {Promise<void>}
  */
  renderCSS () {
    this.css = /* css */ `
    :host > section {
      display: flex;
      flex-direction: column;
      gap: 1em;
      margin-bottom: 1em;
    }
    :host > section:last-child {
      margin-bottom: 0;
    }
    :host > .error {
      color: var(--color-error);
    }
    `
    return this.fetchTemplate()
  }

  /**
  * fetches the template
  *
  * @return {Promise<void>}
  */
  fetchTemplate () {
    switch (this.getAttribute('namespace')) {
      case 'content-list-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }])
      default:
        return Promise.resolve()
    }
  }

  /**
  * renderHTML
  * @param {any} fetch - An array of course fetch objects.
  * @returns {Promise<void>} The function `renderHTML` returns a Promise.
  */
  async renderHTML (fetch) {
    return Promise.all([
      fetch,
      this.fetchModules([
        {
          path: `${this.importMetaUrl}../contentSearchItem/ContentSearchItem.js`,
          name: 'ks-m-content-search-item'
        },
        {
          path: `${this.importMetaUrl}../../organisms/contentList/ContentList.js`,
          name: 'ks-o-content-list'
        },
        {
          path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/translation/Translation.js`,
          name: 'a-translation'
        },
        {
          path: `${this.importMetaUrl}../../organisms/partnerSearch/PartnerSearch.js`,
          name: 'ks-o-partner-search'
        }
      ])
    ]).then(([data]) => {
      this.html = ''
      if (!data) {
        this.html = `<span class=error><a-translation data-trans-key="${this.getAttribute('error-text') ?? 'Content.Error'}"></a-translation></span>`
        return
      }
      this.html = data.contentItems.reduce((acc, content) => acc + (content.children?.length
        ? /* html */`<ks-o-content-list data="{
          ${this.fillGeneralContentInfo(content)},
          'buttonMore': {
            'text': 'Weitere Inhalte',
            'iconName': 'ArrowDownRight'
          },
          'items': [${content.children.reduce((acc, child, i, arr) => acc + `
            {
              ${this.fillGeneralContentInfo(child)}
            }${i === arr.length - 1 ? '' : ','}
          `, '')}
          ]
        }"></ks-o-content-list>`
        : /* html */`
        <ks-m-content-search-item>
          <a href="${content.link}">
            <div>
              ${content.title ? /* html */`<h3>${content.title}</h3>` : ''}
              ${content.text ? /* html */`<p>${content.text}</p>` : ''}
            </div>
            ${content.image ? /* html */`<a-picture picture-load defaultSource="${content.image.src}" alt="${content.image.alt}"></a-picture>` : ''}
          </a>
        </ks-m-content-search-item>
        `),
      '<section>'
      ) + '</section>'
      if (!data.contentItems.length && this.section) this.section.innerHTML = /* html */`
      <ks-o-partner-search search-text="${data.searchText}"${this.hasAttribute('no-partner-search') ? ' no-partner-search' : ''} tab="2">
        ${this.hiddenMessages.reduce((acc, hiddenSection) => (acc + hiddenSection.outerHTML), '')}
      </ks-o-partner-search>
      `
    }).catch(error => {
      console.error(error)
      this.html = ''
      this.html = `<span class=error><a-translation data-trans-key="${this.getAttribute('error-text') ?? 'Content.Error'}"></a-translation></span>`
    })
  }

  fillGeneralContentInfo (content) {
    return `{
      'link': '${content.link}',
      'title': '${content.title}'
      'text': '${content.text}',
      ${content.image
? `
        'image': {
          'alt': '${content.image.alt}',
          'src': ${content.image.src}
        }    
        `
: ''
      }
    }`
  }

  get section () {
    return this.root.querySelector('section')
  }

  get hiddenSectionsPartnerSearch () {
    let result = Array.from(this.querySelectorAll('section[hidden]:not([slot=troublemaker])'))
    if (!result.length) result = Array.from(this.root.querySelectorAll('section[hidden]:not([slot=troublemaker])'))
    return result
  }
}
