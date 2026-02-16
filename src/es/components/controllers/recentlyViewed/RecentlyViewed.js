// @ts-check

/* global fetch */
/* global CustomEvent */

/**
 * RecentlyViewed manages two separate lists:
 * - Client-based (localStorage 'recently-viewed-offers') for non-logged-in users
 * - Account-based (API /LastCourseViewApi) for logged-in users
 *
 * These two lists are never merged or migrated.
 * Pattern follows src/es/components/controllers/wishList/WishList.js
 * As a controller, this component communicates exclusively through events
 *
 * @export
 * @class RecentlyViewed
 * @type {CustomElementConstructor}
 */
export default class RecentlyViewed extends HTMLElement {
  constructor () {
    super()

    const endpoint = this.getAttribute('endpoint') || 'https://dev.klubschule.ch/Umbraco/api/LastCourseViewApi'
    const successCode = 0

    /** @type {boolean} */
    this._isLoggedIn = false
    /** @type {Array} */
    this._serverItems = []

    this.msrcUserListener = async event => {
      const user = event.detail?.user ? await event.detail.user : null
      const wasLoggedIn = this._isLoggedIn
      this._isLoggedIn = !!user
      if (this._isLoggedIn && !wasLoggedIn) {
        this.fetchServerList()
      } else if (!this._isLoggedIn && wasLoggedIn) {
        this._serverItems = []
        this.dispatchRenderList()
      }
    }

    this.fetchServerList = () => {
      fetch(`${endpoint}/Check`, {
        method: 'GET'
      }).then(response => {
        if (response.status >= 200 && response.status <= 299) return response.json()
        throw new Error(response.statusText)
      }).then(json => {
        if (json.code !== successCode) return
        this._serverItems = (json.lastCourseViews || []).map(item => ({
          title: item.kursBezeichnung || '',
          url: item.link || '',
          itemId: `${item.kursTyp}_${item.kursId}_${item.centerId}--${item.kursTyp}_${item.kursId}`,
          locationName: item.centerName || item.durchfuehrungsort || '',
          badge: item.badge || '',
          price: 0,
          spartename: [],
          currency: 'CHF'
        }))
        this.dispatchRenderList()
      }).catch(error => {
        console.error('RecentlyViewed: Failed to fetch server list', error)
      })
    }

    this.clearBackendListener = () => {
      if (this._isLoggedIn) {
        this._serverItems = []
        fetch(`${endpoint}/Clear`, {
          method: 'GET'
        }).then(response => {
          if (response.status >= 200 && response.status <= 299) return response.json()
          throw new Error(response.statusText)
        }).catch(error => {
          console.error('RecentlyViewed: Failed to clear backend list', error)
        })
      }
    }

    this.requestRecentlyViewedStorageListener = event => {
      if (event.detail?.resolve) {
        event.detail.resolve(this._isLoggedIn ? this._serverItems : null)
      }
    }
  }

  connectedCallback () {
    document.body.addEventListener('msrc-user', this.msrcUserListener)
    this.addEventListener('recently-viewed-clear', this.clearBackendListener)
    document.body.addEventListener('request-recently-viewed-storage', this.requestRecentlyViewedStorageListener)
  }

  disconnectedCallback () {
    document.body.removeEventListener('msrc-user', this.msrcUserListener)
    this.removeEventListener('recently-viewed-clear', this.clearBackendListener)
    document.body.removeEventListener('request-recently-viewed-storage', this.requestRecentlyViewedStorageListener)
  }

  dispatchRenderList () {
    document.body.dispatchEvent(new CustomEvent('recently-viewed-render-list', {
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }
}
