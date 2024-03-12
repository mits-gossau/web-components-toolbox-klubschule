// @ts-check
import { Shadow } from '../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

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
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback() {
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

  disconnectedCallback() {
    document.body.removeEventListener(this.getAttribute('update-subscription-course-appointments') || 'update-subscription-course-appointments', this.subscriptionCourseAppointmentsListener)
  }

  subscriptionCourseAppointmentsListener = async (event) => {
    console.log("subscriptionCourseAppointmentsListener", event);
    event.detail.fetch.then(appointments => {
      console.log(appointments);
      this.renderHTML(appointments)
    }).catch(error => {
      this.html = ''
      this.html = `<span style="color:red;">🤦‍♂️ Uh oh! The fetch failed! 🤦‍♂️</span>`
    })
  }

  shouldRenderHTML() {
    return !this.appointmentWrapper
  }

  shouldRenderCSS() {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * renders the html
   * @return {Promise<void>}
  */
  renderHTML(appointmentsData) {
    this.appointmentWrapper = this.root.querySelector('div') || document.createElement('div')
    this.html = /* html */`
        <h1>Abo-Termine buchen</h1>
        ${this.display_properties(appointmentsData.selectedSubscription.dayList)} 
      `
  }

  /**
   * renders the m-Teaser css
   *
   * @return {Promise<void>}
   */
  renderCSS() {
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

  display_properties(obj) {
    let result = '';

    // Loop through each property in the object
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Check if the value is an object
        if (typeof obj[key] === 'object') {
          result += this.display_nested_objects(obj[key]) + '<hr>';
        } else {
          // If the value is a primitive type, display it directly
          result += '<p><strong>' + key + ':</strong> ' + obj[key] + '</p>';
        }
      }
    }

    return result;
  }

  display_nested_objects(nestedObj) {
    let result = '';

    // Loop through each property in the nested object
    for (let key in nestedObj) {
      if (nestedObj.hasOwnProperty(key)) {
        // Check if the value is an array
        if (Array.isArray(nestedObj[key])) {
          result += '<ul>';
          for (let i = 0; i < nestedObj[key].length; i++) {
            // Course data (Appointment) per day
            result += '<li>' + this.display_properties(nestedObj[key][i]) + '</li>';
          }
          result += '</ul>';
        } else {
          // If the value is an object, stringify it before adding to the result
          if (typeof nestedObj[key] === 'object') {
            result += '<ul>' + this.display_properties(nestedObj[key]) + '</ul>';
          } else {
            result += '<p><strong>' + key + ':</strong> ' + nestedObj[key] + '</p>';
          }
        }
      }
    }

    return result;
  }
}
