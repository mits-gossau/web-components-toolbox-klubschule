// @ts-check
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
    this.abortControllerBookedSubscriptionCourseAppointments = null
    this.lastDayFilters = null
    this.lastTimeFilters = null
  }

  connectedCallback () {
    this.addEventListener('request-subscription-course-appointments', this.requestSubscriptionCourseAppointmentsListener)
    this.addEventListener('request-subscription-course-appointment-detail', this.requestSubscriptionCourseAppointmentDetailListener)
    this.addEventListener('request-subscription-course-appointment-reversal', this.requestSubscriptionCourseAppointmentReversalListener)
    this.addEventListener('request-subscription-course-appointment-booking', this.requestSubscriptionCourseAppointmentBookingListener)
    this.addEventListener('request-booked-subscription-course-appointments', this.requestBookedSubscriptionCourseAppointmentsListener)
    // day filter
    this.addEventListener('request-subscription-day-filter', this.requestSubscriptionDayFilterListener)
    this.addEventListener('reset-filter-day', this.resetFilterDayListener)
    // time filter
    this.addEventListener('request-subscription-time-filter', this.requestSubscriptionTimeFilterListener)
  }

  disconnectedCallback () {
    this.removeEventListener('request-subscription-course-appointments', this.requestSubscriptionCourseAppointmentsListener)
    this.removeEventListener('request-subscription-course-appointment-detail', this.requestSubscriptionCourseAppointmentDetailListener)
    this.removeEventListener('request-subscription-course-appointment-reversal', this.requestSubscriptionCourseAppointmentReversalListener)
    this.removeEventListener('request-subscription-course-appointment-booking', this.requestSubscriptionCourseAppointmentBookingListener)
    this.removeEventListener('request-booked-subscription-course-appointments', this.requestBookedSubscriptionCourseAppointmentsListener)
    // day filter
    this.removeEventListener('request-subscription-day-filter', this.requestSubscriptionDayFilterListener)
    this.removeEventListener('reset-filter-day', this.resetFilterDayListener)
    // time filter
    this.removeEventListener('request-subscription-time-filter', this.requestSubscriptionTimeFilterListener)
  }

  /**
   * List all Course Appointments
   * @param {CustomEventInit} event
   */
  requestSubscriptionCourseAppointmentsListener = async (event) => {
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
    this.dispatchEvent(new CustomEvent('update-subscription-course-appointments', {
      detail: {
        fetch: (this.subscriptionCourseAppointments = fetch(endpoint, fetchOptions).then(async response => {
          if (response.status >= 200 && response.status <= 299) return await response.json()
        }))
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  requestSubscriptionTimeFilterListener = (event, force = false) => {
    // mdx prevent double event
    if ((!force && event.detail?.mutationList && event.detail.mutationList[0].attributeName !== 'checked') || !this.subscriptionCourseAppointments) return
    const subscriptionCourseAppointmentsFiltered = this.subscriptionCourseAppointments.then(async (appointments) => {
      const appointmentsClone = structuredClone(appointments)
      // keep last filters
      if (this.lastTimeFilters) appointmentsClone.filters = this.lastTimeFilters

      // TODO: Find not only timeCodes but also the other two possible filters regarding the event target
      if (event?.detail?.target) {
        // find checkbox event target dayCode
        const newTimeCode = appointmentsClone.filters.timeCodes.find(timeCode => {
          return timeCode.timeCode === Number(event.detail.target.value)
        })
        // sync filter selected with checkbox checked
        if (newTimeCode) newTimeCode.selected = event.detail.target.checked
        // keep this filter for next request
        this.lastTimeFilters = structuredClone(appointmentsClone.filters)
      }
      // timeCode
      // filter all appointments (time in dayList) by all possible selected filters
      if (appointmentsClone.filters.timeCodes.some(dayCode => dayCode.selected)) {
        appointmentsClone.selectedSubscription.dayList = appointmentsClone.selectedSubscription.dayList.map(time => {
          time.subscriptionCourseAppointments = time.subscriptionCourseAppointments.filter(appointment => {
            return !!appointmentsClone.filters.timeCodes.find(timeCode => {
              return appointment.courseAppointmentTimeCode.some(time => time === timeCode.timeCode && timeCode.selected)
            })
          })
          return time.subscriptionCourseAppointments.length ? time : null
        })
      }

      // filter out empty time
      appointmentsClone.selectedSubscription.dayList = appointmentsClone.selectedSubscription.dayList.filter(time => time)
      return appointmentsClone
    })
    console.log('TIME', subscriptionCourseAppointmentsFiltered)
    this.dispatchEvent(new CustomEvent('update-subscription-course-appointments', {
      detail: {
        fetch: subscriptionCourseAppointmentsFiltered
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  /**
   * Filter Appointments by day
   * @param {CustomEventInit} event
   * @param {Boolean} force
   */
  requestSubscriptionDayFilterListener = (event, force = false) => {
    // mdx prevent double event
    if ((!force && event.detail?.mutationList && event.detail.mutationList[0].attributeName !== 'checked') || !this.subscriptionCourseAppointments) return
    const subscriptionCourseAppointmentsFiltered = this.subscriptionCourseAppointments.then(async (appointments) => {
      const appointmentsClone = structuredClone(appointments)
      // keep last filters
      if (this.lastDayFilters) appointmentsClone.filters = this.lastDayFilters

      // TODO: Find not only dayCodes but also the other two possible filters regarding the event target
      if (event?.detail?.target) {
        // find checkbox event target dayCode
        const newDayCode = appointmentsClone.filters.dayCodes.find(dayCode => dayCode.dayCode === Number(event.detail.target.value))
        // sync filter selected with checkbox checked
        if (newDayCode) newDayCode.selected = event.detail.target.checked
        // keep this filter for next request
        this.lastDayFilters = structuredClone(appointmentsClone.filters)
      }

      // dayCode
      // filter all appointments (days in dayList) by all possible selected filters
      if (appointmentsClone.filters.dayCodes.some(dayCode => dayCode.selected)) {
        appointmentsClone.selectedSubscription.dayList = appointmentsClone.selectedSubscription.dayList.map(day => {
          day.subscriptionCourseAppointments = day.subscriptionCourseAppointments.filter(appointment => {
            return !!appointmentsClone.filters.dayCodes.find(dayCode => (appointment.courseAppointmentDayCode === dayCode.dayCode && dayCode.selected))
          })
          return day.subscriptionCourseAppointments.length ? day : null
        })
      }

      // TODO: Other filters

      // filter out empty days
      appointmentsClone.selectedSubscription.dayList = appointmentsClone.selectedSubscription.dayList.filter(day => day)
      return appointmentsClone
    })
    console.log('DAY', subscriptionCourseAppointmentsFiltered)
    this.dispatchEvent(new CustomEvent('update-subscription-course-appointments', {
      detail: {
        fetch: subscriptionCourseAppointmentsFiltered
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  /**
   * Reset day filter
   * @param {CustomEventInit} event
   */
  resetFilterDayListener = event => {
    this.lastDayFilters.dayCodes.forEach(dayCode => (dayCode.selected = false))
    this.requestSubscriptionDayFilterListener(event, true)
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
        type: 'booking'
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
        type: 'reversal'
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  requestBookedSubscriptionCourseAppointmentsListener = async (event) => {
    if (this.abortControllerBookedSubscriptionCourseAppointments) this.abortControllerBookedSubscriptionCourseAppointments.abort()
    this.abortControllerBookedSubscriptionCourseAppointments = new AbortController()
    const { subscriptionType, subscriptionId } = event.detail
    const { userId } = this.dataset
    const data = {
      userId,
      subscriptionType,
      subscriptionId,
      includeConsumedAppointments: 'false'
    }

    const fetchOptions = this.fetchPOSTOptions(data, this.abortControllerBookedSubscriptionCourseAppointments)
    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('customer-portal').apiBookedSubscriptionCourseAppointments}`
    this.dispatchEvent(new CustomEvent(this.getAttribute('update-subscription-course-appointments') || 'update-subscription-course-appointments', {
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
