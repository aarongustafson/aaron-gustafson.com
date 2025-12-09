---
title: "Repeatable Form Fields Made Simple"
date: 2025-12-06 10:00:00 -07:00
comments: true
tags: ["forms", "HTML", "JavaScript", "progressive enhancement", "web components", "web forms"]
description: "Need to let users add multiple email addresses, phone numbers, or other field groups? The form-repeatable web component handles the duplication, renumbering, and form submission automatically."
twitter_text: "Add repeatable form field groups with automatic numbering and native form participation."
series:
  name: "Modern Web Form Best Practices"
  tag: "series-forms"
  ordinal: "10"
---

Sometimes you need users to provide multiple instances of the same information—multiple email addresses, phone numbers, team members, or emergency contacts. The `form-repeatable` web component makes this straightforward, handling field duplication, automatic renumbering, and seamless form submission via the ElementInternals API.

<!-- more -->

## Basic usage

Provide a single field group and the component handles the rest:

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

The component uses the first child as a template. When users click "Add Another":
1. The template is cloned
2. Numbers are incremented ("Stop 1" → "Stop 2", `stop-1` → `stop-2`)
3. The new group is added to the component
4. Remove buttons appear when there's more than the minimum
5. Form values update automatically via ElementInternals

All groups are managed internally in Shadow DOM, with native form participation handling submission.

## Progressive enhancement with pre-populated groups

Provide multiple initial groups and the component moves them into Shadow DOM:

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

All child elements become groups managed by the component. Existing values are preserved.

## Multiple fields per group

Each group can contain multiple related fields:

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

All numeric values in labels, IDs, `for` attributes, and `name` attributes increment automatically when new groups are added ("Guest 1" → "Guest 2", etc.).

## Explicit templates with placeholders

Instead of using the first child, provide a `<template>` element with `{n}` placeholders:

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

The `{n}` placeholders are replaced with sequential numbers (1, 2, 3, etc.). The template element is removed from the light DOM and used internally.

## Min/max constraints

Control the number of allowed groups:

```html
<form-repeatable min="2" max="5" add-label="Add Team Member" remove-label="Remove Member">
  <div>
    <label for="member-1">Team Member 1</label>
    <input id="member-1" type="text" name="members[]">
  </div>
</form-repeatable>
```

This creates a component that:
- Starts with 1 group (allows adding until min is met)
- Cannot have fewer than 2 groups
- Cannot have more than 5 groups
- Uses custom button labels

Remove buttons are hidden when at minimum; the add button is hidden when at maximum.

## Custom button labels

Provide context-appropriate labels:

```html
<form-repeatable add-label="Add Item" remove-label="Delete Item">
  <div>
    <label for="item-1">Item 1</label>
    <input id="item-1" type="text" name="items[]">
  </div>
</form-repeatable>
```

The `remove-label` is combined with the first label/legend text to create accessible names like "Delete Item Item 1" for screen readers.

## Events

Listen for when groups are added or removed:

```javascript
const repeatable = document.querySelector('form-repeatable');

repeatable.addEventListener('form-repeatable:added', (event) => {
  console.log('Group added. Total groups:', event.detail.groupCount);
});

repeatable.addEventListener('form-repeatable:removed', (event) => {
  console.log('Group removed. Total groups:', event.detail.groupCount);
});
```

## Styling with CSS parts

The component exposes parts for styling:

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

/* Style each group */
form-repeatable::part(group) {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

/* Customize the grid layout */
form-repeatable::part(groups) {
  grid-template-columns: 1fr auto;
  gap: 1rem;
}
```

Available parts:
- `groups` - Container for all groups (CSS grid by default)
- `group` - Each repeatable group wrapper
- `content` - Container for group's fields
- `group-controls` - Container for remove button
- `controls` - Container for add button
- `button` - All buttons
- `add-button` - The "Add Another" button
- `remove-button` - Remove buttons

## Default grid layout

The component uses CSS Grid by default:

- **Two columns**: Content in column 1, remove buttons aligned right in column 2
- **Subgrid**: Each group uses `subgrid` to align with parent grid
- **Add button**: Appears below all groups

Global stylesheets are automatically adopted into the Shadow DOM, so your page styles apply to elements inside the component.

## Form participation

The component uses the **ElementInternals API** for native form participation:

- All inputs are collected and submitted automatically
- Values are added to FormData
- Supports native form reset
- Respects form disabled state

No special handling required—it works like any native form control.

## How it works

The component uses a single-instance architecture:

1. Parses the first child or `<template>` to create a reusable template
2. Detects numeric patterns using regex and converts to `{n}` placeholders
3. Moves all light DOM children into Shadow DOM as initial groups
4. Clones the template and replaces `{n}` with sequential numbers when adding groups
5. Removes groups and renumbers remaining ones sequentially (1, 2, 3...)
6. Collects all inputs and updates FormData via ElementInternals

## Real-world example

Here's a complete event registration form combining regular fields with repeatable attendee groups:

```html
<form id="event-form">
  <label for="event-name">Event Name</label>
  <input id="event-name" name="eventName" type="text" required>

  <label for="event-date">Date</label>
  <input id="event-date" name="eventDate" type="date" required>

  <fieldset>
    <legend>Attendees</legend>
    <form-repeatable min="1" max="10">
      <div>
        <label for="attendee-1">Attendee 1</label>
        <input id="attendee-1" type="text" name="attendees[]" required>
        
        <label for="email-1">Email 1</label>
        <input id="email-1" type="email" name="emails[]">
      </div>
    </form-repeatable>
  </fieldset>

  <button type="submit">Register</button>
</form>
```

All values—both regular fields and repeatable groups—are combined into a single FormData object automatically.

## Progressive enhancement

If JavaScript fails, users see the initial field group(s) and can fill them in. They can't add more, but nothing breaks. Make sure your minimum count accommodates users without JavaScript.

## Demo

Explore [the demo](https://aarongustafson.github.io/form-repeatable/demo/) with various examples:

<figure id="fig-2025-12-06-07" class="media-container">
<fullscreen-control class="talk__slides__embed video-embed__video">
<iframe src="https://aarongustafson.github.io/form-repeatable/demo/" class="talk__slides__embed video-embed__video" frameborder="0"></iframe>
</fullscreen-control>
</figure>

## Grab it

Check out the project on [GitHub](https://github.com/aarongustafson/form-repeatable). Install via npm:

```bash
npm install @aarongustafson/form-repeatable
```

Import and use:

```javascript
import '@aarongustafson/form-repeatable';
```

A single component instance manages all your repeatable field groups with native form participation—no framework required.
