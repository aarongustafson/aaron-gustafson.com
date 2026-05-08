---
title: "Scroll and Flash"
date: 2006-04-28 02:49:28
comments: false
tags:
  - "JavaScript"
  - "animation"
  - "user experience"
description: "At SXSW , I gave a sneak peek at the new bizhub Pro site I built for Konica Minolta and, in particular, the “scroll and flash” usability enhancement I added to the product pages. I have gotten a lot of questions about it and the..."
canonical: "https://blog.easy-designs.net/archives/scroll-and-flash/"
---

<p>At SXSW, I gave a sneak peek at the <a href="http://www.bizhubpro.com/">new bizhub Pro site I built for Konica Minolta</a> and, in particular, the “scroll and flash” usability enhancement I added to the product pages. I have gotten a lot of questions about it and the technique even generated <a href="http://web.archive.org/web/20080120011442/nubyonrails.com/articles/2006/03/22/yet-another-realigned-theme">some discussion over on Geoffrey’s site</a>. Well, the site finally launched and you can now see the “scroll and flash” for yourself.</p>

<!-- more -->

<p><img alt=" " class="focal" src="http://static.flickr.com/51/135882899_26ce7cf8ff_o.png" style="width: 300px;"/></p>
<p>To check it out, go to a product page (the <a href="http://web.archive.org/web/20071218122253/www.bizhubpro.com/products/920/">bizhub PRO 920</a>, for instance) and click one of the links on the upper right of the focal image and watch the show (or you can <a href="http://web.archive.org/web/20071218122253/www.bizhubpro.com/products/920/">go directly to a bookmark</a>). <abbr title="Asynchronus JavaScript and XML">AJAX</abbr> is used to refresh the page content (with bookmarkable links) and then the “scroll and flash” takes over. Feel free to take a gander at <a href="http://web.archive.org/web/20070406095027/www.bizhubpro.com/scripts/product-pages.js">the <abbr title="JavaScript">JS</abbr> file</a> to see how it’s done.</p>
<p>I have to give it up to <a href="http://www.shauninman.com">Shaun Inman</a> and <a href="http://script.aculo.us/">Thomas Fuchs</a> as it was their hard work that made this easy for me to do.</p>
<p><strong>Update:</strong> It looks like someone has not taken proper care in managing these pages since <a href="/notebook/leap/">I left Cronin and Company</a> (where I had built the site), so not all of the links appear to be working (because their anchors have been removed… tsk, tsk). I’ve let Cronin know and hopefully that will be fixed soon.</p>
