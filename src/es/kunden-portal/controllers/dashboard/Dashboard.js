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
    this.addEventListener('request-dashboard-fake-me', this.requestDashboardFakeMe)
  }

  disconnectedCallback () {
    this.removeEventListener('request-dashboard-fake-me', this.requestDashboardFakeMe)
  }

  /**
   * Request FakeMe data for the dashboard.
   * @param {CustomEventInit} event
   */
  requestDashboardFakeMe = async (event) => {
    debugger
    if (this.abortControllerDashboardInitial) this.abortControllerDashboardInitial.abort()
    this.abortControllerDashboardInitial = new AbortController()
    const data = {
    }
    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('kunden-portal').fakeMe}`
    this.dispatchEvent(new CustomEvent('update-dashboard-fake-me', {
      detail: {
        fetch: (this.subscriptionCourseAppointments = fetch(endpoint).then(async response => {
          if (response.status >= 200 && response.status <= 299) {
            const data = await response.json()
            return data
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
