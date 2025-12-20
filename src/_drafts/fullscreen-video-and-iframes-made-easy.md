---
title: "Fullscreen Video and Iframes Made Easy"
date: 2025-12-10 10:00:00 -07:00
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

Adding fullscreen capabilities to videos and embedded iframes shouldn't require wrestling with prefixed APIs or managing focus states. The `fullscreen-control` web component handles all of that for you—just wrap your media element and you're done.

<!-- more -->

This component takes care of browser prefixes, keyboard navigation, focus management, and accessibility attributes automatically. It's progressive enhancement at its best: wrap it, forget it, and let your users enjoy fullscreen media.

## Drop-dead simple

Wrap a video element:

```html
<fullscreen-control>
  <video src="video.mp4"></video>
</fullscreen-control>
```

That's it. You get:

- A positioned fullscreen button overlay
- Browser prefix handling (webkit, moz)
- Automatic focus management
- Keyboard support (Escape to exit)
- ARIA attributes for accessibility
- Native video controls enabled automatically

The component uses light DOM, so your video stays in the regular DOM tree and all your existing CSS continues to work.

## Works with iframes too

Embed a YouTube video with fullscreen support:

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

## Customizable button text

Change the button label to match your site's language or style:

```html
<fullscreen-control button-text="全画面表示">
  <video src="video.mp4"></video>
</fullscreen-control>
```

The default is "View fullscreen" but you can customize it to anything you like.

## Accessible name injection

Use the `{name}` token to automatically pull the media's accessible name into the button text:

```html
<fullscreen-control button-text="View {name} fullscreen">
  <video src="video.mp4" aria-label="Product demo"></video>
</fullscreen-control>
```

This creates a button with the text "View Product demo fullscreen". The component looks for `aria-label`, `title`, or other native naming on the wrapped element and uses that to make the button more contextual.

## Distinct screen reader labels

Sometimes the visible text and screen reader announcement should differ. Use `button-label` for a separate ARIA label:

```html
<fullscreen-control
  button-text="Fullscreen"
  button-label="View {name} in fullscreen mode"
>
  <iframe src="https://example.com" title="Product teaser"> </iframe>
</fullscreen-control>
```

This shows "Fullscreen" visually but announces "View Product teaser in fullscreen mode" to screen reader users. Only use this when you need different text for accessibility—otherwise skip it and let the component mirror `button-text` automatically.

## Perfect focus management

When users click the fullscreen button, focus automatically returns to the button after exiting fullscreen. This ensures keyboard users don't lose their place. The component also listens for the Escape key to exit fullscreen, matching native browser behavior.

All of this happens automatically without any configuration needed.

## Programmatic control

Need to trigger fullscreen from JavaScript? The component exposes three methods:

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

## Event hooks

Listen for fullscreen state changes:

```javascript
const control = document.querySelector("fullscreen-control");

control.addEventListener("fullscreen-control:enter", () => {
  console.log("Entered fullscreen mode");
});

control.addEventListener("fullscreen-control:exit", () => {
  console.log("Exited fullscreen mode");
});
```

These custom events let you hook into state changes to update your UI, pause other media, or track analytics.

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

## Why I built this

I kept writing the same fullscreen boilerplate for video players and iframe embeds—checking for prefixes, managing focus, wiring up keyboard events. This component packages all of that into a single wrapper that just works.

The focus management piece was particularly important. Too many custom video players forget to return focus to the trigger button after exiting fullscreen, leaving keyboard users stranded. This component gets it right by default.

Check out the [live demo](https://aarongustafson.github.io/fullscreen-control/demo/) to see all the features in action, or grab the code from [GitHub](https://github.com/aarongustafson/fullscreen-control).
