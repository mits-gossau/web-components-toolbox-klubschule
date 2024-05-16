# Checkout Booked Offer

> Checkout Booked Offer component.

- [JIRA](https://jira.migros.net/browse/MIDUWEB-734)
- [Examples](../../pages/CheckoutBookedOffer.html)

## Attributes
- `headline`: Headline string
- `name`: Offering title/name string
- `status`: JSON with code and label `{'code': '1', 'label': 'Garantiert Durchgeführt'}`.  
Code can be `1` (guaranteed), `2` (started), `3` (await) or `4` (almost)
- `date`: Date string
- `street`: Street string
- `city`: City string
- `price-data`: JSON array with objects `{'label': 'Kursgeld', 'price': 'CHF 12.30'}`
- `total-price`: Total price string

## Markup Examples

### Example

```html
<ks-m-checkout-booked-offer
    headline="Headline"
    name="Angebotsname"
    status="{'code': '1', 'label': 'Garantiert Durchgeführt'}"
    date="22.4.2023 - 19.6.2023"
    time="Mo, 18:00 - 20:00 Uhr"
    street="Hofwiesenstrasse 350"
    city="8050 Zürich"
    price-data="[
        {
            'label': 'Kursgeld',
            'price': 'CHF 12.30'
        },
        {
            'label': 'Lehrmittel',
            'price': 'CHF 12.30'
        },
        {
            'label': 'Material',
            'price': 'CHF 12.30'
        },
        {
            'label': 'Annullationskosten-versicherung',
            'price': 'CHF 12.30'
        }
    ]"
    total-price="20.00 CHF"
>
</ks-m-checkout-booked-offer>
```

