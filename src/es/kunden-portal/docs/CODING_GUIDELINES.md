# Coding Guidelines
Consistent code reduces errors and facilitates collaboration.

## 1. General Principles
- **Use (or extend) existing components**: Make sure to use existing components as much as possible. If adjustments are necessary, extend the component.
- **Readability > Cleverness**: The code must be simple and understandable for others..

## 2. Event Driven Naming rules
- **Event Names Schema**:  
  * `update-<component>-<action>` for updating a component
  * `request-<component>-<action>` for requesting something from a controller

## 3. Language-specific rules
### JavaScript
- **Functions**:  
  ```javascript
  // Prefer arrow functions
  const calculateSum = (a, b) => a + b;
  ```

- **Controllers**:
  ```javascript
  // KEEP CONTROLLER FN AS SIMPLE AS POSSOBLE!!!
  // USE CONTROLLER FN ONLY FOR API CALLS AND EVENT DISPATCHING!!!

  /**
   * Add description
   * @param {CustomEventInit} event
   */
  if (this.abortController[EventAction]) this.abortController[EventAction].abort()
    this.abortController[EventAction] = new AbortController()
    const { [ResponseKey] } = event.detail
    const data = {
      userId,
      subscriptionType,
      subscriptionId,
      language: this.getLanguage()
    }
    const fetchOptions = this.fetchPOSTOptions(data, this.abortController[EventAction])
    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('kunden-portal').[API]}`
    this.dispatchEvent(new CustomEvent('update-[event-action]', {
      detail: {
        fetch: fetch(endpoint, fetchOptions).then(async response => {
          if (response.status >= 200 && response.status <= 299) return await response.json()
          throw new Error(response.statusText)
        })
      },
      bubbles: true,
      cancelable: true,
      composed: tru`
    }))
  ```
### General
- **Filename**: `PascalCase` (e.g. `UserProfile.js`)

## 4. Formating
| Element          | Rule                          |
|------------------|--------------------------------|
| Quotation marks | Single Quotes (`'`)         |
| Semicolons       | Never use               |

## 5. Testing
- TODO

## 6. Commit-Rules
- **Conventional Commits**:
  ```
  feat: add user profile page
  fix: resolve login timeout
  ```
- Atomic commits whenever possible (one change per commit).

## 7. Code review checklist
- [ ] Documentation updated? 
- [ ] ...

...

> 🔗 See also: [CONTRIBUTING.md](CONTRIBUTING.md) 
