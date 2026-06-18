# Puppetry Structure

## Overview

Puppetry organizes automated tests into a hierarchy that closely mirrors how modern testing frameworks such as Playwright structure tests.

```text
Test Plan
 └─ Test Suite
     └─ Test Case
         ├─ Action
         ├─ Assertion
         └─ Shared Flow
```

Each level has a specific responsibility and maps naturally to familiar Playwright concepts.

---

# Core Concepts

## Test Plan

A **Test Plan** represents the application, website, or project being tested.

It is the top-level container that groups all test suites related to a single system under test.

### Examples

```text
Acme Website

Online Store

Customer Portal

Administration Dashboard
```

A Test Plan typically contains many test suites covering different pages, features, and user journeys.

### Playwright Analogy

A Test Plan is roughly equivalent to the entire Playwright testing project:

```text
playwright.config.ts

tests/
├─ authentication.spec.ts
├─ contact.spec.ts
├─ checkout.spec.ts
└─ profile.spec.ts
```

---

## Test Suite

A **Test Suite** is a single test file.

It groups related test cases that validate a specific page, feature, or workflow.

### Example

```text
contact.spec.js
```

Contents:

```text
Contact Page
├─ Page Renders
├─ Form Can Be Submitted
└─ Validation Message Appears
```

### Playwright Analogy

A Test Suite typically maps to a single spec file:

```text
contact.spec.js
```

or conceptually:

```javascript
test.describe("Contact Page", () => {
  ...
});
```

---

## Test Case

A **Test Case** is a single automated test that validates one behavior of the application.

A test case executes independently and produces a pass or fail result.

### Example

```javascript
test("Page Renders", async () => {
  ...
});
```

### Examples of Test Cases

```text
Page Renders

User Can Submit Contact Form

Validation Message Appears
```

### Playwright Analogy

Direct equivalent:

```javascript
test("Page Renders", async () => {
  ...
});
```

A Test Case answers a single question:

> Does this specific behavior work as expected?

---

## Action

An **Action** performs an operation within the browser.

Actions interact with the application and move the test forward.

### Examples

```javascript
await $.openPage();

await $.clickSubmit();

await $.fillEmail("john@example.com");
```

### Purpose

Actions change application state.

Examples:

* Open a page
* Click a button
* Fill a form
* Select an option
* Upload a file

### Playwright Analogy

```javascript
await page.goto("/contact");

await page.click("button[type=submit]");

await page.fill("#email", "john@example.com");
```

---

## Assertion

An **Assertion** verifies that the application is in the expected state.

Assertions determine whether a test passes or fails.

### Examples

```javascript
await expect($.sectionLoc).toBeVisible();

await expect($.successMessage).toContainText("Thank you");

await expect($.submitButton).toBeDisabled();
```

### Purpose

Assertions validate outcomes after actions have been performed.

### Playwright Analogy

Direct equivalent:

```javascript
await expect(contactSection).toBeVisible();

await expect(successMessage).toContainText("Thank you");
```

---

## Shared Flow

A **Shared Flow** is a reusable sequence of Actions and Assertions.

It allows common testing procedures to be defined once and reused across multiple test cases.

Shared Flows reduce duplication and improve maintainability.

### Examples

```text
Log_In_Procedure

Verify_Header

Accept_Cookie_Banner

Create_Test_User
```

### Example Usage

```text
Shared Flow: Log_In_Procedure
```

instead of repeating:

```javascript
await $.openLoginPage();
await $.enterUsername();
await $.enterPassword();
await $.clickLogin();
await expect($.dashboardLoc).toBeVisible();
```

### Playwright Analogy

A Shared Flow is similar to a reusable helper function:

```javascript
async function logIn(page) {
  await page.goto("/login");
  await page.fill("#user", "admin");
  await page.fill("#password", "secret");
  await page.click("button[type=submit]");
  await expect(page.locator(".dashboard")).toBeVisible();
}
```

Used by multiple tests:

```javascript
test("Page Renders", async () => {
  await logIn(page);
});
```

---

# Example

## Puppetry

```text
Test Plan: Acme Website

Test Suite: contact.spec.js

  Test Case: Page Renders

    Action:
      await $.openPage();

    Assertion:
      await expect($.sectionLoc).toBeVisible();

    Shared Flow:
      Log_In_Procedure
```

## Equivalent Playwright

```javascript
test.describe("Contact Page", () => {

  test("Page Renders", async ({ page }) => {

    await logIn(page);

    await page.goto("/contact");

    await expect(
      page.locator("[data-testid=contact-section]")
    ).toBeVisible();

  });

});
```

---

# Quick Reference

| Puppetry    | Description                                 | Playwright Equivalent                |
| ----------- | ------------------------------------------- | ------------------------------------ |
| Test Plan   | Website or application under test           | Entire Playwright project            |
| Test Suite  | Test file                                   | `contact.spec.js`                    |
| Test Case   | Individual test                             | `test("name")`                       |
| Action      | Browser interaction                         | `goto()`, `click()`, `fill()`        |
| Assertion   | Validation                                  | `expect()`                           |
| Shared Flow | Reusable sequence of Actions and Assertions | Helper function or reusable workflow |


## Locator

A **Locator** identifies a page element that Actions and Assertions can interact with.

Before a test can click a button, type into an input, or verify that an element is visible, Puppetry must know how to find that element in the page. This is the purpose of a Locator.

In older Puppetry documentation this concept is referred to as a **Target**. A target can represent either the page itself or a DOM element identified by a CSS selector or XPath expression.

### Examples

```text
CONTACT_FORM
SUBMIT_BUTTON
EMAIL_INPUT
MAIN_NAVIGATION
```

Each locator consists of:

* A human-readable alias
* A CSS selector or XPath expression

Example:

```text
Alias: SUBMIT_BUTTON

Selector:
button[type="submit"]
```

### Purpose

Locators separate element identification from test logic.

Instead of repeating selectors throughout tests:

```javascript
await page.click('button[type="submit"]');
await expect(
  page.locator('button[type="submit"]')
).toBeVisible();
```

the selector is defined once and referenced by name:

```javascript
await $.submitButton.click();

await expect($.submitButton).toBeVisible();
```

This makes tests easier to read and maintain.

If the application's HTML changes, only the Locator definition must be updated.

### Playwright Analogy

A Locator is equivalent to a Playwright locator:

```javascript
const submitButton =
  page.locator('button[type="submit"]');
```

or

```javascript
const emailInput =
  page.getByLabel('Email');
```

The main difference is that Puppetry stores locators centrally and assigns them meaningful aliases that can be reused across all test suites.

### Example

#### Locator Definition

```text
Alias:
CONTACT_SECTION

Selector:
[data-testid="contact-section"]
```

#### Used in an Action

```javascript
await $.contactSection.scrollIntoView();
```

#### Used in an Assertion

```javascript
await expect($.contactSection).toBeVisible();
```

### Quick Reference

| Puppetry     | Description                             | Playwright Equivalent |
| ------------ | --------------------------------------- | --------------------- |
| Locator      | Named page element definition           | `page.locator()`      |
| Alias        | Human-readable locator name             | Variable name         |
| CSS Selector | Element identification rule             | Locator selector      |
| XPath        | Alternative element identification rule | XPath locator         |

### Why Locators Matter

Without locators, tests contain implementation details:

```javascript
await page.click(
  '.contact-form > div:nth-child(3) button'
);
```

With locators, tests describe intent:

```javascript
await $.submitButton.click();
```

This improves readability, reusability, and long-term maintainability of automated tests.
