---
layout: post
title: "Ramblings on New Browser Features, Interoperability, Craft, and the Future of the Web"
date: 2015-08-07 10:14:23 -0400
comments: true
categories: ["web design",browsers,craft,"the web"]
description: "A few thoughts and ramblings spurred by a post from PPK and reactions from Jake Archibald and Bruce Lawson."
---

Last week [Peter-Paul Koch (PPK)](http://www.quirksmode.org/about/) posted [a lengthy treatise on why browsers should stop "pushing the web forward"](http://www.quirksmode.org/blog/archives/2015/07/stop_pushing_th.html). I thoroughly enjoyed the read and agree with him on a number of points. I also agreed with the well-articulated responses from [Jake Archibald (of Google)](https://jakearchibald.com/2015/if-we-stand-still-we-go-backwards/) and [Bruce Lawson (of Opera)](https://dev.opera.com/blog/on-a-moratorium-on-new-browser-features/). I guess I’m saying I see both sides. Like [Chris Coyier](http://chriscoyier.net/), I live in [a world filled with varying shades of grey](https://css-tricks.com/the-gray-gray-ghost-that-i-call-home/) rather than stark black & white.

<!-- more -->

## New Features vs. Interoperability

One of the arguments PPK makes is against browsers competing on features. It really rang true to me: 

<blockquote>

I call for a moratorium on new browser features of about a year. Let’s postpone all completely new features that as of right now don’t yet work in any browser.

Browsers are encouraged to add features that are already supported by other browsers, and to write bug fixes. In fact, finding time for these unglorious but necessary jobs would be an important advantage of the moratorium. As an added bonus it would decrease the amount of tools web developers need.

</blockquote>

[Back in January](/notebook/competing-on-chrome/), I wrote about how I was excited by Microsoft’s announcement of "Project Spartan" (now "Microsoft Edge") and it’s focus on interoperability. Interoperability’s a long word, so I’m gonna go with "interop" from here on out.

I was not on the Microsoft payroll at the time, but I was still stoked to see their focus on interop in the new rendering engine. They’d even gone, in my humble opinion, above and beyond in this regard—aliasing Webkit’s experimental, legacy CSS syntaxes to their modern, standards-based implementations. This ensured poorly coded sites worked well in their browser and didn’t penalize users for a designer’s mistake. Talk about being a good web citizen!

Of course, Microsoft Edge wasn’t the first browser to do this. [IE 7 Mobile implemented `-webkit-text-size-adjust` back in 2010](http://snook.ca/archives/html_and_css/vendor-prefixes-competing). [Opera](https://dev.opera.com/articles/opera-mobile-emulator-webkit-prefix-support/) and [Mozilla](https://wiki.mozilla.org/Platform/Layout/CSS_Compatibility#questions_and_methodology) also [felt the pressure](https://lists.w3.org/Archives/Public/www-style/2012Feb/0313.html) and eventually implemented `-webkit-` vendors prefixes in versions of their browsers. It’s a weird world when one browser vendor is forced to implement another’s proprietary syntax just to make the web work, but it’s the sad state of things in our [full StackOverflow development](http://christianheilmann.com/2015/07/17/the-full-stackoverflow-developer/) world.

With the move away from vendor prefixes in CSS to ["feature flags"](http://www.howtogeek.com/139736/how-to-change-hidden-advanced-settings-in-any-browser/), you’d think this sort of thing would be behind us, but it’s not. [Karl Dubost](http://www.otsukare.info/), of Mozilla, recently [bemoaned the implications of Apple’s latest vendor prefix silliness](http://www.otsukare.info/2015/07/29/vendor-prefixes-market) on his blog. In that post, he made a keen observation:

> We have reached the point where browser vendors have to start implementing or aliasing these WebKit prefixes just to allow their users to browse the Web, see [Mozilla](https://wiki.mozilla.org/Compatibility/Mobile/Non_Standard_Compatibility) in Gecko and [Microsoft](https://twitter.com/jacobrossi/status/614544147941355520) in Edge. The same thing is happening over again. In the past, browser vendors had to implement the quirks of IE to be compatible with the Web. As much as I hate it, we will have to specify the current `-webkit-` prefixes to implement them uniformly.

I completely understand PPK’s desire for browsers to apply the brakes a bit and focus on interop. With new features being added to "the web"—but in reality only browser X, Y, or Z—on the regular, without guaranteed interop, it feels like we’re stirring up the browser wars again. All the new shiny is exciting, but I lived through the browser wars the first time and they sucked for everyone involved. <span data-quotable>Web standards helped us get everyone on the same page and brokered what we’d hoped was going to be a lasting peace.</span>

Now I’m not sure I agree with applying the brakes for a specific amount of time, but I do see great value in prioritizing interop over new features. And when browsers do implement new features, they should definitely put them behind feature flags (or some similar opt-in) to ensure we—the web development community—don’t start relying on some fancy new feature before it’s been vetted. Feature flags are awesome because they allow me, a designer, to experiment with a new technology *in my own browser* without affecting things for everyone else on the open web.

[We used to think vendor prefixes were enough of a deterrent](http://alistapart.com/article/prefix-or-posthack) to using a particular experimental CSS property or JavaScript method. Sadly that’s turned out to not be the case. I would bet good money on the sad reality that 80% of the working web designers out there don’t understand that `-*-` means "experimental" or even "proprietary". We—the web design authors, speakers, educators, and other influencers—did a shitty job landing that message with the industry as a whole. But even if we’d hounded people about it, it probably wouldn’t have mattered: Vendor-prefixed properties work. And now they work even in browsers they were never meant to.

So, here’s what I’d love to see browser vendors do:

1. Prioritize interop over new features. Don’t halt development on new features, just put them on the back burner so the rising tide can, as they say, lift *all* the ships. Web developers and end users all benefit when there’s feature parity and stability among browsers.
2. Put a ban on vendor-prefixes. They are not generally understood to be experimental. If you feel you must use a vendor prefix, ensure it’s only enabled by a corresponding feature flag.
2. Use feature flags (or some similar opt-in) to enable developers to test experimental features in their own browsers, but also to ensure they aren’t available on the "open web" before they’re ready.

## The Web vs. Native

PPK has harped on this a few times. There is currently a palpable tension between "native" and "the web". It’s driving most of the new features in the web "platform"[^1] and it’s giving many of us old-timers a touch of angina.

[^1]: I think I just threw up in my mouth a little. I hate using that word when speaking about the web, but there it is.

The reason is simple: The web was created as a massively interconnected document repository. A wealth of knowledge dependent on the hyperlink and the URL. The web was (and indeed still is) stateless by default, meaning it has no idea who you are or what you’ve done from request to request. This is very egalitarian: everyone has access and anyone can contribute.

As more businesses moved online, the web became necessarily transactional. Suddenly websites needed to know information about your "state" so they could sell you things and track your movements around their site and the rest of the web. With the advent of cookies and the Common Gateway Interface (CGI), a web server could adjust the content it sent in response to a request, based on what it knew about you and what you were doing. 

Taking this simple capacity a step further, it became possible to write actual software on the web. Content management systems were probably the first big chunk of software to move online, but more soon followed. JavaScript came along and allowed us to add a bit of logic to the client side, reducing our reliance on round-trips to the server. Then we got Ajax and the whole JavaScript world exploded. We now have web-based photo editors, integrated development environments (IDEs), games, and more, all reliant on JavaScript’s ability to interact with the browser and manipulate what the user sees in real-time.

There were earlier machinations certainly, but the last ten years have seen the biggest push to bring more traditional software-like interactions to the web. Dozens of organizations, big and small, are trying to make their mark creating *the* framework for building these "next-generation" web-based app experiences. Honestly, I don’t have a problem with that. I don’t really have an interest in client-side frameworks, but I don’t have a problem with them either… provided developers who wish to bring their programming talents to the web take a little time to learn about the medium.

<span data-quotable>If you don’t take the time to understand how the web works, you’ll spend half your time cursing it and the other half trying to work around the things that frustrate you (which you will probably write off as "poorly designed" or "ill-conceived").</span> If you don’t understand how the web works, you’ll build fragile experiences that collapse like a house of cards when any one of your many dependencies—the network, JavaScript, some particular element or browser API—isn’t available. If you don’t understand how the web works, what you build will simply be [on the web, not of it](https://adactio.com/journal/8245).

I don’t particularly care much about bringing "native like" "60fps" experiences to the web. It’s not that I don’t write software (I do), I just don’t really care if something I make for the web feels like a piece of installed software. I’ll do everything in my power to ensure my users have a great experience, but I know that each person’s experience will be a little bit different and I no longer feel the need to enforce my will on their experience. I’d rather create many ways for someone to interact with the things I build and hope one or more of those work well for whoever happens by and whatever device they happen to be using.

Native software and the web have always co-existed. We had installed software on computers long before the web even existed and we will continue to have installed software for as long as there are computers. Some software will move to the web if it makes sense for it to do so. Other software will remain native. Either option could be right or wrong depending on what you are trying to do. For instance, I would never personally write a photo editor in the browser because image processing requires a lot of memory and CPU cycles. Putting it in a browser moves it one more level away from the hardware. Abstraction eases development, but it invariably increases overhead and reduces performance.

Traditional software and the web can and should co-exist. They also can and should continue to inform one another. Ultimately, that will help us better serve the needs of our users, however they use our creations.

## Change vs. Stagnation

Underpinning this whole "native vs. web" thing is, I think, a feeling many of us old-timers have that our web—the web we grew up building—is slipping away from us. We cling to the idea of the web as an open platform[^2] for people to share their thoughts, passions, and cat photos. We like the web as it was originally. We like the web as we made it.

[^2]: In the other sense of the word.

The web is changing. In some ways it’s changing for the better, in some ways for the worse. It’s a far different beast today than [when Tim Berners-Lee typed that first `<HEADER>`](info.cern.ch/hypertext/WWW/TheProject.html) and you can certainly do a lot more in the browser now than you could when I first picked up HTML. But I don’t think halting progress on the web is desirable.

As Jake points out in his response, stagnation is not a good policy. Stagnation pretty much killed BlackBerry. It also led to a lot of developer frustration in the guise of IE 6.

Change is not inherently bad. It’s pace can be quite frustrating at times, though. PPK certainly seems to be feeling that way about its speed now just as [Alex Russell lamented its plodding progress back in 2007](https://infrequently.org/2007/09/slides-from-my-standards-heresy-talk/). But when you take a step back, especially with a historical perspective, you see the changes are cyclical in many ways. The bandwidth issues we dealt with during the dial-up era are with us again in the form of mobile networks. The lessons we learned building a web for 640x480 screens are equally applicable in a world of wearables. And the text-based interactions we created in the very early days will serve as a template as we move boldly forward into the realm of voice-driven user experiences.

## Cutting Edge vs. Craft

In his post, PPK also complained that we’re simply getting too many new features on the web, which makes it hard to keep up. More than that, however, it makes it hard to truly come to a deeper understanding of how these different pieces work. To really hone our craft. In other words, it’s becoming harder to be an expert generalist.

Jake and Bruce completely get this, as do I. [Lyza Danger Gardener has even given an amazing talk on the topic](http://lanyrd.com/2015/web-design-day/sdpbgz/). The sheer volume of new drafts, specs, and concepts (not to mention tooling options) is overwhelming. I’m sure I don’t know half of the features that are in the HTML5 spec, let alone the umpteen CSS3 modules. I probably never will. And I’m ok with that. I’ll pick and choose the bits I’m interested in playing around with and find ways to integrate them into my practice a little at a time. That’s how we learn. That’s how we’ve always learned.

To assuage PPK’s fears, however, I would argue that there are a lot more of us working on the web now than there were in the more leisurely paced days he remembers so fondly. And we’re sharing what we learn. Whether driven by altruistic desire to spread knowledge or an interest in rockstar-like fame in the industry (or even a smidge of both), it doesn’t really matter how it happens—the fact is that it does. We learn and we share. And the tools we have today make it even easier to do so. Not only do we have the usual magazine and blogging outlets, but we also have CodePen and JS Bin and Github and more.

We each have the capacity to research the hell out of one specific area of web design and be the conduit for that knowledge into the web design hive mind. Look at [Sara Soueidan with SVG](https://www.google.com/search?q=sara+soueidan+svg) or [Rachel Nabors with CSS Animation](https://www.google.com/search?q=rachel+nabors+css+animation) or [Zoe Mickley Gillenwater with flexbox](https://www.google.com/search?q=Zoe+Mickley+Gillenwater+flexbox). <span data-quotable>Individually, we will never be able to learn it all, but collectively we can.</span> Together, we can tackle any problem by accessing what we need to know when we need to know it.

## Developer Convenience vs. User Needs

Another angle in this very dense piece from PPK was around tooling and polyfills:

> We get ever more features that become ever more complex and need ever more polyfills and other tools to function—[tools that are part of the problem](http://www.quirksmode.org/blog/archives/2015/05/tools_dont_solv.html), and not of the solution.

The whole "polyfill it and move on" movement has him a little annoyed. I share his sentiment. I don’t think a JavaScript-based solution should be considered "good enough" for interop. [JavaScript is not guaranteed.](http://kryogenix.org/code/browser/everyonehasjs.html) Moreover, JavaScript implementations are also never going to be as fast as a browser implementation. If browsers want to pick up a polyfill and implement it behind the scenes, that’s fine because it will run faster, but loading up our websites with potentially megabytes worth of polyfills in order to use new “standards” seems ludicrous.

As an industry, we are doing an awful lot of navel gazing. <span data-quotable>We are spending more time solving our own development problems (legitimate in some cases, fabricated in others) by throwing more and more code at the problem.</span> As a consequence, our users are paying the price in [slower sites](http://www.theverge.com/2015/7/20/9002721/the-mobile-web-sucks), [heavier web pages](http://www.soasta.com/blog/page-bloat-average-web-page-2-mb/), [poor performance](http://www.yottaa.com/bid/277715/Why-Your-Website-Is-Slow-Poor-JavaScript-Performance), and [bad experiences](http://farukat.es/journal/2015/02/708-how-flipboard-chose-form-over-function-their-web-version) (or [no experience](http://sighjavascript.tumblr.com/)). And, on top of that, we’re solving *our* problems not *their* problems.

## All is not lost

We are designers. Design is about solving problems for our users, not creating new ones for them. Whether we are writing code, sketching interfaces, authoring copy, curating content, or building servers, we should make each and every decision based on what will benefit our users. If it means we can’t use some shiny new technology, so be it. We can still play with the new stuff in our own browser, on our personal sites, and on CodePen. We can learn about them in our own experimentation and share that knowledge with the rest of our industry. We can improve our craft. The web can get better.