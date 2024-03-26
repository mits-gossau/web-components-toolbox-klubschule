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
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointments') || 'update-subscription-course-appointments', this.subscriptionCourseAppointmentsListener)
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', this.updateSubscriptionCourseAppointmentDetailListener)
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
    this.select.removeEventListener('change', this.selectEventListener)
  }

  updateSubscriptionCourseAppointmentDetailListener = event => {
    event.detail.fetch.then(courseDetail => {
      console.log(courseDetail)
      const { courseId, courseDescription } = courseDetail
      const selectedTile = this.tiles?.find(t => t.id * 1 === courseId)
      const dialog = selectedTile.shadowRoot.querySelector('m-dialog')
      const description = dialog.shadowRoot.getElementById('description')
      description.innerHTML = courseDescription
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

  // renderDialog (data = {}) {
  //   console.log('render dialog', data.courseTitle)
  //   this.html = /* html */ `
  //     <m-dialog namespace="dialog-left-slide-in-" show-event-name="dialog-open-first-level" close-event-name="backdrop-clicked">
  //           <div class="container dialog-header" tabindex="0">
  //               <div id="back">
  //                   &nbsp;
  //               </div>
  //               <h3>${data.courseTitle}</h3>
  //               <div id="close">
  //                   <a-icon-mdx icon-name="Plus" size="2em"></a-icon-mdx>
  //               </div>
  //           </div>
  //           <div class="container dialog-content">
  //               <p class="reset-link">asdfasd</p>
  //               <div class="sub-content">
  //                   <a-input inputid="location-search" width="100%" placeholder="Angebot suchen" icon-name="Search" icon-size="calc(20rem/18)" search submit-search="request-auto-complete" any-key-listener type="search"></a-input>
  //                   <ks-m-filter-categories namespace="filter-default-" lang="de" translation-key-close="Schliessen" translation-key-cta="Angebote" translation-key-reset="zur&uuml;cksetzen"></ks-m-filter-categories>
  //               </div>
  //           </div>
  //           <div class="container dialog-footer">
  //               <a-button id="close" namespace="button-secondary-" no-pointer-events>Schliessen</a-button>
  //               <ks-a-number-of-offers-button id="close" class="button-show-all-offers" namespace="button-primary-" no-pointer-events translation-key-cta="Angebote">Angebote</ks-a-number-of-offers-button>
  //           </div>
  //       </m-dialog>
  //     `
  // }

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

    // const selectedSubscription = appointments.selectedSubscription
    // const dayList = appointments.selectedSubscription.dayList
    // delete selectedSubscription.dayList

    const list = []
    let counter = 0
    dayList.forEach(day => {
      const dayWrapper = document.createElement('div')
      dayWrapper.appendChild(this.renderDayHeading(day.weekday, heading))
      counter += day.subscriptionCourseAppointments.length
      day.subscriptionCourseAppointments.forEach(appointment => {
        const tile = this.makeTileComponent(tileComponent, appointment, selectedSubscription)
        // const tile = new tileComponent.constructorClass({ namespace: 'tile-course-appointment-' }) // eslint-disable-line
        // const escapeForHtml = (htmlString) => htmlString.replaceAll(/'/g, '&#39;')
        // tile.setAttribute('id', `${appointment.courseId}`)
        // tile.setAttribute('data', `${escapeForHtml(JSON.stringify(appointment))}`)
        // tile.setAttribute('data-selected-subscription', `${escapeForHtml(JSON.stringify(selectedSubscription))}`)
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
    const escapeForHtml = (htmlString) => htmlString.replaceAll(/'/g, '&#39;')
    const courseId = appointment.courseId
    const appointmentData = escapeForHtml(JSON.stringify(appointment))
    const selectedSubscriptionData = escapeForHtml(JSON.stringify(selectedSubscription))
    const tileComponent = new tile.constructorClass({ namespace: 'tile-course-appointment-' }) // eslint-disable-line
    tileComponent.setAttribute('id', `${courseId}`)
    tileComponent.setAttribute('data', `${appointmentData}`)
    tileComponent.setAttribute('data-selected-subscription', `${selectedSubscriptionData}`)
    return tileComponent
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
