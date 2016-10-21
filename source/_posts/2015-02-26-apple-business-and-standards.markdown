---
layout: post
title: "Apple, Business, and Standards"
date: 2015-02-26 10:44:40 -0500
comments: true
categories: ["web design","web standards",interoperability,business]
description: "With Pointer Events now officially a W3C Recommendation, Apple is playing the role of the Web standards and interoperability party pooper."
---

At [Tuesday night’s Code & Creativity](http://www.codeandcreativity.com/events/2015-02-24), digital governance expert [Lisa Welchman](https://twitter.com/lwelchman) equated digital projects to an atom. Content, IA, project management, networking, graphic design, application development, performance, and other concerns are flying this way and that like electrons—a swirling mass of energy and velocity. What holds this chaos together and keeps the electrons from flying off in all directions is the magnetic pull of protons in the nucleus of the atom.

<!-- more -->

<figure id="fig-2015-02-26-01" class="media-container">
{% adaptive_image /i/posts/2015-02-26/atom-lg.jpg alt="A slide from Lisa Welchman’s talk showing Web Standards and KPI at the center of the project “atom”." %}
</figure>

In Lisa’s analogy, the protons of a digital project are Web standards and Key Performance Indicators (KPIs). She believes that without these key ingredients, projects will often career out of control. Her reasoning? We all need to know how we should be doing things in order to work together well (Web standards) and we need to know what our expectations are for the project to be successful (KPI).

This really resonated with me. Mainly, it resonated because I am a Web standards guy, but I also believe in the importance of standards across the board. I think projects need copywriting standards, design standards, performance standards, coding standards, and many other kinds of standards as well. Standards hold a project together. For real.

That’s why *Web* standards are so important.

Without standards, the Web was [an unruly mass of spaghetti code](http://en.wikipedia.org/wiki/Browser_wars).  I started working on the Web in 1996. I know, I lived it.

We used to deliver separate browser-specific JavaScript and CSS files to different User Agents. Our HTML code had to be 3-4 times as hefty to support all of the various ways browsers had decided to implement the same features. It was horrible and made building anything remotely interesting a truly painful endeavor.

Then browser makers got together to codify HTML into a generally agreed-upon set of elements and attributes that would allow authors like me to write pages that would Just Work™. That work extended into CSS, and so on, and so forth. I can’t thank them enough for doing that.

Tuesday also saw the W3C officially make [Pointer Events](http://www.w3.org/TR/pointerevents/) a recommendation. I’d always liked the idea of Pointer Events because it abstracts the traditional concept of a click into a generic interaction that could be triggered by a mouse, a finger, a pen, an eye movement, or any other interaction method we come up with in the future. Sure, I work for Microsoft now—they proposed this idea—but that isn’t the reason I like the concept. I like it because it doesn’t tie us down to a single way of interacting with Web content that necessitates the creation of new specs when new interaction methods are invented. It’s future friendly and embraces the "continuum of experience" I evangelize incessantly.

When Pointer Events were first proposed, there was a lot of support behind them. Obviously Microsoft was on board, but Mozilla was too. And Google was all about Pointer Events for a while and was already using them when [they did an abrupt  about-face and decided they were ripping them out of Blink in favor of overhauling Touch Events](https://code.google.com/p/chromium/issues/detail?id=162757#c64) (which Apple supports and which Pointer Events were intended to supersede).

And so now we have a recommendation from the W3C that browsers implement Pointer Events. [Developers want them](http://blog.jquery.com/2015/02/24/getting-on-point/) and it seems Apple doesn’t. And because Apple doesn’t want them, Google doesn’t want them now either. To quote Rick Byers (of Google) in [a Pointer Events meeting in late 2014](https://lists.w3.org/Archives/Public/public-pointer-events/2014JulSep/0071):

> No argument that PE is more elegant. If we had a path to universal input that all supported, we would be great with that, but not all browsers will support PE. If we had Apple on board with PE, we'd still be on board too. The equation has shifted for us.

So, effectively, Apple is holding the Web back. [Tim Kadlec](https://twitter.com/tkadlec) wrote [a great piece discussing the core issue at play here](http://timkadlec.com/2015/02/apples-web/):

> Let’s set any opinions about Pointer Events aside. Frankly, I need to do a *lot* more digging here before I have any sort of strong opinion in one direction or another. There is a bigger issue here. We have a recurring situation where all vendors (save for Apple) show interest in standard, but because Apple does not express that same interest, the standard gets waylaid.

<figure id="fig-2015-02-25-02" class="media-container media-container--right">
	<img src="http://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Yin_yang.svg/200px-Yin_yang.svg.png"
		 srcset="http://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Yin_yang.svg/800px-Yin_yang.svg.png 800w, http://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Yin_yang.svg/400px-Yin_yang.svg.png 400w, http://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Yin_yang.svg/200px-Yin_yang.svg.png 200w"
		 alt="Yin and yang."
		 >
</figure>

This whole thing has caused quite a kerfuffle in the Web community. Obviously, some people are demonizing Apple (and, by proxy, Google) for holding us back. Others are quick to excuse Apple because of their history of pushing the Web forward (see CSS transitions, animations, etc.).[^1] Personally, I don’t think anything is ever truly black and white. Every company does some good things and some bad things. To channel Lisa Welshman again, it’s like yin and yang: The light has a little bit of the dark in it, and the dark has a little bit of the light in it.

Generally, I’ve found that Apple tends to do what is best for Apple, without considering how it affects designers, developers, or the Open Web. On this issue however, I just haven’t figured out their angle yet.

Some of their past decisions have offered a clear view into their motivations. Take offline for instance. Apple supports the [Application Cache API](http://www.w3.org/TR/html5/browsers.html#offline) (as [most modern browsers do](http://caniuse.com/#feat=offline-apps)), but there’s a catch: You can’t store audio files in the cache. That makes it nearly impossible to build a decent game in HTML because you won’t get sound effects if you aren’t connected to the Web. But for Apple it makes perfect sense: They sell games in the App Store.

Their motivations behind other decisions are more murky, however. For example, Safari implements the [HTML5 Form Validation API](https://html.spec.whatwg.org/multipage/forms.html#client-side-form-validation), which means it knows if a field is valid or invalid. The catch? It won’t halt the submission of an invalid form. [Every other modern browser acts as you’d expect.](http://caniuse.com/#search=form%20validation)[^2] I don’t get it. I used to think/hope they just had not figured out how they wanted to handle notifying the user of the error, but it’s been like this for about 5 years.

I’ll let Tim jump in again here:

> Apple has a very, very strong influence over what standards get adopted and what standards do not. Partly it’s market share, partly it’s developer bias (see, for example, how other vendors eventually felt forced to start supporting the `webkit` prefix due to vendor prefix abuse).

> Apple simply does not play well with other vendors when it comes to standardization. The same sort of things we once criticized Microsoft for doing long ago, we give Apple a pass on today. They’re very content to play in their own little sandbox all too often.

He’s channeling [a bit of Remy Sharp there](https://adactio.com/journal/5442/#comment438) (circa 2012):

> When are we, as a web development community, going to stop giving Apple a free fucking pass?

> They’re consistently lacking in the open discussion in to improving the gateway to the web: the browser. Sure, they landed an impressive mobile browsing experience back when the iPhone launched and it’s a great device, but there’s some serious questioning about whether they’re purposely cock-blocking web development and purposely hindering our advancement as a web industry.

> WebGL is in mobile Safari, yet only available if accessed via a WebView object, not the real Safari (which is a WebView anyway…). It was recently discovered that they moved all web data storage (Web Storage, Appcache, etc) in a temporary data store meaning that it can be wiped at any time without warning.

> Even the mighty PPK who tells entire browser vendors “fuck you”, doesn’t call Apple out, allowing them to slither on.

> Why is it we continue to allow Apple to get away with it? And can this ever change?

As Tim points out, Apple certainly isn’t the only company that plays games when it comes to standards:

> The other vendors aren’t exactly perfect either. The Microsoft folks, no doubt reeling from all the negativity aimed at them over the years, have more than once been content to let everyone else duke it out over a standard, only getting involved late when a consensus has been reached. The Blink folks, despite being the best positioned to take a stand, have been happy to play the “Apple won’t do it so I guess we won’t either” card on multiple occasions.

But he’s also quick to highlight the disappointing reality about Apple with respect to the other browser vendors:

> It’s easy to reach the Mozilla, Google and Microsoft folks to discuss their thoughts on these emerging standards. That’s a much harder thing to do with the Apple crew.

Apple is very much a black box and their processes are incredibly opaque. Now I’m no hater, I use their products daily.[^3], but I am also not an apologist. I think relationships are improved with honesty and openness. I honestly wish Apple’s processes—at least when it comes to the Web—were more open.[^4] Heck, they often don’t even show up to meetings at the W3C. If we knew what they were thinking or why they were doing things, we could at least understand where they were coming from rather than having to speculate about their motivations. Whether we agree or not is irrelevant.

Regardless, we are where we are and I can’t help but wonder one thing: *If we stop giving Apple a free pass and continue marching forward without them, will they eventually be forced to scramble to catch up like Microsoft did when IE6 sat on the shelf for so long?* I don’t know what the answer is, but I sincerely hope they come around and begin to treat the Web with the respect it deserves before that happens.

When browsers refuse to implement Web standards, we all lose. And we take one step closer to the swirling pit of chaos and spaghetti code we thought we’d put behind us.

[^1]: All of which were (in true Apple style) developed in secret and then bestowed upon the world in a grand spectacle.

[^2]: Ok, Opera Mini doesn’t, but Opera Mini is also a different sort of browser. It is a proxy browser and the proxy handles all of the back and forth between the browser and the website’s origin server(s).

[^3]: I am composing this post on a Mac… provided by Microsoft. Yes, you read that correctly.

[^4]: I have felt the same way about Microsoft for years because I knew the great work they were doing behind the curtains. Part of the reason [I joined them earlier this month](/notebook/ch-ch-ch-changes/) was because they have been opening up and I want to encourage and nurture that.