---
title: "Server-side FigureHandler thoughts"
date: 2007-10-11 12:19:49
comments: true
tags:
  - "web development"
  - "HTML"
description: "In reaction to my latest article for A List Apart , on FigureHandler , many folks have boldly claimed that this sort of thing should be done server-side . Below are my thoughts on the matter as posted as a comment in the article’s..."
canonical: "https://blog.easy-designs.net/archives/server-side-figurehandler-thoughts/"
---

<p>In reaction to <a href="http://www.alistapart.com/articles/figurehandler/">my latest article for A List Apart</a>, on <a href="http://code.google.com/p/easy-designs/wiki/FigureHandler">FigureHandler</a>, many folks have <a href="http://www.alistapart.com/comments/figurehandler?page=1#8">boldly claimed that this sort of thing</a> <a href="http://www.alistapart.com/comments/figurehandler?page=2#17">should be done server-side</a>. Below are my thoughts on the matter as posted as a comment in <a href="http://www.alistapart.com/comments/figurehandler/">the article’s discussion thread</a>.</p>

<!-- more -->

<blockquote cite="http://www.alistapart.com/comments/figurehandler?page=2#18">
<p>Many of you have brought up that this should be done server-side and, while I agree that it <em>could</em>, it would need to be done in the most flexible way possible (which many won’t bother with). You see, what this script allows quite easily is redesign; a designer can change page layout—“of an entire site <strong>or</strong> section by section—“without ever having to touch the back-end. It also allows for different columns to receive different figure classification schema.</p>
<p>If this were done on the content-entry side (as some have suggested), the image classifications would be stored in the database (or <abbr title="eXtensible Markup Language">XML</abbr> or whatever) along with the rest of the content <abbr title="HyperText Markup Language">HTML</abbr>. That means that if the design were to shift to a wider column (for example), the figures that once occupied a half-column, may no longer continue to do so, making the classifications hard-coded in the <abbr title="HyperText Markup Language">HTML</abbr> incorrect.</p>
<p>The only way to truly do this flexibly on the back end (as far as I can see) is to leave the classification step to be handled by a function which pre-processes the page output, dynamically assigning the classifications to each figure based on values obtained from the CSS for that page. Essentially, the script would need to go through the same steps as the JavaScript, but it would need to be able to go the extra step of determining applicable CSS rules to obtain the column width. Thankfully, most server-side languages support some means of DOM walking (albeit sometimes in less-than-desirable ways), but, as far as I know, none have a CSS parser, so you’d likely need to write that as well. From a server overhead point-of-view, I imagine that preprocessing would be fairly costly (most DOM-related stuff is), but the output for each page could be cached, reducing it somewhat.</p>
<p>If you’re interested in doing something like this, goodonya. I’ve built you a pretty decent roadmap for implementation, but I don’t imagine it will be easy to get it up and running. That said, I wish you luck…it would be yet another great tool for enabling designers to create consistent layouts with figures.</p>
</blockquote>
