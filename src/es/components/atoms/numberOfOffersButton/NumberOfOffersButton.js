// @ts-check
import Button from '../../web-components-toolbox/src/es/components/atoms/button/Button.js'

/**
 * Creates an Button for Number of Offers
 *
 * @export
 * @attribute {namespace} namespace
 * @type {CustomElementConstructor}
 */
export default class NumberOfOffersButton extends Button {
  connectedCallback () {
    super.connectedCallback()
    // @ts-ignore
    this.eventListenerNode = this.hasAttribute('with-facet-target') ? NumberOfOffersButton.walksUpDomQueryMatches(this, "ks-o-offers-page") : document.body

    this.eventListenerNode.addEventListener('with-facet', this.withFacetEventListener)
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    this.eventListenerNode.removeEventListener('with-facet', this.withFacetEventListener)
  }

  withFacetEventListener = async event => {
    this.button.textContent = `${(await event.detail.fetch).total} ${(await event.detail.fetch).total_label}`
  }
}
