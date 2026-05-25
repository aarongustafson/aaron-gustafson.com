---
title: "Matching Form Fields with a Web Component"
date: 2026-05-25 10:00:00 -07:00
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
description: "Confirming values like email addresses and passwords is a common form need. The `form-matching-fields` web component adds additive validation to ensure two fields match, without replacing native validation."
twitter_text: "Need two form fields to match? `form-matching-fields` adds additive validation for confirmation fields without replacing native validation."
series:
  name: "Modern Web Form Best Practices"
  tag: "series-forms"
  ordinal: "7"
---

Sometimes the simplest form pattern ends up being the one you repeat ad infinitum: “Type it once, then type it again.” We do it for password confirmations, email verification, and any flow where a typo can create expensive follow-up work. This week I released a small web component to handle that pattern cleanly: [`form-matching-fields`](https://github.com/aarongustafson/form-matching-fields).

<!-- more -->

The component wraps two related form fields and adds validation to ensure they match. It’s intentionally additive, which means it works with native browser validation rather than trying to replace it.

## Basic usage

At its core, usage is straightforward:

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

To keep behavior predictable, the component only considers descendant inputs of these types:

- `text`
- `email`
- `password`
- `search`
- `tel`
- `url`

It ignores `disabled` and `readonly` controls, which helps prevent false positives when you have conditional or locked fields in the same wrapper.

## Validation behavior that plays nicely

One of the core goals here was to avoid stepping on existing validation rules. In practice, that means:

- If the second field already has a native validation issue (like `required` or `type` mismatch), this component won’t replace it.
- If the second field already has a custom validity message, this component won’t overwrite that either.
- It only clears mismatch errors that it set itself.

That last point is especially useful in larger forms where multiple constraints can overlap. You don’t want one helper trying to be the sole source of truth.

## Customizing the validation message

By default, the component uses this template:

> The fields “{label_1}” and “{label_2}” should match

You can override it with the `validation-message` attribute:

```html
<form-matching-fields
  validation-message="Please make sure {label_2} matches {label_1}."
>
  <label for="email">Email</label>
  <input id="email" type="email" required />

  <label for="verify-email">Verify email</label>
  <input id="verify-email" type="email" required />
</form-matching-fields>
```

When replacing `{label_1}` and `{label_2}`, the component resolves labels in this order:

1. associated `<label for>` text
2. wrapping `<label>` text
3. `aria-label`
4. `name`
5. `id`

In most forms, that gives you a clear error message without requiring extra setup.

## Demo

I put together [a demo of the web component](https://aarongustafson.github.io/form-matching-fields/demo/) over on GitHub:

<figure class="video-embed video-embed--4x3">
<fullscreen-control class="talk__slides__embed video-embed__video">
<iframe src="https://aarongustafson.github.io/form-matching-fields/demo/" class="talk__slides__embed video-embed__video" frameborder="0"></iframe>
</fullscreen-control>
</figure>

## Grab it

You can explore the source, file issues, and suggest enhancements in [the `form-matching-fields` repository](https://github.com/aarongustafson/form-matching-fields).
