# NotificationBar

> NotificationBar Atom

- [JIRA](https://jira.migros.net/browse/MIDUWEB-1771)
- [Figma](https://www.figma.com/design/PZlfqoBJ4RnR4rjpj38xai/Design-System-Core-%7C%C2%A0Klubschule-Master?node-id=13123-240616&node-type=instance&m=dev)
- [Example](https://github.com/mits-gossau/web-components-toolbox/blob/master/docs/TemplateMiduweb.html#L73)
- [Demo](https://mits-gossau.github.io/web-components-toolbox-klubschule/src/es/components/web-components-toolbox/docs/TemplateMiduweb.html?rootFolder=src&css=./src/css/variablesCustomKlubschule.css&login=./src/es/components/molecules/login/default-/default-.html&logo=./src/es/components/atoms/logo/default-/default-.html&nav=./src/es/components/web-components-toolbox/src/es/components/molecules/multiLevelNavigation/default-/default-.html&footer=./src/es/components/organisms/footer/default-/default-.html&content=./src/es/components/pages/Home.html)

## CMS Integration as sibling before <p-general>
```
<ks-a-notification-bar id="54325436432">
  <p>Et blandit sodales tempor magna mollis lacinia tortor phasellus dignissim ultrices consectetur hac sit litora interdum sagittis penatibus. <a>Mehr erfahren</a></p>
</ks-a-notification-bar>
```

### Attribute variations (check out example page above):
- *storage-type*: optional `localStorage` to keep the users "seen" decision in the localStorage to only show it once. Default is in the sessionStorage.
- *id*: optional string: random id, to show the component only once per id
- *error*: optional (no value) changes the background color from MDX default to error subtle3 (--color-secondary aka. --mdx-sys-color-primary-default to --mdx-sys-color-error-subtle3) and the font shows in default black
- *pro*: optional (no value) changes the background color from MDX default to accent 1 (--color-secondary aka. --mdx-sys-color-primary-default to --mdx-sys-color-accent-1-default) 
