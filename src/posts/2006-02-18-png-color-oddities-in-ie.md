---
title: "PNG color oddities in IE"
date: 2006-02-18 12:21:21
comments: true
tags:
  - "CSS"
  - "images"
  - "web standards"
description: "While working on a new site, I started playing around a little more with 8-bit PNG files, comparing them to GIFs. In a few cases the PNG was smaller (it didn’t used to be that way, but perhaps Photoshop CS 2 does a better job of..."
canonical: "https://blog.easy-designs.net/archives/png-color-oddities-in-ie/"
---

<p>While working on a new site, I started playing around a little more with 8-bit <abbr title="Portable Network Graphics">PNG</abbr> files, comparing them to GIFs. In a few cases the <abbr title="Portable Network Graphics">PNG</abbr> was smaller (it didn’t used to be that way, but perhaps Photoshop CS2 does a better job of compressing <abbr title="Portable Network Graphics">PNG</abbr> files or something), so used it. All was good until I started testing the design in <abbr title="Internet Explorer">IE</abbr>, where the colors were all off. Here’s a breakdown of how the same graphic (placed as a CSS background image against a background color equal to its own background color) rendered between the two browsers: <img alt="PNG comparison between Firefox 1.5 and Internet Explorer 6/7B2" src="/i/posts/2006-02-18/png_compare.png" style="margin: 1em auto 0pt; display: block; width: 400px;"/></p>
<p>I am well-aware of the issues regarding <abbr title="Internet Explorer">IE</abbr>’s handling of alpha transparency in 24-bit PNGs, but had not heard of any color-related issues with 8-bit PNGs in <abbr title="Internet Explorer 6">IE6</abbr>. I did a test in <abbr title="Internet Explorer 7 Beta 2">IE7B2</abbr> to see if the error was there too and it was.</p>

<!-- more -->

<p>I did some searching on Google and couldn’t seem to find any documentation on this bug, but it’s certainly something I’d recommend they fix for the final release of <abbr title="Internet Explorer 7">IE7</abbr>. For now, however, the only solutions appear to be adding color-correction to your CSS for <abbr title="Internet Explorer">IE</abbr> (if you are dead-set on using an 8-bit <abbr title="Portable Network Graphics">PNG</abbr>) or using a GIF.</p>
