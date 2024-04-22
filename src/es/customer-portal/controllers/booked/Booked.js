// @ts-check

/* global AbortController */
/* global CustomEvent */
/* global fetch */
/* global HTMLElement */

/**
* @export
* @class Booked
* @type {CustomElementConstructor}
*/
export default class Booked extends HTMLElement {
  constructor () {
    super()
    this.abortControllerBookedSubscriptionCourseAppointments = null
  }

  connectedCallback () {
    this.addEventListener(this.getAttribute('request-booked-subscription-course-appointments') || 'request-booked-subscription-course-appointments', this.requestBookedSubscriptionCourseAppointmentsListener)
  }

  disconnectedCallback () {
    this.removeEventListener(this.getAttribute('request-booked-subscription-course-appointments') || 'request-booked-subscription-course-appointments', this.requestBookedSubscriptionCourseAppointmentsListener)
  }

  requestBookedSubscriptionCourseAppointmentsListener = async (event) => {
    console.log('Controller - requestBookedSubscriptionCourseAppointmentsListener', event)
    if (this.abortControllerBookedSubscriptionCourseAppointments) this.abortControllerBookedSubscriptionCourseAppointments.abort()
    this.abortControllerBookedSubscriptionCourseAppointments = new AbortController()
    const data = {
      userId: '50505A02-2AA4-47AA-9AED-0B759902A0C2',
      subscriptionType: '',
      subscriptionId: 'undefined',
      includeConsumedAppointments: 'false'
    }
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      signal: this.abortControllerBookedSubscriptionCourseAppointments.signal
    }
    const endpoint = 'https://qual.klubschule.ch/api/customerportal/bookedsubscriptioncourseappointments'
    this.dispatchEvent(new CustomEvent(this.getAttribute('update-subscription-course-appointments') || 'update-subscription-course-appointments', {
      detail: {
        fetch: fetch(endpoint, fetchOptions).then(async response => {
          if (response.status >= 200 && response.status <= 299) return await response.json()
          throw new Error(response.statusText)
        })
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }
}
