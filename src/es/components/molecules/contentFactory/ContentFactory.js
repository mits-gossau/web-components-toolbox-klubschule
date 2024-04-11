// @ts-check

/* global CustomEvent */

import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class ContentFactory extends Shadow() {
  /**
  * @param options
  * @param {any} args
  */
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.withFacetEventNameListener = event => this.renderHTML(event.detail.fetch)
  }

  connectedCallback() {
    if (this.shouldRenderCSS()) this.renderCSS()
    document.body.addEventListener('with-facet', this.withFacetEventNameListener)
    this.dispatchEvent(new CustomEvent('request-with-facet',
      {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    ))
  }

  disconnectedCallback() {
    document.body.removeEventListener('with-facet', this.withFacetEventNameListener)
  }

  shouldRenderCSS() {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
  * renders css
  *
  * @return {Promise<void>}
  */
  renderCSS() {
    this.css = /* css */ `
    :host> section {
      display: flex;
      flex-direction: column;
      gap: 1em;
      margin-bottom: 1em;
    }
    :host> section:last-child {
      margin-bottom: 0;
    }
    : host > .error {
      color: var(--color-error);
    }
    @media only screen and (max-width: _max-width_) {
      
    }
    `
    return this.fetchTemplate()
  }

  /**
  * fetches the template
  *
  * @return {Promise<void>}
  */
  fetchTemplate() {
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
  async renderHTML(fetch) {
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
        }
      ])
    ]).then(([data]) => {
      if (!data.isNextPage) this.html = ''
      if (!data) {
        this.html = `<span class=error>${this.getAttribute('error-translation') || 'Leider haben wir keine Produkte zu diesem Suchbegriff gefunden.'}</span>`
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
              <h3>${content.text}</h3>
              <p>${content.title}</p>
            </div>
            ${content.image
              ? /* html */`
              <a-picture picture-load defaultSource="${content.image.src}" alt="${content.image.alt}"></a-picture>
              `
              : ''
            }
          </a>
        </ks-m-content-search-item>
        `), '<section>') + '</section>'
    }).catch(error => {
      console.error(error)
      this.html = ''
      this.html = `<span class=error>${this.getAttribute('error-translation') || 'Leider haben wir keine Produkte zu diesem Suchbegriff gefunden.'}<br>${error}</span>`
    })
  }

  fillGeneralContentInfo(content) {
    return `{
      'link': '${content.link}',
      'title': '${content.title}'
      'text': '${content.text}',
      ${content.image ? `
      'image': {
        'alt': '${content.image.alt}',
        'src': ${content.image.src}
      }    
      `:
      ''
      }
    }`
  }
}
