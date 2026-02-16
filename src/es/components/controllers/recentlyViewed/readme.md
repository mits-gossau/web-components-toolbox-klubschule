# RecentlyViewed

> RecentlyViewed Controller - Manages two separate lists for recently viewed offers (client-based & account-based)

- [Swagger](https://dev.klubschule.ch/umbraco/swagger/index.html?urls.primaryName=Zuletzt+angesehene+Angebote+API)

## Acceptance Criteria
- Two separate lists: client-based (localStorage) for non-logged-in users, account-based (API) for logged-in users
- Lists are never merged or migrated
- After login: API list is displayed, new views are tracked server-side
- After logout: client-side localStorage list is shown again
- "Verlauf löschen": if not logged in → only client-side; if logged in → both lists

## CMS Integration
```
<ks-c-recently-viewed endpoint="https://dev.klubschule.ch/Umbraco/api/LastCourseViewApi">
    <!-- this wraps p-general or is even further up the dom tree, similar to ks-c-wish-list -->
    <!-- listens for msrc-user event (login) and switches data source -->
</ks-c-recently-viewed>
```

### Attributes:
- *endpoint*: URL to the [LastCourseViewApi](https://dev.klubschule.ch/umbraco/swagger/index.html?urls.primaryName=Zuletzt+angesehene+Angebote+API) (default: `https://dev.klubschule.ch/Umbraco/api/LastCourseViewApi`)

### Events:
- Listens: `msrc-user` (login/logout state), `recently-viewed-clear` (delete), `request-recently-viewed-storage` (data source query)
- Dispatches: `recently-viewed-render-list` (trigger re-render)
