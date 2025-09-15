// @ts-check
/* global AbortController */
/* global CustomEvent */
/* global fetch */
/* global HTMLElement */
/* global self */

/**
 * @class Header
 * @type {CustomElementConstructor}
 */
export default class Header extends HTMLElement {
  constructor () {
    super()
    this.abortControllerRequestStatusMonitor = null
  }

  connectedCallback () {
    this.addEventListener('request-status-monitor', this.requestStatusMonitor)
  }

  disconnectedCallback () {
    this.removeEventListener('request-status-monitor', this.requestStatusMonitor)
  }

  requestStatusMonitor = (event) => {
    if (this.abortControllerRequestStatusMonitor) this.abortControllerRequestStatusMonitor.abort()
    this.abortControllerRequestStatusMonitor = new AbortController()
    const completed = event?.detail?.completed || false

    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('kunden-portal').getStatusmonitor}`
    const data = {
      language: 'de',
      courseType: '',
      courseId: 0,
      messageType: ''
    }
    const options = this.fetchPOSTOptions(data, this.abortControllerRequestStatusMonitor)

    this.dispatchEvent(new CustomEvent('update-status-monitor', {
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
