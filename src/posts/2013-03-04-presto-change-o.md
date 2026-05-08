---
title: "Presto Change-o"
date: 2013-03-04 15:11:00
comments: false
tags:
  - "browsers"
  - "web standards"
description: "As you’ve probably heard, Opera has announced that they are abandoning their Presto rendering engine in favor of Webkit . CTO Håkon Wium Lie (you know, one of the guys who invented CSS ) has stated that this will allow Opera’s resources..."
canonical: "https://blog.easy-designs.net/archives/presto-change-o/"
---

<p>
	As you’ve probably heard, <a href="http://www.opera.com/press/releases/2013/02/13/">Opera has announced that they are abandoning their Presto rendering engine in favor of Webkit</a>. CTO Håkon Wium Lie (you know, one of the guys who invented CSS) has stated that this will allow Opera’s resources to assist with the continued development and improvement of Webkit:</p>
<blockquote cite="http://www.opera.com/press/releases/2013/02/13/">
<p>
<span class="initial quote">“</span>It makes more sense to have our experts working with the open source communities to further improve WebKit and Chromium, rather than developing our own rendering engine further. Opera will contribute to the WebKit and Chromium projects, and we have already submitted our first set of patches: to improve multi-column layout.<span class="final quote">”</span></p>

<!-- more -->

</blockquote>
<p>
	I am hopeful that Opera’s eagerness to help improve Webkit does not peter out over time. After all, it’s tempting to just take the Webkit core and just drop it into your own browser’s chrome, allowing your team to focus on the browser itself rather than the rendering engine. That is, after all, the dream from many authors’ and implementors’ standpoints: browsers compete on features, not standards support.</p>
<p>
	So, on the surface, this sounds great: Opera adopts Webkit. Chrome and Safari are already Webkit. Blackberry, Palm, Android, iOS, Symbian, <a href="https://en.wikipedia.org/wiki/List_of_web_browsers#WebKit-based">and many more</a> all use Webkit. That means fewer headaches for me, right? Well, not really. As <a href="http://www.quirksmode.org/webkit.html">PPK informed us years ago there is no one Webkit (on mobile or desktop)</a>.</p>
<h2>
	Webkit is what you what you want it to be</h2>
<p>
	You see, as an open source project, Webkit is constantly evolving. That’s a good thing as it means newly-proposed features roll quickly into it. As open source software, however, it is also modifiable. That means not only will you have differences between nightly builds of Webkit as new features are added and bugs are fixed, but <a href="https://trac.webkit.org/wiki/FeatureFlags">each browser built on it can choose to jettison certain features or add ones of their own</a>.</p>
<p>
	Apple, creators of the Webkit engine (who based their own work on the KHTML rendering engine) for example, have implemented the HTML5 form validation API for JavaScript, but have yet to expose it in the UI. Chrome, on the other hand, implements both. Similarly, Apple also disabled the “file” input type on iOS versions prior to 6. From an implementor standpoint, it’s nice because they can pick and choose their build to be tailored to highlight the strengths (or mask the weaknesses) of their browser or OS, but there is a dark side too: A company can choose to opt-out of specific standards in order to undermine the web as a platform.</p>
<p>
	One of the most egregious (in my opinion at least) examples of this is how Apple has treated multimedia on iOS. First, they made it impossible to cache audio & video files for offline use. You could make an argument that this keeps sites from bogging down a device with lots of files, but if you put a user in control of what’s cached & how much room it can take, that’s completely avoidable. But, when you consider that you can’t control the playback of media files solely via JavaScript (without requiring user interaction such as a tap), it becomes clear that Apple doesn’t really want competition from web-based apps. Want to make a web-based game that works offline on iOS and includes sound? Sorry!</p>
<p>
	Now Apple isn’t the only company to have tweaked their Webkit instances. HTC is pretty infamous for monkeying around with both Android in general and Webkit specifically too, and they are by no means alone in that. Along the way many of implementors have augmented Webkit for one reason or another and a few introduced serious bugs in the process. Here’s are just a few implementation issues I’ve come across, but there are hundreds more:</p>
<ul>
<li>
		in early versions of webOS, use of optimizeLegibility caused text to disappear entirely;</li>
<li>
		in Chrome, when using a font with ligatures, words containing the letter “q” disappeared entirely (it wasn’t a font issue either, the font was from Google’s service and worked fine in other Wekbit browsers including Chromium for Linux); and</li>
<li>
		the native Android browser has an incredibly difficult time dealing with overlays, light boxes, and the like when any sort of interactive element (e.g. a link or form control) sits under that layer, often leading to inadvertent taps.</li>
</ul>
<p>
	But the implementors are not the only ones introducing bugs.</p>
<h2>
	Webkit itself suffers from numerous long-standing, serious bugs</h2>
<p>
	Overall, Webkit is a pretty awesome rendering engine. It’s fast, lightweight, and does a damn good job laying out pages. But it’s not a panacea. It has it’s issues.</p>
<p>
	A brief sojourn through the <a href="https://bugs.webkit.org/">Webkit bug tracker</a> (and <a href="http://code.google.com/p/chromium/issues/">Chromium’s</a> if you’re up for it) reveals a litany of well-documented, long-standing, serious usability, accessibility, and standards-implementation bugs that have not been touched. Here are a couple I’ve been tracking:</p>
<ul>
<li>
<strong><a href="https://bugs.webkit.org/show_bug.cgi?id=5566">Webkit Issue 5566 (October 2005)</a>:</strong> Alt text is not always displayed when the image is missing. That’s a big deal.</li>
<li>
<strong><a href="https://bugs.webkit.org/show_bug.cgi?id=15816">Webkit Issue 15816</a> (November 2007):</strong> You cannot select multiple non adjacent items in a multiple select control with the keyboard only.</li>
<li>
<strong><a href="http://code.google.com/p/chromium/issues/detail?id=37721">Chromium Issue 37721</a> (March 2010):</strong> When you trigger an anchor link (e.g. a “skip to”), focus never leaves the link and travels to the target, which is <a href="http://www.w3.org/WAI/WCAG20/quickref/#qr-navigation-mechanisms-skip">a big no-no according to the WCAG</a> (Web Content Accessibility Guidelines).</li>
</ul>
<p>
	Now, as the number of companies using (and forking) the Webkit core has increased, the capacity to address these bugs has increased as well. Still, it seems bug fixes are always lagging behind new feature implementations. And then there’s always the folks who want to use a piece of open source software as-is, with little concern for making it better. Hopefully the addition of the incredibly smart developers from Opera to the mix (many of whom are accessibility experts) will bode well for issues like these to be remedied.</p>
<h2>
	What does this mean for standards?</h2>
<p>
	Webkit is pretty solid in its standards support. It has also been the testing ground for countless HTML5 and CSS3 proposals, many of which have gained traction. With Opera ditching Presto for Webkit, however, I’m a little concerned this may not bode well for the ratification of future standards.</p>
<p>
	You see, the web standards process requires that Proposed Recommendation at the W3C <a href="http://www.w3.org/2005/10/Process-20051014/tr#cfr">should have at least 2 interoperable implementations before it can become a Recommendation</a>. With the Opera moving to Webkit, we are left with one less potential implementor as I don’t think you can consider the same Webkit implementation in Safari, Chrome, and Opera to be anything more than the one aggregate implementation. If you considered it as 3 independent implementations, it would essentially grant Webkit license to deem pretty much anything they come up with a standard, making a mockery of the whole process. And so we are more reliant than ever on the Internet Explorer, Mozilla, and Webkit teams being on the same page (and timeline) when it comes to implementations or the whole process will stall.</p>
<p>
	From what I gather—granted, it’s been a while since I sat through a W3C Working Group meeting, so my impression could be misguided—things at the W3C seem to be moving along much more smoothly than they have in the past, so perhaps my concern for the standards development process is unwarranted. I hope so, but only time will tell.</p>
<h2>
	Further reading:</h2>
<ul>
<li>
<a href="http://techcrunch.com/2013/02/17/the-pros-and-cons-of-a-webkit-monoculture/">The Pros and Cons of a Webkit Monoculture</a></li>
<li>
<a href="http://www.informationweek.com/software/infrastructure/operas-webkit-move-isolates-mozilla/240148741">Opera's WebKit Move Isolates Mozilla</a></li>
<li>
<a href="http://www.webmonkey.com/2013/02/think-one-less-browser-means-less-work-think-again/">Think One Fewer Browser Means Less Work? Think Again</a></li>
<li>
<a href="http://techcrunch.com/2013/02/09/apple-and-google-still-lead-webkit-development-but-more-smaller-companies-contributing/">Apple And Google Still Lead WebKit Development But More Smaller Companies Contributing</a></li>
<li>
<a href="http://ejohn.org/blog/webkit-is-the-jquery-of-browser-engines/">WebKit is the jQuery of Browser Engines</a></li>
<li>
<a href="http://robertnyman.com/2013/02/13/the-webkit-culture-web-rendering-engine-diversity/">The WebKit Culture Web Rendering Engine Diversity</a></li>
<li>
<a href="http://robertnyman.com/2013/02/14/webkit-an-objective-view/">WebKit: An Objective View</a></li>
</ul>
