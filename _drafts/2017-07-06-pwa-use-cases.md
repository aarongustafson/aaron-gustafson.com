---
layout: post
title: "The Many Reasons Your Site—Any Site—Should be a PWA"
date: 2017-06-30 10:03:04 -0400
comments: true
tags: ["progressive web apps", "web design", "web development", "user experience"]
description: "While the name might imply that Progressive Web App tech is aimed at “apps”, every site can benefit from the tools they provide."
---

The other day, [Frances Berriman](https://fberriman.com/)—who coined the term “Progressive Web App”—wrote a bit about how she came up with that name. In it she clearly points out that the name has become a little problematic in dev circles:

> I keep seeing folks (developers) getting all smart-ass saying they should have been PW “Sites” not “Apps” but I just want to put on the record that it doesn’t matter. *The name isn’t for you* and worrying about it is distraction from just building things that work better for everyone. The name is for your boss, for your investor, for your marketeer. It’s a way for you to keep making things on the open web, even those things that look really “app-y” and your company wants to actually make as a native app, 3 times over. They don’t want you to make websites anymore, but you still can if you’re sneaky, if you tell them it’s what they think they want.

As someone who is at once a practitioner, an educator, and a consultant on web projects, this can be tough to wrestle with. But like DHTML, Ajax, and HTML5 before, when viewed as a catch-all term for an approach to building stuff for the web it really shouldn’t matter that the word “app” is in there. Sure, it *could* have been “site” or [“thang”](https://adactio.com/journal/6597), but when we—and I’m talking to the practitioners here—hear someone talking about PWAs, we need to take the broad view.

Jeremy Keith made [a really solid case for the broad usefulness of PWAs](https://adactio.com/journal/12461):

<blockquote cite="https://adactio.com/journal/12461">
<p>Literally any website can be a progressive web app:</p>
<ul>
<li>switch over to HTTPS,</li>
<li>add [a JSON manifest file](https://www.w3.org/TR/appmanifest/) with your [metacrap](https://www.well.com/~doctorow/metacrap.htm), and</li>
<li>add a service worker.</li>
</ul>
</blockquote>

PWAs don’t require you use a particular JavaScript framework or any JavaScript framework at all. You don’t need to be building a Single Page App either. In fact, it will probably be easier if you’re not.

In his piece, Jeremy calls out Christian Heilmann for poo-pooing turning your blog into a PWA when he said

> When somebody, for example, turns their blog into a PWA, I don’t see the point. I don’t want to have that icon on my homepage. This doesn’t make any sense to me.

He goes on to characterize Christian’s position as being against people using PWA-related tech on their blogs, portfolios, and other personal sites. I think this was completely unfair on Jeremy’s part as that wasn’t what Christian was saying. Chris can—[and has](https://christianheilmann.com/2017/06/27/any-web-site-can-become-a-pwa-but-we-need-to-do-better/)—set Jeremy straight on this, but I think it’s important to point out that all he was saying was that he would not personally choose to “install” someone’s blog on his device. And while installation is an option with PWAs, it’s not the only way users benefit from them.

I’ve seen lots of articles and blog posts touting the benefits of PWAs and how to make them, but I’ve yet to come across one that talks about use cases and considerations for them. As such, I decided to run through a handful of web project archetypes and examine them in light of the characteristics most often associated with them. Along the way, I’ll point out the ways in which end users might benefit from them gaining PWA superpowers. I’ll also include important questions to ask as well as potential gotchas and areas for concern.

## All Sites

Some use cases are universal and so is the applicability of many of the characteristics of a PWA. So let’s start with those:

* **Progressive:** Someone is coming to your site for a reason. If they can’t access it because they happen to use a device or browser you’re unfamiliar with or haven’t tested on, that’s a problem. Ensure your site works on any device that can access the Web, regardless of its capabilities. Then optimize that experience for more modern browsers and devices. [Progressive enhancement is your friend](https://adaptivewebdesign.info). It’s also [a more economical approach](https://medium.com/@AaronGustafson/the-true-cost-of-progressive-enhancement-d395b6502979) in the long-run.
* **Responsive:** If your site doesn’t adapt to the width of your users’ browser, it’s not going to give them a good experience or a good impression of you or your company. There are a ton of great resources for building responsive layouts and scant reasonable excuses not to be building this way. Being responsive is a given in 2017.
* **App-like** - Users that (dare I say it?) enjoy using your site will come back if they have a reason to. The more you can do to provide a consistent, seamless, effortless user experience (which is really what "app-like" is implying here), the more likely you are to see repeat visits. It’s worth noting that this doesn’t mean you have to use JavaScript; it simply means you should think about the flow you user takes through your site and take every opportunity to remove the friction from the process of them accomplishing their goals.
* **Safe:** The cost of running your site under HTTPS has [dropped to zero](https://letsencrypt.org). Sure, [there are legitimate challenges to converting large existing websites](https://www.wired.com/2016/09/wired-completely-encrypted/) over, but it’s worth it for so many reasons. The primary one is that it protects your users from [malicious man-in-the-middle attacks being made by ISPs](https://www.aaron-gustafson.com/notebook/the-network-effect/), hotels, airports, infected routers, or others with network access. HTTPS ensures that both the code and content you send to your users actually arrives intact. [It’s not fool-proof](https://www.aaron-gustafson.com/notebook/links/gogo-is-using-man-in-the-middle-malware-tactics-on-its-own-users/), but it’s an important step in protecting your users and your data. Running HTTPS is also a prerequisite for access to many of the newer (and more sensitive) APIs including [Geolocation](https://developer.mozilla.org/docs/Web/API/Geolocation) and [Service Workers](https://developer.mozilla.org/docs/Web/API/Service_Worker_API).
* **Discoverable:** If you built it, you probably want folks to find it. Your site’s content should be written in such a way that it pops up when people search for related topics. Don’t get all spammy, but take care to author content in a thoughtful, appropriate, and straightforward way. You may also want to do yourself a favor and spend some time putting together some [Open Graph `meta` tags](http://ogp.me/) and some [JSON-LD](https://json-ld.org/) to make your content even more shareable.
* **Linkable:** If your users can reach a certain point in your site via natural navigation, you should do your best to ensure they can save their place by bookmarking it or when they re-launch their web browser and your site’s tab is re-launched.

## Personal Sites (e.g. vanity sites, portfolios, etc.)

If you’ve got a personal profile site or a portfolio, chances are your traffic mainly consists of folks wanting to know more about you. 

* **Network independent:** Though often touted as one of the major benefits of PWAs (on account of Service Worker controlled caching), this one probably has less applicability for personal sites. Unless you are an incredibly popular artist or designer and you often post new artwork and such, chances are your traffic will be light and you won’t get a ton of repeat visits. That means offline caching may not present a huge benefit to your visitors. In fact, caching high-res versions of all of your designs (for instance) might be an [anti-pattern](https://sourcemaking.com/antipatterns). Now I’m not saying to ignore caching altogether, but be smart about it. Ask the following questions:
  * If I am going to cache any of my content and/or assets, what makes the most sense to cache? Perhaps it’s just your CSS and homepage HTML and assets. Maybe it’s your resume.
  * How long should I cache those assets? While it is not yet possible to have a Service Worker purge its caches using [a periodic background sync event](https://github.com/WICG/BackgroundSync/blob/master/explainer.md).
* **Fresh** - Whether or not you choose to use Service Workers to handle caching, your users will expect the content they get to be up-to-date. If there is a newer copy on the network, use it and fall back to the cached version only when the network isn’t available.
* **Re-engageable** - In the context of a personal site (not a blog), push notifications and other means of drawing your users’ attention back to your site are probably overkill. In fact, they might even be an annoyance to your users. Sure, they’d need to opt in before getting the messages, but unless you have a truly compelling reason for offering this feature, it’s probably not worth the effort.
* **Installable** - Once you are a PWA, it’s totally possible for someone to install your site to their home screen or desktop. I’d be very surprised to hear of a user actually choosing to do this with a personal website. It’s not impossible, just improbable.

## Periodicals (blogs, news sites, magazines, etc.)

Despite the seeming constant focus on "apps", information is still the name of the game on the Web. Users want quick access to the news, articles, stories, and posts on offer. Emphasis on quick; speed is key here.

* **Network independent:** You can (and should) be caching as many of your common assets as possible here. You CSS and JavaScript, of course, but also any custom fonts, SVG icons, and so on. Once your users have visited their first page, that stuff will be sitting in the cache and you can drastically increase the speed of subsequent page visits. This will also help on flakey connections.
* 
