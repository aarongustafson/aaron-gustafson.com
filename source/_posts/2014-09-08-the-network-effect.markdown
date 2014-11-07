---
layout: post
title: "The Network Effect"
description: "Comcast’s move to inject JavaScript into other people’s web pages via their XFinity routers only serves to remind us—yet again—that we don’t control how our sites are delivered or what our users see."
date: 2014-09-08 16:40:44 -0400
comments: true
categories: ["web design", JavaScript]
---

<cite>Ars Technica</cite> revealed today that [Comcast is injecting self-promotional advertising into web pages delivered via it’s Wi-Fi hotspots](http://arstechnica.com/tech-policy/2014/09/why-comcasts-javascript-ad-injections-threaten-security-net-neutrality/):

<blockquote cite="http://arstechnica.com/tech-policy/2014/09/why-comcasts-javascript-ad-injections-threaten-security-net-neutrality/">
	<p>A Comcast spokesman told Ars the program began months ago. One facet of it is designed to alert consumers that they are connected to Comcast's Xfinity service. Other ads remind Web surfers to download Xfinity apps, Comcast spokesman Charlie Douglas told Ars in telephone interviews.</p>
</blockquote>
	
I wish I could say this is surprising, but it’s not: Any service that routes your content has the opportunity to modify the response being returned. Comcast is exploiting that opportunity and injecting JavaScript that, in turn, injects the ads.

<!-- more -->

The fact that middlemen can manipulate server responses is one reason [Google is pushing for all sites to be served under HTTPS](https://www.youtube.com/watch?v=cBhZ6S0PFCY). With traffic running to and from your server in an encrypted fashion, [man-in-the-middle attacks](http://en.wikipedia.org/wiki/Man-in-the-middle_attack)—which, if we’re honest, is what this amounts to—become much more difficult.

Assuming you can’t run under HTTPS for one reason or another, how do you harden your [web thang](https://adactio.com/journal/6246) against 3rd party manipulation you can’t control? What if Comcast’s JavaScript interferes with your own? Remember when [Sky blocked jQuery for all of their customers](http://www.theguardian.com/technology/2014/jan/28/sky-broadband-blocks-jquery-web-critical-plugin)? That was a bad couple of hours for most UK-based internet users.

Comcast’s move only serves to remind us—yet again—that we don’t control how our sites are delivered or what our users see. Or rather we do, but only up to a point. So rather than focus on some ideal experience we expect everyone to have, we must focus on building great experiences that work in a variety of contexts and situations.

We need to develop [the 1964 Chrysler Imperial](http://en.wikipedia.org/wiki/Demolition_derby#Vehicles) of websites: Sites that soldier on even when they are getting pummeled from all sides. After all, browsers, plug-ins, users, networks, and, yes, even the very routers that deliver our connections all have a say in how (and what) content gets to our users.

I’ll leave you with this scary quote from the <cite>Ars</cite> piece:

<blockquote cite="http://arstechnica.com/tech-policy/2014/09/why-comcasts-javascript-ad-injections-threaten-security-net-neutrality/">
	<p>Security expert Dan Kaminsky said in an e-mail that JavaScript injection has the potential to break “all sorts of stuff, in that you no longer know as a website developer precisely what code is running in browsers out there. You didn't send it, but your customers received it.”</p>
</blockquote>
	
Hooray!