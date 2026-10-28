---
title: "Zoom Layouts v2"
date: 2013-09-16 15:56:00
comments: true
tags:
  - "responsive web design"
  - "CSS"
  - "accessibility"
description: "Some of you might find it hard to believe, but I began working with adaptive layouts way back in 2005. I was working on project for the Connecticut Department of Transportation and my primary design made heavy use of fixed positioning..."
canonical: "https://blog.easy-designs.net/archives/zoom-layouts-v2/"
atUri: "at://did:plc:6rmgrvblxflqh34omwywu6ib/site.standard.document/3mxrnwnimwo2e"
image: "/i/share-cards/zoom-layouts-v2.jpg"
meta_description: "Some of you might find it hard to believe, but I began working with adaptive layouts way back in 2005."
social_description: "Some of you might find it hard to believe, but I began working with adaptive layouts way back in 2005."
---

Some of you might find it hard to believe, but I began working with adaptive layouts way back in 2005. I was working on project for the Connecticut Department of Transportation and my primary design made heavy use of fixed positioning and white space. Sadly this is the only screenshot I have of the now-defunct project:

<figure style="max-width:320px">
<img alt="" src="/i/posts/2013-09-16/drink-drive-lose-ad-challenge.png"/></figure>

The layout really started to break down on smaller screens—we had quite a few 800x600 monitors to deal with back in the day—so, inspired by Joe Clark’s A List Apart article “[Big, Stark & Chunky](http://alistapart.com/article/lowvision),” I created an alternate stylesheet that rearranged the page layout, enlarged the text, and improved the reading experience. Sadly, I don’t have a screenshot of what that looked like, but here’s a decent approximation (sans background images), courtesy of the Wayback Machine:

<!-- more -->

<figure>
<img alt="" src="/i/posts/2013-09-16/drink-drive-lose-ad-challenge-small.png"/></figure>

We didn’t have media queries in those days, so I relied on JavaScript to do the stylesheet switching. It was pretty good work for the time, but I see a *ton* of things I would do differently if I had the opportunity to revisit it.

So why am I bringing this up? Well, I remembered Joe’s article the other day and was thinking about how relevant it is in this, the age of responsive design. I think the idea of high-contrast zoom layouts is incredibly useful, but not just for mobile. When you start to think about the other end of the spectrum—giant high-definition televisions sitting 8-10 feet from your face—zoom layouts become really useful again.

To that end, I have been thinking quite a bit about [the viewport-based units available to us in modern browsers](http://css-tricks.com/viewport-sized-typography/) and how we can use them to create automated zoom layouts by simply increasing the font size of the `<body>` element. Consider this bit of code:

```css

@media screen and (min-width: 64em) {
  body {
    font-size: 1.5625vw;
  }
}
```

This tiny bit of CSS can ensure that the entire layout is proportionately scaled up based on the screen size being used to access it. To figure out how this bit of code would fit best into your own work, use this formula (replace “X” with your max width size in ems):

```css

@media screen and (min-width: 64em) {
  body {
    font-size: 1.5625vw;
  }
}
```

The site I developed this technique for is not live yet, so I threw together [a simple demo on Codepen](http://codepen.io/aarongustafson/pen/ojqtr). *Note: Chrome currently requires a forced repaint on window resize to make it shrink or enlarge the layout. Hopefully [that bug](https://code.google.com/p/chromium/issues/detail?id=124331) will be fixed soon.*

I’m still feeling my way around this technique, but I am intrigued by the possibilities it holds. What do you think?
