# Coding Guidelines
Consistent code reduces errors and facilitates collaboration.

## 1. General Principles
- **DRY (Don't Repeat Yourself)**: Reusable functions instead of copy-paste.
- **KISS (Keep It Simple)**: Avoid unnecessary complexity.
- **Readability > Cleverness**: Code must be understandable to others.

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
