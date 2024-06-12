// @ts-check

/** @typedef {{
  term: string,
  text: string,
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
    const apiUrl = `${this.getAttribute('endpoint-auto-complete') || 'https://dev.klubschule.ch/Umbraco/Api/Autocomplete/search'}`
    const apiUrlObj = new URL(apiUrl, apiUrl.charAt(0) === '/' ? location.origin : apiUrl.charAt(0) === '.' ? this.importMetaUrl : undefined)

    this.requestAutoCompleteListener = event => {
      // reset home page input search
      if (event.detail.key === 'home-page-input-search' && event.detail.value === '') {
        return this.clearAutocomplete()
      }
      const token = event.detail.value

      if (!token || token.length < 3) {
        this.clearAutocomplete()
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
      apiUrlObj.searchParams.set('token', token)
      this.dispatchEvent(new CustomEvent('auto-complete', {
        detail: {
          /** @type {Promise<fetchAutoCompleteEventDetail>} */
          fetch: fetch(apiUrlObj.toString(), {
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
      // trigger search when enter or icon click
      if (event.detail.type === 'enter' || event.detail.type === 'search-click') this.clickOnPredictionListener({ detail: { description: event.detail.value } })
    }

    this.requestWithFacet = event => {
      if (event.detail.type === 'enter' || event.detail.type === 'search-click') {
        return this.clickOnPredictionListener({ detail: { description: event.detail.value } })
      }
    }

    this.clickOnPredictionListener = event => {
      // home search input
      if (!this.hasAttribute('no-forwarding')) this.homeSearchInput(event.detail.description)
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
    // disabled dispatches (forwards) the input submit event to with facet controller
    this.addEventListener('request-auto-complete', this.hasAttribute('disabled') ? this.requestWithFacet : this.requestAutoCompleteListener)
    this.addEventListener('auto-complete-selection', this.clickOnPredictionListener)
  }

  disconnectedCallback () {
    // disabled dispatches (forwards) the input submit event to with facet controller
    this.removeEventListener('request-auto-complete', this.hasAttribute('disabled') ? this.requestWithFacet : this.requestAutoCompleteListener)
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

  clearAutocomplete () {
    this.dispatchEvent(new CustomEvent('auto-complete', {
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
              text: 'englisch',
              typ: 1
            },
            {
              term: 'englisch   privatunterricht  wann und wo sie wolle',
              text: 'englisch   privatunterricht  wann und wo sie wolle',
              typ: 1
            },
            {
              term: 'englisch a1 ganz entspannt',
              text: 'englisch a1 ganz entspannt',
              typ: 1
            },
            {
              term: 'englisch anfanger innen',
              text: 'englisch anfanger innen',
              typ: 1
            },
            {
              term: 'englisch anfanger innen   onlinekurs',
              text: 'englisch anfanger innen   onlinekurs',
              typ: 1
            },
            {
              term: 'Englisch Business',
              text: 'Englisch Business',
              typ: 2
            },
            {
              term: 'Englisch Diplome',
              text: 'Englisch Diplome',
              typ: 2
            },
            {
              term: 'Englisch Konversation',
              text: 'Englisch Konversation',
              typ: 2
            },
            {
              term: 'Englisch Konversation B1',
              text: 'Englisch Konversation B1',
              typ: 2
            },
            {
              term: 'Englisch Konversation B2',
              text: 'Englisch Konversation B2',
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
