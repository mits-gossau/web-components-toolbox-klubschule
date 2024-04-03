// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class EventPage
* @type {CustomElementConstructor}
*/
export default class EventPage extends Shadow() {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback() {
    this.hidden = true
    const showPromises = []
    if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
    if (this.shouldRenderHTML()) showPromises.push(this.renderHTML())
    Promise.all(showPromises).then(() => {
      this.hidden = false
    })
  }

  disconnectedCallback () { }

  shouldRenderCSS() {
    return !this.root.querySelector(
      `:host > style[_css], ${this.tagName} > style[_css]`
    )
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML() {
    return !this.ksMTab
  }

  /**
   * renders the css
   */
  renderCSS() {
    this.css = /* css */`
      :host {
        --button-badge-padding: var(--mdx-sys-spacing-fix-3xs);
        --button-badge-border-radius: 3px;
        --button-primary-label-margin: 0;

        display: contents !important;
      }
      :host .m-badge__container {
        display: flex;
      }
    `
    return Promise.resolve()
  }

  /**
   * Render HTML
   * @return Promise<void>
   */
  renderHTML() {
    this.html = /* html */`
        <ks-c-with-facet
          ${this.hasAttribute('endpoint') ? `endpoint="${this.getAttribute('endpoint')}"` : ''}
          ${this.hasAttribute('mock') ? ` mock="${this.getAttribute('mock')}"` : ''}
          ${this.hasAttribute('initial-request') ? ` initial-request='${this.getAttribute('initial-request')}'` : ''}
        >
          <!-- ks-o-body-section is only here to undo the ks-c-with-facet within body main, usually that controller would be outside of the o-body --->
          <ks-o-body-section variant="default" no-margin-y background-color="var(--mdx-sys-color-accent-6-subtle1)">
              <o-grid namespace="grid-12er-">
                  <div col-lg="12" col-md="12" col-sm="12">
                    <ks-a-with-facet-counter ${this.hasAttribute('headline') ? ` headline="${this.getAttribute('headline')}"` : ''}>
                    </ks-a-with-facet-counter>
                  </div>
              </o-grid>
              <m-dialog namespace="dialog-left-slide-in-" show-event-name="dialog-open-first-level" close-event-name="backdrop-clicked">
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
                          <a-button namespace="button-transparent-">Alles zur&uuml;cksetzen <a-icon-mdx class="icon-right" icon-name="RotateLeft" size="1em"></a-icon-mdx>
                          </a-button>
                      </p>
                      <div class="sub-content">
                          <ks-m-filter-categories namespace="filter-default-" lang="de" translation-key-close="Schliessen" translation-key-reset="zur&uuml;cksetzen"></ks-m-filter-categories>
                      </div>
                  </div>
                  <div class="container dialog-footer">
                      <a-button id="close" namespace="button-secondary-" no-pointer-events>Schliessen</a-button>
                      <ks-a-number-of-offers-button id="close" class="button-show-all-offers" namespace="button-primary-" no-pointer-events translation-key-cta="Angebote">Angebote</ks-a-number-of-offers-button>
                  </div>
              </m-dialog>
              <o-grid namespace="grid-432-auto-colums-auto-rows-">
                  <ks-a-button namespace="button-primary-" color="secondary" request-event-name="dialog-open-first-level" click-no-toggle-active>
                      <a-icon-mdx icon-name="FilterKlubschule" size="1em" class="icon-left"></a-icon-mdx>Alle Filter
                  </ks-a-button>
                  <ks-m-filter-select></ks-m-filter-select>
              </o-grid>
              <section>
                  <ks-m-sort namespace="sort-right-"></ks-m-sort>
              </section>
              <ks-m-tile-factory></ks-m-tile-factory>
              <ks-a-button namespace="button-primary-" color="secondary">
                  <span>Weitere Angebote</span>
                  <a-icon-mdx namespace="icon-mdx-ks-" icon-name="ArrowDownRight" size="1em" class="icon-right">
              </ks-a-button>
              <ks-m-badge-legend>
                ${this.badgeContainer.innerHTML}
              </ks-m-badge-legend>
          </ks-o-body-section>
      </ks-c-with-facet>
    `
    this.badgeContainer.remove()

    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../controllers/withFacet/WithFacet.js`,
        name: 'ks-c-with-facet'
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
        path: `${this.importMetaUrl}../../atoms/withFacetCounter/WithFacetCounter.js`,
        name: 'ks-a-with-facet-counter'
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
        path: `${this.importMetaUrl}../../molecules/badgeLegend/BadgeLegend.js`,
        name: 'ks-m-badge-legend'
      },
      {
        path: `${this.importMetaUrl}../../molecules/tileFactory/TileFactory.js`,
        name: 'ks-m-tile-factory'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/picture/Picture.js`,
        name: 'a-picture'
      }
    ])
  }

  get badgeContainer() {
    return this.root.querySelector('.js-badge__selector')
  }
}
