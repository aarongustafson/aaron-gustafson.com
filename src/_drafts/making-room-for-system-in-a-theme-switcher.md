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

If you’ve used the theme switcher on this site, you may notice it works a little differently now.

There’s been a lot of discussion lately about whether theme controls should be two state ot three state by default. [Bramus has made the case for three states](https://www.bram.us/2026/08/18/the-case-for-tri-state-dark-mode-toggles/), while [Lea has argued that two are enough](https://lea.verou.me/blog/2026/dark-mode-toggles/). 

That discussion prompted me to revisit the way I’ve been managing themes on this site. I’d supported two themes — dark and light — and neglected the system setting entirely. I wanted to rectify that and felt the urge to build a web component to make it re-usable: [`<theme-switcher>`](https://github.com/aarongustafson/theme-switcher).

<!-- more -->

Fun fact: The whole reason I built `<form-multi-switch>`, which [I posted about yesterday](/notebook/there-can-be-only-one-redux/), was to provide the foundation to make `<theme-switcher>` a reality. If you find this component useful or interesting, you should really check `<form-multi-switch>` out too.

## How I’m using it

Here’s the markup I’m using inside this site’s theme `<dialog>`:

```html
<theme-switcher class="theme-icons" label="Color theme"></theme-switcher>
```

With this modest amount of markup in place, the component generates a `<fieldset>` with a “Color theme” `<legend>` and the three standard choices: System, Light, and Dark.

Notes: The `theme-icons` class is my own styling hook, not a requirement. I use it to add decorative icons alongside the text labels. My `<dialog>` supplies the surrounding interaction; the component doesn’t create a `<dialog>` or its opener.

When someone makes a choice, the component writes it to the `<html>` element as `data-theme`:

```html
<html data-theme="dark">
```

That’s it. Not really, but pretty much. It doesn’t impose a theme, it doesn’t set any CSS rules, it just adds adds a signal for CSS to respond to.

Here’s a simple example of how you could do that, using browser-provided system colors:

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

With System selected, the first rule applies and the browser chooses the appropriate color scheme using media queries (which I’ve not shown here). When Light or Dark are applied, those take precedence. That approach is crucial because a system-preference media query shouldn’t undo an explicit user choice on your site.

## Need additional themes? No problem



## Remembering a user’s preference

By default, `<theme-switcher>` saves a user’s preference in `localStorage`, using the key `theme-switcher`. A valid saved preference takes precedence any author-provided defaults. If you’d like to enable your server to get access to the preference too, you can back this up with a cookie by adding the `cookie` attribute:

```html
<theme-switcher cookie></theme-switcher>
```

With cookie backing enabled, a valid `localStorage` value wins; a valid cookie provides a fallback when `localStorage` is unavailable or has no supported value. Your server can use that cookie to render the appropriate `data-theme` before sending a page to the browser.

While it’s unlikely you’d include multiple instances of this component on your site, the component does ensure that all theme controls on the same page remain in sync. When `localStorage` is available, it will also keep all tabs in sync by listening for the browser’s `storage` event.

If you want to test the control without saving the preference, I’ve included an option to prevent values from being saved by adding `storage="none"` to the component.


## Preventing theme change during load

One challenge in building this component is that I don’t have control over how long the component takes to boot and, therefore, at what point the value stored in `localStorage` will be read and applied to the `<html>` element. It’s just a sad reality. That means the default theme will load first and then switch to the user’s preference, if it’s a different one.

Adding a small `<script>` in the document `<head>` can prevent this theme flash by restoring the preference before the stylesheets load:

```js
<script>
  try {
    const theme = localStorage.getItem('theme-switcher');
    if (['system', 'light', 'dark'].includes(theme)) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  } catch (error) {
    console.warn('Could not restore the saved theme.', error);
  }
</script>
```

This code, and an alternative that loads from the cookie as a fallback, is available in [the project documentation](https://github.com/aarongustafson/theme-switcher#restore-a-saved-choice-before-first-paint).

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

=====

To install and register the component:

```sh
npm install @aarongustafson/theme-switcher
```

```js
import "@aarongustafson/theme-switcher/define.js";
```

Your bundler needs to resolve package imports, or you can use an import map when serving the modules directly. That includes the dependency on `@aarongustafson/form-multi-switch`.

Changing the theme here requires JavaScript, so there’s no need to ship radio buttons that wouldn’t do anything without it. The dialog opener stays hidden until the component has generated and enhanced its controls. Without JavaScript, the site’s CSS still follows the system preference.



## Remember the request



## Try it here—or elsewhere

You can try the control on this site, or explore the [standalone demos](https://aarongustafson.github.io/theme-switcher/demo/):

<figure class="media-container">
<fullscreen-control class="talk__slides__embed video-embed__video">
<iframe src="https://aarongustafson.github.io/theme-switcher/demo/" title="Theme switcher examples" class="talk__slides__embed video-embed__video" frameborder="0"></iframe>
</fullscreen-control>
</figure>

The [repository](https://github.com/aarongustafson/theme-switcher) has the full API and configuration options. If you try it, I’d be interested to hear whether the explicit System choice makes the interaction clearer for the people using your site.
