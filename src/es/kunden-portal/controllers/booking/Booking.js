// @ts-check
/* global AbortController */
/* global CustomEvent */
/* global fetch */
/* global HTMLElement */
/* global self */

/**
 * @class Booking
 * @type {CustomElementConstructor}
 */
export default class Booking extends HTMLElement {
  constructor () {
    super()
    this.abortControllerBooking = null
  }

  connectedCallback () {
    document.addEventListener('request-booking', this.requestBooking)
    document.addEventListener('request-followup', this.requestFollowUp)
    this.addEventListener('close-notification', this.handleNotification)
  }

  disconnectedCallback () {
    document.removeEventListener('request-booking', this.requestBooking)
    document.removeEventListener('request-followup', this.requestFollowUp)
    this.removeEventListener('close-notification', this.handleNotification)
  }

  requestBooking = (event) => {
    if (this.abortControllerBooking) this.abortControllerBooking.abort()
    this.abortControllerBooking = new AbortController()

    const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '')
    const courseId = urlParams.get('courseId') || event.detail.courseId
    if (!courseId) {
      console.error('Course ID is required for booking.')
      return
    }

    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('kunden-portal').myBooking}`
    const data = {
      language: 'de',
      courseType: 'E',
      courseId
    }
    const options = this.fetchPOSTOptions(data, this.abortControllerBooking)

    this.dispatchEvent(new CustomEvent('update-booking', {
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

  requestFollowUp = (event) => {
    if (this.abortControllerBooking) this.abortControllerBooking.abort()
    this.abortControllerBooking = new AbortController()

    if (!event.detail.courseIdFollowUp) return

    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('kunden-portal').myBooking}`
    const data = {
      language: 'de',
      courseType: 'E',
      courseId: event.detail.courseIdFollowUp
    }
    const options = this.fetchPOSTOptions(data, this.abortControllerBooking)

    this.dispatchEvent(new CustomEvent('update-followup', {
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

  // TODO: Remove this
  // No query selector in controllers
  handleNotification = (event) => {
    console.log('Notification wurde geschlossen:', event)
    setTimeout(() => {
      const notification = this.querySelector('o-body')?.shadowRoot?.querySelector('ks-o-body-section')?.shadowRoot?.querySelector('p-booking')?.shadowRoot?.querySelector('o-grid')?.shadowRoot?.querySelector('ks-o-body-section')?.shadowRoot?.querySelector('#booking-notification')
      const spacing = this.querySelector('o-body')?.shadowRoot?.querySelector('ks-o-body-section')?.shadowRoot?.querySelector('p-booking')?.shadowRoot?.querySelector('o-grid')?.shadowRoot?.querySelector('ks-o-body-section')?.shadowRoot?.querySelector('#notification-spacing')
      if (notification && spacing) spacing.remove()
    }, 0)
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
