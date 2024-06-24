# WishList

> WishList Controller

- [JIRA](https://jira.migros.net/browse/MIDUWEB-866)
- [JIRA](https://jira.migros.net/browse/MIDUWEB-871)
- [JIRA](https://jira.migros.net/browse/MIDUWEB-872)
- [Figma](https://www.figma.com/design/thNWJxDbPikhVAE95eEHLI/Design-System-Pages-|%C2%A0Klubschule?node-id=15477-320216&m=dev)
- [Example Controller](../../web-components-toolbox/docs/TemplateMiduweb.html)
- [Example Organism aka. List](../../pages/Merkliste.html)
- [Example Favorite Button](../../pages/AngebotsDetailPage.html)

## CMS Integration


### Variations (check out example Controller template html above):
- *endpoint*: Add attribute `endpoint` to `ks-c-wish-list` to the wish list api expl.: https://dev.klubschule.ch/Umbraco/api/watchlistAPI.
this component should be placed at the base page above p-general or further

### Variations (check out example Organism aka. List page above):
- *endpoint*: Add attribute `endpoint` to `ks-o-wish-list` to the search aka. WithFacet api expl.: https://dev.klubschule.ch/Umbraco/Api/CourseApi/Search.
- *innerHTML*: Place a `<section id=message hidden>` with its html content within the `ks-o-wish-list`, which is going to be shown when the wish list is empty
this component should be placed within the wish list page type including a stage above and a body section wrapped around

### Variations (check out example Favorite Button page above):
- *course*: Add attribute `course` to `ks-m-favorite-button` with the current course id assembled as followed: courseType_courseId_centerid.
- (alternative) *course-type*: Add attribute `course-type`
- (alternative) *course-id*: Add attribute `course-id`
- (alternative) *center-id*: Add attribute `center-id`