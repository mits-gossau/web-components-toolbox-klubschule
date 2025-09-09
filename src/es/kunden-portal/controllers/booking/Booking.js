// @ts-check
/* global AbortController */
/* global CustomEvent */
/* global fetch */
/* global HTMLElement */
/* global self */

/**
 * @class Booking
 * @type {CustomElementConstructor}
 */
export default class Booking extends HTMLElement {
  constructor () {
    super()
    this.abortControllerBooking = null
    this.abortControllerFollowUp = null
    this.abortControllerDocument = null
    this.abortControllerSendMessage = null
  }

  connectedCallback () {
    document.addEventListener('request-booking', this.requestBooking)
    document.addEventListener('request-followup', this.requestFollowUp)
    document.addEventListener('request-document', this.requestDocument)
    document.addEventListener('request-send-message', this.requestSendMessage)
  }

  disconnectedCallback () {
    document.removeEventListener('request-booking', this.requestBooking)
    document.removeEventListener('request-followup', this.requestFollowUp)
    document.removeEventListener('request-document', this.requestDocument)
    document.removeEventListener('request-send-message', this.requestSendMessage)
  }

  requestBooking = (event) => {
    if (this.abortControllerBooking) this.abortControllerBooking.abort()
    this.abortControllerBooking = new AbortController()

    const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '')
    const courseId = urlParams.get('courseId') || event.detail.courseId
    const courseType = urlParams.get('courseType') || event.detail.courseType
    if (!courseId) {
      console.error('Course ID is required for booking.')
      return
    }

    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('kunden-portal').getMyBooking}`
    const data = {
      language: 'de',
      courseType,
      courseId
    }
    const options = this.fetchPOSTOptions(data, this.abortControllerBooking)

    this.dispatchEvent(new CustomEvent('update-booking', {
      detail: {
        fetch: fetch(endpoint, options)
          .then(async response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
            return await response.json()
          })
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  requestFollowUp = (event) => {
    if (this.abortControllerFollowUp) this.abortControllerFollowUp.abort()
    this.abortControllerFollowUp = new AbortController()
    if (!event.detail.courseIdFollowUp || !event.detail.courseTypeFollowUp) return

    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('kunden-portal').getFollowUp}`
    const data = {
      language: 'de',
      courseType: event.detail.courseTypeFollowUp,
      courseId: event.detail.courseIdFollowUp
    }
    const options = this.fetchPOSTOptions(data, this.abortControllerFollowUp)

    this.dispatchEvent(new CustomEvent('update-followup', {
      detail: {
        fetch: fetch(endpoint, options)
          .then(async response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
            return await response.json()
          })
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  requestDocument = (event) => {
    if (this.abortControllerDocument) this.abortControllerDocument.abort()
    this.abortControllerDocument = new AbortController()

    if (!event.detail.documentKey) return

    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('kunden-portal').getMyDocument}` || 'https://dev.klubschule.ch/umbraco/api/CpStudentAPI/getMyDocument'
    const data = {
      language: 'de',
      documentType: event.detail.documentType,
      documentKey: event.detail.documentKey,
    }
    const options = this.fetchPOSTOptions(data, this.abortControllerDocument)
     fetch(endpoint, options)
      .then(async response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        // check content type
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/pdf')) {
          return await response.blob()
        }
        // fallback json
        return await response.json()
      })
      .then(data => {
        this.dispatchEvent(new CustomEvent('update-document', {
          detail: { fetch: Promise.resolve(data) },
          bubbles: true,
          cancelable: true,
          composed: true
        }))
      })
      .catch(error => {
        this.dispatchEvent(new CustomEvent('update-document', {
          detail: { fetch: Promise.reject(error) },
          bubbles: true,
          cancelable: true,
          composed: true
        }))
      })
  }

  requestSendMessage = (event) => {
    if (this.abortControllerSendMessage) this.abortControllerSendMessage.abort()
    this.abortControllerSendMessage = new AbortController()

    if (!event.detail.courseId || !event.detail.courseType || event.detail.mailNumber === undefined) {
      console.error('CourseId, courseType and mailNumber are required for sendMessage.')
      return
    }

    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('kunden-portal').sendMessage}`
    const data = {
      language: event.detail.language || 'de',
      courseType: event.detail.courseType,
      courseId: parseInt(event.detail.courseId),
      mailNumber: event.detail.mailNumber
    }
    const options = this.fetchPOSTOptions(data, this.abortControllerSendMessage)

    this.dispatchEvent(new CustomEvent('update-send-message', {
      detail: {
        fetch: fetch(endpoint, options)
          .then(async response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
            return await response.json()
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
