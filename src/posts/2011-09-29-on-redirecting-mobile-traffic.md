---
title: "On Redirecting Mobile Traffic"
date: 2011-09-29 11:24:34
comments: false
tags:
  - "mobile"
  - "CSS"
  - "user experience"
description: "While perusing the latest Costco email, I stumbled onto a pretty sweet looking mini-greenhouse and decided to click through to read more about the product. Unfortunately for me, I was on my phone and Costco is not particularly savvy..."
canonical: "https://blog.easy-designs.net/archives/on-redirecting-mobile-traffic/"
---

<p>While perusing the latest Costco email, I stumbled onto <a href="http://www.costco.com/Browse/Product.aspx?Prodid=11524865">a pretty sweet looking mini-greenhouse</a> and decided to click through to read more about the product. Unfortunately for me, I was on my phone and Costco is not particularly savvy about how they handle the redirection of mobile traffic to their “mobile friendly” site. Instead of landing on the product page as I should have, I was redirected to the mobile landing page.</p>

<!-- more -->

<figure><img alt="" src="/i/posts/2011-09-29/costco-redirect.png"/></figure>
<p>Now I am not completely sold on the need for creating (and maintaining) an independent mobile version of every website; sometimes it makes sense, but other times it’s overkill. That said, however, I am sure of one thing: <strong>if you do redirect mobile traffic, make sure you do so to an equivalent <span class="caps">URI</span>; don’t redirect all requests to the homepage</strong>. When users click a link, they have an expectation of what they will find on the other end of that link. Make sure you meet that expectation.</p>
<p>I can’t speak to Costco’s server setup specifically because it seems their main site is .Net and the mobile version is <span class="caps">JSP</span>/Struts (neither of which are my cup of tea), but for those of you running Apache (which more than half of you likely are), setting up proper redirection is relatively easy using an .htaccess file:</p>
```apacheconf
  # setup
  RewriteEngine on
  RewriteBase /
  
  # product redirection based on iPhone and product request
  # note: the user agent check is contrived, you should have 
  # a much more robust checker
  RewriteCond %{HTTP_USER_AGENT} iPhone
  RewriteCond %{QUERY_STRING} Prodid=(\d+)
  RewriteRule ^Browse\/Product.aspx http://m.costco.com/costco/product/productDirectDetail.do?itemId=%1 [R=301,L]
```
<p>Here’s what this snippet does:</p>
<ul>
<li>Line 2 ensures redirection is on;</li>
<li>Line 3 lets us assume all URIs start with “/”;</li>
<li>Line 8 is a very contrived test for a mobile device by querying the User Agent string being reported by the browser, in a real-world scenario, you will want a much more robust test here;</li>
<li>Line 9 tests for the existence of a “Prodid” value in the query string and captures the actual product <span class="caps">ID</span> (in Costco’s case, a series of digits) so we can use it later on; and</li>
<li>Line 10 redirects all requests for “/Browse/​Product.aspx” that pass the two previous tests to “http://m.costco.com/​costco/​product/​productDirectDetail.do” and adds the captured product <span class="caps">ID</span> to the query string as “itemId” (“%1” tells Apache to use the digits that were captured on line 9).</li>
</ul>
<p><span>With this sort of simple redirection in place, you can ensure users get where they want to go, quickly and easily.</span></p>
