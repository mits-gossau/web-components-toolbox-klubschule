// @ts-check

/** @typedef {{
  term: string,
  typ: 1|2 // TYP 1 ist Kurs, TYP 2 ist Sparte
  placeId?: string,
}} Item */

/** @typedef {{
  total: number,
  success: boolean,
  searchText: string,
  items: Item[],
  cms: []
}} fetchAutoCompleteEventDetail */

/* global fetch */
/* global AbortController */
/* global CustomEvent */

import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * AutoComplete are retrieved via the corresponding endpoint as set as an attribute
 * As a controller, this component communicates exclusively through events
 * Example: web-components-toolbox-klubschule
 *
 * @export
 * @class AutoComplete
 * @type {CustomElementConstructor}
 */
export default class AutoComplete extends Shadow() {
  constructor (options = {}, ...args) {
    super({
      importMetaUrl: import.meta.url,
      mode: 'false',
      ...options
    }, ...args)

    this.abortController = null

    this.requestAutoCompleteListener = event => {
      // reset home page input search
      if (event.detail.key === 'home-page-input-search' && event.detail.value === '') {
        return this.dispatchEvent(new CustomEvent('auto-complete', {
          detail: {
            fetch: Promise.resolve({
              total: 0,
              success: true,
              searchText: '',
              items: [],
              contentItems: []
            })
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }))
      }
      const token = event.detail.value
      if (!token || token.length < 3) {
        // update results
        return this.dispatchEvent(new CustomEvent('request-with-facet',
          {
            detail: {
              key: 'input-search',
              value: ''
            },
            bubbles: true,
            cancelable: true,
            composed: true
          })
        )
      }
      if (this.hasAttribute('mock')) return this.dispatchMock()
      if (this.abortController) this.abortController.abort()
      this.abortController = new AbortController()
      this.dispatchEvent(new CustomEvent('auto-complete', {
        detail: {
          /** @type {Promise<fetchAutoCompleteEventDetail>} */
          fetch: fetch(`${this.getAttribute('endpoint') || 'https://dev.klubschule.ch/Umbraco/Api/Autocomplete/search'}?token=${token}`, {
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
    this.clickOnPredictionListener = event => {
      // home search input
      this.homeSearchInput(event.detail.description)
      // close dialog
      this.dispatchEvent(new CustomEvent('close-search-dialog', {
        bubbles: true,
        cancelable: true,
        composed: true
      }))
      // update results
      this.dispatchEvent(new CustomEvent('request-with-facet',
        {
          detail: {
            key: 'input-search',
            value: event.detail.description
          },
          bubbles: true,
          cancelable: true,
          composed: true
        })
      )
    }
  }

  connectedCallback () {
    this.addEventListener('request-auto-complete', this.requestAutoCompleteListener)
    this.addEventListener('auto-complete-selection', this.clickOnPredictionListener)
  }

  disconnectedCallback () {
    this.removeEventListener('request-auto-complete', this.requestAutoCompleteListener)
    this.removeEventListener('auto-complete-selection', this.clickOnPredictionListener)
  }

  homeSearchInput (searchText) {
    const searchUrl = this.getAttribute('search-url')
    // redirect to search page
    if (searchText !== '') {
      // create url object to check if searchUrl has query params
      const url = new URL(searchUrl)
      let searchParam = '?q='
      if (url.searchParams.toString()) {
        searchParam = '&q='
      }
      const searchUrlWithParam = searchUrl + searchParam + searchText
      if (searchUrl) {
        window.location.href = searchUrlWithParam
      }
    }
  }

  dispatchMock () {
    return this.dispatchEvent(new CustomEvent('auto-complete', {
      detail: {
        /** @type {Promise<fetchAutoCompleteEventDetail>} */
        fetch: Promise.resolve({
          total: 10,
          success: true,
          searchText: 'englisch',
          items: [
            {
              term: 'englisch',
              typ: 1
            },
            {
              term: 'englisch   privatunterricht  wann und wo sie wolle',
              typ: 1
            },
            {
              term: 'englisch a1 ganz entspannt',
              typ: 1
            },
            {
              term: 'englisch anfanger innen',
              typ: 1
            },
            {
              term: 'englisch anfanger innen   onlinekurs',
              typ: 1
            },
            {
              term: 'Englisch Business',
              typ: 2
            },
            {
              term: 'Englisch Diplome',
              typ: 2
            },
            {
              term: 'Englisch Konversation',
              typ: 2
            },
            {
              term: 'Englisch Konversation B1',
              typ: 2
            },
            {
              term: 'Englisch Konversation B2',
              typ: 2
            }
          ],
          cms: []
        })
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }
}
