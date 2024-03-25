// @ts-check

/* global AbortController */
/* global CustomEvent */
/* global fetch */
/* global HTMLElement */

/**
* @export
* @class Appointments
* @type {CustomElementConstructor}
*/
export default class Appointments extends HTMLElement {
  constructor () {
    super()
    this.abortControllerSubscriptionCourseAppointments = null
  }

  connectedCallback () {
    this.addEventListener(this.getAttribute('request-subscription-course-appointments') || 'request-subscription-course-appointments', this.requestSubscriptionCourseAppointmentsListener)
  }

  disconnectedCallback () {
    this.removeEventListener(this.getAttribute('request-subscription-course-appointments') || 'request-subscription-course-appointments', this.requestSubscriptionCourseAppointmentsListener)
  }

  requestSubscriptionCourseAppointmentsListener = async (event) => {
    console.log('Controller - requestSubscriptionCourseAppointmentsListener', event)
    if (this.abortControllerSubscriptionCourseAppointments) this.abortControllerSubscriptionCourseAppointments.abort()
    this.abortControllerSubscriptionCourseAppointments = new AbortController()

    // when use dropdown send this data
    /*
      subscriptionId
      subscriptionType
      userId
     */
    const userId = '50505A02-2AA4-47AA-9AED-0B759902A0C2'
    const eventData = event.detail
    const data = {
      userId,
      subscriptionType: eventData.subscriptionType || '',
      subscriptionId: eventData.subscriptionId || ''
    }

    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      signal: this.abortControllerSubscriptionCourseAppointments.signal
    }
    const endpoint = 'https://qual.klubschule.ch/api/customerportal/subscriptioncourseappointments'
    // const endpoint = '../../es/customer-portal/controllers/appointments/dummy-simple.json'
    this.dispatchEvent(new CustomEvent(this.getAttribute('update-subscription-course-appointments') || 'update-subscription-course-appointments', {
      detail: {
        fetch: fetch(endpoint, fetchOptions).then(async response => {
        // fetch: fetch(endpoint).then(async response => {
          if (response.status >= 200 && response.status <= 299) return await response.json()
        })
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }
}
