// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * @export
 * @class AppointmentsFilter
 * @type {CustomElementConstructor}
 */
export default class AppointmentsFilter extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this.renderedHTML = false
  }

  connectedCallback () {
    if (this.shouldRenderHTML()) this.renderHTML()
    if (this.shouldRenderCSS()) this.renderCSS()
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  renderCSS () {
    this.css = /* css */`
      :host {
        align-items: center;
        display: flex;
        gap: 1em;
        justify-content: space-between;
        margin: 1em 0;
      }
      :host > div {
        width: 100%;
      }
      @media only screen and (max-width: _max-width_) {
        :host  {
          flex-direction: column;
        }
      }
    `
    return this.fetchTemplate()
  }

  fetchTemplate () {
    const styles = [
      {
        path: `${this.importMetaUrl}../../../../../es/components/web-components-toolbox/src/css/reset.css`,
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../../../../es/components/web-components-toolbox/src/css/style.css`,
        namespaceFallback: true
      }
    ]
    switch (this.getAttribute('namespace')) {
      case 'appointments-filter-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles], false)
      default:
        return this.fetchCSS(styles)
    }
  }

  shouldRenderHTML () {
    return !this.renderedHTML
  }

  renderHTML () {
    this.renderedHTML = true
    this.fetchModules([
      {
        path: `${this.importMetaUrl}../../../../../es/customer-portal/components/molecules/courseDialog/CourseDialog.js`,
        name: 'm-course-dialog'
      },
      {
        path: `${this.importMetaUrl}../../../../../es/components/web-components-toolbox/src/es/components/molecules/doubleButton/DoubleButton.js`,
        name: 'm-double-button'
      },
      {
        path: `${this.importMetaUrl}../../../../../es/components/web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      },
      {
        path: `${this.importMetaUrl}../../../../components/atoms/button/Button.js`,
        name: 'ks-a-button'
      },
      {
        path: `${this.importMetaUrl}../../../../components/atoms/numberOfOffersButton/NumberOfOffersButton.js`,
        name: 'ks-a-number-of-offers-button'
      },
      {
        path: `${this.importMetaUrl}../../../../../css/web-components-toolbox-migros-design-experience/src/es/components/organisms/MdxComponent.js`,
        name: 'mdx-component'
      }
    ]).then(() => {
      console.log(JSON.parse(this.dataset.filter))
      this.html = /* html */ `
        <div>${this.renderWeekDayFilter(JSON.parse(this.dataset.filter).dayCodes)}</div>
        <div>${this.renderDayTimeFilter()}</div>
        <div>${this.renderCenterFilter()}</div>
        <div>time</div>
      `
    })
  }

  renderWeekDayFilter (dayCodes) {
    return /* html */`
      <m-dialog namespace="dialog-left-slide-in-" show-event-name="dialog-open-time">
        <div class="container dialog-header" tabindex="0">
            <div id="back">
                &nbsp;
            </div>
            <h3>TODO: Add Translation "Filter Name"</h3>
            <div id="close">
                <a-icon-mdx icon-name="Plus" size="2em"></a-icon-mdx>
            </div>
        </div>
        <div class="container dialog-content">
            <p class="reset-link">
                <a-button namespace="button-transparent-" request-event-name="reset-all-filters">TODO: Add Translation "Reset All Filters" <a-icon-mdx class="icon-right" icon-name="RotateLeft" size="1em"></a-icon-mdx>
                </a-button>
            </p>
            <div class="sub-level margin-bottom">
              ${dayCodes.reduce((acc, dayCode) => acc + /* html */`
                <mdx-component mutation-callback-event-name="request-subscription-filter">
                  <mdx-checkbox ${dayCode.selected ? ' checked' : ''} variant="no-border" value="${dayCode.dayCode}" label="${dayCode.dayCodeDescription}"></mdx-checkbox>
                </mdx-component>
              `, '')}
            </div>
        </div>
        <div class="container dialog-footer">
            <a-button id="close" namespace="button-secondary-" no-pointer-events>TODO: Add Translation "Close Overlay" </a-button>
            <ks-a-number-of-offers-button id="close" class="button-show-all-offers" namespace="button-primary-" no-pointer-events translation-key-cta="TODO: Add Translation 'CTA'">Schliessen</ks-a-number-of-offers-button>
        </div>
        <ks-a-button id="show-modal" namespace="button-secondary-" color="tertiary" justify-content="flex-start">TODO: Add Translation "Open Filter Name"</ks-a-button>
      </m-dialog>
    `
  }

  renderDayTimeFilter () {
    return /* html */ `
      <m-dialog namespace="dialog-left-slide-in-">
        <div class="container dialog-header">
          <div id="back"><a-icon-mdx icon-name="ChevronLeft" size="2em" ></a-icon-mdx></div>
          <h3>Filter</h3>
          <div id="close"><a-icon-mdx icon-name="Plus" size="2em" ></a-icon-mdx></div>
        </div>
        <div class="container dialog-content">
          <p class="reset-link"><a>Alles zur&uuml;cksetzen <a-icon-mdx icon-name="RotateLeft" size="1em"></a-icon-mdx></a></p>
            <div>
              <p>Content here</p>
              <p>Content here</p>
            </div>
        </div>
        <div class="container dialog-footer">
          <a-button id="close" namespace="button-secondary-" no-pointer-events>Schliessen</a-button>
          <a-button namespace="button-primary-">Angebote anzeigen</a-button>
        </div>
        ${this.setButtonStyle()}
        <ks-a-button id="show-modal" namespace="button-secondary-" color="tertiary" justify-content="flex-start">Tageszeit</ks-a-button>
      </m-dialog>
    `
  }

  renderCenterFilter () {
    return /* html */ `
      <m-dialog namespace="dialog-left-slide-in-">
        <div class="container dialog-header">
          <div id="back"><a-icon-mdx icon-name="ChevronLeft" size="2em" ></a-icon-mdx></div>
          <h3>Filter</h3>
          <div id="close"><a-icon-mdx icon-name="Plus" size="2em" ></a-icon-mdx></div>
        </div>
        <div class="container dialog-content">
          <p class="reset-link"><a>Alles zur&uuml;cksetzen <a-icon-mdx icon-name="RotateLeft" size="1em"></a-icon-mdx></a></p>
          <div>
            <p>Content here</p>
            <p>Content here</p>
          </div>
        </div>
        <div class="container dialog-footer">
          <a-button id="close" namespace="button-secondary-" no-pointer-events>Schliessen</a-button>
          <a-button namespace="button-primary-">Angebote anzeigen</a-button>
        </div>
        ${this.setButtonStyle()}
        <ks-a-button id="show-modal" namespace="button-secondary-" color="tertiary" justify-content="flex-start">Center</ks-a-button>
      </m-dialog>
    `
  }

  setButtonStyle () {
    return /* css */ `
      <style>
        :host {
          --button-secondary-width:100%;
        }
        :host >  ks-a-button {
          width:100%;
        }
      </style>`
  }
}
