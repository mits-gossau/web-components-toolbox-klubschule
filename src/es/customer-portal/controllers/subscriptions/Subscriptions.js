// @ts-check
import { actionType } from '../../helpers/Mapping.js'

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
    this.abortControllerSubscriptions = null
  }

  connectedCallback () {
    this.addEventListener(this.getAttribute('request-subscriptions') || 'request-subscriptions', this.requestSubscriptionsListener)
  }

  disconnectedCallback () {
    this.removeEventListener(this.getAttribute('request-subscriptions') || 'request-subscriptions', this.requestSubscriptionsListener)
  }

  requestSubscriptionsListener = async (event) => {
    console.log('Controller - requestSubscriptionsListener', event)
    if (this.abortControllerSubscriptions) this.abortControllerSubscriptions.abort()
    this.abortControllerSubscriptions = new AbortController()
    const data = {
      userId: '50505A02-2AA4-47AA-9AED-0B759902A0C2'
    }
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      signal: this.abortControllerSubscriptions.signal
    }
    const endpoint = 'https://qual.klubschule.ch/api/customerportal/subscriptions'
    this.dispatchEvent(new CustomEvent(this.getAttribute('update-subscriptions') || 'update-subscriptions', {
      detail: {
        fetch: fetch(endpoint, fetchOptions).then(async response => {
          if (response.status >= 200 && response.status <= 299) return await response.json()
          throw new Error(response.statusText)
        }),
        type: actionType.subscriptions
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }
}
