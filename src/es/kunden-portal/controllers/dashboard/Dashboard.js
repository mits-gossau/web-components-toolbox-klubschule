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
  constructor() {
    super()
    this.abortControllerDashboardFakeMe = null
    this.abortControllerDashboardSubscriptions = null
  }

  connectedCallback() {
    this.addEventListener('request-dashboard-fake-me', this.requestDashboardFakeMe)
    this.addEventListener('request-dashboard-subscriptions', this.requestSubscriptions)
  }

  disconnectedCallback() {
    this.removeEventListener('request-dashboard-fake-me', this.requestDashboardFakeMe)
    this.removeEventListener('request-dashboard-subscriptions', this.requestSubscriptions)
  }

  /**
   * GET Example for a CustomEvent to request data for the dashboard
   * Request FakeMe data for the dashboard.
   * @param {CustomEventInit} event
   */
  requestDashboardFakeMe = async (event) => {
    if (this.abortControllerDashboardFakeMe) this.abortControllerDashboardFakeMe.abort()
    this.abortControllerDashboardFakeMe = new AbortController()
    // const data = {}
    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('kunden-portal').fakeMe}`
    this.dispatchEvent(new CustomEvent('update-dashboard-fake-me', {
      detail: {
        fetch: fetch(endpoint).then(async response => {
          return await response.json()
        }),
        type: 'fake-me'
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  /**
   * Sends a POST request to fetch user subscriptions for the dashboard.
   * Dispatches the request to the API endpoint defined in Environment.
   * @param {CustomEventInit} event - The event that triggered the request.
   */
  requestSubscriptions = (event) => {
    if (this.abortControllerDashboardSubscriptions) this.abortControllerDashboardSubscriptions.abort()
    this.abortControllerDashboardSubscriptions = new AbortController()

    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('kunden-portal').apiSubscriptions}`
    const data = { language: 'de' }
    const options = this.fetchPOSTOptions(data, this.abortControllerDashboardSubscriptions)

    this.dispatchEvent(new CustomEvent('update-subscriptions', {
      detail: {
        fetch: fetch(endpoint, options)
          .then(async response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
            return await response.json()
          })
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
  fetchPOSTOptions(data, abortController) {
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
