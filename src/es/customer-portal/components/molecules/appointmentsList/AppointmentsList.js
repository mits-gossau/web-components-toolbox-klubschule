// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'
import { makeUniqueCourseId } from '../../../helpers/Shared.js'

/* global CustomEvent */

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
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointments') || 'update-subscription-course-appointments', this.subscriptionCourseAppointmentsListener)
    this.dispatchEvent(new CustomEvent(this.dataset.requestSubscription || 'request-appointments',
      {
        detail: {
          subscriptionType: '',
          userId: ''
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }
    ))
  }

  disconnectedCallback () {
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointments') || 'update-subscription-course-appointments', this.subscriptionCourseAppointmentsListener)
    this.select?.removeEventListener('change', this.selectEventListener)
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

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host #list-wrapper {
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

  /**
   * fetches the template
   */
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
      if (appointments.errorCode !== 0) {
        throw new Error(`${appointments.errorMessage}`)
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
          path: `${this.importMetaUrl}'../../../../../../components/molecules/Select/Select.js`,
          name: 'ks-m-select'
        },
        {
          path: `${this.importMetaUrl}../appointmentsFilter/AppointmentsFilter.js`,
          name: 'm-appointments-filter'
        }
      ])
      return Promise.all([fetchModules]).then((children) => {
        this.html = ''
        const filter = appointments.filters ? this.renderFilterSubscriptions(appointments.filters.subscriptions) : ''
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
                  data-appointments-text="CP.cpAppointmentDwnPDF"
                ></ks-a-counter>
              </ks-a-heading>
            </div>
            ${(!this.dataset.showFilters || this.dataset.showFilters === 'true')
            ? /* html */ `
            <div col-lg="6" col-md="6" col-sm="12">
              ${filter}
            </div>
            <div col-lg="12" col-md="12" col-sm="12">
              <m-appointments-filter></m-appointments-filter>
            </div>
            `
            : ''}         
          </o-grid>
          <div id="list-wrapper">
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
    this.html = '<img src="../customer-portal/img/loading.gif" alt="Loading">'
    // this.html = '<mdx-component">111<mdx-spinner size="small"></mdx-spinner></mdx-component">'
  }

  renderFilterSubscriptions (subscriptionsData) {
    const select = document.createElement('select')
    select.id = 'filters-subscriptions'
    subscriptionsData.forEach(item => {
      const option = document.createElement('option')
      const value = { subscriptionId: item.subscriptionId, subscriptionType: item.subscriptionType }
      option.value = JSON.stringify(value)
      option.text = item.subscriptionDescription
      if (item.selected) option.setAttribute('selected', 'selected')
      select.appendChild(option)
    })
    const html = /* html */ `
    <div>
      <ks-m-select>
        <div>
          ${select.outerHTML}
        </div>
      </ks-m-select>
    </div>
    `

    return html
  }

  renderDayList (appointments, tileComponent, heading) {
    const { selectedSubscription, dayList } = this.getDayListData(appointments)
    const list = []
    let counter = 0
    dayList.forEach(day => {
      const dayWrapper = document.createElement('div')
      dayWrapper.appendChild(this.renderDayHeading(day.weekday, heading))
      counter += day.subscriptionCourseAppointments.length
      day.subscriptionCourseAppointments.forEach(appointment => {
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

  renderDayHeading (data, heading) {
    const title = new heading.constructorClass() // eslint-disable-line
    title.setAttribute('tag', 'h2')
    title.innerHTML = data
    return title
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

  cleanAndStringifyData (data) {
    const escapeForHtml = (htmlString) => htmlString.replaceAll(/'/g, '&#39;')
    return escapeForHtml(JSON.stringify(data))
  }

  getDayListData (data) {
    let booked = {}
    if (!data.selectedSubscription) {
      booked = data.dayList[0]?.subscriptionCourseAppointments[0]
    }
    const selectedSubscription = data.selectedSubscription
      ? data.selectedSubscription
      : {
          subscriptionBalance: booked?.subscriptionBalance,
          subscriptionDescription: booked?.subscriptionDescription,
          subscriptionId: booked?.subscriptionId,
          subscriptionMode: booked?.subscriptionMode,
          subscriptionType: booked?.subscriptionType,
          subscriptionValidFrom: booked?.subscriptionValidFrom,
          subscriptionValidTo: booked?.subscriptionValidTo
        }
    const dayList = data.selectedSubscription ? data.selectedSubscription.dayList : data.dayList
    delete selectedSubscription.dayList
    return {
      selectedSubscription,
      dayList
    }
  }
}
