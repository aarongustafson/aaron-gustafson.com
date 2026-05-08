---
title: "Progressive Enhancement vs. Hardboiled Design"
date: 2012-01-09 15:27:00
comments: true
tags:
  - "accessibility"
  - "progressive enhancement"
  - "CSS"
  - "JavaScript"
  - "user experience"
description: "Late last week, I linked my Forrst followers to Stephanie Rieger’s awesome post “A Plea for Progressive Enhancement ” which offered a even-handed critique of a sliding menu interaction on the website for the Obama campaign. The main..."
canonical: "https://blog.easy-designs.net/archives/progressive-enhancement-vs.-hardboiled-design/"
---

<p>
	Late last week, I linked my <a href="http://forrst.com/">Forrst</a> followers to <a href="http://stephanierieger.com/a-plea-for-progressive-enhancement/">Stephanie Rieger’s awesome post “A Plea for Progressive Enhancement<span class="final quote">”</span></a> which offered a even-handed critique of a sliding menu interaction on the website for the Obama campaign. The main thrust of her complaint was that it didn’t work on most of the mobile devices she tested, including an iPhone 4 running iOS 4.3.5—one version prior to the release of iOS 5.</p>

<!-- more -->

<blockquote cite="http://stephanierieger.com/a-plea-for-progressive-enhancement/">
<p>
		[T]he menu failed. Never even opened. Suddenly, the site was without navigation…at all.</p>
</blockquote>
<p>
<a href="http://dribbble.com/JoeSeddon">Joe Seddon</a>, a <span class="caps">UK</span>-based designer, shared his reaction to the post in the comment thread, but if you’re not a Forrst member, you can’t read the comments, so I wanted to share his reaction:</p>
<blockquote cite="http://forrst.com/posts/A_plea_for_progressive_enhancement-JKd#comment-527846">
<p>
		I know you’re a big fan of progressive advancement Aaron and I have huge respect for you as a designer, however I disagree with your way of thinking and feel it is holding our industry back.</p>
<p>
		Starting from the bottom instead of the top limits creativity. By designing from the top we as designers can take advantage of new technology and build the best user experience possible for those who use the best browsers. I agree that designs should work to a usable degree on every browser and device in which there is a decent level of traffic coming from, however this doesn’t mean we should have to start designing for them first.</p>
<p>
		In the case of Brad Frost, he should keep his nifty slider on Barack Obama’s website however on mobile he should find an alternative solution that works. If this means removing the slider all together and replacing it with a simpler navigation method then so be it. He shouldn’t limit the experience of the desktop user just because of the mobile user doesn't have a device that supports this or that.</p>
</blockquote>
<p>
	I don’t mean to pick on Joe here, but he shares a common misconception about progressive enhancement. One I hope my response (below) dispels:</p>
<blockquote cite="http://forrst.com/posts/A_plea_for_progressive_enhancement-JKd#comment-527892">
<p>
<a href="http://forrst.com/people/JoeSeddon">@JoeSeddon</a> It sounds like you’re firmly in the Andy Clarke camp on this one, but I couldn’t disagree more with your statement that my “way of thinking” (i.e. progressive enhancement) is “holding our industry back.” If anything, I think it is the way forward. And for the record, I’m not the only one thinking this way: Jeffrey Zeldman, <a href="http://forrst.com/people/adactio">@adactio</a>, Ethan Marcotte, Daniel Mall, Scott Jehl <span class="amp">&amp;</span> the Filament Group, Brad Frost, Stephanie and <a href="http://forrst.com/people/bryanrieger">@bryanrieger</a>, and countless others support and promote progressive enhancement every day.</p>
<blockquote>
<p>
			Starting from the bottom instead of the top limits creativity.</p>
</blockquote>
<p>
		Actually no. Building a website is a heck of a lot like building a house—you need a solid foundation and “good bones” for it so stand the test of time and for it to be able to support the amazing things you want to do with it. Your server forms the foundation—keeping the whole website stable. And smart, semantic markup is the framing—the joists and supports that allow you to build higher without worrying about collapse.</p>
<p>
		To take the analogy further, your backend (assuming you have an <span class="caps">API</span> or at least a <span class="caps">DB</span> and some code to talk to it) is like the electrical, water, and communication systems which will support the fixtures of your site. <span class="caps">CSS</span> is your façade and interior design. Basic <span class="caps">HTTP</span> (e.g. links and communication via <span class="caps">POST</span> and <span class="caps">GET</span>) and JavaScript (probably in concert with an <span class="caps">API</span>) connects the systems to your fixtures (most likely a combo of <span class="caps">HTML</span>, <span class="caps">CSS</span> <span class="amp">&amp;</span> <span class="caps">JS</span>) and makes them functional.</p>
<p>
		All of these pieces are orchestrated by your <span class="caps">IA</span>, User Flows, and <span class="caps">UX</span> design—the blueprints, elevations, etc. of the web world. And, to be honest, that’s where you should be doing the lion’s share of your creative thinking when it comes to interface.</p>
<blockquote>
<p>
			By designing from the top we as designers can take advantage of new technology and build the best user experience possible for those who use the best browsers.</p>
</blockquote>
<p>
		You, as a designer, should be considering the implications of technical decisions and options at the planning stage. If you’re a freelancer or run a small shop, you may be the <span class="caps">UX</span> person too, but if you aren’t, you should be working with your <span class="caps">UX</span> person to propose innovative interactions and then plan out how those can be used on the latest and greatest browsers and what the experience would be on less capable browsers and devices. It all starts with the planning.</p>
<p>
		Nothing in progressive enhancement says you can’t use the latest and greatest technologies and techniques, it just asks you to respect your content and your users by being smart about how you apply them. Remember: browsers and technologies come and go<sup><a href="/notebook/progressive-enhancement-vs.-hardboiled-design/#footnote-browser-examples">1</a></sup>; focus on your content and your users.</p>
<blockquote>
<p>
			I agree that designs should work to a usable degree on every browser and device in which there is a decent level of traffic coming from, however this doesn't mean we should have to start designing for them first.</p>
</blockquote>
<p>
		First of all, analytics are not always 100% accurate and, secondly, as a web designer or developer, we never know who is coming to our site and what they are looking to do. For all you know, there’s a lady out there looking to spend millions of dollars on the product or service your site (or your client’s) is providing and your analytics program can’t tell you that she’s the 0.001% that came to your site on an aging Blackberry. Analytics can tell you general trends, but they should only be used for general guidance. I’d rather build something that is going to work for a user regardless of her device. I’m not going to waste time trying to re-create the awesome experience she may have in the latest version of Chrome or Firefox, but I sure as hell want to make sure the experience she does have is a positive one.</p>
<blockquote>
<p>
			In the case of Brad Frost, he should keep his nifty slider on Barack Obama's website however on mobile he should find an alternative solution that works.</p>
</blockquote>
<p>
		Point of clarification: Brad does not work for the Obama campaign, he simply brought Stephanie’s attention to the interface, but to your point: “he should find an alternative solution that works.” Absolutely! Building from a workable baseline up to the hi-fi experience of the sliding nav would accomplish that. There’s nothing to say that you can’t have your cake and eat it too; you just need to be smart about your approach—proper planning is key.</p>
<blockquote>
<p>
			He shouldn't limit the experience of the desktop user just because of the mobile user doesn't have a device that supports this or that.</p>
</blockquote>
<p>
		Of course he shouldn’t. Progressive enhancement doesn’t say that he should.</p>
<p>
		I think you should rethink what progressive enhancement is all about. Not to plug my own work, but the first chapter of my book lays it out pretty well. You can <a class="external" href="http://adaptivewebdesign.info" target="_blank">download it for free as a <span class="caps">PDF</span></a> or <a class="external" href="http://www.netmagazine.com/features/progressive-enhancement-demystified" target="_blank">read the web-based version on <cite>.net Magazine</cite></a> .</p>
<p id="footnote-browser-examples">
		1. Don’t believe me? Look at how many companies built software and intranets around <span class="caps">IE</span>6. Why did they do it? It was considered a pretty good browser at the time. Need a more recent example? Look at WebDB (SQLite). It was introduced in Webkit and and looked to be on track to become a formal W3C recommendation, but then it was dropped in favor of IndexedDB. I speak from experience when I say things like this can and often do bite you in the ass if you work on the bleeding edge.</p>
</blockquote>
<p>
	After reading my incredibly lengthy response, Joe kindly wrote back:</p>
<blockquote cite="http://forrst.com/posts/A_plea_for_progressive_enhancement-JKd#comment-527954">
<p>
<a href="http://forrst.com/people/AaronGustafson">@AaronGustafson</a> First of all I’d just like to say great post, and thanks for taking the time to reply to my post.</p>
<p>
		Your reply has actually made me think about progressive enhancement and “hardboiled design” and re-consider which one really is the best strategy. I like your analogy of building a house in particular and that’s what mainly made me re-think my stance. My biggest problem with progressive enhancement was building from the bottom, as I truly did believe building from the top would allow me to deliver a better experience to those who use the better browsers/devices. In the words of Andy Clarke, I didn’t want to just give users who are on the latest version of Google Chrome little visual rewards.</p>
<p>
		Thanks for linking me to the first chapter of your book, I’ve heard a lot of positive things about it and it certainly has gone down well with its readers and the media. I’ll read the first chapter and see where I stand after it.</p>
</blockquote>
<p>
	I’m happy to have gotten him to reconsider his stance on progressive enhancement. Hopefully we’ve gained another convert. Time will tell. ;-)</p>
