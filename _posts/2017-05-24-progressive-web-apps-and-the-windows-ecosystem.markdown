---
layout: post
title: "Progressive Web Apps and the Windows Ecosystem"
date: 2017-05-24 11:13:24 -0400
comments: true
tags: ["progressive web apps","progressive enhancement",  presentations]
description: "I had the great pleasure of delivering this talk about Microsoft’s strategy towards Progressive Web Apps at the Build conference."
---

*I had the great pleasure of delivering a talk about Microsoft’s strategy towards Progressive Web Apps at [Build](https://build.microsoft.com). You can [view the slides](#slides) or [watch the recording](#video) of this talk, but what follows is a distillation of my talk, taken from my notes and slides.*

<!-- more -->

I’m here to talk to you about Progressive Web Apps, but before we really tuck into that, I wanna give a shout out to an app that’s really impressed me. This is Expense Manager by the folks at [Vaadin](https://vaadin.com):

<figure class="video-embed video-embed--16x9" id="figure-2017-05-24-01">  
<video class="video-embed__video" src="/i/posts/2017-05-24/01.mp4" controls loop muted></video>
</figure>

I do a lot of traveling and it’s helpful when I can easily track my expenses. Their app is simple but refined in this regard. It’s snappy and provides a great overall UX; it’s also cross platform, which is nice since I often jump between different OSes across mobile and desktop.

<figure class="video-embed video-embed--16x9" id="figure-2017-05-24-02">  
<video class="video-embed__video" src="/i/posts/2017-05-24/02.mp4" controls loop muted></video>
</figure>

The experience on the desktop version of their app is obviously a little better because I’ve got more real estate for viewing my expenses, but the same attention to detail has clearly been paid to the experience in both form factors, which is nice to see.

<figure class="video-embed video-embed--16x9" id="figure-2017-05-24-03">  
<video class="video-embed__video" src="/i/posts/2017-05-24/03.mp4" controls loop muted></video>
</figure>

Oh, and a little secret here… it’s a web app. In fact it’s a Progressive Web App. You should really [play around with it yourself](https://demo.vaadin.com/expense-manager) and kick the tires a bit to see how it’s made. 

## What is a Progressive Web App?

Now that we’ve seen one in action, I want to start by clarifying what a Progressive Web App is, just so I’m sure we’re all on the same page before we go down this rabbit hole. As a point of clarification, you’ll hear me use the terms Progressive Web App and PWA interchangeably.

So what is a Progressive Web App? Let’s ignore the first part of this term for a moment—*progressive*—I promise I’ll circle back to it shortly. Now the term "web app” may sound like something you can put your finger on, right? It’s software, on the Web, you use to complete a task. Like an expense manager, but it can be any website or property, really. 

And so it is with Progressive Web Apps too.

<figure id="fig-2017-05-24-04" class="media-container">
{% adaptive_image /i/posts/2017-05-24/04.png %}
</figure>

“Web apps” in this context can be any website type—a newspapers, games, books, shopping sites—it really doesn’t matter what the content or purpose of the website is, the “web app” moniker is applicable to all of them. <span data-quotable>The term could just have easily been progressive web *site* and it may be helpful to think of it as such</span>. It doesn’t need to be a single page app. You don’t need to be running everything client side. There are no particular requirements for the type of PWA you are developing.

Essentially, a PWA is a website that is capable of being promoted to being *native-ish*. It gets many of the benefits of being a native app (some of which I will cover shortly), but also has all of the benefits of being a website too. If you’ve looked at or developed a [Hosted Web App](https://developer.microsoft.com/en-us/windows/bridges/hosted-web-apps)(HWA), which Microsoft introduced with Windows 10, PWAs are very 
similar. In fact, if you’ve built an HWA, it shouldn’t be too difficult for you to convert it into a PWA and, in doing so, you’ll get a ton of extra goodies for free… but I’m getting ahead of myself.

[Here’s a quick comparison](#figure-2017-05-24-05) of the native Twitter app and [Twitter Lite](https://lite.twitter.com/), as seen on an Android device:

<figure class="video-embed video-embed--16x9" id="figure-2017-05-24-05">  
<video class="video-embed__video" src="/i/posts/2017-05-24/05.mp4" controls loop muted></video>
<figcaption>A video showing the native Twitter Android app and Twitter Lite, side-by-side to demonstrate how similar they are.</figcaption>
</figure>

You’ll notice that from a quality, polish, and user experience perspective, they are nearly indistinguishable. And this is just the first iteration of Twitter Lite. It launched last month. The only real difference is that one was built using Web technologies and lives at a URL.

Though [the "progressive web apps" moniker was coined by Frances Berriman in 2015](https://infrequently.org/2015/06/progressive-apps-escaping-tabs-without-losing-our-soul/) and has quickly become a buzzword in our industry, it’s important to recognize that <strong data-quotable>this idea of the Web as native is not new</strong>. 

Back in 2007, [Adobe introduced Apollo](https://web.archive.org/web/20070322155954/http://www.adobe.com/aboutadobe/pressroom/pressreleases/200703/031907ApolloLabs.html), later renamed the Adobe Integrated Runtime (<abbr aria-title="also known as">a.k.a.</abbr> [Adobe AIR](http://www.adobe.com/products/air.html)). This technology enabled designers and developers to build native apps in Flash or using Web technologies—HTML, CSS and JavaScript. It was pretty revolutionary for the time, supporting drag & drop, menu bar integration, file management, and more.

In 2009, Palm debuted [webOS](https://en.wikipedia.org/wiki/WebOS) [with the Palm Pre](http://www.palminfocenter.com/news/9668/palm-announces-the-palm-pre-smartphone/). All software for webOS was built using web technologies. Sadly, as an operating system in the handset space, it failed to catch on, but [LG has licensed webOS](https://www.lgwebos.com/) for use in smart TVs and is experimenting with it for <abbr aria-title="Internet of Things">IoT</abbr> devices and smartwatches.

Since that time, more OSes have begun embracing Web technologies as a means of building applications. Windows 8 allowed Windows Store apps to be written in HTML, CSS, and JavaScript. And [Firefox OS](https://en.wikipedia.org/wiki/Firefox_OS) and [Chromium/Chrome OS](https://www.chromium.org/chromium-os) are fundamentally tied to to the Web stack.

Countless tools have followed Adobe’s lead as well, enabling designers and developers to use their Web skills to build native applications for the vast majority of operating systems out there. [React Native](https://facebook.github.io/react-native/), [Ionic](http://ionicframework.com/), [Electron](https://electron.atom.io/), [PhoneGap](http://phonegap.com/), [Appcelerator](http://www.appcelerator.com/)… the list goes on and on. Obviously there’s something to the idea of building native software using Web technologies. Progressive Web Apps are a brilliant way of accomplishing this in a standardized, consistent, way.

## What makes a PWA a PWA?

Google’s [Alex Russell](https://infrequently.org/) defined 10 characteristics he believes define this new breed of Web application:

1. **Progressive:** It works for every user, regardless of browser choice because it's built with progressive enhancement as a core tenet.
2. **Responsive:** The UI adapts to fit any form factor.
3. **Network independent:** It works offline and on low-quality networks (which is something [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker) helps with).
4. **App-like:** It feels like an app in terms of responsiveness and UX.
5. **Fresh:** The experience is always up to date (another area where Service Worker shines).
6. **Safe:** It is served via HTTPS to prevent snooping and to ensure content hasn't been tampered with.
7. **Discoverable:** Search spiders can identify it as an app because it uses a [Web Application Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) (and a Service Worker).
8. **Re-engageable:** It can re-engage users through features like [push notifications](https://developer.mozilla.org/en-US/docs/Web/API/Push_API).
9. **Installable:** It can be installed by users if they find it useful. This could be done independently of—but is not necessarily exclusive of—app stores.
10. **Linkable:** It is easily accessed (and shared) via a URL. 

Let’s tuck into the installable piece first since this is the bit that really sets a PWA apart from a standard website. Now many might view this as a continuation of the competition between Web and native development. I don’t think of the two as being competitive, so much as being choices. We should choose our development approach based on the needs of our project, team, budget, etc. It’s good to have options and both approaches have their strengths. 

<blockquote>
<p><del>Web vs. Native</del><br>
<ins>Web *or* Native?<br>
It depends.</ins></p>
</blockquote>

Often Web tech gets dismissed for not having the capabilities of native apps. That’s changing rather rapidly. A visit to [whatwebcando.today](https://whatwebcando.today/) will give you a run-down of what your browser supports; you might be surprised with what you’ll learn about your browser’s capabilities. And if the end user experience is really good, does it matter what the underlying technology is?

Well, it might…

In the Web vs. native discussion, time to market is an aspect that isn’t often discussed. With a traditional web and native approach, each platform is typically built atop a core API. The apps are designed and developed independently, using different toolsets and languages and requiring different skills from the development team. And even in instances where they are all created using a single tool, the timeline needs to be padded in order to account for submission to each app store. That can cause delays in getting your product in front of users. It can also delay your delivery of critical updates.

<figure id="fig-2017-05-24-06" class="media-container">
{% adaptive_image /i/posts/2017-05-24/06.png %}
</figure>

Contrast that with building your software as a web-based product with the characteristics of a PWA. Using this approach, you can build it once and deploy it everywhere… *[even to platforms that don’t support PWAs](https://cloudfour.com/thinks/progressive-web-apps-simply-make-sense/)!* And if you opt to submit your app to the various app stores, you could likely get away with a a one-time submission because updates will be seamless from there on out—it is the Web after all.

<figure id="fig-2017-05-24-07" class="media-container">
{% adaptive_image /i/posts/2017-05-24/07.png %}
</figure>

Now that we’ve talked about install ability—the "app" bit, if you will—let’s circle back to that first principle of Progressive Web Apps: *progressive*. It must be important, after all it is literally the first word in this approach. “Progressive” in this context refers to *progressive enhancement*. In case you’re unfamiliar with the idea, I’ll provide a quick analogy; I’m a huge music and movie fan, so we’ll focus on sound for this analogy.

Back in the early days of recording, we only had a single speaker (or horn, back in the Victrola days) to relay the sound to our ears. Round about the 1930s, modern two-channel stereophonic sound was invented to solve a cinematic problem: in early “talkies” a single channel of sound was delivered through multiple speakers, which sometimes led to a weird situation where a performer would be on one side of the screen, but their voice would be coming from the other side (the speaker near you). Stereo sound allowed the actor’s voice to follow them in a much more natural way. Even with this advancement, though, stereo recordings could still be listened to on a single speaker by combining the channels.

Over time, stereophonic sound gave way to quadrophonic (or “surround”) sound and we kept adding more channels… and more channels, creating more and more immersive experiences. But even though a recording might sound best in 16.2 or 22.2[^1] channels of sound, movies, television, and music mastered for complete immersion can still be appreciated on a single, mono bluetooth speaker or on your mobile device (which is basically in mono when you’re viewing it in landscape mode). That is progressive enhancement.

[^1]: Crazy as it sounds, 22.2 is actually the standard used by Ultra-High Definition (UHD) television.

<figure class="video-embed video-embed--16x9" id="figure-2017-05-24-08">  
<video class="video-embed__video" src="/i/posts/2017-05-24/08.mp4" controls loop muted></video>
<figcaption>An animated explanation of progressive enhancement using sound channels.</figcaption>
</figure>

Progressive enhancement is concerned with honoring the core purpose of an experience—in software’s case the core purpose of a project and the core tasks a user will want to accomplish using it. The core experience should always be available, regardless of device or browser being used or the capabilities or limitations of that device… or of the user. It doesn’t mean you can’t create a better experience for folks who can benefit from that, but you never do that to the exclusion of your users. 

And yes, that means having an experience that works when JavaScript doesn’t. But that’s a whole other talk…

With progressive enhancement, we build the baseline experience and then enhance it as we are able to. In practical terms, progressive enhancement ensures people can use your product, regardless of

* Unsupported browser and/or device features Network issues that block or delay important assets, 
* Browser plug-ins that interfere with JavaScript execution,
* 3rd party code that interferes with JavaScript execution.
* Proxy browsers that optimize/adjust your code,
* Your users requiring alternate input methods or assistive tech,
* etc. 

<figure id="fig-2017-05-24-09" class="media-container">
{% adaptive_image /i/posts/2017-05-24/09.png %}
<figcaption>A chart plotting capabilities against experience, showing a steady improvement in experience as the number of capabilities increase.</figcaption>
</figure>

Let me walk you through a very basic example of progressive enhancement in practice as I think it will illustrate this point.

Here we have an email input field:

	<input type="email" name="email" id="email"
	       required aria-required="true">

The "email" field type was introduced in HTML5, so older browsers may not support it. Those that don’t will provide the default `input` type—a text field—to users. That’s totally fine—it’s all we had for more than a dozen years before HTML5 came along! But even if a user’s device does support email fields, it’s implementation may vary. Based on how a browser answers the following questions, users will end up with different experiences:

* Do you support for email input type?
* Do you support the HTML5 form validation algorithm including the email format?
* Do you offer a virtual keyboard?

Moving on to the `required` attribute—another HTML5 introduction—some browsers will use it for input validation, some won’t know what to do with it. Those that implement this feature may block form submission if the field is left empty, but some won’t do anything with that info *even if they know the field is empty*!

Finally, there’s the `aria-required` attribute. This is a part of the ARIA (Accessible Rich Internet Applications) spec and is used to inform assistive technology if the field is required. But it’s possible the browser may not support the attribute or that the assistive tech being used may not do anything with that information even if the browser does expose it.

In terms of experience of this field, it improves incrementally along a path like this:

1. Input…
2. with required notification to assistive tech…
3. with required enforcement…
4. with email type validation…
5. with speedier entry via virtual keyboard.

<figure id="fig-2017-05-24-10" class="media-container">
{% adaptive_image /i/posts/2017-05-24/10.png %}
</figure>

Now think about that for a second—this incredible variety of experience is created by one HTML element when you add three specific attributes to it. And the experienced is enhanced—*progressively*—as the browser’s and operating system’s capabilities increase. Amazing!

As I mentioned, <span data-quotable>progressive enhancement ensures people can use your product, no matter what</span>. You could just as easily swap in "PWA" for "progressive enhancement" in that statement. After all, PWAs give you network awareness and independence, they can be used to lower the overall cost of using your product for your for users through smart caching, they enable access to native APIs on certain platforms, and they provide more ways for your product to get discovered (e.g., search, store, links). Those are some impressive progressive enhancement bona fides.

Additionally, the two technical lynchpins of PWA—Web App Manifest and Service Worker—are ignored if they aren’t supported. Products you build using them [will continue to work really well, even in their absence](https://cloudfour.com/thinks/why-does-the-washington-posts-progressive-web-app-increase-engagement-on-ios/). They are, by definition, progressive enhancements too.

Now I’ve mentioned Service Worker a few times, so it probably makes sense to do a little sidebar here to explain what Service Workers are. A Service Worker is a proxy spawned by JavaScript that can handle a variety of tasks involving the network. They can

* Manage offline experiences,
* Intercept and respond to or modify network requests,
* Manage caching,
* Receive and handle push notifications, and
* Handle background sync requests.

*Note: At this point in the presentation, I passed the mic to my colleague [Jeff Burtoft](https://twitter.com/boyofgreen) to give a quick demo of Service Worker in practice.*

## What’s the timeline for Progressive Web Apps in Windows?

Now that we’ve covered the groundwork of PWAs, I want to discuss where they fit in the Windows ecosystem. As I mentioned earlier, Windows has a history of supporting Web tech, but it even predates Windows 8. Back in Windows 7 we began supporting [pinned sites](https://msdn.microsoft.com/en-us/library/gg491738(v=vs.85).aspx). They enabled developers to customize a sticky tab in the taskbar that provided quick access to key tasks, a customizable browser UI, and more. Then, in Windows 8, packaged apps could be completely written in HTML, CSS, and JavaScript. In Windows 10 we introduced Hosted Web Apps, which enabled your wholly web-based product to be distributed and installed via the Windows Store. And now we are in the process of taking our support of the Web to the next level with Progressive Web Apps. 

In terms of the work necessary to make this happen, the Edge team has already landed [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) support. Fetch is the powerful successor to [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) that is a critical underpinning of Service Worker. As I mentioned, Hosted Web Apps arrived with Windows 10 and they provide a secure, discrete container for Web apps within Windows that will also be used with PWAs. Additionally, [WinRT](https://docs.microsoft.com/en-us/scripting/jswinrt/using-the-windows-runtime-in-javascript) provides programmatic access to OS internals like the calendar, contacts, Cortana, and more via JavaScript.

Our engineering effort around Service Worker kicked off about a year ago and we’re making great progress in bringing PWAs to Edge and Windows. Support for PWAs will become available to  Windows Insiders early this summer. Initially, Service Worker, the [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache), and the [Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API) will be behind a [feature flag](http://www.windowscentral.com/understanding-aboutflags-microsoft-edge).

Once PWAs are fully supported, they will use the same container technology currently in use for Hosted Web Apps. As I mentioned,  it’s an established container with excellent performance and a ton of benefits:

* Standalone Window
* Independent from browser process
** Less overhead
** Isolated cache
** Nearly unlimited storage (indexed DB, localStorage, etc.)
* Offline & background processes
* Access to Windows Runtime (WinRT) APIs via JavaScript
** Calendar
** Cortana
** Address Book

On Windows, Progressive Web Apps are essentially Hosted Web Apps, evolved. In fact, you could build your PWA and ship it as an HWA today and when the remainder of the PWA stack lands, it will automatically transform into a full-fledged PWA (another benefit of the Web for distribution).

## How does a user discover a Progressive Web App?

Now that we’ve seen how PWAs operate within Windows, I want to take a few minutes to talk about how users will find your PWAs. As part of our initial move to support Progressive Web Apps, we will be enabling users to discover and install them from within the store and in Bing search results.

<figure id="fig-2017-05-24-11" class="media-container">
{% adaptive_image /i/posts/2017-05-24/11.png %}
<figcaption>Screenshots of Bing search results and the Windows Store, highlighting how an app might appear in both contexts.</figcaption>
</figure>

Now you may be wondering, with all of the awesomeness the Web has to offer, why does it make sense for PWAs to reside in app stores? There are numerous reasons:

1. It puts PWAs on equal footing with native apps.
2. Stores provide an alternate means of discovery for PWAs.
3. Users are generally more comfortable trusting software that has been reviewed for quality and safety.
4. Developers can get more insight into their users through reviews and ratings as well as analytics concerning installs, uninstalls, shares, and performance.
5. Having a store where users download software also reduces the cognitive overhead of tracking multiple sources for installing apps.

PWAs can get into the Windows Store in one of two ways. The first is through active submission. Using a tool like the open source utility [PWA Builder](http://www.pwabuilder.com/), you can generate the necessary native wrappers used by the various app stores and manually submit your PWA.

*Note: I invited Jeff back up on stage to walk through building a PWA and submitting it to the Windows Store using PWA Builder.*

Obviously we want Windows users to have access to as many quality PWAs as possible, but we recognize that not all development teams have the time to submit and maintain their apps in the Store. To address this, we’ve developed an approach to enable their apps to be easily discovered in the Store too. For lack of a better term, we’re currently calling this process "passive ingestion".

<figure id="fig-2017-05-24-12" class="media-container">
{% adaptive_image /i/posts/2017-05-24/12.png %}
</figure>

We are already using the Bing Crawler to identify PWAs on the Web for our PWA research. The Web App Manifest is a proactive signal from developers that a given website should be considered an app; we’re listening to that signal and evaluating those sites as candidates for the Store. Once we identify quality PWAs, we’ll automatically generate the APPX wrapper format used by the Windows Store and assemble a Store entry based on metadata about the app provided in the Web App Manifest.

We completely understand that some of you may not want your products automatically added to the Store and we respect that. 
By adding these 2 lines to your site’s [`robots.txt` file](http://www.robotstxt.org/robotstxt.html), the Bing Crawler will ignore your Web App Manifest, opting your site out of this process:

	User-agent: bingbot
	Disallow: /manifest.json

We are working on a set of criteria that will help us separate quality PWAs from sites that simply appear PWA-like. It’s still early days, but our consideration of what constitutes a "quality" PWA hinges on the following:

* **Does this site have a Web App Manifest?** In our initial crawl of sites looking for PWAs, we discovered over 1.5 million manifests across 800k domains. Looking at a selection of these sites, we discovered that not all are good candidates for ingestion. Some aren’t PWAs at all, others have a boilerplate manifest generated by tools like favicon generators.
* **Does the Web App Manifest suggest quality?** We will be looking for non-boilerplate manifests that include a name, description, and at least one icon that is larger than 192px square.
* **Is the site secure?** At this point, we are only looking for HTTPS, we aren’t evaluating [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) or other protections.
* **Does the site have a valid Service Worker?** [Mozilla has a bunch of recipes](https://serviceworke.rs/) if you are looking for somewhere to start.
* **Is the site popular?** We will prioritize sites that rank highly on [Alexa](http://www.alexa.com/topsites), [Quantcast](https://www.quantcast.com/top-sites), and other "top sites" lists.
* **Does the site pass automated testing for quality?** There are a number of tools out there for this, including our [Site Scanner](https://developer.microsoft.com/en-us/microsoft-edge/tools/staticscan/), [Lighthouse](https://developers.google.com/web/tools/lighthouse/), [aXe](https://www.deque.com/products/axe/), and more.
* **Is the app content free?** There are certainly ways to charge  for apps and content in the Windows Store, but we won’t passively ingest any sites that require a licensing fee or subscription. You’ll be able to submit those manually though.
* **Does the app pass manual review?** PWAs will need to meet the standards of the Windows Store, just like any other app. We will not ingest apps that violate laws or Store policies.

Once in the Store, we’ll notify developers of their draft Store entry and they will be able to claim their apps to take complete control of their Store presence. Regardless, whether they got their by passive ingestion or my manual submission, the Web App Manifest will provide the basic set of information used for the app in the Store: name, description, icons, and screenshots. We’re also actively working with others in the W3C to introduce support for [app categories](https://github.com/w3c/manifest/issues/569) and [IARC ratings](https://github.com/w3c/manifest/issues/523).

PWAs will appear alongside native apps in the Store, with no differentiation. From a users’ perspective, a PWA will just be another app. They will install just like any other app. They will have settings just like any other app. They will uninstall just like any other app. They will also be shareable via URL or the Store. PWAs will be first-class apps on Windows.

<hr>

Phew… that was a lot to take in. At this point, you might have some questions. Here are a few I imagine you’re wrestling with.

### Should I forget everything I know and start building a Progressive Web App?

*No.* Progressive Web Apps are just one more way you can build a high-quality app experience. 

### Will Microsoft drop support for my favorite programming language in favor of Progressive Web Apps?

*No.* We are committed to supporting a breadth of language options when it comes to developing apps.

### Are Progressive Web Apps the right choice for my project?

*Maybe.* When evaluating native app development in relation to Progressive Web Apps, here are some of the questions I recommend asking…

* Are there native features the Web can’t offer that are critical to the success of this product? 
* What is the total cost (time and money) of building and maintaining each platform-specific native app? 
* What are the strengths of my dev team? *or* How easy will it be to assemble a new team with the necessary skills to build each native app as opposed to a PWA?
* How critical will immediate app updates (e.g., adding new security features) be?

In other words, the choice between PWA and native should be evaluated on a case-by-case basis. For example…

* If you are looking to craft an experience that takes full advantage of each platform you release it on and you want to agonize over every UX detail in order to differentiate your product… native *might* be the best choice for you.
* If you are maintaining a product on multiple native platforms in addition to the Web and they are all largely the same in terms of look & feel and capabilities, it may make more sense to focus all of your efforts on the Web version and go PWA.
* If you are planning a brand new product and the Web provides all of the features you need (especially when you also consider the additional APIs provided via the host OS), building a PWA is probably going to be a faster, more cost-effective option. 

### Should I consider Progressive Web Apps as a solid option when developing software for Windows?

*Definitely.*

You probably have more questions. I’ll do my best to answer them in the comments.

## Slides

[Slides from this talk](https://www.slideshare.net/AaronGustafson/progressive-web-apps-and-the-windows-ecosystem-build-2017) are available on [Slideshare](https://www.slideshare.net).

<figure class="video-embed video-embed--16x9" id="figure-2017-05-24-13">  
<iframe class="video-embed__video" src="//www.slideshare.net/slideshow/embed_code/key/InI5w0bH4JxCwW" frameborder="0"></iframe>  
</figure>

## Video

[A video recording of this presentation](https://channel9.msdn.com/Events/Build/2017/B8075) (including Jeff’s demos) is available on [Channel 9](https://channel9.msdn.com).

<figure class="video-embed video-embed--16x9" id="figure-2017-05-24-14">  
<video class="video-embed__video" poster="//sec.ch9.ms/ch9/69d6/cde44404-854a-4c7a-aabd-e8d0af5d69d6/B8075_512.jpg" controls>
<source src="//video.ch9.ms/ch9/69d6/cde44404-854a-4c7a-aabd-e8d0af5d69d6/B8075_high.mp4">
<track src="//channel9.msdn.com/Events/Build/2017/B8075/captions?f=webvtt&amp;l=en" kind="captions" srclang="en" label="English">
<track src="//channel9.msdn.com/Events/Build/2017/B8075/captions?f=webvtt&amp;l=cs" kind="subtitles" srclang="en" label="Česky">
<track src="//channel9.msdn.com/Events/Build/2017/B8075/captions?f=webvtt&amp;l=de" kind="subtitles" srclang="en" label="Deutsch">
<track src="//channel9.msdn.com/Events/Build/2017/B8075/captions?f=webvtt&amp;l=es" kind="subtitles" srclang="en" label="Español">
<track src="//channel9.msdn.com/Events/Build/2017/B8075/captions?f=webvtt&amp;l=fr" kind="subtitles" srclang="en" label="Français">
<track src="//channel9.msdn.com/Events/Build/2017/B8075/captions?f=webvtt&amp;l=it" kind="subtitles" srclang="en" label="Italiano">
<track src="//channel9.msdn.com/Events/Build/2017/B8075/captions?f=webvtt&amp;l=ja" kind="subtitles" srclang="en" label="日本語">
<track src="//channel9.msdn.com/Events/Build/2017/B8075/captions?f=webvtt&amp;l=ko" kind="subtitles" srclang="en" label="한국어">
<track src="//channel9.msdn.com/Events/Build/2017/B8075/captions?f=webvtt&amp;l=pl" kind="subtitles" srclang="en" label="Polski">
<track src="//channel9.msdn.com/Events/Build/2017/B8075/captions?f=webvtt&amp;l=pt" kind="subtitles" srclang="en" label="Português">
<track src="//channel9.msdn.com/Events/Build/2017/B8075/captions?f=webvtt&amp;l=ru" kind="subtitles" srclang="en" label="Русский">
<track src="//channel9.msdn.com/Events/Build/2017/B8075/captions?f=webvtt&amp;l=tr" kind="subtitles" srclang="en" label="Türkçe">
<track src="//channel9.msdn.com/Events/Build/2017/B8075/captions?f=webvtt&amp;l=zh-cn" kind="subtitles" srclang="en" label="简体中文">
<track src="//channel9.msdn.com/Events/Build/2017/B8075/captions?f=webvtt&amp;l=zh-tw" kind="subtitles" srclang="en" label="繁體中文">
<p>Download it: <a href="//video.ch9.ms/ch9/69d6/cde44404-854a-4c7a-aabd-e8d0af5d69d6/B8075_high.mp4" download>High Quality MP4</a> or <a href="//video.ch9.ms/ch9/69d6/cde44404-854a-4c7a-aabd-e8d0af5d69d6/B8075.mp4" download>Low Quality MP4</a></p>
</video>
</figure>