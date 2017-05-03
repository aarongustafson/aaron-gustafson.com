---
title: "PWAs + Desktop = Equity, Opportunity, and Reliability"
date: 2017-05-03 10:37:17 -0400
comments: true
tags: ["progressive enhancement","PWA"]
description: "PWAs enable us to provide a consistent experience *and* give us the ability to mitigate network issues, making a big difference for a lot of people regardless of the device they’re using."
crosspost_to_medium: true
---

Next week I’ll be giving a talk on [Progressive Web Apps (PWAs)](https://developers.google.com/web/progressive-web-apps/) on Windows (and desktop) at [Microsoft Build](https://channel9.msdn.com/Events/Build/2017). While researching folks perspectives on PWAs for the desktop, I stumbled on [this post from Justin Ribeiro](https://www.justinribeiro.com/chronicle/2016/09/10/desktop-pwa-bring-the-goodness/). In it, he makes a solid case for why discussions of PWAs should not be limited to mobile contexts:

> As web developers we use the desktop browser different than an average user. We use the desktop to develop and we sometimes fall prey to assumptions about the platform from that experience. 

I know for a fact that right here in my backyard—Chattanooga, TN, self-proclaimed ”Gig City“—connectivity is still a problem. Many of the folks who go through the digital literacy training programs offered by [Tech Goes Home Chattanooga](https://techgoeshomecha.org/)—which [Kelly](https://kelly-mccarthy.com/) runs—don’t have an Internet connection at home. Period.

The adults and seniors taking TGH CHA classes may not know the value of or can’t afford Internet access. Students have an Internet connection at school, of course, but when they go home to complete their homework, they’re in the same boat. And even when folks have access, in many cases the connection is sub-optimal. Many access the Internet via a [mobile](https://www.freedompop.com/) or [throttled connection](https://www.xfinity.com/support/internet/comcast-broadband-opportunity-program/) tailored to low-income families.

Justin again:

> Desktops can suffer the same ills as any mobile device, no matter how fast you think your LAN or uplink may be. Our assumptions about the desktop experience are like mobile; we believe in a perfectly fast and always connected world that does not exist.

Every improvement we can make with flakey mobile networks in mind pays dividends for folks who are using laptops and other devices without a reliable connection. PWAs excel at this.

Ultimately, the quality of the experience is what matters, but it’s not all about the network. As [Alex Russell points out](https://infrequently.org/2016/05/service-workers-and-pwas-its-about-reliable-performance-not-offline/), reliability is also key (and it’s why native software has traditionally had an edge over the Web):

> Think of it this way: the first load of a native app sucks. It’s gated by an app store and a huge download, but once you get to a point where the app is installed, that up-front cost is amortized across all app starts and none of those starts have a variable delay. Each application start is as fast as the last, no variance. What native apps deliver is reliable performance.

PWAs enable us to provide a consistent experience *and* give us the ability to mitigate network issues, making a big difference for a lot of people regardless of the device they’re using. And once we’ve got that, we can make our products even more useful by tying them in to core system components such as address books, calendar applications, and notifications—many desktop operating systems provide JavaScript hooks for those, some standardized, some proprietary.

I’m quite excited to see where all of this goes. PWAs on the desktop could be a revolution in the software development space, especially given that both [Google](https://developers.google.com/web/updates/2017/02/improved-add-to-home-screen) and [Microsoft](https://blogs.windows.com/msedgedev/2016/07/08/the-progress-of-web-apps/#rzqMVRgqClKq1PxZ.97) are already looking at ways to surface PWAs within their respective app stores. That means that PWAs will not only be viable on Android, but likely also [Chrome OS](https://www.google.com/chromebook/about/) and Windows 10 (including the newly-announced [Windows 10 S](https://www.microsoft.com/en-us/windows/windows-10-s)).