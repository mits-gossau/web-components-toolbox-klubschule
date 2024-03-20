
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
/* global AbortController */
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
    this.abortController = null
    this.RESOLVE_MSG = 'LOADED'
  }

  async connectedCallback() {
    this.addEventListener(this.getAttribute('request-auto-complete') || 'request-auto-complete-location', this.requestAutoCompleteListener)
    this.addEventListener(this.getAttribute('auto-complete-selection') || 'auto-complete-location-selection', this.clickOnPredictionListener)
    this.addEventListener("client-location-coords", this.clickOnLocateMe)
    await this.loadDependency()
  }

  disconnectedCallback() {
    this.removeEventListener(this.getAttribute('request-auto-complete') || 'request-auto-complete-location', this.requestAutoCompleteListener)
    this.removeEventListener(this.getAttribute('auto-complete-selection') || 'auto-complete-location-selection', this.clickOnPredictionListener)
    this.removeEventListener("client-location-coords", this.clickOnLocateMe)
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
            this.geocoder = new google.maps.Geocoder();
          }
        }
      } catch (e) {
        return reject(e)
      }
    }))
  }

  dispatchMock() {
    return this.dispatchEvent(new CustomEvent(this.getAttribute('auto-complete') || 'auto-complete-location', {
      detail: {
        /** @type {Promise<fetchAutoCompleteEventDetail>} */
        fetch: Promise.resolve({
          total: 10,
          success: true,
          searchText: 'St.',
          items: [
            {
              term: 'St. Antönien',
            },
            {
              term: 'St. Moritz',
            },
            {
              term: 'St. Gallen',
            },
            {
              term: 'St. Heinrich',
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

  setCoordinationFilter(lat, lng) {
    this.dispatchEvent(new CustomEvent('close-location-dialog', {
      bubbles: true,
      cancelable: true,
      composed: true
    }))
    this.dispatchEvent(new CustomEvent('request-with-facet',
      {
        detail: {
          key: "location-search",
          lat: lat,
          lng: lng
        },
        bubbles: true,
        cancelable: true,
        composed: true
      })
    )
  }

  dispatchInputChange(searchTerm) {
    this.dispatchEvent(new CustomEvent(this.getAttribute('input-change') || 'location-change', {
      detail: {
        searchTerm: searchTerm
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  get apiKey() {
    return this.getAttribute('google-api-key') || ''
  }

  clickOnPredictionListener = event => {
    this.geocoder.geocode(
      {
        'placeId': event.detail.selected
      },
      (responses, status) => {
        if (status == 'OK') {
          const lat = responses[0].geometry.location.lat()
          const lng = responses[0].geometry.location.lng()
          this.setCoordinationFilter(lat, lng)
        }
      }
    )
    this.dispatchInputChange(event.detail.description)
  }

  requestAutoCompleteListener = (event) => {
    const token = event.detail.value
    if (token === undefined || (token.length < 3 && token.length > 0)) return
    if (token.length === 0) this.dispatchEvent(new CustomEvent(this.getAttribute('auto-complete') || 'auto-complete-location', {
      detail: {
        fetch: null
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
    if (this.hasAttribute('mock')) return this.dispatchMock()
    if (this.abortController) this.abortController.abort()
    this.abortController = new AbortController()

    if (this.service) {
      this.service.getPlacePredictions({ input: token, componentRestrictions: { country: "ch" }, types: ["geocode"] }, async (predictions) => {
        this.predictions = predictions
        this.dispatchEvent(new CustomEvent(this.getAttribute('auto-complete') || 'auto-complete-location', {
          detail: {
            fetch: Promise.resolve({
              total: this.predictions.length,
              success: true,
              searchText: token,
              items: this.predictions.map(({ description, place_id }) => ({ term: description, placeId: place_id })),
              cms: []
            })
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }))
      })
    }

  }

  clickOnLocateMe = (event) => {
    const { lat, lng } = event.detail;

    this.dispatchInputChange(`${lat}, ${lng}`)
    this.setCoordinationFilter(lat, lng)
  }
}
