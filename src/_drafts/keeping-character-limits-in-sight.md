---
title: "Keeping Character Limits in Sight"
date: 2026-10-14 18:03:34 +00:00
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
    "user experience",
  ]
description: "The `<form-maxlength-progress>` web component turns a field’s native maxlength into useful, accessible feedback about how much room remains."
twitter_text: "A character limit shouldn’t sneak up on anyone. My new <form-maxlength-progress> web component makes a field’s native maxlength visible, accessible, and styleable."
---

Back in 2011, I wrote [“Improving the Tweet Box”](https://webstandardssherpa.com/reviews/improving-the-tweet-box) for <cite>Web Standards Sherpa</cite>. Twitter still had a 140-character limit, and one of the things I looked at was its character counter. The number on its own, sitting below the text box, didn’t tell people much; adding “characters remaining” gave it some meaning, including for people using screen readers.

That need hasn’t gone away. A field’s native `maxlength` can enforce a limit, but it doesn’t tell someone how much room they have left as they type. My [`<form-maxlength-progress>`](https://github.com/aarongustafson/form-maxlength-progress) web component adds that feedback.

<!-- more -->

It also takes the accessibility work a little further: the counter is associated with the field using `aria-describedby`, so the remaining count is available as part of the field’s description. It updates visually as someone types without announcing a new number to screen reader users after every keystroke.

## Start with the constraint

The basic setup uses the same pieces you’d use without the component: a label, a form field, and `maxlength`.

```html
<label for="message">Message</label>
<textarea id="message" name="message" maxlength="280"></textarea>

<form-maxlength-progress for="message"></form-maxlength-progress>
```

The `for` attribute works like the one on a `<label>`: it points to the field’s unique `id`. The component reads that field’s `maxlength`, inserts a counter, and updates the number as someone types.

That distinction matters. The component doesn’t invent a second limit or ask you to repeat `280` somewhere else. The field remains the source of truth, and the browser still enforces its native constraint.

The component works with `<textarea>` and the text-like `<input>` types: `text`, `search`, `tel`, `url`, `email`, and `password`.

## A number, a meter, or both

Sometimes a simple “42 characters remaining” is exactly right. In other settings, a progress bar can make the shape of the limit easier to scan. You can provide your own counter and native `<progress>` element:

```html
<label for="summary">Summary</label>
<input id="summary" name="summary" maxlength="120" />

<form-maxlength-progress
  for="summary"
  counter="summary-count"
  progress="summary-progress"
>
  <strong id="summary-count"></strong>
  <progress id="summary-progress"></progress>
</form-maxlength-progress>
```

Both references must point to unique descendants of the component. Their markup stays in the Light DOM, so you can style it with ordinary CSS. The component fills in the current value, maximum, and accessible label.

If you include both, the numeric counter carries the accessible description and the progress bar is hidden from assistive technology. Two visual treatments can be useful; hearing the same information twice generally isn’t.

I’d usually keep the numeric value even when there’s a progress bar. A bar is good at conveying “nearly there,” but it isn’t good at telling someone whether they have room for another sentence or only another word.

## Let proximity do the talking

The component’s `proximity` attribute changes as the field fills:

- `far` from 0% through 74%
- `close` from 75% through 99%
- `target` at 100%
- `overrun` above 100%, when overruns are enabled

That gives you a styling hook without tying the component to a particular visual design:

```css
form-maxlength-progress[proximity="close"] {
  color: darkorange;
}

form-maxlength-progress[proximity="target"],
form-maxlength-progress[proximity="overrun"] {
  color: crimson;
}
```

Color can reinforce the change, but it shouldn’t carry the message on its own. The counter still provides the actual value, which helps people who can’t perceive—or simply don’t notice—the color shift.

The defaults are sensible for many forms, but they aren’t sacred. If the final 20% is where people need to start editing, you can define your own lower-bound stops:

```html
<form-maxlength-progress
  for="message"
  proximity-values="safe 0%, notice 50%, warning 80%, limit 100%"
></form-maxlength-progress>
```

The names become `proximity` values, which means your HTML can describe the states in terms that make sense for your interface while your CSS decides what they look like.

## A quiet accessibility choice

The generated counter is added to the field’s `aria-describedby` value. When someone returns to the field, its remaining capacity is available alongside any other instructions already associated with it.

The counter is deliberately _not_ a live region. Announcing a new number after every keystroke sounds helpful in theory, but in practice it can turn typing into a stream of interruptions. The visual counter updates continuously without demanding continuous attention from a screen reader.

If someone needs to check the value, it remains part of the field’s description. That feels like a better balance: keep the information close, but don’t make it shout.

The default label handles singular and plural forms:

> 1 character remaining

> 42 characters remaining

You can replace that wording and provide plural categories for the language in use:

```html
<form-maxlength-progress
  for="message"
  label="{remaining} characters available"
  label-one="{remaining} character available"
></form-maxlength-progress>
```

Plural selection uses `Intl.PluralRules` and the component’s inherited language, so languages with more than English’s singular-or-plural split can provide `label-zero`, `label-two`, `label-few`, or `label-many` as needed.

## Should you allow people to go over?

Native `maxlength` stops additional input. That’s often the correct behavior: if a downstream system can store only 120 characters, pretending otherwise isn’t doing anyone a favor.

There are cases, however, where drafting first and editing down afterward is more humane. Adding `overrun="true"` temporarily removes the native stopping point while retaining the original maximum:

```html
<label for="notes">Notes</label>
<textarea id="notes" name="notes" maxlength="500"></textarea>

<form-maxlength-progress
  for="notes"
  overrun="true"
  overrun-label="{remaining} characters over the maximum."
  overrun-label-one="{remaining} character over the maximum."
></form-maxlength-progress>
```

Once the value passes the limit, the counter reports how far over it is and the field gets `aria-invalid="true"`.

There’s an important boundary here: the component does not call `setCustomValidity()`, so `aria-invalid` alone will not stop the form from submitting. If the maximum is a real data constraint, validate it on the server and, if you allow overruns in the interface, add the client-side validity behavior your form requires.

I’d treat overrun as an intentional drafting aid, not a default. It can be useful for a summary or social post where people benefit from editing in place. It is less useful when rejection arrives only after they submit.

## Progressive enhancement keeps the important part

If the component never loads, the field, its label, and its native `maxlength` still work. What disappears is the progress feedback, not the form control or its constraint.

That fallback is one reason the relationship lives in `for` rather than wrapping and replacing the field. The browser already knows how to handle text entry and `maxlength`; the component’s job is to make that existing behavior easier to understand.

If you author a custom counter or progress bar, you can avoid showing its empty state before the element upgrades:

```css
form-maxlength-progress:not(:defined) {
  display: none;
}
```

## Try it out

I put together [a live demo](https://aarongustafson.github.io/form-maxlength-progress/demo/) showing the generated counter, an authored progress bar, custom proximity states, localization, and the optional overrun behavior.

<figure class="media-container">
<fullscreen-control class="talk__slides__embed video-embed__video">
<iframe src="https://aarongustafson.github.io/form-maxlength-progress/demo/" class="talk__slides__embed video-embed__video" frameborder="0"></iframe>
</fullscreen-control>
</figure>

## Grab it

You can explore the source and file issues in [the `<form-maxlength-progress>` repository](https://github.com/aarongustafson/form-maxlength-progress), or install it from npm:

```bash
npm install @aarongustafson/form-maxlength-progress
```

Importing the package defines `<form-maxlength-progress>` automatically:

```javascript
import "@aarongustafson/form-maxlength-progress";
```

Character limits may be small constraints, but they don’t need to be small surprises.
