// @ts-check

/* global AbortController */
/* global CustomEvent */
/* global fetch */
/* global HTMLElement */
/* global self */

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
    if (this.abortControllerBookedSubscriptionCourseAppointments) this.abortControllerBookedSubscriptionCourseAppointments.abort()
    this.abortControllerBookedSubscriptionCourseAppointments = new AbortController()
    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('customer-portal').apiBookedSubscriptionCourseAppointments}`
    const { subscriptionType, subscriptionId } = event.detail
    const { userId } = this.dataset
    const data = {
      userId,
      subscriptionType,
      subscriptionId,
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
