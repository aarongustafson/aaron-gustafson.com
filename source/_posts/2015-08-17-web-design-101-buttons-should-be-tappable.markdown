---
layout: post
title: "Web Design 101: 100% Tappable"
date: 2015-08-17 14:46:35 -0400
comments: true
categories: ["web design 101","web design",buttons]
description: "When you design something that looks interactive, always make sure the whole thing is actually tappable."
twitter_text: "When you design something that looks interactive, always make sure the whole thing is actually tappable."
---

I see this one all the time: something that looks like a button, but only a portion of it is tappable. Consider this example from a recent email I received (emails are notorious for this crap):

<figure id="fig-2015-08-17-01" class="media-container">{% adaptive_image /i/posts/2015-08-17/01.png %}<figcaption>A call to action from a recent email with the tiny tappable area highlighted within the much larger "button".</figcaption></figure>

This screenshot shows a very large call to action, which is good. Unfortunately, as the screenshot illustrates, the majority of the "button" is a table cell and the tappable link is just the text inside it.

The markup itself isn’t horrible; here’s a distillation of that row in the design:

{% gist 711cbd1054e8ee868a93 example.html %}

The problem is that the 15px padding and overall button styles were put on the table cell rather than the link itself. Setting the link to have a `display` of "block" or "inline-block" would allow it to be given vertical padding (which is probably the issue the designer was struggling with here). Then the remainder of the styles could be migrated without adjusting the design at all.

<figure id="fig-2015-08-17-02" class="media-container">{% adaptive_image /i/posts/2015-08-17/02.png %}<figcaption>The same email with the padding shifted to the link, making more of the "button" tappable.</figcaption></figure>

When you design something that looks interactive, *always make sure the whole thing is actually tappable*. It will go along way toward reducing user frustration.