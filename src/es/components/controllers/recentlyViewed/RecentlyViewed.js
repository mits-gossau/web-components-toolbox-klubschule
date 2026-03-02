// @ts-check

/* global fetch */
/* global CustomEvent */

/**
 * RecentlyViewed fetches the server-based list (API /LastCourseViewApi)
 * for all users. The backend (Umbraco) handles tracking and login state.
 *
 * This component communicates exclusively through events.
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

    /** @type {Array} */
    this._serverItems = []


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
          locationName: item.durchfuehrungsort || '',
          badge: item.badge || '',
          tagManagerEventData: item.tagManagerEventData || ''
        }))
        this.guid = json.lastCourseViewGroupGuid || ''
        this.dispatchRenderList()
      }).catch(error => {
        console.error('RecentlyViewed: Failed to fetch server list', error)
      })
    }

    this.clearBackendListener = () => {
      this._serverItems = []
      fetch(`${endpoint}/Clear?lastCourseViewGroupGuid=${this.guid}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      }).then(response => {
        if (response.status >= 200 && response.status <= 299) return response.json()
        throw new Error(response.statusText)
      }).catch(error => {
        console.error('RecentlyViewed: Failed to clear backend list', error)
      })
    }

    this.requestRecentlyViewedStorageListener = event => {
      if (event.detail?.resolve) {
        event.detail.resolve(this._serverItems)
      }
    }
  }

  connectedCallback () {
    this.addEventListener('recently-viewed-clear', this.clearBackendListener)
    document.body.addEventListener('request-recently-viewed-storage', this.requestRecentlyViewedStorageListener)
    this.fetchServerList();
  }

  disconnectedCallback () {
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
