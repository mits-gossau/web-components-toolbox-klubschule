// @ts-check

/*
id assembly: courseType_courseId_centerid

GET MULTIPLE SPECIFIC COURSES:

"filter": [
  {
      "hasChilds": false,
      "label": "",
      "id": "26",
      "typ": "",
      "level": "",
      "color": "",
      "selected": false,
      "disabled": false,
      "hideCount": false,
      "children": [
          {
              "hasChilds": false,
              "label": "",
              "id": "D_101312",
              "typ": "",
              "level": "",
              "color": "",
              "selected": true,
              "disabled": false,
              "hideCount": false
          },
          {
              "hasChilds": false,
              "label": "",
              "id": "D_88449",
              "typ": "",
              "level": "",
              "color": "",
              "selected": true,
              "disabled": false,
              "hideCount": false
          }
      ]
    }
  ]
  
*/

/* global fetch */
/* global self */
/* global CustomEvent */

import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * WishList are retrieved via the corresponding endpoint as set as an attribute
 * As a controller, this component communicates exclusively through events
 * Definition: https://wiki.migros.net/pages/viewpage.action?pageId=731830238
 *
 * @export
 * @class WishList
 * @type {CustomElementConstructor}
 */
export default class WishList extends Shadow() {
  constructor (options = {}, ...args) {
    super({
      importMetaUrl: import.meta.url,
      mode: 'false',
      ...options
    }, ...args)

    const endpoint = this.getAttribute('endpoint') || 'https://dev.klubschule.ch/Umbraco/api/watchlistAPI'
    const successCode = 0

    this.abortController = null
    this.requestWishListListener = event => {
      if (this.abortController) this.abortController.abort()
      this.abortController = new AbortController()
      this.dispatchEvent(new CustomEvent('wish-list', {
        detail: {
          // answer with an empty watchlistEntries array, incase we don't have a guid yet, the guid will be received with the first add action
          fetch: this.guid
            ? fetch(`${endpoint}/GetById?inclCourseDetail=false&watchlistGuid=${this.guid}`, {
              method: 'GET',
              signal: this.abortController.signal
            }).then(response => {
              if (response.status >= 200 && response.status <= 299) return response.json()
              throw new Error(response.statusText)
            }).then(json => {
              if (json.code !== successCode) this.guid = ''
              // watchlistEntries array is always delivered. Empty when 404!
              return json
            })
            : Promise.resolve({
              watchlistEntries: []
            })
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }))
    }

    this.addToWishListListener = (event, retry = true) => {
      let hasWatchlistGuidParameter = false
      this.dispatchEvent(new CustomEvent('wish-list', {
        detail: {
          fetch: fetch(`${endpoint}/Add?inclCourseDetail=false${(hasWatchlistGuidParameter = !!this.guid) ? `&watchlistGuid=${this.guid}` : ''}&language=${event.detail.language || document.documentElement.getAttribute('lang')?.substring(0, 2) || 'de'}&courseType=${event.detail.courseType}&courseId=${event.detail.courseId}&centerId=${event.detail.centerId}`, {
            method: 'GET'
          }).then(response => {
            if (response.status >= 200 && response.status <= 299) return response.json()
            throw new Error(response.statusText)
          }).then(json => {
            if (json.code !== successCode) {
              this.guid = ''
              // retry without watchlistGuid and get a new guid on this call
              if (hasWatchlistGuidParameter && retry) this.addToWishListListener(event, false)
            } else if (json.watchlistGuid) {
              this.guid = json.watchlistGuid
            }
            return json
          })
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }))
    }

    this.removeFromWishListListener = event => {
      if (!this.guid) return
      this.dispatchEvent(new CustomEvent('wish-list', {
        detail: {
          fetch: fetch(`${endpoint}/Remove?inclCourseDetail=false&watchlistGuid=${this.guid}&language=${event.detail.language || document.documentElement.getAttribute('lang')?.substring(0, 2) || 'de'}&courseType=${event.detail.courseType}&courseId=${event.detail.courseId}&centerId=${event.detail.centerId}`, {
            method: 'GET'
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

    this.removeAllFromWishListListener = event => {
      if (!this.guid) return
      this.dispatchEvent(new CustomEvent('wish-list', {
        detail: {
          fetch: fetch(`${endpoint}/Clear?inclCourseDetail=false&watchlistGuid=${this.guid}`, {
            method: 'GET'
          }).then(response => {
            if (response.status >= 200 && response.status <= 299) return response.json()
            throw new Error(response.statusText)
          }).then(json => {
            if (json.code !== successCode) this.guid = ''
            // watchlistEntries array is always delivered. Empty when 404!
            return json
          })
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }))
    }
  }

  connectedCallback () {
    this.addEventListener('request-wish-list', this.requestWishListListener)
    this.addEventListener('add-to-wish-list', this.addToWishListListener)
    this.addEventListener('remove-from-wish-list', this.removeFromWishListListener)
    this.addEventListener('remove-all-from-wish-list', this.removeAllFromWishListListener)
  }
  
  disconnectedCallback () {
    this.removeEventListener('request-wish-list', this.requestWishListListener)
    this.removeEventListener('add-to-wish-list', this.addToWishListListener)
    this.removeEventListener('remove-from-wish-list', this.removeFromWishListListener)
    this.removeEventListener('remove-all-from-wish-list', this.removeAllFromWishListListener)
  }

  set guid (value) {
    localStorage.setItem('wishListGuid', value || '')
  }

  get guid () {
    return localStorage.getItem('wishListGuid') || ''
  }
}
