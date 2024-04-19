# LinkItem

> link-item component initially designed to be used as location (Standort) link

- [JIRA](https://jira.migros.net/browse/MIDUWEB-430)
- [Example](../../pages/LinkItem.html)

# Attributes
- `label`: Main label for the link
- `description`: Description under label
- `href`,`target`,`id`: Attributes will be passed to `<a>` element

# Markup Examples

```
<ks-m-link-item
    label="Label"
    description="Eine Beschreibung dazu"
    href="https://www.google.de"
    target="_blank"
>
</ks-m-link-item>
```

Without Description:
```
<ks-m-link-item
    label="Label"
    href="#"
>
</ks-m-link-item>
```
