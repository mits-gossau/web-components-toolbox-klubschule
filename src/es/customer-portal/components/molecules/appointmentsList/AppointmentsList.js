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
  /**
   * @param options
   * @param {any} args
   */
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this.select = null
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointments') || 'update-subscription-course-appointments', this.subscriptionCourseAppointmentsListener)
    this.dispatchEvent(new CustomEvent('request-subscription-course-appointments',
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
    this.select.removeEventListener('change', this.selectEventListener)
  }

  subscriptionCourseAppointmentsListener = (event) => {
    this.renderHTML(event.detail.fetch).then(_ => {
      if (!this.select) {
        // TODO: Refactor
        this.select = this.root.querySelector('o-grid').root.querySelector('select')
        this.select.addEventListener('change', this.selectEventListener)
      }
    })
  }

  selectEventListener = (event) => {
    const data = JSON.parse(event.target.value)
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

  /**
   * Render HTML
   * @returns void
   */
  async renderHTML (fetch) {
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
          path: `${this.importMetaUrl}'../../../../../../components/web-components-toolbox/src/es/components/molecules/dialog/Dialog.js`,
          name: 'm-dialog'
        }
      ])
      return Promise.all([fetchModules]).then(async (children) => {
        this.html = ''
        const filter = this.renderFilterSubscriptions(appointments.filters.subscriptions)
        const dayList = this.renderDayList(appointments, children[0][0], children[0][1])
        this.html = /* html */ `
            <o-grid namespace="grid-12er-">
              <div col-lg="12" col-md="12" col-sm="12">
                <ks-a-heading tag="h1">${dayList.counter} Angebote</ks-a-heading>
              </div>
              <div col-lg="12" col-md="12" col-sm="12">
               ${filter}
              </div>
              <div col-lg="12" col-md="12" col-sm="12">
                [[ Filter ]]
                <hr>
                <br>
              </div>
            </o-grid>
            <div id="list-wrapper">
              ${dayList.list.join('')}
            </div>
            `
        return this.html
      })
    }).catch(e => {
      console.error(e)
    })
  }

  renderLoading () {
    this.html = '<img src="../customer-portal/img/loading.gif" alt="Loading">'
  }

  renderFilterSubscriptions (subscriptionsData) {
    const select = document.createElement('select')
    select.id = 'filters-subscriptions'
    subscriptionsData.forEach(item => {
      const option = document.createElement('option')
      const value = { subscriptionId: item.subscriptionId, subscriptionType: item.subscriptionType }
      option.value = JSON.stringify(value)
      option.textContent = item.subscriptionDescription
      select.appendChild(option)
    })
    const sortWrapper = document.createElement('div')
    sortWrapper.innerHTML = select.outerHTML
    return sortWrapper.innerHTML
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

  makeTileComponent (tile, appointment, selectedSubscription) {
    const appointmentData = this.escapeForHtml(appointment)
    const selectedSubscriptionData = this.escapeForHtml(selectedSubscription)
    const tileComponent = new tile.constructorClass({ namespace: 'tile-course-appointment-' }) // eslint-disable-line
    tileComponent.setAttribute('data', `${appointmentData}`)
    tileComponent.setAttribute('data-id', `${makeUniqueCourseId(appointment)}`)
    tileComponent.setAttribute('data-selected-subscription', `${selectedSubscriptionData}`)
    return tileComponent
  }

  escapeForHtml (data) {
    const escapeForHtml = (htmlString) => htmlString.replaceAll(/'/g, '&#39;')
    return escapeForHtml(JSON.stringify(data))
  }

  getDayListData (data) {
    const selectedSubscription = data.selectedSubscription
    const dayList = data.selectedSubscription.dayList
    delete selectedSubscription.dayList
    return {
      selectedSubscription,
      dayList
    }
  }
}
