---
title: "Pondering fallback content"
date: 2017-03-30 20:00:50 -04:00
comments: true
tags: [HTML, "web standards", "progressive enhancement"]
description: " I’ve been thinking a lot about media formats and what happens when a user’s browser encounters a `video`, `audio`, or `picture` element that only includes formats it doesn’t support."
crossposted:
  Medium: https://medium.com/@AaronGustafson/a02bfa999bdc
---

I don’t remember what got it stuck in my craw, but I’ve been thinking a bit about HTML fallbacks of late. <!-- more -->If you’re unfamiliar, consider the following `picture` element:

```html
<picture>
  <source type="image/webp" srcset="/i/j/r.webp" />
  <img src="/i/j/r.jpg" alt="" />
</picture>
```

This `picture` element has two children: one `source` referencing a WebP image and an `img` element referencing a JPG. This pattern demonstrates how `picture` elements must be built in order to validate, but it also reinforces a best practice that uses the fault tolerant nature of HTML parsers to guarantee every user gets something.

In very simplistic terms, here’s what happens when a browser encounters this markup:

1. The browser recognizes the `picture` element and begins parsing its content to determine how to render it, or
2. The browser doesn’t recognize the `picture` and ignores it, moving inside to look for any elements it might recognize.

In practical terms, this markup delivers two potential experiences. Older browsers that haven’t implemented `picture` get the JPG image. Newer browsers that have implemented `picture` get either the WebP (if they support that format) or the JPG (if they don’t). In this scenario, the `img` element can be (and often is) referred to as "fallback content".

So why have I been thinking about fallback content? Well, I’ve been thinking a lot about media formats and what happens when a user’s browser encounters a `video`, `audio`, or `picture` element that only includes [formats it doesn’t support](https://developer.mozilla.org/docs/Web/HTML/Supported_media_formats). For instance: A `video` element that only offers an AVI `source` is highly unlikely to be playable in any browser.[^1]

[^1]: Safari is the only possible exception here, and that’s only if QuickTime supports the particular CODEC that was used to create the AVI in the first place. Pretty slim odds.

```html
<video>
  <source src="my.avi" type="video/avi" />
</video>
```

So what happens when most browsers encounter this markup? Nothing. Blank space. If you added a poster, that would be shown, but the user gets no video controls and receives no indication that it should even be video content.

This is the correct behavior, [according to the spec](https://html.spec.whatwg.org/#the-video-element):

> When no video data is available (the element’s `readyState` attribute is either `HAVE_NOTHING`, or `HAVE_METADATA` but no video data has yet been obtained at all, or the element's `readyState` attribute is any subsequent value but the media resource does not have a video channel) … The `video` element represents its poster frame, if any, or else transparent black with no intrinsic dimensions.

It’s also a pretty crappy user experience if you ask me. Now it’s worth noting that the spec does allow for a better experience, but it doesn’t require it:

> User agents that cannot render the video may instead make the element represent a link to an external video playback utility or to the video data itself.

That would offer a much better experience. Of course, since it’s not a requirement for standards-compliance, it’s not guaranteed. In fact, I have yet to encounter a browser that provides that kind of affordance. So if we want our users to receive that kind of a fallback, we need to it using a tool we do control: HTML. Here’s a stab at what that might look like:

```html
<video>
  <source src="my.avi" type="video/avi" />
  <p>
    Your browser doesn’t support AVI, but you can
    <a href="my.avi" download>download this movie</a>
  </p>
</video>
```

Given how fallbacks work, you might expect a browser to offer up the inner paragraph and download link when it realizes there is no video data it can play. Sadly that’s not the case. They all still display either an empty space or the `poster` image.[^2]

## A better way?

Obviously the paragraph fallback would be best, but I have no concept of how difficult that would be to do. So what if browsers did expose _our_ fallback content when the only media types on offer are ones they don’t support?

It seems like this would offer a number of benefits:

1. Authors without the requisite skill or knowledge necessary to transcode media into the various formats necessary for cross-browser support would not be penalized (nor would their users);
2. CMS developers could provide a standardized, expected fallback pattern without worrying that content contributors might only upload one format that isn’t universally supported; and
3. It would allow these elements to be more forward _and_ backward compatible—newer media formats could be rolled out easily without sacrificing a page’s usability in non-supporting browsers.

That last one is the biggie for me. We want to support as many users as possible, now and well into the future. This might be a way to reliably do that.

I [took a Twitter Poll](https://twitter.com/aarongustafson/status/847475329065041921) to gauge your thoughts, but that was just a yes/no. I’d love to know your detailed thoughts on this. Is there be any downside to this approach?

[^2]: In case you’re interested, [I put together a CodePen walking through some of these scenarios](http://codepen.io/aarongustafson/pen/BWVbLG).
