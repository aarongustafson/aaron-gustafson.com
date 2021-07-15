---
title: "Visualizing CSS3 Transformations"
date: 2014-12-18 16:53:18 -05:00
comments: true
tags: ["web design", CSS, "web standards"]
description: CSS transformations are amazing, but they can be confusing too. I put together a browser-based tool that should help you understand how the functions are applied and why it matters.
crossposted:
  Medium: https://medium.com/@AaronGustafson/cf9b0b5aab47
---

It’s pretty amazing what you can do with [CSS3 transforms](http://dev.w3.org/csswg/css-transforms) these days, but I often struggle with explaining the importance of function order when I am training people on how to use them. Transformation functions are a visual thing, so they require a visual tool to fully understand them and the implications of your function order decisions.

<!-- more -->

To address this need, I put together [a tool that dissects CSS3 transforms](http://codepen.io/aarongustafson/full/jEryLV/) so the transform process would be more clear for my students. I decided to throw it up on Codepen so you could learn from it as well. Why don’t you open that link and I’ll explain how it works. (Obviously, you’ll need to be in [a browser that supports transforms](http://caniuse.com/#feat=transforms2d) for the tool to be useful to you.)

The tool starts you off with a simple three-function `transform` that includes both `translate` and `rotate` functions. If you hit the "Show Me" button, the browser will draw a box and step you through the application of the `transform` functions, one by one, animating their application so it’s easy to follow. This makes it pretty clear why an element ends up where it does.

Beside the "Show Me" button is the "Rearrange" button. It does exactly what you’d think: It rearranges the functions into a new, random order. If you press it and then press "Show Me" again, you can see if (and why) the element ends up in a different place. The original box remains ghosted out so you can see any differences.

Here’s a video of me playing around with the default `transform` stack:

https://vimeo.com/114921831

Have a play and let me know your thoughts. I hope you find this tool as helpful as I (and my students) have.
