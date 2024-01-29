// @ts-check

import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class TileFactory extends Shadow() {
  /**
  * @param options
  * @param {any} args
  */
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    
    this.withFacetEventNameListener = event => this.renderHTML(event.detail.fetch)
  }
  
  connectedCallback () {
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
  
  disconnectedCallback () {
    document.body.removeEventListener('with-facet', this.withFacetEventNameListener)
  }
  
  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }
  
  /**
  * renders css
  *
  * @return {Promise<void>}
  */
  renderCSS () {
    this.css = /* css */ `
    :host> section {
      display: flex;
      flex-direction: column;
      gap: 1em;
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
  fetchTemplate () {
    /** @type {import("../../web-components-toolbox/src/es/components/prototypes/Shadow.js").fetchCSSParams[]} */
    const styles = [
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/reset.css`, // no variables for this reason no namespace
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: false
      }
    ]
    switch (this.getAttribute('namespace')) {
      case 'course-list-default-':
      return this.fetchCSS([{
        path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
        namespace: false
      }, ...styles])
      default:
      return this.fetchCSS(styles)
    }
  }
  
  /**
  * renderHTML
  * @param {any} fetch - An array of course fetch objects.
  * @returns {Promise<void>} The function `renderHTML` returns a Promise.
  */
  async renderHTML (fetch) {
    this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/loading/Loading.js`,
        name: 'a-loading'
      }
    ])
    this.html = ''
    this.html = '<a-loading></a-loading>'
    return Promise.all([
      fetch,
      this.fetchModules([
        {
          path: `${this.importMetaUrl}../tile/Tile.js`,
          name: 'ks-m-tile'
        }
      ])
    ]).then(([data]) => {
      this.html = ''
      if (!data) {
        this.html = `<span class=error>${this.getAttribute('error-translation') || 'Leider haben wir keine Produkte zu diesem Suchbegriff gefunden.'}</span>`
        return
      }
      // TODO: Tile List for multiple locations
      this.html = data.courses.reduce((acc, course) => acc + /* html */`<ks-m-tile namespace="tile-default-" data="{
        'title': '${course.title}',
        'iconTooltip': '',
        'location': {
          'iconName': 'Location',
          'name': '${course.locations.join(', ')}',
          'badge': 'Blended'
        },
        'button': {
          'text': 'Ortsauswahl',
          'iconName': 'ArrowRight'
        },
        'icons': [
          {
            'name': 'Percent',
            'iconTooltip': ''
          },
          {
            'name': 'Bell',
            'iconTooltip': ''
          }
        ],
        'price': {
          'from': 'ab',
          'amount': '${course.price}',
          'per': 'Semester'
        }
      }"></ks-m-tile>`, '<section>') + '</section>'
    }).catch(error => {
      this.html = ''
      this.html = `<span class=error>${this.getAttribute('error-translation') || 'Leider haben wir keine Produkte zu diesem Suchbegriff gefunden.'}<br>${error}</span>`
    })
    
  }
}
