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

    let MandantId = this.hasAttribute('mandant-id') ? Number(this.getAttribute('mandant-id')) : 110
    let PortalId = this.hasAttribute('portal-id') ? Number(this.getAttribute('portal-id')) : 29
    let alternativePortalIds = this.getAttribute("alternative-portal-ids-search") || ''
    let parsedAlternativePortalIds = alternativePortalIds !== '' ? JSON.parse(alternativePortalIds) : []
    let sprachid = this.getAttribute('sprach-id') || document.documentElement.getAttribute('lang')?.substring(0, 1) || 'd'
    if (this.hasAttribute('initial-request')) {
      const initialRequest = JSON.parse(this.getAttribute('initial-request') || '{}')
      if (initialRequest.MandantId) MandantId = initialRequest.MandantId
      if (initialRequest.PortalId) PortalId = initialRequest.PortalId
      if (initialRequest.sprachid) sprachid = initialRequest.sprachid
    }

    this.abortController = null
    this.requestPartnerSearchListener = event => {
      if (this.abortController) this.abortController.abort()
      this.abortController = new AbortController()
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
        MandantId,
        PortalId,
        sprachid,
        searchText: event.detail.searchText,
        filter: [{
          ...filter,
          children: parsedAlternativePortalIds.map((portalId) => (
            {
              ...filter,
              id: portalId,
              selected: true
            }
          )),
        }]
      }
      // @ts-ignore
      const fetchPromise = fetch(this.getAttribute('endpoint'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': sprachid || 'd'
        },
        mode: 'cors',
        body: JSON.stringify(body),
        signal: this.abortController.signal
      }).then(response => {
        if (response.status >= 200 && response.status <= 299) return response.json()
        throw new Error(response.statusText)
      })
      if (event.detail.resolve) {
        event.detail.resolve(fetchPromise)
      } else {
        this.dispatchEvent(new CustomEvent('partner-search', {
          detail: {
            fetch: fetchPromise
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }))
      }
    }
  }

  connectedCallback () {
    this.addEventListener('request-partner-search', this.requestPartnerSearchListener)
  }
  
  disconnectedCallback () {
    this.removeEventListener('request-partner-search', this.requestPartnerSearchListener)
  }
}
