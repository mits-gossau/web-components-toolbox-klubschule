// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class LocationList
* @type {CustomElementConstructor}
*/
export default class LocationList extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.scrollHashIntoView = this.scrollHashIntoView.bind(this)
    this.anchorListener = this.anchorListener.bind(this)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) { this.renderCSS() }
    if (this.shouldRenderHTML()) { this.renderHTML() }

    window.addEventListener('hashchange', this.scrollHashIntoView)
    this.root.addEventListener('click', this.anchorListener)
  }

  disconnectedCallback () {
    window.removeEventListener('hashchange', this.scrollHashIntoView)
    this.root.removeEventListener('click', this.anchorListener)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML () {
    return !this.div
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
        * {
            box-sizing: border-box;
        }
        .location-list__letter {
            margin-bottom: var(--mdx-sys-spacing-flex-s);
        }
        .location-list__letter-wrapper {
            margin-bottom: var(--mdx-sys-spacing-flex-m);
        }
    `
  }

  /**
   * Render HTML
   * @returns Promise<void>
   */
  renderHTML () {
    const warnMandatory = (key) => `data attribute requires: ${key}`
    const data = LocationList.parseAttribute(this.getAttribute('data'))
    if (!data) return console.error('Data json attribute is missing or corrupted!', this)

    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

    this.html = /* HTML */`
        <div>
            <ul>
                ${alphabet.map(letter => {
                    // if an object for this letter exists inside the data object render a link otherwise just text
                    return data[letter]
                        ? `<li><a href="#${data[letter]?.id}">${letter}</a></li>`
                        : `<li><span>${letter}</span></li>`
                })}
            </ul>
            ${Object.keys(data).map(letter => {
                    return /* html */`
                        <div id="${data[letter].id || warnMandatory('id')}" class="location-list__letter-wrapper">
                            <ks-a-heading tag="h2" style-as="h1" class="location-list__letter">${letter.toUpperCase()}</ks-a-heading>
                            <o-grid namespace="grid-12er-" gap="3rem">
                                ${data[letter].locations
                                    ? data[letter].locations.map(location => {
                                        return /* html */`
                                            <div col-sm="12" col-lg="6">
                                                <ks-m-link-item
                                                    label="${location.name || warnMandatory('name (in location object)')}"
                                                    description="${location.address || warnMandatory('address (in location object)')}"
                                                    href="${location.href || warnMandatory('href (in location object)')}"
                                                >
                                                </ks-m-link-item>
                                            </div>
                                        `
                                    }).join('\n')
                                    : warnMandatory('locations (in letter object)')
                                }
                            </o-grid>
                        </div>
                    `
            }).join('\n')}
        </div>
    `
    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../atoms/heading/Heading.js`,
        name: 'ks-a-heading'
      },
      {
        path: `${this.importMetaUrl}../../molecules/linkItem/LinkItem.js`,
        name: 'ks-m-link-item'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/organisms/grid/Grid.js`,
        name: 'o-grid'
      }
    ])
  }

  scrollHashIntoView () {
    this.root.querySelector(window.location.hash).scrollIntoView({ behavior: 'smooth' })
  }

  anchorListener (event) {
    if (event.target.tagName === 'A' && event.target.hash) {
      this.scrollHashIntoView()
    }
  }

  get div () {
    return this.root.querySelector('div')
  }
}
