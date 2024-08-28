// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'
import { escapeForHtml } from '../../../helpers/Shared.js'

/* global self */

/**
 * @export
 * @class AppointmentsFilter
 * @type {CustomElementConstructor}
 */
export default class AppointmentsFilter extends Shadow() {
  static get observedAttributes () {
    return ['data-counter', 'data-filter']
  }

  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this.renderedHTML = false
    this.gridRendered = false
    // this.timeFilterRendered = false
    // this.locationFilterRendered = false
    // this.dayFilterDialog = ''
    // this.dayFilterRendered = false
    // this.dayFilterBtnState = ''
  }

  connectedCallback () {
    if (this.shouldRenderHTML()) this.renderHTML()
    if (this.shouldRenderCSS()) this.renderCSS()
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (oldValue !== newValue && (name === 'data-filter' || name === 'data-counter')) {
      this.renderHTML()
    }
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  renderCSS () {
    this.css = /* css */`
      :host > div {
        margin: 2em 0;
      }
      @media only screen and (max-width: _max-width_) {
        :host {}
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
      },
      {
        path: `${this.importMetaUrl}../../../../../es/components/web-components-toolbox/src/es/components/organisms/grid/Grid.js`,
        name: 'o-grid'
      },
      {
        path: `${this.importMetaUrl}../../../../components/web-components-toolbox/src/es/components/atoms/translation/Translation.js`,
        name: 'a-translation'
      },
      {
        path: `${this.importMetaUrl}../../../../components/web-components-toolbox/src/es/components/atoms/flatpickr/Flatpickr.js`,
        name: 'a-flatpickr'
      }
    ]).then(async () => {
      console.log('f')
      const filter = JSON.parse(this.dataset.filter)
      const { dayCodes, timeCodes, locations, datePickerDayList } = filter
      if (this.isGridRendered) {
        const updatedDayCodes = dayCodes.reduce((acc, dayCode) => (dayCode.selected ? acc ? `${acc}, ${dayCode.dayCodeDescription}` : dayCode.dayCodeDescription : acc), '')
        const doubleButtonChildNodes = this.oGrid.root.querySelector('.day-filter').querySelector('m-double-button')?.root.querySelector('ks-a-button').root.querySelector('button').childNodes

        // empty filter
        debugger
        if (updatedDayCodes === '') {
          // test
          const parent = this.oGrid.root.querySelector('.day-filter')
          const dFDiv = this.oGrid.root.querySelector('.day-filter').querySelector('ks-a-button, m-double-button')

          if (dFDiv.tagName === 'M-DOUBLE-BUTTON') {
            //
            const single = this.renderFilterInitialButton('dialog-open-day', 'CP.cpFilterTitleDay')
            const fragment = document.createElement('div')
            fragment.innerHTML = single
            const nxParent = parent.querySelector('div') ? parent.querySelector('div') : parent
            debugger
            nxParent.replaceChild(fragment, dFDiv)
            return
          }

          if (dFDiv.tagName === 'KS-A-BUTTON') {
            //
            debugger
          }

          debugger
        }

        if (updatedDayCodes !== '' && !doubleButtonChildNodes) {
          debugger
          const parent = this.oGrid.root.querySelector('.day-filter')
          const dFDiv = this.oGrid.root.querySelector('.day-filter').querySelector('ks-a-button')
          if (dFDiv) {
            const double = this.renderFilterDoubleButton('dialog-open-day', dayCodes, 'dayCodeDescription', 'dayCodes')
            const fragment = document.createElement('div')
            fragment.innerHTML = double
            const nodeToReplace = dFDiv
            parent.replaceChild(fragment, nodeToReplace)
          }
        }

        if (updatedDayCodes !== '' && doubleButtonChildNodes) {
          debugger
          for (const childNode of doubleButtonChildNodes) {
            if (childNode.nodeName === 'SPAN' && childNode.textContent !== '') {
              console.log(updatedDayCodes, childNode.textContent)
              childNode.textContent = updatedDayCodes
            }
          }
        }
      } else {
        console.log('render')
        this.html = /* html */ `
        <div>
          <o-grid namespace="grid-12er-">
            <style>
              :host ks-a-button {
                width: 100%;
              }
            </style>
              <div col-lg="3" col-md="3" col-sm="12">${this.renderTimeFilter(timeCodes, true)}</div>
              <div col-lg="3" col-md="3" col-sm="12">${this.renderLocationFilter(locations, true)}</div>
              <div col-lg="3" col-md="3" col-sm="12" class="day-filter">${this.renderDayFilter(dayCodes, true)}</div>
              <div col-lg="3" col-md="3" col-sm="12">${this.renderDatePickerListFilter(datePickerDayList, true)}</div>
            </o-grid>
          </div>
        `
        this.isGridRendered = true
      }
    })
  }

  renderDayFilter (dayCodes, renderDialog) {
    const openDialogEventName = 'dialog-open-day'
    let re = renderDialog
      ? this.renderDialog(openDialogEventName, dayCodes, 'dayCode', 'dayCodeDescription', 'CP.cpFilterTitleDay', 'day')
      : ''
    // re += this.renderDayFilterButtons(dayCodes, openDialogEventName)
    re += /* html */`
       ${dayCodes.some(dayCode => dayCode.selected)
          ? /* html */ `${this.renderFilterDoubleButton(openDialogEventName, dayCodes, 'dayCodeDescription', 'dayCodes')}`
          : /* html */ `${this.renderFilterInitialButton(openDialogEventName, 'CP.cpFilterTitleDay')}`
        }
     `
    // re += dayCodes.some(dayCode => dayCode.selected)
    //   ? /* html */ `${this.renderFilterDoubleButton(openDialogEventName, dayCodes, 'dayCodeDescription', 'dayCodes')}`
    //   : /* html */ `${this.renderFilterInitialButton(openDialogEventName, 'CP.cpFilterTitleDay')}`
    // return re.trimStart()
    return re
    // return /* html */`
    //   ${renderDialog ? this.renderDialog(openDialogEventName, dayCodes, 'dayCode', 'dayCodeDescription', 'CP.cpFilterTitleDay', 'day') : null}
    //   ${dayCodes.some(dayCode => dayCode.selected)
    //     ? /* html */ `${this.renderFilterDoubleButton(openDialogEventName, dayCodes, 'dayCodeDescription', 'dayCodes')}`
    //     : /* html */ `${this.renderFilterInitialButton(openDialogEventName, 'CP.cpFilterTitleDay')}`
    //   }
    // `
  }

  // renderDayFilterButtons (dayCodes, openDialogEventName) {
  //   return /* html */`
  //      ${dayCodes.some(dayCode => dayCode.selected)
  //        ? /* html */ `${this.renderFilterDoubleButton(openDialogEventName, dayCodes, 'dayCodeDescription', 'dayCodes')}`
  //        : /* html */ `${this.renderFilterInitialButton(openDialogEventName, 'CP.cpFilterTitleDay')}`
  //      }
  //    `
  // }

  renderTimeFilter (timeCodes, renderDialog) {
    const openDialogEventName = 'dialog-open-time'
    return /* html */ `
      ${this.renderDialog('dialog-open-time', timeCodes, 'timeCode', 'timeCodeDescription', 'CP.cpFilterTitleTime', 'time')}
      ${timeCodes.some(timeCode => timeCode.selected)
        ? /* html */ `${this.renderFilterDoubleButton(openDialogEventName, timeCodes, 'timeCodeDescription', 'timeCodes')}`
        : /* html */ `${this.renderFilterInitialButton(openDialogEventName, 'CP.cpFilterTitleTime')}`
      }
    `
  }

  renderLocationFilter (locations, renderDialog) {
    const openDialogEventName = 'dialog-open-location'
    return /* html */ `
      ${this.renderDialog('dialog-open-location', locations, 'locationId', 'locationDescription', 'CP.cpFilterTitleLocation', 'location')}
      ${locations.some(location => location.selected)
        ? /* html */ `${this.renderFilterDoubleButton(openDialogEventName, locations, 'locationDescription', 'locations')}`
        : /* html */ `${this.renderFilterInitialButton(openDialogEventName, 'CP.cpFilterTitleLocation')}`
      }
    `
  }

  renderDatePickerListFilter (dateList, renderDialog) {
    const dateListClone = structuredClone(dateList)
    const minRange = this.formatDate(dateListClone.find((day) => day.available === true).date)
    const endRange = this.formatDate(dateListClone.findLast((day) => day.available === true).date)
    const startDate = this.formatDate(dateListClone.find((day) => day.selected && day.available === true).date)
    const endDate = this.formatDate(dateListClone.findLast((day) => day.selected && day.available === true).date)
    const defaultPickrValue = startDate === endDate ? [startDate] : [startDate, endDate]
    const displayValue = `${this.getLang()}: ${startDate}`
    // MIDUWEB-1301
    const forcedEndDate = dateListClone[dateListClone.length - 1].date
    const configOptions = {
      minDate: minRange,
      maxDate: endRange,
      dateFormat: 'd.m.Y',
      defaultDate: defaultPickrValue,
      showMonths: 1
    }

    return /* html */ `
      <div>
        <style>
          :host {
            --flatpickr-ks-border-radius: var(--button-secondary-border-radius,0);
            --flatpickr-ks-label-font-weight: var(--button-secondary-font-weight, normal);
            --flatpickr-ks-padding: var(--button-secondary-padding, 0);
            --flatpickr-ks-label-line-height: var(--button-secondary-line-height);
          }
        </style>
        <a-flatpickr
          force-end-date="${forcedEndDate}"
          namespace="flatpickr-ks-"
          options="${escapeForHtml(JSON.stringify(configOptions))}"
          request-event-name="request-appointments-filter">
          <div>
            <span>${displayValue}</span>
            <a-icon-mdx icon-name="Calendar" size="1em"></a-icon-mdx>
          </div>
        </a-flatpickr>
      </div>
    `
  }

  /**
   * Render double button with filtered values
   * @param {string} dialogOpenEventName
   * @param {Object} filterStringCollection
   * @param {string} filterStringDisplayValue
   * @param {string} closeEventTag
   * @returns {string} HTML string
   */
  renderFilterDoubleButton (dialogOpenEventName, filterStringCollection, filterStringDisplayValue, closeEventTag) {
    return /* html */ `<m-double-button id="show-modal" namespace="double-button-default-" width="100%">
        <ks-a-button
          filter
          namespace="button-primary-"
          color="tertiary"
          justify-content="space-between"
          click-no-toggle-active
          request-event-name="${dialogOpenEventName}">
            <span part="label1">
              ${filterStringCollection.reduce((acc, dayCode) => (dayCode.selected ? acc ? `${acc}, ${dayCode[filterStringDisplayValue]}` : dayCode[filterStringDisplayValue] : acc), '')}
            </span>
            <span part="label2" dynamic></span>
          </ks-a-button>
          <ks-a-button 
            filter 
            namespace="button-primary-" 
            color="tertiary" 
            justify-content="flex-start" 
            request-event-name="reset-appointments-filter"
            tag="${closeEventTag}">
              <a-icon-mdx icon-name="X" size="1em"></a-icon-mdx>
          </ks-a-button>
        </m-double-button>`
  }

  /**
   * Renders initial filter button
   * @param {string} dialogOpenEventName
   * @param {string} transKey
   * @returns {string} HTML string
   */
  renderFilterInitialButton (dialogOpenEventName, transKey) {
    return /* html */ `
      <style>
        :host {
          --button-secondary-width: 100% !important;
          --button-secondary-not-label-flex-grow: 0;
        }
      </style>
      <ks-a-button
        id="show-modal"
        namespace="button-secondary-"
        color="tertiary"
        justify-content="space-between"
        request-event-name="${dialogOpenEventName}">
          <a-translation data-trans-key="${transKey}"></a-translation>
          <a-icon-mdx namespace="icon-mdx-ks-" icon-name="ArrowDown" size="1em" class="icon-down">
      </ks-a-button>
    `
  }

  /**
   * Render dialog window
   * @param {string} showDialogEventName
   * @param {Object} checkboxDataCollection
   * @param {string} ckeckboxValueKey
   * @param {string} checkboxLabelKey
   * @param {string} translationKeyTitle
   * @param {string} type
   * @returns {string} Dialog Window HTML
   */
  renderDialog (showDialogEventName, checkboxDataCollection, ckeckboxValueKey, checkboxLabelKey, translationKeyTitle, type) {
    const requestEventName = 'request-appointments-filter'
    // DEV WIP
    // const keepOpen = this.dataset.filterOpen === type ? 'open' : ''
    // close-event-name="backdrop-clicked" && ${keepOpen}
    // close-event-name="${requestEventName}"
    return /* html */ `
      <m-dialog
        namespace="dialog-left-slide-in-"
        show-event-name="${showDialogEventName}">
          <div class="container dialog-header" tabindex="0">
            <a-button id="close-back">
              &nbsp;
            </a-button>
            <h3>
              <a-translation data-trans-key="${translationKeyTitle}"></a-translation>
            </h3>
            <a-button request-event-name="backdrop-clicked" id="close">
              <a-icon-mdx icon-name="Plus" size="2em" rotate="45deg" no-hover-transform></a-icon-mdx>
            </a-button>
          </div>
          <div class="container dialog-content">
            <p class="reset-link"></p>
            <div class="sub-content">
              <div>
                  ${checkboxDataCollection.reduce((acc, checkbox) => acc + /* html */ `
                    <mdx-component mutation-callback-event-name="${requestEventName}">
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
                click-no-toggle-active
                no-pointer-events
                color="secondary"
                id="close"
                namespace="button-secondary-">
                  <a-translation data-trans-key='CP.cpAppointmentClose'/></a-translation>
              </ks-a-button>
            </div>
            <ks-a-number-of-offers-button 
              id="close" 
              class="button-show-all-offers" 
              namespace="button-primary-" 
              no-pointer-events>
              (${this.dataset.counter}) Kurse
            </ks-a-number-of-offers-button> 
          </div>
      </m-dialog> 
    `
  }

  /**
   * Takes a date string as input, converts it to a Date object and formats it
   * according to the specified options using Intl.DateTimeFormat.
   * @param {string} dateString - `dateString`
   * @returns {string} Formatted date
   */
  formatDate (dateString) {
    const options = { month: '2-digit', day: '2-digit', year: 'numeric' }
    // @ts-ignore
    const formatter = new Intl.DateTimeFormat(self.Environment.language, options)
    const ds = new Date(dateString)
    return formatter.format(ds)
  }

  getLang () {
    // @ts-ignore
    switch (self.Environment.language) {
      case 'fr-CH':
      case 'fr':
        return 'De'
      case 'it-CH':
      case 'it':
        return 'Da'
      case 'de-CH':
      case 'de':
        return 'Ab'
      default:
        return 'Ab'
    }
  }

  get oGrid () {
    return this.root.querySelector('o-grid')
  }

  get isGridRendered () {
    return !!this.oGrid && this.gridRendered
  }

  set isGridRendered (isRendered) {
    this.gridRendered = isRendered
  }
}
