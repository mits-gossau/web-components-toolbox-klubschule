/* global CustomEvent */
import { Shadow } from '../../components/web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * VotingController loads data from Voting API
 * As a controller, this component communicates exclusively through events
 * Example: web-components-toolbox-klubschule
 *
 * @export
 * @class VotingController
 * @type {CustomElementConstructor}
 */
export default class VotingController extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    const endpoint = 'http://localhost:3001/api/Voting/data'
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    this.requestVotingData = (event) => {
      document.body.dispatchEvent(new CustomEvent('voting-data', {
        detail: fetch(endpoint, fetchOptions).then(async response => {
          if (response.status >= 200 && response.status <= 299) {
            const result = await response.json()
            return result
          }
          throw new Error(response.statusText)
        }),
        bubbles: true,
        cancelable: true,
        composed: true
      }))
    }
  }

  connectedCallback () {
    document.body.addEventListener(
      'request-voting-data',
      this.requestVotingData
    )
  }

  disconnectedCallback () {
    document.body.removeEventListener(
      'request-voting-data',
      this.requestVotingData
    )
  }
}
