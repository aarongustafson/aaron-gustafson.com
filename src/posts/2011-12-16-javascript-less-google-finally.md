---
title: "JavaScript-less Google+ (finally)"
date: 2011-12-16 16:03:00
comments: false
tags:
  - "progressive enhancement"
  - "privacy"
  - "user experience"
description: "When we launched the mobile-first version of this blog, we opted not to include Google+ as one of the sharing options because there was no way to make it work without JavaScript (a fact which undermined both our progressive enhancement…"
canonical: "https://blog.easy-designs.net/archives/javascript-less-google-finally/"
---

<p>
	When we launched the mobile-first version of this blog, we opted <em>not</em> to include Google+ as one of the sharing options because there was no way to make it work without JavaScript (a fact which undermined both our progressive enhancement philosophy and the privacy of our readers). I tried digging into the (IMHO) over-engineered code that manages the +1 button to find an end point, but after about an hour of digging decided it wasn’t worth it. Thankfully there are others out there who are more persistent than I am and a way to share on Google+ without using the Google-supplied JavaScript is now available <a href="http://www.techlifeweb.com/2011/08/12/share-googleplus-cross-browser-bookmarklet/">thanks to the folks at TechLifeWeb</a>.</p>

<!-- more -->

<p>
	It started as a bookmarklet, but the endpoint URL for the mobile share form is easily extracted from there (<em>note: this works, ok but is not ideal… see Update #2 below</em>):</p>
<blockquote>
<p>
		https://m.google.com/app/plus/x/?content=<strong>CONTENT+AND+URL+GOES+HERE</strong>&amp;v=compose&amp;hideloc=1</p>
</blockquote>
<p>
	We’ve gone ahead and implemented Google+ now, so if you are a fan… happy linking!</p>
<p>
<strong>Update #1:</strong> In playing around with it a bit more, there’s a strange behavior whereby Google says there’s a problem with the post, but it actually does get into your Stream. I’ll dig around a bit and see if I can sort that out.</p>
<p>
<strong><strong>Update #2:</strong></strong> Google is finally supporting this properly. Here’s the URL scheme:</p>
<blockquote>
<p>
		https://plus.google.com/share?url=<strong>URL+GOES+HERE</strong></p>
</blockquote>
