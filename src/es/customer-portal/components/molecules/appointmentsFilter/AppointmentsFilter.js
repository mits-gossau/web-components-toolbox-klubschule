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
      const filter = JSON.parse(this.dataset.filter)
      const { dayCodes, timeCodes, locations } = filter
      this.html = /* html */ `
        <div>${this.renderDayFilter(dayCodes)}</div>
        <div>${this.renderTimeFilter(timeCodes)}</div>
        <div>${this.renderLocationFilter(locations)}</div>
        <div>time</div>
      `
    })
  }

  renderDayFilter (dayCodes) {
    return /* html */`
      <m-dialog
        namespace="dialog-left-slide-in-"
        show-event-name="dialog-open-day"
        close-event-name="request-subscription-day-filter">
          <div class="container dialog-header" tabindex="0">
              <div id="back">&nbsp;</div>
              <h3>TODO: Add Translation "Filter Name"</h3>
              <div id="close">
                <a-icon-mdx icon-name="Plus" size="2em"></a-icon-mdx>
              </div>
          </div>
          <div class="container dialog-content">
              <p class="reset-link">
                  <a-button
                    namespace="button-transparent-"
                    request-event-name="reset-all-filters">
                      TODO: Add Translation "Reset All Filters" <a-icon-mdx class="icon-right" icon-name="RotateLeft" size="1em"></a-icon-mdx>
                  </a-button>
              </p>
            <div class="sub-level margin-bottom">
                ${dayCodes.reduce((acc, dayCode) => acc + /* html */`
                  <mdx-component mutation-callback-event-name="request-subscription-day-filter">
                    <mdx-checkbox
                      ${dayCode.selected ? ' checked' : ''} 
                      variant="no-border"
                      value="${dayCode.dayCode}" 
                      label="${dayCode.dayCodeDescription}">
                    </mdx-checkbox>
                  </mdx-component>
                `, '')}
              </div>
          </div>
          <div class="container dialog-footer">
            <a-button 
              id="close" 
              namespace="button-secondary-" 
              no-pointer-events>
                TODO: Add Translation "Close Overlay"
            </a-button>
            <ks-a-number-of-offers-button 
              id="close" 
              class="button-show-all-offers" 
              namespace="button-primary-" 
              no-pointer-events 
              translation-key-cta="TODO: Add Translation 'CTA'">
                Schliessen
            </ks-a-number-of-offers-button>
          </div>
      </m-dialog>
      ${dayCodes.some(dayCode => dayCode.selected)
      ? /* html */`
        <m-double-button
          id="show-modal"
          namespace="double-button-default-">
            <ks-a-button
              filter
              namespace="button-primary-"
              color="tertiary"
              justify-content="space-between"
              click-no-toggle-active
              request-event-name="dialog-open-day">
                <span part="label1">
                  ${dayCodes.reduce((acc, dayCode) => (dayCode.selected ? acc ? `${acc}, ${dayCode.dayCodeDescription}` : dayCode.dayCodeDescription : acc), '')}
                </span>
                <span part="label2" dynamic></span>
            </ks-a-button>
            <ks-a-button 
              filter 
              namespace="button-primary-" 
              color="tertiary" 
              justify-content="flex-start" 
              request-event-name="reset-filter-day">
                <a-icon-mdx icon-name="X" size="1em"></a-icon-mdx>
            </ks-a-button>
          </m-double-button>
        `
      : /* html */ `
      <ks-a-button
        id="show-modal"
        namespace="button-secondary-"
        color="tertiary"
        justify-content="flex-start"
        request-event-name="dialog-open-day">
          TODO: Add Translation "Open Filter Name"
        </ks-a-button>
      `
      }
    `
  }

  renderTimeFilter (timeCodes) {
    return /* html */`
      <m-dialog
        namespace="dialog-left-slide-in-"
        show-event-name="dialog-open-time"
        close-event-name="request-subscription-time-filter">
          <div class="container dialog-header" tabindex="0">
              <div id="back">&nbsp;</div>
              <h3>TODO: Add Translation "Filter Name"</h3>
              <div id="close">
                <a-icon-mdx icon-name="Plus" size="2em"></a-icon-mdx>
              </div>
          </div>
          <div class="container dialog-content">
              <p class="reset-link">
                  <a-button
                    namespace="button-transparent-"
                    request-event-name="reset-all-filters">
                      TODO: Add Translation "Reset All Filters" <a-icon-mdx class="icon-right" icon-name="RotateLeft" size="1em"></a-icon-mdx>
                  </a-button>
              </p>
            <div class="sub-level margin-bottom">
              ${timeCodes.reduce((acc, timeCode) => acc + /* html */`
                <mdx-component mutation-callback-event-name="request-subscription-time-filter">
                  <mdx-checkbox
                    ${timeCode.selected ? ' checked' : ''} 
                    variant="no-border"
                    value="${timeCode.timeCode}" 
                    label="${timeCode.timeCodeDescription}">
                  </mdx-checkbox>
                </mdx-component>
              `, '')}
            </div>
        </div>
        <div class="container dialog-footer">
          <a-button 
            id="close" 
            namespace="button-secondary-" 
            no-pointer-events>
              TODO: Add Translation "Close Overlay"
          </a-button>
          <ks-a-number-of-offers-button 
            id="close" 
            class="button-show-all-offers" 
            namespace="button-primary-" 
            no-pointer-events 
            translation-key-cta="TODO: Add Translation 'CTA'">
              Schliessen
          </ks-a-number-of-offers-button>
        </div>
      </m-dialog>
      ${timeCodes.some(timeCode => timeCode.selected)
      ? /* html */`
        <m-double-button id="show-modal" namespace="double-button-default-">
          <ks-a-button
            filter
            namespace="button-primary-"
            color="tertiary"
            justify-content="space-between"
            click-no-toggle-active
            request-event-name="dialog-open-time">
              <span part="label1">
                ${timeCodes.reduce((acc, timeCode) => (timeCode.selected ? acc ? `${acc}, ${timeCode.timeCodeDescription}` : timeCode.timeCodeDescription : acc), '')}
              </span>
              <span part="label2" dynamic></span>
            </ks-a-button>
            <ks-a-button 
              filter 
              namespace="button-primary-" 
              color="tertiary" 
              justify-content="flex-start" 
              request-event-name="reset-filter-time">
                <a-icon-mdx icon-name="X" size="1em"></a-icon-mdx>
            </ks-a-button>
          </m-double-button>
      `
      : /* html */ `
        <ks-a-button
          id="show-modal"
          namespace="button-secondary-"
          color="tertiary"
          justify-content="flex-start"
          request-event-name="dialog-open-time">
            TODO: Add Translation "Open Filter Name"
        </ks-a-button>
      `
      }
    `
  }

  renderLocationFilter (locations) {
    return /* html */`
      <m-dialog
        namespace="dialog-left-slide-in-"
        show-event-name="dialog-open-location"
        close-event-name="request-subscription-location-filter">
          <div class="container dialog-header" tabindex="0">
              <div id="back">&nbsp;</div>
              <h3>TODO: Add Translation "Filter Name"</h3>
              <div id="close">
                <a-icon-mdx icon-name="Plus" size="2em"></a-icon-mdx>
              </div>
          </div>
          <div class="container dialog-content">
              <p class="reset-link">
                  <a-button
                    namespace="button-transparent-"
                    request-event-name="reset-all-filters">
                      TODO: Add Translation "Reset All Filters" <a-icon-mdx class="icon-right" icon-name="RotateLeft" size="1em"></a-icon-mdx>
                  </a-button>
              </p>
            <div class="sub-level margin-bottom">
              ${locations.reduce((acc, location) => acc + /* html */`
                <mdx-component mutation-callback-event-name="request-subscription-location-filter">
                  <mdx-checkbox
                    ${location.selected ? ' checked' : ''} 
                    variant="no-border"
                    value="${location.locationId}" 
                    label="${location.locationDescription}">
                  </mdx-checkbox>
                </mdx-component>
              `, '')}
            </div>
        </div>
        <div class="container dialog-footer">
          <a-button 
            id="close" 
            namespace="button-secondary-" 
            no-pointer-events>
              TODO: Add Translation "Close Overlay"
          </a-button>
          <ks-a-number-of-offers-button 
            id="close" 
            class="button-show-all-offers" 
            namespace="button-primary-" 
            no-pointer-events 
            translation-key-cta="TODO: Add Translation 'CTA'">
              Schliessen
          </ks-a-number-of-offers-button>
        </div>
      </m-dialog>
      ${locations.some(location => location.selected)
        ? /* html */`
        <m-double-button id="show-modal" namespace="double-button-default-">
          <ks-a-button
            filter
            namespace="button-primary-"
            color="tertiary"
            justify-content="space-between"
            click-no-toggle-active
            request-event-name="dialog-open-location">
              <span part="label1">
                ${locations.reduce((acc, location) => (location.selected ? acc ? `${acc}, ${location.locationDescription}` : location.timeCodeDescription : acc), '')}
              </span>
              <span part="label2" dynamic></span>
            </ks-a-button>
            <ks-a-button 
              filter 
              namespace="button-primary-" 
              color="tertiary" 
              justify-content="flex-start" 
              request-event-name="reset-filter-location">
                <a-icon-mdx icon-name="X" size="1em"></a-icon-mdx>
            </ks-a-button>
          </m-double-button>
      `
        : /* html */ `
        <ks-a-button
          id="show-modal"
          namespace="button-secondary-"
          color="tertiary"
          justify-content="flex-start"
          request-event-name="dialog-open-location">
            TODO: Add Translation "Open Filter Name"
        </ks-a-button>
      `
      }
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
