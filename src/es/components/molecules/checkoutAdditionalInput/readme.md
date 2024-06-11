# Checkout Booked Offer

> Checkout Booked Offer component.

- [JIRA](https://jira.migros.net/browse/MIDUWEB-760)
- [Examples](../../pages/CheckoutAdditionalInput.html)

## Markup Examples

### Example

```html
    <m-simple-form-validation namespace="simple-form-miduweb-" no-validation-error-css
    endpoint="/api/test" method="POST" load-form-styles>
        <form>
            ...
            <ks-m-checkout-additional-input>
                <div>
                    <ks-a-heading tag="h3">Zusätzliche Angaben zur Buchung</ks-a-heading>
                    <div>
                        <label for="description">Ihre Angabe</label>
                        <textarea id="Description" live-input-validation="true" rows="4" maxlength="50" data-m-v-rules='{"required": {"error-message": "Bitte diese textarea ausfüllen."},
                        "min-length": {"value": "3", "error-message": "Bitte minimum 3 Character eingeben."}}' name="Description"
                        placeholder="Beschreibung hier eingeben..."></textarea>
                    </div>
                </div>
            </ks-m-checkout-additional-input>
        </form>
    </m-simple-form-validation>
```

