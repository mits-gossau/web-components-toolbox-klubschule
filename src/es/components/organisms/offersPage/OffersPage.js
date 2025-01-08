// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/* global CustomEvent */

/**
* @export
* @class OffersPage
* @type {CustomElementConstructor}
* note: headless makes sure that no filters are loaded
* note: is-wish-list makes sure that no badge legend is loaded
* note: is-info-events makes sure that the headline is shown
* TODO: take headless to hide the badge legend
*/
export default class OffersPage extends Shadow() {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.setAttribute('with-facet-target', '')

    this.hasCourses = false

    this.withFacetListener = (event) => {
      Promise.resolve(event.detail.fetch).then((data) => {
        this.data = data
        this.searchTerm = data.searchText
        if (this.data.courses?.length > 0) this.hasCourses = true

        const otherLocationsHeadline = this.getTranslation('CourseList.LabelOtherLocations').replace('{course_title}', this.data.courses[0]?.bezeichnung)
        const bodySection = this.eventDetailURL || !this.ksMTab || this.isWishList ? this.root.querySelector('ks-o-body-section') : this.ksMTab.root.querySelector('ks-o-body-section')
        if (!this.isWishList || this.hasAttribute('is-info-events')) bodySection.root.querySelector('#pagination').style.display = !data || data.ppage === -1 ? 'none' : 'block'

        // Set headline for info events
        if (this.hasAttribute('is-info-events') && this.hasCourses) {
          const headlineContainer = bodySection.root.querySelector('#info-events-headline-container')
          headlineContainer.innerHTML = /* html */ `
            <ks-a-spacing type="m-flex"></ks-a-spacing>
            <ks-a-heading tag="h2" no-margin-x>
              ${this.getTranslation('CourseList.ConsultingInfoEvent')}
            </ks-a-heading>
          `
        }
        // Set headline for other locations
        if (this.hasAttribute('is-other-locations') && this.hasCourses) {
          const headlineContainer = bodySection.root.querySelector('#other-locations-headline-container')
          headlineContainer.innerHTML = /* html */ `
            <ks-a-heading tag="h2" no-margin-x>
              ${otherLocationsHeadline}
            </ks-a-heading>
          `
        }

        // Set Sort
        const sort = bodySection.root.querySelector('#sort-options')
        if (sort && !this.eventDetailURL) {
          this.fetchModules([
            {
              path: `${this.importMetaUrl}../../molecules/sort/Sort.js`,
              name: 'ks-m-sort'
            }
          ])
          const listElements = this.data.sort.items.reduce((acc, data) => acc + /* html */ `
            <li ${this.data.sort.sort === data.id ? 'active' : ''} id="${data.id}">
              ${data.label}
            </li>
          `, '')
          sort.innerHTML = /* html */ `
            <ks-m-sort namespace="sort-right-" with-facet>
              ${this.data?.sort?.items?.length ? /* html */ `
                <ul main-text="${this.data.sort.items.find(item => item.id === this.data.sort.sort)?.label || ''}">
                  ${listElements}
                </ul>
              ` : ''}
            </ks-m-sort>
          `
          // adjust load more button text depending the sort option
          let moreText
          if ((moreText = bodySection.root.querySelector('ks-a-with-facet-pagination')?.querySelector('ks-a-button')?.root.querySelector('.more-text'))) {
            moreText.textContent = this.data.sort.sort === 2 ? this.getTranslation('CourseList.MoreLocationsPlaceholder') : this.getTranslation('CourseList.MoreOffersPlaceholder')
          }
        }
      })
    }
    this.isEasyPortal = !!this.hasAttribute('is-easy-portal')
  }

  connectedCallback() {
    this.hidden = true
    new Promise(resolve => {
      this.dispatchEvent(new CustomEvent('request-translations',
        {
          detail: {
            resolve
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }))
    }).then(async result => {
      await result.fetch
      this.getTranslation = result.getTranslationSync
      const showPromises = []
      if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
      if (this.shouldRenderHTML()) showPromises.push(this.renderHTML())
      Promise.all(showPromises).then(() => (this.hidden = false))
    })
    this.addEventListener('with-facet', this.withFacetListener)
  }

  disconnectedCallback() {
    this.removeEventListener('with-facet', this.withFacetListener)
  }

  shouldRenderCSS() {
    return !this.root.querySelector(
      `${this.cssSelector} > style[_css]`
    )
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML() {
    return !this.root.querySelector('ks-c-with-facet') && !this.ksMTab
  }

  /**
   * Fill markup with none static data
   */
  withFacetListener(event) {
    Promise.resolve(event.detail.fetch).then((data) => {
      this.data = data
      const bodySection = this.eventDetailURL || !this.ksMTab || this.isWishList ? this.root.querySelector('ks-o-body-section') : this.ksMTab.root.querySelector('ks-o-body-section')

      // Set Sort
      const sort = bodySection.root.querySelector('#sort-options')
      if (sort) {
        this.fetchModules([
          {
            path: `${this.importMetaUrl}../../molecules/sort/Sort.js`,
            name: 'ks-m-sort'
          }
        ])
        const listElements = this.data.sort.items.reduce((acc, data) => acc + /* html */ `
          <li ${this.data.sort.sort === data.id ? 'active' : ''} id="${data.id}">
            ${data.label}
          </li>
        `, '')
        sort.innerHTML = /* html */ `
          <ks-m-sort namespace="sort-right-" with-facet>
            ${this.data?.sort?.items?.length ? /* html */ `
              <ul main-text="${this.data.sort.items.find(item => item.id === this.data.sort.sort).label}">
                ${listElements}
              </ul>
            ` : ''}
          </ks-m-sort>
        `
      }
    })
  }

  /**
   * renders the css
   */
  renderCSS() {
    this.css = /* css */`
      :host {
        display: contents !important;
        --any-content-spacing: 0;
      }
      :host .main-search-wrapper {
        width: var(--body-section-default-width);
        margin: 0 auto;
        padding: 3.375em 0 2rem 0;
      }
      :host ks-o-body-section {
        padding: 3.375em 0 5em;
      }
      :host([headless]) ks-o-body-section {
        padding: 0;
      }
      :host ks-m-sort {
        --sort-right-item-min-width: 10rem;
     }
     :host ks-a-with-facet-pagination {
      display: none;
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
  renderHTML() {
    this.html = /* html */`<ks-c-with-facet
        ${this.hasAttribute('save-location-local-storage') ? 'save-location-local-storage' : ''}
        ${this.hasAttribute('save-location-session-storage') ? 'save-location-session-storage' : ''}
        ${this.hasAttribute('endpoint') ? `endpoint="${this.getAttribute('endpoint')}"` : ''}
        ${this.hasAttribute('endpoint-info-events') ? `endpoint-info-events="${this.getAttribute('endpoint-info-events')}"` : ''}
        ${this.hasAttribute('mock') ? ` mock="${this.getAttribute('mock')}"` : ''}
        ${this.hasAttribute('mock-info-events') ? ` mock-info-events="${this.getAttribute('mock-info-events')}"` : ''}
        ${this.hasAttribute('initial-request') ? ` initial-request='${this.getAttribute('initial-request').replace(/'/g, '’').replace(/"/g, '\"')}'` : ''}
        ${this.hasAttribute('no-search-tab') ? 'no-search-tab' : ''}
        ${this.hasAttribute('expand-event-name') ? ` expand-event-name='${this.getAttribute('expand-event-name')}'` : ''}
        ${this.hasAttribute('is-other-locations') ? ' is-other-locations' : ''}
      >
      <ks-c-partner-search ${this.hasAttribute('initial-request') ? ` initial-request='${this.getAttribute('initial-request').replace(/'/g, '’').replace(/"/g, '\"')}'` : ''} ${this.hasAttribute('endpoint-search-partner') ? `endpoint="${this.getAttribute('endpoint-search-partner')}"` : ''}${this.hasAttribute("alternative-portal-ids-search") ? ` alternative-portal-ids-search="${this.getAttribute("alternative-portal-ids-search")}"` : ''}>
        ${this.hasAttribute('with-main-search-input')
        ? this.mainSearchInput
        : /* html */``
      } 
        ${this.eventDetailURL || this.hasAttribute('no-search-tab') || this.isWishList
        ? this.tabContentOne
        : /* html */`
            <ks-m-tab>
              <ul class="tab-search-result">
                <li data-tab="courses">
                  <ks-a-with-facet-counter label="${this.getTranslation('Search.TabCourse')}" ${this.hasAttribute('with-facet-target') ? ' with-facet-target' : ''}>
                    <button class="active" tab-target="content1" id="total-offers-tab-heading">&nbsp;</button>
                  </ks-a-with-facet-counter>
                </li>
                <li data-tab="content">
                  <ks-a-with-facet-counter label="${this.getTranslation('Search.TabContent')}" ${this.hasAttribute('with-facet-target') ? ' with-facet-target' : ''} total="contentItems.length">
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
      }
      </ks-c-partner-search>
    </ks-c-with-facet>`

    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../molecules/badgeLegend/BadgeLegend.js`,
        name: 'ks-m-badge-legend'
      },
      {
        path: `${this.importMetaUrl}../../controllers/withFacet/WithFacet.js`,
        name: 'ks-c-with-facet'
      },
      {
        path: `${this.importMetaUrl}../../controllers/partnerSearch/PartnerSearch.js`,
        name: 'ks-c-partner-search'
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
        path: `${this.importMetaUrl}../../atoms/spacing/Spacing.js`,
        name: 'ks-a-spacing'
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
        path: `${this.importMetaUrl}../../atoms/spacing/Spacing.js`,
        name: 'ks-a-spacing'
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
      },
      {
        path: `${this.importMetaUrl}../../molecules/tab/Tab.js`,
        name: 'ks-m-tab'
      },
      {
        path: `${this.importMetaUrl}../../molecules/badge/Badge.js`,
        name: 'ks-m-badge'
      }
    ])
  }

  get tabContentOne() {
    const searchInput = this.hasAttribute('with-search-input') ? /* html */`
      <div col-lg="6" col-md="6" col-sm="12">
        <ks-c-auto-complete
          no-forwarding
          reset-input-value-based-url="q"
          ${this.hasAttribute('endpoint-auto-complete') ? `endpoint-auto-complete="${this.getAttribute('endpoint-auto-complete')}"` : ''}
          ${this.hasAttribute('search-url') ? `search-url="${this.getAttribute('search-url')}"` : ''}
          ${this.hasAttribute('mock-auto-complete') ? ' mock' : ''} 
          ${this.hasAttribute('with-auto-complete') ? '' : ' disabled'} 
        >
          <m-dialog namespace="dialog-top-slide-in-" id="keyword-search" show-event-name="show-search-dialog" close-event-name="close-search-dialog" dialog-mobile-height="100vh" dialog-desktop-height="40%">
            <dialog>
              <div class="container">
                <a-input
                  inputid="offers-page-input-search"
                  autofocus
                  placeholder="${this.getTranslation('Search.InputPlaceholder')}"
                  icon-name="Search" 
                  icon-size="1.5em"
                  submit-search="request-auto-complete"
                  submit-search="request-with-facet"
                  type="search"
                  answer-event-name="search-change"
                  delete-listener
                  search
                  autocomplete="off"
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
            </dialog>
            <ks-a-button 
              ellipsis-text id="show-modal" 
              namespace="button-search-" 
              answer-event-name="search-change"
              default-label="${this.getTranslation('CourseList.YourOfferPlaceholder')}"
            >
              <a-icon-mdx icon-name="Search" class="icon-right"></a-icon-mdx>
            </ks-a-button>
            <style protected>
              :host>a-button {
                position: absolute;
                right: 0;
                height: var(--button-search-height);
                --button-secondary-border-color: var(--m-gray-700);
                --button-secondary-background-color: var(--m-white);
                --button-secondary-border-color-hover-custom: var(--m-gray-700);
                --button-secondary-background-color-hover: var(--m-white);
                --button-secondary-border-radius: 0 var(--mdx-comp-button-secondary-medium-border-radius-default)  var(--mdx-comp-button-secondary-medium-border-radius-default) 0;
                --button-secondary-padding: 0.625rem 1.5rem;
              }
    
              @media only screen and (max-width: 767px) {
                :host>a-button {
                  --button-secondary-padding: 0.433rem 0.9rem;
                }
              }
            </style>
            <a-button namespace="button-secondary-" id="clear" request-event-name="reset-filter" filter-key="q">
              <style protected>
                :host>button,
                :host>button:hover {
                  border-left: none !important;
                  height: var(--button-search-height);
                }
              </style>
              <a-icon-mdx icon-name="X" class="icon-right">
              </a-icon-mdx>
            </a-button>
          </m-dialog>
        </ks-c-auto-complete>
      </div>
    ` : ''

    const locationInput = this.hasAttribute('with-location-input') ? /* html */`
      <div col-lg="6" col-md="6" col-sm="12" id="input-section-container">
        ${this.hasAttribute('with-location-input-label') ? /* html */`
          <style protected>
            :host .location-label { 
              font-size: var(--mdx-sys-font-flex-body3-font-size);
              font-weight: 500;
              line-height: 1.125rem;
              margin-bottom: 1rem;
            }
          </style>
          <h4 class="location-label">
            ${this.getTranslation('CourseList.FindOffersNearbyPlaceholder')}
          </h4>
        `: ``}
        <ks-c-auto-complete-location 
         ignore-search-input-icon-click
         reset-input-value-based-url="cname"
         ${this.hasAttribute('google-api-key') ? `google-api-key="${this.getAttribute('google-api-key')}"` : 'google-api-key="AIzaSyC9diW31HSjs3QbLEbso7UJzeK7IpH9c2s"'}
        >
          <m-dialog namespace="dialog-top-slide-in-" show-event-name="show-location-search-dialog" id="location-search" close-event-name="close-location-dialog" dialog-mobile-height="100vh" dialog-desktop-height="40%">
            <dialog>
              <div class="container">
                <a-input 
                  id="offers-page-location-search-input"
                  inputid="offers-page-location-search" 
                  placeholder="${this.getTranslation('CourseList.YourLocationPlaceholder')}" 
                  icon-name="Location" 
                  icon-size="1.5em" 
                  search
                  autofocus 
                  submit-search="request-auto-complete-location" 
                  any-key-listener="200" 
                  type="search"
                  delete-listener
                  answer-event-name="location-change"
                  autocomplete="off"
                >
                </a-input>
                <style protected>
                  :host { 
                    --icon-color-hover: var(--search-input-color);
                  }
                </style>
                <div id="close">
                    <a-icon-mdx icon-name="Plus" size="2em" ></a-icon-mdx>
                </div>
              </div>
              <div class="container">
                <ks-m-auto-complete-list auto-complete-location auto-complete="auto-complete-location" use-keyup-navigation auto-complete-selection="auto-complete-location-selection">
                  <ul>
                    <li id="user-location">
                      <a-icon-mdx namespace="icon-mdx-ks-" icon-url="../../../../../../../img/icons/icon-locali.svg" size="1.2em" hover-on-parent-element></a-icon-mdx>
                      <span>${this.getTranslation('Search.CurrentLocation')}</span>
                    </li>
                  </ul>
                </ks-m-auto-complete-list>
              </div>
            </dialog>
            <ks-a-button 
              id="show-modal-location" 
              namespace="button-search-" 
              ellipsis-text 
              answer-event-name="location-change"
              default-label="${this.getTranslation('CourseList.YourLocationPlaceholder')}"
            >
              <a-icon-mdx icon-name="Location" class="icon-right"></a-icon-mdx>
            </ks-a-button>
        
            <style protected>
              :host>a-button {
                position: absolute;
                right: 0;
                height: var(--button-search-height);
                --button-secondary-border-color: var(--m-gray-700);
                --button-secondary-background-color: var(--m-white);
                --button-secondary-border-color-hover-custom: var(--m-gray-700);
                --button-secondary-background-color-hover: var(--m-white);
                --button-secondary-border-radius: 0 var(--mdx-comp-button-secondary-medium-border-radius-default)  var(--mdx-comp-button-secondary-medium-border-radius-default) 0;
                --button-secondary-padding: 0.625rem 1.5rem;
              }

              @media only screen and (max-width: 767px) {
                :host>a-button {
                  --button-secondary-padding: 0.433rem 0.9rem;
                }
              }
            </style>
            <a-button namespace="button-secondary-" id="clear" request-event-name="reset-filter" filter-key="cname">
              <style protected>
                :host>button,
                :host>button:hover {
                  border-left: none !important;
                  height: var(--button-search-height);
                }
              </style>
              <a-icon-mdx  icon-name="X" class="icon-right"></a-icon-mdx>
            </a-button>
          </m-dialog>
        </ks-c-auto-complete-location>
      </div>
    ` : ''

    const filterSearch = this.hasAttribute('with-filter-search') ? /* html */`
      <ks-c-auto-complete
        no-forwarding
        ${this.hasAttribute('endpoint-auto-complete') ? `endpoint-auto-complete="${this.getAttribute('endpoint-auto-complete')}"` : ''}
        ${this.hasAttribute('mock-auto-complete') ? ' mock' : ''} 
        ${this.hasAttribute('with-auto-complete') ? '' : ' disabled'} 
      >
        <a-input
          inputid="offers-page-input-search"
          autofocus
          placeholder="${this.getTranslation('CourseList.YourOfferPlaceholder')}"
          icon-name="Search"
          icon-size="1.25em"
          submit-search="request-auto-complete"
          type="search"
          answer-event-name="search-change"
          blur-listener
          enter-on-blur
          delete-listener
          autocomplete="off"
          search
        >
        </a-input>
      </ks-c-auto-complete>
    ` : ''


    return /* html */ `
        ${this.eventDetailURL ? /* html */`<ks-c-event-detail endpoint="${this.eventDetailURL}">` : ''}
          <!-- ks-o-body-section is only here to undo the ks-c-with-facet within body main, usually that controller would be outside of the o-body --->
          <ks-o-body-section 
            variant="default" 
            no-margin-y 
            ${this.hasAttribute('is-info-events') ? '' : this.hasAttribute('is-other-locations') ? `background-color="white"` : `background-color="var(--mdx-sys-color-accent-6-subtle1)"`} 
            id="with-facet-body-section"
          >
            ${this.hasAttribute('headless') 
        ? ''
        : /* html */`
              <o-grid namespace="grid-12er-">
                <style protected>
                  :host .input-section {
                    align-items: flex-end;
                  }
                </style>
                <section class="input-section">
                  ${this.hasAttribute('no-search-tab')
          ? /* html */`<div col-lg="12" col-md="12" col-sm="12">
                        <ks-a-with-facet-counter ${this.hasAttribute('with-facet-target') ? ' with-facet-target' : ''}></ks-a-with-facet-counter>
                      </div>`
          : ''}
                  ${this.eventDetailURL ? '' : searchInput}
                  ${locationInput}
                </section>
              </o-grid>
              
              <m-dialog namespace="dialog-left-slide-in-" show-event-name="dialog-open-first-level" close-event-name="backdrop-clicked" id="offers-page-filter-categories">
                <dialog>
                  <!-- overlayer -->
                  <div class="container dialog-header" tabindex="0">
                    <a-button id="close-back">
                      &nbsp;
                    </a-button>
                    <h3>${this.getTranslation('Filter')}</h3>
                    <a-button request-event-name="backdrop-clicked" id="close">
                      <a-icon-mdx icon-name="Plus" size="2em" rotate="45deg" no-hover-transform></a-icon-mdx>
                    </a-button>
                  </div>
                  <div class="container dialog-content">
                    <p class="reset-link">
                        <a-button namespace="button-transparent-" request-event-name="reset-all-filters">${this.getTranslation('Filter.ResetAllFilter')} <a-icon-mdx class="icon-right" icon-name="RotateLeft" size="1em"></a-icon-mdx>
                        </a-button>
                    </p>
                    <div class="sub-content">
                        ${filterSearch}
                        <ks-m-filter-categories
                          namespace="filter-default-" 
                          translation-key-close="${this.getTranslation('Filter.closeOverlayer')}" 
                          translation-key-reset="${this.getTranslation('Filter.ResetFilter')}"
                          ${this.hasAttribute('with-facet-target') ? ' with-facet-target' : ''}
                        ></ks-m-filter-categories>
                    </div>
                  </div>
                  <div class="container dialog-footer">
                    <a-button id="close" namespace="button-tertiary-" no-pointer-events>${this.getTranslation('Filter.closeOverlayer')}</a-button>
                    <ks-a-number-of-offers-button id="close" class="button-show-all-offers" namespace="button-primary-" no-pointer-events ${this.hasAttribute('with-facet-target') ? ' with-facet-target' : ''}></ks-a-number-of-offers-button>
                  </div>
                </dialog>
              </m-dialog>

              <ks-a-spacing type="s-flex"></ks-a-spacing>
              <o-grid namespace="grid-432-auto-colums-auto-rows-" id="filter-select-container">
                <section>
                  <style protected>
                    :host {
                      /* filter buttons have the exception of being fully rounded on all brands, that's why I am setting border-radius here */
                      --button-primary-border-radius: 999px;
                      --button-secondary-border-radius: 999px;
                    }
                  </style>
                  <!-- button to filter all -->
                  <ks-a-button small namespace="button-primary-" color="secondary" request-event-name="dialog-open-first-level" click-no-toggle-active>
                      <a-icon-mdx icon-name="FilterKlubschule" size="1em" class="icon-left"></a-icon-mdx>${this.getTranslation('CourseList.FilterAllPlaceholder')}
                  </ks-a-button>
                  <!-- buttons to filter -->
                  <ks-m-filter-select ${this.hasAttribute('with-filter-search') && !this.hasAttribute('with-search-input') ? 'with-filter-search-button' : ''}${this.hasAttribute('with-facet-target') ? ' with-facet-target' : ''}></ks-m-filter-select>
                </section>
              </o-grid>
              <ks-a-spacing type="s-flex"></ks-a-spacing>
              <section id="sort-options"></section>
              <ks-a-spacing type="s-fix"></ks-a-spacing>
            `}
              ${this.hasAttribute('is-info-events') ? /*html*/`<div id="info-events-headline-container" style="width:100%"></div>` : ''}
              ${this.hasAttribute('is-other-locations') ? /*html*/`<div id="other-locations-headline-container"></div>` : ''}
              <ks-m-tile-factory 
                ${this.eventDetailURL ? 'is-event ' : ''}
                ${this.isWishList ? ' is-wish-list' : ''}
                ${this.hasAttribute('is-info-events') ? ` is-info-events loading-text="${this.getTranslation('CourseList.LabelLoaderInfoEvent')}" style="width:100%"` : ''}
                ${this.hasAttribute('is-other-locations') ? ` is-other-locations next-start-dates-text="${this.getTranslation('CourseList.NextStartDatesText')}"` : ''}
                ${this.hasAttribute('with-facet-target') ? ' with-facet-target' : ''}
                ${this.hasAttribute('no-partner-search') ? ' no-partner-search' : ''}
                ${this.hasAttribute('error-text') ? ` error-text="${this.getAttribute('error-text')}"` : ''}
              >
                ${this.hiddenSectionsPartnerSearch.reduce((acc, hiddenSection) => (acc + hiddenSection.outerHTML), '')}
              </ks-m-tile-factory>
              <ks-a-spacing type="2xl-fix"></ks-a-spacing>
              ${this.isWishList && !this.hasAttribute('is-info-events') ? '' : /* html */ `
                <ks-a-with-facet-pagination 
                  id="pagination"
                  pagination-event-name="request-with-facet"
                  pagination-event-name="with-facet"
                  ${this.hasAttribute('with-facet-target') ? ' with-facet-target' : ''}
                >
                  <ks-a-button namespace="button-primary-" color="secondary">
                      <span class="more-text">${this.getTranslation('CourseList.MoreOffersPlaceholder')}</span>
                      <a-icon-mdx namespace="icon-mdx-ks-" icon-name="ArrowDownRight" size="1em" class="icon-right">
                  </ks-a-button>
                </ks-a-with-facet-pagination>
                <ks-a-spacing type="2xl-fix"></ks-a-spacing>
              `}
              ${this.isWishList || this.hasAttribute('is-other-locations') ? '' : /* html */ `
                <ks-m-badge-legend namespace="badge-legend-default-">
                  ${this.isEasyPortal
          ? /* html */`
                    <div>
                      <div class="badge-icon-only">
                        <a-icon-mdx namespace="icon-mdx-ks-badge-" icon-name="Key" size="1em"></a-icon-mdx>
                      </div>
                      <span>${this.getTranslation('Badge.Legend.KeyPlaceholder')}</span>
                    </div> 
                    `
          : ''
        }
                  ${this.hasAttribute('hide-abo-legend')
          ? ''
          : /* html */`
                      <div>
                        <div class="badge-icon-only">
                          <a-icon-mdx namespace="icon-mdx-ks-badge-" icon-name="Abo" size="1em"></a-icon-mdx>
                        </div>
                        <span>${this.getTranslation('Badge.Legend.AboPlaceholder')}</span>
                      </div>
                      <div>
                        <div class="badge-icon-only">
                          <a-icon-mdx namespace="icon-mdx-ks-badge-" icon-name="AboPlus" size="1em"></a-icon-mdx>
                        </div>
                        <span>${this.getTranslation('Badge.Legend.AboPlusPlaceholder')}</span>         
                      </div>`
        }
                  <div>
                    <div class="badge-icon-only">
                      <a-icon-mdx namespace="icon-mdx-ks-badge-" icon-name="Percent" size="1em"></a-icon-mdx>
                    </div>
                    <span>${this.getTranslation('Badge.Legend.PercentPlaceholder')}</span>
                  </div>
                </ks-m-badge-legend>`}
          </ks-o-body-section>
        ${this.eventDetailURL ? /* html */'</ks-c-event-detail>' : ''}
    `
  }

  get tabContentTwo() {
    return /* HTML */ `
      <ks-o-body-section  variant="default" no-margin-y background-color="var(--mdx-sys-color-accent-6-subtle1)">
        <o-grid namespace="grid-12er-">
          <section>
            <div col-lg="12" col-md="12" col-sm="12">
              <ks-m-content-factory
                ${this.hasAttribute('no-partner-search') ? ' no-partner-search' : ''}
                ${this.hasAttribute('error-text') ? `error-text="${this.getAttribute('error-text')}"` : ''}
              >
                ${this.hiddenSectionsPartnerSearch.reduce((acc, hiddenSection) => (acc + hiddenSection.outerHTML), '')}
              </ks-m-content-factory>
            </div>
          </section>
        </o-grid>
      </ks-o-body-section>
    `
  }

  get ksMTab() {
    return this.root.querySelector('ks-m-tab')
  }

  get eventDetailURL() {
    return this.hasAttribute('event-detail-url') ? this.getAttribute('event-detail-url') : null
  }

  get isWishList() {
    return this.hasAttribute('is-wish-list')
  }

  get hiddenSectionsPartnerSearch () {
    let result = Array.from(this.querySelectorAll('section[hidden]:not([slot=troublemaker])'))
    if (!result.length) result = Array.from(this.root.querySelectorAll('section[hidden]'))
    return result
  }

  get mainSearchInput() {
    return /* html */ `
    <div col-lg="6" col-md="6" col-sm="12" class="main-search-wrapper">
    <ks-c-auto-complete
      reset-input-value-based-url="q"
      no-forwarding
      ${this.hasAttribute('endpoint-auto-complete') ? `endpoint-auto-complete="${this.getAttribute('endpoint-auto-complete')}"` : ''}
      ${this.hasAttribute('with-auto-complete-content') ? `with-auto-complete-content` : ''}
      ${this.hasAttribute('search-url') ? `search-url="${this.getAttribute('search-url')}"` : ''}
      ${this.hasAttribute('mock-auto-complete') ? ' mock' : ''} 
      ${this.hasAttribute('with-auto-complete') ? '' : ' disabled'} 
    >
      <m-dialog namespace="dialog-top-slide-in-" id="keyword-search" show-event-name="show-search-dialog" close-event-name="close-search-dialog" dialog-mobile-height="100vh" dialog-desktop-height="40%">
        <dialog>
          <div class="container">
            <a-input
              inputid="offers-page-input-search"
              autofocus
              placeholder="${this.getTranslation('Search.InputPlaceholder')}"
              icon-name="Search" 
              icon-size="1.5em"
              submit-search="request-auto-complete"
              type="search"
              answer-event-name="search-change"
              delete-listener
              ${this.hasAttribute('with-auto-complete') ? 'any-key-listener' : ''}
              search
              autocomplete="${this.hasAttribute('endpoint-auto-complete') ? 'on' : 'off'}"
            >
            </a-input>
            <div id="close">
                <a-icon-mdx icon-name="Plus" size="2em" ></a-icon-mdx>
            </div>
          </div>
          <div class="container">
            <ks-m-auto-complete-list 
              auto-complete-selection="auto-complete-selection"
              ${this.hasAttribute('with-auto-complete-content') ? `with-auto-complete-content` : ''} 
            >
            </ks-m-auto-complete-list>
          </div>
        </dialog>
        <ks-a-button 
          ellipsis-text 
          id="show-modal" 
          namespace="button-search-" 
          answer-event-name="search-change"
          default-label="${this.getTranslation('CourseList.YourOfferPlaceholder')}"
        >
          <a-icon-mdx icon-name="Search" class="icon-right">
          </a-icon-mdx>
        </ks-a-button>

        <style protected>
          :host>a-button {
            position: absolute;
            right: 0;
            height: var(--button-search-height);
            --button-secondary-border-color: var(--m-gray-700);
            --button-secondary-background-color: var(--m-white);
            --button-secondary-border-color-hover-custom: var(--m-gray-700);
            --button-secondary-background-color-hover: var(--m-white);
            --button-secondary-border-radius: 0 var(--mdx-comp-button-secondary-medium-border-radius-default)  var(--mdx-comp-button-secondary-medium-border-radius-default) 0;
            --button-secondary-padding: 0.625rem 1.5rem;
          }

          @media only screen and (max-width: 767px) {
            :host>a-button {
              --button-secondary-padding: 0.433rem 0.9rem;
            }
          }
        </style>
        <a-button namespace="button-secondary-" id="clear" request-event-name="reset-filter" filter-key="q">
          <style protected>
            :host>button,
            :host>button:hover {
              border-left: none !important;
              height: var(--button-search-height);
            }
          </style>
          <a-icon-mdx icon-name="X" class="icon-right">
          </a-icon-mdx>
        </a-button>
      </m-dialog>
    </ks-c-auto-complete>
  </div>
  `
  }
}
