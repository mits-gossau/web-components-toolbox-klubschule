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
    this.abortControllerRequestBookingsBooked = null
  }

  connectedCallback () {
    this.addEventListener('request-bookings', this.requestBookings)
    this.addEventListener('request-bookings-booked', this.requestBookingsBooked)
  }

  disconnectedCallback () {
    this.removeEventListener('request-bookings', this.requestBookings)
    this.removeEventListener('request-bookings-booked', this.requestBookingsBooked)
  }

  /**
   * Sends a POST request to fetch user bookings for bookings.
   * Dispatches the request to the API endpoint defined in Environment.
   * @param {CustomEventInit} event - The event that triggered the request.
   */
  requestBookings = (event) => {
    if (this.abortControllerRequestBookings) this.abortControllerRequestBookings.abort()
    this.abortControllerRequestBookings = new AbortController()
    const completed = event?.detail?.completed || false

    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('kunden-portal').getMyBookings}`
    const data = { language: 'de', completed }
    const options = this.fetchPOSTOptions(data, this.abortControllerRequestBookings)

    this.dispatchEvent(new CustomEvent('update-bookings', {
      detail: {
        fetch: fetch(endpoint, options).then(async response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          return await response.json()
        }),
        completed
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  requestBookingsBooked = (event) => {
    if (this.abortControllerRequestBookingsBooked) this.abortControllerRequestBookingsBooked.abort()
    this.abortControllerRequestBookingsBooked = new AbortController()
    const completed = event?.detail?.completed || false

    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('kunden-portal').getMyBookings}`
    const data = { language: 'de', completed }
    const options = this.fetchPOSTOptions(data, this.abortControllerRequestBookingsBooked)

    this.dispatchEvent(new CustomEvent('update-bookings-booked', {
      detail: {
        fetch: fetch(endpoint, options).then(async response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          return await response.json()
        }),
        completed
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
