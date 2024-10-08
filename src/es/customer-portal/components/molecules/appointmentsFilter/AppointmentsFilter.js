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
      const filter = JSON.parse(this.dataset.filter)
      const { dayCodes, timeCodes, locations, datePickerDayList } = filter
      if (this.gridRendered) {
        // handle day filter
        if (this.oGrid.root.querySelector('.day-filter')) {
          this.updateFilterOnlyRendering(dayCodes, 'dayCodeDescription', '.day-filter', 'dialog-open-day', 'CP.cpFilterTitleDay', 'dayCodes', 'dayCode', 'CP.cpFilterTitleDay', 'day')
          this.updateDialogCounterOnlyRendering('.day-filter')
        }
        // handle location filter
        if (this.oGrid.root.querySelector('.location-filter')) {
          this.updateFilterOnlyRendering(locations, 'locationDescription', '.location-filter', 'dialog-open-location', 'CP.cpFilterTitleLocation', 'locations', 'locationId', 'CP.cpFilterTitleLocation', 'location')
          this.updateDialogCounterOnlyRendering('.location-filter')
        }
        // handle time filter
        if (this.oGrid.root.querySelector('.time-filter')) {
          this.updateFilterOnlyRendering(timeCodes, 'timeCodeDescription', '.time-filter', 'dialog-open-time', 'CP.cpFilterTitleTime', 'timeCodes', 'timeCode', 'CP.cpFilterTitleTime', 'time')
          this.updateDialogCounterOnlyRendering('.time-filter')
        }
      } else {
        this.html = /* html */ `
          <div>
            <o-grid namespace="grid-12er-">
              <style>
                :host ks-a-button {
                  width: 100%;
                }
              </style>
                <div col-lg="3" col-md="3" col-sm="12" class="day-filter">${this.renderDayFilter(dayCodes)}</div>
                <div col-lg="3" col-md="3" col-sm="12" class="time-filter">${this.renderTimeFilter(timeCodes)}</div>
                <div col-lg="3" col-md="3" col-sm="12" class="location-filter">${this.renderLocationFilter(locations)}</div>
                <div col-lg="3" col-md="3" col-sm="12">${this.renderDatePickerListFilter(datePickerDayList)}</div>
              </o-grid>
            </div>
        `
        this.isGridRendered = true
      }
    })
  }

  updateFilterOnlyRendering (filterList, filterStringDisplayValue, cssClassName, dialogOpenName, initialBtnTransKey, filterCodeKey, dialogCheckboxValueKey, dialogTitleTransKey, dialogFilterType) {
    const updatedFilterCodes = filterList.reduce((acc, filterItem) => (filterItem.selected ? acc ? `${acc}, ${filterItem[filterStringDisplayValue]}` : filterItem[filterStringDisplayValue] : acc), '')
    const doubleButtonChildNodes = this.oGrid.root.querySelector(cssClassName).querySelector('m-double-button')?.root.querySelector('ks-a-button').root.querySelector('button').childNodes
    const parent = this.oGrid.root.querySelector(cssClassName)

    if (updatedFilterCodes === '' && doubleButtonChildNodes) {
      const currentDisplayedBtn = this.oGrid.root.querySelector(cssClassName).querySelector('ks-a-button, m-double-button')

      // double btn set
      if (currentDisplayedBtn.tagName === 'M-DOUBLE-BUTTON') {
        const singleBtn = this.renderFilterInitialButton(dialogOpenName, initialBtnTransKey)
        const fragment = document.createElement('div')
        fragment.innerHTML = singleBtn
        const updatedParent = parent.querySelector('div') ? parent.querySelector('div') : parent
        // @ts-ignore
        const fragmentChild = [...fragment.childNodes].find(child => child.tagName === 'KS-A-BUTTON')
        // @ts-ignore
        const fragmentChildStyleTag = [...fragment.childNodes].find(child => child.tagName === 'STYLE')
        updatedParent.appendChild(fragmentChildStyleTag)
        updatedParent.replaceChild(fragmentChild, currentDisplayedBtn)
        // update dialog
        const newDialogHTML = this.renderDialog(dialogOpenName, filterList, dialogCheckboxValueKey, filterStringDisplayValue, dialogTitleTransKey, dialogFilterType)
        const fragmentDialog = document.createElement('div')
        fragmentDialog.innerHTML = newDialogHTML
        const oldDialog = updatedParent.querySelector('m-dialog') || parent.querySelector('m-dialog')
        // @ts-ignore
        const newDialogNode = [...fragmentDialog.childNodes].find(child => child.tagName === 'M-DIALOG')
        const parentReal = updatedParent.parentNode.tagName === 'DIV' ? updatedParent.parentNode : parent
        parentReal.replaceChild(newDialogNode, oldDialog)
      }

      // default button set
      if (currentDisplayedBtn.tagName === 'KS-A-BUTTON') {
        if (currentDisplayedBtn.parentElement.parentElement.parentElement) {
          if (this.dataset.filterType === 'day' || this.dataset.filterType === 'dayCodes') {
            currentDisplayedBtn.parentElement.parentElement.parentElement.innerHTML = this.renderDayFilter(filterList)
            return
          }
          if (this.dataset.filterType === 'location' || this.dataset.filterType === 'locations') {
            currentDisplayedBtn.parentElement.parentElement.parentElement.innerHTML = this.renderLocationFilter(filterList)
            return
          }
          if (this.dataset.filterType === 'time' || this.dataset.filterType === 'timeCodes') {
            currentDisplayedBtn.parentElement.parentElement.parentElement.innerHTML = this.renderTimeFilter(filterList)
            return
          }
        }
      }
    }

    if (updatedFilterCodes !== '' && !doubleButtonChildNodes) {
      const currentDisplayedBtn = this.oGrid.root.querySelector(cssClassName).querySelector('ks-a-button')
      if (currentDisplayedBtn) {
        const double = this.renderFilterDoubleButton(dialogOpenName, filterList, filterStringDisplayValue, filterCodeKey)
        const fragment = document.createElement('div')
        fragment.innerHTML = double
        const updatedParent = parent.querySelector('div') ? parent.querySelector('div') : parent
        const nodeToReplace = currentDisplayedBtn
        // @ts-ignore
        const fragmentChild = [...fragment.childNodes].find(child => child.tagName === 'M-DOUBLE-BUTTON')
        updatedParent.replaceChild(fragmentChild, nodeToReplace)
      }
    }

    if (updatedFilterCodes !== '' && doubleButtonChildNodes) {
      if (this.dataset.filterType !== dialogFilterType) return
      for (const childNode of doubleButtonChildNodes) {
        if (childNode.nodeName === 'SPAN') {
          if (childNode.hasAttribute('dynamic')) {
            const count = updatedFilterCodes.split(', ').length - 2
            const counter = count <= 0 ? '' : `+${count}`
            childNode.textContent = counter
          } else if (childNode.textContent !== '') {
            childNode.textContent = updatedFilterCodes
          }
        }
      }
    }
  }

  /**
   * Updates the counter value displayed in a dialog element
   * @param {string} cssClass - The `cssClass` parameter in the `updateDialogCounterOnlyRendering` function is a
   * CSS class selector that is used to target a specific element in the DOM. It is used to locate the
   * element that contains the counter button that needs to be updated.
   */
  updateDialogCounterOnlyRendering (cssClass) {
    const counterButton = this.oGrid.root.querySelector(cssClass)?.querySelector('m-dialog')?.root?.querySelector('ks-a-number-of-offers-button')?.root?.querySelector('button')
    if (counterButton) {
      const counter = counterButton.querySelector('span')
      const updatedCounterValue = this.dataset.counter
      const newCounterValue = counter.textContent.replace(counter.textContent.match(/\d+/)[0], updatedCounterValue)
      counter.textContent = newCounterValue
    }
  }

  renderDayFilter (dayCodes) {
    const openDialogEventName = 'dialog-open-day'
    return /* html */`
      ${this.renderDialog(openDialogEventName, dayCodes, 'dayCode', 'dayCodeDescription', 'CP.cpFilterTitleDay', 'day')}
      ${dayCodes.some(dayCode => dayCode.selected)
        ? /* html */ `${this.renderFilterDoubleButton(openDialogEventName, dayCodes, 'dayCodeDescription', 'dayCodes')}`
        : /* html */ `${this.renderFilterInitialButton(openDialogEventName, 'CP.cpFilterTitleDay')}`
      }
    `
  }

  renderTimeFilter (timeCodes) {
    const openDialogEventName = 'dialog-open-time'
    return /* html */ `
      ${this.renderDialog('dialog-open-time', timeCodes, 'timeCode', 'timeCodeDescription', 'CP.cpFilterTitleTime', 'time')}
      ${timeCodes.some(timeCode => timeCode.selected)
        ? /* html */ `${this.renderFilterDoubleButton(openDialogEventName, timeCodes, 'timeCodeDescription', 'timeCodes')}`
        : /* html */ `${this.renderFilterInitialButton(openDialogEventName, 'CP.cpFilterTitleTime')}`
      }
    `
  }

  renderLocationFilter (locations) {
    const openDialogEventName = 'dialog-open-location'
    return /* html */ `
      ${this.renderDialog('dialog-open-location', locations, 'locationId', 'locationDescription', 'CP.cpFilterTitleLocation', 'location')}
      ${locations.some(location => location.selected)
        ? /* html */ `${this.renderFilterDoubleButton(openDialogEventName, locations, 'locationDescription', 'locations')}`
        : /* html */ `${this.renderFilterInitialButton(openDialogEventName, 'CP.cpFilterTitleLocation')}`
      }
    `
  }

  renderDatePickerListFilter (dateList) {
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
