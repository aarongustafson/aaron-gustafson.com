---
published: false
layout: post
title: "Easy Responsive Images in ExpressionEngine with CE Image"
date: 2014-11-15 18:18:23 -0500
comments: true
categories: ["web design", "responsive web design", "ExpressionEngine", "CE Images", "responsive images", "progressive enhancement"]
description: With native browser implementations now available and a rock-solid set of implementation choices, we’ve begun implementing responsive images in every new project. Here’s how we did it for a recent ExpressionEngine build using the CE Image add-on.
---

One of the biggest headaches of responsive design has been dealing with images. Thankfully our work on the [Responsive <del>Images</del> <ins>Issues</ins> Community Group](http://ricg.io) has resulted in a rock-solid set of elements and attributes to address all of your responsive image needs. My company, [Easy Designs](http://easy-designs.net), recently redesigned [Nichols College’s website](http://www.nichols.edu) and that project just happened to coincide responsive images landing in Blink (the rendering engine that powers Chrome and Opera). Naturally, we jumped at the opportunity to use them.

The Nichols College site runs on [EllisLab’s ExpressionEngine](http://ellislabs.com/expressionengine), a solid little workhorse CMS we’ve been using for years and gives us complete control over the markup it generates. EE offers some pretty decent file management and image manipulation utilities out of the box, but the options it provides were not enough to handle our responsive image needs; we needed backup. [Causing Effect’s CE Image](http://www.causingeffect.com/software/expressionengine/ce-image) add-on is reasonably priced and offered exactly the functionality we needed to make our responsive images dreams a reality.

I won’t bore you with how to set up CE Image as there is documentation on that, but I will walk you through two different responsive image use-cases we had and how we addressed them using this add-on.

## Header images

The first use case we had was a series of large, focal images. You can find different examples of them on [the homepage](http://www.nichols.edu) and landing pages (like [this one about admissions](http://www.nichols.edu/admissions/)). We

{% gist 96dd157a0206d59ac30a picture-element.html %}

{% gist 96dd157a0206d59ac30a simple-resize.html %}