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
  }

  connectedCallback () {
    this.addEventListener(this.getAttribute('request-subscription-course-appointments') || 'request-subscription-course-appointments', this.requestSubscriptionCourseAppointmentsListener)
    this.addEventListener(this.getAttribute('request-subscription-course-appointment-detail') || 'request-subscription-course-appointment-detail', this.requestSubscriptionCourseAppointmentDetailListener)
    this.addEventListener(this.getAttribute('request-subscription-course-appointment-booking') || 'request-subscription-course-appointment-booking', this.requestSubscriptionCourseAppointmentBookingListener)
  }

  disconnectedCallback () {
    this.removeEventListener(this.getAttribute('request-subscription-course-appointments') || 'request-subscription-course-appointments', this.requestSubscriptionCourseAppointmentsListener)
    this.removeEventListener(this.getAttribute('request-subscription-course-appointment-detail') || 'request-subscription-course-appointment-detail', this.requestSubscriptionCourseAppointmentDetailListener)
    this.removeEventListener(this.getAttribute('request-subscription-course-appointment-booking') || 'request-subscription-course-appointment-booking', this.requestSubscriptionCourseAppointmentBookingListener)
  }

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

  requestSubscriptionCourseAppointmentBookingListener = async (event) => {
    console.log('Controller - requestSubscriptionCourseAppointmentBookingListener', JSON.parse(event.detail.tags))

    if (this.abortControllerSubscriptionCourseAppointmentBooking) this.abortControllerSubscriptionCourseAppointmentBooking.abort()
    this.abortControllerSubscriptionCourseAppointmentBooking = new AbortController()
    const tag = JSON.parse(event.detail.tags)
    const data = {
      courseAppointmentDate: tag.courseAppointmentDate,
      courseAppointmentTimeFrom: tag.courseAppointmentTimeFrom,
      courseId: tag.courseId,
      courseType: tag.courseType,
      subscriptionId: tag.subscriptionId,
      subscriptionType: tag.subscriptionType,
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
        })
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

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
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      signal: this.abortControllerSubscriptionCourseAppointmentDetail.signal
    }
    const endpoint = 'https://qual.klubschule.ch/api/customerportal/subscriptioncourseappointmentdetail'
    this.dispatchEvent(new CustomEvent(this.getAttribute('update-subscription-course-appointment-booking') || 'update-subscription-course-appointment-booking', {
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
}
