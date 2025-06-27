// @ts-check
/* global AbortController */
/* global CustomEvent */
/* global fetch */
/* global HTMLElement */
/* global self */

/**
 * EXAMPLE!!!
 * @example ./pages/Dashboard.js
 * @class Dashboard
 * @type {CustomElementConstructor}
 */
export default class Dashboard extends HTMLElement {
  constructor () {
    super()
    this.abortControllerDashboardInitial = null
  }

  connectedCallback () {
    this.addEventListener('request-dashboard-initial-load', this.requestDashboardInitialListener)
  }

  disconnectedCallback () {
    this.removeEventListener('request-dashboard-initial-load', this.requestDashboardInitialListener)
  }

  /**
   * Request initial data for the dashboard.
   * @param {CustomEventInit} event
   */
  requestDashboardInitialListener = async (event) => {
    if (this.abortControllerDashboardInitial) this.abortControllerDashboardInitial.abort()
    this.abortControllerDashboardInitial = new AbortController()
    const data = {}
    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('customer-portal').apiSubscriptionCourseAppointments}`
    const fetchOptions = this.fetchPOSTOptions(data, this.abortControllerDashboardInitial)
    this.dispatchEvent(new CustomEvent('update-dashboard-initial-load', {
      detail: {
        fetch: (this.subscriptionCourseAppointments = fetch(endpoint, fetchOptions).then(async response => {
          if (response.status >= 200 && response.status <= 299) {
            const appointments = await response.json()
            return appointments
          }
        }))
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  /**
   * Returns an object with request method, http headers, body, and signal properties for making a POST request with fetch.
   * @param {Object} data - The data that you want to send in the POST request. This data should be in a format that can be converted to JSON.
   * @param {AbortController} abortController - Abort Fetch requests
   * @returns {Object} An object is being returned to use as option object for api fetch
   */
  fetchPOSTOptions (data, abortController) {
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      signal: abortController.signal
    }
  }
}
