---
title: "Trash + DOM = Treasure?"
date: 2005-05-27 02:42:47
comments: true
tags:
  - "web standards"
  - "HTML"
  - "CSS"
  - "JavaScript"
  - "user experience"
description: "I was browsing the popular links on del.icio.us today and stumbled onto Nifty Corners and (via that page) More Nifty Corners . I have to say that I am incredibly impressed with the scripting, but I fear there is something wrong with..."
canonical: "https://blog.easy-designs.net/archives/trash-dom-treasure/"
---

<p>I was browsing the popular links on <a href="http://del.icio.us/">del.icio.us</a> today and stumbled onto <a href="http://pro.html.it/esempio/nifty/">Nifty Corners</a> and (via that page) <a href="http://pro.html.it/articoli/id_599/idcat_31/pag_1/pag.html">More Nifty Corners</a>. I have to say that I am incredibly impressed with the scripting, but I fear there is something wrong with this picture.</p>

<!-- more -->

<p>Lately, <a href="http://novemberborn.net/javascript/using-dom-for-hover">there</a> <a href="http://www.adactio.com/journal/display.php/20050421185604.xml">have</a> <a href="http://www.kurafire.net/log/archive/2005/04/26/on-separating-style-and-behaviour">been</a> <a href="http://www.robertnyman.com/2005/04/25/53/">some</a> <a href="http://novemberborn.net/javascript/using-dom-for-hover/seriously">border</a> <a href="http://www.adactio.com/journal/display.php/20040804214738.xml">wars</a> over the <abbr title="Cascading Style Sheets"><span class="caps">CSS</span></abbr> <code>:hover</code> pseudo-class and its forays into the behavior layer. Sure, it’s easier to have <abbr title="Cascading Style Sheets"><span class="caps">CSS</span></abbr> do the work sometimes, but that doesn’t make it right. Frankly, I agree with the concept that behavior should be separated from presentation, just as presentation should be separated from content (which is why I use JavaScript to open and close the faux-<code>&lt;select&gt;</code> in my <a href="http://www.easy-designs.net/articles/"><code>&lt;select&gt;</code> Something New series</a>).</p>
<p>I am also a big believer in clean, semantic markup, so I become concerned when anyone is adding superfluous code to the document to force a design issue. I know some might say I live in a glass house, but when I see someone putting code like this</p>
```html
  <div id="container">
   <b class="rtop">
   <b class="r1"></b> <b class="r2"></b>
   <b class="r3"></b> <b class="r4"></b>
   </b>
   <!–content goes here –>
   <b class="rbottom">
   <b class="r4"></b> <b class="r3"></b>
   <b class="r2"></b> <b class="r1"></b>
   </b>
  </div>
```
<p>into their document (even if it is via the <abbr title="Document Object Model"><span class="caps">DOM</span></abbr>), I begin to shudder. Maybe it’s the nagging purist in me, but that just seems wrong.</p>
<p>Are we falling into the old patterns again, forcing design issues through hacky markup? Does the use of non-semantic markup (<a href="http://www.meyerweb.com/eric/thoughts/2004/08/23/markup-missive/">taking a page from Eric</a>, no doubt) make it <span class="caps">OK</span>? Does the fact that it’s inserted via the <abbr title="Document Object Model"><span class="caps">DOM</span></abbr> make it any more valid? Where do we draw the line?</p>
<p>I don’t have the answer, but I think we need to have the conversation.</p>
