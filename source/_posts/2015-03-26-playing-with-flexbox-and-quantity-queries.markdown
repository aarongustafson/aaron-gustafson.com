---
layout: post
title: "Playing with Flexbox and Quantity Queries"
date: 2015-03-26 14:44:24 -0400
comments: true
categories: ["web design",experiments,css]
description: "While flying across the U.S. this week, I decided to play around with Flexbox and quantity queries in hopes of coming up with something interesting."
---

Ever since reading [Haydon Pickering](http://twitter.com/heydonworks)’s [piece on quantity queries](http://alistapart.com/article/quantity-queries-for-css), I’ve been musing over the possibilities for layout. I decided I to play around with them a bit on this site as it’s been a while since I’ve tweaked the design. Being that I wanted to experiment, I thought this would be a fun time to tuck into [Flexbox](http://www.w3.org/TR/css-flexbox-1/) a bit more as well.

<!-- more -->

Here’s a brief overview of the project:

**The Candidate**: My [speaking engagements](/speaking-engagements/) page.<br>
**The Challenge**: The "Future" list will grow and shrink as I book things, so I never know how many will be there. The "Past" list will also grow, but I am less interested in getting crazy with that.<br>
**The Idea**: A grid layout that flexes to visually highlight 1-2 upcoming future events and allows the others to flow in at the default grid size. It should be set up to handle everything from a single future event to a dozen or more.

<figure id="2015-03-26-1" class="media-container">
	<img src="/i/posts/2015-03-26/the-idea-sm.jpg"
	 	 srcset="/i/posts/2015-03-26/the-idea-lg.jpg 1024w, /i/posts/2015-03-26/the-idea-md.jpg 600w, /i/posts/2015-03-26/the-idea-sm.jpg 320w"
		 alt="">
	<figcaption>
		<p>My sketch of the idea.</p>
	</figcaption>
</figure>

The markup pattern was pretty simple. It’s just a list of events:

{% gist 597284affc88b9084cf3 markup.html %} 

With that in place, I got to work.

## Single File

To set the stage, I started with some basic Flexbox syntax[^1] by handling the container and the basic full-width small screen view:

{% gist 597284affc88b9084cf3 first-pass.css %} 

You may be wondering where all of the experimental style rules are. I use [Autoprefixer](https://github.com/postcss/autoprefixer) to handle the experimental property inclusion/trans-compilation so I can keep my CSS clean and standards-based.

This simple CSS gives you exactly what you’d expect: a vertical list of events, separated by 20px worth of space.

<figure id="2015-03-26-2" class="media-container">
	<img src="/i/posts/2015-03-26/first-pass.jpg"
	 	 srcset="/i/posts/2015-03-26/first-pass-lg.jpg 1024w, /i/posts/2015-03-26/first-pass-md.jpg 600w, /i/posts/2015-03-26/first-pass-sm.jpg 320w"
		 alt="">
</figure>

## Two by Two

Next up, I tackled the first breakpoint at 28.75em:

{% gist 597284affc88b9084cf3 second-pass.css %}

In this pass, I set up the event blocks to fill 50% of the parent container (well, 50% minus the 1.25rem gutter between them, using [`calc()`](http://www.w3.org/TR/css3-values/#calc)).[^2] In order to make the children wrap to form rows, I set `flex-wrap: wrap` on the list (`.listing--events`). Then, to make the children all equal heights across each row, I set `align-items: stretch`. The gutter space was achieved via left margins on all events save the row starters (`.event:nth-child(odd)`).

It’s worth noting that in the full page I have two sets of event listings: one past and one future. The "event" `class` is used in all instances. The modified "future" `class` is added to events that have not happened yet.

Then I used a quantity query to select the first future event when there is more than one in the list (line 38) and set it span 100% of the parent width. To keep the gutters accurate, I also swapped where the margins were applied, adding the margin back to `.event--future:nth-child(odd)` and removing it from `.event--future:nth-child(even)`.

<figure id="2015-03-26-3" class="media-container">
	<img src="/i/posts/2015-03-26/second-pass-sm.jpg"
	 	 srcset="/i/posts/2015-03-26/second-pass-lg.jpg 1024w, /i/posts/2015-03-26/second-pass-md.jpg 600w, /i/posts/2015-03-26/second-pass-sm.jpg 320w"
		 alt="">
</figure>

## Three’s a Crowd

Finally, I could tackle the third and most complicated layout. Things seemed to get a little wide around 690px, so I set the breakpoint to 43.125em.

{% gist 597284affc88b9084cf3 third-pass.css %}

In this final pass, I used a slightly more complicated calculation to set the width of each child to 1/3 of the parent minus the gutters between them (100% / 3 - 0.875rem). 

If you’re paying close attention, you might wonder why the gutter being used in the calculation is 0.875rem rather than the full 1.25rem. Well, the reason is (as best I can surmise) rounding. In order to get the flex width to fill the parent without causing a wrap, 14px (0.875rem) seemed to be the magic number.

It’s worth noting that if I allowed the event to grow (using `flex-grow: 1` or its equivalent in the shorthand), the column would fill in perfectly, but the last row would always be filled completely too. You could end up with two events in the last row being 50% wide each or a single event being 100% wide, which I didn’t want. I wanted them all to be equal width with the exception of the first 2. Setting `flex` as I did allowed that to happen.

I went ahead and reset the standard margins for events as well (on both `.event:nth-child(even)` and `.event:nth-child(odd)`). And then I turned off the margins on the first of every group of three events using `.event:nth-child(3n+1)`.

With that in place, I went to work on the future events, resetting the margins there as well. Then I used a quantity query (lines 70-71) to select the first two members when the list is more than 2 and set them to be 50% of the parent width minus the gutter.

To handle the margins in the quantity query instance, I added all the margins back (line 64) and then removed the left margins from the new row starters (line 77).

<figure id="2015-03-26-4" class="media-container">
	<img src="/i/posts/2015-03-26/third-pass-sm.jpg"
	 	 srcset="/i/posts/2015-03-26/third-pass-lg.jpg 1024w, /i/posts/2015-03-26/third-pass-md.jpg 600w, /i/posts/2015-03-26/third-pass-sm.jpg 320w"
		 alt="">
</figure>

## Ta-da!

And there you have it. In about 80 lines of very generously spaced and commented CSS, we’ve got a flexible grid-based Flexbox layout with visual enhancements injected via quantity queries. I’m sure I’ll continue to tinker, but I’m pretty happy with the results so far.

You can view [the final page of course](/speaking-engagements/) (or [watch a video of the interaction](https://www.youtube.com/watch?v=V20wuGM2tzU)), but I also created a [distilled demo on Codepen for you to play with](http://codepen.io/aarongustafson/pen/VYRZBP). 

[^1]: If you aren’t familiar with Flexbox, [CSS Tricks has a great cheatsheet](https://css-tricks.com/snippets/css/a-guide-to-flexbox/).
[^2]: Interestingly, the support matrices for [`calc()`](http://caniuse.com/#feat=calc) and [Flexbox](http://caniuse.com/#feat=flexbox) are pretty well aligned.