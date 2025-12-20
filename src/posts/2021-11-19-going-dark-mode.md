---
title: "Going dark (mode)"
date: 2021-10-26 11:57:19 -07:00
comments: true
tags: ["CSS", "progressive web apps"]
description: "I finally got around to playing with the CSS user color-scheme preference and enabled a “dark mode” for this site."
hero:
  src: /i/posts/2021-11-19/hero.jpg
  credit: Aaron Gustafson × DALL·E
  alt: "A plush viking in a dark room"
  url: https://labs.openai.com/s/QjPor79EFuThl7uSXrnxqnw3
  offset: "105"
crossposted:
  dev.to: https://dev.to/aarongustafson/going-dark-mode-4d39
---

While working on tooling to analyze Web App Manifest usage in relation to some new feature proposals, it became clear we needed a test Manifest that included the proposed syntax for dark/light mode support. I decided to make this site the guinea pig and spent an hour or so tweaking things to make it happen. Here’s a run-down of what I did:

<!-- more -->

## CSS tweaks

The first step was to add in the `prefers-color-scheme` Media Query. If you’re unfamiliar, it looks a little something like this:

```css
/* Your regular rules go here */

@media (prefers-color-scheme: dark) {
  /* Overrides for the "dark" theme go here */
}

@media (prefers-color-scheme: light) {
  /* Overrides for the "light" theme go here */
}
```

I only wanted to add a "dark" theme as my default is pretty much a "light" theme anyway. For the most part, this was pretty straightforward… just swapping color values, being sure to use the specific properties I wanted to change (e.g., `background-color`, `border-color`) rather than the shorthand. The only tricky/convoluted bit was updating my fancy link underlines (which don’t use `text-decoration`).

## Tweaking SVGs

You may not have realized it, but SVGs also support the `prefers-color-scheme` Media Query. Most of my SVGs were black & white already, so I had no color definitions in them. Adding an embedded stylesheet to swap out colors did the trick though:

```css
svg {
  background-color: white;
}
path {
  fill: black;
}
@media (prefers-color-scheme: dark) {
  svg {
    background-color: #454545;
  }
  path {
    fill: #fffcf4;
  }
}
```

While most of these SVGs are in my HTML, some are referenced in my Web App Manifest. At the time I’m writing this, no browsers support SVG icons in the Manifest, but it’s something we (the Edge team) are working on adding for Chromium. And, when we land it, my hope is that we’ll include dark/light icon support by rastorizing the vector files in each of these contexts.

## Tweaking the Manifest

Continuing in the realm of speculation, there’s [a proposal to support user-prefered color schemes in the Manifest](https://github.com/w3c/manifest/issues/975#issuecomment-960222756) as well. That proposal calls for a `user_preferences` block, wherein certain keys can be redefined. Here’s what I did, based on our discussions:

```json
"user_preferences": {
  "color_scheme_dark": {
    "background_color": "#5b5b5b",
    "icons": [
      {
        "src": "/i/icon.svg",
        "type": "image/svg+xml",
        "sizes": "512x512",
        "purpose": "any monochrome maskable"
      },
      {
        "src": "/i/icon-reverse.png",
        "type": "image/png",
        "sizes": "512x512",
        "purpose": "any monochrome maskable"
      },
      {
        "src": "/i/notification-icon-reverse.png",
        "type": "image/png",
        "sizes": "256x256",
        "purpose": "any monochrome maskable"
      }
    ]
  }
},
```

I’m not sure yet whether my color-adapting SVG icon would need to be included here so as not to be replaced by the PNG versions, so I went ahead and included it anyway.

<hr>

And that’s pretty much it. With just a little bit of time, I got it all set up. If you happen to use the new theme and something looks wonky, please let me know.
