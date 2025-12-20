---
title: "Please size your inline SVGs"
date: 2023-08-21 14:11:09 -07:00
comments: true
tags: ["CSS", "design", "HTML", "SVG", "web design"]
description: "If you don’t explicitly set the dimensions of your inline SVGs, they’ll render full width when your CSS isn’t applied properly."
twitter_text: "#ProTip: If you don’t explicitly set the dimensions of your inline SVGs, they’ll render full width when your CSS isn’t applied properly."
hero:
  src: /i/posts/2023-08-21/hero.jpg
  credit: "Aaron Gustafson × DALL·E"
  alt: "Digital art. A blueberry with arms and legs like a person. It’s sitting on the ground with its back to the viewer and is clearly crying. The tears are pooling around it on the ground."
  url: https://labs.openai.com/s/tqvw9pF4pLS0MlnZAF3wLG6c
  offset: "100"
crossposted:
  Medium: https://medium.com/@AaronGustafson/please-size-your-inline-svgs-4f915f59e48c
---

While it is a bit of an edge case, every now and then I’ll hit a site—yes, even a high profile one—and the CSS will fail to load for some reason. When this happens, inevitably every inline SVG resource on the page will grow to fill the entire width of my viewport, making for a _really_ awkward experience.

<!-- more -->

## What’s the issue?

Not to pick on anyone in particular, but consider [this example from a recent talk I gave](https://presentations.aaron-gustafson.com/uygzjR/progressive-enhancement-where-do-i-begin#saVRzdC):

<figure id="2023-08-21-01">

![](https://www.aaron-gustafson.com/i/posts/2023-08-21/01.png){width=696}{height=481}

<figcaption>The U.S. Transportation Safety Administration’s TSA PreCheck® landing page, with CSS applied.</figcaption>
</figure>

When CSS fails to load, however, check out what happens:

<figure id="2023-08-21-02">

![](https://www.aaron-gustafson.com/i/posts/2023-08-21/02.png){width=696}{height=481}

<figcaption>The U.S. Transportation Safety Administration’s TSA PreCheck® landing page, without CSS applied. Note the **huge** SVG.</figcaption>
</figure>

Yeah, that’s an inline SVG. You see, without any explicit dimensions set, the SVG will naturally grow to become as large as possible. Chances are you’re constraining that growth in CSS somewhere, but when your CSS fails to apply for any reason, every inline SVG on your site will swell like [Violet Beauregarde after eating Willy Wonka’s "three-course dinner" chewing gum](https://roalddahl.fandom.com/wiki/Violet_Beauregarde).

## How do we solve this?

Thankfully, this is a pretty easy situation to avoid: just set an explicit `width` and `height`. To use an example from this site, instead of saying

```html
<svg viewBox="0 0 38 48" version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>
```

You can explicitly set the `width` and `height` in the `svg` element like this:

```html
<svg
  width="38"
  height="48"
  viewBox="0 0 38 48"
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
></svg>
```

What you set these values to will likely vary depending on how the icon is being used. In a pinch, you could also pull the values directly from the `viewbox` value. And using that value, you could even make the inline values dynamic within your template, reading in the `viewbox` values and tweaking them to a ratio specific to the context.

Setting the SVG’s dimensions inline like this doesn’t restrict their flexibility either. You can still use CSS to override these inline values and set the SVG to whatever size you wish:

```css
svg {
  inline-size: 200px;
  block-size: 200px;
}
```

I’ve thrown together a quick comparison over on CodePen so you can see the three different states:

<figure id="2023-08-21-03">
{% CodePen "https://codepen.io/aarongustafson/pen/JjwoLME", "result", "500" %}
</figure>

And now that you know, please, please, _please_ take a few minutes to make this small, simple change to your websites. While not a catastrophic issue, taking care to control how your sites render in the worst of circumstances goes a long way to demonstrating thoughtful consideration of your users.

<hr>

**Update:** For more in-depth info on this topic (and scenarios where CSS isn’t applied to your SVGs), be sure to check out [this piece from Sara Soueidan](https://www.sarasoueidan.com/blog/svg-style-inheritance-and-fousvg/).
