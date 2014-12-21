---
layout: post
title: "Autoplay, Don’t Do It"
date: 2014-09-19 16:12:50 -0400
comments: true
categories: ["web design", "web development", video, audio]
description: "A while back GogOm reported on Facebook’s sole responsibility for an increase in mobile data usage by 60% by auto-playing videos. Don’t do it."
in_reply_to: https://gigaom.com/2014/09/04/facebooks-autoplay-has-led-to-a-60-boost-in-traffic-on-mobile-networks/
---

A while back [GogOm reported on how Facebook’s decision to autoplay videos led to a 60% increase in mobile data usage](https://gigaom.com/2014/09/04/facebooks-autoplay-has-led-to-a-60-boost-in-traffic-on-mobile-networks/). It was a business decision with the intent of increasing engagement, but it was a bad decision from a user experience. It’s a tax on users and they weren’t to happy about it.

You may be wondering _Why is this a bad thing for users? They want to see videos, so we’re just giving them what they want._ Well, let me share a little story.

I was in Lisbon for [UxLx](http://lanyrd.com/2013/uxlx/) last year and was on roaming data through my mobile provider. At the hotel, the Wifi was giving me trouble, so I opted to tether my computer so I can pull down a document I needed. Chrome crashed. Lame, but no big deal. I relaunched it and, Chrome being the helpful browser that it is, all of my tabs were restored and I got back to work.

A few minutes later I got a text message from my provider: I’d just used a tremendous amount of my data in a very short amount of time. And I had only landed an hour before. I was understandably concerned. And perplexed. What happened?

Well, it turns out one of the tabs that re-spawned after Chrome crashed was a page on YouTube. And on that page was an hour-long video. In HD. And it auto-played. I had the volume off and it was in background tab, so I had no idea.

YouTube’s “business decision” to autoplay their videos cost me real money. A lot of it.

Don’t autoplay. Any benefits you might see in user engagement are probably going to be drowned out by legitimate complaints from your users. Just don’t do it.

Incidentally, you can [disable auto-play in Facebook](https://www.facebook.com/help/633446180035470), but first of all you have to know it’s an option. Facebook gives you the choice of turning it on or off entirely or to turn it on only over Wifi. That may seem like a great compromise, but I’d like to put forward a few arguments as to why it’s not:

1. *Tethering:* If I am tethered to my phone, it is likely being done over Wifi. Even if my browser is aware that I am on Wifi and even if the website is paying attention to that (using the [Network Informaion API](http://www.w3.org/TR/netinfo-api/)), the website is probably going to get a false positive for Wifi even though the _actual_ data connection is over a mobile network.
2. *Metered Wifi:* Hotels and other providers often limit how much data you can use. You could be on an awesomely fast Wifi network, but if you are limited to 100MB—it happens—being on Wifi doesn’t matter.

So again: Autoplay, don’t do it.