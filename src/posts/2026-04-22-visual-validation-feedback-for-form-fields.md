---
title: "Visual Validation Feedback for Form Fields"
date: 2026-04-22 20:17:47 +00:00
last_updated_at: 2026-04-30 00:00:00 +00:00
comments: true
tags:
  [
    "web components",
    "progressive enhancement",
    "forms",
    "HTML",
    "JavaScript",
    "web forms",
    "user experience",
  ]
description: "The `form-validation-list` web component provides real-time visual feedback on validation requirements, showing users which rules they have satisfied as they type."
twitter_text: "New #WebComponent: Show users which validation requirements they’ve met—as they type."
series:
  name: "Modern Web Form Best Practices"
  tag: "series-forms"
  ordinal: "12th"
---

Password requirements, username rules, and format constraints tend to pile up fast. Too often, people only learn whether they met them after they hit submit. The `form-validation-list` web component changes that by providing real-time feedback as someone types, showing exactly which requirements are met, and which still need work.

<!-- more -->

<ins datetime="2026-04-30T00:00:00+00:00">**Update:** This post has been refreshed to cover the component’s current loading options, throttled input behavior, accessibility model, and localization hooks.</ins>

This is a modern replacement for my old [jQuery Easy Validation Rules](https://github.com/easy-designs/jquery.easy-validation-rules.js) plugin, reimagined as a web component with native form validation integration.

<hr>

To get started, associate the component with an `input` element using the `for` attribute and define your validation rules:

```html
<form>
  <label for="username">Username:</label>
  <input type="text" id="username" name="username" required />

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

By default, validation runs on the `input` event with a 250ms throttle. Matched rules get a checkmark (✓), unmatched rules get an X (✗), and while someone is typing the component announces a concise progress summary instead of repeatedly re-reading the whole rule list. When all rules match, the field is valid and the form can be submitted.

## What’s happening under the hood?

The component:

1. Associates with an input via the `for` attribute (just like a `label` element)
2. Finds all elements with `data-pattern` attributes
3. Tests the input value against each pattern when the configured trigger fires
4. Adds `validation-matched` or `validation-unmatched` classes and visual indicators accordingly
5. Inserts localized, visually hidden state text once the field has a value
6. Updates a single polite live region while users type
7. Uses `setCustomValidity()` to integrate with native form validation
8. Prevents form submission until all rules match

The cascade animation, controlled by `each-delay`, adds a subtle sequential effect as rules are checked. Small detail, meaningful feedback.

## Whose rules? Your rules.

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

Each pattern is a standard JavaScript regular expression. The component tests the `input` value against all patterns on the configured trigger, using throttled `input` events by default.

## Input event too noisy? No worries.

By default, validation runs on the `input` event with a 250ms throttle. If you want immediate feedback while typing, set `input-throttle="0"`. If you’d rather wait until the field loses focus, switch the `trigger-event` to `"blur"`:

```html
<form-validation-list for="email" trigger-event="blur">
  <ul>
    <li data-pattern=".+@.+">Contains @ symbol</li>
    <li data-pattern=".+@.+\..+">Valid email format</li>
  </ul>
</form-validation-list>
```

With this attribute in place, validation runs immediately when the field loses focus. In this mode, `input-throttle` is ignored and the component keeps the full criteria list available to assistive technology while someone types.

## Wanna adjust the cascade delay? Go for it.

Use the `each-delay` attribute to control the delay between checking each rule. The default speed is 150ms, but you can tune it to any number of milliseconds:

```html
<form-validation-list for="password" each-delay="100">
  <!-- rules -->
</form-validation-list>
```

Set it to “0” to remove the cascade effect entirely and check all rules simultaneously.

## Need full design control? You got it.

If you want full design control over the component, you can absolutely have it. The whole component operates in light DOM, so your styles will pierce through. And you can customize `class` names for integration with CSS frameworks using a set of attributes on the `form-validation-list` element. The `field-valid-class` and `field-invalid-class` attributes control the class names applied to the `input` field itself, while the `rule-matched-class` and `rule-unmatched-class` attributes control the `class` names applied to each rule item.

Here’s a complete example:

```html
<style>
  .is-valid {
    border-color: green;
  }
  .is-invalid {
    border-color: red;
  }
  .rule-pass {
    color: green;
  }
  .rule-fail {
    color: red;
  }
</style>

<form-validation-list
  for="username"
  field-valid-class="is-valid"
  field-invalid-class="is-invalid"
  rule-matched-class="rule-pass"
  rule-unmatched-class="rule-fail"
>
  <ul>
    <li data-pattern=".{5,}">At least 5 characters</li>
    <li data-pattern="[!@#]+">Special char (!@#)</li>
  </ul>
</form-validation-list>
```

This approach lets you use `class` names that match your existing CSS architecture instead of making one small component dictate terms to the rest of your styles.

You can also override the per-instance icon glyphs with the `rule-matched-icon` and `rule-unmatched-icon` attributes, or control the shared visual styling using CSS custom properties:

- `--rule-matched-icon` - Content for matched state (default: “✓”)
- `--rule-unmatched-icon` - Content for unmatched state (default: “✗”)
- `--rule-icon-size` - Size of icons (default: 1em)
- `--rule-matched-color` - Color for matched rules (default: green)
- `--rule-unmatched-color` - Color for unmatched rules (default: red)

The older `--validation-*` custom property names are still supported as legacy aliases.

Here’s an example of that:

```css
form-validation-list {
  --rule-matched-icon: "✅";
  --rule-unmatched-icon: "❌";
  --rule-icon-size: 1.2em;
  --rule-matched-color: #28a745;
  --rule-unmatched-color: #dc3545;
}
```

## TypeScript or framework project? You’re covered.

The package now ships with bundled type definitions and reflects its core properties and attributes in both directions. That makes it a much better fit for TypeScript, JSX, SSR, and declarative framework setups where properties may be assigned before the custom element upgrades.

## Bit of a control freak? There’s an API.

If you really want to get into the weeds, you can also listen for validation changes in your JavaScript code:

```javascript
const validationList = document.querySelector("form-validation-list");

validationList.addEventListener("form-validation-list:validated", (event) => {
  const { isValid, matchedRules, totalRules, field } = event.detail;
  console.log(`Matched ${matchedRules} of ${totalRules} rules`);
  console.log(`Field is ${isValid ? "valid" : "invalid"}`);
});
```

The event fires after validation completes and gives you the current state. Nice and tidy.

You can also manually trigger validation and check the element’s current state at any time:

```javascript
const validationList = document.querySelector("form-validation-list");

// Trigger validation
const isValid = validationList.validate();
console.log("Is valid:", isValid);

// Check current state
console.log("Current state:", validationList.isValid);
```

## Global site? <i lang="es">Relájese.</i>

If you need the component to work in different languages, that’s totally doable. You can customize three separate pieces of copy: the browser validation message (`validation-message`), the live summary announced while typing (`announcement`), and the per-rule hidden status text (`rule-matched-alt` and `rule-unmatched-alt`). All of the message templates support the `{matched}` and `{total}` placeholders:

```html
<!-- Spanish -->
<form-validation-list
  for="contrasena"
  announcement="{matched} de {total} criterios cumplidos"
  rule-matched-alt="Criterio cumplido"
  rule-unmatched-alt="Criterio pendiente"
  validation-message="Por favor, cumple todos los requisitos ({matched} de {total})"
>
  <ul>
    <li data-pattern="[A-Z]+">Al menos una letra mayúscula</li>
    <li data-pattern="[a-z]+">Al menos una letra minúscula</li>
    <li data-pattern="[\d]+">Al menos un número</li>
  </ul>
</form-validation-list>

<!-- French -->
<form-validation-list
  for="mot-de-passe"
  announcement="{matched} critères satisfaits sur {total}"
  rule-matched-alt="Critère satisfait"
  rule-unmatched-alt="Critère non satisfait"
  validation-message="Veuillez satisfaire à toutes les exigences ({matched} sur {total})"
>
  <ul>
    <li data-pattern="[A-Z]+">Au moins une lettre majuscule</li>
    <li data-pattern="[a-z]+">Au moins une lettre minuscule</li>
    <li data-pattern="[\d]+">Au moins un chiffre</li>
  </ul>
</form-validation-list>
```

## Is it a progressive enhancement? Heck yeah!

The component uses light DOM, so if JavaScript fails, users still see the validation requirements as a standard list. They can read what is expected even without the visual feedback. Your server-side validation still does the important enforcement work regardless… right? _Right?_

## Is it screen reader accessible? Yep.

The component is built with accessibility in mind:

- **Proper description support**: The validation list is automatically associated with the `input` via `aria-describedby`, and if the field already has `aria-describedby`, the original value is preserved.
- **A concise announcement model**: With the default `trigger-event="input"`, the component temporarily suspends the full criteria list from `aria-describedby` while someone types and uses a single polite live region to announce progress instead.
- **State restoration on blur**: When focus leaves the field, any pending validation timeouts are cleared and the full criteria list is restored so returning to the field announces the final criteria state.
- **Localized rule state**: Once the field has a value, each rule gets visually hidden localized state text in the DOM, which is more robust than relying on CSS-generated content alone.

If you have suggestions for other ways to improve the accessibility of this component, please [open an issue on GitHub](https://github.com/aarongustafson/form-validation-list/issues).

## Does it integrate with the browser’s validation engine? Naturally.

The component uses `setCustomValidity()` to participate in native form validation:

- When all rules match, custom validity is cleared
- When rules don’t match, a custom validity message is set
- Form submission is prevented until all rules pass
- Works with `:valid` and `:invalid` CSS pseudo-classes
- Compatible with the Constraint Validation API

```javascript
const form = document.querySelector("form");
const field = document.getElementById("username");

form.addEventListener("submit", (e) => {
  if (!form.checkValidity()) {
    e.preventDefault();
    console.log("Validation failed:", field.validationMessage);
  }
});
```

## Here’s a real-world example

Here’s a complete password validation setup:

```html
<form>
  <label for="password">Password:</label>
  <input type="password" id="password" name="password" required />

  <form-validation-list for="password">
    <ul>
      <li data-pattern=".{8,}">At least 8 characters</li>
      <li data-pattern="[A-Z]+">At least one uppercase letter</li>
      <li data-pattern="[a-z]+">At least one lowercase letter</li>
      <li data-pattern="[\d]+">At least one number</li>
      <li data-pattern="[!@#$%^&*]+">
        At least one special character (!@#$%^&*)
      </li>
    </ul>
  </form-validation-list>

  <button type="submit">Submit</button>
</form>
```

Users see exactly which requirements they have met, and which they still need to satisfy. That is usually a lot kinder than springing the whole list on them after submit.

## Play with it

Check out [the demo](https://aarongustafson.github.io/form-validation-list/demo/) with various examples:

<figure id="fig-2025-12-06-09" class="media-container">
<fullscreen-control class="talk__slides__embed video-embed__video">
<iframe src="https://aarongustafson.github.io/form-validation-list/demo/" class="talk__slides__embed video-embed__video" frameborder="0"></iframe>
</fullscreen-control>
</figure>

## Grab it

View the project on [GitHub](https://github.com/aarongustafson/form-validation-list).

Install via `npm`:

```bash
npm install @aarongustafson/form-validation-list
```

For most projects, import the guarded auto-definition helper:

```javascript
import "@aarongustafson/form-validation-list/define.js";
```

If you want to control the tag name yourself, import `FormValidationListElement` and register it manually.

If you give it a spin, I’d love to hear how it works in your forms. Happy validating!