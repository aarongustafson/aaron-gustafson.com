---
layout: post
title: "New Browser Features, Interoperability, Craft, and the Future of the Web"
date: 2015-08-05 11:14:23 -0400
comments: true
categories: ["web design",browsers]
description: "A few thoughts and ramblings spurred by a post from PPK and reactions from Jake Archibald and Bruce Lawson."
published: false
---

Last week PPK posted [a lengthy treatise on why browser should stop "pushing the web forward"](http://www.quirksmode.org/blog/archives/2015/07/stop_pushing_th.html). I thoroughly enjoyed the read and agree with him on a number of points. I also read two well-articulated retorts from [Jake Archibald (of Google)](https://jakearchibald.com/2015/if-we-stand-still-we-go-backwards/) and [Bruce Lawson (of Opera)](https://dev.opera.com/blog/on-a-moratorium-on-new-browser-features/) and I agreed with them on a number of points as well. I guess I’m saying I see both sides and I thought I’d share my opinions and open questions.

# New Features or Interoperability?

One of the arguments PPK makes against browsers competing on adding features really rang true to me: 

> Therefore I call for a moratorium on new browser features of about a year. Let’s postpone all completely new features that as of right now don’t yet work in any browser.

> Browsers are encouraged to add features that are already supported by other browsers, and to write bug fixes. In fact, finding time for these unglorious but necessary jobs would be an important advantage of the moratorium. As an added bonus it would decrease the amount of tools web developers need.

[Back in January](/notebook/competing-on-chrome/), I wrote about how I was excited by Microsoft’s announcement of "Project Spartan" (now "Microsoft Edge") and it’s focus on interoperability. Interoperability is a long word, so I’m gonna go with "interop" from here on out.

I had not yet joined Microsoft, but I was still excited to see their focus on interop in the new rendering engine. They’d even gone, in my opinion, above and beyond—aliasing Webkit’s experimental, legacy CSS syntax to their modern, standards-based implementation. Talk about being a good web citizen!

They weren’t the first to do this either: [Opera](https://dev.opera.com/articles/opera-mobile-emulator-webkit-prefix-support/) and [Mozilla](https://wiki.mozilla.org/Platform/Layout/CSS_Compatibility#questions_and_methodology) had both been [strongarmed into this position in the past](https://lists.w3.org/Archives/Public/www-style/2012Feb/0313.html). And it’s not just for old features either. I linked to [Karl Dubost’s post bemoaning the implications of Apple’s latest vendor prefix silliness](http://www.otsukare.info/2015/07/29/vendor-prefixes-market) yesterday:

> We have reached the point where browser vendors have to start implementing or aliasing these WebKit prefixes just to allow their users to browse the Web, see [Mozilla](https://wiki.mozilla.org/Compatibility/Mobile/Non_Standard_Compatibility) in Gecko and [Microsoft](https://twitter.com/jacobrossi/status/614544147941355520) in Edge. The same thing is happening over again. In the past, browser vendors had to implement the quirks of IE to be compatible with the Web. As much as I hate it, we will have to specify the current -webkit- prefixes to implement them uniformly.

I completely understand PPK’s sentiment here. With new features being added to "the web"—but, in actuality, browser X, Y, or Z—on the regular, but without even interoperable implementations, it feels like we’re entering the browser wars again. All the new shiny is exciting, but I lived through the browser wars the first time and they kinda sucked. Web standards helped us get everyone on the same page and brokered what we’d hoped was a lasting peace.

Interop

Native software and web have always co-existed
The web is no longer being used as it was originally intended
The web is has become a JavaScript "platform"
