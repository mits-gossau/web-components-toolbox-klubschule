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

    this.hiddenMessages = this.hiddenSections
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderModules()) this.renderModules()
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
    this.html = /* html */`
      <mdx-component class="mdx-loading">
          <mdx-loading-bar></mdx-loading-bar>
      </mdx-component>
    `

    fetch.then(data => {
      setTimeout(() => {
        // remove loading component
        this.root.querySelector('.mdx-loading')?.remove()
        this.html = ''
        if (!data) {
          this.html = `<span class=error><a-translation data-trans-key="${this.getAttribute('error-text') ?? 'Search.Error'}"></a-translation></span>`
          return
        }
        this.isNearbySearch = data.sort.sort === 2
        this.psize = data.psize
        this.pnext = data.pnext
        this.html = data.courses.reduce(
          (acc, course) => {
            const tile = this.isEventSearch ? /* html */ `
              <ks-m-event
                data='{
                  "course": ${JSON.stringify(course).replace(/'/g, '’').replace(/"/g, '\"')},
                  "sprachid": "${data.sprachid}"
                }'
              ></ks-m-event>
            ` : (
              (course.locations?.length > 1 || this.isNearbySearch) && course.filter?.length
                ? /* html */`
                <m-load-template-tag mode="false">
                <template>
                  <ks-o-tile-list data='{
                    ${this.isNearbySearch ? this.fillGeneralTileInfoNearBy(course).replace(/'/g, '’').replace(/"/g, '\"') : this.fillGeneralTileInfo(course).replace(/'/g, '’').replace(/"/g, '\"')},
                    "filter": ${JSON.stringify(course.filter).replace(/'/g, '’').replace(/"/g, '\"') || ''},
                    "locations": ${JSON.stringify(course.locations.sort((a, b) => a.localeCompare(b))).replace(/'/g, '’').replace(/"/g, '\"') || ''},
                    "sort": ${JSON.stringify(data.sort.sort).replace(/'/g, '’').replace(/"/g, '\"') || ''}
                  }'${this.hasAttribute('is-wish-list') ? ' is-wish-list' : ''}${this.isNearbySearch ? ' nearby-search' : ''}>
                  </ks-o-tile-list>
                  </template>
                  </m-load-template-tag>
                `
                : /* html */`
                  <m-load-template-tag mode="false">
                  <template>
                  <ks-m-tile namespace="tile-default-" data='{
                    ${this.fillGeneralTileInfo(course).replace(/'/g, '’').replace(/"/g, '\"')}
                  }'${this.hasAttribute('is-wish-list') ? ' is-wish-list' : ''}${this.isNearbySearch ? ' nearby-search' : ''}></ks-m-tile>
                  </template>
                  </m-load-template-tag>
                `
            )
            return acc = acc + tile
          },
          '<section>'
        ) + '</section>'
        if (!data.courses.length && this.section) this.section.innerHTML = /* html */`
          <ks-o-partner-search search-text="${data.searchText}">
            ${this.hiddenMessages.reduce((acc, hiddenSection) => (acc + hiddenSection.outerHTML), '')}
          </ks-o-partner-search>
        `
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

  fillGeneralTileInfo (course) {
    // NOTE: the replace ".replace(/'/g, '’')" avoids the dom to close the attribute string unexpectedly. This replace is also ISO 10646 conform as the character ’ (U+2019) is the preferred character for apostrophe. See: https://www.cl.cam.ac.uk/~mgk25/ucs/quotes.html + https://www.compart.com/de/unicode/U+2019
    return `
      "title": "${course.bezeichnung}",
      "infotextshort": ${JSON.stringify(course.infotextshort).replace(/'/g, '’').replace(/"/g, '\"') || ''},
      "location": {
        "iconName": "Location",
        "name": "${course.location?.name
          ? course.location.name
          : course.locations
            ? course.locations.join(', ')
            : ''}",
        "badge": "${course.location.badge ? course.location.badge : ''}"
      },
      "buttons": ${JSON.stringify(course.buttons).replace(/'/g, '’').replace(/"/g, '\"') || ''},
      "icons": ${JSON.stringify(course.icons).replace(/'/g, '’').replace(/"/g, '\"') || ''},
      "price": {
        "pre": "${course.price.pre}",
        "amount": "${course.price.amount}",
        "per": "${course.price.per}"
      },
      "parentkey": "${course.parentkey}"
    `
  }

  fillGeneralTileInfoNearBy (course) {
    // NOTE: the replace ".replace(/'/g, '’')" avoids the dom to close the attribute string unexpectedly. This replace is also ISO 10646 conform as the character ’ (U+2019) is the preferred character for apostrophe. See: https://www.cl.cam.ac.uk/~mgk25/ucs/quotes.html + https://www.compart.com/de/unicode/U+2019
    return `
      "title": "${course.bezeichnung}",
      "infotextshort": ${JSON.stringify(course.infotextshort).replace(/'/g, '’').replace(/"/g, '\"') || ''},
      "icons": ${JSON.stringify(course.icons).replace(/'/g, '’').replace(/"/g, '\"') || ''},
      "buttons": ${JSON.stringify(course.buttons).replace(/'/g, '’').replace(/"/g, '\"') || ''}
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

  get section () {
    return this.root.querySelector('section')
  }

  get hiddenSections () {
    return Array.from(this.querySelectorAll('section[hidden]') || this.root.querySelectorAll('section[hidden]'))
  }
}
