// @ts-check
/* global AbortController */
/* global CustomEvent */
/* global fetch */
/* global HTMLElement */
/* global self */

/**
 * @class Dashboard
 * @type {CustomElementConstructor}
 */
export default class Dashboard extends HTMLElement {
  constructor () {
    super()
    this.abortControllerRequestBookings = null
  }

  connectedCallback () {
    this.addEventListener('request-bookings', this.requestBookings)
  }

  disconnectedCallback () {
    this.removeEventListener('request-bookings', this.requestBookings)
  }

  abortController (abortController) {
    if (abortController) {
      abortController.abort()
    }
    abortController = new AbortController()
    return abortController
  }

  /**
   * Sends a POST request to fetch user bookings for bookings.
   * Dispatches the request to the API endpoint defined in Environment.
   * @param {CustomEventInit} event - The event that triggered the request.
   */
  requestBookings = (event) => {
    // if (this.abortControllerRequestBookings) this.abortControllerRequestBookings.abort()
    // this.abortControllerRequestBookings = new AbortController()
    this.abortControllerRequestBookings = this.abortController(this.abortControllerRequestBookings)

    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('kunden-portal').myBookings}`
    const data = { language: 'de' }
    const options = this.fetchPOSTOptions(data, this.abortControllerRequestBookings)

    this.dispatchEvent(new CustomEvent('update-bookings', {
      detail: {
        fetch: fetch(endpoint, options).then(async response => {
          // TODO: Improve error handling
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
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
