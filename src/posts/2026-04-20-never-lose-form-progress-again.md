---
title: "Never Lose Form Progress Again"
date: 2026-04-20 23:59:08 +00:00
comments: true
tags:
  [
    "web components",
    "forms",
    "HTML",
    "JavaScript",
    "progressive enhancement",
    "web forms",
    "user experience",
  ]
description: "Browsers crash. Tabs close. Life happens. Here’s a web component that saves form progress so your users don’t have to start over from scratch."
twitter_text: "Browsers crash. Tabs close. Life happens. Here’s a web component that saves form progress so your users don’t have to start over from scratch."
series:
  name: "Modern Web Form Best Practices"
  tag: "series-forms"
  ordinal: "11th"
---

Few things are more annoying than losing your progress halfway through a form. Maybe the browser crashes. Maybe the tab gets closed. Maybe your kid yells from the other room and you come back three hours later wondering why you ever thought now was a good time to fill out a mortgage application. Whatever the cause, `form-saver` makes those interruptions a lot less obnoxious. Which is nice, because forms are usually annoying enough on their own.

<!-- more -->

At its core, `form-saver` is a small web component that wraps a form, keeps an eye on it, stores values in `localStorage`, and restores them when the page loads again. Better yet, it clears out saved data after a successful submission so you’re not accidentally resurrecting stale information the next time someone stops by. Nobody wants yesterday’s half-finished support request shambling back to life.

## Basic usage

All you need to do is wrap your form in the component:

```html
<form-saver>
  <form action="/contact" method="post">
    <label>
      Name
      <input name="name" autocomplete="name" />
    </label>
    <label>
      Email
      <input name="email" type="email" autocomplete="email" />
    </label>
    <label>
      Message
      <textarea name="message"></textarea>
    </label>
    <button type="submit">Send</button>
  </form>
</form-saver>
```

That’s it. The component targets the first descendant `form`, saves values as users type or make changes, and restores them when they come back. No extra plumbing. Just a form with a slightly better memory than most of us have before coffee — depending on the day, that may not be a terribly high bar, but still.

This is especially handy for forms that are a little more involved than a simple email signup. Job applications, checkout flows, support requests, and multi-question onboarding forms all benefit from a little resilience. So do the people filling them out, who generally have better things to do than retype the same answers because a tab got squirrelly.

## What actually gets saved?

`form-saver` supports the controls most of us reach for every day:

- Text-style `input` fields
- `textarea` elements, 
- `select` elements (including multi-selects), and  
- `checkbox` and `radio` controls.

File inputs are intentionally excluded.

Because the component works in light DOM, your form remains your form. Your labels, validation, layout, and CSS continue to work exactly as they did before. `form-saver` just adds a bit of memory and, ideally, cuts down on a few muttered curses.

## Want to keep a few fields after submit?

In many cases, clearing everything after a successful submission is the right call. Sometimes, though, it makes sense to keep a few details around. Maybe you want to preserve a visitor’s name and email address on a contact form while clearing the message body. That way they do not have to keep retyping the boring bits. Nobody wakes up excited to enter their email address for the fourth time.

That is what the `retain` attribute is for:

```html
<form-saver retain="name email">
  <form action="/contact" method="post">
    …
  </form>
</form-saver>
```

After a successful submission, `name` and `email` stick around, but `message` gets cleared. Simple, sensible, and less likely to leave someone staring at your form like it just betrayed them personally.

## Better yet, let users decide

Persisting form data can be incredibly helpful, but there is a human side to this too. Just because we *can* keep someone’s information around does not necessarily mean we *should* do it without asking. That is where `retain-choice` comes in. It lets you be useful without getting presumptuous.

Add it alongside `retain` and `form-saver` will inject an opt-in checkbox for the user. Nice and easy:

```html
<form-saver
  retain="name email"
  retain-choice
  retain-choice-label="Store my contact information for later"
>
  <form action="/contact" method="post">
    …
  </form>
</form-saver>
```

By default, that checkbox is inserted just before the first submit control. If the user leaves it unchecked, the retained fields are cleared along with everything else after submit. If they opt in, those selected fields remain. Their call, as it should be. Gotta love a little informed consent.

Need to place that control somewhere more appropriate in your layout? Use `retain-choice-container` to point to a CSS selector:

```html
<form-saver
  retain="name email"
  retain-choice
  retain-choice-label="Remember my details next time"
  retain-choice-container=".form-footer"
>
  <form action="/contact" method="post">
    …
    <div class="form-footer">
      <button type="submit">Send</button>
    </div>
  </form>
</form-saver>
```

That gives you a lot more control over the experience without making you build the retention UI yourself.

## Need a custom storage key?

By default, `form-saver` derives its storage key from the wrapped form’s method and action, which is usually exactly what you want. It keeps different forms from stepping on one another and keeps the setup nice and boring. Boring is good.

If you need something more explicit, you can provide your own `storage-key`:

```html
<form-saver storage-key="checkout:shipping-address">
  <form action="/checkout/shipping" method="post">
    <label>
      Street Address
      <input name="street-address" autocomplete="street-address" />
    </label>
    <label>
      Postal Code
      <input name="postal-code" autocomplete="postal-code" />
    </label>
    <button type="submit">Continue</button>
  </form>
</form-saver>
```

This is useful when a form’s URL is not stable or when you want multiple views to intentionally share the same saved state. Sometimes explicit is just easier. Sometimes it is the only way to stay sane.

## Want to drive it yourself?

If you need more direct control, the component exposes a few methods:

```javascript
const saver = document.querySelector("form-saver");

// Persist the current state
saver.saveFormState();

// Restore previously saved values
saver.restoreFormState();

// Clear out anything stored for this form
saver.clearSavedData();
```

That can be useful when you want to pair it with your own UI, analytics, or some custom workflow around save and restore. Or when you just like being the one driving and do not fully trust anything labeled “automatic.”

## Progressive enhancement, as usual

This component follows a pattern I am always going to favor: start with a perfectly ordinary form, then layer on the enhancement. If JavaScript fails, the form still works. Users can still fill it out and submit it. They just will not get the recovery behavior. Annoying, perhaps, but not catastrophic. And that is very much the point.

That’s a pretty good trade-off.

And because saved values are only cleared after a successful submit flow, you do not lose everything just because client-side validation blocked submission or some other script got clever at exactly the wrong moment. That matters. A lot of “smart” form experiences are only smart right up until they are not.

## Demo

If you want to kick the tires, I put together [a live demo](https://aarongustafson.github.io/form-saver/demo/) with examples of the retention options as well:

<figure id="fig-2026-04-20-01" class="media-container">
<fullscreen-control class="talk__slides__embed video-embed__video">
<iframe src="https://aarongustafson.github.io/form-saver/demo/" class="talk__slides__embed video-embed__video" frameborder="0"></iframe>
</fullscreen-control>
</figure>

## Grab it

The project is available on [GitHub](https://github.com/aarongustafson/form-saver), and you can install it from npm:

```bash
npm install @aarongustafson/form-saver
```

If you want the easiest path, just import it and let the component register itself:

```javascript
import "@aarongustafson/form-saver";
```

If you would rather define it yourself, you can import the class directly:

```javascript
import { FormSaverElement } from "@aarongustafson/form-saver/form-saver.js";

customElements.define("form-saver", FormSaverElement);
```

Either way, you wind up with a more forgiving form experience and a little less needless frustration for the people filling it out. Which, in my book, is a pretty solid deal. The bar for delight in forms is often just “don’t make me do that again,” and honestly, I’ll take it.