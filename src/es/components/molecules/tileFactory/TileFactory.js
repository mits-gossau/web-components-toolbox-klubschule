// @ts-check

/* global CustomEvent */

import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * @typedef {Object} Course
 * @property {string} bezeichnung
 * @property {string} infotextshort
 * @property {Object} location
 * @property {string} location.name
 * @property {string} location.badge
 * @property {string} location.center
 * @property {string} center
 * @property {string} centerid
 * @property {string} kurs_typ
 * @property {string} kurs_id
 * @property {Array<Object>} buttons
 * @property {Array<Object>} icons
 * @property {Object} price
 * @property {string} price.pre
 * @property {string} price.amount
 * @property {string} price.per
 * @property {number} price.price
 * @property {number} price.oprice
 * @property {string} parentkey
 * @property {Array<Object>} filter
 * @property {Array<string>} locations
 * @property {string} spartename
 */

/**
 * @typedef {Object} Event
 * @property {string} id
 * @property {string} centerid
 * @property {string} typ
 * @property {Object} location
 * @property {string} location.name
 * @property {string} datum_label
 * @property {string} days_label
 * @property {string} download_label
 * @property {string} wochentag_label
 * @property {string} termin_label
 * @property {string} termin_alle_label
 * @property {string} zeit_label
 * @property {string} uhrzeit_label
 * @property {Array<string>} days
 * @property {string} start_zeit
 * @property {string} ende_zeit
 * @property {boolean} ist_zeit_unregelmaessig
 * @property {string} detail_label_more
 * @property {string} detail_label_less
 * @property {string} status
 * @property {string} status_label
 * @property {string} lektionen_label
 * @property {Object} price
 * @property {number} oprice
 * @property {string} parentkey
 * @property {Array<Object>} icons
 * @property {Array<Object>} buttons
 * @property {Array<Object>} abo_typen
 * @property {boolean} deletable
 */

export default class TileFactory extends Shadow() {
  /**
  * @param options
  * @param {any} args
  */
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.withFacetEventNameListener = event => this.renderHTML(event.detail.fetch)
    this.hiddenMessages = this.hiddenSectionsPartnerSearch
    this.hiddenTroublemakerMessages = this.templateTroublemaker
    this.isOtherLocations = this.hasAttribute('is-other-locations')
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderModules()) this.renderModules()

    this.eventListenerNode = this.hasAttribute('with-facet-target') ? TileFactory.walksUpDomQueryMatches(this, "ks-o-offers-page") : document.body
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
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderModules () {
    return !this.renderedModules
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
    :host > section.other-locations {
      flex-direction: row;
      flex-wrap: wrap;
    }
    :host > section.other-locations > * {
      flex: 1 1 calc(33.333% - 20px);
      width: calc(33.333% - 20px);
      max-width: calc(33.333% - 20px);
    }
    :host > .error {
      color: var(--color-error);
    }
    :host m-load-template-tag {
      display: block;
      min-height: 8em;
    }
    @media only screen and (max-width: _max-width_) {
      :host > section {
        margin-left: -0.5rem;
        margin-right: -0.5rem;
      }
      :host > section.other-locations {
        flex-direction: column;
      }
      :host > section.other-locations > * {
        flex: 1 1 100%;
        width: 100%;
        max-width: 100%;
      }
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
    /* loading */
    this.fetchModules([
      {
        path: `${this.importMetaUrl}../../../../css/web-components-toolbox-migros-design-experience/src/es/components/organisms/MdxComponent.js`,
        name: 'mdx-component'
      }
    ])
    fetch.then(data => {
      setTimeout(() => {
        this.root.querySelectorAll('.mdx-loading').forEach(el => el.remove())
        if ((data.ppage === 1 || data.pskip === data.psize) && !this.hasAttribute('is-info-events')) this.html = ''

        if (!data) {
          this.html = `<span class=error><a-translation data-trans-key="${this.getAttribute('error-text') ?? 'Search.Error'}"></a-translation></span>`
          return
        }        

        this.isNearbySearch = data.sort.sort === 2
        this.psize = data.psize
        this.pnext = data.pnext

        this.html = data.courses.reduce(
          (acc, /** @type {Course} */ course, i) => {
            let tile = this.isEventSearch ? /* html */ `
              <ks-m-event
                ${this.hasAttribute('is-wish-list') ? ' is-wish-list' : ''}
                ${this.hasAttribute('is-info-events') ? ' is-info-events' : ''}
                data='{
                  "course": ${JSON.stringify(course).replace(/'/g, '’').replace(/"/g, '\"')},
                  "sprachid": "${data.sprachid}"
                }'
              ></ks-m-event>
            ` : (
              ((course.locations?.length > 1 || course.buttons[0]?.link === null &&  course.buttons[0].iconName === 'ChevronDown' &&  course.buttons[0].typ === 'quaternary') || this.isNearbySearch) && course.filter?.length
                ? /* html */`
                  <m-load-template-tag>
                    <template>
                      <ks-o-tile-list data='{
                        ${this.isNearbySearch ? this.fillGeneralTileInfoNearBy(course).replace(/'/g, '’').replace(/"/g, '\"') : this.fillGeneralTileInfo(course).replace(/'/g, '’').replace(/"/g, '\"')},
                        "filter": ${JSON.stringify(course.filter).replace(/'/g, '’').replace(/"/g, '\"') || ''},
                        "locations": ${JSON.stringify(course.locations).replace(/'/g, '’').replace(/"/g, '\"') || ''},
                        "spartename": ${JSON.stringify(course.spartename).replace(/'/g, '’').replace(/"/g, '\"') || ''},
                        "sort": ${JSON.stringify(data.sort.sort).replace(/'/g, '’').replace(/"/g, '\"') || ''}
                      }'${this.hasAttribute('is-wish-list') ? ' is-wish-list' : ''}${this.hasAttribute('is-info-events') ? ' is-info-events' : ''}${this.isNearbySearch ? ' nearby-search' : ''}>
                      </ks-o-tile-list>
                    </template>
                  </m-load-template-tag>
                `
                : /* html */`
                  <m-load-template-tag>
                    <template>
                      <ks-m-tile 
                        namespace="tile-default-" 
                        data='{${this.isOtherLocations ? this.fillGeneralTileOtherLocations(course).replace(/'/g, '’').replace(/"/g, '\"') : this.fillGeneralTileInfo(course).replace(/'/g, '’').replace(/"/g, '\"')}}'
                        ${this.hasAttribute('is-wish-list') ? ' is-wish-list' : ''}
                        ${this.hasAttribute('is-info-events') ? ' is-info-events' : ''}
                        ${this.hasAttribute('is-other-locations') ? ` is-other-locations next-start-dates-text="${this.getAttribute('next-start-dates-text')}"` : ''}
                        ${this.isNearbySearch ? ' nearby-search' : ''}
                      ></ks-m-tile>
                    </template>
                  </m-load-template-tag>
                `
            )
            if (this.hiddenTroublemakerMessages && data.courses.length && (data.courses.length <= 2 ? i === 0 : i === 1) && !this.root.querySelector('#trouble-maker, ks-m-troublemaker')) tile += /* html */`
              <m-load-template-tag id="trouble-maker">
                <template>
                  ${this.hiddenTroublemakerMessages.reduce((acc, hiddenSection) => (acc + hiddenSection.innerHTML), '')}
                </template>
              </m-load-template-tag>
            `
            return acc + tile
          },
          `<section ${this.hasAttribute('is-other-locations') ? 'class="other-locations"' : ''}>`
        )
        + (!data.courses.length
          ? /* html */`<ks-o-partner-search search-text="${data.searchText}"${data.courses.length ? ' has-courses': ''}${this.hasAttribute('no-partner-search') ? ' no-partner-search' : ''} tab="1">
              ${this.hiddenMessages.reduce((acc, hiddenSection) => (acc + hiddenSection.outerHTML), '')}
            </ks-o-partner-search>`
          : '')
        + /* html */`</section>`
        // TODO: ABOVE ks-o-partner-search must be moved to the location of ks-a-with-facet-pagination which is at /home/deck/Documents/vm_work/web-components-toolbox-klubschule/src/es/components/organisms/offersPage/OffersPage.js:659
        this.lastFilterSelection = data.filter
      }, 0)
    }).catch(error => {
      console.error(error)
      this.html = ''
      this.html = `<span class=error><a-translation data-trans-key="${this.getAttribute('error-text') ?? 'Search.Error'}"></a-translation></span>`
    })
  }

  renderModules () {
    this.renderedModules = true
    return this.fetchModules([
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
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/translation/Translation.js`,
        name: 'a-translation'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/molecules/loadTemplateTag/LoadTemplateTag.js`,
        name: 'm-load-template-tag'
      },
      {
        path: `${this.importMetaUrl}../../organisms/partnerSearch/PartnerSearch.js`,
        name: 'ks-o-partner-search'
      }
    ])
  }

  fillGeneralTileInfo (/** @type {Course} */ course) {
    // NOTE: the replace ".replace(/'/g, '’')" avoids the dom to close the attribute string unexpectedly. 
    // This replace is also ISO 10646 conform as the character ’ (U+2019) is the preferred character for apostrophe. 
    // See: https://www.cl.cam.ac.uk/~mgk25/ucs/quotes.html + https://www.compart.com/de/unicode/U+2019
    return `
      "title": ${JSON.stringify(course.bezeichnung).replace(/'/g, '’').replace(/"/g, '\"') || ''},
      "infotextshort": ${JSON.stringify(course.infotextshort).replace(/'/g, '’').replace(/"/g, '\"') || ''},
      "location": {
        "iconName": "Location",
        "name": "${course.location?.name
          ? course.location.name
          : course.locations
            ? course.locations.join(', ')
            : ''}",
        "badge": "${course.location.badge ? course.location.badge : ''}",
        "center": "${course.location.center ? course.location.center : course.center ? course.center : ''}"
      },
      "centerid": "${course.centerid}",
      "kurs_typ": "${course.kurs_typ}",
      "kurs_id": "${course.kurs_id}",
      "buttons": ${JSON.stringify(course.buttons).replace(/'/g, '’').replace(/"/g, '\"') || ''},
      "icons": ${JSON.stringify(course.icons).replace(/'/g, '’').replace(/"/g, '\"') || ''},
      "price": {
        "pre": "${course.price.pre}",
        "amount": "${course.price.amount}",
        "per": "${course.price.per}",
        "price": ${course.price.oprice || course.price.price}
      },
      "parentkey": "${course.parentkey}",
      "spartename": ${JSON.stringify(course.spartename).replace(/'/g, '’').replace(/"/g, '\"') || ''}
    `
  }

  fillGeneralTileOtherLocations (/** @type {Course} */ course) {
    // NOTE: the replace ".replace(/'/g, '’')" avoids the dom to close the attribute string unexpectedly. 
    // This replace is also ISO 10646 conform as the character ’ (U+2019) is the preferred character for apostrophe. 
    // See: https://www.cl.cam.ac.uk/~mgk25/ucs/quotes.html + https://www.compart.com/de/unicode/U+2019
    return `
      "title": "${course.location?.name
          ? course.location.name
          : course.locations
            ? course.locations.join(', ')
            : ''}",
      "infotextshort": ${JSON.stringify(course.infotextshort).replace(/'/g, '’').replace(/"/g, '\"') || ''},
      "location": {
        "iconName": "",
        "name": "${course.location?.name
          ? course.location.name
          : course.locations
            ? course.locations.join(', ')
            : ''}",
        "badge": "${course.location.badge ? course.location.badge : ''}",
        "center": "${course.location.center ? course.location.center : course.center ? course.center : ''}"
      },
      "centerid": "${course.centerid}",
      "kurs_typ": "${course.kurs_typ}",
      "kurs_id": "${course.kurs_id}",
      "buttons": ${JSON.stringify(course.buttons).replace(/'/g, '’').replace(/"/g, '\"') || ''},
      "icons": ${JSON.stringify(course.icons).replace(/'/g, '’').replace(/"/g, '\"') || ''},
      "price": {
        "pre": "${course.price.pre}",
        "amount": "${course.price.amount}",
        "per": "${course.price.per}",
        "price": ${course.price.oprice || course.price.price}
      },
      "parentkey": "${course.parentkey}",
      "spartename": ${JSON.stringify(course.spartename).replace(/'/g, '’').replace(/"/g, '\"') || ''}
    `
  }

  fillGeneralTileInfoNearBy (/** @type {Course} */ course) {
    // NOTE: the replace ".replace(/'/g, '’')" avoids the dom to close the attribute string unexpectedly. 
    // This replace is also ISO 10646 conform as the character ’ (U+2019) is the preferred character for apostrophe. 
    // See: https://www.cl.cam.ac.uk/~mgk25/ucs/quotes.html + https://www.compart.com/de/unicode/U+2019
    return `
      "title": ${JSON.stringify(course.bezeichnung).replace(/'/g, '’').replace(/"/g, '\"') || ''},
      "infotextshort": ${JSON.stringify(course.infotextshort).replace(/'/g, '’').replace(/"/g, '\"') || ''},
      "icons": ${JSON.stringify(course.icons).replace(/'/g, '’').replace(/"/g, '\"') || ''},
      "buttons": ${JSON.stringify(course.buttons).replace(/'/g, '’').replace(/"/g, '\"') || ''}
    `
  }

  fillGeneralTileInfoEvents (/** @type {Event} */ event) {
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
      "price": ${event.oprice ? JSON.stringify(event.oprice) : JSON.stringify(event.price)},
      "icons": ${JSON.stringify(event.icons)},
      "buttons": ${JSON.stringify(event.buttons) || '[]'},
      ${aboTypesAsJson || ''}
      "deletable": ${event.deletable || 'false'}
    }`
  }

  get isEventSearch () {
    return this.hasAttribute('is-event')
  }

  get section () {
    return this.root.querySelector('section')
  }

  get hiddenSectionsPartnerSearch () {
    let result = Array.from(this.querySelectorAll('section[hidden]:not([slot=troublemaker])'))
    if (!result.length) result = Array.from(this.root.querySelectorAll('section[hidden]:not([slot=troublemaker])'))
    return result
  }

  get templateTroublemaker () {
    let result = Array.from(this.querySelectorAll('template[slot=troublemaker]'))
    if (!result.length) result = Array.from(this.root.querySelectorAll('template[slot=troublemaker]'))
    return result
  }
}
