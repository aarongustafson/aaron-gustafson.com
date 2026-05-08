---
title: "Don’t Sell Out Your Users"
date: 2012-04-24 13:17:00
comments: true
tags:
  - "progressive enhancement"
  - "web standards"
  - "HTML"
  - "user experience"
  - "web development"
description: "As a profession, we spend a lot of time thinking of the best ways to protect our users’ data and their privacy. In fact, most sites have exhaustive Privacy Policies detailing what information they collect and what they may do with it..."
canonical: "https://blog.easy-designs.net/archives/dont-sell-out-your-users/"
---

<p>
	As a profession, we spend a lot of time thinking of the best ways to protect our users’ data and their privacy. In fact, most sites have exhaustive Privacy Policies detailing what information they collect and what they may do with it. That’s why I find it bizarre that many of these same sites have chosen to hand over their users’ browsing habits to third parties such as Twitter, Facebook, and Google without considering the implications.</p>

<!-- more -->

<p>
	You see, any time you add third party widget code—a “tweet this” button, for example—a request is made to that third party’s server in order to retrieve the required snippet of JavaScript. When that request is sent, information is sent to the server in the form of headers and (as is often the case) cookies. The <a href="http://en.wikipedia.org/wiki/List_of_HTTP_headers">headers usually contains general information about the browser being used, referring page, etc.</a> and don’t generally pose much of a threat, but <a href="http://en.wikipedia.org/wiki/Browser_cookies#Privacy_and_third-party_cookies">cookies are another matter altogether</a>.</p>
<p>
	When a user visits a site—say, Facebook—she is typically cookied by that site. Browsers give a user some modicum of control over what sites can set a cookie, so she could have opted out of receiving Facebook’s cookie, but most users don’t know enough to or don’t know how to opt-out of cookies. Once that cookie is in place, it is directly associated with a specific domain (e.g. facebook.com or one of its hostnames). As long as that cookie is active, it remains on the users’ computer and accompanies any requests sent to the specifed domain. That means when this user visits a web page that includes a Facebook-supplied “Like” button, for example, Facebook can identify who she is (via the cookie) and what she’s looking at (via the request headers) without her even clicking the “Like” button. As she moves from page to page across the web, Facebook—or Google, or Twitter, or Pinterest, or AddThis, or any other service with decent distribution of its widgets—can effectively track her movement and build up a profile of her interests or browsing habits without her even knowing.</p>
<p>
	Now I’m pretty certain none of these companies started out wanting to track their users in such a manner, nor am I convinced many of them actively are (though I would not put it past Google or Facebook), but I think you can agree there is certainly potential for abuse here.</p>
<p>
	So what are we to do? Including buttons that easily allow our users to share content on their favorite social networks is extremely helpful for attracting more eyeballs to our content; it would be a shame to lose that opportunity. I agree, but just because a company offers a widget to make it simple for you to set up the button doesn’t mean you need to use it. Thankfully it isn’t really that difficult to host “share” buttons yourself, you just have to know how to do it.</p>
<p>
	Below is simplification of the current markup we use to achieve this in our blog. At present, we’ve chosen to support only four social networks: Twitter, Facebook, LinkedIn, and Google Plus.</p>
```html
  <section id="bookmark">
   <h2>Like it? Share it</h2>
   <p class="twitter"><a href="https://twitter.com/intent/tweet?original_referer=THE-CURRENT-URL&amp;source=tweetbutton&amp;text=THE+TITLE+OF+THE+PAGE&amp;url=THE-CURRENT-URL&amp;via=OUR-TWITTER-ACCOUNT"><img src="/i/button-twitter.png" alt="Tweet"/></a></p>
   <p class="facebook"><a href="http://www.facebook.com/sharer.php?u=THE-CURRENT-URL"><img src="/i/button-facebook.png" alt="Share on Facebook"/></a></p>
   <p class="linkedin"><a href="https://www.linkedin.com/cws/share?url=THE-CURRENT-URL&amp;original_referer=THE-CURRENT-URL"><img src="/i/button-linkedin.png" alt="Share on LinkedIn"/></a></p>
   <p class="google_plus"><a href="https://plus.google.com/share?url=THE-CURRENT-URL"><img src="/i/button-googleplus.png" alt="Share on Google Plus"/></a></p>
  </section>
```
<p>
	To trigger a share via Twitter, we use Twitter’s “tweet intent” <span class="caps">URL</span>: <code>https://twitter.com/intent/tweet</code>. We then supply several key-value pairs as part of the query string:</p>
<ol>
<li>
		The referer (our page) as <code>original-referer</code>;</li>
<li>
		Any text we want included in the tweet—e.g. the title of the page—as <code>text</code> (n.b. be sure to replace spaces with “+”);</li>
<li>
		the page to share as <code>url</code>; and</li>
<li>
		(optionally) a Twitter account handle you’d like the tweet to appear “via”.</li>
</ol>
<p>
	Facebook seems less complicated, but it’s really not. Sure, the <span class="caps">URL</span> is simple—<code>http://www.facebook.com/sharer.php</code> with the <span class="caps">URL</span> supplied as <code>u</code> in the query string—but to control what Facebook displays when your page is shared, you need to add some <code>meta</code> tags that describe the page as an <a href="http://ogp.me/">OpenGraph</a> object. Here’s a sample from this blog post:</p>
```html
  <meta property="og:site_name" content="The Easy Designs Blog"/>
  <meta property="og:image" content="/i/facebook-icon.png?v=20111226"/>
  <meta property="og:locale" content="en_US"/>
  <meta property="fb:admins" content="aaronmgustafson"/>
  <meta property="og:type" content="article"/>
  <meta property="og:title" content="Don’t Sell Out Your Users"/>
  <meta property="og:description" content="Most sites have exhaustive Privacy Policies detailing what information they collect and what they may do with it, which is why I find it bizarre that many of these same sites have chosen to hand over their users’ browsing habits to third parties such as Twitter, Facebook, and Google without considering the implications."/>
  <meta property="og:url" content="http://blog.easy-designs.net/archives/dont-sell-out-your-users/"/>
```
<p>
	This set of <code>meta</code> tags establishes this post as an “article” with a title, description, and a canonical <span class="caps">URL</span>, which ensures it is displayed in Facebook properly. Facebook maintains <a href="https://developers.facebook.com/docs/opengraph/">pretty decent documentation on OpenGraph and the pieces they support</a> and they also have a <a href="https://developers.facebook.com/tools/debug">handy testing tool you can use to see if everything is making it to them properly</a>. (It’s also worth noting that, using the debugger, you can also force Facebook to update any previously cached content from a given <span class="caps">URL.</span>)</p>
<p>
	Rounding out the pack are LinkedIn and Google Plus. Both use OpenGraph like Facebook does, but <a href="https://developer.linkedin.com/documents/setting-display-tags-shares">LinkedIn only supports a subset of OpenGraph tags</a>—<code class="html">og:title</code>, <code class="html">og:url</code>, and <code class="html">og:image</code> (though only if the image is wider than 150px and taller than 80px)—and <a href="https://developers.google.com/+/plugins/+1button/#plus-snippet">Google Plus would prefer you use the ridiculously convoluted attributes defined by schema.org</a>, but will fall back to OpenGraph or basic <code class="html">meta</code> title and description tags if necessary.</p>
<p>
	Now that the <span class="caps">HTML</span> links are working properly (you did test them, right?), you need some buttons. There are tons of options out there, but if you like the ones we are using, you can <a href="../../assets/posts/share-icons.psd">download a layered <span class="caps">PSD</span> from us</a> and tweak to your heart’s content. If, however, you want to go image-less, you could use one of the many great icon fonts out there (like <a href="http://keyamoon.com/icomoon/#toPreview">IcoMoon</a>). Whatever you do, just don’t link to images on a 3rd party site because then you are falling back into the same trap again because image requests also pass along headers and cookies.</p>
<p>
	And there you have it: a fully-funcitonal set of sharing tools that requires no JavaScript and doesn’t sacrifice your users’ privacy.</p>
<p>
	If you want to take it a step further, it’s pretty easy to add a tiny bit of JavaScript to make the links trigger a popup when there’s enough real estate (after all, you probably don’t want to do that on mobile). Here’s the jQuery code we currently use on this site for that purpose:</p>
```js
  $('#bookmark').delegate('a','click',function(e){
   if ( $(window).width() > 700 )
   {
   e.preventDefault();
   window.open(this.href,'share-this','height=300,width=500,status=no,toolbar=no');
   }
  });
```
<p>
	As you can see, with just a little bit of effort (and maybe a bit of research), it’s easy to protect your users. Please consider doing it on your own sites.</p>
