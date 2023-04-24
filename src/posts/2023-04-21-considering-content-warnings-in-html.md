---
title: "Considering content warnings in HTML"
date: 2023-04-21 15:15:48 -07:00
updated: 2023-04-24 14:39:48 -07:00
comments: true
tags: ["HTML", "inclusive design"]
description: "Prompted by a recent suggestion in the Web We Want inbox, I gave some thought to the potential for allowing authors to provide content warnings in their markup."
twitter_text: "Prompted by a recent suggestion in the @WebWeWantFYI inbox, I gave some thought to the potential for content warnings in HTML markup."
hero:
  src: /i/posts/2023-04-21/hero.jpg
  credit: "Aaron Gustafson × DALL·E"
  alt: "A photo of a cute stuffed animal monkey with its hands over its eyes. Camera is tightly framing its head. Its eyes are not visible as they are completely covered by its hands."
  offset: "10"
---

One of the features I really love about Mastodon is their first-class Content Warning feature. With one additional step, you can add any warning of your choice to your post and it will be hidden by default, showing only the content warning text. It’s a super-simple idea, but so powerful when it comes to reducing potential the likelihood of causing our readers to experience the kinds of trauma that could have severe consequences.

<!-- more -->

Earlier today, [the idea of a "spoiler / content warning" element popped onto my radar through the Web We Want inbox](https://github.com/WebWeWant/webwewant.fyi/issues/615). It referenced [a discussion over on the WICG](https://discourse.wicg.io/t/standardized-spoiler-tag/5814) and I was intrigued but the potential of this kind of feature for HTML. Some folks suggested progressive disclosures like `details`/`summary` was the way to go, but that approach is limited to flow content (and fraught with a host of issues).

## Markup possibilities

I wasn’t sold on the idea of a `spoiler` element either, as that’s a pretty specific use case of a content warning. And so I wondered, _what if instead of an element, we introduced an attribute that could take the kind of content warning as its value_. For example, consider the following:

```html
<article content-warning="child abuse">
  … article contents …
</article>
```

This would identify the entire article as discussing child abuse. Obscuring that behind a warning would probably be a good idea.

Or perhaps the content warning should apply to an image:

```html
<img content-warning="violence gore" …>
```

Or, to return to the original idea of a spoiler, it could also be applied inline:

```html
I thoroughly enjoyed the film, especially
when it was revealed that
<b content-warning="spoiler">Taye Diggs
had been the bad guy all along</b>.
```

## Necessary behaviors

When considering how content behind a warning should be handled, there are a few things that jump immediately to mind:

1. Indicated content should be obscured by default.
1. Users must choose to reveal the content.
1. Content should not be included in the "find in page" index.
1. Images should not be downloaded until they are requested (or there is a good chance they will be needed).

There’s also an interesting opportunity for browsers to offer user preferences around this approach as well. For example, I may never want to be shown content that deals with rape, so I could configure that in my preferences and the browser could take additional steps to hide that content from me or at least make sure I actually want to reveal it by requiring a second step for final approval (i.e., _Are you actually sure you want to see this?_).

## Demo

I threw together [a quick & dirty demo of what the experience could be like](https://codepen.io/aarongustafson/pen/rNqjeqj) on Codepen if you’d like to take a look:

<figure id="2023-04-21-01">

{% CodePen "https://codepen.io/aarongustafson/pen/rNqjeqj", "result", "500" %}

</figure>

It’s still a work-in-progress, but it’s a starting point. Ideally the browser would handle all of this directly, rather than us having to author CSS and/or JavaScript to implement the feature ourselves. (Though maybe we could get access to style parts of the overlay.)

## Thoughts?

What do you think? Is this something you’d like to see on the web? I’d love to hear your thoughts, which you can share by Webmention-ing this post or referencing it on Mastodon.

## Update 2023-04-24

[James Edwards mentioned the potential interplay issues with Reader Mode (and similar)](https://mastodon.world/@siblingpastry/110254145981433059) so I started playing around with an alternate approach. I landed on a version that physically swaps out the elements in the DOM for a custom element `content-warning` that acts as a placeholder. Here’s how it works:

1. Author uses `content-warning` attribute as described above.
1. The runtime script swaps that element for the custom `content-warning` element, which contains a wrapper element (`span`) that is sized to occupy the same space as the original element (including margins).
1. The content warning text is used to label a `button` inside that wrapper.
1. Clicking the `button` swaps the original element back into position and announces it to screen reader users (using `role="alert"`).

I tested this approach with VoiceOver and JAWS and it works a treat. I also confirmed the Edge’s Reader Mode does not deliver the hidden content.

<figure id="2023-04-21-02">

{% CodePen "https://codepen.io/aarongustafson/pen/QWZpqPe", "result", "500" %}

</figure>

Note: The browser doing the work of my demo would be much faster as it could do all the size calculations prior to rendering. I am having to fake that in JavaScript, so I have to peg it to the window’s `onload` event to ensure all CSS is applied to get the size calculations right.