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
    this.subscriptionHint = null
    this.gridRendered = false
    /**
     * @type {boolean}
     * @description Flag indicating if the subscription balance is low.
     */
    this.hasLowSubscriptionBalance = false

    /**
     * @type {boolean}
     * @description Flag indicating if the appointment balance is low.
     */
    this.hasLowAppointmentsBalance = false

    /**
     * @type {boolean}
     * @description Flag indicating if the subscription duration is low.
     */
    this.hasLowSubscriptionDuration = false

    /**
     * @type {string}
     * @description Notification message for low appointment balance.
     */
    this.lowAppointmentBalanceNotification = ''

    /**
     * @type {string}
     * @description Notification message for low subscription balance.
     */
    this.lowSubscriptionBalanceNotification = ''

    /**
     * @type {string}
     * @description Notification message for low subscription duration.
     */
    this.lowSubscriptionDurationNotification = ''

    /**
     * @type {number}
     * @description Minimum subscription balance.
     */
    this.minAmount = 35

    /**
     * @type {number}
     * @description Minimum subscription duration.
     */
    this.minDays = 14

    /**
     * @type {string}
     * @description Current subscription balance.
     */
    this.currentSubscriptionBalance = ''
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointments') || 'update-subscription-course-appointments', this.subscriptionCourseAppointmentsListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.requestSubscriptionBalanceListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.requestSubscriptionBalanceListener)
    document.body.addEventListener(this.getAttribute('update-subscription-balance') || 'update-subscription-balance', this.updateSubscriptionBalanceListener)
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
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.requestSubscriptionBalanceListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', this.requestSubscriptionBalanceListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-balance') || 'update-subscription-balance', this.updateSubscriptionBalanceListener)
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
          </div>
          `
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
    // reset notification triggers
    this.hasLowSubscriptionBalance = false
    this.hasLowAppointmentsBalance = false
    this.hasLowSubscriptionDuration = false

    this.renderHTML(event.detail.fetch).then(() => {
      if (!this.dataset.showFilters || this.dataset.showFilters === 'true') {
        this.select = this.root.querySelector('o-grid')?.root.querySelector('ks-m-select')?.root.querySelector('div')?.querySelector('select')
        if (this.select) {
          this.select.addEventListener('change', this.selectEventListener)
        }
        this.subscriptionHint = this.root.querySelector('o-grid')?.root.querySelector('ks-m-select')
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
    this.isGridRendered = false
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

  /**
   * request the current subscription balance
   */
  requestSubscriptionBalanceListener = (event) => {
    if (!this.dataset.showFilters || this.dataset.showFilters === 'true') {
      event.detail.fetch.then((appointments) => {
        this.currentSubscriptionBalance = appointments.subscriptionBalance
        this.dispatchEvent(new CustomEvent('request-subscription-balance',
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
  }

  /**
   * Update the current selected subscription balance
   * @param {CustomEventInit} event
   */
  updateSubscriptionBalanceListener = (event) => {
    event.detail.fetch.then((appointments) => {
      let { subscriptionValidTo, subscriptionMode, subscriptionBalance } = appointments.selectedSubscription
      subscriptionBalance = this.currentSubscriptionBalance // SAP Timing Issue!
      if (subscriptionMode === 'PAUSCHALABO') return
      subscriptionValidTo = `<a-translation data-trans-key="CP.cpAppointmentListSubscriptionsValidTo"></a-translation> ${this.formatSubscriptionValidFromDate(subscriptionValidTo)}`
      subscriptionBalance = subscriptionMode === 'WERTABO' ? `| <a-translation data-trans-key="CP.cpSubscriptionColumnBalance"></a-translation> ${subscriptionBalance}` : ''
      this.subscriptionHint.querySelector('.hint').innerHTML = `<span>${subscriptionValidTo} ${subscriptionBalance}</span>`
    })
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
        padding-bottom: 2em;
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
    if (this.isGridRendered) {
      this.root.querySelector('.list-wrapper').innerHTML = this.renderLoading()
    } else {
      this.html = this.renderLoading()
    }
    return fetch.then(appointments => {
      this.currentOpenDialogFilterType = appointments.currentDialogFilterOpen
      // update filters only for subscription list
      if (!this.dataset.showFilters || this.dataset.showFilters === 'true') {
        this.updateCourseListFilterSettings(appointments.filters, appointments.selectedSubscription.subscriptionId, appointments.selectedSubscription.subscriptionType)
      }
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
        },
        {
          path: `${this.importMetaUrl}'../../../../../../components/molecules/systemNotification/SystemNotification.js`,
          name: 'ks-m-system-notification'
        }
      ])
      return Promise.all([fetchModules]).then((children) => {
        const subscriptionSelect = appointments.filters ? this.renderFilterSubscriptions(appointments.filters.subscriptions) : ''
        const dayList = this.renderDayList(appointments, children[0][0])
        this.numberOfAppointments = dayList.counter
        if (this.isGridRendered && !this.dataset.showFilters) {
          const mAppointments = this.oGrid.root.querySelector('m-appointments-filter')
          mAppointments.setAttribute('data-counter', this.numberOfAppointments)
          mAppointments.setAttribute('data-filter', JSON.stringify(appointments.filters))
          mAppointments.setAttribute('data-filter-type', this.currentOpenDialogFilterType)
          this.root.querySelector('.list-wrapper').innerHTML = dayList.list.join('')
          this.renderSubscriptionNotifications(appointments)
        } else {
          this.gridRendered = true
          this.html = ''
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
              ${!this.hasLowSubscriptionBalance && this.renderSubscriptionNotifications(appointments)}
              <div col-lg="12" col-md="12" col-sm="12">
                <m-appointments-filter data-filter-type="${this.currentOpenDialogFilterType}" data-counter="${this.numberOfAppointments}" data-filter="${escapeForHtml(JSON.stringify(appointments.filters))}"></m-appointments-filter> 
              </div>
              `
              : ''}         
            </o-grid>
            <div class="list-wrapper">
              ${dayList.list.join('')}
            </div>
          `
          return this.html
        }
      })
    }).catch(e => {
      // TODO: Handle error
      console.error(e)
    })
  }

  /**
   * Renders notifications related to subscriptions.
   * Notifications include low appointment balance, low subscription balance and low subscription duration.
   *
   * @param {object} allSubscriptions - Object containing all subscriptions.
   * @returns {string} - HTML string containing the rendered notifications.
   */
  renderSubscriptionNotifications (allSubscriptions) {
    // do nothing if subscription type is 'pauschalabo'
    if (allSubscriptions?.subscriptionMode === 'PAUSCHALABO' || allSubscriptions?.selectedSubscription?.subscriptionMode === 'PAUSCHALABO') {
      return ''
    }
    // Get the selected subscription
    let selectedSubscription = null
    if (allSubscriptions?.filters) {
      const { subscriptions } = allSubscriptions?.filters
      selectedSubscription = subscriptions.find(element => element.selected === true)
    }

    // Render low appointment balance notification
    if (!this.hasLowAppointmentsBalance) {
      this.hasLowAppointmentsBalance = true
      this.lowAppointmentBalanceNotification = /* html */`
        <div style="padding-bottom:1rem;">
          <ks-m-system-notification namespace="system-notification-default-" icon-name="AlertCircle" icon-size="1.625em" no-border>
            <div slot="description">
              <p>
                <a-translation data-trans-key="CP.cpLowAppointmentBalance"></a-translation>
              </p>
            </div>
          </ks-m-system-notification>
        </div>
      `
    }

    // Render low subscription balance notification
    if (!this.hasLowSubscriptionBalance && selectedSubscription) {
      const subscriptionBalance = Number(parseFloat(selectedSubscription.subscriptionBalance.replace('CHF', '').trim()).toFixed(2))
      if (subscriptionBalance < this.minAmount) {
        this.hasLowSubscriptionBalance = true
        this.lowSubscriptionBalanceNotification = /* html */`
          <div style="padding-bottom:1rem;">
            <ks-m-system-notification namespace="system-notification-default-" icon-name="AlertCircle" icon-size="1.625em" no-border>
              <div slot="description">
                <p>
                  <a-translation data-trans-key="CP.cpLowBalance"></a-translation>
                </p>
              </div>
            </ks-m-system-notification>
          </div>
        `
      }
    }

    // Render low subscription duration notification
    if (!this.hasLowSubscriptionDuration && selectedSubscription) {
      const today = new Date()
      const subscriptionValidTo = selectedSubscription.subscriptionValidTo
      const endDate = new Date(subscriptionValidTo)
      const datePlus14Days = new Date(today.getTime() + this.minDays * 24 * 60 * 60 * 1000)

      if (datePlus14Days >= endDate) {
        this.hasLowSubscriptionDuration = true
        this.lowSubscriptionDurationNotification = /* html */`
          <div style="padding-bottom:1rem;">
            <ks-m-system-notification namespace="system-notification-default-" icon-name="AlertCircle" icon-size="1.625em" no-border>
              <div slot="description">
                <p>
                  <a-translation data-trans-key="CP.cpShortValidity"></a-translation>
                </p>
              </div>
            </ks-m-system-notification>
          </div>
        `
      }
    }

    // Return the rendered HTML
    return /* html */ `
      <div col-lg="12" col-md="12" col-sm="12">
        ${this.lowSubscriptionBalanceNotification}
        ${this.lowAppointmentBalanceNotification}
        ${this.lowSubscriptionDurationNotification}
      </div>
    `
  }

  renderLoading () {
    return '<mdx-component><mdx-spinner size="large"></mdx-spinner></mdx-component>'
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
        hintDataValidFromDate = `<a-translation data-trans-key="CP.cpAppointmentListSubscriptionsValidTo"></a-translation> ${this.formatSubscriptionValidFromDate(item.subscriptionValidTo)}`
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

    if (this.subscriptionHint) {
      // render again for updated value when change route
      this.subscriptionHint.querySelector('.hint').innerHTML = `<span>${hintDataValidFromDate} ${hintDataSubscriptionBalance}</span>`
    }

    return html
  }

  /**
   * @param {any} appointments
   * @param {any} tileComponent
   */
  renderDayList (appointments, tileComponent) {
    const { selectedSubscription, dayList } = this.getDayListData(appointments)
    const list = []
    let counter = 0
    dayList.forEach(day => {
      const appointmentType = day.subscriptionCourseAppointments ? 'subscriptionCourseAppointments' : 'bookedSubscriptionCourseAppointments'
      counter += day[appointmentType].length
      const dayWrapper = document.createElement('div')
      dayWrapper.insertAdjacentHTML('beforeend', `<ks-a-heading tag="h2">${day.weekday}</ks-a-heading>`)
      day[appointmentType].forEach(appointment => {
        if (appointment.courseAppointmentStatus === 2 && !this.hasLowAppointmentsBalance) {
          this.renderSubscriptionNotifications(selectedSubscription)
        }
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
