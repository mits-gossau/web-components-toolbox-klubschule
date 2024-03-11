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
        document.body.addEventListener('with-facet', this.withFacetEventListener)
    }

    disconnectedCallback () {
        super.disconnectedCallback()
        document.body.removeEventListener('with-facet', this.withFacetEventListener)
    }

    withFacetEventListener = async event => {
        this.button.textContent = `(${(await event.detail.fetch).numberOfOffers}) ${this.getAttribute('translation-key-cta')}`
    }
}
