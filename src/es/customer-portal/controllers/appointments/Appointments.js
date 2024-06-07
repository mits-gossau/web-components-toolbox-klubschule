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
    this.lastFilters = null
    this.currentDialogFilterOpen = null
  }

  connectedCallback () {
    this.addEventListener('request-subscription-course-appointments', this.requestSubscriptionCourseAppointmentsListener)
    this.addEventListener('request-subscription-course-appointment-detail', this.requestSubscriptionCourseAppointmentDetailListener)
    this.addEventListener('request-subscription-course-appointment-reversal', this.requestSubscriptionCourseAppointmentReversalListener)
    this.addEventListener('request-subscription-course-appointment-booking', this.requestSubscriptionCourseAppointmentBookingListener)
    this.addEventListener('request-booked-subscription-course-appointments', this.requestBookedSubscriptionCourseAppointmentsListener)
    this.addEventListener('request-appointments-filter', this.requestAppointmentsFilterListener)
    this.addEventListener('reset-appointments-filter', this.resetFilterDayListener)
  }

  disconnectedCallback () {
    this.removeEventListener('request-subscription-course-appointments', this.requestSubscriptionCourseAppointmentsListener)
    this.removeEventListener('request-subscription-course-appointment-detail', this.requestSubscriptionCourseAppointmentDetailListener)
    this.removeEventListener('request-subscription-course-appointment-reversal', this.requestSubscriptionCourseAppointmentReversalListener)
    this.removeEventListener('request-subscription-course-appointment-booking', this.requestSubscriptionCourseAppointmentBookingListener)
    this.removeEventListener('request-booked-subscription-course-appointments', this.requestBookedSubscriptionCourseAppointmentsListener)
    this.removeEventListener('request-appointments-filter', this.requestAppointmentsFilterListener)
    this.removeEventListener('reset-appointments-filter', this.resetFilterDayListener)
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

  /**
   * Filter Appointments
   * @param {CustomEventInit} event
   * @param {Boolean} force
   */
  requestAppointmentsFilterListener = (event, force = false, updateOpenDialog = true) => {
    // mdx prevent double event
    if ((!force && event.detail?.mutationList && event.detail.mutationList[0].attributeName !== 'checked') || !this.subscriptionCourseAppointments) {
      return
    }

    const subscriptionCourseAppointmentsFiltered = this.subscriptionCourseAppointments.then(async (appointments) => {
      // use a clone to prevent fetched object manipulation
      const appointmentsClone = structuredClone(appointments)

      // use last set filters
      if (this.lastFilters) {
        appointmentsClone.filters = this.lastFilters
      }

      // sync checked filters
      if (event?.detail?.target) {
        // get type of used filter (day, time, location)
        const type = event.detail.target.getAttribute('type')
        debugger
        if (updateOpenDialog) {
          this.currentDialogFilterOpen = type
        }

        // get day filter checkboxes
        if (type === 'day') {
          const newDayCode = appointmentsClone.filters.dayCodes.find(dayCode => dayCode.dayCode === Number(event.detail.target.value))
          // sync checkbox selection
          if (newDayCode) newDayCode.selected = event.detail.target.checked
        }

        // get location filter checkboxes
        if (type === 'location') {
          const newLocationCode = appointmentsClone.filters.locations.find(location => location.locationId === Number(event.detail.target.value))
          // sync checkbox selection
          if (newLocationCode) newLocationCode.selected = event.detail.target.checked
        }

        // get time filter checkboxes
        if (type === 'time') {
          const newTimeCode = appointmentsClone.filters.timeCodes.find(timeCode => timeCode.timeCode === Number(event.detail.target.value))
          // sync checkbox selection
          if (newTimeCode) newTimeCode.selected = event.detail.target.checked
        }

        // keep selected filters for next request
        this.lastFilters = structuredClone(appointmentsClone.filters)
      }

      // filter by day
      if (appointmentsClone.filters.dayCodes.some(dayCode => dayCode.selected)) {
        appointmentsClone.selectedSubscription.dayList = appointmentsClone.selectedSubscription.dayList.map(day => {
          if (day) {
            day.subscriptionCourseAppointments = day.subscriptionCourseAppointments.filter(appointment => {
              return !!appointmentsClone.filters.dayCodes.find(dayCode => (appointment.courseAppointmentDayCode === dayCode.dayCode && dayCode.selected))
            })
          }
          return day.subscriptionCourseAppointments.length ? day : null
        })
      }

      // filter by time
      if (appointmentsClone.filters.timeCodes.some(timeCode => timeCode.selected)) {
        appointmentsClone.selectedSubscription.dayList = appointmentsClone.selectedSubscription.dayList.map(time => {
          if (time) {
            time.subscriptionCourseAppointments = time.subscriptionCourseAppointments.filter(appointment => {
              return !!appointmentsClone.filters.timeCodes.find(timeCode => {
                return appointment.courseAppointmentTimeCode.includes(timeCode.timeCode) && timeCode.selected
              })
            })
          }
          return time?.subscriptionCourseAppointments.length ? time : null
        })
      }

      // filter by location
      if (appointmentsClone.filters.locations.some(centerLocation => centerLocation.selected)) {
        appointmentsClone.selectedSubscription.dayList = appointmentsClone.selectedSubscription.dayList.map(center => {
          if (center) {
            center.subscriptionCourseAppointments = center.subscriptionCourseAppointments.filter(appointment => {
              return !!appointmentsClone.filters.locations.find(centerLocation => (appointment.centerId === centerLocation.locationId && centerLocation.selected))
            })
          }
          return center?.subscriptionCourseAppointments.length ? center : null
        })
      }

      subscriptionCourseAppointmentsFiltered.currentDialogFilterOpen = this.currentDialogFilterOpen
      // filter out empty values
      appointmentsClone.selectedSubscription.dayList = appointmentsClone.selectedSubscription.dayList.filter(list => list)
      return appointmentsClone
    })

    this.dispatchEvent(new CustomEvent(this.getAttribute('update-subscription-course-appointments') || 'update-subscription-course-appointments', {
      detail: {
        fetch: subscriptionCourseAppointmentsFiltered
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  /**
   * Reset Appointment filter
   * @param {CustomEventInit} event
   */
  resetFilterDayListener = event => {
    const type = event.detail.tags[0]
    this.lastFilters[type].forEach(filter => (filter.selected = false))
    this.currentDialogFilterOpen = null
    this.requestAppointmentsFilterListener(event, true, false)
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

  /**
   * Get Booked Appointments
   * @param {CustomEventInit} event
   */
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
   * Returns an object with request method, http headers, body, and signal properties for making a POST request with fetch.
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
