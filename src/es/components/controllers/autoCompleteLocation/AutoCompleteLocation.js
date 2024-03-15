
/** @typedef {{
  term: string,
}} LocationItem */

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
  constructor (options = {}, ...args) {
    super({
      importMetaUrl: import.meta.url,
      mode: 'false',
      ...options
    }, ...args)
    this.abortController = null
    this.RESOLVE_MSG = 'LOADED'
  }

    

  connectedCallback () {
    Promise.resolve(this.loadDependency())
    .then(() => {
      this.requestAutoCompleteListener = event => {
        const token = event.detail.value
        if (!token || token.length < 3) return
        if (this.hasAttribute('mock')) return this.dispatchMock()
        if (this.abortController) this.abortController.abort()
        this.abortController = new AbortController()
        if (this.service) {
          this.service.getPlacePredictions({ input: token, componentRestrictions: { country: "ch" }, types: ["geocode"]}, (result) => {
            console.log(result)
            this.dispatchEvent(new CustomEvent(this.getAttribute('auto-complete') || 'auto-complete-location', {
              detail: {
                fetch: {
                  total: 10,
                  success: true,
                  searchText: token,
                  items: result,
                  cms: []
                }
              },
              bubbles: true,
              cancelable: true,
              composed: true
          }))
        })
      }
      this.addEventListener(this.getAttribute('request-auto-complete') || 'request-auto-complete-location', this.requestAutoCompleteListener)
      }
    })
  }

  disconnectedCallback () {
    this.removeEventListener(this.getAttribute('request-auto-complete') || 'request-auto-complete-location', this.requestAutoCompleteListener)
  }

  loadDependency () {
    return this.loadDependencyPromise || (this.loadDependencyPromise = new Promise((resolve, reject) => {
      if (document.getElementById('google-maps-places')) resolve(this.RESOLVE_MSG)
      const googlePlaces = document.createElement('script')
      googlePlaces.setAttribute('type', 'text/javascript')
      googlePlaces.setAttribute('id', 'google-maps-places')
      try {
        // @ts-ignore
        googlePlaces.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places&v=weekly`)
        document.body.appendChild(googlePlaces)
        googlePlaces.onload = () => {
            // @ts-ignore
            if ('google' in self) {
              resolve(self.google.maps)
              this.service = new google.maps.places.AutocompleteService();
            }
        }
      } catch (e) {
        return reject(e)
      }
    }))
  }

  dispatchMock () {
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
}
