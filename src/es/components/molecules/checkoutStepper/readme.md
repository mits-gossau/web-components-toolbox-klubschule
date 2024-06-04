# CheckoutStepper

> CheckoutStepper compontent

- [JIRA](https://jira.migros.net/browse/MIDUWEB-745)
- [Example](../../pages/CheckoutStepper.html)

## Attributes

- `steps`: JSON array with status, label and link `{'status': 'done' | 'current' | 'default', 'label': 'Label', 'link': '#link'}`.  

## Examples

```html
<ks-m-checkout-stepper
    steps='[
        {
            "label": "Anmeldedaten",
            "status": "done",
            "link": "#anmeldedaten"
        },
        {
            "label": "Zahlung",
            "status": "current",
            "link": "#zahlung"
        },
        {
            "label": "Abschluss",
            "status": "default",
            "link": "#abschluss"
        }
    ]'
></ks-m-checkout-stepper>