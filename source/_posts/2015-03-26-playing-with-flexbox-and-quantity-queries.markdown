---
layout: post
title: "Playing with Flexbox and Quantity Queries"
date: 2015-03-26 14:44:24 -0400
comments: true
categories: ["web design",experiments,css]
description: "While flying across the U.S. this week, I decided to play around with Flexbox and quantity queries in hopes of coming up with something interesting."
published: false
---

Ever since reading [Haydon Pickering](http://twitter.com/heydonworks)’s [piece on quantity queries](http://alistapart.com/article/quantity-queries-for-css), I’ve been musing over the possibilities for layout. I decided I to play around with them a bit on this site as it’s been a while since I’ve tweaked the design. Being that I wanted to experiment, I thought this would be a fun time to tuck into [Flexbox](http://www.w3.org/TR/css-flexbox-1/) a bit more as well.

Here’s a brief overview of the project:

**The Candidate**: My [speaking engagements](/speaking-engagements/) page.
**The Challenge**: The "Future" list will grow and shrink as I book things, so I never know how many will be there. The "Past" list will also grow, but I am less interested in getting crazy with that.
**The Idea**: A grid layout that flexes to visually highlight 1-2 upcoming future events and allows the others to flow in at the default grid size. It should be set up to handle everything from a single future event to a dozen or more.

<figure id="2015-03-26-1" class="media-container">
	<img src="/i/posts/2015-03-26/the-idea-sm.jpg"
	 	 srcset="/i/posts/2015-03-26/the-idea-lg.jpg 1062w, /i/posts/2015-03-26/the-idea-md.jpg 600w, /i/posts/2015-03-26/the-idea-sm.jpg 320w"
		 alt="">
	<figcaption>
		<p>My sketch of the idea.</p>
	</figcaption>
</figure>

The markup pattern was pretty simple. It’s just a list of events:

{% gist 597284affc88b9084cf3 markup.html %} 

With that in place, I got to work.

## Single File

To set the stage, I started with some basic Flexbox syntax[^1][^2] by handling the container and the basic full-width small screen view:

{% gist 597284affc88b9084cf3 first-pass.css %} 

You may be wondering where all of the experimental style rules are. I use [Autoprefixer](https://github.com/postcss/autoprefixer) to handle the experimental property inclusion/trans-compilation so I can keep my CSS clean and standards-based.

This simple CSS gives you exactly what you’d expect: a vertical list of events, separated by 20px worth of space.

<figure id="2015-03-26-2" class="media-container">
	<img src="/i/posts/2015-03-26/first-pass-sm.png"
	 	 srcset="/i/posts/2015-03-26/first-pass-lg.png 1062w, /i/posts/2015-03-26/first-pass-md.png 600w, /i/posts/2015-03-26/first-pass-sm.png 320w"
		 alt="">
</figure>

## Two by Two

Next up, I tackled the first breakpoint at 28.75em:

{% gist 597284affc88b9084cf3 second-pass.css %}

In this pass, I set up the event blocks to fill 50% of the parent container (well, 50% minus the 20px gap between them, using [`calc()`](http://www.w3.org/TR/css3-values/#calc)). In order to make the children wrap to form rows, I set `flex-wrap: wrap` on the list (`.listing--events`). Then, to make the children all equal heights across each row, I set `align-items: stretch`. Finally, to get the gutters in there, I added `justify-content: space-between` to equally distribute the space.

Then I used a quantity query to select the first future event when there is more than one in the list (`.event--future:nth-last-child(n+1):first-child`) and set it span 100% of the parent width. I also enlarged its contents, but that’s not in this excerpt.

<figure id="2015-03-26-3" class="media-container">
	<img src="/i/posts/2015-03-26/second-pass-sm.png"
	 	 srcset="/i/posts/2015-03-26/second-pass-lg.png 1062w, /i/posts/2015-03-26/second-pass-md.png 600w, /i/posts/2015-03-26/second-pass-sm.png 320w"
		 alt="">
</figure>

### Three’s a Crowd

Now for the third layout. Things seemed to get a little wide around 690px, so I set the breakpoint to 43.125em.

{% gist 597284affc88b9084cf3 third-pass.css %}

In this final pass, I used a slightly more complicated calculation to set the width of each child to 1/3 of the parent minus the 20px gutters between them ( 100% / 3 - 40px / 3 ). The reason I did this more complex calculation is that it lets browsers handle the rounding directly.[^2] I went ahead and reset the "small" quantity query at the same time.

With that in place, I used a quantity query (`.event--future:nth-last-child(n+2):first-child, .event--future:nth-last-child(n+2):first-child + .event--future`) to select the first two members when the list is more than 2 and set them to be 50% of the parent width minus the gutter.

<figure id="2015-03-26-4" class="media-container">
	<img src="/i/posts/2015-03-26/final-pass-sm.png"
	 	 srcset="/i/posts/2015-03-26/final-pass-lg.png 1062w, /i/posts/2015-03-26/final-pass-md.png 600w, /i/posts/2015-03-26/final-pass-sm.png 320w"
		 alt="">
</figure>

For good measure, I also set a 100% width for a lonely single future event.


You can view [the final page of course](/speaking-engagements/), but I also created a [distilled demo on Codepen for you to play with](http://codepen.io/aarongustafson/pen/VYRZBP). 

[^1]: If you aren’t familiar with Flexbox, [CSS Tricks has a great cheatsheet](https://css-tricks.com/snippets/css/a-guide-to-flexbox/).
[^2]: Interestingly, the support matrices for [`calc()`](http://caniuse.com/#feat=calc) and [Flexbox](http://caniuse.com/#feat=flexbox) are pretty well aligned.