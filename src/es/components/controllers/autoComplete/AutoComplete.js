// @ts-check

/** @typedef {{
  title: string,
  text: string | null,
  term: string | null,
  typ: number,
  link: string,
  image: {
    src: string,
    alt: string
  } | null
}} ContentItem */

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
  contentItems: ContentItem[],
  items: Item[],
  sprachid: string,
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
  constructor(options = {}, ...args) {
    super({
      importMetaUrl: import.meta.url,
      mode: 'false',
      ...options
    }, ...args)

    this.resetInputValueBasedUrl = this.getAttribute('reset-input-value-based-url')
    this.abortController = null
    let apiUrl = `${this.getAttribute('endpoint-auto-complete') || 'https://dev.klubschule.ch/Umbraco/Api/Autocomplete/search'}`
    // check if attribute with-auto-complete-content exists and if so add content=true as parameter to apiUrl
    if (this.hasAttribute('with-auto-complete-content')) {
      const url = new URL(apiUrl, location.origin)
      url.searchParams.set('content', 'true')
      apiUrl = url.toString()
    }
    const apiUrlObj = new URL(apiUrl, apiUrl.charAt(0) === '/' ? location.origin : apiUrl.charAt(0) === '.' ? this.importMetaUrl : undefined)

    this.noScrollEventListener = event => {
      // if opens the dialog
      if (event.detail?.hasNoScroll) {
        // refill the search value based on current url
        const params = new URLSearchParams(self.location.search)
        const neededParamValue = params.get(`${this.resetInputValueBasedUrl}`) || ''
        const currentInput = this.root.querySelector('m-dialog').root.querySelector('a-input').root.querySelector('input')
        if (currentInput) currentInput.value = neededParamValue
      }
    }

    this.requestAutoCompleteListener = event => {
      // reset home page input search
      if (event.detail.key === 'home-page-input-search' && event.detail.value === '') {
        return this.clearAutocomplete()
      }
      const token = event.detail.value

      if (!token || token.length < 3 || token.trim() === '') {
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
      if (event.detail.type === 'enter' || event.detail.type === 'search-click') this.clickOnPredictionListener({ detail: { description: event.detail.value, type: event.detail.type } })
    }

    this.requestWithFacet = event => {
      if (event.detail.type === 'enter' || event.detail.type === 'search-click' || event.detail.type === 'key' || event.detail.type === 'delete') {
        return this.clickOnPredictionListener({ detail: { description: event.detail.value, type: event.detail.type }})
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

  connectedCallback() {
    if (this.shouldRenderCSS()) this.renderCSS()
    // disabled dispatches (forwards) the input submit event to with facet controller
    this.addEventListener('request-auto-complete', this.hasAttribute('disabled') ? this.requestWithFacet : this.requestAutoCompleteListener)
    this.addEventListener('auto-complete-selection', this.clickOnPredictionListener)
    if (this.resetInputValueBasedUrl) this.addEventListener(this.getAttribute('no-scroll') || 'no-scroll', this.noScrollEventListener)
  }

  disconnectedCallback() {
    // disabled dispatches (forwards) the input submit event to with facet controller
    this.removeEventListener('request-auto-complete', this.hasAttribute('disabled') ? this.requestWithFacet : this.requestAutoCompleteListener)
    this.removeEventListener('auto-complete-selection', this.clickOnPredictionListener)
    if (this.resetInputValueBasedUrl) this.removeEventListener(this.getAttribute('no-scroll') || 'no-scroll', this.noScrollEventListener)
  }

  shouldRenderCSS() {
    return !this.root.querySelector(
      `${this.cssSelector} > style[_css]`
    )
  }

  /**
* renders the css
*
* @return {void}
*/
  renderCSS() {
    this.css = /* css */`
      :host {
        cursor: default;
      }
      `
  }

  homeSearchInput(searchText) {
    const searchUrl = this.getAttribute('search-url')
    // redirect to search page
    if (searchUrl && searchText !== '') {
      // create url object to check if searchUrl has query params
      const url = new URL(searchUrl)
      url.searchParams.set('q', searchText)
      window.location.href = url.toString()
    }
  }

  clearAutocomplete() {
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

  dispatchMock() {
    return this.dispatchEvent(new CustomEvent('auto-complete', {
      detail: {
        /** @type {Promise<fetchAutoCompleteEventDetail>} */
        fetch: Promise.resolve({
          total: 10,
          success: true,
          searchText: 'englisch',
          "contentItems": [
            {
                "title": "Cambridge English",
                "text": null,
                "term": null,
                "typ": -1,
                "link": "/sprachen/englischkurse/englisch-pruefungsvorbereitung/cambridge-english/",
                "image": null
            },
            {
                "title": "<strong>Englisch</strong> Schwerpunkte",
                "text": "Englisch Schwerpunkte lorem ipsum dolor amet lorem ipsum dolor ame lorem ipsum dolor ame lorem ipsum dolor ame lorem ipsum dolor ame lorem ipsum dolor ame lorem ipsum dolor ame lorem ipsum dolor ame lorem ipsum dolor ame",
                "term": null,
                "typ": -1,
                "link": "/sprachen/englischkurse/englisch-schwerpunkte/",
                "image": null
            },
            {
                "title": "<strong>Englisch</strong> Konversation",
                "text": null,
                "term": null,
                "typ": -1,
                "link": "/sprachen/englischkurse/englisch-schwerpunkte/englisch-konversation/",
                "image": null
            },
            {
                "title": "<strong>Englisch</strong> Prüfungsvorbereitung",
                "text": null,
                "term": null,
                "typ": -1,
                "link": "/sprachen/englischkurse/englisch-pruefungsvorbereitung/",
                "image": null
            },
            {
                "title": "telc <strong>Englisch</strong>",
                "text": null,
                "term": null,
                "typ": -1,
                "link": "/sprachen/englischkurse/englisch-einstufungstests-und-pruefungen/telc-englisch/",
                "image": null
            },
            {
                "title": "<strong>Englisch</strong> Niveau A2",
                "text": null,
                "term": null,
                "typ": -1,
                "link": "/sprachen/englischkurse/englisch-niveau-a2/",
                "image": null
            },
            {
                "title": "<strong>Englisch</strong> Niveau B1",
                "text": null,
                "term": null,
                "typ": -1,
                "link": "/sprachen/englischkurse/englisch-niveau-b1/",
                "image": null
            },
            {
                "title": "<strong>Englisch</strong> Niveau B2",
                "text": null,
                "term": null,
                "typ": -1,
                "link": "/sprachen/englischkurse/englisch-niveau-b2/",
                "image": null
            },
            {
                "title": "<strong>Englisch</strong> Niveau C1/C2",
                "text": null,
                "term": null,
                "typ": -1,
                "link": "/sprachen/englischkurse/englisch-niveau-c1-c2/",
                "image": null
            },
            {
                "title": "<strong>Englisch</strong> Fast Track",
                "text": null,
                "term": null,
                "typ": -1,
                "link": "/sprachen/englischkurse/englisch-schwerpunkte/englisch-fast-track/",
                "image": null
            }
          ],
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
          sprachid: "d",
          cms: []
        })
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }
}
