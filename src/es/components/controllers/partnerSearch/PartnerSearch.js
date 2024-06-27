// @ts-check

/* global fetch */
/* global self */
/* global CustomEvent */

/**
 * PartnerSearch are retrieved via the corresponding endpoint as set as an attribute
 * As a controller, this component communicates exclusively through events
 * Definition: https://jira.migros.net/browse/MIDUWEB-823
 *
 * @export
 * @class PartnerSearch
 * @type {CustomElementConstructor}
 */
export default class PartnerSearch extends HTMLElement {
  constructor () {
    super()

    this.abortControllerLocations = null
    this.requestPartnerSearchListener = event => {
      if (this.abortControllerLocations) this.abortControllerLocations.abort()
      this.abortControllerLocations = new AbortController()
      // assemble withfacet filter
      const filter = {
        hasChilds: false,
        label: '',
        id: 24,
        typ: '',
        level: '',
        color: '',
        selected: false,
        disabled: false,
        hideCount: false,
      }
      const body = {
        MandantId:  this.hasAttribute('mandant-id') ? Number(this.getAttribute('mandant-id')) : 110,
        PortalId: this.hasAttribute('portal-id') ? Number(this.getAttribute('portal-id')) : 29,
        sprachid: this.getAttribute('sprach-id') || document.documentElement.getAttribute('lang')?.substring(0, 1) || 'd',
        searchText: event.detail.searchText,
        filter: [{
          ...filter,
          children: [{
            ...filter,
            id: 30,
            selected: true
          },
          {
            ...filter,
            id: 31,
            selected: true
          }],
        }]
      }
      // @ts-ignore
      event.detail.resolve(fetch(this.getAttribute('endpoint'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        body,
        signal: this.abortControllerLocations.signal
      }).then(response => {
        if (response.status >= 200 && response.status <= 299) return response.json()
        throw new Error(response.statusText)
      }))
    }
  }

  connectedCallback () {
    this.addEventListener('request-wish-list', this.requestPartnerSearchListener)
  }
  
  disconnectedCallback () {
    this.removeEventListener('request-wish-list', this.requestPartnerSearchListener)
  }
}
