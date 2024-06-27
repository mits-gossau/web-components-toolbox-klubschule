# WishList

> WishList Controller

- [JIRA](https://jira.migros.net/browse/MIDUWEB-866)
- [JIRA](https://jira.migros.net/browse/MIDUWEB-871)
- [JIRA](https://jira.migros.net/browse/MIDUWEB-872)
- [Figma](https://www.figma.com/design/thNWJxDbPikhVAE95eEHLI/Design-System-Pages-|%C2%A0Klubschule?node-id=15477-320216&m=dev)
- [Example Controller](https://github.com/mits-gossau/web-components-toolbox/blob/899ae2700b828f353ee04bef969a83e695488317/docs/TemplateMiduweb.html)
- [Demo Wishlist](https://mits-gossau.github.io/web-components-toolbox-klubschule/src/es/components/web-components-toolbox/docs/TemplateMiduweb.html?rootFolder=src&css=./src/css/variablesCustomKlubschule.css&login=./src/es/components/molecules/login/default-/default-.html&logo=./src/es/components/atoms/logo/default-/default-.html&nav=./src/es/components/web-components-toolbox/src/es/components/molecules/multiLevelNavigation/default-/default-.html&footer=./src/es/components/organisms/footer/default-/default-.html&content=./src/es/components/pages/Merkliste.html)
- [Demo Button](https://mits-gossau.github.io/web-components-toolbox-klubschule/src/es/components/web-components-toolbox/docs/TemplateMiduweb.html?rootFolder=src&css=.%2Fsrc%2Fcss%2FvariablesCustomKlubschule.css&login=.%2Fsrc%2Fes%2Fcomponents%2Fmolecules%2Flogin%2Fdefault-%2Fdefault-.html&logo=.%2Fsrc%2Fes%2Fcomponents%2Fatoms%2Flogo%2Fdefault-%2Fdefault-.html&nav=.%2Fsrc%2Fes%2Fcomponents%2Fweb-components-toolbox%2Fsrc%2Fes%2Fcomponents%2Fmolecules%2FmultiLevelNavigation%2Fdefault-%2Fdefault-.html&footer=.%2Fsrc%2Fes%2Fcomponents%2Forganisms%2Ffooter%2Fdefault-%2Fdefault-.html&content=.%2Fsrc%2Fes%2Fcomponents%2Fpages%2FAngebotsDetailPage.html)

## CMS Integration
```
<ks-c-wish-list endpoint="https://dev.klubschule.ch/Umbraco/api/watchlistAPI">
    <!-- this wraps p-general or is even further up the dom tree, example at src/es/components/web-components-toolbox/docs/TemplateMiduweb.html -->
    <!-- important that ks-c-wish-list is an ancestor of ks-o-wish-list and ks-m-favorite-button -->
</ks-c-wish-list>
```


### Variations (check out example Controller template html above):
- *endpoint*: Add attribute `endpoint` to `ks-c-wish-list` to the [wish list api](https://wiki.migros.net/pages/viewpage.action?pageId=731830238) expl.: https://dev.klubschule.ch/Umbraco/api/watchlistAPI.
this component should be placed at the base page above p-general or further
