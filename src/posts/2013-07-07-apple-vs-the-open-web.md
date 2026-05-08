---
title: "Apple vs. the Open Web"
date: 2013-07-07 22:39:00
comments: true
tags:
  - "mobile"
  - "user experience"
description: "I’ll admit it: I never really got Siri."
canonical: "https://blog.easy-designs.net/archives/apple-vs-the-open-web/"
---

<p>
	I’ll admit it: I never really got Siri.</p>

<!-- more -->

<p>
	To me, she’s always been a bit gimmicky. When she debuted on the iPhone 4S, I thought the voice recognition stuff was neat, but I didn’t see her as being anything close to the “digital assistant” Apple promised us. The idea was good, but the implementation was about as inspiring as my then 5-year-old Garmin. Oh, but she couldn’t give you turn by turn directions.</p>
<p>
	Sure, Siri’s gotten better, but not much.</p>
<p>
	Now, after reading <a href="https://twitter.com/dankaplan">Dan Kaplan</a>’s excellent TechCrunch post <a href="http://techcrunch.com/2013/06/30/will-apple-sideline-siri-before-she-kills-google/">lamenting the Siri that could have been</a>, I realize how much better she could—nay <em>should</em>—be. You see, prior to being bought by Apple, Siri Assistant was pretty damn useful. She was a true digital assistant, capable of setting up a whole evening of fun for you by purchasing movie tickets, getting you dinner reservations, and even hailing you a cab. Pre buy-out, her creators even had plans to supercharge Siri by giving her predictive awareness (think <a href="http://en.wikipedia.org/wiki/Google_Now">Google Now</a>). Dan offered a few examples of how this might work:</p>
<blockquote>
<ul>
<li>
<span class="initial quote">“</span>Hey Dan, your flight to <span class="caps">NYC</span> has just been canceled! Would you like me to book the next one?<span class="final quote">”</span></li>
<li>
<span class="initial quote">“</span>Hey Dan, you weren’t at home when your package got delivered. Would you like me to redirect it to your office?<span class="final quote">”</span></li>
<li>
<span class="initial quote">“</span>Hey Dan, you’ve got a coffee meeting downtown in 25 minutes. How about I summon a Lyft?<span class="final quote">”</span></li>
</ul>
</blockquote>
<p>
	Given Siri’s previous capabilities and the plans her creators had, how did she become so lame?</p>
<p>
	Personally, I think the reason is simple: Apple doesn’t get the web. Sure there are a lot of incredibly smart and talented people who work at Apple who clearly do understand what the web is and how it works, but I think as a company Apple doesn’t. Or worse it does, but they can’t control it or monetize it, so they’re not interested.</p>
<p>
	It’s a feeling I’ve had for quite some time, but reading this piece (especially in light of Jeremy Keith’s fantastic post about <a href="http://adactio.com/journal/6291/">the movement of many web companies toward creating more walled gardens</a>) really convinced me. I mean take a look at Maps.</p>
<p>
	Prior to iOS 6, Google Maps was the de-facto mapping and directions app. It offered your standard driving and walking directions, but it also offered public transit directions based on public data (much of which Google has coalesced into <a href="http://www.google.com/intl/en/landing/transit/">Google Maps Transit</a>). Now, with Apple’s homegrown Maps, if you want to get transit directions, you need to download a separate app from the App Store. Travel a lot? Try 8 differnet apps. Or 10.</p>
<p>
	Instead of using existing APIs to make transit directions native to Maps, they opted to fragment the experience.*</p>
<figure>
<img alt="" src="/i/posts/2013-07-07/ios-maps-transit.png"/><figcaption>A quick direction search using Maps and the resulting screen when I route via public transit.</figcaption></figure>
<p>
	Sure, you might argue that the Maps team may have had to cut the transit feature due to time or budget constraints, but they found the time to make the maps three-dimensional. Just sayin’.</p>
<p>
	Clearly Apple could have used any of the <a href="http://www.commuterapi.com/">publicly available transit APIs</a> to accomplish this task, but they didn’t. The same goes for Siri. There are a ton of freely-available resources out there to collect information and then do something useful with it—to truly allow Siri to become the digital assistant of our dreams—but Apple doesn’t seem to have any interest. And I think their software is suffering for it.</p>
<p>
	* I’m all for de-coupling functionality in order to scale application logic, but de-coupling (a.k.a. fragmenting) the user experience is downright baffling. Especially for a company that prides themselves on both design and user experience.</p>
