
Then based on hte idea of this project create a new one in separate directory with latest npm dependencies (React, Electron, Puppeteer on demand) with https://dockview.dev/ instead of AntDesign

My suggestings
Layout
Dockview

Forms
Radix UI

Tables
TanStack Table

Drag & Drop
dnd-kit



State
Zustand


Add option to export as Playwright


✅ Group Menu items/subitem in new struture that better represent the model MODEL.md

Change file structure in src for better maintanability

✅ Make it more like VS Code - default window size like VS Code, options to change the window .
BEsides Main menu goes on top left horizontally. On the very left top little logo of puppetry.
On the left we have Explorer, one window with Open Editors (suites) and other as it is suites available in the project.


✅ Remove all undemanded fuinctionality like Git, in-browser vibing and so on.

✅ Locators and Test Cases are two subordinated editors under open Suite (file) tab.
Switching between Locators and Test Cases cases rerendering the entire app and very heavy and slow. Maybe we can use React Router and make switch momentar?

✅ update texts in files inside src/component/Schema in accordance with the new model in ./MODEL.md, also prof-read and improve  the texts in (keep consistency in texdt style when possible)


✅ Update terminology in the codebase and ./docs, README.md according to the following model change:

## Previous Model

```text
Project
 └─ Test Suite
    ├─ Test Case
    │   └─ Step
    │       ├─ Action
    │       ├─ Assertion
    │       └─ Snippet Reference
    │
    ├─ Target
    └─ Snippet
```

### Issues

* **Project** is generic and does not communicate that this is a testing project.
* **Target** is ambiguous. It could mean a browser, environment, URL, deployment target, or page element.
* **Snippet** is a developer-centric term and does not describe its purpose.
* **Snippet Reference** exposes implementation details rather than intent.

---

## New Model

```text
Test Plan
 └─ Test Suite
    ├─ Test Case
    │   └─ Step
    │       ├─ Action
    │       ├─ Assertion
    │       └─ Flow Reference
    │
    ├─ Locator
    └─ Shared Flow
```

---

## Hierarchy

### Test Plan

Represents the application, website, or system under test.

Examples:

```text
Acme Website
Customer Portal
Online Store
Administration Console
```

A Test Plan contains multiple Test Suites, Locators, and Shared Flows.

### Test Suite

Represents a single test file.

Example:

```text
contact.spec.js
checkout.spec.js
authentication.spec.js
```

### Test Case

Represents an individual automated test.

Example:

```javascript
test("Page Renders")
```

A Test Case consists of one or more Steps.

### Step

A Step is an executable item within a Test Case.

Every row in the Test Case editor represents a Step.

A Step can be one of three types:

* Action
* Assertion
* Shared Flow

Example:

```text
Page Renders

1. Action      Open Page
2. Shared Flow Log_In_Procedure
3. Assertion   Header Is Visible
4. Assertion   Contact Section Is Visible
```

### Action

Performs an operation in the browser.

Examples:

```javascript
await $.openPage();
await $.submitButton.click();
await $.emailInput.fill("john@example.com");
```

### Assertion

Verifies expected application behavior.

Examples:

```javascript
await expect($.sectionLoc).toBeVisible();
await expect($.successMessage).toContainText("Thank you");
```

### Locator

A reusable definition of a page element.

Examples:

```text
CONTACT_SECTION
SUBMIT_BUTTON
EMAIL_INPUT
MAIN_NAVIGATION
```

Equivalent Playwright concept:

```javascript
page.locator(...)
```

Locators are referenced by Actions and Assertions.

### Shared Flow

A reusable sequence of Steps.

Examples:

```text
Log_In_Procedure
Verify_Header
Accept_Cookie_Banner
Create_Test_User
```

A Shared Flow may contain Actions, Assertions, and other Shared Flows.

Shared Flows are intended to eliminate duplication and centralize common test behavior.

Equivalent Playwright concept:

```javascript
async function login(page) {
  ...
}
```

---

## Playwright Mapping

| Puppetry    | Playwright                                    |
| ----------- | --------------------------------------------- |
| Test Plan   | Entire Playwright project                     |
| Test Suite  | `*.spec.js` file                              |
| Test Case   | `test()`                                      |
| Step        | Individual executable statement               |
| Action      | Browser interaction (`goto`, `click`, `fill`) |
| Assertion   | `expect()`                                    |
| Locator     | `page.locator()`                              |
| Shared Flow | Reusable helper/workflow                      |

```
```
