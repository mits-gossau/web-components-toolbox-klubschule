# PartnerSearch

> PartnerSearch Organism

- [JIRA](https://jira.migros.net/browse/MIDUWEB-1019)
- [JIRA](https://jira.migros.net/browse/MIDUWEB-1020)
- [Figma](https://www.figma.com/design/1guRM28nOgSx4Gy4m7N7S6/Miduca-Suche?node-id=5024-92588&t=auV8p1YuZTKBTUJs-1)
- [Example Controller](https://github.com/mits-gossau/web-components-toolbox-klubschule/blob/master/src/es/components/organisms/offersPage/OffersPage.js#L167)
- [Demo PartnerSearch](https://mits-gossau.github.io/web-components-toolbox-klubschule/src/es/components/web-components-toolbox/docs/TemplateMiduweb.html?rootFolder=src&css=./src/css/variablesCustomKlubschule.css&login=./src/es/components/molecules/login/default-/default-.html&logo=./src/es/components/atoms/logo/default-/default-.html&nav=./src/es/components/web-components-toolbox/src/es/components/molecules/multiLevelNavigation/default-/default-.html&footer=./src/es/components/organisms/footer/default-/default-.html&content=./src/es/components/pages/Angebotsliste-Suchergebnis.html)

## CMS Integration
```
<ks-o-partner-search search-text="..."></ks-o-partner-search>
```

### Variations:
- *search-text*: Add attribute `search-text` to `ks-o-partner-search` to dispatch the search term to the search aka. WithFacet api expl.: https://dev.klubschule.ch/Umbraco/Api/CourseApi/Search.
