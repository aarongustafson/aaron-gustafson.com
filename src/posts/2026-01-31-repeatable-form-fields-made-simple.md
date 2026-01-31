---
title: "Repeatable Form Fields Made Simple"
date: 2026-01-31 00:04:36 +00:00
comments: true
tags: ["forms", "HTML", "JavaScript", "progressive enhancement", "web components", "web forms"]
description: "Need to let users add multiple email addresses, phone numbers, or other field groups? The `form-repeatable` web component handles the duplication, renumbering, and form submission automatically."
twitter_text: "Add repeatable form field groups with automatic numbering and native form participation."
series:
  name: "Modern Web Form Best Practices"
  tag: "series-forms"
  ordinal: "10"
---

Sometimes you need users to provide multiple instances of the same information—multiple email addresses, phone numbers, team members, or emergency contacts. The `form-repeatable` web component makes this straightforward, handling field duplication, automatic renumbering, and seamless form submission via the ElementInternals API.

<!-- more -->

All you need to do is provide a single field group and the component handles the rest:

```html
<form>
  <form-repeatable>
    <div>
      <label for="stop-1">Stop 1</label>
      <input id="stop-1" type="text" name="stops[]">
    </div>
  </form-repeatable>
</form>
```

The `form-repeatable` component treats its first child as a template and injects a `button` that allows users to repeat the field. When users click “Add Another” (the default “add” button text), the following happens:

1. The template is cloned,
2. Any numbers are auto-incremented (“Stop 1” → “Stop 2”, `stop-1` → `stop-2`),
3. A new group is added to the component,
4. A “remove” button is added when there’s more than the minimum number of groups (1 by default), and
5. Form values update automatically via `ElementInternals`.

That last piece is crucial. The plugin is a fully-participating member in the parent form:

- All inputs are collected and submitted automatically
- Values are added to `FormData`
- In-built form reset is respected
- A form’s disabled state is respected

No special handling required — it works like any native form control.

## Need customized buttons? You bet!

If you don’t like the default text or your site is in another language — no biggie! You can define your own button labels using the `add-label` and `remove-label` attributes:

```html
<form-repeatable add-label="Add Another Item" remove-label="Delete">
  <div>
    <label for="item-1">Item 1</label>
    <input id="item-1" type="text" name="items[]" />
  </div>
</form-repeatable>
```

With that simple change, the add button reads “Add Another Item” and each remove button reads “Delete”. To improve the experience for screen reader users, the `remove-label` value is combined with the associated label/legend to create accessible names like “Delete Item 1” which is far more helpful.

## Already have values to show? No problem.

If your form needs to start with multiple groups already filled in, just provide them as child elements:

```html
<form>
  <form-repeatable min="2">
    <div>
      <label for="phone-1">Phone 1</label>
      <input id="phone-1" type="tel" name="phones[]" value="555-0100">
    </div>
    <div>
      <label for="phone-2">Phone 2</label>
      <input id="phone-2" type="tel" name="phones[]" value="555-0101">
    </div>
    <div>
      <label for="phone-3">Phone 3</label>
      <input id="phone-3" type="tel" name="phones[]">
    </div>
  </form-repeatable>
</form>
```

All the children will become groups managed by the component and their existing values are preserved. Perfect progressive enhancement!

## Need to do something a little more complex? I got you.

You’re not limited to repeating a single field. Each group can contain multiple, related fields. Here’s an example with a `fieldset` for guest information:

```html
<form-repeatable>
  <fieldset>
    <legend>Guest 1</legend>
    <label for="guest-name-1">Name</label>
    <input id="guest-name-1" type="text" name="guest-name-1">

    <label for="guest-email-1">Email</label>
    <input id="guest-email-1" type="email" name="guest-email-1">
  </fieldset>
</form-repeatable>
```

When this gets picked up by the component, the whole `fieldset` will become the template. When users add new Guests, all of the numeric values — whether in text or attributes — increment automatically when new groups are added. So in this case, the `legend` will update, as will the `for` attribute on the `label` and `id` and `name` attributes on the `input`.

## Need to constrain the responses? You got it.

Use the `min` and `max` attributes to control the number of allowed groups:

```html
<form-repeatable
  min="2"
  max="5"
  add-label="Add Team Member"
  remove-label="Remove"
>
  <div>
    <label for="member-1">Team Member 1</label>
    <input id="member-1" type="text" name="members[]" />
  </div>
</form-repeatable>
```

This creates a component that:

- Starts with 1 member,
- Requires adding new members until the `min` threshold (2) is met,
- Cannot have fewer than 2 team members,
- Cannot have more than 5 team members, and
- Uses custom button labels.

The remove buttons are not shown when at the minimum threshold (1 by default) and the add button disappears when you hit the maximum.

## Prefer an explicit `template`? Bring it!

This component can accept a `template` element containing the fields you want to repeat. Just drop in `{n}` placeholders where you want the sequential numbers to appear:

```html
<form-repeatable>
  <template>
    <div>
      <label for="email-{n}">Email {n}</label>
      <input id="email-{n}" type="email" name="emails[]">
    </div>
  </template>
</form-repeatable>
```

When hoisted into the component, the `template` element is removed from the light DOM and used internally.

## Here’s what you need to know about styling it

The component uses Shadow DOM to encapsulate its internal structure, but you can style it using CSS parts and custom properties. It also adopts your global styles automatically.

The component uses CSS Grid by default:

- **Two columns**: Content in column 1, remove buttons aligned inline end in column 2
- **Subgrid**: Each group uses `subgrid` to align with parent grid
- **Add button**: Appears below all groups

You can use CSS parts to style the buttons and field groups. Here are some examples:

```css
/* Style all buttons */
form-repeatable::part(button) {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

/* Style the add button */
form-repeatable::part(add-button) {
  background: #28a745;
  color: white;
}

/* Style remove buttons */
form-repeatable::part(remove-button) {
  background: #dc3545;
  color: white;
}

/* Customize the grid layout */
form-repeatable::part(groups) {
  grid-template-columns: 1fr auto;
  gap: 1rem;
}

/* Style each group */
form-repeatable::part(group) {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}
```

Available parts:

- `groups` - Container for all groups (CSS grid by default)
- `group` - Each repeatable group wrapper
- `content` - Container for group’s fields
- `group-controls` - Container for the remove button
- `controls` - Container for the add button
- `button` - All buttons
- `add-button` - The add button
- `remove-button` - All remove buttons

## Want to keep a watchful eye? You’re extra, but sure.

You can listen for when groups are added or removed and run your own custom code:

```javascript
const repeatable = document.querySelector("form-repeatable");

repeatable.addEventListener("form-repeatable:added", (event) => {
  console.log("Group added. Total groups:", event.detail.groupCount);
});

repeatable.addEventListener("form-repeatable:removed", (event) => {
  console.log("Group removed. Total groups:", event.detail.groupCount);
});
```

## Go with the progressive enhancement flow

If JavaScript fails, users see the initial field group(s) and can fill them in. They can't add more, but nothing breaks. Make sure your minimum count accommodates users without JavaScript.

## Demo

Explore [the demo](https://aarongustafson.github.io/form-repeatable/demo/) with various examples:

<figure id="fig-2025-12-06-07" class="media-container">
<fullscreen-control class="talk__slides__embed video-embed__video">
<iframe src="https://aarongustafson.github.io/form-repeatable/demo/" class="talk__slides__embed video-embed__video" frameborder="0"></iframe>
</fullscreen-control>
</figure>

## Grab it now

Check out the project on [GitHub](https://github.com/aarongustafson/form-repeatable). Install via npm:

```bash
npm install @aarongustafson/form-repeatable
```

Import and go:

```javascript
import "@aarongustafson/form-repeatable";
```

This single component instance manages all your repeatable field groups with native form participation — no framework required.
