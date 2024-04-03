// @ts-check
import { Shadow } from '../../../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

/* global CustomEvent */

/**
 * @export
 * @class AppointmentsList
 * @type {CustomElementConstructor}
 */
export default class AppointmentsList extends Shadow() {
  /**
   * @param {any} args
   */
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this.tiles = null
    this.select = null
    this.selectedTile = null
    this.dialog = null
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointments') || 'update-subscription-course-appointments', this.subscriptionCourseAppointmentsListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', this.updateSubscriptionCourseAppointmentDetailListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
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
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', this.updateSubscriptionCourseAppointmentDetailListener)
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', this.updateSubscriptionCourseAppointmentBookingListener)
    this.select.removeEventListener('change', this.selectEventListener)
  }

  updateSubscriptionCourseAppointmentDetailListener = event => {
    event.detail.fetch.then(courseDetail => {
      const { courseId, courseDescription } = courseDetail
      this.selectedTile = this.tiles?.find(t => t.id * 1 === courseId)
      clearTimeout(this._updateInputTimeoutID)
      this._updateInputTimeoutID = setTimeout(() => {
        console.log(this.selectedTile.shadowRoot.children.length, courseDescription)
        this.dialog = this.selectedTile.shadowRoot.querySelector('m-dialog')
        const description = this.dialog.shadowRoot.getElementById('description')
        description.innerHTML = courseDescription
      }, 500)
    })
  }

  updateSubscriptionCourseAppointmentBookingListener = event => {
    event.detail.fetch.then(x => {
      console.log('update booking subscription', x, this.selectedTile, this.dialog)
      const dialogContent = this.dialog.shadowRoot.getElementById('content')
      dialogContent.innerHTML = ''
      dialogContent.innerHTML = '<h1>Sie haben den Termin erfolgreich gebucht</h1>'
      // TODO: DO THIS WORK?
      const td = this.selectedTile
      const tdData = JSON.parse(td.getAttribute('data'))
      tdData.courseAppointmentFreeSeats = x.courseAppointmentFreeSeats
      tdData.courseAppointmentStatus = x.courseAppointmentStatus
      const appointmentData = this.escapeForHtml(tdData)
      this.selectedTile.setAttribute('data', appointmentData)
    })
  }

  subscriptionCourseAppointmentsListener = (event) => {
    this.renderHTML(event.detail.fetch).then(_ => {
      this.tiles = Array.from(this.root.getElementById('list-wrapper').childNodes)
      if (!this.select) {
        // TODO: ?!?
        this.select = this.root.querySelector('o-grid').root.querySelector('select')
        this.select.addEventListener('change', this.selectEventListener)
      }
    })
  }

  selectEventListener = (event) => {
    console.log(event.target.value)
    const d = JSON.parse(event.target.value)
    console.log(d)
    this.dispatchEvent(new CustomEvent('request-subscription-course-appointments',
      {
        detail: {
          subscriptionType: d.subscriptionType,
          subscriptionId: d.subscriptionId
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
        display:flex;
        flex-direction: column;
        gap:1em;
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
        path: `${this.importMetaUrl}../../../../../es/components/web-components-toolbox/src/css/reset.css`, // no variables for this reason no namespace
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../../../../es/components/web-components-toolbox/src/css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
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
    // this.html = '<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmcyd2Vvd3Y5YjN5YTMzbmd6dzk1d3FvYnoydDZtbmg5MXdnZ2NoOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYGtCMbPTYWOzaU/giphy.gif">'
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
        // clear loading
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
                Filter...
              </div>
            </o-grid>
            <div id="list-wrapper">
              ${dayList.list.join('')}
            </div>
            `
        return this.html
      })
    })
  }

  renderLoading () {
    this.html = '<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmcyd2Vvd3Y5YjN5YTMzbmd6dzk1d3FvYnoydDZtbmg5MXdnZ2NoOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYGtCMbPTYWOzaU/giphy.gif">'
  }

  renderFilterSubscriptions (subscriptionsData) {
    const select = document.createElement('select')
    select.id = 'filters-subscriptions'

    subscriptionsData.forEach(item => {
      const option = document.createElement('option')
      const v = { subscriptionId: item.subscriptionId, subscriptionType: item.subscriptionType }
      option.value = JSON.stringify(v)
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
    const data = {
      counter,
      list
    }
    return data
  }

  renderDayHeading (data, heading) {
    const title = new heading.constructorClass() // eslint-disable-line
    title.setAttribute('tag', 'h2')
    title.innerHTML = data
    return title
  }

  makeTileComponent (tile, appointment, selectedSubscription) {
    const { courseId } = appointment
    const appointmentData = this.escapeForHtml(appointment)
    const selectedSubscriptionData = this.escapeForHtml(selectedSubscription)
    const tileComponent = new tile.constructorClass({ namespace: 'tile-course-appointment-' }) // eslint-disable-line
    tileComponent.setAttribute('id', `${courseId}`)
    tileComponent.setAttribute('data', `${appointmentData}`)
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
