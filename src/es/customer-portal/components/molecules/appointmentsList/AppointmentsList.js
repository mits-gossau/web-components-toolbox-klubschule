// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'
import { makeUniqueCourseId, escapeForHtml } from '../../../helpers/Shared.js'

/* global CustomEvent */
/* global self */

/**
 * @export
 * @class AppointmentsList
 * @type {CustomElementConstructor}
 */
export default class AppointmentsList extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this.select = null
    this.numberOfAppointments = 0
    this.currentOpenDialogFilterType = null
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointments') || 'update-subscription-course-appointments', this.subscriptionCourseAppointmentsListener)
    document.body.addEventListener('update-subscriptions', this.subscriptionsListener)
    // get first subscription information for current user
    // then request the appointments with received 'subscriptionType' and 'subscriptionId'
    // pointless thing, due to poor api design
    this.dispatchEvent(new CustomEvent('request-subscriptions',
      {
        detail: {},
        bubbles: true,
        cancelable: true,
        composed: true
      }
    ))
  }

  disconnectedCallback () {
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointments') || 'update-subscription-course-appointments', this.subscriptionCourseAppointmentsListener)
    document.body.removeEventListener('update-subscriptions', this.subscriptionsListener)
    this.select?.removeEventListener('change', this.selectEventListener)
  }

  /**
   * Need 'subscriptionType' and 'subscriptionId' from current user
   * @param {CustomEventInit} event
   */
  subscriptionsListener = (event) => {
    event.detail.fetch.then((subscriptionData) => {
      if (subscriptionData.code === 500) {
        this.html = ''
        // trans value = Termine können nicht angezeigt werden. Versuchen sie es später nochmals
        this.html = /* html */ `
          <style>
            :host > div {
              padding:1.5em 0;
            }
          </style>
          <div>
            <span>
              <a-translation data-trans-key="CP.cpAppointmentsListingFailed"></a-translation>
            </span>
          </div>`
        return
      }
      this.dispatchEvent(new CustomEvent(this.dataset.requestSubscription || 'request-appointments',
        {
          detail: {
            subscriptionType: '',
            subscriptionId: 0
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }
      ))
    })
  }

  subscriptionCourseAppointmentsListener = (event) => {
    this.renderHTML(event.detail.fetch).then(() => {
      if (!this.dataset.showFilters || this.dataset.showFilters === 'true') {
        this.select = this.root.querySelector('o-grid').root.querySelector('ks-m-select').root.querySelector('div').querySelector('select')
        this.select.addEventListener('change', this.selectEventListener)
      }
      this.dispatchEvent(new CustomEvent('update-counter',
        {
          detail: {
            counter: this.numberOfAppointments,
            type: 'init'
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }
      ))
    })
  }

  selectEventListener = (event) => {
    const data = AppointmentsList.parseAttribute(event.target.value)
    this.dispatchEvent(new CustomEvent('request-subscription-course-appointments',
      {
        detail: {
          subscriptionType: data.subscriptionType,
          subscriptionId: data.subscriptionId
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }
    ))
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`)
  }

  renderCSS () {
    this.css = /* css */`
      :host .list-wrapper {
        display: flex;
        flex-direction: column;
        gap: 1em;
      }
      @media only screen and (max-width: _max-width_) {
        :host  {}
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
      case 'appointments-list-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles], false)
      default:
        return this.fetchCSS(styles)
    }
  }

  renderHTML (fetch) {
    this.html = ''
    this.renderLoading()
    return fetch.then(appointments => {
      // update filters only for subscription list
      if (!this.dataset.showFilters || this.dataset.showFilters === 'true') {
        this.updateCourseListFilterSettings(appointments.filters, appointments.selectedSubscription.subscriptionId, appointments.selectedSubscription.subscriptionType)
      }
      this.currentOpenDialogFilterType = fetch.currentDialogFilterOpen
      const fetchModules = this.fetchModules([
        {
          path: `${this.importMetaUrl}'../../../tile/Tile.js`,
          name: 'm-tile'
        },
        {
          path: `${this.importMetaUrl}'../../../../../../components/atoms/heading/Heading.js`,
          name: 'ks-a-heading'
        },
        {
          path: `${this.importMetaUrl}'../../../../../../components/web-components-toolbox/src/es/components/organisms/grid/Grid.js`,
          name: 'o-grid'
        },
        {
          path: `${this.importMetaUrl}'../../../../../../../css/web-components-toolbox-migros-design-experience/src/es/components/organisms/MdxComponent.js`,
          name: 'mdx-component'
        },
        {
          path: `${this.importMetaUrl}'../../../../atoms/counter/Counter.js`,
          name: 'ks-a-counter'
        },
        {
          path: `${this.importMetaUrl}'../../../../../../components/molecules/select/Select.js`,
          name: 'ks-m-select'
        },
        {
          path: `${this.importMetaUrl}../appointmentsFilter/AppointmentsFilter.js`,
          name: 'm-appointments-filter'
        },
        {
          path: `${this.importMetaUrl}../../../../../css/web-components-toolbox-migros-design-experience/src/es/components/organisms/MdxComponent.js`,
          name: 'mdx-component'
        }
      ])
      return Promise.all([fetchModules]).then((children) => {
        this.html = ''
        const subscriptionSelect = appointments.filters ? this.renderFilterSubscriptions(appointments.filters.subscriptions) : ''
        const dayList = this.renderDayList(appointments, children[0][0], children[0][1])
        this.numberOfAppointments = dayList.counter
        this.html = /* html */ `
          <o-grid namespace="grid-12er-">
            <div col-lg="12" col-md="12" col-sm="12">
              <ks-a-heading tag="h1">
                <ks-a-counter
                  namespace="counter-default-"
                  data-list-type="${this.dataset.listType}" 
                  data-heading-type="h1" 
                  data-booked-subscriptions-text="CP.cpMenuBookedAppointments" 
                  data-appointments-text="CP.cpAppointmentListCoursesFound"
                ></ks-a-counter>
              </ks-a-heading>
            </div>
            ${(!this.dataset.showFilters || this.dataset.showFilters === 'true')
            ? /* html */ `
            <div col-lg="6" col-md="6" col-sm="12">
              ${subscriptionSelect}
            </div>
            <div col-lg="12" col-md="12" col-sm="12">
              <m-appointments-filter data-filter-open="${this.currentOpenDialogFilterType}" data-counter="${this.numberOfAppointments}" data-filter="${escapeForHtml(JSON.stringify(appointments.filters))}"></m-appointments-filter> 
            </div>
            `
            : ''}         
          </o-grid>
          <div class="list-wrapper">
            ${dayList.list.join('')}
          </div>
        `
        return this.html
      })
    }).catch(e => {
      // TODO: Handle error
      console.error(e)
    })
  }

  renderLoading () {
    this.html = '<mdx-component><mdx-spinner size="large"></mdx-spinner></mdx-component>'
  }

  renderFilterSubscriptions (subscriptionsData) {
    let hintDataValidFromDate = ''
    let hintDataSubscriptionBalance = ''
    const select = document.createElement('select')
    select.id = 'filters-subscriptions'
    subscriptionsData.forEach(item => {
      const option = document.createElement('option')
      const value = { subscriptionId: item.subscriptionId, subscriptionType: item.subscriptionType }
      option.value = JSON.stringify(value)
      option.text = item.subscriptionDescription
      if (item.selected) {
        option.setAttribute('selected', 'selected')
        hintDataValidFromDate = `<a-translation data-trans-key="CP.cpAppointmentListSubscriptionsValidTo"></a-translation> ${this.formatSubscriptionValidFromDate(item.subscriptionValidFrom)}`
        hintDataSubscriptionBalance = item.subscriptionMode === 'WERTABO' ? `| <a-translation data-trans-key="CP.cpSubscriptionColumnBalance"></a-translation> ${item.subscriptionBalance}` : ''
      }
      select.appendChild(option)
    })
    const html = /* html */ `
      <style>
        :host label {
          color: var(--mdx-comp-select-label-color-default);
          font: var(--mdx-comp-select-font-label);
        }
        :host .hint {
          padding-top:1em;
        }
        :host .hint span:first-child {
          font-size:medium !important;
        }
      </style>
      <div>
          <ks-m-select mode="false">
              <div class="wrap">
                  <label for="${select.id}"><a-translation data-trans-key="CP.cpShowAppointmentsFromSubscription"></a-translation></label>
                  ${select.outerHTML}
                  <div class="hint">
                    <span>${hintDataValidFromDate} ${hintDataSubscriptionBalance}</span>
                  </div>
              </div>
          </ks-m-select>
      </div>
    `
    return html
  }

  /**
   * @param {any} appointments
   * @param {any} tileComponent
   * @param {any} heading
   */
  renderDayList (appointments, tileComponent, heading) {
    const { selectedSubscription, dayList } = this.getDayListData(appointments)
    const list = []
    let counter = 0
    dayList.forEach(day => {
      const appointmentType = day.subscriptionCourseAppointments ? 'subscriptionCourseAppointments' : 'bookedSubscriptionCourseAppointments'
      counter += day[appointmentType].length
      const dayWrapper = document.createElement('div')
      dayWrapper.appendChild(this.renderDayHeading(day.weekday, heading))
      day[appointmentType].forEach(appointment => {
        const tile = this.makeTileComponent(tileComponent, appointment, selectedSubscription)
        dayWrapper.appendChild(tile)
      })
      list.push(dayWrapper.innerHTML)
    })
    return {
      counter,
      list
    }
  }

  /**
   * Render Day Heading
   * Example: Heute: Mittwoch, 08. Mai
   * @param {string} headingText Heading Text
   * @param {{ constructorClass: new () => any; }} headingComponent Heading Component
   * @param {string} headingType Heading Type - H1, H2, etc.
   * @returns {HTMLElement} Heading Element
   */
  renderDayHeading (headingText, headingComponent, headingType = 'h2') {
    const heading = new headingComponent.constructorClass() // eslint-disable-line
    heading.setAttribute('tag', headingType)
    heading.innerHTML = headingText
    return heading
  }

  /**
   * Make course tile component
   * @param {*} tile
   * @param {*} appointment
   * @param {*} selectedSubscription
   * @returns
   */
  makeTileComponent (tile, appointment, selectedSubscription) {
    const appointmentData = this.cleanAndStringifyData(appointment)
    const selectedSubscriptionData = this.cleanAndStringifyData(selectedSubscription)
    const tileComponent = new tile.constructorClass({ namespace: 'tile-course-appointment-' }) // eslint-disable-line
    tileComponent.setAttribute('data', `${appointmentData}`)
    tileComponent.setAttribute('data-id', `${makeUniqueCourseId(appointment)}`)
    tileComponent.setAttribute('data-selected-subscription', `${selectedSubscriptionData}`)
    tileComponent.setAttribute('data-list-type', this.dataset.listType || '')
    return tileComponent
  }

  /**
   * Clean/Escape HTML String
   * @param {string} htmlString HTML String
   * @returns {string} Cleaned/Escaped HTML String
   */
  cleanAndStringifyData (htmlString) {
    const escapeForHtml = (/** @type {any} */ string) => string.replaceAll(/'/g, '&#39;')
    return escapeForHtml(JSON.stringify(htmlString))
  }

  /**
   * Get day list data
   * @param {object} data
   */
  getDayListData (data) {
    let booked = {}
    if (!data.selectedSubscription) {
      booked = data.dayList[0]?.bookedSubscriptionCourseAppointments[0]
    }
    // @ts-ignore
    const selectedSubscription = structuredClone(data.selectedSubscription
      ? data.selectedSubscription
      : {
          subscriptionBalance: booked?.subscriptionBalance,
          subscriptionDescription: booked?.subscriptionDescription,
          subscriptionId: booked?.subscriptionId,
          subscriptionMode: booked?.subscriptionMode,
          subscriptionType: booked?.subscriptionType,
          subscriptionValidFrom: booked?.subscriptionValidFrom,
          subscriptionValidTo: booked?.subscriptionValidTo
        })
    const dayList = data.selectedSubscription ? data.selectedSubscription.dayList : data.dayList
    delete selectedSubscription.dayList
    return {
      selectedSubscription,
      dayList
    }
  }

  updateCourseListFilterSettings (filterList, subscriptionId, subscriptionType) {
    const dayCodes = filterList.dayCodes.filter(dayCode => dayCode.selected).map(dayCode => dayCode.dayCode)
    const locations = filterList.locations.filter(location => location.selected).map(location => location.locationId)
    const timeCodes = filterList.timeCodes.filter(timeCode => timeCode.selected).map(timeCode => timeCode.timeCode)
    const requestData = {
      filterCriterias: {
        dayCodes,
        locations,
        timeCodes
      },
      subscriptionId,
      subscriptionType
    }
    this.dispatchEvent(new CustomEvent('request-course-list-filter-settings',
      {
        detail: {
          requestData
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }
    ))
  }

  formatSubscriptionValidFromDate (dateString) {
    const dateObject = new Date(dateString)
    const options = { month: '2-digit', day: '2-digit', year: 'numeric' }
    // @ts-ignore
    const formatter = new Intl.DateTimeFormat(self.Environment.language, options)
    return formatter.format(dateObject)
  }
}
