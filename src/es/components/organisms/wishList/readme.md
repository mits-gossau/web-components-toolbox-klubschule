# WishList

> WishList Organism

- [JIRA](https://jira.migros.net/browse/MIDUWEB-866)
- [JIRA](https://jira.migros.net/browse/MIDUWEB-871)
- [JIRA](https://jira.migros.net/browse/MIDUWEB-872)
- [Figma](https://www.figma.com/design/thNWJxDbPikhVAE95eEHLI/Design-System-Pages-|%C2%A0Klubschule?node-id=15477-320216&m=dev)
- [Example Organism aka. List](../../pages/Merkliste.html)
- [Demo Wishlist](https://mits-gossau.github.io/web-components-toolbox-klubschule/src/es/components/web-components-toolbox/docs/TemplateMiduweb.html?rootFolder=src&css=./src/css/variablesCustomKlubschule.css&login=./src/es/components/molecules/login/default-/default-.html&logo=./src/es/components/atoms/logo/default-/default-.html&nav=./src/es/components/web-components-toolbox/src/es/components/molecules/multiLevelNavigation/default-/default-.html&footer=./src/es/components/organisms/footer/default-/default-.html&content=./src/es/components/pages/Merkliste.html)
- [Demo Button](https://mits-gossau.github.io/web-components-toolbox-klubschule/src/es/components/web-components-toolbox/docs/TemplateMiduweb.html?rootFolder=src&css=.%2Fsrc%2Fcss%2FvariablesCustomKlubschule.css&login=.%2Fsrc%2Fes%2Fcomponents%2Fmolecules%2Flogin%2Fdefault-%2Fdefault-.html&logo=.%2Fsrc%2Fes%2Fcomponents%2Fatoms%2Flogo%2Fdefault-%2Fdefault-.html&nav=.%2Fsrc%2Fes%2Fcomponents%2Fweb-components-toolbox%2Fsrc%2Fes%2Fcomponents%2Fmolecules%2FmultiLevelNavigation%2Fdefault-%2Fdefault-.html&footer=.%2Fsrc%2Fes%2Fcomponents%2Forganisms%2Ffooter%2Fdefault-%2Fdefault-.html&content=.%2Fsrc%2Fes%2Fcomponents%2Fpages%2FAngebotsDetailPage.html)

## CMS Integration
<!-- the ks-c-wish-list controller has to be placed as an ancestor further up the dom tree -->
<!--<ks-c-wish-list endpoint="https://dev.klubschule.ch/Umbraco/api/watchlistAPI">-->
  <ks-o-wish-list endpoint="https://dev.klubschule.ch/Umbraco/Api/CourseApi/Search" mandant-id="111" portal-id="29" sprach-id="d">
      <!-- the section must have id="message" and be hidden, the ks-o-wish-list is going to control it's appearance. Also the section can hold any html. -->
      <section id="message" hidden>
      <h2>Ihre Merkliste ist leer.</h2>
      <p>Fügen Sie Angebote und Veranstaltungen über die jeweiligen Angebotsseiten hinzu.</p>
      <ul>
          <li><a href=# target=_blank>Sprachen</a></li>
          <li><a href=# target=_blank>Kreativität</a></li>
          <li><a href=# target=_blank>Gesundheit</a></li>
      </ul>
      </section>
  </ks-o-wish-list>
<!--</ks-c-wish-list>-->

### Variations (check out example Organism aka. List page above):
- *endpoint*: Add attribute `endpoint` to `ks-o-wish-list` to the search aka. WithFacet api expl.: https://dev.klubschule.ch/Umbraco/Api/CourseApi/Search.
- *mandant-id*: Add attribute `mandant-id` to `ks-o-wish-list` default: 111
- *portal-id*: Add attribute `portal-id` to `ks-o-wish-list` default: 29
- *sprach-id*: Add attribute `sprach-id` to `ks-o-wish-list` default: document.documentElement.getAttribute('lang')?.substring(0, 1) || d
- *innerHTML*: Place a `<section id=message hidden>` with its html content within the `ks-o-wish-list`, which is going to be shown when the wish list is empty
this component should be placed within the wish list page type including a stage above and a body section wrapped around. See Example.
