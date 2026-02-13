# Recently Viewed Offers

> Displays the last viewed offers (max 5) in the search overlay

- [JIRA](https://jira.migros.net/browse/MIDUWEB-2269)
- [Example](https://mits-gossau.github.io/web-components-toolbox-klubschule/src/es/components/web-components-toolbox/docs/TemplateMiduweb.html?rootFolder=src&css=./src/css/variablesCustomKlubschule.css&login=./src/es/components/molecules/login/default-/default-.html&logo=./src/es/components/atoms/logo/default-/default-.html&nav=./src/es/components/web-components-toolbox/src/es/components/molecules/multiLevelNavigation/default-/default-.html&footer=./src/es/components/organisms/footer/default-/default-.html&content=./src/es/components/pages/SearchField.html)

## CMS Integration
```
<ks-m-recently-viewed-list></ks-m-recently-viewed-list>
```
Place it directly below `<ks-m-history-complete-list></ks-m-history-complete-list>`

## Mock
Use the `mock` attribute to pre-populate `localStorage` with sample offers for testing:
```
<ks-m-recently-viewed-list mock></ks-m-recently-viewed-list>
```
Mock data is only written if `recently-viewed-offers` in `localStorage` is empty.
