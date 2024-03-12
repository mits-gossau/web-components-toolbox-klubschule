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
    this.abortController = null
  }

  connectedCallback () {
    this.addEventListener(this.getAttribute('request-booked-event-name') || 'request-booked-event-name', this.requestBookedListener)
  }

  disconnectedCallback () {
    this.removeEventListener(this.getAttribute('request-booked-event-name') || 'request-booked-event-name', this.requestBookedListener)
  }

  requestBookedListener = async (event) => {
    if (this.abortController) this.abortController.abort()
    this.abortController = new AbortController()
    const fetchOptions = {
      method: 'GET',
      signal: this.abortController.signal
    }
    const endpoint = ''
    this.dispatchEvent(new CustomEvent(this.getAttribute('update-booked') || 'update-booked', {
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
