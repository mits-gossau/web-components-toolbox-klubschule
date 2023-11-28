// @ts-check
/* global fetch */
/* global AbortController */
/* global location */
/* global sessionStorage */
/* global CustomEvent */
/* global history */
/* global self */

import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * CourseSearch are retrieved via the corresponding endpoint as set as an attribute
 * As a controller, this component communicates exclusively through events
 * Example: web-components-toolbox-klubschule
 *
 * @export
 * @class CourseSearch
 * @type {CustomElementConstructor}
 */
export default class CourseSearch extends Shadow() {
  constructor (options = {}, ...args) {
    super({
      importMetaUrl: import.meta.url,
      mode: 'false',
      ...options
    }, ...args)
    // this.origTitle = document.title //TODO: Change title on history.pushState
    this.abortController = null

    this.requestListCourseSearchListener = event => {
      if (this.abortController) this.abortController.abort()
      this.abortController = new AbortController()
      // const pushHistory = event && event.detail && event.detail.pushHistory // TODO: read and push history as state

      this.dispatchEvent(new CustomEvent(this.getAttribute('course-search') || 'course-search', {
        detail: {
          fetch: fetch(this.getAttribute('endpoint'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            signal: this.abortController.signal,
            body: JSON.stringify({
              portalId: 2,
              mandantId: 110,
              sorting: 1,
              region: [],
              ort: [],
              searchText: event.detail.value,
              pnext: 0,
              psize: 24,
              searchsparte1: null,
              days: [],
              times: [],
              category: [],
              startdate: []
            })
          }).then(response => {
            if (response.status >= 200 && response.status <= 299) return response.json()
            throw new Error(response.statusText)
          })
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }))
    }
    // TODO: Write the following two listeners
    // inform about the url which would result on this filter
    /*
    this.requestHrefEventListener = event => {
      if (event.detail && event.detail.resolve) event.detail.resolve(this.setTag(event.detail.tags.join(';'), event.detail.pushHistory).href)
    }
    this.updatePopState = event => {
      if (!event.detail) event.detail = { ...event.state }
      event.detail.pushHistory = false
      this.requestListCourseSearchListener(event)
    }
    */
  }

  connectedCallback () {
    this.addEventListener(this.getAttribute('request-course-search') || 'request-course-search', this.requestListCourseSearchListener)
    // this.addEventListener('request-href-' + (this.getAttribute('request-course-search') || 'request-course-search'), this.requestHrefEventListener)
    // if (!this.hasAttribute('no-popstate')) self.addEventListener('popstate', this.updatePopState)
  }

  disconnectedCallback () {
    this.removeEventListener(this.getAttribute('request-course-search') || 'request-course-search', this.requestListCourseSearchListener)
    // this.removeEventListener('request-href-' + (this.getAttribute('request-course-search') || 'request-course-search'), this.requestHrefEventListener)
    // if (!this.hasAttribute('no-popstate')) self.removeEventListener('popstate', this.updatePopState)
  }

  /**
   * Set tag and page in window.history
   * @param {string} tag
   * @param {boolean} [pushHistory = true]
   * @return {URL}
   */
  // TODO: read and push history as state
  /*
  setTag (tag, pushHistory = true) {
    const url = new URL(location.href, location.href.charAt(0) === '/' ? location.origin : location.href.charAt(0) === '.' ? this.importMetaUrl : undefined)
    url.searchParams.set('tag', tag)
    url.searchParams.set('page', '1')
    if (pushHistory) history.pushState({ ...history.state, tag, page: '1' }, document.title, url.href)
    return url
  }
  */

  /**
   * @param {CustomEvent} event
   * @param {false | string} [addToTitle = false]
   */
  // TODO: Change title on history.pushState
  /*
  setTitle (event, addToTitle = false) {
    let textContent
    if (event && event.detail && event.detail.textContent && (textContent = event.detail.textContent.trim())) {
      if (addToTitle) {
        document.title = document.title.replace(new RegExp(`(.*)${addToTitle.replace(/\s/g, '\\s').replace(/\|/g, '\\|')}.*`), '$1')
        document.title += addToTitle + textContent
      } else if (document.title.includes('|')) {
        document.title = document.title.replace(/[^|]*(.*)/, textContent + ' $1')
      } else {
        document.title = textContent
      }
    }
  }
  */
}
