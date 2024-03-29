// @ts-check

/* global CustomEvent */

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
    switch (this.getAttribute('namespace')) {
      case 'course-list-default-':
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
        },
        {
          path: `${this.importMetaUrl}../../organisms/tileList/TileList.js`,
          name: 'ks-o-tile-list'
        }
      ])
    ]).then(([data]) => {
      this.html = ''
      if (!data) {
        this.html = `<span class=error>${this.getAttribute('error-translation') || 'Leider haben wir keine Produkte zu diesem Suchbegriff gefunden.'}</span>`
        return
      }
      this.html = data.courses.reduce((acc, course) => acc + (course.children?.length
        ? /* html */`<ks-o-tile-list data="{
          ${this.fillGeneralTileInfo(course)},
          'buttonMore': {
            'text': 'Weitere Standorte',
            'iconName': 'ArrowDownRight'
          },
          'tiles': [${course.children.reduce((acc, child, i, arr) => acc + `
            {
              ${this.fillGeneralTileInfo(child)}
            }${i === arr.length - 1 ? '' : ','}
          `, '')}
          ]
        }"></ks-o-tile-list>`
        : /* html */`<ks-m-tile namespace="tile-default-" data="{
          ${this.fillGeneralTileInfo(course)}
        }"></ks-m-tile>`), '<section>') + '</section>'
    }).catch(error => {
      console.error(error)
      this.html = ''
      this.html = `<span class=error>${this.getAttribute('error-translation') || 'Leider haben wir keine Produkte zu diesem Suchbegriff gefunden.'}<br>${error}</span>`
    })
  }

  fillGeneralTileInfo (course) {
    return `
      'title': '${course.title}',
      'iconTooltip': 'Das ist ein sinnvoller Tooltip-Text',
      'location': {
        'iconName': 'Location',
        'name': '${course.locations ? course.locations.join(', ') : ''}',
        'badge': '${course.eTyp ? course.eTyp : ''}'
      },
      'button': {
        'text': '${course.button.text}',
        'iconName': 'ArrowRight'
        ${course.button.link ? `, 'link': '${course.button.link}'` : ''}
      },
      'icons': [
        {
          'name': 'Percent',
          'iconTooltip': 'Das ist ein sinnvoller Tooltip-Text'
        },
        {
          'name': 'Bell',
          'iconTooltip': 'Das ist ein sinnvoller Tooltip-Text'
        }
      ],
      'price': {
        'from': '${course.price.pre}',
        'amount': '${course.price.amount}',
        'per': 'Semester'
      }
    `
  }
}
