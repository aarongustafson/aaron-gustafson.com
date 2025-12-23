---
title: "A Tab Interface Before Its Time"
date: 2023-03-06 16:22:14 -07:00
comments: true
tags: ["HTML", "web components"]
description: "It’s cool to see ideas I was playing with over a dozen years ago starting to make it into new markup constructs."
twitter_text: "It’s cool to see ideas I was playing with over a dozen years ago starting to make it into new markup constructs."
in_reply_to: https://css-tricks.com/spicy-sections/
hero:
  src: /i/posts/2023-03-06/hero.jpg
  credit: Aaron Gustafson × DALL·E
  alt: "A photo of a steampunk robot sitting in the corner of a dusty shed. It is covered in spider webs, dust, and is partially draped in a sheet. It looks a little rusty, but also looks like it could still work if given a little care."
  url: https://labs.openai.com/s/YLRGLlmZlJWsO61Ag81Bo0X5
  offset: "0"
---

I finally got around to reading [the CSS Tricks piece on "Spicy Sections"](https://css-tricks.com/spicy-sections/) and it’s cool how closely what the [OpenUI folks](https://open-ui.org/) are talking about aligns with work I was doing in the mid-to-late oughts.

<!-- more -->

Back in 2007, I built [a little standalone JavaScript called `TabInterface.js`](https://easy-designs.github.io/TabInterface.js/). I built it to generate tabbed interfaces using the natural document outline (`h1`-`h6`) to inform the UI. It only required that the author add a single wrapper to indicate the content could be converted into a tabbed interface. For example, given the following HTML:

```html
<div id="recipe" class="tabbed">
  <h2>Overview</h2>
  …
  <h2>Ingredients</h2>
  …
  <h2>Directions</h2>
  …
  <h2>Nutrition</h2>
  …
</div>
```

You would use JavaScript to update the code to turn it into a tabbed interface:

```js
window.addEventListener(
  "domready",
  function () {
    document.querySelectorAll(".tabbed").forEach(function (item, i) {
      new TabInterface(item, i);
    });
  },
  false,
);
```

What I always loved about this approach was that it was the best of both worlds:

- **Semantic, strucutred content as the no-JS and print experience.** This is great because JS isn’t a given and you _really_ don’t want to have an interface look like tabs without behaving like them too.
- **Tabbed content when JS was available.** The ideal experience, at least on desktop screens, but more on that in a moment.

I think the first talk I gave that included this was “Fundamental Progressive Enhancement,” which I delivered at [Web Builder 2.0 in October of 2008](https://www.slideshare.net/AaronGustafson/fundamental-progressive-enhancement-web-builder-20-2008-presentation/82/). I also wrote about the approach in a 2-part article for <cite>Net Magazine</cite> ([Part 1](/docs/create-a-tabbed-interface-part-1.pdf), [Part 2](/docs/create-a-tabbed-interface-part-2.pdf)) the following year.

Of course, that was all before media queries and responsive design. By the time that rolled around, I had begun recommending that folks [only convert the interface to tabs when there was room for it and to un-tab if needed](https://www.slideshare.net/AaronGustafson/building-adaptive-designs-now-ui17/143) (like when a device is rotated).

Over the years, my approach continued to evolve to include

- Testing to see if the tabs would even fit horizontally, considering the viewport width and length of the headings (`TabInterface` does support alternate, shorter markup-driven headings too).
- Adapting to provide an accordion when horizontal space was scarce.
  - This could use `details` & `summary`, if supported or
  - `div` elements if not.

Anyway, it’s wild to see the idea finally beginning to get some traction in a broader sense. Clearly `TabInterface` was an idea before its time.
