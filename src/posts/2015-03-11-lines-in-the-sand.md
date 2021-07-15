---
title: "Lines in the Sand"
date: 2015-03-11 09:21:29 -04:00
comments: true
tags: ["web design",browsers,"progressive enhancement"]
description: "I don’t think we need to break up with IE8, we just need to define our relationship a bit better."
---

A new site, [Break Up with Internet Explorer 8](http://breakupwithie8.com/) by [Humaan](http://www.humaan.com/), has been making the rounds on the Interwebs of late. It’s cleverly done and an attractive site, but I don’t really agree with the premise:

> Join the intervention and stop supporting IE8. It's time for an upgrade.

<!-- more -->

The reality is that some users don’t have control over the browsers installed on their computers and [IE8 may be the best they can muster](http://www.networkworld.com/article/2224510/microsoft-subnet/some-windows-xp-users-just-can-t-afford-to-upgrade.html). Most of us have had the luxury of moving on, but they haven’t. Does that mean we should banish those users from our sites by treating IE8 like that ex who just won’t take a hint? I don’t think so.

Instead, we should approach this problem rationally. Be the bigger person. Call it [support vs. optimization](http://bradfrost.com/blog/mobile/support-vs-optimization/), call it [cutting the mustard](http://responsivenews.co.uk/post/18948466399/cutting-the-mustard), call it what you will, but by understanding how browsers work, we can reduce our own development headaches and serve more users in the process. Yes, even when they use aging browsers like IE8 or IE7 or (gasp) IE6.

When it comes to HTML and CSS, browsers ignore what they don’t understand. It’s why you can use the `section` element and the content will still be exposed in Lynx. It’s also why you can use RGBa without IE6 collapsing. [Fault tolerance is a really powerful tool](http://adaptivewebdesign.info/1st-edition/chapter-1.html#the-rise-of-tolerance) and is the foundation of progressive enhancement in HTML and CSS. (In JavaScript things are a little more complicated… we have to use [feature detection](http://learn.jquery.com/code-organization/feature-browser-detection/).)

A simple way to rid yourself of IE8 related headaches is to embrace the idea that [web pages don’t need to look (or behave) the same in every browser](http://dowebsitesneedtolookexactlythesameineverybrowser.com/) and look for ways to achieve this while still providing access to your content and tools for less-capable browsers and devices. For example:

```html
<link rel="stylesheet" href="simple.css">
<link rel="stylesheet" href="complex.css" media="only screen">
```

This simple stylesheet setup will deliver only the `simple.css` file to browsers that are incapable of understanding media queries. Browsers that do understand them will get both stylesheets. Media queries support is an easy line in the sand we can draw because [lack of media query support is in fact the first media query](http://www.slideshare.net/bryanrieger/rethinking-the-mobile-web-by-yiibu/79).

Once you’ve done that, it’s as simple as putting all of your advanced styles in the `complex.css` file. No drama.

On the JavaScript end, you can draw a line in the sand too. Let’s say you don’t want to spend your time debugging JavaScript in IE8. You can just skip it using [Conditional Comments](http://www.quirksmode.org/css/condcom.html):

```html
<!--[if gte IE 9]><!-->
  <script src="not-for-ie8.js"></script>
<!--<![endif]-->
```

Using an approach like this avoids delivering the contained JavaScript files to IE8 at all, but all other browsers will see them.

If that’s too drastic, use [feature detection](http://learn.jquery.com/code-organization/feature-browser-detection/) in your JavaScript files to determine if it is safe to rely on a particular method or capability. Program defensively.

Honestly, I’ve found that approaches like these lead to fewer grey hairs and a lower overall stress level. They make me a happier developer and let me concentrate on building for the future rather than worrying about the past.

But it’s not about breaking up with IE8, it’s about having a realistic and honest relationship with it.
