---
title: "Who Should Pay?"
date: 2015-02-18 20:35:06 -08:00
comments: true
tags: ["web design","progressive enhancement",empathy,performance]
description: "A handful of conversations I’ve had lately have boiled down to the tradeoffs between what is more convenient for developers and what is more convenient for our customers. I thought it worth collecting my thoughts to share with you."
photo:
  src: 
  credit: STOck You
  source: https://www.flickr.com/photos/63863986@N04/9503663266/
---

In more than a handful of conversations lately, it’s become quite clear that we, the web development community, are prioritizing our own convenience and our own time over that of our users. With our industry’s focus on “user-centered design”, you might find that hard to believe, but it’s true.

<!-- more -->

Here’s one example. In reaction to [my post on why I think CSS variables are a bad idea](/notebook/css-variables-are-a-bad-idea/), [SASS](http://sass-lang.com) core team member [Chris Eppstein](https://twitter.com/chriseppstein/) had this to say:

https://twitter.com/chriseppstein/status/567756897105620992

Fundamentally, I agree with his sentiment: A preprocessor should *not* be a requirement for authoring CSS. Thankfully, *it never was*; you can build amazing things using only hand-authored CSS. And if you find a preprocessor helpful to your process for one reason or another, great. But using a preprocessor never has been (nor should it ever be) a requirement.

But Chris was not railing against preprocessors. Instead, he is echoing a sentiment held by many people in the preprocessor community. He feels CSS is not as powerful as it could/should be and he hopes that one day soon preprocessors won’t need to exist because CSS will have all of the features they offer natively. Like variables.

I used to feel that way. I used to want variables… and mixins… and functions… and loops… and declaration block-level inheritance. But I’ve changed my mind.

Don’t get me wrong, I love these constructs. I use them nearly every day in the SASS I write and I am incredibly thankful for the hard work that has gone into their creation and maintenance.  Chris alone has probably saved me several weeks worth of work over the last four years through his contributions to SASS and [Compass](http://compass-style.org/). I definitely owe him a beer (or three).

Ok, so if my issue is not with the idea of programmatically generating styles, why would I not want these to be part of CSS, the <i>lingua franca</i> for design on the Web? Well, it’s pretty simple: Converting all of these constructs into something that is actionable by the browser takes time and processing power. Someone has to pay that cost and I wouldn’t feel right passing that cost on to my end users if there are better options.

This is a topic I bring up often in my conference talks and workshops: Every decision we make affects the user experience in some way.

When we add another JavaScript library or plugin, it’s no big deal from our perspective. We tend to have fast connections and faster processors. For our users it’s another story: It’s one more thing to request. One more thing to download. One more script to parse. One more thing holding up page rendering. One more reason to leave our site and seek out a competitor who actually values their time.

When we hide an `img` in the small screen version of our responsive design using `display: none`, the cost to us is quite minimal. It’s just one little declaration. What’s the harm? But the cost to our end users is quite significant: Longer load times, slower performance, and (in some cases) in real dollars if they are on a [metered data connection](http://blog.kaspersky.com/cost-aware/). And they don’t even get to see the image they paid for!

When we decide to build a site using a front-end JavaScript MVC framework, it can make the development process go so much faster for us and we can reduce our need for a robust back-end infrastructure. I mean everyone has JavaScript these days… [the browser is the new VM](/notebook/a-fundamental-disconnect/). But when we do this, our users suffer because we don’t give their browsers real HTML. Instead we force them to download a hefty framework so we can move all of the processing we would normally handle on a much faster, dedicated server to their questionably-capable machine instead. Oh, and if the browser encounters an error while parsing or executing the JavaScript execution, they don’t get anything at all. Welcome to the Modern Web™!

<hr>

When I look around, I see our community spending a lot of time coming up with new tools and techniques to make our jobs easier. To ship faster. And it’s not that I’m against efficiency, but I think we need to consider the implications of our decisions. And if one of those implications is making our users suffer—or potentially suffer—in order to make our lives easier, I think we need to consider their needs above our own.

So yes, I would love a world where preprocessors are unnecessary, but I would much rather spend a few seconds (or even a few minutes) transcompiling my SASS into CSS in order to save my users even a few milliseconds. It’s the same reason I optimize my images, minify my JavaScript, use Gzip, and lazy load design and experience enhancements only in contexts where they provide a real benefit.

Our users should never foot the bill for our convenience. We need to put their needs above our own.
