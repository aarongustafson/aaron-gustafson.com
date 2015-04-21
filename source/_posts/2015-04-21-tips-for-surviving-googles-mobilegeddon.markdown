---
layout: post
title: "Tips for Surviving Google’s “Mobilegeddon”"
date: 2015-04-21 09:10:12 -0400
comments: true
categories: ["web design",mobile,"progressive enhancement"]
description: "Today is the day Google updates it algorithm to take into account mobile-friendliness. Here are a few tips that will help you embrace mobile without tearing your hair out."
---

Today is the day [Google updates it algorithm to take into account mobile-friendliness](http://www.economist.com/news/business-and-finance/21648947-worlds-biggest-search-engine-shakes-up-its-algorithms-mobilegeddon). Here are a few tips that will help you embrace mobile without tearing your hair out.

<!-- more -->

## 1. Embrace mobile-first CSS

This is a quick win. I’ve done the mobile-first overhaul on a number of existing sites over the last few years and the best strategy I’ve found is this:

1. Create two CSS files. Name the first something like "basic.css" and link to it with `media="all"`. Name the second something like "advanced.css" and link to it with `media="only screen"`.
2. Move all of your existing desktop-only CSS into advanced.css and wrap the rules in a media query corresponding to your design width (e.g. `@media (min-width:60em)` for a 960px max width).
3. Open a page from your site in a new browser window and make it as small as possible. Move any basic typographic and color styles from advanced.css to default.css and refresh the page. How does it look? Make the browser wider. Still acceptable? Awesome! This is the CSS you’ll serve to older browsers that don’t understand media queries and it forms the basis of your larger screen styles.
4. Shrink the browser back down to the smallest it can go and create a breakpoint for that size in advanced.css (e.g. `@media (min-width:10.5em)` if you want to small target devices like the [Pebble](https://getpebble.com/)). Move any styles you want applied in this scenario from your "full screen" breakpoint and add any new rules you need to make things look good.
5. Increase the browser with until the layout looks odd, then make a new breakpoint and move in or add the necessary styles.
6. Rinse & repeat until you get up to the "full screen" layout.
7. Move your print styles—you do have print styles, right?—into default.css and wrap them in a print `@media` block.

For another approach to responsive retrofitting, check out [this piece from Ben Callahan](http://webstandardssherpa.com/reviews/responsive-retrofitting/).

## 2. Focus on key tasks

Every page has a purpose. If it doesn’t, you don’t need it. Find the page’s purpose and make that the focus. Eliminate distractions and reduce the amount of friction a user encounters when trying to accomplish the task.

If company or client politics preclude you from getting rid of all distractions on a page, consider [a lazy-loading strategy](http://www.filamentgroup.com/lab/ajax-includes-modular-content.html) to bring them in with JavaScript only when there is more screen real estate.

## 3. Get smarter about images

Images are great, but they often comprise the majority of a web page’s bulk. To slim things down, first consider whether a given image is actually needed. If it isn’t, get rid of it. If it offers an enhancement, but isn’t crucial, consider lazy-loading it after page load. If the image is really important, [use `srcset` and `sizes`](https://ericportis.com/posts/2014/srcset-sizes/) (or the `picture` element) to deliver the smallest and yet most appropriate image to your users, based on their device.

## 4. Embrace the continuum

As designers and developers, we often try to control everything. But we have to realize that we can’t control everything on the Web. People on different devices have different capabilities and considerations. They will need your website to be flexible enough to allow them to accomplish their goals no matter what.

Understanding that is key to building experiences that move seamlessly across devices. You know, [progressive enhancement](http://alistapart.com/article/understandingprogressiveenhancement). It’s key to embracing the Web for all of its inherent web-iness.

<hr>

And there you have it: 4 simple, but effective guidelines for creating awesome websites that will fair well under Google’s new algorithm. And guess what: Your users will benefit too.