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
    // if (this.shouldRenderCSS()) this.renderCSS()
    // if (this.shouldRenderHTML()) this.renderHTML()
    document.body.addEventListener(this.getAttribute('update-subscription-course-appointments') || 'update-subscription-course-appointments', this.subscriptionCourseAppointmentsListener)
    this.hidden = true
    const showPromises = []
    if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
    Promise.all(showPromises).then(() => {
      this.hidden = false
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
    })
  }

  disconnectedCallback () {
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointments') || 'update-subscription-course-appointments', this.subscriptionCourseAppointmentsListener)
  }

  subscriptionCourseAppointmentsListener = async (event) => {
    console.log('subscriptionCourseAppointmentsListener', event)
    try {
      const appointments = await event.detail.fetch
      console.log(appointments)
      if (appointments.errorCode !== 0) {
        throw new Error(`${appointments.errorMessage}`)
      }
      this.html = ''
      this.renderHTML(appointments)
    } catch (error) {
      console.error(error)
      this.html = ''
      this.html = '<span style="color:red;">🤦‍♂️ Uh oh! The fetch failed! 🤦‍♂️</span>'
    }
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
      :host { }
      @media only screen and (max-width: _max-width_) {
        :host {}
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
        }, ...styles])
      default:
        return this.fetchCSS(styles)
    }
  }

  /**
   * Render HTML
   * @returns void
   */
  renderHTML (data) {
    console.log('data', data)
    this.listWrapper = this.root.querySelector('div') || document.createElement('div')
    const fetchModules = this.fetchModules([
      {
        path: `${this.importMetaUrl}'../../../tile/Tile.js`,
        name: 'm-tile'
      }
    ])
    return Promise.all([fetchModules]).then((children) => {
      // ${this.display_nested_objects(appointmentsData.filters.subscriptions)}
      // ${this.display_properties(appointmentsData.selectedSubscription.dayList)}

      // create dropdown
      // this.html =
      console.log(children[0][0])
      // const dayList = this.renderDayList(data.selectedSubscription.dayList, children[0][0])

      this.html = /* html */ `
      <div>
       <h2>1 Million Termine</h2>
       ${this.renderFilterSubscriptions(data.filters.subscriptions)}
       <hr>
       <div>${this.renderDayList(data.selectedSubscription.dayList, children[0][0])}</div>
      </div>`
    })
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

  renderDayList (dayList, tileComponent) {
    const list = []
    dayList.forEach(day => {
      const dayWrapper = document.createElement('div')
      dayWrapper.innerHTML = `<h1>${day.weekday}</h1>`

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
}
