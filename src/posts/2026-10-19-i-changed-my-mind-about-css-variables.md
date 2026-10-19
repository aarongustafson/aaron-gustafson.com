---
title: "I’ve Changed My Mind About CSS Variables"
date: 2026-10-19 16:48:33 +00:00
comments: true
tags: ["CSS", "progressive enhancement", "accessibility", "web components", "web design", "web development"]
description: "An email from Eric Meyer prompted me to revisit my 2014 argument against CSS variables. My feelings are quite different now, though some of my original concerns still hold."
meta_description: "An email from Eric Meyer prompted me to revisit my 2014 argument against CSS variables: what I missed, how I use them now, and why fallbacks still matter."
twitter_text: "Back in 2014, I decried CSS variables, but my perspective has largely changed. Here’s what I missed, how I use them now, and why fallbacks still matter."
image: "/i/share-cards/i-changed-my-mind-about-css-variables.jpg"
---

A while back, Eric Meyer emailed to ask about [my old post arguing that CSS variables were a bad idea](/notebook/css-variables-are-a-bad-idea/). Did I still feel that way?

No. I’ve changed my mind.

<!-- more -->

These days, I use CSS custom properties—the feature we often call “CSS variables”—quite a lot. To adapt interfaces to people’s preferences. To pass theme colors to JavaScript-driven interfaces. To theme many of the web components I build. I also discuss them quite a bit in my forthcoming course on progressive enhancement. At this point, that old headline no longer applies.

I’ve added a brief note to the original post, but I thought it best to explain the change in more detail. Hence this post.

My change of heart came not just because browser support improved, but because I realized I’d been too focused on custom properties as Sass variable replacements.

## My original concerns

At the time of my original post, published in November 2014, browser support was extremely limited. The example I included used custom properties to store foreground and background colors:

```css
:root {
  --foreground-color: #333;
  --background-color: #fff;
}

body {
  background: var(--background-color);
  color: var(--foreground-color);
}
```

I was concerned that browsers without support would lose those color declarations. To give those browsers the intended colors too, we’d need to write old-school color values first:

```css
:root {
  --color-foreground: #333;
  --color-background: #fff;
}

body {
  background: #fff;
  background: var(--color-background);
  color: #333;
  color: var(--color-foreground);
}
```

I compared that with Sass, which could substitute the values during compilation, yielding universally understandable CSS:

```scss
$color-background: #fff;
$color-foreground: #333;

body {
  background: $color-background; /* background: #fff; */
  color: $color-foreground;      /* color: #333; */
}
```

If we only need to replace a name with a fixed value, doing that before sending the stylesheet was (and remains) perfectly reasonable.

But I went further. I treated the necessity of fallback declarations as a flaw and used it to dismiss custom properties altogether. I shouldn’t have.

The uncomfortable irony is that I’ve advocated for authoring a usable baseline followed by an enhancement in CSS for years. Some degree of repetition is often required to make that work. I shouldn’t have dismissed custom properties just because a preprocessor let me avoid the redundancy.

In that piece, I also speculated about the performance cost of custom props without bringing receipts. Browsers do have to resolve their values, but I had no proof this would cause a meaningful performance problem.

## What I missed

I’ll admit I had a very simplistic view of custom properties. It was largely informed by my immersion in Sass at the time. I didn’t take the time to dig into [the more powerful aspects of custom properties](https://developer.mozilla.org/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties). Custom properties participate in the cascade. They inherit by default too. Their values can differ across elements or change in response to media queries and changes in the document.

That power becomes apparent in an example like this:

```css
:root {
  --notice-background: #eee;
  --notice-foreground: #222;
}

@media (prefers-color-scheme: dark) {
  :root {
    --notice-background: #222;
    --notice-foreground: #eee;
  }
}

.notice {
  background-color: #eee;
  background-color: var(--notice-background, #eee);
  color: #222;
  color: var(--notice-foreground, #222);
}

.notice--warning {
  --notice-background: #ffe08a;
  --notice-foreground: #222;
}
```

Here, ordinary notices change their theme based on a user’s color-scheme preference. A warning notice, however, gets its own colors without changing the declarations that use them. Descendants can inherit those custom properties and use them too.

A Sass variable, in contrast, is static. It doesn’t respond to that context at all. A custom property does. We can generate preference-aware styles with Sass, of course, but compiled variables and browser-resolved custom properties are worlds apart.

I didn’t understand how powerful custom properties are when I wrote the original post. I was squinting at them through Sass’s pink-tinted glasses.

## Theming through and through

One project that made the value of custom props much clearer to me was a `canvas`-based audio visualizer I was working on. It looked fine while I was using dark mode. When I switched to the light theme, however, the visualization disappeared against its background. As my son would say: “That’s buns.”

I’m almost always in dark mode, so that’s what I’d been testing in. I’d totally neglected to give it a look in light mode. Yikes.

I was already using custom props to handle site-wide theming, so rather than maintain a second set of theme colors in JavaScript, I opted to read the values CSS had resolved:

```js
const theme = {};

function importTheme() {
  const styles = window.getComputedStyle(document.documentElement);

  theme.foreground =
    styles.getPropertyValue("--color-foreground").trim() || "black";
  theme.background =
    styles.getPropertyValue("--color-background").trim() || "white";
}

importTheme();
```

The drawing code could use those values for its strokes and fills. Then a listener could refresh the theme values when the user’s color-scheme preference changed:

```js
const preference = window.matchMedia("(prefers-color-scheme: dark)");
preference.addEventListener("change", importTheme);
```

When the theme changes, the next draw uses the updated colors. A graphic that isn’t being continuously redrawn would also need to be repainted, of course, but for an audio visualizer it was perfect.

I covered the setup in [“Passing Your CSS Theme to `canvas`”](/notebook/passing-your-css-theme-to-canvas/). The key benefit of this approach is that CSS remains responsible for resolving the theme, while JavaScript can focus on managing the drawing. Clean separation.

## Styling components

If you’ve been following my work for a while, you’ve probably seen [my growing list of web components](/web-components/). I use custom properties in them quite often. My [`<fullscreen-control>` component](/notebook/fullscreen-video-and-iframes-made-easy/), for instance, adds a “fullscreen” button to a wrapped `<video>` or `<iframe>`. Authors can adjust the button’s position through custom props:

```css
fullscreen-control {
  --fullscreen-control-button-inset-block-start: 1rem;
  --fullscreen-control-button-inset-inline-end: 1rem;
}
```

Those values control the button’s position. No need to crack open the JavaScript to move it. And because the positioning uses logical properties, the offsets follow the writing mode rather than assuming a particular physical corner.

Similarly, [`<form-validation-list>`](/notebook/visual-validation-feedback-for-form-fields/) exposes custom properties for icon size, matched and unmatched colors, and similar design choices. That makes it relatively straightforward to adapt the component to a site’s design without touching the component’s behavior.

In both cases, custom properties provide a simple way to alter the look and feel of the component directly from within a stylesheet, where design decisions belong.

## Fallback, carefully

Even though I complained about them at the time, I don’t want to gloss over the importance of fallbacks for custom properties. Used properly, they help make our designs robust and progressively enhanced.

### When the browser doesn’t support custom properties

Take the following, for example:

```css
:root {
  --flow-space: 1em;
}

.flow > * + * {
  margin-block-start: 1em;
  margin-block-start: var(--flow-space);
}

.compact {
  --flow-space: 0.75em;
}
```

In this code sample, the second rule (`.flow > * + * {}`) establishes space between adjacent children in two steps: first, it sets a block-start margin using a standard value (`1em`), then it overrides that value using a custom property (`var(--flow-space)`).

Browsers that understand custom properties use the value of `--flow-space` because that declaration comes later in the rule. Browsers that don’t understand `var()` ignore that declaration, following the rules of fault tolerance. They apply the earlier `1em` declaration instead.[^logical]

[^logical]: This assumes the browser also supports `margin-block-start`; a browser that doesn’t will ignore both declarations.

The `.compact` rule overrides the inherited spacing value, so a flow container in a compact region can use tighter spacing without a different margin rule.

### When the custom property is missing

The second argument in `var()` handles a different situation:

```css
.flow > * + * {
  margin-block-start: 1em;
  margin-block-start: var(--flow-space, 1em);
}
```

In a browser that supports custom properties, it provides a backup value the browser can use when the referenced property is missing or resolves to the [_guaranteed-invalid value_](https://developer.mozilla.org/docs/Glossary/guaranteed_invalid_value). To test this, you could remove the `--flow-space` assignment from `:root` and—if no other assignment applied or was inherited—the fallback argument would supply `1em`.

It’s important to note that this situation is different from a value being unacceptable for a given property. The fallback argument doesn’t check whether the custom prop’s value is a valid size or color.

I’ll illustrate that with a silly example:

```css
.notice {
  --notice-color: 20px;

  color: #333;
  color: var(--notice-color, #333);
}
```

In a browser that supports `var()`, the earlier color declaration (`color: #333`) isn’t used. The custom property (`--notice-color`) exists, and `20px` is a valid value for an unregistered custom property[^registration], so the fallback argument isn’t used either. Unfortunately, after substitution, the winning declaration is `color: 20px`, and `20px` is not a valid color value.

[^registration]: You can register a custom property with [`@property`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@property), defining its syntax, inheritance behavior, and an initial value. Assigning a value using syntax like `--foo: bar;` doesn’t register it. The examples in this post use unregistered custom properties.

In this scenario, you might expect the browser to fall back to the previous `color` declaration. It doesn’t.

This is an example of an [invalid-at-computed-value-time](https://developer.mozilla.org/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties#invalid_custom_properties) failure. The browser stores the `20px` value for `--notice-color` with no problem. The problem only becomes apparent when that value is used as a color, after the cascade has selected the declaration. At that point, it’s too late to ignore the declaration during parsing, as the browser would with a literal `color: 20px`. Instead, the element _inherits_ its `color` from its parent. For non-inherited properties like `background-color`, the browser uses the _initial_ value instead.

The browser won’t rewrite the custom property. It won’t go back through the earlier declarations looking for a replacement either.

That was a contrived example. Here’s a more realistic one.

### When the value requires a newer feature

Just because a browser supports custom properties doesn’t mean every value we assign to one will work. Imagine you want to use a newer color function in a custom property:

```css
:root {
  --button-background: color-mix(in oklab, #e200ff, black 65%);
}

button {
  background-color: #222;
  background-color: var(--button-background, #222);
}
```

A browser that supports custom properties but doesn’t know what `color-mix()` means will still retain the custom property’s value as a sequence of tokens. The failure comes later, when it tries to use that value as a background color. Neither the preceding declaration nor the fallback argument can save you; the background becomes transparent, its initial value.

To retain a known-good value while using `color-mix()` as an enhancement, we can test for support before assigning it:

```css
:root {
  --button-background: #222;
}

@supports (color: color-mix(in oklab, red, red)) {
  :root {
    --button-background: color-mix(in oklab, #e200ff, black 65%);
  }
}

button {
  background-color: #222;
  background-color: var(--button-background, #222);
  color: #fff;
}
```

The `@supports` block checks whether the browser accepts `color-mix()` in the `oklab` color space, without tying it to a particular palette or background. Mixing red with itself is a terse way to test the syntax. We can then group multiple enhanced custom-property assignments inside that same block. If you’re using other color spaces or newer color syntax, place each in its own `@supports` block to ensure maximum compatibility.

In this example, the known-good value (`#222`) remains unless the support test passes. Browsers without custom-property support still have the literal background declaration too.

_Note: When enhancing this way, it’s critical that we test each potential color combination to ensure accessible contrast levels._

---

Fallbacks aren’t mandatory. Sometimes an inherited value or the browser’s default provides a reasonable baseline experience. It’s good to know we have these options, though, and a modest amount of redundancy when it matters is a small price to pay.

## Where that leaves me

Eric’s question was a useful nudge to revisit an opinion I’d left sitting on the Web long after my own work had moved on.

I still stand by the central concern in that original post: people should have a usable experience when a particular enhancement isn’t available. The difference is that now I’ve got plenty of ways to use custom properties in service of that goal. They let me respond to preferences, adapt components, and share dynamic styles between CSS and JavaScript.

If you’re deciding between a preprocessor variable and a custom property, consider when the value needs to be resolved and what needs to influence it. If it needs to respond to the person using the page or the rendering context, a custom property resolved in the browser can be genuinely useful. Just be sure to check what happens when the value—or the enhancement consuming it—isn’t available.

That’s the question I should have spent more time on in 2014.
