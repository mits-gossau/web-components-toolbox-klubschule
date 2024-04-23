// @ts-check
import { actionType } from '../../helpers/Mapping.js'

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
  }

  connectedCallback () {
    this.addEventListener(this.getAttribute('request-subscriptions') || 'request-subscriptions', this.requestSubscriptionsListener)
    this.addEventListener(this.getAttribute('request-subscription-detail') || 'request-subscription-detail', this.requestSubscriptionDetailListener)
  }

  disconnectedCallback () {
    this.removeEventListener(this.getAttribute('request-subscriptions') || 'request-subscriptions', this.requestSubscriptionsListener)
    this.removeEventListener(this.getAttribute('request-subscription-detail') || 'request-subscription-detail', this.requestSubscriptionDetailListener)
  }

  /**
   * List all Subscriptions
   * @param {CustomEventInit} event
   */
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

  /**
   * Get Subscription Detail
   * @param {CustomEventInit} event
   */
  requestSubscriptionDetailListener = async (event) => {
    if (this.abortControllerSubscriptionDetail) this.abortControllerSubscriptionDetail.abort()
    this.abortControllerSubscriptionDetail = new AbortController()
    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('customer-portal').apiSubscriptionDetail}`
    const tags = JSON.parse(event.detail.tags)
    debugger
    const courseId = `${tags[0].subscriptionId}_${tags[0].subscriptionKindId}`
    const data = {
      subscriptionId: tags[0].subscriptionId,
      subscriptionType: tags[0].subscriptionType,
      userId: this.dataset.userId
    }
    const type = tags[2] ? tags[2].type : ''
    // const fetchOptions = this.fetchPOSTOptions(data, this.abortControllerSubscriptionCourseAppointmentDetail)
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      signal: this.abortControllerSubscriptionDetail.signal
    }
    this.dispatchEvent(new CustomEvent(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', {
      detail: {
        fetch: fetch(endpoint, fetchOptions).then(async response => {
          if (response.status >= 200 && response.status <= 299) return await response.json()
        }),
        id: courseId,
        type
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }
}
