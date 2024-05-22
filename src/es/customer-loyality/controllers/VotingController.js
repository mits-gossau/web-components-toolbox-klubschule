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

    const endpoint = this.getAttribute('endpoint') ?? ''
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    this.requestVotingData = (event) => {
      fetchOptions.body = JSON.stringify(event.detail)
      this.dispatchEvent(new CustomEvent('voting-data', {
        detail: {
          fetch: fetch(`${endpoint}/data`, fetchOptions).then(async response => {
            if (response.status >= 200 && response.status <= 299) {
              const result = await response.json()
              return result
            }
            throw new Error(response.statusText)
          })
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }))
    }

    this.submitListener = (event) => {
      this.dispatchEvent(new CustomEvent('submit-voting-response', {
        detail: {
          fetch: fetch(`${endpoint}/voting`, { ...fetchOptions, body: JSON.stringify(event.detail) }).then(async response => {
            if (response.status >= 200 && response.status <= 299) {
              const result = await response.json()
              return result
            }
            throw new Error(response.statusText)
          })
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }))
    }
  }

  connectedCallback () {
    this.addEventListener(
      'request-voting-data',
      this.requestVotingData
    )
    this.addEventListener('submit-voting', this.submitListener)
  }

  disconnectedCallback () {
    this.removeEventListener(
      'request-voting-data',
      this.requestVotingData
    )
    this.removeEventListener(
      'submit-voting',
      this.submitListener
    )
  }
}
