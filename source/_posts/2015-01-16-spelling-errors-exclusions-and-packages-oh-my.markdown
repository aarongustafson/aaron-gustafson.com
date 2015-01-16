---
layout: post
title: "Spelling Errors, Exclusions, and Packages, Oh My—Working Drafts at the W3C"
date: 2015-01-16 07:15:12 -0500
comments: true
categories: ["web design", "web standards"]
description: "Here’s a bit of a round-up of some interesting work that came out of the W3C this week."
---

This week the W3C published a couple of really cool new Working Drafts I wanted to bring to your attention (just in case you missed them). 

<!-- more -->

## [CSS 4 Pseudo-elements](http://www.w3.org/TR/2015/WD-css-pseudo-4-20150115).

Most of this is stuff you know: `::first-line`, `::first-letter`, and `::selection`. But what magic is this? `::spelling-error` and `::grammar-error` too! What?! Now I know I may be a little too excited about this, but it’s not because spelling and grammar errors are going to solve all of our design problems; I am excited about this because it points to us being granted more control over how more of the internals of browser operations are rendered to our users.

Obviously [this is a double edged sword](/notebook/native-vs-stylable-tug-of-war/) and could be abused to the detriment of the user experience, but it may also lead to someone coming up with clearer conventions for indicating spelling and grammar errors than the ones we’ve been using since the early days of Microsoft Word.

## [CSS 3 Exclusions](http://www.w3.org/TR/2015/WD-css3-exclusions-20150115/)

This has been a long time coming. The idea is pretty simple: Within a flow-type element (think `p`, `div`, etc.) you can apply [the `wrap-flow` property](http://www.w3.org/TR/2015/WD-css3-exclusions-20150115/#wrap-flow-property) to children in order to control where content can go in relation to them. Here’s an example from the spec:

<figure id="fig-2015-01-16-1">
	<img src="http://www.w3.org/TR/2015/WD-css3-exclusions-20150115/images/exclusions-illustration.png" alt="Four boxes layed out roughly diagonally from the upper left to the lower right within a larger container. A flow of blue color shows where text is allowed to flow.">
</figure>

In this example, child A is set to `wrap-flow: both`, allowing content to flow on both sides of it. Child B is set to `wrap-flow: start` meaning content should only be allowed on the starting side of the element (based on text direction, in this case left to right). Child C is set to `wrap-flow: end` meaning content can only appear after it in terms of text-direction. And child D is set to `wrap-flow: clear` which, as you might expect based on your existing CSS knowledge, ensures no content appears on either side of it.

There is [another, more thorough example in the Working Draft](http://www.w3.org/TR/2015/WD-css3-exclusions-20150115/#wrap-flow-property) (scroll down a little bit), but it uses grid layout as well and is a little more complicated that I want to get into today. 

On the flip side of the equation, there is [the `wrap-through` property](http://www.w3.org/TR/2015/WD-css3-exclusions-20150115/#wrap-through-property) which allows other elements to control whether or not they pay attention to the `wrap-flow` property of another element. A `wrap-through` value of "wrap" adheres to what they are calling the "wrapping context" of the parent element (which basically means it behaves as you’d expect, being a child element). Setting a `wrap-through` value of "none" on the child element, however, would make it ignore the parent element’s wrapping context and allow this child’s content to flow through (hence `wrap-through`) the excluded element.

It’s a lot to take in and (of course) still subject to change, but I just wanted to bring this concept to your attention as it is pretty cool stuff and is a nice complement to [CSS Shapes](http://www.w3.org/TR/css-shapes-1/), which landed early last year.

## [Streamable Package Format](http://www.w3.org/TR/2015/WD-web-packaging-20150115/)

This one is pretty crazy and I am still tucking into it, but here’s the gist: You could provide a "package" or rolled up collection of files necessary to render your page—think CSS, images, fonts, etc.—in [Streamable Package Format](http://www.w3.org/TR/2015/WD-web-packaging-20150115/#streamable-package-format) which would allow a browser to download them all in one go rather than having to request each resource individually. This could be really useful from a performance standpoint on high-latency connections as it cuts down on the number of round-trips the browser must make to the server before it can render the page. And, since the package can be streamed, we can optimize the contents to provide the most important bits first so the browser can go about rendering the document as quickly as possible.

This is a very cool concept with a lot of potential benefit to our users. Of course, as the document acknowledges, it’s also possible to abuse this and adversely affect performance by including a lot of unnecessary content. Kinda like [that guy who made his whole single-page app into a Web Component](https://www.polymer-project.org/articles/spa.html). Just because you can do something doesn’t make it a good idea.

Still, there’s a lot of potential here and I’m excited to see where it goes.

<hr>

Now the caveat: all of these are Working Drafts, not Technical Recommendations, so *they are not final by any means*. That said, they do point to a pretty interesting not to distant future.