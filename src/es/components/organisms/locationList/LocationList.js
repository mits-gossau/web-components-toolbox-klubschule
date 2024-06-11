// @ts-check
import { Anchor } from '../../web-components-toolbox/src/es/components/prototypes/Anchor.js'

/**
* @export
* @class LocationList
* @type {CustomElementConstructor}
*/
export default class LocationList extends Anchor() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    super.connectedCallback()
    if (this.shouldRenderCSS()) { this.renderCSS() }
    if (this.shouldRenderHTML()) { this.renderHTML() }
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return this.hasAttribute('id') ? !this.root.querySelector(`:host > style[_css], #${this.getAttribute('id')} > style[_css]`) : !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`) 
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
            padding: 0;
            margin: 0;
        }
        ul, li { list-style: none; }
        .location-list__letter {
            margin-bottom: var(--mdx-sys-spacing-flex-s);
        }
        .location-list__letter-wrapper {
            margin-bottom: var(--mdx-sys-spacing-flex-m);
        }
        .location-list__anchor-navigation {
            display: flex;
            flex-wrap: wrap;
            font: var(--mdx-sys-font-fix-label0, inherit);
            gap: var(--mdx-sys-spacing-fix-xs, 0.5rem) var(--mdx-sys-spacing-fix-m, 1.5rem);
            margin-bottom: var(--mdx-sys-spacing-flex-m);
        }
        .location-list__anchor-link > a,
        .location-list__anchor-link > span {
            padding: var(--mdx-sys-spacing-fix-xs) 0;
            position: relative;
            color: inherit;
            text-decoration: none;
            display: inline-block;
        }
        .location-list__anchor-link > a:hover {
            color: var(--mdx-sys-color-primary-default);
        }
        .location-list__anchor-link > span {
            color: var(--mdx-sys-color-neutral-subtle4);
        }
        .location-list__anchor-link > a.active::before {
            content: '';
            display: block;
            position: absolute;
            height: 2px;
            bottom: 0;
            left: 0;
            right: 0;
            background: var(--mdx-sys-color-primary-default, currentColor);
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
            ${!this.hasAttribute('hide-anchor-nav')
                ? /* html */`<ul class="location-list__anchor-navigation">
                    ${alphabet.map(letter => {
                        // if an object for this letter exists inside the data object render a link otherwise just text
                        return data[letter]
                            ? /* html */`<li class="location-list__anchor-link"><a href="#${data[letter]?.id}">${letter}</a></li>`
                            : /* html */`<li class="location-list__anchor-link"><span>${letter}</span></li>`
                    }).join('')}
                </ul>`
                : ''}
            ${Object.keys(data).map(letter => {
                    return /* html */`
                        <div id="${data[letter].id || warnMandatory('id')}" class="location-list__letter-wrapper">
                            <ks-a-heading tag="h2" style-as="h1" class="location-list__letter">${letter.toUpperCase()}</ks-a-heading>
                            <o-grid namespace="grid-12er-" gap="3rem" gap-mobile="1rem">
                              <section>
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
                                    }).join('')
                                    : warnMandatory('locations (in letter object)')
                                }
                              </section>
                            </o-grid>
                        </div>
                    `
            }).join('')}
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

  get div () {
    return this.root.querySelector('div')
  }
}
