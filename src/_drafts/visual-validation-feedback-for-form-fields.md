---
title: "Visual Validation Feedback for Form Fields"
date: 2025-12-06 10:00:00 -07:00
comments: true
tags: ["forms", "HTML", "JavaScript", "progressive enhancement", "web components", "web forms", "UX"]
description: "The form-validation-list web component provides real-time visual feedback on validation requirements, checking each rule as users type and displaying helpful checkmarks or X's."
twitter_text: "Show users exactly which validation requirements they've met with visual feedback as they type."
series:
  name: "Modern Web Form Best Practices"
  tag: "series-forms"
  ordinal: "11"
---

Password requirements, username rules, input format constraints—forms often have multiple validation requirements, but users don't know if they're meeting them until they submit. The `form-validation-list` web component changes that, providing real-time visual feedback as users type, showing exactly which requirements are met and which aren't.

<!-- more -->

This is a modern replacement for my old [jQuery Easy Validation Rules](https://github.com/easy-designs/jquery.easy-validation-rules.js) plugin, reimagined as a web component with native form validation integration.

## Basic usage

Associate the component with an input and define your validation rules:

```html
<form>
  <label for="username">Username:</label>
  <input type="text" id="username" name="username" required>

  <form-validation-list for="username">
    <ul>
      <li data-pattern="[A-Z]+">At least one capital letter</li>
      <li data-pattern="[a-z]+">At least one lowercase letter</li>
      <li data-pattern="[\d]+">At least one number</li>
    </ul>
  </form-validation-list>

  <button type="submit">Submit</button>
</form>
```

As users type, each rule is checked against its regular expression pattern. Matched rules get a checkmark (✓), unmatched rules get an X (✗). When all rules match, the field is valid and the form can be submitted.

## How it works

The component:

1. Associates with an input via the `for` attribute
2. Finds all elements with `data-pattern` attributes
3. Tests the input value against each pattern
4. Adds `validation-matched` or `validation-unmatched` classes accordingly
5. Shows visual indicators (✓ or ✗)
6. Uses `setCustomValidity()` to integrate with native form validation
7. Prevents form submission until all rules match

The cascade animation (controlled by `each-delay`) creates a pleasant visual effect as rules are checked sequentially.

## Pattern-based validation

Define rules using regular expression patterns in the `data-pattern` attribute:

```html
<form-validation-list for="password">
  <ul>
    <!-- Length requirements -->
    <li data-pattern=".{8,}">At least 8 characters</li>
    <li data-pattern=".{8,32}">Between 8 and 32 characters</li>

    <!-- Character type requirements -->
    <li data-pattern="[A-Z]+">At least one uppercase letter</li>
    <li data-pattern="[a-z]+">At least one lowercase letter</li>
    <li data-pattern="[\d]+">At least one number</li>
    <li data-pattern="[!@#$%^&*]+">At least one special character</li>

    <!-- Format requirements -->
    <li data-pattern=".+@.+\..+">Valid email format</li>
    <li data-pattern="^[a-zA-Z0-9]+$">Only letters and numbers</li>
  </ul>
</form-validation-list>
```

Each pattern is a standard JavaScript regular expression. The component tests the input value against all patterns on every input event.

## Customizing the trigger event

By default, validation runs on the `input` event (as users type). Change it with `trigger-event`:

```html
<form-validation-list
  for="email"
  trigger-event="blur">
  <ul>
    <li data-pattern=".+@.+">Contains @ symbol</li>
    <li data-pattern=".+@.+\..+">Valid email format</li>
  </ul>
</form-validation-list>
```

This validates only when the field loses focus, useful for fields where you don't want to show errors while users are still typing.

## Adjusting the cascade delay

The `each-delay` attribute controls the delay between checking each rule:

```html
<form-validation-list
  for="password"
  each-delay="100">
  <!-- rules -->
</form-validation-list>
```

Set it to `0` to remove the cascade effect entirely and check all rules simultaneously.

## Custom CSS classes

Customize class names for integration with CSS frameworks:

```html
<style>
  .is-valid { border-color: green; }
  .is-invalid { border-color: red; }
  .rule-pass { color: green; }
  .rule-fail { color: red; }
</style>

<form-validation-list
  for="username"
  field-valid-class="is-valid"
  field-invalid-class="is-invalid"
  rule-matched-class="rule-pass"
  rule-unmatched-class="rule-fail">
  <ul>
    <li data-pattern=".{5,}">At least 5 characters</li>
    <li data-pattern="[!@#]+">Special char (!@#)</li>
  </ul>
</form-validation-list>
```

This lets you use class names that match your existing CSS architecture.

## Styling with CSS custom properties

Customize the visual indicators:

```css
form-validation-list {
  --validation-icon-matched: "✅";
  --validation-icon-unmatched: "❌";
  --validation-icon-size: 1.2em;
  --validation-matched-color: #28a745;
  --validation-unmatched-color: #dc3545;
}
```

Available properties:
- `--validation-icon-matched` - Content for matched state (default: "✓")
- `--validation-icon-unmatched` - Content for unmatched state (default: "✗")
- `--validation-icon-size` - Size of icons (default: 1em)
- `--validation-matched-color` - Color for matched rules (default: green)
- `--validation-unmatched-color` - Color for unmatched rules (default: red)

## Events

Listen for validation changes:

```javascript
const validationList = document.querySelector('form-validation-list');

validationList.addEventListener('form-validation-list:validated', (event) => {
  const { isValid, matchedRules, totalRules, field } = event.detail;
  console.log(`Matched ${matchedRules} of ${totalRules} rules`);
  console.log(`Field is ${isValid ? 'valid' : 'invalid'}`);
});
```

The event fires after validation completes, providing the current state.

## JavaScript API

Manually trigger validation and check state:

```javascript
const validationList = document.querySelector('form-validation-list');

// Trigger validation
const isValid = validationList.validate();
console.log('Is valid:', isValid);

// Check current state
console.log('Current state:', validationList.isValid);
```

## Internationalization

Customize the validation message for different languages:

```html
<!-- Spanish -->
<form-validation-list
  for="contrasena"
  validation-message="Por favor, cumple todos los requisitos ({matched} de {total})">
  <ul>
    <li data-pattern="[A-Z]+">Al menos una letra mayúscula</li>
    <li data-pattern="[a-z]+">Al menos una letra minúscula</li>
    <li data-pattern="[\d]+">Al menos un número</li>
  </ul>
</form-validation-list>

<!-- French -->
<form-validation-list
  for="mot-de-passe"
  validation-message="Veuillez satisfaire à toutes les exigences ({matched} sur {total})">
  <ul>
    <li data-pattern="[A-Z]+">Au moins une lettre majuscule</li>
    <li data-pattern="[a-z]+">Au moins une lettre minuscule</li>
    <li data-pattern="[\d]+">Au moins un chiffre</li>
  </ul>
</form-validation-list>
```

The `{matched}` and `{total}` placeholders are replaced with the current count of matched rules and total rules.

## Accessibility

The component is built with accessibility in mind:

- **ARIA roles**: Component has `role="list"`, each rule has `role="listitem"`
- **ARIA live regions**: Each rule has `aria-live="polite"` to announce changes
- **ARIA described-by**: The validation list is associated with the input via `aria-describedby`
- **Existing descriptions preserved**: If the field already has `aria-describedby`, values are preserved

Screen readers announce validation requirements when users focus the input, and announce changes as rules are matched or unmatched.

## Browser validation integration

The component uses `setCustomValidity()` to participate in native form validation:

- When all rules match, custom validity is cleared
- When rules don't match, a custom validity message is set
- Form submission is prevented until all rules pass
- Works with `:valid` and `:invalid` CSS pseudo-classes
- Compatible with the Constraint Validation API

```javascript
const form = document.querySelector('form');
const field = document.getElementById('username');

form.addEventListener('submit', (e) => {
  if (!form.checkValidity()) {
    e.preventDefault();
    console.log('Validation failed:', field.validationMessage);
  }
});
```

## Real-world example

Here's a complete password validation setup:

```html
<form>
  <label for="password">Password:</label>
  <input type="password" id="password" name="password" required>

  <form-validation-list for="password">
    <ul>
      <li data-pattern=".{8,}">At least 8 characters</li>
      <li data-pattern="[A-Z]+">At least one uppercase letter</li>
      <li data-pattern="[a-z]+">At least one lowercase letter</li>
      <li data-pattern="[\d]+">At least one number</li>
      <li data-pattern="[!@#$%^&*]+">At least one special character (!@#$%^&*)</li>
    </ul>
  </form-validation-list>

  <button type="submit">Submit</button>
</form>
```

Users see exactly which requirements they've met and which they still need to satisfy.

## Progressive enhancement

The component uses light DOM, so if JavaScript fails, users still see the validation requirements as a standard list. They can read what's expected even without the visual feedback. Server-side validation ensures security regardless.

## Demo

Check out [the demo](https://aarongustafson.github.io/form-validation-list/demo/) with various examples:

<figure id="fig-2025-12-06-09" class="media-container">
  {% CodePen "https://codepen.io/aarongustafson/pen/PENDING", "result", "400" %}
</figure>

## Grab it

View the project on [GitHub](https://github.com/aarongustafson/form-validation-list). Install via npm:

```bash
npm install @aarongustafson/form-validation-list
```

Import and use:

```javascript
import '@aarongustafson/form-validation-list';
```

A modern replacement for my old jQuery validation plugin, with native form validation integration and full accessibility support.
