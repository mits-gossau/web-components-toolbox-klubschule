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
    /*
    // TODO: If needed do the loading animation
    this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/loading/Loading.js`,
        name: 'a-loading'
      }
    ])
    this.html = ''
    this.html = '<a-loading></a-loading>'
    */
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
        },
        {
          path: `${this.importMetaUrl}../event/Event.js`,
          name: 'ks-m-event'
        }
      ])
    ]).then(([data]) => {
      if (!data.isNextPage) this.html = ''
      if (!data) {
        this.html = `<span class=error>${this.getAttribute('error-translation') || 'Leider haben wir keine Produkte zu diesem Suchbegriff gefunden.'}</span>`
        return
      }
      this.html = data.courses.reduce(
        (acc, course) => {
          const tile = this.isEventSearch ? /* html */ `
            <ks-m-event
              data='{
                "course": ${JSON.stringify(course)},
                "sprachid": "${data.sprachid}"
              }'
            ></ks-m-event>
          ` : (
            course.locations?.length > 1 && course.filter?.length
              ? /* html */`
                <ks-o-tile-list data='{
                  ${this.fillGeneralTileInfo(course)},
                  "filter": ${JSON.stringify(course.filter) || ''},
                  "locations": ${JSON.stringify(course.locations) || ''}
                }'>
                </ks-o-tile-list>
              `
              : /* html */`
                <ks-m-tile namespace="tile-default-" data='{
                  ${this.fillGeneralTileInfo(course)}
                }'></ks-m-tile>
              `
          )
          return acc = acc + tile
        },
        '<section>'
      ) + '</section>'
    }).catch(error => {
      console.error(error)
      this.html = ''
      this.html = `<span class=error>${this.getAttribute('error-translation') || 'Leider haben wir keine Produkte zu diesem Suchbegriff gefunden.'}<br>${error}</span>`
    })
  }

  fillGeneralTileInfo (course) {
    return `
      "title": "${course.bezeichnung}",
      "iconTooltip": ${JSON.stringify(course.infotextshort) || ''},
      "location": {
        "iconName": "Location",
        "name": "${course.location?.name
          ? course.location.name
          : course.locations
            ? course.locations.join(', ')
            : ''}",
        "badge": "${course.badge ? course.badge : ''}"
      },
      "buttons": ${JSON.stringify(course.buttons) || ''},
      "icons": ${JSON.stringify(course.icons) || ''},
      "price": {
        "from": "${course.price.pre}",
        "amount": "${course.price.amount}",
        "per": "${course.price.per}"
      }
    `
  }

  fillGeneralTileInfoEvents (event) {
    const aboTypes = event.abo_typen?.reduce((acc, abo, index) => acc + `{"text": "${abo.text}","typ": "${abo.typ}","title": "${abo.title}","link": "${abo.link}"}${index >= event.buttons.length - 1 ? '' : ','}`, '')
    const aboTypesAsJson = aboTypes ? `"abo_typen": [${aboTypes}],` : undefined
    return `{
      "id": "${event.id}",
      "center_id": "${event.centerid}",
      "language": "${event.parentkey.split('_')[0]}",
      "typ": "${event.typ}",
      "location": "${event.location.name}",
      "datum_label": "${event.datum_label}",
      "days_label": "${event.days_label}",
      "download_label": "${event.download_label}",
      "wochentag_label": "${event.wochentag_label}",
      "termin_label": "${event.termin_label}",
      "termin_alle_label": "${event.termin_alle_label}",
      "zeit_label": "${event.zeit_label}",
      "uhrzeit_label": "${event.uhrzeit_label}",
      "days": [${event.days}],
      "start_zeit": "${event.start_zeit}",
      "ende_zeit": "${event.ende_zeit}",
      "ist_zeit_unregelmaessig": ${event.ist_zeit_unregelmaessig},
      "detail_label_more": "${event.detail_label_more}",
      "detail_label_less": "${event.detail_label_less}",
      "status": "${event.status}",
      "status_label": "${event.status_label}",
      "lektionen_label": "${event.lektionen_label}",
      "price": ${JSON.stringify(event.price)},
      "icons": ${JSON.stringify(event.icons)},
      "buttons": ${JSON.stringify(event.buttons) || '[]'},
      ${aboTypesAsJson || ''}
      "deletable": ${event.deletable || 'false'}
    }`
  }

  get isEventSearch () {
    return this.hasAttribute('is-event')
  }
}
