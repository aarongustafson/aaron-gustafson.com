---
title: "Will Serving Real HTML Content Make A Website Faster? Let's Experiment!"
date: 2022-10-07T17:31:05.016Z
tags: ["JavaScript", "performance"]
ref_url: https://blog.webpagetest.org/posts/will-html-content-make-site-faster/
in_reply_to: https://blog.webpagetest.org/posts/will-html-content-make-site-faster/
twitter_text: "Loving @scottjehl’s in-depth performance comparison between serving HTML and JavaScript that builds HTML. No surprise: HTML wins every time."
ref_source: "WebPageTest Blog"
---

When you’ve worked on the web for as long as I have, you see trends come and go. I’ve witnessed at least three different eras where folks began to put all their eggs in the JavaScript basket, only to realize the massive hits they were taking to performance.

In this piece for WebPageTest, Scott Jehl uses a new "experiments" feature to demonstrate how serving HTML would make a ton of popular websites much, much faster. Some of these companies learned this lesson previously (and even [wrote about it](https://medium.com/airbnb-engineering/isomorphic-javascript-the-future-of-web-apps-10882b7a2ebc)) only to have thrown their own advice out the window, which is disappointing.

Serving HTML will always result in faster page loads. There is no way around that. Sending your JavaScript framework to the client and having it render the HTML adds a ton of extra steps:

1. Download skeleton markup
1. Download high priority JavaScript file(s) and CSS
1. Load JavaScript program into memory
1. Execute JavaScript
1. Generate actual markup (and replace skeleton)
1. Request assets referenced in markup (e.g., images, videos)
1. **Render page**
1. Load deferred assets

Compare that to the HTML-first route:

1. Download markup
1. Download high priority JavaScript file(s) and CSS
1. Request assets referenced in markup (e.g., images, videos)
1. **Render page**
1. Load deferred assets

Sure, on subsequent navigations having JavaScript request only the bits and pieces you need is a performance win, but that first render is a beast. And you can totally load that JavaScript later, after the page is rendered.
