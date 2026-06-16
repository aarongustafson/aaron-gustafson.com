---
title: "Easy Data-entry Verification with a Web Component"
date: 2026-05-25 22:23:24 +00:00
comments: true
tags:
  [
    "accessibility",
    "forms",
    "HTML",
    "JavaScript",
    "progressive enhancement",
    "web components",
    "web forms",
  ]
description: "Confirming values like email addresses and passwords is a common form need. The `form-matching-fields` web component injects the necessary validation without stomping on browser-native validation using `required`, `pattern`, and such."
twitter_text: "Need two form fields to match? `form-matching-fields` adds simple validation for confirmation fields."
series:
  name: "Modern Web Form Best Practices"
  tag: "series-forms"
  ordinal: "7th"
---

Sometimes the simplest form pattern is the one you repeat <i lang="la">ad infinitum</i>: “Type it once, then type it again.” We do it for password confirmations, email verification, and any flow where a typo creates expensive follow-up work. I released a small web component to handle that pattern cleanly: [`form-matching-fields`](https://github.com/aarongustafson/form-matching-fields).

<!-- more -->

The component wraps two related form fields and adds validation to ensure they match. It’s intentionally additive, which means it works with native browser validation rather than trying to replace it.

## Wrap and go

The API is intentionally simple:

```html
<form-matching-fields>
  <label for="password">Password</label>
  <input id="password" type="password" required />

  <label for="password-again">Password again</label>
  <input id="password-again" type="password" required />
</form-matching-fields>
```

The component evaluates the first two eligible text-type inputs it contains and applies mismatch validation to the second one when both fields have values.

## What counts as an eligible field?

To keep behavior predictable, the component only considers descendant `input` elements of these types:

- text
- email
- password
- search
- tel
- url

It ignores `disabled` and `readonly` controls, which helps prevent false positives when you have conditional or locked fields in the same wrapper.

## Validation behavior that plays nicely

One of the core goals here was to avoid stepping on existing validation rules. In practice, that means:

- If the second field already has a native validation issue (like `required` or `type` mismatch), this component won’t mask it.
- If the second field already has a custom validity message, this component won’t overwrite that either.
- It only clears mismatch errors that it set itself.

That last point is especially useful in larger forms where multiple constraints overlap. You don’t want one helper trying to be the sole source of truth.

## Customizing the validation message

By default, the component uses this template for the validation message:

> The fields “{label_1}” and “{label_2}” should match

It smartly resolves the labels (`{label_1}` and `{label_2}`) from your markup in this order:

1. associated `<label for>` text
2. wrapping `<label>` text
3. `aria-label`
4. `name`
5. `id`

You can override it with the `validation-message` attribute:

```html
<form-matching-fields
  validation-message="Please ensure {label_2} matches {label_1}."
>
  <label for="email">Email</label>
  <input id="email" type="email" required />

  <label for="verify-email">Verify email</label>
  <input id="verify-email" type="email" required />
</form-matching-fields>
```

In most forms, that gives you a clear error message without extra setup.

## Demo

I put together [a demo of the web component](https://aarongustafson.github.io/form-matching-fields/demo/) over on GitHub:

<figure class="media-container">
<fullscreen-control class="talk__slides__embed video-embed__video">
<iframe src="https://aarongustafson.github.io/form-matching-fields/demo/" class="talk__slides__embed video-embed__video" frameborder="0"></iframe>
</fullscreen-control>
</figure>

## Grab it

You can explore the source, file issues, and suggest enhancements in [the `form-matching-fields` repository](https://github.com/aarongustafson/form-matching-fields).
