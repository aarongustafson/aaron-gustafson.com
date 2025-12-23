---
title: "ARIA Quicktip: Labelledby vs. Describedby"
date: 2014-11-05 10:45:22 -05:00
comments: true
tags: [accessibility, "web design", "WAI-ARIA"]
description: "The difference between the `aria-labelledby` and `aria-describedby` attributes is not obvious. Here’s a bit of a clarification for using them in forms."
redirect_from: /notebook/2014/aria-quicktip-labelledby-vs-describedby/
---

Last night, while we were enjoying a cool evening and a few drinks outside after day 1 of [BDConf](https://bdconf.com), [Jeremy](https://adactio.com) asked me for some clarification on the ARIA attributes I had demoed as part of [my forms presentation](https://www.slideshare.net/AaronGustafson/falling-in-love-with-forms-bdconf-2014) earlier in the afternoon. In particular, he was confused by how `aria-labelledby` and `aria-describedby` differ.

<!-- more -->

I hadn’t really thought about it before, but it’s a good question. They seem pretty similar in function, right? And both support a space separated list of one or more `id` references. It’s downright confusing.

My simple explanation was that, at least in terms of form fields, they differ in when they are read. The `aria-labelledby` attribute replaces the associated `label` element (which is, of course, associated with the field via the `label`’s `for` attribute). The `aria-describedby` attribute, on the other hand, is read after the field type is stated.

To demonstrate how all of this plays out, I threw together [a quick CodePen demo](https://codepen.io/aarongustafson/pen/dmuoe/) that takes you through numerous ways you can use and combine these attributes. I also did a [screen recording to demonstrate how ChromeVox exposes these attributes](https://youtu.be/U8_VjI-Z1LA):

https://www.youtube.com/watch?v=U8_VjI-Z1LA

**Update:** [Steve Faulkner](https://twitter.com/stevefaulkner) shared a doc that discusses [how accessible names and descriptions are calculated](https://www.w3.org/TR/accname-1.1/#x4-3-accessible-name-and-description-computation). Thanks Steve!

_Note: I did discover a bug in ChromeVox wherein the content of the elements referenced in `aria-describedby` are not read when the field receives focus via the keyboard (using the <kbd>tab</kbd> key), but it does when it receives focus via the mouse. I’ve submitted [a bug report](https://code.google.com/p/google-axs-chrome/issues/detail?id=158&thanks=158&ts=1415202123) to to the powers that be._
