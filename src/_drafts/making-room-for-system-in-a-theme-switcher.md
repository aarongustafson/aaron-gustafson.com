---
title: "Making Room for System in a Theme Switcher"
date: 2026-11-02 04:50:49 +00:00
comments: true
tags:
  [
    "accessibility",
    "CSS",
    "HTML",
    "JavaScript",
    "progressive enhancement",
    "user experience",
    "web components",
  ]
description: "My `<theme-switcher>` web component builds on `<form-multi-switch>` to offer explicit System, Light, and Dark choices, remember preferences, and keep theme controls in sync."
twitter_text: "“Use dark” and “follow my system” aren’t the same preference. My <theme-switcher> web component makes room for both—and I’ve adapted my own site to use it."
---

Imagine you’re reading a site in the afternoon. Your device is using its light appearance, and the site follows along. You try the site’s dark theme, decide you prefer light for this particular site, and switch back.

Later, your device switches to dark. What should the site do?

If “Light” meant “keep this site light,” it should stay light. If it meant “go back to following my device,” it should change. The page looked the same when you made that choice, but those are two different requests.

<!-- more -->

There’s been a lot of discussion lately about whether theme controls should expose that distinction. [Bramus has made the case for three states](https://www.bram.us/2026/08/18/the-case-for-tri-state-dark-mode-toggles/), while [Lea Verou has argued that two are enough](https://lea.verou.me/blog/2026/dark-mode-toggles/). The discussion inspired me to build [`<theme-switcher>`](https://github.com/aarongustafson/theme-switcher), and I’ve adapted my own site to use it.

For this site, I wanted the choices to be explicit: **System**, **Light**, and **Dark**.

## Three choices, not three colors

System isn’t a third palette. It’s an instruction to follow the device preference, including when that preference changes. Light and Dark are explicit overrides.

The component remembers `system` as `system`, rather than saving whichever appearance it happens to resolve to at the moment. That distinction lets someone return control to their device without clearing storage or hunting for a separate reset link.

Underneath, `<theme-switcher>` inherits from my [`<form-multi-switch>` component](https://github.com/aarongustafson/form-multi-switch). The base class handles the radio group and segmented presentation; the subclass adds theme selection, persistence, and synchronization.

There’s no need to build another set of keyboard interactions for what is still, fundamentally, a choice among radio buttons.

## Start with the choice

Here’s the markup I’m using inside this site’s theme dialog:

```html
<theme-switcher class="theme-icons">
  <fieldset>
    <legend id="theme-dialog-title">Color theme</legend>
    <label>
      <input type="radio" name="theme" value="system" checked />
      System
    </label>
    <label>
      <input type="radio" name="theme" value="light" />
      Light
    </label>
    <label>
      <input type="radio" name="theme" value="dark" />
      Dark
    </label>
  </fieldset>
</theme-switcher>
```

The `theme-icons` class is my own styling hook, not a requirement. I use it to add decorative icons alongside the text labels. The dialog supplies the surrounding interaction; the component doesn’t create a dialog or an opener.

To install and register the component:

```sh
npm install @aarongustafson/theme-switcher
```

```js
import "@aarongustafson/theme-switcher/define.js";
```

Your bundler needs to resolve package imports, or you can use an import map when serving the modules directly. That includes the dependency on `@aarongustafson/form-multi-switch`.

If you don’t need authored markup, `<theme-switcher></theme-switcher>` generates the three standard choices for you. As with the base component, though, an empty element has no usable controls until JavaScript runs.

Authored radios retain their native selection and form-submission behavior without JavaScript. They don’t, on their own, change the page’s theme. You could put them in a form and have a server apply the submitted preference, but that’s behavior you’d need to provide.

On my site, the dialog opener stays hidden until the enhancement is ready. Without it, the site’s CSS still follows the system preference.

## You supply the colors

When someone makes a choice, the component writes it to the document element:

```html
<html data-theme="dark">
```

It doesn’t impose a palette. You supply the CSS.

For a small example using browser-provided system colors, this is enough:

```css
:root {
  color-scheme: light dark;
}

:root[data-theme="light"] {
  color-scheme: light;
}

:root[data-theme="dark"] {
  color-scheme: dark;
}

body {
  background: Canvas;
  color: CanvasText;
}
```

With System selected, neither explicit override applies, so the browser chooses the appropriate color scheme.

My site uses its own palette, with CSS custom properties for backgrounds, text, links, and such. A `prefers-color-scheme: dark` query applies the dark palette only when `data-theme` is absent or set to `system`. An explicit `data-theme="dark"` applies it directly; an explicit Light choice keeps the light palette.

That scoping matters. A system-preference media query shouldn’t undo a choice someone just made.

The control itself inherits the base component’s CSS custom properties and styling hooks, so it can use those same site colors.

## Remember the request

By default, the component saves the preference in `localStorage`, using the key `theme-switcher`. A valid saved preference takes precedence over author-provided defaults.

You can opt out with `storage="none"`, or add cookie backing if your server needs to read the preference:

```html
<theme-switcher cookie></theme-switcher>
```

With cookie backing enabled, a valid local-storage value wins; a valid cookie provides a fallback when local storage is unavailable or has no supported value. A server can use that cookie to render the appropriate `data-theme` before the page reaches the browser.

The component also keeps connected theme controls on the same page in sync. With local storage enabled, tabs using the same storage key can pick up changes through the browser’s `storage` event.

You shouldn’t have to choose Dark separately in the header, footer, and another open tab.

## Before the control loads

Remembering a choice isn’t quite enough. If the component waits until its module loads to apply a saved Dark preference, someone may see a flash of the light theme first.

On my site, a small script in the document head restores the preference before the stylesheets load. It also migrates the old theme cookie, so an existing preference carries over to the new control. That’s site-specific integration, not something the component can do before it has loaded.

If you add a similar bootstrap, keep its storage key and supported values aligned with the component. The [project documentation](https://github.com/aarongustafson/theme-switcher#restore-a-saved-choice-before-first-paint) includes examples, including cookie-backed setups.

## Preference and appearance

Sometimes another part of your page needs to know when the theme changes. The component exposes both what someone requested and what that request currently resolves to:

```js
const switcher = document.querySelector("theme-switcher");

switcher.addEventListener("theme-switcher:change", ({ detail }) => {
  console.log(detail.value, detail.resolvedTheme, detail.source);
});
```

For a System preference on a device using dark mode, `value` is `system` and `resolvedTheme` is `dark`. If the device changes to light, the resolved theme changes while the preference remains System.

That’s useful for something CSS can’t handle on its own, like redrawing a chart. For ordinary page styling, the `data-theme` attribute and media queries are generally all you need.

You can also add themes beyond the standard three—Sepia, for instance—as long as System, Light, and Dark remain available. The component manages the choice; you still define what that extra theme looks like.

## Try it here—or elsewhere

You can try the control on this site, or explore the [standalone demos](https://aarongustafson.github.io/theme-switcher/demo/):

<figure class="media-container">
<fullscreen-control class="talk__slides__embed video-embed__video">
<iframe src="https://aarongustafson.github.io/theme-switcher/demo/" title="Theme switcher examples" class="talk__slides__embed video-embed__video" frameborder="0"></iframe>
</fullscreen-control>
</figure>

The [repository](https://github.com/aarongustafson/theme-switcher) has the full API and configuration options. If you try it, I’d be interested to hear whether the explicit System choice makes the interaction clearer for the people using your site.
