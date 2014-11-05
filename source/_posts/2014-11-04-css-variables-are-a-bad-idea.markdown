---
layout: post
title: "CSS Variables are a Bad Idea"
date: 2014-11-04 14:58:01 -0500
comments: true
categories: [CSS, W3C, "web standards", "web design", "web development"]
description: "For numerous reasons I’ll outline here, I’m not convinced there’s an upside here."
---

I’ll level with you: I used to think I wanted variables in CSS.

As a programmer, I love the idea of being able to abstract reusable bits like colors, border widths, font sizes, and the like to obviously named variables. It’s a far more [DRY](https://en.wikipedia.org/wiki/Don't_repeat_yourself) approach and makes maintenance far easier.

Before I made the leap to using a CSS preprocessor, I was convinced we needed CSS variables, but I always wondered how we might make it possible without breaking one of the fundamental [design principles of CSS](http://www.w3.org/TR/CSS21/intro.html#design-principles): Forward and backward compatibility. Take a look at this example (which is based on [the working draft spec](http://www.w3.org/TR/css-variables/)) and I think you’ll spot the problem:

{% gist c3ddcb792eb69e0703e1 css-vairables.css %}

For a browser that understands CSS variables, the interpreted stylesheet would look like this:

{% gist c3ddcb792eb69e0703e1 desired-result.css %}

But any browser that doesn’t understand the variables would never get the color values because browsers follow [the rules of fault tolerance in CSS](http://www.w3.org/TR/CSS21/syndata.html#parsing-errors) and ignore anything they don’t understand. The introduction of variables to CSS would effectively build a wall between older browsers and new ones. (For the record, as of this writing, [only Firefox has implemented CSS variables](http://caniuse.com/#feat=css-variables)).

In order to serve the broadest spectrum of devices, we’d have to provide a fallback like this:

{% gist c3ddcb792eb69e0703e1 css-variables-fallback.css %}

But that kinda defeats the whole purpose, right?

Preprocessors already give us this access to variables today (along with nesting, mixins, and programmatic structures like conditionals, loops, etc.). Here’s a SASS example:

{% gist c3ddcb792eb69e0703e1 sass-variables.scss %}

The big difference here is that this document is a source file, it is not what is sent to the browser. This file is compiled by the preprocessor into actual CSS, which is what we send to the browser and is exactly what we wanted in the first place:

{% gist c3ddcb792eb69e0703e1 desired-result.css %}

And it works on every browser that supports CSS, all the way back to [IE 3](https://en.wikipedia.org/wiki/Cascading_Style_Sheets#Difficulty_with_adoption).

With a preprocessor like SASS, Less, or Stylus, I get all of the maintainability benefits without sacrificing browser support. It’s a no-brainer. But even if that were not true, there’s another issue to consider: If I push CSS variables to browsers, they have to parse the CSS and substitute the variables before they can apply the styles.

Now I’m sure browser makers can find ways to optimize this process, but it’s bound to affect the rendering time. And not in a positive way. I don’t even want to think about how bad it would be on a mobile chipset, especially on a low-end device.

Honestly, I love using variables… in the source files I use with a preprocessor. Given the potential loss of browser support, the pointless fallbacks I’d have to use if I wanted to continue supporting older browsers, the existence of numerous preprocessor options that solve the abstraction problem in a backward- and forward-compatible way, and the fact that CSS variables would make browsers have to work even harder to achieve the desired result, I’m not convinced we need them.

CSS variables are a bad idea.