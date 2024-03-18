// @ts-check
import Index from './Index.js'

/* global Environment */

/**
 * Appointment List
 *
 * @export
 * @class AppointmentList
 * @type {CustomElementConstructor}
 */
export default class AppointmentList extends Index {
  /**
   * @param {any} args
   */
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderHTML()) this.renderHTML()
    if (this.shouldRenderCSS()) this.renderCSS()
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML () {
    return !this.listWrapper
  }

  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * renders the html
   * @return void
   */
  async renderHTML () {
    this.listWrapper = this.root.querySelector('div') || document.createElement('div')
    const fetchModules = this.fetchModules([
      {
        path: `${this.importMetaUrl}../components/molecules/appointmentsList/AppointmentsList.js${Environment?.version || ''}`,
        name: 'm-appointments-list'
      }
    ])
    await Promise.all([fetchModules])
    this.html = /* html */ `
        <m-appointments-list namespace="appointments-list-default-"></m-appointments-list>
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
    @media only screen and (max-width: _max-width_) {
      :host {}
    }
    `
  }

  display_properties (obj) {
    let result = ''

    // Loop through each property in the object
    for (const key in obj) {
      // Check if the value is an object
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] === 'object') {
          result += this.display_nested_objects(obj[key])
        } else {
          // If the value is a primitive type, display it directly
          result += '<p><strong>' + key + ':</strong> ' + obj[key] + '</p>'
        }
      }
    }
    result += '<hr>'
    return result
  }

  display_nested_objects (nestedObj) {
    let result = ''

    // Loop through each property in the nested object
    for (const key in nestedObj) {
      // Check if the value is an array
      if (Array.isArray(nestedObj[key])) {
        result += '<ul>'
        for (let i = 0; i < nestedObj[key].length; i++) {
          // Course data (Appointment) per day
          result += '<li>' + this.display_properties(nestedObj[key][i]) + '</li>'
        }
        result += '</ul>'
      } else {
        // If the value is an object, stringify it before adding to the result
        if (typeof nestedObj[key] === 'object') {
          result += '<ul>' + this.display_properties(nestedObj[key]) + '</ul>'
        } else {
          result += '<p><strong>' + key + ':</strong> ' + nestedObj[key] + '</p>'
        }
      }
    }

    return result
  }
}
