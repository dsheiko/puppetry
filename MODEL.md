# Puppetry Model

## Hierarchy

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

## Test Plan

Represents the application, website, or system under test.

Examples:

```text
Acme Website
Customer Portal
Online Store
Administration Console
```

A Test Plan contains multiple Test Suites, Locators, and Shared Flows.

---

## Test Suite

Represents a single test file.

Example:

```text
contact.spec.js
checkout.spec.js
authentication.spec.js
```

---

## Test Case

Represents an individual automated test.

Example:

```javascript
test("Page Renders")
```

A Test Case consists of one or more Steps.

---

## Step

A Step is an executable item within a Test Case.

Every row in the Test Case editor represents a Step.

A Step can be one of three types:

* Action
* Assertion
* Flow Reference

Example:

```text
Page Renders

1. Action        Open Page
2. Flow Reference  Log_In_Procedure
3. Assertion     Header Is Visible
4. Assertion     Contact Section Is Visible
```

---

## Action

Performs an operation in the browser.

Examples:

```javascript
await $.openPage();
await $.submitButton.click();
await $.emailInput.fill("john@example.com");
```

---

## Assertion

Verifies expected application behavior.

Examples:

```javascript
await expect($.sectionLoc).toBeVisible();
await expect($.successMessage).toContainText("Thank you");
```

---

## Locator

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

In older Puppetry documentation this concept is referred to as a **Target**.

---

## Shared Flow

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

In older Puppetry documentation this concept is referred to as a **Snippet**.

---

## Flow Reference

A Step that invokes a Shared Flow.

Instead of duplicating steps, a Flow Reference delegates execution to a named Shared Flow.

In older Puppetry documentation this concept is referred to as a **Snippet Reference**.

---

## Playwright Mapping

| Puppetry       | Playwright                                    |
| -------------- | --------------------------------------------- |
| Test Plan      | Entire Playwright project                     |
| Test Suite     | `*.spec.js` file                              |
| Test Case      | `test()`                                      |
| Step           | Individual executable statement               |
| Action         | Browser interaction (`goto`, `click`, `fill`) |
| Assertion      | `expect()`                                    |
| Locator        | `page.locator()`                              |
| Shared Flow    | Reusable helper/workflow                      |
| Flow Reference | Call to a reusable helper                     |
