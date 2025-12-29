---
title: "Fullscreen Video and Iframes Made Easy"
date: 2025-12-29 17:17:27 +00:00
comments: true
tags:
  [
    "web components",
    "progressive enhancement",
    "HTML",
    "video",
    "accessibility",
    "media",
  ]
description: "The fullscreen-control web component adds fullscreen capabilities to any video or iframe element with a single wrapper and zero configuration."
twitter_text: "Add fullscreen controls to videos and iframes with progressive enhancement. One wrapper, zero hassle."
---

Adding fullscreen capabilities to videos and embedded iframes shouldn’t require wrestling with prefixed APIs or managing focus states. The `fullscreen-control` web component handles all of that for you — just wrap it around the element. The component handles the rest as a discrete progressive enhancement.

<!-- more -->

## Easy-peasy

Here’s a simple example using a `video` element:

```html
<fullscreen-control>
  <video src="video.mp4"></video>
</fullscreen-control>
```

With that in place, the component

* Adds a styleable button for launching fullscreen control over the contained element,
* Handles browser prefixes as needed,
* Manages focus automatically,
* Rigs up the necessary keyboard events (e.g. <kbd>Escape</kbd> to exit), and
* Assigns the relevant ARIA attributes. 

The component uses light DOM, so your `video` stays in the regular DOM tree and all your existing CSS continues to work.

## Fullscreen iframes

Need to embed a YouTube video, slide deck, or code demo? The component works with `iframe` elements too:

```html
<fullscreen-control>
  <iframe
    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
    width="560"
    height="315"
    title="YouTube video player"
  >
  </iframe>
</fullscreen-control>
```

The component automatically adds the necessary `allow="fullscreen"` and `allowfullscreen` attributes, including prefixed versions for broader compatibility.

## Customizable `button` text

You can change the `button` label to match your site’s language or writing style by setting the `button-text` attribute:

```html
<fullscreen-control button-text="全画面表示">
  <video src="video.mp4"></video>
</fullscreen-control>
```

The default button label is “View fullscreen,” but you can use this attribute to customize it to anything you like. You can even dynamically inject the accessible name of the contained element, using the `{name}` token. For example:

```html
<fullscreen-control button-text="View {name} fullscreen">
  <video src="video.mp4" aria-label="Product demo"></video>
</fullscreen-control>
```

This creates a `button` with the text “View Product demo fullscreen”. The component looks for `aria-label`, `title`, or other native naming on the wrapped element and uses that to make the `button` contextual.

## Distinct screen reader labels

If you want the visible label and accessible button name to differ, use the `button-label` attribute. Like `button-text`, it can also inject the accessible name of the controlled element using the `{name}` token:

```html
<fullscreen-control
  button-text="Fullscreen"
  button-label="View {name} in fullscreen mode"
>
  <iframe src="https://example.com" title="Product teaser"> </iframe>
</fullscreen-control>
```

This code will generate a `button` that visually reads “Fullscreen”, but is announced as “View Product teaser in fullscreen mode” to screen readers. In mode cases, `button-text` will suffice, but this option is available if you need to distinguish the buttons of multiple fullscreen controls from one another and don’t have visual space to display their accessible names.

## Focus management 

If users activate fullscreen using the button, focus will automatically return to the button upon exiting fullscreen. This ensures keyboard users don’t lose their place.

## Need more control?

Want to manage the component yourself? The component exposes three methods:

```javascript
const control = document.querySelector("fullscreen-control");

// Enter fullscreen
await control.enterFullscreen();

// Exit fullscreen
await control.exitFullscreen();

// Toggle fullscreen state
control.toggleFullscreen();
```

These handle all the browser prefixes and error handling for you.

There are also a set of events you can tap into when the fullscreen state changes:

```javascript
const control = document.querySelector("fullscreen-control");

control.addEventListener("fullscreen-control:enter", () => {
  console.log("Entered fullscreen mode");
});

control.addEventListener("fullscreen-control:exit", () => {
  console.log("Exited fullscreen mode");
});
```

These events give you the ability to pause other media, track analytics, and the like.

## Style the button

Since the component uses light DOM, you can style the button directly with CSS:

```css
fullscreen-control button {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  font-weight: bold;
}

fullscreen-control button:hover {
  background: #ff5252;
}
```

The button is positioned absolutely by default (top-right corner), but you can adjust this with CSS custom properties:

```css
fullscreen-control {
  --fullscreen-control-button-inset-block-start: 1rem;
  --fullscreen-control-button-inset-inline-end: 1rem;
}
```

This uses logical properties, so it adapts automatically to different writing modes.

## Installation

Install via npm:

```bash
npm install @aarongustafson/fullscreen-control
```

Then import it in your JavaScript:

```javascript
import "@aarongustafson/fullscreen-control/define.js";
```

Or load it from a CDN for quick prototyping:

```html
<script type="module">
  import { defineFullscreenControl } from "https://unpkg.com/@aarongustafson/fullscreen-control@latest/define.js?module";
  defineFullscreenControl();
</script>
```

## Browser support

The component uses modern web standards (Custom Elements v1, ES Modules) and handles browser-prefixed fullscreen APIs internally. For older browsers, you may need polyfills, but the component gracefully handles missing APIs with console warnings rather than breaking your page.

## Demo and source code

Check out the [live demo](https://aarongustafson.github.io/fullscreen-control/demo/) to see all the features in action, or grab the code from [GitHub](https://github.com/aarongustafson/fullscreen-control).
