---
title: "The True Cost of Progressive Enhancement"
date: 2013-08-01 12:35:00
comments: true
tags:
  - "progressive enhancement"
  - "business"
description: "When you’ve been evangelizing progressive enhancement for as long as we have, you invariably come across skeptics."
canonical: "https://blog.easy-designs.net/archives/the-true-cost-of-progressive-enhancement/"
---

<p>
	When you’ve been evangelizing progressive enhancement for as long as we have, you invariably come across skeptics. Take this comment on <a href="http://timkadlec.com/2013/07/crippling-the-web/">Tim Kadlec’s recent (and well-argued) post about designing experiences that work without JavaScript</a>:</p>
<blockquote>
<p>
		This is all fine and dandy, but not very real world. A cost-benefit analysis has to happen — what does that next user/visitor cost, and more importantly earn you? This idealistic approach would leave most broke if they had to consider “every user” when building a site. That’s why clothes come in small, medium, large, and extra large. Most of us have to buy them that way because not everyone can afford a tailor made suit, much less an entire wardrobe. Your approach only works for those who can see the return.</p>

<!-- more -->

</blockquote>
<p>
	Tim’s response was dead-on:</p>
<blockquote>
<p>
		I think that’s where the difference between “support” and “optimization” comes into play. I’m certainly not saying to go out and buy every device under the sun, test on them, make sure things look and behave the same. You don’t necessarily have to optimize for all these different devices and scenarios (that’s where the cost-benefit analysis has to come in), but it’s often not very time consuming to at least support them on some level.</p>
<p>
		Progressive enhancement can get you a long way towards accomplishing that goal. Sometimes it’s as simple as doing something like “cutting the mustard” to exclude older devices and browsers that might choke on advanced JS from having to try and deal with that. The experience isn’t the same, but if you’ve used progressive enhancement to make sure the markup is solid and not reliant on the JavaScript, it’s at least something that is usable for them.</p>
</blockquote>
<p>
	I’ve had similar conversations innumerable times in person, on conference calls, in blog comments, and (of course) on Twitter. Sometimes I can win the skeptics over with a well-reasoned philosophical argument, but often I need to start filling in numbers.</p>
<p>
	Each project is different, so I’m often reluctant to say “progressive enhancement costs X.” It’s also part-and-parcel of everything we do here at Easy, so it’s damned near impossible to say what a project would cost without progressive enhancement. That said, we’ve been doing this long enough to have a few stories worth sharing. Here are two anecdotes from real projects we’ve worked on.</p>
<h2>
	Backing Off From the Bleeding Edge</h2>
<p>
	Some time ago <a href="/notebook/we-built-a-chrome-app/">we built a Chrome app for WikiHow</a>. As a Chrome app and a show-piece for the new app store, our client wanted it to have fancy CSS3 animations & transitions, web fonts, a WebDB “back-end”, offline support, and lots of other HTML5-y bells and whistles. And, as our target was a single browser, we relented when asked to go the single-page app route. The app was built to degrade gracefully (it blocked non-WebKit browsers), but it was not progressively enhanced.</p>
<p>
	Skip ahead about a year and our client returned to add support for Firefox and IE9+. Oh boy.</p>
<p>
	Having built the site purely for WebKit, it was a bit of the challenge. In addition to implementation differences with the experimental CSS features, we also had to deal with the DOM and JavaScript API variance among the browsers. But the single biggest issue we ran into was the lack of WebDB support in Firefox and IE. You see, in the intervening year, WebDB had been abandoned at the W3C because of pushback (primarily from Mozilla and Microsoft). It was not available in either Firefox or IE, nor would it ever be. And indexedDB, its replacement, had yet to be implemented in any production browser. So we ended up writing <a href="https://github.com/easy-designs/LocalStorageDB.js">a wrapper on top of localStorage that looked a lot like SQL</a>, which allowed us to avoid re-writing the bulk of the app. Coincidentally, it also made the app a lot faster.</p>
<p>
	The total cost of the new compatibility project was around 40% of the original budget required to build the app the first time around. Without access to an alternate timeline I can’t be certain, but my experience tells me it would have added less than 40% to the original project had we been given the leeway to build it using progressive enhancement. And the end result would have been even better because it would have been able to function without JavaScript.</p>
<p>
	Based on other conversations I’ve had with folks, the 40% number seems pretty accurate; possibly even a bit low. I remember a conversation I had six or seven years ago about Google Maps. When the team originally built Maps—in all of its Ajax-y glory—they didn’t make it very accessible and it required JavaScript. According to the source (who I have long forgotten), it took them almost twice as long to retrofit Maps than it would have taken had they built it following progressive enhancement from the ground up. As it’s purely anecdotal, you should take that with a grain of salt, but it’s food for thought.</p>
<p>
	Switching gears, let me share a success story around building things the right way.</p>
<h2>
	Smart Code, Dumb Phones</h2>
<p>
	In early 2012 we began working with a client who was struggling with the security of their mobile apps. They had numerous native apps that all followed the common convention of using a web service to authenticate users. They are a very security-concious organization and this setup was creating a bottleneck in deploying new security features. In order to roll out any new authentication method, error state, etc. they had to go through an excrutiatingly long, painful, multi-step process:</p>
<ol>
<li>
		Implement the new security feature,</li>
<li>
		Expose it via the web service,</li>
<li>
		Update each app to use the new web service (which might include UI changes, etc.),</li>
<li>
		Submit each app for approval, and finally</li>
<li>
		Hope their users downloaded the new version of the app.</li>
</ol>
<p>
	They brought us in to re-imagine the authentication flow as a web-based process that would launch inside of each app and handle letting the app know if and when the user had successfully logged in. This approach meant they could roll out new security features immediately because the apps and the authentication flow would be very loosely coupled. It would be a huge win for everyone involved.</p>
<p>
	Despite the fact that the project was aimed at handling authentication for mobile apps on a few particular platforms, we built the screens following progressive enhancement. The layouts were responsive from tiny screens all the way up to large ones and we implemented HTML5 and JavaScript in completely unobtrusive ways in order to take advantage of cool new things like form validation while still keeping the file sizes small and ensuring the pages would function in the absence or either technology.</p>
<p>
	A few months after completing the project, our client came back to us with interest in rolling out the authentication flow to their m-dot users. They gave us a list of nearly 1400 unique User Agent strings that had been used on the login screen over a two-day period and asked if we could handle it. We parsed the list (<a href="https://github.com/easy-designs/batch-ua-parser.php">with the help of a little script I cooked up</a>) and were able to put together a more manageable list of aggregate devices and device types to use in our testing. It was something like 25 devices that would cover roughly 97% of the spectrum. We were comfortable assuming that fixing issues in 97% of the devices listed would likely also cover the other 3%, but were prepared to fix any additional issues if they cropped up.</p>
<p>
	Our budget for this project was about 33% of the budget of the original project.</p>
<p>
	Much to our surprise, when all was said and done, we came in at roughly half of that budget in terms of actual hours spent and we completed the project in about half the time we expected. It was awesome for us because we saved our client money, which made us look good. It was awesome for our client too, because they were able to save serious money on a project (which rarely happens in the corporate world, at least in my experience).</p>
<p>
	It’s worth noting that this accomplishment had nothing to do with our bug-squashing prowess or our speed… progressive enhancement <em>just works</em>. We were dealing with some heinous old browsers too—think Blackberry 4 and OpenWave—and they really didn’t present much of a challenge. So, for a very modest sum, we were able to quickly roll out additional support for over 1000 devices (and probably thousands more that didn’t make the list) and that created a huge opportunity for our client to attract and retain new customers.</p>
<h2>
	Lessons Learned</h2>
<p>
	We’ve been practicing the art of progressive enhancement for a long time. It’s deeply-ingrained in our process and part of who we are as a company. That often makes it difficult for us to put hard numbers against the cost of <em>not </em>doing progressive enhancement and the financial savings of doing things the way we almost always do. Hopefully, these two small case studies help illuminate things a bit for those who may still be a bit skeptical. </p>
<p>
	Do you have any case studies or anecdotes you can share? We'd love to hear them.</p>
