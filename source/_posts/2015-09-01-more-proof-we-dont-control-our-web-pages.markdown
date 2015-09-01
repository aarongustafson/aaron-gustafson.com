---
layout: post
title: "More Proof We Don’t Control Our Web Pages"
date: 2015-09-01 11:33:59 -0400
comments: true
categories: ["web design",networks,JavaScript,advertising]
description: "A few links worth taking a peek at."
---

I’ve talked about this before: As web designers, [we can’t trust the network](http://www.aaron-gustafson.com/notebook/the-network-effect/). Sure, we have to contend with mobile data "dead zones" and dropped connections as our users move about throughout the day, but there’s a lot more to the network that’s beyond our control.

<!-- more -->

Here’s a roundup of some of my "favorite" network issue related headlines from the last few years:

* [Sky Broadband misclassified the jQuery CDN as a malware site](http://www.theguardian.com/technology/2014/jan/28/sky-broadband-blocks-jquery-web-critical-plugin) and broke much of the web for their users.
* [Comcast admitted to injecting self-promotional advertising](http://arstechnica.com/tech-policy/2014/09/why-comcasts-javascript-ad-injections-threaten-security-net-neutrality/) into web pages served by their Xfinity routers. (They have also been called out for [artificially inflating subscriber bandwidth usage with their own crap](https://blog.ryankearney.com/2013/01/comcast-caught-intercepting-and-altering-your-web-traffic/).)
* [United was recently called out for blocking access to the <cite>New York Times</cite>](http://arstechnica.com/business/2015/08/united-in-flight-wi-fi-reportedly-blocks-ars-technica-and-new-york-times/) on their in-flight Wi-Fi.
* [Someone discovered AT&T was injecting CSS, images, and JavaScript into pages](http://webpolicy.org/2015/08/25/att-hotspots-now-with-advertising-injection/) served via their airport hotspots.
* [Samsung smart TVs were found to be injecting video ads](http://www.cnet.com/au/news/samsung-smart-tvs-forcing-ads-into-video-streaming-apps/) into video streaming apps.
* [Sprint injects JavaScript into pages](http://pleckey.me/blog/2013/09/11/sprint-mobile-broadband-injecting-3rd-party-javascript/) served via its data connections.
* [Browser add-ins can inject their own advertisements](http://www.ecommercetimes.com/story/82117.html). They can also alter the DOM, load conflicting versions of JavaScript libraries, and more. Awesome, I know. (This is being addressed, but is a persistent issue when add-ins have the ability to manipulate the DOM.)

Some of these issues can be avoided by serving content over HTTPS, but that still won’t enable you to bypass things like firewall blacklists (which led to the jQuery outage on Sky). Your best bet is to design defensively and make sure your users can still accomplish their goals on your site when some resources are missing or markup is altered.

We can’t control what happens to us in this world, we can only control our reaction to it.