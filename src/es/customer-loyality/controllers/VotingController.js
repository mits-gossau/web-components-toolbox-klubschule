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
    super({ importMetaUrl: import.meta.url, mode: 'false', ...options }, ...args)

    const endpoint = 'http://localhost:3001/api/Voting'
    // const endpoint = 'https://miducaexportapivotingdev.azurewebsites.net/api/Voting'
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    this.requestVotingData = (event) => {
      fetchOptions.body = JSON.stringify(event.detail)
      document.body.dispatchEvent(new CustomEvent('voting-data', {
        detail: fetch(`${endpoint}/data`, fetchOptions).then(async response => {
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

    this.submitListener = (event) => {
      console.log('submitListener', event)
      fetch(`${endpoint}/voting`, {
        ...fetchOptions,
        body: JSON.stringify(event.detail)
      }).then(res => res.json())
        .then(response => console.log('submitListener response', response))
    }
  }

  connectedCallback () {
    document.body.addEventListener(
      'request-voting-data',
      this.requestVotingData
    )
    document.body.addEventListener('submit-voting', this.submitListener)
  }

  disconnectedCallback () {
    document.body.removeEventListener(
      'request-voting-data',
      this.requestVotingData
    )
  }
}
