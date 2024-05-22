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
- `course-price`: Course price (withou additional costs)
- `initial-configuration-price-data`: initial price data, that will change after user selection. JSON as documented [here](https://wiki.migros.net/pages/viewpage.action?pageId=754811121)

## Event Listeners
- `checkout-configuration`: listens for this event emitted by checkout controller to update the configuration price data.

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
    course-price="CHF 630.00"
    initial-configuration-price-data='{
        "annulationskostenversicherungPreis": "CHF 16.75",
        "lehrmittelPreis": "CHF 16.90",
        "materialPreis": "CHF 0.00",
        "totalPreisOhneAnnulation": "CHF 646.90",
        "totalPreisMitAnnulation": "CHF 663.65"
    }'
>
</ks-m-checkout-booked-offer>
```

