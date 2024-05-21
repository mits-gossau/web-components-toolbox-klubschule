# Checkout Color Stage

> Checkout Color Stage component.

- [JIRA](https://jira.migros.net/browse/MIDUWEB-735)
- [Examples](../../pages/CheckoutColorStage.html)

## Attributes
- `back-label`: localized label for back link (required)
- `back-link?`: url for the back link - if it is not set, browser history.back() will be the fallback behavior
- `title`: headline (required)

## Markup Examples

### Example 1

```
<ks-m-checkout-color-stage 
    back-label="Zurück" 
    title="Konfiguration: {{ Angebotstitel }}"
>
</ks-m-checkout-color-stage>
```

### Example 2

```
<ks-m-checkout-color-stage 
    back-label="Zurück" 
    back-link="/one-step-back"
    title="Konfiguration: {{ Angebotstitel }}"
>
</ks-m-checkout-color-stage>
```
