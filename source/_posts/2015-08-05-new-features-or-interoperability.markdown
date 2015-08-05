---
layout: post
title: "New Browser Features, Interoperability, Craft, and the Future of the Web"
date: 2015-08-05 11:14:23 -0400
comments: true
categories: ["web design",browsers]
description: "A few thoughts and ramblings spurred by a post from PPK and reactions from Jake Archibald and Bruce Lawson."
published: false
---

Last week PPK posted [a lengthy treatise on why browsers should stop "pushing the web forward"](http://www.quirksmode.org/blog/archives/2015/07/stop_pushing_th.html). I thoroughly enjoyed the read and agree with him on a number of points. I also agreed with the well-articulated retorts of [Jake Archibald (of Google)](https://jakearchibald.com/2015/if-we-stand-still-we-go-backwards/) and [Bruce Lawson (of Opera)](https://dev.opera.com/blog/on-a-moratorium-on-new-browser-features/) on a number of points. I guess I’m saying I see both sides and I thought I’d share my opinions and open questions.

## New Features vs. Interoperability

One of the arguments PPK makes against browsers competing on adding features really rang true to me: 

> Therefore I call for a moratorium on new browser features of about a year. Let’s postpone all completely new features that as of right now don’t yet work in any browser.

> Browsers are encouraged to add features that are already supported by other browsers, and to write bug fixes. In fact, finding time for these unglorious but necessary jobs would be an important advantage of the moratorium. As an added bonus it would decrease the amount of tools web developers need.

[Back in January](/notebook/competing-on-chrome/), I wrote about how I was excited by Microsoft’s announcement of "Project Spartan" (now "Microsoft Edge") and it’s focus on interoperability. Interoperability’s a long word, so I’m gonna go with "interop" from here on out.

I was not on the Microsoft payroll at the time, but I was still excited to see their focus on interop in the new rendering engine. They’d even gone, in my opinion, above and beyond in this regard—aliasing Webkit’s experimental, legacy CSS syntaxes to their modern, standards-based implementations. Talk about being a good web citizen! 

They weren’t the first to do this. [Opera](https://dev.opera.com/articles/opera-mobile-emulator-webkit-prefix-support/) and [Mozilla](https://wiki.mozilla.org/Platform/Layout/CSS_Compatibility#questions_and_methodology) had both been [strongarmed into this position in the past](https://lists.w3.org/Archives/Public/www-style/2012Feb/0313.html). I have to say it’s a weird world when one browser vendor is forced to implement another vendor’s proprietary syntax just to make the web work, but it’s the sad state of things in our [full StackOverflow development](http://christianheilmann.com/2015/07/17/the-full-stackoverflow-developer/) world.

With the move away from vendor prefixes in CSS to "feature flags", you’d think this sort of thing would be behind us, but it’s not. Yesterday I linked to [Karl Dubost’s post bemoaning the implications of Apple’s latest vendor prefix silliness](http://www.otsukare.info/2015/07/29/vendor-prefixes-market). In that post, he made a keen observation:

> We have reached the point where browser vendors have to start implementing or aliasing these WebKit prefixes just to allow their users to browse the Web, see [Mozilla](https://wiki.mozilla.org/Compatibility/Mobile/Non_Standard_Compatibility) in Gecko and [Microsoft](https://twitter.com/jacobrossi/status/614544147941355520) in Edge. The same thing is happening over again. In the past, browser vendors had to implement the quirks of IE to be compatible with the Web. As much as I hate it, we will have to specify the current -webkit- prefixes to implement them uniformly.

I completely understand PPK’s desire for browsers to apply the brakes a bit and focus on interop. With new features being added to "the web"—but in reality browser X, Y, or Z—on the regular, without guaranteed interop, it feels like we’re entering the browser wars again. All the new shiny is exciting, but I lived through the browser wars the first time and they sucked. Web standards helped us get everyone on the same page and brokered what we’d hoped was going to be a lasting peace.

Now I’m not sure I agree with applying the brakes for a specific amount of time, but I do see great value in prioritizing interop over new features. And when browsers do implement new features, I think they should definitely put them behind feature flags (or some similar opt-in) to ensure we—the web development community—don’t start relying on some fancy new feature before it’s been thought through. Feature flags are awesome because they allow me to experiment with a new technology *in my own browser* without affecting things on the "open web".

We used to think vendor prefixes were enough of a deterrent to using a particular experimental CSS property or JavaScript method, but I would bet good money on the sad reality that 80% of the working web designers out there don’t understand that `-*-` means "experimental" or even "proprietary". We—the web design authors, speakers, educators, and other influencers—did a shitty job getting that message hammered home. But even if we’d hounded people about it, it probably wouldn’t have mattered: Vendor-prefixed properties work. And now they work even in browsers they aren’t even meant to.

So, here’s my advice to browser vendors (my own employer included):

1. Prioritize interop over new features. Don’t halt development on new features, just put them on the back burner so the rising tide can, as they say, lift *all* the ships. Let’s get some stability up in this mutha!
2. Jettison vendor-prefixes as they are not generally understood to be experimental. If you feel you must use a vendor prefix, ensure it’s enabled by a feature flag.
2. Use feature flags (or some similar opt-in) to enable developers to test experimental features in their own browsers, but to ensure they aren’t available on the "open web" before they are ready.

## The Web vs. Native

PPK has harped on this a few times. There is currently a palpable tension between "native" and "the web". It’s driving most of the new features in the web "platform"[^1] and it’s giving many of us old-timers a touch of angina.

[^1]: I think I just threw up in my mouth a little. I hate using that word when speaking about the web, but there it is.

The reason for this is simple: The web was created as a massively interconnected document repository. A wealth of knowledge dependent on the hyperlink and the URL. The web was (and indeed still is) stateless by default, meaning it has no idea who you are or what you’ve done from request to request.

As more businesses moved online, the web became necessarily transactional. Suddenly websites needed to know information about your "state" so they could sell you things and track your movements around their site and the rest of the web. With the advent of cookies and the Common Gateway Interface (CGI), the web server could adjust the content it sent in response to a request based on what it knew about you and what you were doing. 

Taking this simple capacity a step further, it became possible to write actual software on the web. Content management systems were probably the first big chunk of software to move online, but more soon followed. JavaScript came along and allowed us to add a bit of logic to the client side, reducing our reliance on round-trips to the server. Then we got Ajax and the whole JavaScript world exploded. We now have web-based photo editors, integrated development environments (IDEs), games, and more, all reliant on JavaScript’s ability to interact with the browser and manipulate what the user sees in real-time.

There were earlier machinations, but the last ten years have seen the biggest push to bring more traditional software-like interactions to the web. Dozens of organizations, big and small, are trying to make their mark creating *the* framework for building these "next-generation" web-based app experiences. Honestly, I don’t have a problem with that. I don’t really have an interest in client-side frameworks, but I don’t have a problem with them either… provided developers who wish to bring their programming talents to the web take a little time to learn about the medium.

If you don’t take the time to understand how the web works, you’ll spend half your time cursing it and the other half trying to work around the things that frustrate you (which you write off as "poorly designed" or "ill-conceived"). If you don’t understand how the web works, you’ll build fragile experiences that collapse like a house of cards when any one of your many dependencies—the network, JavaScript, some particular element or browser API—isn’t available.

I don’t particularly care too much for bringing "native like" experiences to the web. It’s not that I don’t write software (I do), I just don’t really care if something I make for the web feels like a piece of installed software. I’ll do everything in my power to ensure my users have a great experience, but I know that each person’s experience will be a little bit different and I no longer feel the need to enforce my will on their experience. I’d rather create many ways for someone to interact with the things I build and hope one or more of those work well for them.

Native software and web have always co-existed. We had installed software on computers long before the web even existed and we will continue to have installed software for as long as there are computers. Some software will move to the web if it makes sense for it to. Other software will remain native. Either option could be right or wrong depending on what you are trying to do. For instance, I would never personally write a photo editor in the browser because image processing requires a lot of memory and CPU cycles. Putting it in a browser moves it one more level away from the metal. Abstraction eases development, but it invariably increases overhead and reduces performance.

Traditional software and the web can and should co-exist. They also can and should learn from one another in order to better serve the needs of our users. 

## Change vs. Stagnation

Underpinning this whole "native vs. web" thing is, I think, a feeling many of us old-timers have that our web—the web we grew up building—is slipping away from us. We cling to the idea of the web as an open platform[^2] for people to share their thoughts, passions, and cat photos. We like the web as it was originally. We like the web as we made it.

[^2]: In the other sense of the word.

The web is changing. In some ways it’s changing for the better, in some ways for the worse, but it’s come a long way. You can certainly do a lot more in the browser now than you could when I first picked up HTML. But I don’t think halting progress on the web is desirable.

As Jake points out in his response, stagnation is not a good policy. Stagnation pretty much killed BlackBerry. It also led to a lot of developer frustration in the form of IE 6.

Change is not inherently bad. It’s pace can be quite frustrating at times, though—PPK certainly seems to be feeling that way. But when you take a step back, especially with a historical perspective, you see the changes are cyclical in many ways. The bandwidth issues we dealt with during the dial-up days are with us again in the form of mobile networks. The lessons we learned building a web for 640x480 screens are equally applicable in a world of wearables. And the text-based interactions we created in the early days will serve as a template as we move boldly forward into the realm of voice-driven user experiences.

## Cutting Edge vs. Deep Understanding

This was a central conceit of PPK’s post. He complained that we’re simply getting too many new features on the web, which makes it hard to keep up. More than that, however, it makes it hard to truly come to a deeper understanding of how these different pieces work. In other words, it’s becoming harder to be a generalist.

Jake and Bruce completely understand this, as do I. The sheer volume of new drafts, specs, and concepts is a bit overwhelming. I’m sure I don’t know half of the features that are in the HTML5 spec let alone the umpteen CSS3 modules. I probably never will. And I’m ok with that. I’ll pick and choose the bits I’m interested in playing around with and find ways to integrate them a little at a time. That’s how we learn. That’s how we’ve always learned.

To counter PPK’s fears, however, I will say that there are a lot more of us working on the web now and sharing what we learn. And we have many more tools to do so. Not only do we have the usual magazine and blog outlets, but we also have CodePen and JS Bin and Github and more.

We each have the capacity to research the hell out of one specific area of web design and be the conduit of that information for the web design hive mind. Look at Sara Soueidan with SVG or Rachel Nabors with CSS Animation or Zoe Mickley Gillenwater with flexbox. Individually, we will never be able to learn it all, but collectively we can. Together, we can tackle any problem—access what you need to know when you need to know it.

## Developer Convenience vs. User Needs

An undercurrent in this piece from PPK was around tooling. The whole "polyfill it and move on" movement has him a little annoyed. I feel the same way. I don’t think that a JavaScript-based solution should be considered an interoperable implementation (as is [currently under discussion at the W3C](https://www.w3.org/community/nextweb/2013/06/11/the-extensible-web-manifesto/)).
