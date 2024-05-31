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
        margin: 2em 0;
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
      },
      {
        path: `${this.importMetaUrl}../../../../components/web-components-toolbox/src/es/components/atoms/translation/Translation.js`,
        name: 'a-translation'
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
      const filter = JSON.parse(this.dataset.filter)
      const { dayCodes, timeCodes, locations } = filter
      this.html = /* html */ `
        <div>${this.renderDayFilter(dayCodes)}</div>
        <div>${this.renderTimeFilter(timeCodes)}</div>
        <div>${this.renderLocationFilter(locations)}</div>
        <!--<div>time</div>-->
      `
    })
  }

  renderDayFilter (dayCodes) {
    return /* html */`
      ${this.renderDialog('dialog-open-day', dayCodes, 'dayCode', 'dayCodeDescription', 'CP.cpFilterTitleDay', 'day')}
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
              request-event-name="reset-appointments-filter">
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
            <a-translation data-trans-key='CP.cpFilterTitleDay'/></a-translation>
        </ks-a-button>
      `
      }
    `
  }

  renderTimeFilter (timeCodes) {
    return /* html */`
      ${this.renderDialog('dialog-open-time', timeCodes, 'timeCode', 'timeCodeDescription', 'CP.cpFilterTitleTime', 'time')}
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
              request-event-name="reset-appointments-filter">
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
            <a-translation data-trans-key='CP.cpFilterTitleTime'/></a-translation>
        </ks-a-button>
      `
      }
    `
  }

  renderLocationFilter (locations) {
    return /* html */`
      ${this.renderDialog('dialog-open-location', locations, 'locationId', 'locationDescription', 'CP.cpFilterTitleLocation', 'location')}
      ${locations.some(location => location.selected)
      ? /* html */ `
        <m-double-button id="show-modal" namespace="double-button-default-">
          <ks-a-button
            filter
            namespace="button-primary-"
            color="tertiary"
            justify-content="space-between"
            click-no-toggle-active
            request-event-name="dialog-open-location">
              <span part="label1">
                ${locations.reduce((acc, location) => (location.selected ? acc ? `${acc}, ${location.locationDescription}` : location.locationDescription : acc), '')}
              </span>
              <span part="label2" dynamic></span>
            </ks-a-button>
            <ks-a-button 
              filter 
              namespace="button-primary-" 
              color="tertiary" 
              justify-content="flex-start" 
              request-event-name="reset-appointments-filter">
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
            <a-translation data-trans-key='CP.cpFilterTitleLocation'/></a-translation>
        </ks-a-button>
      `
      }
    `
  }

  /**
   * Render dialog window
   * @param {String} showDialogEventName
   * @param {Object} checkboxDataCollection
   * @param {String} ckeckboxValueKey
   * @param {String} checkboxLabelKey
   * @param {String} translationKeyTitle
   * @returns {String} Dialog Window HTML
   */
  renderDialog (showDialogEventName, checkboxDataCollection, ckeckboxValueKey, checkboxLabelKey, translationKeyTitle, type) {
    const eventName = 'request-appointments-filter'
    return /* html */ `
      <m-dialog
        namespace="dialog-left-slide-in-"
        show-event-name="${showDialogEventName}"
        close-event-name="${eventName}">
          <style>
            :host .close-button-wrapper {
              display: flex;
              width: 100%;
              justify-content: flex-end;
            }
          </style>
          <div class="container dialog-header" tabindex="0">
              <div id="back">&nbsp;</div>
              <h3>
                <a-translation data-trans-key="${translationKeyTitle}"></a-translation>
              </h3>
              <div id="close">
                <a-icon-mdx icon-name="Plus" size="2em"></a-icon-mdx>
              </div>
          </div>
          <div class="container dialog-content">
            <p class="reset-link"></p>
            <div class="sub-content">
              <div>
                  ${checkboxDataCollection.reduce((acc, checkbox) => acc + /* html */ `
                    <mdx-component mutation-callback-event-name="${eventName}">
                      <mdx-checkbox
                        ${checkbox.selected ? ' checked' : ''} 
                        variant="no-border"
                        value="${checkbox[ckeckboxValueKey]}" 
                        label="${checkbox[checkboxLabelKey]}"
                        type="${type}">
                      </mdx-checkbox>
                    </mdx-component>
                  `, '')}
              </div>
            </div>
          </div>
          <div class="container dialog-footer">
            <div class="close-button-wrapper">
              <ks-a-button 
                color="secondary"
                id="close"
                namespace="button-tertiary-">
                  <a-translation data-trans-key='CP.cpAppointmentClose'/></a-translation>
              </ks-a-button>
            </div>
            <!--<ks-a-number-of-offers-button 
              id="close" 
              class="button-show-all-offers" 
              namespace="button-primary-" 
              no-pointer-events 
              translation-key-cta="TODO: Add Translation 'CTA'">
                Numbers
            </ks-a-number-of-offers-button>-->
          </div>
      </m-dialog> 
    `
  }
}
