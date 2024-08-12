# Offers Page

> Offers Page component

- [JIRA](https://jira.migros.net/browse/MIDUWEB-166)
- [JIRA](https://jira.migros.net/browse/MIDUWEB-516)
- [Example](../../pages/Angebotsliste-Suchergebnis.html)
- [Example](../../pages/Veranstaltungsliste-Suchergebnis.html)

## Usage

You can find a simple example markup in the above linked example pages. 

### Attributes

- `endpoint="https://miducabulaliwebappdev-test.azurewebsites.net/api/CourseSearch/withfacet"`: BE API where data is coming from
- `initial-request='{"filter":[{"id": "17", "visible": false, "children": [{ "id": "D_97351_1019", "selected": true, "visible": false, "hasChilds": false, "eTag": null}],"hasChilds": true,"eTag": null}],"PortalId":29,"sprachid":"d","MandantId":111,"ppage":1,"psize":6}'`: JSON Object to define Search Level
- `endpoint-auto-complete="https://dev.klubschule.ch/Umbraco/Api/Autocomplete/search"`: Endpoint for Auto Complete functionality
- `google-api-key="AIzaSyC9diW31HSjs3QbLEbso7UJzeK7IpH9c2s"`: Google API Key (AIzaSyC9diW31HSjs3QbLEbso7UJzeK7IpH9c2s)
- `event-detail-url="https://dev.klubschule.ch/Umbraco/Api/CourseApi/detail/"`: API for Course/ Events Details
- `with-search-input`: includes search in page
- `with-location-input`: includes location search in page
- `with-filter-search`: includes search in filter overlay
- `with-auto-complete`: includes auto-complete in search fields
- `hide-abo-legend`: hides icons about abonnements at the end of the offers page
