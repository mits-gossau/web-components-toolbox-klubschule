// @ts-check
import { makeUniqueCourseId } from '../../helpers/Shared.js'

/* global self */
/* global AbortController */
/* global CustomEvent */
/* global fetch */
/* global HTMLElement */

/**
* @export
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

  // LIST ALL
  requestSubscriptionCourseAppointmentsListener = async (event) => {
    if (this.abortControllerSubscriptionCourseAppointments) this.abortControllerSubscriptionCourseAppointments.abort()
    this.abortControllerSubscriptionCourseAppointments = new AbortController()

    // when use dropdown send this data
    /*
      subscriptionId
      subscriptionType
      userId
     */
    const { subscriptionType, subscriptionId } = event.detail
    const { userId } = this.dataset
    const data = {
      userId,
      subscriptionType,
      subscriptionId
    }

    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      signal: this.abortControllerSubscriptionCourseAppointments.signal
    }
    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('customer-portal').apiSubscriptionCourseAppointments}`
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

  // MAKE BOOKING
  requestSubscriptionCourseAppointmentBookingListener = async (event) => {
    if (this.abortControllerSubscriptionCourseAppointmentBooking) this.abortControllerSubscriptionCourseAppointmentBooking.abort()
    this.abortControllerSubscriptionCourseAppointmentBooking = new AbortController()
    const tags = JSON.parse(event.detail.tags)
    const data = {
      courseAppointmentDate: tags[0].courseAppointmentDate,
      courseAppointmentTimeFrom: tags[0].courseAppointmentTimeFrom,
      courseId: tags[0].courseId,
      courseType: tags[0].courseType,
      subscriptionId: tags[1].subscriptionId,
      subscriptionType: tags[1].subscriptionType,
      userId: this.dataset.userId
    }
    const courseId = makeUniqueCourseId(tags[0])
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      signal: this.abortControllerSubscriptionCourseAppointmentBooking.signal
    }
    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('customer-portal').apiSubscriptionCourseAppointmentBooking}`
    this.dispatchEvent(new CustomEvent(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', {
      detail: {
        fetch: fetch(endpoint, fetchOptions).then(async response => {
          if (response.status >= 200 && response.status <= 299) return await response.json()
        }),
        id: courseId,
        type: 'booking'
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  // GET DETAILS
  requestSubscriptionCourseAppointmentDetailListener = async (event) => {
    if (this.abortControllerSubscriptionCourseAppointmentDetail) this.abortControllerSubscriptionCourseAppointmentDetail.abort()
    this.abortControllerSubscriptionCourseAppointmentDetail = new AbortController()
    const tags = JSON.parse(event.detail.tags)
    const data = {
      courseAppointmentDate: tags[0].courseAppointmentDate,
      courseAppointmentTimeFrom: tags[0].courseAppointmentTimeFrom,
      courseId: tags[0].courseId,
      courseType: tags[0].courseType,
      subscriptionId: tags[1].subscriptionId,
      subscriptionType: tags[1].subscriptionType,
      userId: this.dataset.userId || ''
    }
    const type = tags[2] ? tags[2].type : ''
    const courseId = makeUniqueCourseId(tags[0])
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      signal: this.abortControllerSubscriptionCourseAppointmentDetail.signal
    }
    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('customer-portal').apiSubscriptionCourseAppointmentDetail}`
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

  // CANCEL - REVERSAL
  requestSubscriptionCourseAppointmentReversalListener = async (event) => {
    if (this.abortControllerSubscriptionCourseAppointmentReversalListener) this.abortControllerSubscriptionCourseAppointmentReversalListener.abort()
    this.abortControllerSubscriptionCourseAppointmentReversalListener = new AbortController()
    const tags = JSON.parse(event.detail.tags)
    const data = {
      courseAppointmentDate: tags[0].courseAppointmentDate,
      courseAppointmentTimeFrom: tags[0].courseAppointmentTimeFrom,
      courseId: tags[0].courseId,
      courseType: tags[0].courseType,
      subscriptionId: tags[1].subscriptionId,
      subscriptionType: tags[1].subscriptionType,
      userId: this.dataset.userId || ''
    }
    const courseId = makeUniqueCourseId(tags[0])
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      signal: this.abortControllerSubscriptionCourseAppointmentReversalListener.signal
    }
    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('customer-portal').apiSubscriptionCourseAppointmentReversal}`
    this.dispatchEvent(new CustomEvent(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', {
      detail: {
        fetch: fetch(endpoint, fetchOptions).then(async response => {
          if (response.status >= 200 && response.status <= 299) return await response.json()
        }),
        id: courseId,
        type: 'cancel'
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }
}
