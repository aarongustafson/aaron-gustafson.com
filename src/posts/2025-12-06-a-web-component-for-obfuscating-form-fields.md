---
title: "A Web Component for Obfuscating Form Fields"
date: 2025-12-06 20:03:47 +00:00
comments: true
tags: ["forms", "HTML", "JavaScript", "progressive enhancement", "web components", "web forms", "security"]
description: "There’s no standard way to make a field readable while editing but obfuscated at rest. The `form-obfuscator` web component fills that gap, giving you control over how sensitive data appears when fields aren't focused."
twitter_text: "Need to obfuscate form field values when they’re not being edited? Here’s a web component for that."
series:
  name: "Modern Web Form Best Practices"
  tag: "series-forms"
  ordinal: "8"
---

We have the password reveal pattern for passwords, but what about other sensitive fields that need to be readable while editing and obfuscated while at rest? The `form-obfuscator` web component does exactly that.

<!-- more -->

## Basic usage

Wrap any text field in the component and it will automatically obfuscate the value when the field loses focus:

```html
<form-obfuscator>
  <label for="secret-key-1">What was your first pet’s name?</label>
  <input type="text" id="secret-key-1" name="secret-key-1">
</form-obfuscator>
```

When users click into the field, they see the actual value. When they click away, it’s replaced with asterisks (*). The real value is preserved in a hidden field for form submission.

## Custom obfuscation characters

If you don’t like asterisks, you can specify any character you like:

```html
<form-obfuscator character="•">
  <label for="account">Account Number</label>
  <input type="text" id="account" name="account">
</form-obfuscator>
```

Or get creative:

```html
<form-obfuscator character="🤐">
  <label for="ssn">Social Security Number</label>
  <input type="text" id="ssn" name="ssn">
</form-obfuscator>
```

## Pattern-based obfuscation

Sometimes you want to show part of the value while hiding the rest. The `pattern` attribute lets you specify which characters to keep visible:

```html
<form-obfuscator pattern="\d{4}$">
  <label for="ssn">Social Security Number</label>
  <input type="text" id="ssn" name="ssn">
</form-obfuscator>
```

This keeps the last four digits visible while replacing everything else with your obfuscation character. Perfect for Social Security Numbers, credit cards, or phone numbers where showing the last few digits helps users confirm they’ve entered the right value.

## Limiting displayed characters

Use the `maxlength` attribute to cap how many characters appear when obfuscated:

```html
<form-obfuscator maxlength="4">
  <label for="password">Password</label>
  <input type="text" id="password" name="password">
</form-obfuscator>
```

Even if the user enters a 20-character value, only four asterisks will be displayed when the field is obfuscated. This prevents giving away information about the length of the information entered.

## Custom replacement functions

For complete control, you can provide a JavaScript function via the `replacer` attribute:

```html
<script>
  window.emailReplacer = function() {
    var username = arguments[0][1];
    var domain = arguments[0][2];
    return username.replace(/./g, '*') + domain;
  }
</script>

<form-obfuscator 
  pattern="^(.*?)(@.+)$"
  replacer="return emailReplacer(arguments)">
  <label for="email">Email Address</label>
  <input type="text" id="email" name="email" value="user@example.com">
</form-obfuscator>
```

This example uses a pattern to separate the username from the domain, then obfuscates only the username portion, leaving `@example.com` visible.

Here's another practical example for credit cards:

```html
<script>
  function cardNumberReplacer() {
    var beginning = arguments[0][1];
    var final_digits = arguments[0][2];
    return beginning.replace(/\d/g, '*') + final_digits;
  }
</script>

<form-obfuscator
  pattern="^((?:[\d]+\-)+)(\d+)$"
  replacer="return cardNumberReplacer(arguments)">
  <label for="cc">Credit Card</label>
  <input type="text" id="cc" name="cc" value="1234-5678-9012-3456">
</form-obfuscator>
```

This displays as `****-****-****-3456`, showing only the last group of digits.

## Combining attributes

You can combine these attributes for sophisticated obfuscation patterns:

```html
<form-obfuscator 
  pattern="\d{4}$" 
  character="•" 
  maxlength="16">
  <label for="card">Credit Card</label>
  <input type="text" id="card" name="card">
</form-obfuscator>
```

This keeps the last 4 digits visible, uses bullets for obfuscation, and limits the display to 16 characters total.

## Event handling

The component dispatches custom events when values are hidden or revealed:

```javascript
const obfuscator = document.querySelector('form-obfuscator');

obfuscator.addEventListener('form-obfuscator:hide', (e) => {
  console.log('Field obfuscated:', e.detail.field.value);
});

obfuscator.addEventListener('form-obfuscator:reveal', (e) => {
  console.log('Field revealed:', e.detail.field.value);
});
```

You can access both the visible field and the hidden field through `event.detail.field` and `event.detail.hidden` respectively.

## How it works

The component creates a hidden `input` field to store the actual value for form submission. When the visible field loses focus, it:

1. Copies the current value to the hidden field
2. Applies your obfuscation rules to create the display value
3. Updates the visible field with the obfuscated value
4. Dispatches the `form-obfuscator:hide` event

When the field gains focus, it:

1. Restores the real value from the hidden field
2. Updates the visible field
3. Dispatches the `form-obfuscator:reveal` event

The source order ensures the hidden field is the one that gets submitted with the form.

## Progressive enhancement

The component makes no assumptions about your markup—it works with any text-style `input` element. If JavaScript fails to load, the field behaves like a normal `input`, which is exactly what you want. Users can still enter and submit values; they just won’t get the obfuscation behavior.

## Demo

I’ve created [a comprehensive demo page showing the various configuration options](https://aarongustafson.github.io/form-obfuscator/demo/) over on GitHub:

<figure class="video-embed video-embed--4x3">
<fullscreen-control class="talk__slides__embed video-embed__video">
<iframe src="https://aarongustafson.github.io/form-obfuscator/demo/" class="talk__slides__embed video-embed__video" frameborder="0"></iframe>
</fullscreen-control>
</figure>

## Grab it

Check out the full project over on [GitHub](https://github.com/aarongustafson/form-obfuscator) or install via `npm`:

```bash
npm install @aarongustafson/form-obfuscator
```

Import and use:

```javascript
import '@aarongustafson/form-obfuscator';
```

No dependencies, just a straightforward way to add field obfuscation to your forms.
