# RecentlyViewed

> RecentlyViewed Controller - Fetches and manages the server-based list of recently viewed offers

- [Swagger](https://dev.klubschule.ch/umbraco/swagger/index.html?urls.primaryName=Zuletzt+angesehene+Angebote+API)

## How it works
- The backend (Umbraco) tracks page views server-side for both logged-in and non-logged-in users
- The controller fetches the list via `LastCourseViewApi/Check` and provides it to the UI
- No login/logout handling required in the frontend — the backend manages this (analog Bestellabbruch)

## CMS Integration
```
<ks-c-recently-viewed endpoint="https://dev.klubschule.ch/Umbraco/api/LastCourseViewApi">
    <!-- wraps p-general or is further up the DOM tree, similar to ks-c-wish-list -->
</ks-c-recently-viewed>
```

### Attributes:
- *endpoint*: URL to the [LastCourseViewApi](https://dev.klubschule.ch/umbraco/swagger/index.html?urls.primaryName=Zuletzt+angesehene+Angebote+API) (default: `https://dev.klubschule.ch/Umbraco/api/LastCourseViewApi`)

### Events:
- Listens: `recently-viewed-clear` (delete), `request-recently-viewed-storage` (data source query)
- Dispatches: `recently-viewed-render-list` (trigger re-render)
