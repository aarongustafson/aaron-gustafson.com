---
title: "Experimenting with Grids Using eCSStender"
date: 2011-08-04 19:59:13
comments: true
tags:
  - "web standards"
  - "CSS"
  - "JavaScript"
  - "browsers"
description: "In preparation for the launch of 10K Apart (Responsive Edition) from Mix Online and An Event Apart , I’ve been feverishly working on a modest implementation of the proposed CSS 3 Grid Layout module (also referred to as Grid Alignment in..."
canonical: "https://blog.easy-designs.net/archives/experimenting-with-grids-using-ecsstender/"
---

<p>In preparation for the launch of <a href="http://10k.aneventapart.com/">10K Apart (Responsive Edition)</a> from <a href="http://visitmix.com/">Mix Online</a> and <a href="http://aneventapart.com/">An Event Apart</a>, I’ve been feverishly working on a modest implementation of <a href="http://dev.w3.org/csswg/css3-grid-align/">the proposed <span class="caps">CSS</span>3 Grid Layout module</a> (also referred to as Grid Alignment in <a href="http://www.interoperabilitybridges.com/css3-grid-align/">alternate drafts</a>) using <a href="http://eCSStender.org">eCSStender</a>. As you might imagine, it was a pretty massive undertaking, but it’s been pretty rewarding to use eCSStender for it’s original intent: prototyping implementations of proposed specifications.</p>

<!-- more -->

<figure> <img alt="" src="/i/posts/2011-08-04/the-grid-system.png"/> </figure>
<p>As it stands today, the <a href="http://ie.microsoft.com/testdrive/"><span class="caps">IE</span>10 platform preview</a> is the only place you can play with <span class="caps">CSS</span>-based grid layouts and have them natively rendered by the browser. This JavaScript-based port, however, makes it possible to view them in recent builds of Chrome, Firefox, Safari and even Opera.</p>
<h2>How do I use it?</h2>
<p>As with most extensions, enabling grid layout with eCSStender is as simple as including <a href="http://ecsstender.org/documentation/downloading-ecsstender">the eCSStender core library</a> and <a href="http://ecsstender.org/extensions/css3-grid-alignment/">the Grid Alignment extension</a>. It’s up to you whether you’d like to download copies of each and serve them from your own domain or whether you prefer to use <a href="http://ecsstender.org/documentation/the-ecsstender-cdn/">the new eCSStender <span class="caps">CDN</span></a> to handle the file delivery for you. To use the <span class="caps">CDN</span>, you’d simply include the following two scripts just before the closing <code class="html">body</code> tag:</p>
```html
  <script src="http://cdn.ecsstender.org/lib/latest/min/eCSStender.js"></script>
  <script src="http://cdn.ecsstender.org/ext/CSS3-grid-alignment/latest/min/eCSStender.CSS3-grid-alignment.js"></script>
```
<p>With those in place, you can begin playing with some of the new grid syntax. <a href="http://test.ecsstender.org/extensions/eCSStender.CSS3-grid-alignment.js/test/grid-system/index.html">The test case</a> I built the extension against sets up one of several grids like this:</p>
```css
  #demo {
   width:945px;
   display:grid;
   grid-columns: 145px 1fr 145px 1fr 145px 1fr 145px 1fr 145px 1fr 145px;
   grid-rows: 186px 692px 357px; 
  }
```
<p>That code builds a grid structure within <code class="html">#demo</code> that is comprised of six primary columns (at 145px wide each) with equal-width “gutter” columns between them (their width is determined using equal division of the remaining space as indicated by “1fr” meaning “one fraction”). It also defines three rows of varying heights within <code class="html">#demo</code>. Grid items are then positioned on the grid using coordinate-like syntax:</p>
```css
  #articles {
   grid-row:2;
   grid-column:1;
  }
```
<p>The full <span class="caps">CSS</span> for <a href="http://test.ecsstender.org/extensions/eCSStender.CSS3-grid-alignment.js/test/grid-system/index.html">the Grid System demo</a> can be viewed <a href="http://test.ecsstender.org/extensions/eCSStender.CSS3-grid-alignment.js/test/grid-system/grid.css">here</a>.</p>
<p>The extension is by no means complete (the spec is fairly large and will require months to build an exhausitve implementation), but it does let you begin experimenting with the syntax immediately.</p>
<h2>Is This the Future of Grid-based Web Design?</h2>
<p>To me, this spec is very much in it’s infancy (despite having an experimental implementation in the <span class="caps">IE</span>10 platform preview). The fine folks at Microsoft (who, in full disclosure, funded the development of the extension) are keen to get people playing with the proposed syntax. I, for one, am not completely sold on the syntax as it is currently proposed. From a developer’s standpoint it makes sense because it feels like you’re building an invisible series of rows and columns, onto which you are attaching pieces of your document. As <a href="https://twitter.com/markboulton/status/99122324330127360">Mark Boulton pointed out on Twitter</a>, however, the syntax is not as analogous to a designer’s concept of a grid, which could slow the adoption of the spec if it were to be finalized as-is.</p>
<p>Despite obviously working my tail off to get this extension up and running, I’m most excited to see how <a href="http://lists.w3.org/Archives/Public/www-style/2011Apr/0303.html">the conversation</a> opens up on grid-based <span class="caps">CSS</span> layouts and how the spec evolves. Will there be counterproposals? Yup. <a href="https://twitter.com/markboulton/status/99123592394059776">Mark’s working on one</a> and I’d love to see more. All I know is that the more we—the grunts in the <span class="caps">CSS</span>-authoring trenches—get involved in <a href="http://www.w3.org/2005/10/Process-20051014/tr.html#Reports">the spec development process</a>, the better the end result will be. And I’m looking forward to helping turn even more ideas into workable prototypes using eCSStender.</p>
