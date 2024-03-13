// @ts-check
import { Shadow } from '../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

/* global CustomEvent */

/**
 * Appointment List
 *
 * @export
 * @class AppointmentList
 * @type {CustomElementConstructor}
 */
export default class AppointmentList extends Shadow() {
  /**
   * @param {any} args
  */
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
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

  subscriptionCourseAppointmentsListener = async (/** @type {{ detail: { fetch: Promise<any>; }; }} */ event) => {
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
      console.log(error)
      this.html = ''
      this.html = '<span style="color:red;">🤦‍♂️ Uh oh! The fetch failed! 🤦‍♂️</span>'
    }
    // event.detail.fetch.then((/** @type {any} */ appointments) => {
    //   console.log(appointments)
    //   this.html = ''
    //   this.renderHTML(appointments)
    // }).catch((/** @type {any} */ error) => {
    //   console.error(error)
    //   this.html = ''
    //   this.html = '<span style="color:red;">🤦‍♂️ Uh oh! The fetch failed! 🤦‍♂️</span>'
    // })
  }

  shouldRenderHTML () {
    return !this.appointmentWrapper
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * renders the html
   * @return void
   * @param {{ selectedSubscription: { dayList: any; }; filters: {subscriptions: any;} }} appointmentsData
   */
  renderHTML (appointmentsData) {
    this.appointmentWrapper = this.root.querySelector('div') || document.createElement('div')
    this.html = /* html */`
        <h1>Abo-Termine buchen</h1>
        <hr>
        <h2>The Dropdown</h2>
        ${this.display_nested_objects(appointmentsData.filters.subscriptions)} 
        <hr>
        ${this.display_properties(appointmentsData.selectedSubscription.dayList)} 
      `
  }

  /**
   * renders the css
   *
   * @return void
   */
  renderCSS () {
    this.css = /* css */`
    :host {}
    :host h1 {
      font-size:50px;
    }
    @media only screen and (max-width: _max-width_) {
      :host {}
    }
    `
  }

  display_properties (obj) {
    let result = ''

    // Loop through each property in the object
    for (const key in obj) {
      // Check if the value is an object
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] === 'object') {
          result += this.display_nested_objects(obj[key])
        } else {
          // If the value is a primitive type, display it directly
          result += '<p><strong>' + key + ':</strong> ' + obj[key] + '</p>'
        }
      }
    }
    result += '<hr>'
    return result
  }

  display_nested_objects (nestedObj) {
    let result = ''

    // Loop through each property in the nested object
    for (const key in nestedObj) {
      // Check if the value is an array
      if (Array.isArray(nestedObj[key])) {
        result += '<ul>'
        for (let i = 0; i < nestedObj[key].length; i++) {
          // Course data (Appointment) per day
          result += '<li>' + this.display_properties(nestedObj[key][i]) + '</li>'
        }
        result += '</ul>'
      } else {
        // If the value is an object, stringify it before adding to the result
        if (typeof nestedObj[key] === 'object') {
          result += '<ul>' + this.display_properties(nestedObj[key]) + '</ul>'
        } else {
          result += '<p><strong>' + key + ':</strong> ' + nestedObj[key] + '</p>'
        }
      }
    }

    return result
  }
}
