// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class OffersPage
* @type {CustomElementConstructor}
*/
export default class OffersPage extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.setTotalListener = (event) => {
      Promise.resolve(event.detail.fetch).then((data) => {
        if (data.total > data.psize * data.ppage) {
          const bodySection = this.eventDetailURL ? this.root.querySelector('ks-o-body-section') : this.ksMTab.shadowRoot.querySelector('ks-o-body-section')
          bodySection.shadowRoot.querySelector('#pagination').classList.remove('hidden')
        }
      })
    }
  }

  connectedCallback () {
    this.hidden = true
    const showPromises = []
    if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
    if (this.shouldRenderHTML()) showPromises.push(this.renderHTML())
    Promise.all(showPromises).then(() => {
      this.hidden = false
    })
    this.addEventListener('with-facet', this.setTotalListener)
  }

  disconnectedCallback () {
    this.removeEventListener('with-facet', this.setTotalListener)
  }

  shouldRenderCSS () {
    return !this.root.querySelector(
      `:host > style[_css], ${this.tagName} > style[_css]`
    )
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML () {
    return !this.root.querySelector('ks-c-with-facet') || !this.ksMTab
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        display: contents !important;
      }
      :host ks-o-body-section {
        padding: 3.375em 0 5em;
      }
      @media only screen and (max-width: _max-width_) {
        :host ks-o-body-section {
          padding: 3em 0 4em;
        }
      }
    `
    return Promise.resolve()
  }

  /**
   * Render HTML
   * @return Promise<void>
   */
  renderHTML () {
    this.html = this.eventDetailURL ? this.tabContentOne : /* html */`
      <ks-m-tab>
        <ul class="tab-search-result">
            <li>
              <ks-a-with-facet-counter>
                <button class="active" tab-target="content1" id="total-offers-tab-heading">&nbsp;</button>
              </ks-a-with-facet-counter>
            </li>
            <li>
              <ks-a-with-facet-counter label=" Story & Informationen" total="contentItems.length">
                <button tab-target="content2" id="total-stories-tab-heading"></button>
              </ks-a-with-facet-counter>
            </li>
        </ul>
          <div>
            <div id="content1" tab-content-target>
                ${this.tabContentOne}
            </div>
            <div id="content2" tab-content-target>
                ${this.tabContentTwo}
            </div>
        </div>
      </ks-m-tab>
    `

    if (this.badgeContainer) {
      this.badgeContainer.remove()
    }

    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../molecules/tab/Tab.js`,
        name: 'ks-m-tab'
      },
      {
        path: `${this.importMetaUrl}../../molecules/badgeLegend/BadgeLegend.js`,
        name: 'ks-m-badge-legend'
      },
      {
        path: `${this.importMetaUrl}../../controllers/withFacet/WithFacet.js`,
        name: 'ks-c-with-facet'
      },
      {
        path: `${this.importMetaUrl}../../controllers/eventDetail/EventDetail.js`,
        name: 'ks-c-event-detail'
      },
      {
        path: `${this.importMetaUrl}../../controllers/autoCompleteLocation/AutoCompleteLocation.js`,
        name: 'ks-c-auto-complete-location'
      },
      {
        path: `${this.importMetaUrl}../../controllers/autoComplete/AutoComplete.js`,
        name: 'ks-c-auto-complete'
      },
      {
        path: `${this.importMetaUrl}../../molecules/autoCompleteList/AutoCompleteList.js`,
        name: 'ks-m-auto-complete-list'
      },
      {
        path: `${this.importMetaUrl}../../organisms/bodySection/BodySection.js`,
        name: 'ks-o-body-section'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/organisms/grid/Grid.js`,
        name: 'o-grid'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/molecules/dialog/Dialog.js`,
        name: 'm-dialog'
      },
      {
        path: `${this.importMetaUrl}../../atoms/heading/Heading.js`,
        name: 'ks-a-heading'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/input/Input.js`,
        name: 'a-input'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/button/Button.js`,
        name: 'a-button'
      },
      {
        path: `${this.importMetaUrl}../../molecules/filterCategories/FilterCategories.js`,
        name: 'ks-m-filter-categories'
      },
      {
        path: `${this.importMetaUrl}../../atoms/numberOfOffersButton/NumberOfOffersButton.js`,
        name: 'ks-a-number-of-offers-button'
      },
      {
        path: `${this.importMetaUrl}../../atoms/button/Button.js`,
        name: 'ks-a-button'
      },
      {
        path: `${this.importMetaUrl}../../molecules/filterSelect/FilterSelect.js`,
        name: 'ks-m-filter-select'
      },
      {
        path: `${this.importMetaUrl}../../molecules/sort/Sort.js`,
        name: 'ks-m-sort'
      },
      {
        path: `${this.importMetaUrl}../../atoms/withFacetCounter/WithFacetCounter.js`,
        name: 'ks-a-with-facet-counter'
      },
      {
        path: `${this.importMetaUrl}../../atoms/withFacetPagination/WithFacetPagination.js`,
        name: 'ks-a-with-facet-pagination'
      },
      {
        path: `${this.importMetaUrl}../../molecules/tileFactory/TileFactory.js`,
        name: 'ks-m-tile-factory'
      },
      {
        path: `${this.importMetaUrl}../../molecules/contentSearchItem/ContentSearchItem.js`,
        name: 'ks-m-content-search-item'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/picture/Picture.js`,
        name: 'a-picture'
      },
      {
        path: `${this.importMetaUrl}../../molecules/contentFactory/ContentFactory.js`,
        name: 'ks-m-content-factory'
      }
    ])
  }

  get tabContentOne () {
    const initialRequest = this.getAttribute('initial-request')
    return /* html */ `
      <ks-c-with-facet
        ${this.hasAttribute('endpoint') ? `endpoint="${this.getAttribute('endpoint')}"` : ''}
        ${this.hasAttribute('mock') ? ` mock="${this.getAttribute('mock')}"` : ''}
        ${this.hasAttribute('initial-request') ? ` initial-request='${initialRequest}'` : ''}
      >
        ${this.eventDetailURL ? `<ks-c-event-detail endpoint="${this.eventDetailURL}">` : ''}
          <!-- ks-o-body-section is only here to undo the ks-c-with-facet within body main, usually that controller would be outside of the o-body --->
          <ks-o-body-section variant="default" no-margin-y background-color="var(--mdx-sys-color-accent-6-subtle1)" id="with-facet-body-section">
              <o-grid namespace="grid-12er-">
                <div col-lg="12" col-md="12" col-sm="12">
                  <ks-a-with-facet-counter></ks-a-with-facet-counter>
                </div>
                ${this.eventDetailURL ? '' : /* HTML */ `
                  <div col-lg="6" col-md="6" col-sm="12">
                    <ks-c-auto-complete
                      ${this.hasAttribute('endpoint-auto-complete') ? `endpoint-auto-complete="${this.getAttribute('endpoint-auto-complete')}"` : ''}
                      ${this.hasAttribute('mock-auto-complete') ? ' mock' : ''} 
                    >
                      <m-dialog namespace="dialog-top-slide-in-" id="keyword-search" close-event-name="close-search-dialog">
                        <div class="container">
                          <a-input
                            inputid="offers-page-input-search"
                            autofocus
                            placeholder="Suchen..."
                            icon-name="Search" 
                            icon-size="1.5em"
                            submit-search="request-auto-complete"
                            any-key-listener
                            type="search"
                            answer-event-name="search-change"
                            delete-listener
                            search
                          >
                          </a-input>
                          <div id="close">
                              <a-icon-mdx icon-name="Plus" size="2em" ></a-icon-mdx>
                          </div>
                        </div>
                        <div class="container">
                          <ks-m-auto-complete-list auto-complete-selection="auto-complete-selection">
                          </ks-m-auto-complete-list>
                        </div>
                        <a-input
                          id="show-modal"
                          inputid="show-modal"
                          placeholder="Ihr Angebot"
                          icon-name="Search"
                          icon-size="1.25em"
                          search type="search"
                          answer-event-name="search-change"
                        >
                        </a-input>
                      </m-dialog>
                    </ks-c-auto-complete>
                  </div>
                  <div col-lg="6" col-md="6" col-sm="12">
                      <ks-c-auto-complete-location ${this.hasAttribute('google-api-key') ? `google-api-key="${this.getAttribute('google-api-key')}"` : 'google-api-key="AIzaSyC9diW31HSjs3QbLEbso7UJzeK7IpH9c2s"'}>
                          <m-dialog namespace="dialog-top-slide-in-" id="location-search" close-event-name="close-location-dialog">
                              <div class="container">
                                  <a-input 
                                    id="offers-page-location-search-input"
                                    inputid="offers-page-location-search" 
                                    placeholder="Ihr Standort?" 
                                    icon-name="Location" 
                                    icon-size="1.5em" 
                                    search
                                    autofocus 
                                    submit-search="request-auto-complete-location" 
                                    any-key-listener 
                                    type="search"
                                    delete-listener
                                    answer-event-name="location-change"
                                  >
                                  </a-input>
                                  <div id="close">
                                      <a-icon-mdx icon-name="Plus" size="2em" ></a-icon-mdx>
                                  </div>
                              </div>
                              <div class="container">
                                  <ks-m-auto-complete-list auto-complete-location auto-complete="auto-complete-location" auto-complete-selection="auto-complete-location-selection">
                                      <ul>
                                          <li id="user-location">
                                              <a-icon-mdx namespace="icon-mdx-ks-" icon-url="../../../../../../../img/icons/icon-locali.svg" size="1.2em" hover-on-parent-element></a-icon-mdx>
                                              <span>Aktueller Standort</span>
                                          </li>
                                      </ul>
                                  </ks-m-auto-complete-list>
                              </div>
                              <a-input 
                                id="show-modal-location"
                                inputid="show-modal"
                                placeholder="Ihr Standort"
                                icon-name="Location"
                                icon-size="1.25em"
                                search
                                type="search"
                                answer-event-name="location-change"
                              >
                              </a-input>
                          </m-dialog>
                      </ks-c-auto-complete-location>
                    </div>
                `}
              </o-grid>
              <m-dialog namespace="dialog-left-slide-in-" show-event-name="dialog-open-first-level" close-event-name="backdrop-clicked" id="offers-page-filter-categories">
                  <!-- overlayer -->
                  <div class="container dialog-header" tabindex="0">
                      <div id="back">
                          &nbsp;
                      </div>
                      <h3>Filter</h3>
                      <div id="close">
                          <a-icon-mdx icon-name="Plus" size="2em"></a-icon-mdx>
                      </div>
                  </div>
                  <div class="container dialog-content">
                      <p class="reset-link">
                          <a-button namespace="button-transparent-" request-event-name="reset-all-filters">Alles zur&uuml;cksetzen <a-icon-mdx class="icon-right" icon-name="RotateLeft" size="1em"></a-icon-mdx>
                          </a-button>
                      </p>
                      <div class="sub-content">
                          <ks-c-auto-complete
                            input-change="search-change"
                            ${this.hasAttribute('endpoint-auto-complete') ? `endpoint-auto-complete="${this.getAttribute('endpoint-auto-complete')}"` : ''}
                            ${this.hasAttribute('mock-auto-complete') ? ' mock' : ''} 
                          >
                            <m-dialog namespace="dialog-top-slide-in-" id="keyword-search" close-event-name="close-search-dialog">
                              <div class="container">
                                <a-input
                                  inputid="offers-page-input-search"
                                  autofocus
                                  placeholder="Angebot suchen"
                                  icon-name="Search" 
                                  icon-size="calc(20rem/18)"
                                  submit-search="request-auto-complete"
                                  any-key-listener
                                  type="search"
                                  answer-event-name="search-change"
                                  delete-listener
                                  search
                                >
                                </a-input>
                                <div id="close">
                                    <a-icon-mdx icon-name="Plus" size="2em" ></a-icon-mdx>
                                </div>
                              </div>
                              <div class="container">
                                <ks-m-auto-complete-list auto-complete-selection="auto-complete-selection">
                                </ks-m-auto-complete-list>
                              </div>
                              <a-input
                                id="show-modal"
                                inputid="show-modal"
                                placeholder="Ihr Angebot"
                                icon-name="Search"
                                icon-size="1.25em"
                                search type="search"
                                answer-event-name="search-change"
                              >
                              </a-input>
                            </m-dialog>
                          </ks-c-auto-complete>
                          <ks-m-filter-categories namespace="filter-default-" lang="de" translation-key-close="Schliessen" translation-key-reset="zur&uuml;cksetzen"></ks-m-filter-categories>
                      </div>
                  </div>
                  <div class="container dialog-footer">
                      <a-button id="close" namespace="button-secondary-" no-pointer-events>Schliessen</a-button>
                      <ks-a-number-of-offers-button id="close" class="button-show-all-offers" namespace="button-primary-" no-pointer-events translation-key-cta="Angebote">Angebote</ks-a-number-of-offers-button>
                  </div>
              </m-dialog>
              <o-grid namespace="grid-432-auto-colums-auto-rows-">
                  <style>
                    :host {
                      /* filter buttons have the exception of being fully rounded, that's why I am setting border-radius here */
                      --button-primary-border-radius: 999px;
                      --button-secondary-border-radius: 999px;
                    }
                  </style>
                  <ks-a-button namespace="button-primary-" color="secondary" request-event-name="dialog-open-first-level" click-no-toggle-active>
                      <a-icon-mdx icon-name="FilterKlubschule" size="1em" class="icon-left"></a-icon-mdx>Alle Filter
                  </ks-a-button>
                  <ks-m-filter-select></ks-m-filter-select>
              </o-grid>
              <section>
                  <ks-m-sort namespace="sort-right-"></ks-m-sort>
              </section>
              <ks-m-tile-factory ${this.eventDetailURL ? 'is-event ' : ''}></ks-m-tile-factory>
              ${this.badgeContainer ? /* HTML */ `
                <ks-m-badge-legend>
                  ${this.badgeContainer.innerHTML}
                </ks-m-badge-legend>
              ` : ''}
              <ks-a-with-facet-pagination class="hidden" id="pagination">
                <ks-a-button namespace="button-primary-" color="secondary">
                    <span>Weitere Angebote</span>
                    <a-icon-mdx namespace="icon-mdx-ks-" icon-name="ArrowDownRight" size="1em" class="icon-right">
                </ks-a-button>
              </ks-a-with-facet-pagination>
          </ks-o-body-section>
        ${this.eventDetailURL ? '</ks-c-event-detail>' : ''}
      </ks-c-with-facet>
    `
  }

  get tabContentTwo () {
    return /* HTML */ `
      <ks-o-body-section  variant="default" no-margin-y background-color="var(--mdx-sys-color-accent-6-subtle1)"">
        <o-grid namespace="grid-12er-">
          <div col-lg="12" col-md="12" col-sm="12">
            <ks-m-content-factory></ks-m-content-factory>
            <!--<ks-m-content-search-item>
              <a href="#">
                <div>
                    <h3>Lorem Ipsum Headline</h3>
                    <p>Lorem ipsum dolor sit amet, <strong>consectetur</strong> adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </div>
                <a-picture picture-load defaultSource="http://via.placeholder.com/150x100" alt="more content"></a-picture>
              </a>
            </ks-m-content-search-item>
            <ks-m-content-search-item>
              <a href="#">
                <div>
                  <h3>Lorem Ipsum Headline</h3>
                  <p>Lorem ipsum dolor sit amet, <strong>consectetur</strong> adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </div>
                <a-picture picture-load defaultSource="http://via.placeholder.com/150x100" alt="more content"></a-picture>
              </a>
            </ks-m-content-search-item>
            <ks-m-content-search-item>
              <a href="#">
                <div>
                  <h3>Lorem Ipsum Headline</h3>
                  <p>Lorem ipsum dolor sit amet, <strong>consectetur</strong> adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </div>
              </a>
            </ks-m-content-search-item>
            <ks-m-content-search-item>
              <a href="#">
                <div>
                  <h3>Lorem Ipsum Headline</h3>
                  <p>Lorem ipsum dolor sit amet, <strong>consectetur</strong> adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </div>
                <a-picture picture-load defaultSource="http://via.placeholder.com/150x100" alt="more content"></a-picture>
              </a>
            </ks-m-content-search-item>
            <ks-m-content-search-item>
              <a href="#">
                <div>
                  <h3>Lorem Ipsum Headline</h3>
                  <p>Lorem ipsum dolor sit amet, <strong>consectetur</strong> adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </div>
                <a-picture picture-load defaultSource="http://via.placeholder.com/150x100" alt="more content"></a-picture>
              </a>
            </ks-m-content-search-item>
            <ks-m-content-search-item>
              <a href="#">
                <div>
                  <h3>Lorem Ipsum Headline</h3>
                  <p>Lorem ipsum dolor sit amet, <strong>consectetur</strong> adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </div>
                <a-picture picture-load defaultSource="http://via.placeholder.com/150x100" alt="more content"></a-picture>
              </a>
            </ks-m-content-search-item>
            <ks-m-content-search-item>
              <a href="#">
                <div>
                  <h3>Lorem Ipsum Headline</h3>
                  <p>Lorem ipsum dolor sit amet, <strong>consectetur</strong> adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </div>
                <a-picture picture-load defaultSource="http://via.placeholder.com/150x100" alt="more content"></a-picture>
              </a>
            </ks-m-content-search-item>
            <ks-m-content-search-item>
              <a href="#">
                <div>
                  <h3>Lorem Ipsum Headline</h3>
                  <p>Lorem ipsum dolor sit amet, <strong>consectetur</strong> adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </div>
              </a>
            </ks-m-content-search-item>-->
          </div>
        </o-grid>
      </ks-o-body-section>
    `
  }

  get ksMTab () {
    return this.root.querySelector('ks-m-tab')
  }

  get badgeContainer() {
    return this.root.querySelector('ks-m-badge-legend')
  }

  get eventDetailURL () {
    return this.hasAttribute('event-detail-url') ? this.getAttribute('event-detail-url') : null
  }
}
