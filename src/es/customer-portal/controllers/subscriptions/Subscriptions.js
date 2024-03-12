// @ts-check

/* global AbortController */
/* global CustomEvent */
/* global fetch */
/* global HTMLElement */

/**
* @export
* @class Subscriptions
* @type {CustomElementConstructor}
*/
export default class Subscriptions extends HTMLElement {
  constructor () {
    super()
    this.abortController = null
  }

  connectedCallback () {
    this.addEventListener(this.getAttribute('request-subscriptions-event-name') || 'request-subscriptions-event-name', this.requestSubscriptionsListener)
  }

  disconnectedCallback () {
    this.removeEventListener(this.getAttribute('request-subscriptions-event-name') || 'request-subscriptions-event-name', this.requestSubscriptionsListener)
  }

  requestSubscriptionsListener = async (event) => {
    if (this.abortController) this.abortController.abort()
    this.abortController = new AbortController()
    const fetchOptions = {
      method: 'GET',
      signal: this.abortController.signal
    }
    const endpoint = ''
    this.dispatchEvent(new CustomEvent(this.getAttribute('update-subscriptions') || 'update-subscriptions', {
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
