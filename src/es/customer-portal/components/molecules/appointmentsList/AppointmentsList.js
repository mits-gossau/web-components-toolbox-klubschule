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
  }

  subscriptionCourseAppointmentsListener = (event) => {
    this.renderHTML(event.detail.fetch)
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
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML () {
    return !this.listWrapper
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host .list-wrapper {
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
  renderHTML (fetch) {
    try {
      fetch.then(appointments => {
        if (appointments.errorCode !== 0) {
          throw new Error(`${appointments.errorMessage}`)
        }
        // !!!
        this.listWrapper = this.root.querySelector('div') || document.createElement('div')
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
            path: `${this.importMetaUrl}../../../../../es/components/web-components-toolbox/src/es/components/organisms/grid/Grid.js`,
            name: 'o-grid'
          }
        ])
        return Promise.all([fetchModules]).then((children) => {
          const heading = new children[0][1].constructorClass() // eslint-disable-line
          this.html = /* html */ `
            <o-grid namespace="grid-12er-">
              <div col-lg="12" col-md="12" col-sm="12">
                <ks-a-heading tag="h1">123 Angebote</ks-a-heading>
              </div>
              <div col-lg="12" col-md="12" col-sm="12">
                ${this.renderFilterSubscriptions(appointments.filters.subscriptions)}
              </div>
              <div col-lg="12" col-md="12" col-sm="12">Filter...</div>
            </o-grid>
            <div class="list-wrapper">
              ${this.renderDayList(appointments.selectedSubscription.dayList, children[0][0], heading).join('')}
            </div>
            `
        })
      })
    } catch (error) {
      console.error(error)
      this.html = ''
      this.html = '<span style="color:red;">🤦‍♂️ Uh oh! The fetch failed! 🤦‍♂️</span>'
    }
  }

  renderFilterSubscriptions (subscriptionsData) {
    const select = document.createElement('select')
    select.id = 'filters-subscriptions'

    subscriptionsData.forEach(item => {
      const option = document.createElement('option')
      option.value = item.subscriptionId
      option.textContent = item.subscriptionDescription
      select.appendChild(option)
    })

    const sortWrapper = document.createElement('div')
    sortWrapper.innerHTML = select.outerHTML
    return sortWrapper.innerHTML
  }

  renderDayList (dayList, tileComponent, heading) {
    const list = []
    dayList.forEach(day => {
      const dayWrapper = document.createElement('div')

      // const heading = document.createElement('h1')
      // heading.innerHTML = day.weekday
      // heading.innerHTML = this.renderDayHeading(day.weekday)
      // const headingWrapper = document.createElement('div')
      // headingWrapper.appendChild(this.renderDayHeading(day.weekday))
      dayWrapper.appendChild(this.renderDayHeading(day.weekday, heading))
      // dayWrapper.innerHTML = `<h1>${day.weekday}</h1>`

      // Loop over the subscriptionCourseAppointments for the current day
      day.subscriptionCourseAppointments.forEach(appointment => {
        //   console.log(`
        // <div>
        //   <h3>${appointment.courseTitle}</h3>
        //   <p>Location: ${appointment.courseLocation}</p>
        //   <p>Time: ${appointment.courseAppointmentTimeFrom} - ${appointment.courseAppointmentTimeTo}</p>
        //   <p>Instructor: ${appointment.instructorDescription}</p>
        //   <p>Price: ${appointment.lessonPrice}</p>
        // </div>`)

        const tile = new tileComponent.constructorClass({ namespace: 'tile-default-' }) // eslint-disable-line
        const escapeForHtml = (htmlString) => htmlString.replaceAll(/'/g, '&#39;')
        tile.setAttribute('data', `${escapeForHtml(JSON.stringify(appointment))}`)
        dayWrapper.appendChild(tile)
      })
      list.push(dayWrapper.innerHTML)
    })
    return list
  }

  renderDayHeading (data, heading) {
    // const wrapper = document.createElement('div')
    // const tile = new headingComponent.constructorClass({ namespace: 'tile-default-' }) // eslint-disable-line
    heading.setAttribute('tag', 'h2')
    heading.innerHTML = `${data}`
    return heading
  }
}
