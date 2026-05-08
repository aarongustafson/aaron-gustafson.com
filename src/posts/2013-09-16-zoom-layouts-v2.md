---
title: "Zoom Layouts v2"
date: 2013-09-16 15:56:00
comments: true
tags:
  - "accessibility"
  - "mobile"
  - "web standards"
  - "CSS"
  - "web development"
description: "Some of you might find it hard to believe, but I began working with adaptive layouts way back in 2005. I was working on project for the Connecticut Department of Transportation and my primary design made heavy use of fixed positioning..."
canonical: "https://blog.easy-designs.net/archives/zoom-layouts-v2/"
---

<p>
	Some of you might find it hard to believe, but I began working with adaptive layouts way back in 2005. I was working on project for the Connecticut Department of Transportation and my primary design made heavy use of fixed positioning and white space. Sadly this is the only screenshot I have of the now-defunct project:</p>
<figure style="max-width:320px">
<img alt="" src="/i/posts/2013-09-16/drink-drive-lose-ad-challenge.png"/></figure>
<p>
	The layout really started to break down on smaller screens—we had quite a few 800x600 monitors to deal with back in the day—so, inspired by Joe Clark’s A List Apart article “<a href="http://alistapart.com/article/lowvision">Big, Stark <span class="amp">&amp;</span> Chunky</a>,” I created an alternate stylesheet that rearranged the page layout, enlarged the text, and improved the reading experience. Sadly, I don’t have a screenshot of what that looked like, but here’s a decent approximation (sans background images), courtesy of the Wayback Machine:</p>

<!-- more -->

<figure>
<img alt="" src="/i/posts/2013-09-16/drink-drive-lose-ad-challenge-small.png"/></figure>
<p>
	We didn’t have media queries in those days, so I relied on JavaScript to do the stylesheet switching. It was pretty good work for the time, but I see a <em>ton</em> of things I would do differently if I had the opportunity to revisit it.</p>
<p>
	So why am I bringing this up? Well, I remembered Joe’s article the other day and was thinking about how relevant it is in this, the age of responsive design. I think the idea of high-contrast zoom layouts is incredibly useful, but not just for mobile. When you start to think about the other end of the spectrum—giant high-definition televisions sitting 8-10 feet from your face—zoom layouts become really useful again.</p>
<p>
	To that end, I have been thinking quite a bit about <a href="http://css-tricks.com/viewport-sized-typography/">the viewport-based units available to us in modern browsers</a> and how we can use them to create automated zoom layouts by simply increasing the font size of the <code>body</code> element. Consider this bit of code:</p>
<pre class="css"><code>
@media screen and (min-width: 64em) {
  body {
    font-size: 1.5625vw;
  }
}
</code></pre>
<p>
	This tiny bit of <span class="caps">CSS</span> can ensure that the entire layout is proportionately scaled up based on the screen size being used to access it. To figure out how this bit of code would fit best into your own work, use this formula (replace “X” with your max width size in ems):</p>
<pre class="css"><code>
@media screen and (min-width: 64em) {
  body {
    font-size: 1.5625vw;
  }
}
</code></pre>
<p>
	The site I developed this technique for is not live yet, so I threw together <a href="http://codepen.io/aarongustafson/pen/ojqtr">a simple demo on Codepen</a>. <em>Note: Chrome currently requires a forced repaint on window resize to make it shrink or enlarge the layout. Hopefully <a href="https://code.google.com/p/chromium/issues/detail?id=124331">that bug</a> will be fixed soon.</em></p>
<p>
	I’m still feeling my way around this technique, but I am intrigued by the possibilities it holds. What do you think?</p>
