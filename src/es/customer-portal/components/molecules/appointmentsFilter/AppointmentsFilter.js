// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

/* global CustomEvent */

/**
 * @export
 * @class AppointmentsFilter
 * @type {CustomElementConstructor}
 */
export default class AppointmentsFilter extends Shadow() {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this.renderedHTML = false
  }

  connectedCallback() {
    if (this.shouldRenderHTML()) this.renderHTML()
    if (this.shouldRenderCSS()) this.renderCSS()
  }

  disconnectedCallback() {
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS() {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * renders the css
   */
  renderCSS() {
    this.css = /* css */`
      :host {
        display:flex;
        justify-content: space-between;
      }
      :host > div {
        width:100%;
      }

      :host > div > ks-a-button {
        width: 100%;
      }
      @media only screen and (max-width: _max-width_) {
        :host  {}
      }
    `
    return this.fetchTemplate()
  }

  /**
   * fetches the template
   */
  fetchTemplate() {
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

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML() {
    return !this.renderedHTML
  }

  renderHTML() {
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
        path: `${this.importMetaUrl}../../../../components/atoms/button/Button.js`,
        name: 'ks-a-button'
      }
    ]).then(() => {
      this.html = /* html */ `
        <div>
         ${this.renderWeekDayFilter()} 
        </div>
        <div>${this.renderDayTimeFilter()}</div>
        <div>${this.renderCenterFilter()}</div>
        <div>
          444
        </div>
      `
    })
  }

  renderWeekDayFilter() {
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
        <m-double-button id="show-modal" namespace="double-button-default-" width="100%">
          <ks-a-button filter namespace="button-primary-" color="tertiary" justify-content="space-between">
            <span part="label1">Label</span>
            <span part="label2" dynamic></span>
          </ks-a-button>
          <ks-a-button filter namespace="button-primary-" color="tertiary" justify-content="flex-start">
            <a-icon-mdx icon-name="X" size="1em"></a-icon-mdx>
          </ks-a-button>
        </m-double-button>
      </m-dialog>
    `
  }

  renderDayTimeFilter() {
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
        <ks-a-button id="show-modal" namespace="button-secondary-" color="tertiary" justify-content="flex-start">Tageszeit</ks-a-button>
      </m-dialog>
    `
  }

  renderCenterFilter() {
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
        <ks-a-button id="show-modal" namespace="button-secondary-" color="tertiary" justify-content="flex-start">Center</ks-a-button>
      </m-dialog>
    ` 
  }
}
