// @ts-check

/*
id assembly: kurstyp_kursid_centerid

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

    this.abortController = null
    const endpointRequest = `${this.getAttribute('endpoint-request') || 'https://dev.klubschule.ch/Umbraco/api/watchlistAPI/Get'}`

    this.requestWishListListener = event => {
      if (this.abortController) this.abortController.abort()
      this.abortController = new AbortController()
      this.dispatchEvent(new CustomEvent('wish-list', {
        detail: {
          fetch: fetch(endpointRequest, {
            method: 'GET',
            signal: this.abortController.signal
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

    const endpointAdd = `${this.getAttribute('endpoint-request') || 'https://dev.klubschule.ch/Umbraco/api/watchlistAPI/Add?language=de&courseType=D&courseId=90478&centerId=2667'}`
    this.addToWishListListener = event => {
      if (this.abortController) this.abortController.abort()
      this.abortController = new AbortController()
      this.dispatchEvent(new CustomEvent('wish-list', {
        detail: {
          fetch: fetch(endpointAdd, {
            method: 'GET',
            signal: this.abortController.signal
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
  }

  connectedCallback () {
    this.addEventListener('request-wish-list', this.requestWishListListener)
    // note from patrick, initial guid for wishlist gets with the fist add call returned
    // after having guid in local storage request can be fired
    //this.requestWishListListener()
    this.addToWishListListener()
  }
  
  disconnectedCallback () {
    this.removeEventListener('request-wish-list', this.requestWishListListener)
  }
}
