// @ts-check
import { actionType } from '../../helpers/Mapping.js'
import { makeUniqueCourseId } from '../../helpers/Shared.js'

/* global AbortController */
/* global CustomEvent */
/* global fetch */
/* global HTMLElement */
/* global self */

/**
 * This class is responsible for managing the appointments functionality in the customer portal.
 * @example ./pages/Appointments.js
 * @class Appointments
 * @type {CustomElementConstructor}
 */
export default class Appointments extends HTMLElement {
  constructor () {
    super()
    this.abortControllerSubscriptionCourseAppointments = null
    this.abortControllerSubscriptionCourseAppointmentDetail = null
    this.abortControllerSubscriptionCourseAppointmentBooking = null
    this.abortControllerSubscriptionCourseAppointmentReversalListener = null
  }

  connectedCallback () {
    this.addEventListener(this.getAttribute('request-subscription-course-appointments') || 'request-subscription-course-appointments', this.requestSubscriptionCourseAppointmentsListener)
    this.addEventListener(this.getAttribute('request-subscription-course-appointment-detail') || 'request-subscription-course-appointment-detail', this.requestSubscriptionCourseAppointmentDetailListener)
    this.addEventListener(this.getAttribute('request-subscription-course-appointment-reversal') || 'request-subscription-course-appointment-reversal', this.requestSubscriptionCourseAppointmentReversalListener)
    this.addEventListener(this.getAttribute('request-subscription-course-appointment-booking') || 'request-subscription-course-appointment-booking', this.requestSubscriptionCourseAppointmentBookingListener)
  }

  disconnectedCallback () {
    this.removeEventListener(this.getAttribute('request-subscription-course-appointments') || 'request-subscription-course-appointments', this.requestSubscriptionCourseAppointmentsListener)
    this.removeEventListener(this.getAttribute('request-subscription-course-appointment-detail') || 'request-subscription-course-appointment-detail', this.requestSubscriptionCourseAppointmentDetailListener)
    this.removeEventListener(this.getAttribute('request-subscription-course-appointment-reversal') || 'request-subscription-course-appointment-reversal', this.requestSubscriptionCourseAppointmentReversalListener)
    this.removeEventListener(this.getAttribute('request-subscription-course-appointment-booking') || 'request-subscription-course-appointment-booking', this.requestSubscriptionCourseAppointmentBookingListener)
  }

  /**
   * List all Course Appointments
   * @param {CustomEventInit} event
   */
  requestSubscriptionCourseAppointmentsListener = async (event) => {
    // TODO: When use dropdown send this data
    // subscriptionId
    // subscriptionType
    // userId
    if (this.abortControllerSubscriptionCourseAppointments) this.abortControllerSubscriptionCourseAppointments.abort()
    this.abortControllerSubscriptionCourseAppointments = new AbortController()
    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('customer-portal').apiSubscriptionCourseAppointments}`
    const { subscriptionType, subscriptionId } = event.detail
    const { userId } = this.dataset
    const data = {
      userId,
      subscriptionType,
      subscriptionId
    }
    const fetchOptions = this.fetchPOSTOptions(data, this.abortControllerSubscriptionCourseAppointments)
    this.dispatchEvent(new CustomEvent(this.getAttribute('update-subscription-course-appointments') || 'update-subscription-course-appointments', {
      detail: {
        fetch: fetch(endpoint, fetchOptions).then(async response => {
          if (response.status >= 200 && response.status <= 299) return await response.json()
        })
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  /**
   * Make Course Booking
   * @param {CustomEventInit} event
   */
  requestSubscriptionCourseAppointmentBookingListener = async (event) => {
    if (this.abortControllerSubscriptionCourseAppointmentBooking) this.abortControllerSubscriptionCourseAppointmentBooking.abort()
    this.abortControllerSubscriptionCourseAppointmentBooking = new AbortController()
    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('customer-portal').apiSubscriptionCourseAppointmentBooking}`
    const tags = JSON.parse(event.detail.tags)
    const courseId = makeUniqueCourseId(tags[0])
    const data = {
      courseAppointmentDate: tags[0].courseAppointmentDate,
      courseAppointmentTimeFrom: tags[0].courseAppointmentTimeFrom,
      courseId: tags[0].courseId,
      courseType: tags[0].courseType,
      subscriptionId: tags[1].subscriptionId,
      subscriptionType: tags[1].subscriptionType,
      userId: this.dataset.userId
    }
    const fetchOptions = this.fetchPOSTOptions(data, this.abortControllerSubscriptionCourseAppointmentBooking)
    this.dispatchEvent(new CustomEvent(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', {
      detail: {
        fetch: fetch(endpoint, fetchOptions).then(async response => {
          if (response.status >= 200 && response.status <= 299) return await response.json()
        }),
        id: courseId,
        type: actionType.booking
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  /**
   * Get Course Detail
   * @param {CustomEventInit} event
   */
  requestSubscriptionCourseAppointmentDetailListener = async (event) => {
    if (this.abortControllerSubscriptionCourseAppointmentDetail) this.abortControllerSubscriptionCourseAppointmentDetail.abort()
    this.abortControllerSubscriptionCourseAppointmentDetail = new AbortController()
    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('customer-portal').apiSubscriptionCourseAppointmentDetail}`
    const tags = JSON.parse(event.detail.tags)
    const courseId = makeUniqueCourseId(tags[0])
    const data = {
      courseAppointmentDate: tags[0].courseAppointmentDate,
      courseAppointmentTimeFrom: tags[0].courseAppointmentTimeFrom,
      courseId: tags[0].courseId,
      courseType: tags[0].courseType,
      subscriptionId: tags[1].subscriptionId,
      subscriptionType: tags[1].subscriptionType,
      userId: this.dataset.userId
    }
    const type = tags[2] ? tags[2].type : ''
    const fetchOptions = this.fetchPOSTOptions(data, this.abortControllerSubscriptionCourseAppointmentDetail)
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

  /**
   * Make Course Reversal
   * @param {CustomEventInit} event
   */
  requestSubscriptionCourseAppointmentReversalListener = async (event) => {
    if (this.abortControllerSubscriptionCourseAppointmentReversalListener) this.abortControllerSubscriptionCourseAppointmentReversalListener.abort()
    this.abortControllerSubscriptionCourseAppointmentReversalListener = new AbortController()
    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('customer-portal').apiSubscriptionCourseAppointmentReversal}`
    const tags = JSON.parse(event.detail.tags)
    const courseId = makeUniqueCourseId(tags[0])
    const data = {
      courseAppointmentDate: tags[0].courseAppointmentDate,
      courseAppointmentTimeFrom: tags[0].courseAppointmentTimeFrom,
      courseId: tags[0].courseId,
      courseType: tags[0].courseType,
      subscriptionId: tags[1].subscriptionId,
      subscriptionType: tags[1].subscriptionType,
      userId: this.dataset.userId
    }
    const fetchOptions = this.fetchPOSTOptions(data, this.abortControllerSubscriptionCourseAppointmentReversalListener)
    this.dispatchEvent(new CustomEvent(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', {
      detail: {
        fetch: fetch(endpoint, fetchOptions).then(async response => {
          if (response.status >= 200 && response.status <= 299) return await response.json()
        }),
        id: courseId,
        type: actionType.reversal
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
}
