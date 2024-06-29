# PartnerSearch

> PartnerSearch Organism

- [JIRA](https://jira.migros.net/browse/MIDUWEB-1019)
- [JIRA](https://jira.migros.net/browse/MIDUWEB-1020)
- [Figma](https://www.figma.com/design/1guRM28nOgSx4Gy4m7N7S6/Miduca-Suche?node-id=5024-92588&t=auV8p1YuZTKBTUJs-1)
- [Example Controller](https://github.com/mits-gossau/web-components-toolbox-klubschule/blob/master/src/es/components/organisms/offersPage/OffersPage.js#L167)
- [Demo PartnerSearch](https://mits-gossau.github.io/web-components-toolbox-klubschule/src/es/components/web-components-toolbox/docs/TemplateMiduweb.html?rootFolder=src&css=./src/css/variablesCustomKlubschule.css&login=./src/es/components/molecules/login/default-/default-.html&logo=./src/es/components/atoms/logo/default-/default-.html&nav=./src/es/components/web-components-toolbox/src/es/components/molecules/multiLevelNavigation/default-/default-.html&footer=./src/es/components/organisms/footer/default-/default-.html&content=./src/es/components/pages/Angebotsliste-Suchergebnis.html)

## CMS Integration
```
<ks-o-partner-search search-text="...">
  <section slot="empty-courses" hidden id="empty-courses">
    <h2>Es konnten keine Angebote gefunden werden.</h2>
    Tipps für ein besseres Suchresultat
    - Geben sie einen anderen Suchbegriff ein.
    - Reduzieren sie gesetzte Filter.
    - Suchen sie direkt in unseren Angebotsbereichen Sprachen, Kreativität oder Gesundheit nach einem passenden Angebot.
  </section>
  <section slot="empty-content" hidden id="empty-content">
    <h2>Es konnten keine Stories oder Informationen gefunden werden.</h2>
    Tipps für ein besseres Suchresultat
    - Geben sie einen anderen Suchbegriff ein.
    - Reduzieren sie gesetzte Filter.
  </section>
  <section slot="partner-results" hidden id="partner-results">
    <h2>Mit «{0}» konnten wir auf unseren Partnerseiten passende Angebote finden</h2>
    <div hidden data-partner="IBAW">
    <a-picture namespace="picture-cover-" alt="Dev Klubschule Logo De" picture-load defaultsource="https://int.klubschule.ch/media/imxlmwsh/dev-klubschule-logo-de.svg" aspect-ratio="NaN" sources-keep-query-aspect-ratio tabindex="0" loading="eager" loaded="true"></a-picture>
    Aus- &amp; Weiterbildungen Informatik, Wirtschaft &amp; Ausbildung der Ausbildenden
    <ks-a-button icon namespace="button-primary-" color="tertiary" label="GO"></ks-a-button>
    </div>
  </section>
</ks-o-partner-search>
```

### Variations:
- *search-text*: Add attribute `search-text` to `ks-o-partner-search` to dispatch the search term to the search aka. WithFacet api expl.: https://dev.klubschule.ch/Umbraco/Api/CourseApi/Search.
- *innerHTML*: Place a `<section slot="empty-courses" hidden id="empty-courses">` with its html content within the `ks-o-partner-search`, which is going to be shown when the partner search is empty
this component should be placed within the TileFactorye. The slot attribute is important, that the content is not shown accidentially initially.
