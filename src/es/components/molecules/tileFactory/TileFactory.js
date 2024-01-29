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
      // TODO: Tile List for multiple locations?
      // TODO: @Tile analog DoubleButton.js (getHiddenLabelsCounter) for Locations which are more than 5? Length?
      // TODO: Missing visual props
      // TODO: Missing json props
      /*
      {
          "key": "qg-i-IwBm0S_K5Z8d5xM",
          "typ": "D",
          "id": "10053",
          "centerid": "1019",
          "gebaeudeid": "1401",
          "ortid": "136",
          "parentkey": "D_10053",
          "title": "1001 Nacht - Orientalische Küche mit Noretta Keller",
          "titleesc": "1001 nacht   orientalische kuche mit noretta keller",
          "dateBegin": "2024-02-05",
          "dateEnd": "2024-02-05",
          "location": "",
          "locations": [
              "Wetzikon"
          ],
          "days": [
              "Mo"
          ],
          "timeBegin": "18:00",
          "timeEnd": "21:20",
          "price": 116.0,
          "lessons": 0.0,
          "state": 0,
          "stateDesc": "1 Veranstaltungen",
          "permission": false,
          "cantonshare": false,
          "cantonshareprice": 0,
          "abnormal": false,
          "diploma": 0,
          "cat_code": 0,
          "score": 1,
          "link_url": "https://miducawebappdev.azurewebsites.net/angebote/kurse/kurs/1001-nacht---orientalische-kuche-mit-noretta-keller--D_10053_1019",
          "atyp": [
              "E"
          ],
          "count": 1
      }
      */
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
