// @ts-check

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
    console.log('Controller - requestSubscriptionCourseAppointmentsListener', event)
    if (this.abortControllerSubscriptionCourseAppointments) this.abortControllerSubscriptionCourseAppointments.abort()
    this.abortControllerSubscriptionCourseAppointments = new AbortController()

    // when use dropdown send this data
    /*
      subscriptionId
      subscriptionType
      userId
     */
    const userId = '50505A02-2AA4-47AA-9AED-0B759902A0C2'
    const eventData = event.detail
    const data = {
      userId,
      subscriptionType: eventData.subscriptionType || '',
      subscriptionId: eventData.subscriptionId || ''
    }

    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      signal: this.abortControllerSubscriptionCourseAppointments.signal
    }
    const endpoint = 'https://qual.klubschule.ch/api/customerportal/subscriptioncourseappointments'
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
    console.log('Controller - requestSubscriptionCourseAppointmentBookingListener', event)

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
      userId: '50505A02-2AA4-47AA-9AED-0B759902A0C2'
    }
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      signal: this.abortControllerSubscriptionCourseAppointmentBooking.signal
    }
    const endpoint = 'https://qual.klubschule.ch/api/customerportal/subscriptioncourseappointmentbooking'
    this.dispatchEvent(new CustomEvent(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', {
      detail: {
        fetch: fetch(endpoint, fetchOptions).then(async response => {
          if (response.status >= 200 && response.status <= 299) return await response.json()
        }),
        id: data.courseId,
        type: 'booking'
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  // GET DETAILS
  requestSubscriptionCourseAppointmentDetailListener = async (event) => {
    console.log('!!!!requestSubscriptionCourseAppointmentDetailListener', event)
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
      userId: '50505A02-2AA4-47AA-9AED-0B759902A0C2'
    }
    const type = tags[2] ? tags[2].type : ''
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      signal: this.abortControllerSubscriptionCourseAppointmentDetail.signal
    }
    const endpoint = 'https://qual.klubschule.ch/api/customerportal/subscriptioncourseappointmentdetail'
    this.dispatchEvent(new CustomEvent(this.getAttribute('update-subscription-course-appointment-detail') || 'update-subscription-course-appointment-detail', {
      detail: {
        fetch: fetch(endpoint, fetchOptions).then(async response => {
          if (response.status >= 200 && response.status <= 299) return await response.json()
        }),
        id: data.courseId,
        type
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  // CANCEL - REVERSAL
  requestSubscriptionCourseAppointmentReversalListener = async (event) => {
    console.log('!!!!requestSubscriptionCourseAppointmentReversalListener', event)
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
      userId: '50505A02-2AA4-47AA-9AED-0B759902A0C2'
    }
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      signal: this.abortControllerSubscriptionCourseAppointmentReversalListener.signal
    }
    const endpoint = 'https://qual.klubschule.ch/api/customerportal/subscriptioncourseappointmentreversal'
    this.dispatchEvent(new CustomEvent(this.getAttribute('update-subscription-course-appointment-reversal') || 'update-subscription-course-appointment-reversal', {
      detail: {
        fetch: fetch(endpoint, fetchOptions).then(async response => {
          if (response.status >= 200 && response.status <= 299) return await response.json()
        }),
        id: data.courseId,
        type: 'cancel'
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }
}
