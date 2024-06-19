// @ts-check

/* global AbortController */
/* global CustomEvent */
/* global fetch */
/* global HTMLElement */
/* global self */

/**
* @export
* @class Subscriptions
* @type {CustomElementConstructor}
*/
export default class Subscriptions extends HTMLElement {
  constructor () {
    super()
    this.abortControllerSubscriptions = null
    this.abortControllerSubscriptionDetail = null
    this.abortControllerSubscriptionPdf = null
  }

  connectedCallback () {
    this.addEventListener(this.getAttribute('request-subscriptions') || 'request-subscriptions', this.requestSubscriptionsListener)
    this.addEventListener(this.getAttribute('request-subscription-detail') || 'request-subscription-detail', this.requestSubscriptionDetailListener)
    this.addEventListener('request-subscription-pdf', this.requestSubscriptionPdfListener)
  }

  disconnectedCallback () {
    this.removeEventListener(this.getAttribute('request-subscriptions') || 'request-subscriptions', this.requestSubscriptionsListener)
    this.removeEventListener(this.getAttribute('request-subscription-detail') || 'request-subscription-detail', this.requestSubscriptionDetailListener)
    this.removeEventListener('request-subscription-pdf', this.requestSubscriptionPdfListener)
  }

  /**
   * List all Subscriptions
   * @param {CustomEventInit} event
   */
  requestSubscriptionsListener = async (event) => {
    if (this.abortControllerSubscriptions) this.abortControllerSubscriptions.abort()
    this.abortControllerSubscriptions = new AbortController()
    const { userId } = this.dataset
    const data = {
      userId,
      language: this.getLanguage()
    }
    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('customer-portal').apiSubscriptions}`
    const fetchOptions = this.fetchPOSTOptions(data, this.abortControllerSubscriptions)
    this.dispatchEvent(new CustomEvent(this.getAttribute('update-subscriptions') || 'update-subscriptions', {
      detail: {
        fetch: fetch(endpoint, fetchOptions).then(async response => {
          if (response.status >= 200 && response.status <= 299) return await response.json()
          throw new Error(response.statusText)
        }),
        type: 'subscriptions'
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  /**
   * Get Subscription Detail
   * @param {CustomEventInit} event
   */
  requestSubscriptionDetailListener = async (event) => {
    if (this.abortControllerSubscriptionDetail) this.abortControllerSubscriptionDetail.abort()
    this.abortControllerSubscriptionDetail = new AbortController()
    const tags = JSON.parse(event.detail.tags)
    const { subscriptionId, subscriptionKindId, subscriptionType } = tags[0]
    const id = `${subscriptionId}_${subscriptionKindId}`
    const { userId } = this.dataset
    const data = {
      subscriptionId,
      subscriptionType,
      userId,
      language: this.getLanguage()
    }
    const type = tags[2] ? tags[2].type : ''
    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('customer-portal').apiSubscriptionDetail}`
    const fetchOptions = this.fetchPOSTOptions(data, this.abortControllerSubscriptionDetail)
    this.dispatchEvent(new CustomEvent(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', {
      detail: {
        fetch: fetch(endpoint, fetchOptions).then(async response => {
          if (response.status >= 200 && response.status <= 299) return await response.json()
        }),
        id,
        type
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  /**
   * Get subscriptions as PDF
   * @param {CustomEventInit} event
   */
  requestSubscriptionPdfListener = async (event) => {
    if (this.abortControllerSubscriptionPdf) this.abortControllerSubscriptionPdf.abort()
    this.abortControllerSubscriptionPdf = new AbortController()
    const { subscriptionId, subscriptionKindId, subscriptionType } = JSON.parse(event.detail.subscription)
    const id = `${subscriptionId}_${subscriptionKindId}`
    const { userId } = this.dataset
    const data = {
      subscriptionId,
      subscriptionType,
      userId,
      language: this.getLanguage()
    }
    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('customer-portal').apiSubscriptionPdf}`
    const fetchOptions = this.fetchPOSTOptions(data, this.abortControllerSubscriptionPdf)
    this.dispatchEvent(new CustomEvent(this.getAttribute('update-subscription-pdf') || 'update-subscription-pdf', {
      detail: {
        fetch: fetch(endpoint, fetchOptions).then(async response => {
          if (response.status >= 200 && response.status <= 299) return await response.blob()
        }),
        id
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  /**
   * Returns an object with method, headers, body, and signal properties for making a POST request with fetch.
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

  getLanguage () {
    // @ts-ignore
    return self.Environment.language.substring(0, 2) || 'de'
  }
}
