---
title: "Canvas-ing the Web"
ref_source: "Eric Meyer"
date: 2026-06-17 11:30:00 +00:00
comments: true
tags: ["HTML", "CSS", "JavaScript", "web standards", "web components"]
description: "Eric Meyer tried HTML-in-canvas on a real banner-making tool and ran straight into the mismatch between a fixed canvas and fluid DOM content."
twitter_text: "Eric Meyer exercised HTML-in-canvas on a real banner-making tool, hit the tension between fixed canvas dimensions and fluid DOM content, and came away wondering whether the experiment points to a simpler primitive."
ref_url: https://meyerweb.com/eric/thoughts/2026/04/27/canvas-ing-the-web/
in_reply_to: https://meyerweb.com/eric/thoughts/2026/04/27/canvas-ing-the-web/
---

I’m glad [Eric Meyer tried HTML-in-canvas on an actual problem](https://meyerweb.com/eric/thoughts/2026/04/27/canvas-ing-the-web/), rather than stopping at a clever demo. He wanted coworkers to click a button in his browser-based banner tool and download a thumbnail. In getting there, he had to move a live custom element into a canvas without kicking off its lifecycle again, then make the canvas match content whose scale could change.

That second snag exposed the interesting bit:

<blockquote cite="https://meyerweb.com/eric/thoughts/2026/04/27/canvas-ing-the-web/">

> Canvases do not, as a rule, grow or shrink to fit their contents.  DOM elements, as a rule, very much do, unless you force them not to.  HTML-in-canvas is taking a very fluid, flexible, mostly unbounded layout paradigm and rasterizing it, or at least some of it, into a very bounded window of a given size.

</blockquote>

For Eric’s thumbnail, a bounded image is the goal, so the experiment works. I’m more intrigued by where he ends up: perhaps exercising HTML-in-canvas will show us which visual capabilities belong in a simpler HTML, CSS, or DOM primitive. The rough edges are doing useful work here.
