# Abonnements Dialog

> A sub component of EventDetail Component (Used by Event and Abo Detail).

- [JIRA](https://jira.migros.net/browse/MIDUWEB-483)
- [Examples](../../pages/AboDetail.html)

## Attributes

- `link-label`: Label of the Link/Button which will open the overlay
- `button-close-label`: Label for the Close Buttons inside the overlay
- `initial-request`: JSON file with Params for the Request 
```json
{
    "language":"d",
    "kurs_typ":"6A",
    "kurs_id":"10375",
    "centerid":"10375"
}
```

## Markup Example

```html
    <ks-c-abonnements 
        endpoint="https://dev.klubschule.ch/Umbraco/Api/CourseApi/Abonnement">
        <ks-m-abonnements 
            link-label="Passende Abonnements finden"
            button-close-label="Schliessen"
            initial-request='
                {
                    "language":"d",
                    "kurs_typ":"6A",
                    "kurs_id":"10375",
                    "centerid":"10375"
                }
            '
        >
        </ks-m-abonnements>
    </ks-c-abonnements>
```

