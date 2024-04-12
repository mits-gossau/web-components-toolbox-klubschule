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
        icon-name="Mail"
        href="www.google.com"
        is-external
    >
    </ks-m-contact-row>
```
