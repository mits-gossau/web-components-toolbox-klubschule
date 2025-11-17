# WithFacet 2.0

Executive intent

- Centralize all user interaction state (filters, coordinates, URL params, page context, refresh state) in a backend-managed session.
- The frontend sends an initial request once to begin/reset the session; afterwards, the API is the source of truth for state, URL params, and derived behavior.

Session lifecycle and initialization

- Initial request bootstrap
  - The frontend reads an invariant initialRequestObj from the component attribute initial-request (JSON).
  - This object is sent once to the API to start or reset the session, along with the current page URL (for API-side URL awareness).

- API-managed session
  - After initialization, the API owns:
    - The current filters state (selected and full available).
    - The complete filters model (all facets/values), even if not all are sent by the client.
    - Coordination of derived “null filter” behavior (see below).
    - Any URL parameter derivation and synchronization.
    - Geolocation/coordinates state and its effects on results.
    - Detection whether the current page is a search page (see Page context).
    - Page context detection

Client responsibilities after migration

- Send one initial “startSession” call with:
  - Current page URL (origin, path, query) for API-side context/param derivation.
- For subsequent interactions, send concise deltas:
  - Filter changes: e.g., add/remove selections, not the full tree.
  - Coordinates updates when available.
  - Any feature toggles (e.g., info events vs. courses) as simple flags.
- Apply URL params returned by the API to history (write-only). Do not parse URL on the client; rely on the session.

Data contracts to support on the API

- Input (examples):
  - Start/reset:

    ```json
    {
      initialRequest: { filters?: ..., filter?: ... , ... },
      url: { href, origin, path, query },
      pageRefreshed?: boolean
    }
    ```

  - Update filters:

    ```json
    {
      changes: { select?: [{ facet, value }], remove?: [{ facet, value }], clearAll?: boolean },
      actionId?: 'userInteractionId'
    }
    ```

  - Update coordinates:

    ```json
    {
      coordinates: { lat, lon, accuracy? }
    }
    ```

  - Mode switch:

    ```json
    {
      resourceType: 'course' | 'informationEvent',
      otherLocations?: boolean
    }
    ```

- Output (examples):
  - Session snapshot with:
    - canonicalUrlParams
    - results (items, total)
    - filters: { completeModel, selected }
    - resourceType, flags (otherLocations), coordinates state
    - any warnings (e.g., “no base filter; using null filter”)

Notes mapped directly from the code comments

- “withfacet 2.0”: indicates a refactor where API takes ownership of interaction/session.
- “possible flag in new api … filterOnly”: treat as a server-side session flag, default false unless a product/category mandates filter-only mode.
- “on userinteraction navigator coordinates make call to api ‘/coordinates:rawCor’”: implement an API route to accept raw coordinates, persist in session, and drive geo-dependent behavior.
- “gets sent initially to the api to start or reset the session with url”: the initialRequestObj plus URL bootstrap.
- “only initial request obj is kept, the user/filter session is managed by the api”: client stops maintaining currentRequestObj/currentCompleteFilterObj; the API stores both effective and complete filters.
- “case: history push when api returns new url params”: API returns canonical params; client only pushes to history.
- “api decides … isSearchPage by knowing the url on initial api call”: detect context server-side using URL path or a flag.
- “coordinates session management is at api”: store/manage coordinates in the API session; no client storage.
- “can be tracked by the api session. initial request === pageIsRefreshed”: prefer explicit reset/rehydrate on initial call rather than client-side navigation detection.
