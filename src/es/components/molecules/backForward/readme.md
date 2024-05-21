# Back Forward

> Back Forward component.

- [JIRA](https://jira.migros.net/browse/MIDUWEB-733)
- [Examples](../../pages/BackForward.html)

## Attributes
- `back-label=string`: localized label for back link (required)
- `back-link?=string`: url for the back link - if it is not set, browser history.back() will be the fallback behavior
- `forward-label=string`: localized label for back link (required)
- `submit?`: add this attribute if a submit button is needed
- `forward-link?=string`
- `forward-disabled`: if this attribute exists, forward button will be disabled

## Markup Examples

### Example 1 (with submit)

```
<ks-m-back-forward
    back-label="Zurück"
    back-link="#back"
    forward-label="Weiter"
    submit
></ks-m-back-forward>
```

### Example 2 (without submit)

```
<ks-m-back-forward
    back-label="Zurück"
    back-link="#back"
    forward-label="Weiter"
    forward-link="/"
></ks-m-back-forward>
```