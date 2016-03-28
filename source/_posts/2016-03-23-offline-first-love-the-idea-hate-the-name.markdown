---
layout: post
title: "Offline First: Love the Idea, Hate the Name"
date: 2016-03-28 08:25:26 -0400
comments: true
categories: [philosophies,"web design"]
description: "With the rise of Service Workers as a simple, usable means of making our content available offline, I thought it worth revisiting the idea of “offline first”, if only to address its core fallacy."
---

Back in 2014, I had the great pleasure of listening to [Ola Gasidlo](https://twitter.com/misprintedtype) of [Hood.ie](http://hood.ie/) [discuss the importance of offline](https://vimeo.com/103221949) at Beyond Tellerrand in Düsseldorf, Germany. Her excellent talk was my introduction to [the "Offline First" movement](https://www.google.com/search?q=offline+first) and, while I can get behind the idea, I’ve had some serious issues with the name. And with the rise of Service Workers as a simple, usable means of making our content available offline, I thought it worth revisiting the idea of "offline first", if only to address its core fallacy.

<!-- more -->

First, the good stuff: The "offline first" movement clearly recognizes the current dilemma of our time:

> We live in a disconnected & battery powered world, but our technology and best practices are a leftover from the always connected & steadily powered past.

[App Cache](https://www.w3.org/TR/2011/WD-html5-20110525/offline.html), [Web SQL](https://www.w3.org/TR/webdatabase/), [Web Storage](https://www.w3.org/TR/webstorage/), [Indexed DB](https://www.w3.org/TR/IndexedDB/), [Service Workers](https://www.w3.org/TR/service-workers/), and a handful of other specs and ideas were all created to address this core limitation of the Web. They also make it possible to compete with "native" software experiences. I am 100% on board with this move. It sucks to open Chrome on my mobile and switch to a tab that’s been tucked out of view for a while only to have the page fail to load because I happen to be traveling abroad without a data plan. If that site was made to work offline, the fact that Chrome had recycled the RAM and CPU that tab had been consuming would be less of a problem and the page would load instantly from the cache.

Tunnels… hotel wifi… high latency mobile networks… expensive roaming data plans… these are all reasons we need an offline Web. I’m incredibly thankful for all of the hard work the smart folks working on solutions like these are contributing.

Also inline with the "offline first" movement, I think it’s important to consider the offline experience early in a project, so it isn’t forgotten or haphazardly bolted on. We need to make deliberate choices about what content and assets we are caching. We need to plan for offline, maybe not *first*, but certainly early.

All of this is to say I don’t have an issue with the philosophy of "offline first", but I do take issue with the name. As a term, it’s a bit disingenuous. Looking at other "firsts"—"mobile first" or (to go back little further) "content first"—these terms work on multiple levels: They remind us to keep the core purpose of a page or interface central to our planning. They also support an experience that begins and ends with that core.

A "mobile first" experience starts with a distraction-free central message or content, optimized for a small screen and (often) a single, narrow viewport. It can be enhanced for larger screens and more capable devices, but that core experience may be all some users get, and that’s ok. Users will have an experience (and a site that works) no matter what. The same is true with a "content first" approach; its experience remains available regardless of device or access mechanism. Sure, both "mobile first" and "content first" require the network, but guess what: "**Offline first" requires network connectivity too!** [You don’t see many websites delivering their content on USB drives](http://www.dynamicdrive.com/forums/showthread.php?62807-Run-Website-from-a-Flashdrive-or-CD), so all of the code required to make the offline experience possible in the first place requires an initial (and stable) connection to the Web. In other words, offline can’t be first.

You may be wondering *Why is that important?* It’s important because, historically, a "first" approach (as I mentioned) sets an expectation of that experience always being available. Offline can’t provide that.

Moreover, offline has another core dependency beyond the network: JavaScript. Without JavaScript, none of your fancy offline stuff—except App Cache, which few folks are using these days—will work. And yes, I know, *everyone* has JavaScript support… but the reality is that [not everyone will get your JavaScript enhancements](https://gds.blog.gov.uk/2013/10/21/how-many-people-are-missing-out-on-javascript-enhancement/), [even if that were actually the case](http://kryogenix.org/code/browser/everyonehasjs.html).

Please don’t misunderstand the purpose of this post: I applaud the ideas behind the "offline first" movement and the amazing work that community is doing. And you should absolutely incorporate offline into projects you are building for the Web. Users with capable devices and browsers will thank you for it. Just try not to use the term "offline first" or at least be prepared for me to cringe a little when you do. Maybe I’m the only one who feels this way; if so, I’m okay with that. But, then again, semantics matter. Maybe we need a different rallying cry. Sadly "Offline Too" doesn’t have the same ring to it.