# PartnerSearch

> PartnerSearch Controller

- [JIRA](https://jira.migros.net/browse/MIDUWEB-1019)
- [JIRA](https://jira.migros.net/browse/MIDUWEB-1020)
- [Figma](https://www.figma.com/design/1guRM28nOgSx4Gy4m7N7S6/Miduca-Suche?node-id=5024-92588&t=auV8p1YuZTKBTUJs-1)
- [Example Controller](https://github.com/mits-gossau/web-components-toolbox-klubschule/blob/master/src/es/components/organisms/offersPage/OffersPage.js#L167)
- [Demo PartnerSearch](https://mits-gossau.github.io/web-components-toolbox-klubschule/src/es/components/web-components-toolbox/docs/TemplateMiduweb.html?rootFolder=src&css=./src/css/variablesCustomKlubschule.css&login=./src/es/components/molecules/login/default-/default-.html&logo=./src/es/components/atoms/logo/default-/default-.html&nav=./src/es/components/web-components-toolbox/src/es/components/molecules/multiLevelNavigation/default-/default-.html&footer=./src/es/components/organisms/footer/default-/default-.html&content=./src/es/components/pages/Angebotsliste-Suchergebnis.html)

## CMS Integration
```
<ks-c-partner-search endpoint="https://dev.klubschule.ch/Umbraco/Api/CourseApi/Search" mandant-id="111" portal-id="29" sprach-id="d">
    <!-- this is placed far up inside the OffersPage.js and certainly further up the dom tree than ks-m-tile-factory -->
    <!-- important that ks-c-partner-search is an ancestor of ks-m-tile-factory -->
</ks-c-partner-search>
```

### Variations:
- *endpoint*: Add attribute `endpoint` to `ks-c-partner-search` to the search aka. WithFacet api expl.: https://dev.klubschule.ch/Umbraco/Api/CourseApi/Search.
- *mandant-id*: Add attribute `mandant-id` to `ks-c-partner-search` default: 111
- *portal-id*: Add attribute `portal-id` to `ks-c-partner-search` default: 29
- *sprach-id*: Add attribute `sprach-id` to `ks-c-partner-search` default: document.documentElement.getAttribute('lang')?.substring(0, 1) || d
- (alternative) *initial-request*: Add attribute `initial-request`
