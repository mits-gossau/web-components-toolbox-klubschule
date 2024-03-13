// @ts-check
import { Shadow } from '../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

/* global CustomEvent */

/**
 * Booked List
 *
 * @export
 * @class BookedList
 * @type {CustomElementConstructor}
 */
export default class BookedList extends Shadow() {
  /**
   * @param {any} args
   */
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    document.body.addEventListener(this.getAttribute('update-booked-subscription-course-appointments') || 'update-booked-subscription-course-appointments', this.updateBookedSubscriptionCourseAppointmentsListener)
    this.hidden = true
    const showPromises = []
    if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
    Promise.all(showPromises).then(() => {
      this.hidden = false
      this.dispatchEvent(new CustomEvent('request-booked-subscription-course-appointments',
        {
          detail: {
            subscriptionType: '',
            userId: ''
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }
      ))
    })
  }

  disconnectedCallback () {
    document.body.removeEventListener(this.getAttribute('update-booked-subscription-course-appointments') || 'update-booked-subscription-course-appointments', this.updateBookedSubscriptionCourseAppointmentsListener)
  }

  updateBookedSubscriptionCourseAppointmentsListener = async (/** @type {{ detail: { fetch: Promise<any>; }; }} */ event) => {
    console.log('bookedSubscriptionCourseAppointmentsListener', event)
    event.detail.fetch.then((/** @type {any} */ appointments) => {
      console.log(appointments)
      this.html = ''
      this.renderHTML(appointments)
    }).catch((/** @type {any} */ error) => {
      console.error(error)
      this.html = ''
      this.html = '<span style="color:red;">🤦‍♂️ Uh oh! The fetch failed! 🤦‍♂️</span>'
    })
  }

  shouldRenderHTML () {
    return !this.appointmentWrapper
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * renders the html
   * @return void
   * @param {{ selectedSubscription: { dayList: any; }; }} appointmentsData
   */
  renderHTML (appointmentsData) {
    console.log('appointmentsData', appointmentsData)
    this.appointmentWrapper = this.root.querySelector('div') || document.createElement('div')
    this.html = /* html */`
        <h1>Gebuchte Termine</h1>
      `
  }

  /**
   * renders the css
   *
   * @return void
   */
  renderCSS () {
    this.css = /* css */`
    :host {}
    :host h1 {
      font-size:150px;
    }
    @media only screen and (max-width: _max-width_) {
      :host {}
    }
    `
  }
}
