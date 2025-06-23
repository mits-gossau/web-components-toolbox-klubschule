# Coding Guidelines
Consistent code reduces errors and facilitates collaboration.

## 1. General Principles
- **Use (or extend) existing components**: Make sure to use existing components as much as possible. If adjustments are necessary, extend the component.
- **Readability > Cleverness**: The code must be simple and understandable for others..

## 2. Language-specific rules
### JavaScript
- **Functions**:  
  ```javascript
  // Prefer arrow functions
  const calculateSum = (a, b) => a + b;
  ```
### General
- **Filename**: `PascalCase` (e.g. `UserProfile.js`)

## 3. Formating
| Element          | Rule                          |
|------------------|--------------------------------|
| Quotation marks | Single Quotes (`'`)         |
| Semicolons       | Never use               |

## 4. Testing
- TODO

## 5. Commit-Rules
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
