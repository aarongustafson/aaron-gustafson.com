---
title: "The DOM Is NOT Slow, Your Abstraction Is"
description: "Frameworks can be great and abstraction can be helpful, but it also complicates things and leads to slower performance."
date: 2015-04-22 09:36:28 -04:00
comments: false
ref_url: http://webreflection.blogspot.se/2015/04/the-dom-is-not-slow-your-abstraction-is.html
in_reply_to: http://webreflection.blogspot.se/2015/04/the-dom-is-not-slow-your-abstraction-is.html
ref_source: WebReflection
---

Abstraction can be helpful, but it also complicates things and leads to slower performance. [Andrea Giammarchi](https://twitter.com/WebReflection) provides lots of details here in examining a complex app scenario with the good old fashioned DOM vs. a handful of frameworks. Bonus points for the fact that most of the video evidence tests are being run on non-iOS devices!

> No, the DOM is not your problem, the fact you brought an over-engineered abstraction on top of a deadly simple task, like a table that needs some quick update, is the real problem you don't want to see.

If you dig Andrea’s post, you should also check out [this post from the Filament Group](http://www.filamentgroup.com/lab/mv-initial-load-times.html).