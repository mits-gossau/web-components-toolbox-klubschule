
/** @typedef {{
  description?: string,
  selected: string,
}} LocationSelectionItem */

/** @typedef {{
  lat: number,
  lng: number,
}} LocationCoordinates */

/** @typedef {{
  total: number,
  success: boolean,
  searchText: string,
  items: google.maps.places.AutocompletePrediction[] || LocationItem[],
  cms: []
}} fetchAutoCompleteEventDetail */

/* global fetch */
/* global CustomEvent */

import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * AutoComplete are retrieved via the corresponding endpoint as set as an attribute
 * As a controller, this component communicates exclusively through events
 * Example: web-components-toolbox-klubschule
 *
 * @export
 * @class AutoCompletePredictions
 * @type {CustomElementConstructor}
 */
export default class AutoCompleteLocation extends Shadow() {
  constructor(options = {}, ...args) {
    super({
      importMetaUrl: import.meta.url,
      mode: 'false',
      ...options
    }, ...args)
    this.RESOLVE_MSG = 'LOADED'
    this.resetInputValueBasedUrl = this.getAttribute('reset-input-value-based-url')
    this.ignoreSearchInputIconClick = this.hasAttribute('ignore-search-input-icon-click')

    this.noScrollEventListener = event => {
      // if opens the dialog
      if (event.detail?.hasNoScroll) {
        // refill the search value based on current url
        const params = new URLSearchParams(self.location.search)
        const neededParamValue = decodeURIComponent(params.get(`${this.resetInputValueBasedUrl}`) || '')
        const currentInput = this.root.querySelector('m-dialog').root.querySelector('a-input').root.querySelector('input')
        if (currentInput) currentInput.value = neededParamValue
        // clear autocompleteList UL list when dialog opens
        const currentAutocompleteListElement = this.root.querySelector('m-dialog').root.querySelector('ks-m-auto-complete-list')
        currentAutocompleteListElement.renderHTML()
      }
    }
    // disable click on location icon in input field
    if (this.ignoreSearchInputIconClick) {
      setTimeout(() => {
        const currentInputButton = this.root.querySelector('m-dialog')?.root?.querySelector('a-input')?.root?.querySelector('button')
        if (currentInputButton) currentInputButton.style.pointerEvents = 'none'
      }, 2000)
    }
  }

  async connectedCallback() {
    this.addEventListener('request-auto-complete-location', this.requestAutoCompleteListener)
    this.addEventListener('auto-complete-location-selection', this.clickOnPredictionListener)
    this.addEventListener('client-location-coords', this.clickOnLocateMe)
    if (this.resetInputValueBasedUrl) this.addEventListener(this.getAttribute('no-scroll') || 'no-scroll', this.noScrollEventListener)
    await this.loadDependency()
  }

  disconnectedCallback() {
    this.removeEventListener('request-auto-complete-location', this.requestAutoCompleteListener)
    this.removeEventListener('auto-complete-location-selection', this.clickOnPredictionListener)
    this.removeEventListener('client-location-coords', this.clickOnLocateMe)
    if (this.resetInputValueBasedUrl) this.removeEventListener(this.getAttribute('no-scroll') || 'no-scroll', this.noScrollEventListener)
  }

  loadDependency() {
    return this.loadDependencyPromise || (this.loadDependencyPromise = new Promise((resolve, reject) => {
      if (document.getElementById('google-maps-places')) resolve(this.RESOLVE_MSG)
      const googlePlaces = document.createElement('script')
      googlePlaces.setAttribute('type', 'text/javascript')
      googlePlaces.setAttribute('id', 'google-maps-places')
      googlePlaces.setAttribute('async', '')
      try {
        // @ts-ignore
        googlePlaces.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places&v=weekly`)
        document.body.appendChild(googlePlaces)
        googlePlaces.onload = () => {
          // @ts-ignore
          if ('google' in self) {
            resolve(self.google.maps)
            this.service = new google.maps.places.AutocompleteService()
            this.geocoder = new google.maps.Geocoder()
          }
        }
      } catch (e) {
        return reject(e)
      }
    }))
  }

  dispatchMock() {
    return this.dispatchEvent(new CustomEvent('auto-complete-location', {
      detail: {
        /** @type {Promise<fetchAutoCompleteEventDetail>} */
        fetch: Promise.resolve({
          total: 10,
          success: true,
          searchText: 'St.',
          items: [
            {
              term: 'St. Antönien'
            },
            {
              term: 'St. Moritz'
            },
            {
              term: 'St. Gallen'
            },
            {
              term: 'St. Heinrich'
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

  setCoordinationFilter(lat, lng, description) {
    this.dispatchEvent(new CustomEvent('close-location-dialog', {
      bubbles: true,
      cancelable: true,
      composed: true
    }))
    if (description) {
      this.dispatchEvent(new CustomEvent('request-with-facet',
        {
          detail: {
            key: 'location-search',
            lat,
            lng,
            description
          },
          bubbles: true,
          cancelable: true,
          composed: true
        })
      )
    } else {
      this.geocoder.geocode({
        location: {
          lat: parseFloat(lat),
          lng: parseFloat(lng)
        }
      }, (responses, status) => {
        this.dispatchEvent(new CustomEvent('request-with-facet',
          {
            detail: {
              key: 'location-search',
              lat,
              lng,
              description: responses[0]?.formatted_address || ''
            },
            bubbles: true,
            cancelable: true,
            composed: true
          })
        )
      })
    }
  }

  get apiKey() {
    return this.getAttribute('google-api-key') || ''
  }

  clickOnPredictionListener = event => {
    this.geocoder.geocode(
      event.detail.selected
        ? {
          placeId: event.detail.selected
        }
        : {
          address: event.detail.address
        },
      (responses, status) => {
        if (status == 'OK') {
          const lat = responses[0].geometry.location.lat()
          const lng = responses[0].geometry.location.lng()
          this.setCoordinationFilter(lat, lng, event.detail.description)
        }
      }
    )
  }

  requestAutoCompleteListener = (event) => {
    let token = event.detail.value
    if (token === undefined) return
    if (token.length < 3) {
      token = ""
      const currentAutocompleteListElement = this.root.querySelector('m-dialog').root.querySelector('ks-m-auto-complete-list')
      currentAutocompleteListElement.renderHTML()
      return
    }
    if (this.hasAttribute('mock')) return this.dispatchMock()

    if (this.service) {
      this.service.getPlacePredictions({ input: token, componentRestrictions: { country: 'ch' }, types: ['geocode'] }, async (predictions) => {
        this.predictions = predictions
        this.dispatchEvent(new CustomEvent('auto-complete-location', {
          detail: {
            fetch: Promise.resolve({
              total: this.predictions?.length || 0,
              success: true,
              searchText: token,
              items: this.predictions?.map(({ description, place_id }) => ({ term: description, placeId: place_id })) || [],
              cms: []
            })
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }))
      })
    }
    // trigger search when icon click
    if (event.detail.type === 'search-click') this.clickOnPredictionListener({ detail: { address: event.detail.value } })
    if (event.detail.type === 'enter') {
      const autocompleteLiElements = Array.from(event.target.root.querySelector('dialog').querySelector('ks-m-auto-complete-list').root.querySelectorAll('li'))
      const firstLiId = autocompleteLiElements[0].getAttribute('id')
      if (autocompleteLiElements.length > 0 && firstLiId === 'user-location') {
        this.clickOnPredictionListener({ detail: { address: event.detail.value } })
      } else if (autocompleteLiElements.length > 0 && firstLiId !== 'user-location') {
        event.preventDefault();
        event.stopPropagation()
      }
    }
  }

  clickOnLocateMe = (event) => {
    const { lat, lng } = event.detail
    this.setCoordinationFilter(lat, lng)
  }
}
