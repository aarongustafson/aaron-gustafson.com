---
title: "One Person’s Bloat…"
date: 2016-10-25 15:15:01 -04:00
comments: true
tags: [performance, "web design"]
description: "I am a big fan of simple tools that provide an often much-needed reality check on a project, but I think the Web Bloat Score Calculator needs to be considered in context and with knowledge of its limitations."
---

<figure id="fig-2016-10-25-1" class="media-container">

![]({{ site.url }}/i/posts/2016-10-25/webbloatscore.png)

</figure>

The [Web Bloat Score Calculator](http://www.webbloatscore.com/) has been making the rounds on Twitter and I wanted to share my immediate thoughts on it.

<!-- more -->

First off, I am a big fan of simple tools that provide an often much-needed reality check on a project. Based squarely on its simplicity, I’d put this tool right up there alongside [WebPageTest](https://www.webpagetest.org/) and [What Does My Site Cost?](https://whatdoesmysitecost.com/). The Web Bloat Score (or WebBS… clever) Calculator is about as simple an interface as you can get: Enter a URL & hit the "Calculate" button.

When you do this, the service runs two tasks:

1. Load the URL and all of its assets, calculating a total page weight and chronicling the number of requests required to get there; and
2. Generate a static screen capture of the page and then grab its file size.

Once it has these two bits of info, it compares the real file size of the tested page against the image version to come up with your WebBS.

I [ran the calculator against the 10k Apart contest homepage](http://www.webbloatscore.com) and here are the results:

| URL                    | Page Size                             | Requests | Image Size                            | WebBS |
| :--------------------- | :------------------------------------ | :------- | :------------------------------------ | :---- |
| https://a-k-apart.com/ | 200 <abbr title="kilobytes">kB</abbr> | 49       | 195 <abbr title="kilobytes">kB</abbr> | 1.03  |

Not too bad, considering [the number of images on the page](http://www.webbloatscore.com/Details/612ea9a9-c548-4e20-99d1-910b449ba2c4) and the interactivity of the SVG. In the documentation about the tool, they have this to say about a high WebBS:

> A high WebBS usually indicates unused stuff on the page: JavaScript, CSS, oversized images, etc. Maybe you have a valid reason for that content. But more often than not, it means you can optimize it more.

I completely agree with the sentiment here: smaller is better and if there’s a huge discrepancy between the file size of an image of your page and the page itself, there _may_ be something not so awesome going on behind the scenes. They reference Amazon as being particularly bad, with a WebBS of 20 ([I got 12.3 in my test](http://www.webbloatscore.com/Details/4abea720-677c-48f6-9ff2-2b816424be06), but Amazon frequently changes their homepage).

There’s always room for improvement when it comes to optimization, but I also worry about folks getting too hung up on numbers like this, especially striving for a score of 1 or less. Here are a few legitimate reasons your score may be more than 1:

- **Your page is heavily interactive.** The calculator does not take into account any sort of interactivity—progressively enhanced or not—nor does it tell you how well-optimized your JavaScript code is. There’s also the possibility that you’ve consciously decided to trade verbosity for speed. For large loops, for instance, [Duff’s device](https://en.wikipedia.org/wiki/Duff%27s_device) is much faster but a lot more verbose than a normal `for` loop.
- **Your page serves alternate file formats.** The tool runs [SlimerJS](http://slimerjs.org/) to collect the performance data and, for instance, it doesn’t currently support WebP images. We serve WebP with a JPG or PNG fallback on the 10k Apart site (using `picture`), but [the file log](http://www.webbloatscore.com/Details/612ea9a9-c548-4e20-99d1-910b449ba2c4) doesn’t include the WebP images at all.
- **You make use of micro-optimizations.** Perhaps you use [`loadCSS`](https://github.com/filamentgroup/loadCSS) or [`loadJS`](https://github.com/filamentgroup/loadJS) or split your CSS into a default and advanced stylesheet (with the advanced one only loading if media queries are supported). Perhaps you lazy load images or fonts via JavaScript. Perhaps you only load certain assets or scripts based on browser capabilities. The calculator takes none of this into account.

These are just three reasons to take your WebBS with a grain of salt. It’s good for a gut-check, but I wouldn’t spend a whole lot of time worrying about getting your score at or below 1.
