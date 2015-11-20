---
layout: post
title: "Speeding Things Up with Service Worker, Resource Hints, and More"
date: 2015-11-20 10:48:09 -0500
comments: true
categories: []
description: ""
---

User experience should be concerned about more than just the interface. Download speed, render performance, and the cost of accessing a site are often overlooked areas when it comes to the practice of UX, but they all affect our users’ experiences.

I’m always looking for ways to improve these aspects of this site. And since it’s my own personal playground, I often use it as a test-bed for new technologies, ideas, and techniques. My latest adventure was inspired by a bunch of the articles and posts I’ve linked to recently, especially

* [Jeremy Keith’s “My First Service Worker”](https://adactio.com/journal/9775),
* [Nicolas Bevacqua’s “Making a Simple Site Work Offline with ServiceWorker”](https://css-tricks.com/serviceworker-for-offline/),
* [Dean Hume’s “Service Workers: Dynamic Responsive Images Using Webp Images”](http://deanhume.com/Home/BlogPost/service-workers--dynamic-responsive-images-using-webp-images/10132/), and
* [Malte Ubl’s “Not so micro optimizations”](https://medium.com/@cramforce/not-so-micro-optimizations-f867c47b832d#.satdv0fap)

After reading these pieces, I decided to see how much I could increase the performance of this site, especially on posts with a lot of images and embedded code samples, like [my recent post on form labels](https://www.aaron-gustafson.com/notebook/labeled-with-love/).

To kick things off, I followed Malte’s advice and used Resource Hints to *prime the pump* for any third-party servers hosting assets I use frequently. I used the code Malte references in the AMP Project as my starting point.