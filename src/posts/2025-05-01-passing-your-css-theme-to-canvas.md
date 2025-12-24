---
title: "Passing Your CSS Theme to `canvas`"
date: 2025-05-01 14:49:27 -07:00
comments: true
tags: ["accessibility", "animation", "CSS", "design", "JavaScript"]
description: "While working on a recent project I noticed an issue with a `canvas`-based audio visualization when I toggled between light and dark modes. I couldn’t find any articles on to make `canvas` respond nicely to user preferences, so I thought I’d share (in brief) how I solved it."
twitter_text: "Need to pipe your CSS theme into a `canvas` element? Here’s how I did it."
---

While working on a recent project I noticed an issue with a `canvas`-based audio visualization when I toggled between light and dark modes. When I’d originally set it up I was browsing in dark mode and the light visualization stroke showed up perfectly on the dark background, but it was invisible when viewed using the light theme (which I’d neglected to test). I searched around, but didn’t find any articles on easy ways to make `canvas` respond nicely to user preferences, so I thought I’d share (in brief) how I solved it.

<!-- more -->

## The CSS Setup

The theming of this particular project uses [CSS custom properties](https://developer.mozilla.org/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties). For simplicty I’m going to set up two named colors and then use two theme-specific custom properties to apply them in the default light theme and the dark theme:

```css
:root {
  --color-dark: #222;
  --color-light: rgba(255, 255, 255, 0.5);

  --color-background: var(--color-light);
  --color-foreground: var(--color-dark);
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-background: var(--color-dark);
    --color-foreground: var(--color-light);
  }
}
```

## Applying the Theme to Canvas

To get the theme into my `canvas`-related code, I set up a `theme` object to hold the values:

```js
const theme = {};
```

Next, I wrote a function to pull in the theme colors using [`window.getComputedStyle()`](https://developer.mozilla.org/docs/Web/API/Window/getComputedStyle). After defining the function, I call it immediately to populate the `theme` object:

```js
function importTheme() {
  theme.foreground =
    window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--color-foreground")
      .trim() || "black";
  theme.background =
    window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--color-background")
      .trim() || "white";
}
importTheme();
```

I set this up with just two theme colors, but you can import as many (or few) as you like. Be sure to set a sensible default or fallback for each color though, just in case your theme’s custom property names change.

With this in place, I can set my `canvas` animation’s colors by referencing them from the `theme` object. For example:

```js
context.fillStyle = theme.foreground;
```

## Keeping Things in Sync

The final bit of magic comes when you add an event listener to a `MediaQueryList`:

```js
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
mediaQuery.addEventListener("change", importTheme);
```

Here I’ve used `matchMedia()` to get a `MediaQueryList` object. Typically we use the `matches` property of this object to establish whether the media query currently matches or not. A lesser-known option, however, is that you can attach an event listener to it that will be triggered whenever the query’s status changes. So cool! With this in place, the `canvas` contents will update whenever the user’s theme changes. [Here’s an example of that](#fig-2025-05-01-01):

<figure id="fig-2025-05-01-01" class="media-container">

https://www.youtube.com/watch?v=pALIuO5uHUA

<figcaption><p>This video demonstrates how a canvas element rendering a dark sine wave against a light background can miraculously transform into a light sine wave against a dark background using CSS custom properties and a bit of JavaScript.</p></figcaption>
</figure>

# Demo

I put together [a quick demo of this](https://codepen.io/aarongustafson/pen/LEEQyqg) in a fork of [Alvin Shaw’s Canvas Sine Wave Experiment](https://codepen.io/alvinshaw/pen/mdEKggg):

<figure id="fig-2025-05-01-02" class="media-container">
  {% CodePen "https://codepen.io/aarongustafson/pen/LEEQyqg", "result", "331" %}
</figure>

<hr>

Hopefully this is helpful to someone out there. Happy theming!
