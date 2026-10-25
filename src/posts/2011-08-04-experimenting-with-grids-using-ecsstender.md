---
title: "Experimenting with Grids Using eCSStender"
date: 2011-08-04 19:59:13
comments: true
tags:
  - "CSS"
  - "JavaScript"
  - "web standards"
description: "In preparation for the launch of 10K Apart (Responsive Edition) from Mix Online and An Event Apart , I’ve been feverishly working on a modest implementation of the proposed CSS 3 Grid Layout module (also referred to as Grid Alignment in..."
canonical: "https://blog.easy-designs.net/archives/experimenting-with-grids-using-ecsstender/"
atUri: "at://did:plc:6rmgrvblxflqh34omwywu6ib/site.standard.document/3mxrnwqzfqc2l"
image: "/i/share-cards/experimenting-with-grids-using-ecsstender.jpg"
meta_description: "While preparing for the Responsive Edition of 10K Apart, I experimented with grids using eCSStender."
social_description: "While preparing for the Responsive Edition of 10K Apart, I experimented with grids using eCSStender."
---

In preparation for the launch of [10K Apart (Responsive Edition)](http://10k.aneventapart.com/) from [Mix Online](http://visitmix.com/) and [An Event Apart](http://aneventapart.com/), I’ve been feverishly working on a modest implementation of [the proposed CSS3 Grid Layout module](http://dev.w3.org/csswg/css3-grid-align/) (also referred to as Grid Alignment in [alternate drafts](http://www.interoperabilitybridges.com/css3-grid-align/)) using [eCSStender](http://eCSStender.org). As you might imagine, it was a pretty massive undertaking, but it’s been pretty rewarding to use eCSStender for it’s original intent: prototyping implementations of proposed specifications.

<!-- more -->

<figure> <img alt="" src="/i/posts/2011-08-04/the-grid-system.png"/> </figure>

As it stands today, the [IE10 platform preview](http://ie.microsoft.com/testdrive/) is the only place you can play with CSS-based grid layouts and have them natively rendered by the browser. This JavaScript-based port, however, makes it possible to view them in recent builds of Chrome, Firefox, Safari and even Opera.

## How do I use it?

As with most extensions, enabling grid layout with eCSStender is as simple as including [the eCSStender core library](http://ecsstender.org/documentation/downloading-ecsstender) and [the Grid Alignment extension](http://ecsstender.org/extensions/css3-grid-alignment/). It’s up to you whether you’d like to download copies of each and serve them from your own domain or whether you prefer to use [the new eCSStender CDN](http://ecsstender.org/documentation/the-ecsstender-cdn/) to handle the file delivery for you. To use the CDN, you’d simply include the following two scripts just before the closing `</body>`{.html} tag:

```html
  <script src="http://cdn.ecsstender.org/lib/latest/min/eCSStender.js"></script>
  <script src="http://cdn.ecsstender.org/ext/CSS3-grid-alignment/latest/min/eCSStender.CSS3-grid-alignment.js"></script>
```

With those in place, you can begin playing with some of the new grid syntax. [The test case](http://test.ecsstender.org/extensions/eCSStender.CSS3-grid-alignment.js/test/grid-system/index.html) I built the extension against sets up one of several grids like this:

```css
  #demo {
   width:945px;
   display:grid;
   grid-columns: 145px 1fr 145px 1fr 145px 1fr 145px 1fr 145px 1fr 145px;
   grid-rows: 186px 692px 357px; 
  }
```

That code builds a grid structure within `#demo`{.html} that is comprised of six primary columns (at 145px wide each) with equal-width “gutter” columns between them (their width is determined using equal division of the remaining space as indicated by “1fr” meaning “one fraction”). It also defines three rows of varying heights within `#demo`{.html}. Grid items are then positioned on the grid using coordinate-like syntax:

```css
  #articles {
   grid-row:2;
   grid-column:1;
  }
```

The full CSS for [the Grid System demo](http://test.ecsstender.org/extensions/eCSStender.CSS3-grid-alignment.js/test/grid-system/index.html) can be viewed [here](http://test.ecsstender.org/extensions/eCSStender.CSS3-grid-alignment.js/test/grid-system/grid.css).

The extension is by no means complete (the spec is fairly large and will require months to build an exhausitve implementation), but it does let you begin experimenting with the syntax immediately.

## Is This the Future of Grid-based Web Design?

To me, this spec is very much in it’s infancy (despite having an experimental implementation in the IE10 platform preview). The fine folks at Microsoft (who, in full disclosure, funded the development of the extension) are keen to get people playing with the proposed syntax. I, for one, am not completely sold on the syntax as it is currently proposed. From a developer’s standpoint it makes sense because it feels like you’re building an invisible series of rows and columns, onto which you are attaching pieces of your document. As [Mark Boulton pointed out on Twitter](https://twitter.com/markboulton/status/99122324330127360), however, the syntax is not as analogous to a designer’s concept of a grid, which could slow the adoption of the spec if it were to be finalized as-is.

Despite obviously working my tail off to get this extension up and running, I’m most excited to see how [the conversation](http://lists.w3.org/Archives/Public/www-style/2011Apr/0303.html) opens up on grid-based CSS layouts and how the spec evolves. Will there be counterproposals? Yup. [Mark’s working on one](https://twitter.com/markboulton/status/99123592394059776) and I’d love to see more. All I know is that the more we—the grunts in the CSS-authoring trenches—get involved in [the spec development process](http://www.w3.org/2005/10/Process-20051014/tr.html#Reports), the better the end result will be. And I’m looking forward to helping turn even more ideas into workable prototypes using eCSStender.
