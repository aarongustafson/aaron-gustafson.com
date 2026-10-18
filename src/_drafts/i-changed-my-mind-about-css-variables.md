---
title: "I’ve Changed My Mind About CSS Variables"
date: 2026-10-18 16:26:02 +00:00
comments: true
tags: ["CSS", "progressive enhancement", "accessibility", "web components", "web design", "web development"]
description: "An email from Eric Meyer prompted me to revisit my 2014 argument against CSS variables. My feelings are quite different now, though some of my original concerns still hold."
twitter_text: "Back in 2014, I decried CSS variables but my perspective has largely changed. Here’s what I missed, how I’m using custom properties today, and why we still need to care about fallbacks."
---

A while back, Eric Meyer emailed to ask about [my old post arguing that CSS variables were a bad idea](/notebook/css-variables-are-a-bad-idea/). Did I still feel that way?

No. I’ve changed my mind.

<!-- more -->

These days, I use CSS custom properties—the feature we often call “CSS variables”—quite a lot. I use them to adapt interfaces to people’s preferences. I use them to pass theme colors to JavaScript-driven UI. I also use them in many of the web components I build. They also come up quite a bit in the progressive enhancement course I’m working on. At this point, that old headline gives a pretty misleading impression of my thoughts.

I’ve added a brief note to the original post, but I thought it best to share my thoughts in an expanded form. Hence this post. 

My change of heart came because not just because browser support improved, but also because I was evaluating custom properties too narrowly.

## My original concerns

At the time of my original post, published in November 2014, browser support was extremely limited. Its example used custom properties to store foreground and background colors:

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

My concern was that browsers without support would lose those color declarations. To ensure all browsers get the custom colors, we must write the literal color values before the declarations using `var()`.

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

I compared that with Sass, which could substitute the values during compilation, yielding one line with universal support.

```sass
$color-background: #fff;
$color-foreground: #333;

body {
  background: $color-background; /* background: #fff; */
  color: $color-foreground;      /* color: #333; */
}
```

If you only need to replace a name with a fixed value, doing that before sending the stylesheet was (and remains) perfectly reasonable.

But I went further. I treated the fallback declarations as evidence that the feature defeated its own purpose and wrote off custom properties altogether. I was wrong to do that.

The uncomfortable irony is that Ive advocated for authoring a usable baseline followed by an enhancement in CSS for years. Some degree of repetition is often required to make that work. I shouldn’t have dismissed custom properties just because a preprocessor let me avoid the reduncancy.

I also speculated about performance cost of custom props without bringing reciepts. Custom props do create extra work for browsers, but that doesn’t mean the feature will meaningfully and negatively impact perf.

## What I missed

I had a very simplistic view of custom properties. It was largely informed by my Sass work with variables and I didn’t take the time to dig into [the more powerful aspects of custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties). Custom properties participate in the cascade. They can inherit too.[^registration] Their values can also change on different elements or in response to media queries and changes in the document.

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

Here, notices will change their theme based on a user’s color-scheme preference. A warning notice, however, can be themed without changing the declarations they flow into. Descendants can inherit those custom properties and use them too.

A Sass variable, in contrast, is static. It doesn’t respond to that context at all. A custom property does. We can generate preference-aware styles with Sass, of course, but compiled variables and browser-resolved custom properties are worlds apart.

I didn’t understand how powerful custom properties are when I wrote the original post. I was looking at it through Sass-tinted glasses.

## Themeing through and through

A recent project made the value and power of custom props infinitly more clear to me. I had a `canvas`-based audio visualizer that looked fine while I was using dark mode. When I switched to the light theme, the visualization disappeared against its background. As my son would say: “Buns.”

I’m almost always in dark mode, so that’s what I’d been testing in. I’d totally neglected to give it a look in light mode. Yikes.

I was already using custom props to handle themeing so, rather than maintain a second set of theme colors in JavaScript, I opted to read the values CSS had resolved:

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

If you’ve been following my work for any time, you’ve probably seen [my growing list of web components](/web-components/). I use custom properties in them quite often. My [`<fullscreen-control>` component](/notebook/fullscreen-video-and-iframes-made-easy/), for instance, adds a “fullscreen” button to a wrapped `<video>` or `<iframe>`. Authors can adjust the button’s position through CSS:

```css
fullscreen-control {
  --fullscreen-control-button-inset-block-start: 1rem;
  --fullscreen-control-button-inset-inline-end: 1rem;
}
```

Those values control the component design. No need to crack open the JavaScript to get a different value. And because the positioning uses logical properties, the offsets follow the writing mode rather than assuming a particular physical corner.

Similarly, [`<form-validation-list>`](/notebook/visual-validation-feedback-for-form-fields/) exposes custom properties for icon size, matched and unmatched colors, and similar design choices. That makes it relatively straightforward to adapt the component to a site’s design without touching the component’s behavior.

In both cases, custom properties provide a simple way to alter the look and feel of the component directly from a stylesheet.

## Fallback, carefully

Even though I complained about it at the time, I don’t want to gloss over the importance of fallbacks for custom properties. Used properly, they ensure our designs are robust and progressively enhanced.

Take the following, for example:

```css
:root {
  --flow-space: 1.5em;
}

.flow > * + * {
  margin-block-start: 1em;
  margin-block-start: var(--flow-space, 1em);
}

.compact {
  --flow-space: 0.75em;
}
```

In this code sample, the second declaration (`.flow > * + * {}`) establishes space between adjacent children through two different methods: First, it sets a standard block-start margin using a standard value (`1em`), then it overrides that value with a custom property (`var(--flow-space, 1em)`).

Browsers that understand custom properties use the value of `--flow-space` because that rule comes later in the CSS rule set. Browsers that don’t, ignore that rule when they encounter `var()` and don’t understand the syntax (following the rules of fault tolerance). They apply the initial `1em` rule instead.

The second argument in `var()` handles a different situation. In a browser that supports custom properties, it provides a backup value the browser can use when the referenced property is missing or has an invalid value. This feature enables more resilient design by ensuring things don’t break if the custom prop’s value becomes unacceptable in the current rule.

Here’s a silly example:

```css
.notice {
  --notice-color: 20px;

  color: #333;
  color: var(--notice-color);
}
```

In a browser that supports `var()`, the initial color rule (`color: #333`) isn’t used. The custom property (`--notice-color`) exists but, after substitution, the winning declaration is effectively `color: 20px`. `20px` is not a valid `color` value. In this scenario, you might expect the browser to fall back to the previous color rule. It doesn’t.

This is an example of an [invalid-at-computed-value-time](https://www.w3.org/TR/css-variables-1/#invalid-variables) failure. The browser stores the `20px` value for `--notice-color` with no problem. However, when that value is used as a `color` (after the cascade has selected the declaration), it doesn’t apply. But instead of throwing out the rule (as it would if the value wasn’t recognized), the browser _inherits_ a `color` value from the element’s context. For other, non-inherited properties like `background-color`, the browser will assign the _initial_ value instead.

The browser won’t rewrite the custom property. It won’t go back through the earlier declarations looking for a replacement either.

Now, that’s a contrived example, but here’s a more realistic one. Imagine you want to use a newer color function in a custom property:

```css
:root {
  --button-background: #222;
  --button-background: color-mix(in oklab, #e200ff, black 65%);
}

button {
  background-color: #222;
  background-color: var(--button-background);
}
```

That first custom-property assignment looks like a fallback. But a browser that supports custom properties and not `color-mix()` can retain the second assignment as a token sequence. The failure comes later, when it tries to use that sequence as a background color.

A more deliberate approach is to test the enhancement before assigning it:

```css
:root {
  --button-background: #222;
}

@supports (background-color: color-mix(in oklab, #e200ff, black 65%)) {
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

Now the known-good value remains unless the browser reports support for the color syntax we want to use. Browsers without custom-property support still have the literal background declaration. We’d also need to check contrast for the enhanced color; feature detection can tell us whether the syntax is supported, not whether our design choices are accessible.


Neither fallback is mandatory. Sometimes an inherited value or the browser’s default choice offers a good enough baseline experience. It’s good to know we have these options though, and a modest amount of redundancy when it matters is a small price to pay.



There is one wrinkle worth spending time on, particularly in a discussion of progressive enhancement: a browser supporting custom properties doesn’t mean every value we put in one will work.


None of this means we should avoid custom properties. It means we need to distinguish unsupported syntax from a value that becomes invalid after substitution. The fallback mechanisms address different problems.

## Where that leaves me

Eric’s question was a useful nudge to revisit an opinion I’d left sitting on the Web long after my own work had moved on.

I still care about the concern behind that old post: people should have a usable experience when a particular enhancement isn’t available. But I now have plenty of reasons to use custom properties in service of that goal. They let me respond to preferences, adapt components to their context, and share resolved styling information without maintaining parallel systems.

If you’re deciding between a preprocessor variable and a custom property, consider when the value needs to be resolved, and what needs to influence it. If it needs to respond to the person, the document, or a component’s surroundings, resolving it in the browser can be genuinely useful. Then check what happens when the value—or the enhancement consuming it—isn’t available.

That’s the question I should have spent more time on in 2014.

[^registration]: You can change the inheritance behavior of a custom property by registering it with [`@property`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@property). Registration can also define its syntax and an initial value. The examples here use unregistered custom properties.
