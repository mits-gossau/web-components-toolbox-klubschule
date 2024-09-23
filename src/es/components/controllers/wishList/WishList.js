// @ts-check

/* global fetch */
/* global self */
/* global CustomEvent */

/**
 * WishList are retrieved via the corresponding endpoint as set as an attribute
 * As a controller, this component communicates exclusively through events
 * Definition: https://wiki.migros.net/pages/viewpage.action?pageId=731830238
 *
 * @export
 * @class WishList
 * @type {CustomElementConstructor}
 */
export default class WishList extends HTMLElement {
  constructor () {
    super()

    const endpoint = this.getAttribute('endpoint') || 'https://dev.klubschule.ch/Umbraco/api/watchlistAPI'
    const successCode = 0

    let timeout = null
    let abortController = null
    this.requestWishListListener = event => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        if (abortController) abortController.abort()
        abortController = new AbortController()
        this.dispatchEvent(new CustomEvent('wish-list', {
          detail: {
            // answer with an empty watchlistEntries array, incase we don't have a guid yet, the guid will be received with the first add action
            fetch: this.guid
              ? fetch(`${endpoint}/GetById?inclCourseDetail=false&watchlistGuid=${this.guid}`, {
                method: 'GET',
                signal: abortController.signal
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
      }, 50)
    }

    this.addToWishListListener = (event, retry = true) => {
      if (event.detail.this?.hasAttribute('course')) [event.detail.courseType, event.detail.courseId, event.detail.centerId] = event.detail.this.getAttribute('course').split('_')
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
      if (event.detail.this?.hasAttribute('course')) [event.detail.courseType, event.detail.courseId, event.detail.centerId] = event.detail.this.getAttribute('course').split('_')
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

    this.removeAllFromWishListListener = (_event, tabIndex) => {
      if (!this.guid) return
      this.dispatchEvent(new CustomEvent('wish-list', {
        detail: {
          fetch: fetch(`${endpoint}/ClearTab?tab=${tabIndex}&watchlistGuid=${this.guid}`, {
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
    this.addEventListener('remove-all-from-wish-list-1', (event) => this.removeAllFromWishListListener(event, 1))
    this.addEventListener('remove-all-from-wish-list-2', (event) => this.removeAllFromWishListListener(event, 2))
  }

  disconnectedCallback () {
    this.removeEventListener('request-wish-list', this.requestWishListListener)
    this.removeEventListener('add-to-wish-list', this.addToWishListListener)
    this.removeEventListener('remove-from-wish-list', this.removeFromWishListListener)
    this.removeEventListener('remove-all-from-wish-list-1', (event) => this.removeAllFromWishListListener(event, 1))
    this.removeEventListener('remove-all-from-wish-list-2', (event) => this.removeAllFromWishListListener(event, 2))
  }

  set guid (value) {
    localStorage.setItem('wishListGuid', value || '')
  }

  get guid () {
    return this.getAttribute('guid') || localStorage.getItem('wishListGuid') || ''
  }
}
