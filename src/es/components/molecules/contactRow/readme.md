# Contact Row

> Contact Row component.

- [JIRA](https://jira.migros.net/browse/MIDUWEB-544)
- [Examples](../../pages/ContactBox.html)

## Markup Examples

### Adress

```
    <ks-m-contact-row
        name="Klubschule Migros Zürich"
        street="Hofweiesenstrasse 350"
        place="8050 Zürich"
        icon-name="Home"
        href="#"
    >
    </ks-m-contact-row>
```

### Mail

```
    <ks-m-contact-row
        name="Klubschule Migros Zürich"
        icon-name="Mail"
        href="mailto:fritz.eierschale@example.org"
    >
    </ks-m-contact-row>
```

### Phone

```
    <ks-m-contact-row
        name="+49 0160 49858582"
        icon-name="Phone"
        href="tel:+499123456789"
    >
    </ks-m-contact-row>
```

### External

```
    <ks-m-contact-row
        name="Klubschule Migros Zürich"
        icon-name="ArrowUpRight"
        href="www.google.com"
        target="_blank"
    >
    </ks-m-contact-row>
```

### Contact Form

```
    <ks-m-contact-row
        id=show-modal
        name=Kontaktformular
        icon-name=Mail
        href=javascript:;
        onclick="this.dispatchEvent(new CustomEvent('open-form-6c33799d-bfa7-4188-a75f-5b9413f6bfe3', { bubbles: true, cancelable: true, composed: true, detail: { command: 'show-modal' } }))"
        gtm-data="{&quot;event&quot;:&quot;virtual_pageview&quot;,&quot;pageview&quot;:&quot;/kontaktformular-open&quot;,&quot;center&quot;:&quot;aarau&quot;}"
    >
    </ks-m-contact-row>
```
