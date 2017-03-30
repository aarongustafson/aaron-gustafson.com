---
layout: post
title: "Pondering fallback content"
date: 2017-03-30 13:00:50 -0400
comments: true
tags: []
description: ""
published: false
---

I don’t remember what got it stuck in my craw, but I’ve been thinking a bit about HTML fallbacks of late. <!-- more -->If you’re unfamiliar, consider the following example of a `picture` element:

{% gist a42986eb7d542c03b65b3ef1308f91b1 %}

Here we have a `picture` element with two children: one `source` referencing a WebP image and an `img` element referencing a JPG. This pattern demonstrates how `picture` elements must be built in order to validate, but it reinforces a best practice that uses the fault tolerant nature of HTML parsers to guarantee users get something.

In very simplistic terms, here’s what happens when a browser loads the page containing this markup:

1. The browser recognizes the `picture` element and begins parsing its content to determine how to render it, or
2. The browser doesn’t recognize the `picture` and ignores it, moving inside to look for any elements it might recognize.

In practical terms, this markup delivers two potential experiences. Older browsers that haven’t implemented `picture` get the JPG image. Newer browsers that have implemented `picture` get either the WebP if they support that format or the JPG if they don’t.

In this pattern, the `img` element can (and often is) referred to as "fallback content".

So why have I been thinking about fallback content? Well, I’ve been thinking a lot about media formats and what happens when a user’s browser encounters a `video`, `audio`, or `picture` element that only includes [formats it does not support](https://developer.mozilla.org/docs/Web/HTML/Supported_media_formats). For instance, an AVI referenced by a `video` is highly unlikely to be playable in any browser.[^1]

[^1]: Safari is the only possible exception here, and that’s only if QuickTime supports the particular CODEC that was used to create the AVI in the first place.

{% gist ec877910f2a22568776b10a32b7ce8a0 video-avi.html %}

So what happens when most browsers encounter this markup? Nothing. Blank space. If you added a poster, that would be shown.



http://codepen.io/aarongustafson/pen/BWVbLG