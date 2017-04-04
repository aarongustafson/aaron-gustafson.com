---
layout: post
title: "Progressive Misconceptions"
twitter_text: "My colleague Nolan recently wrote of his struggle with progressive enhancement. It’s a rift we need to repair."
date: 2016-10-17 15:33:55 -0400
last_modified_at: 2016-10-18 11:11:00 -0400
comments: true
tags: ["progressive enhancement","web design",accessibility,JavaScript]
description: "My colleague Nolan recently wrote of his struggle with progressive enhancement. It’s a rift we need to repair."
crosspost_to_medium: true
---

Last week, my colleague[^1] [Nolan Lawson](https://nolanlawson.com/) wrote [a lengthy post about his struggles with progressive enhancement](https://nolanlawson.com/2016/10/13/progressive-enhancement-isnt-dead-but-it-smells-funny/). In it, he identified a key tension between the JavaScript community and the progressive enhancement community that has, frankly, existed since the term “progressive enhancement” was coined some 13 years ago. I wanted to take a few minutes to tuck into that tension and assure Nolan and other folks within the JS community that neither progressive enhancement nor the folks who advocate it (like me) is at odds with them or their work.

<!-- more -->

But first let’s take a a trip back in time to 2003. In March of that year, [Steve Champion introduced a concept he called “progressive enhancement”](http://hesketh.com/publications/inclusive_web_design_for_the_future.html). It caused a bit of an upheaval at the time because it challenged the dominant philosophy of graceful degradation. Just so we’re all on the same page, I’ll compare these two philosophies.

## What’s graceful degradation?

*Graceful degradation* assumes that an experience is going to be worse on older, less capable browsers and devices. To address potential problems, it recommends that developers take steps to avoid throwing errors—JavaScript or otherwise—for their users. Under this philosophy, a developer can take a range of approaches ranging from making everything work perfectly in down-level browsers to only addressing egregious errors or even chosing to block certain browsers from accessing the content if they are known to have problems. We saw this latter approach often with Flash-only sites, but it wasn’t limited to them. I used <a href="#2016-10-17-1">this "roadblock" example from Kodak.com</a> in [my book](http://adaptivewebdesign.info/):

<figure id="fig-2016-10-17-1" class="media-container">{% adaptive_image /i/posts/2016-10-17/kodak-roadblock.png %}</figure>

Overall, graceful degradation is about risk avoidance. The problem was that it created a climate on the Web where we, as developers, got comfortable with the idea of denying access to services (e.g., people’s bank accounts) because we deemed a particular browser (or browsers) too difficult to work with. Or, in many cases, we just didn’t have the time or budget (or both) to address the broadest number of browsers. It’s kind of hard to reconcile the challenge of cross-browser development in 2003 with what we are faced with today as we were only really dealing with 2-3 browsers back then, but you need to remember that standards support was far worse at the time.

## So what’s progressive enhancement?

In his talk, Steve upended the generally shared perspective that older browsers deserved a worse experience because they were less technically capable. He asked us to look beyond the browsers and the technologies in play and focus on the user experience, challenging us to design inclusive experiences that would work in the broadest of scenarios. He asked that we focus on the content and core tasks in a given interface and then enhance the experience when we could. We accomplish this by layering experiences on top of one another, hence “progressive enhancement”.

What’s particularly interesting about this approach is that it is still technically graceful degradation because all of the interfaces do gracefully fall back to a usable state. But it’s graceful degradation at its best, focused on delivering a good experience to everyone. No excuses.

To give a simple example, consider a form field for entering your email address. If we were to mark it up like this

	<input type="email" name="email" id="email">

I automatically create layers of experience with no extra effort:

<ol>
<li>Browsers that don’t understand “email” as a valid <code>input</code> type will treat the “email” text as a typo in my HTML (like when you type “rdio” instead of “radio”… or maybe I’m the only one that does that). As a result, they will fall back to the default input type of “text”, which is usable in every browser that supports HTML2 and up.</li>
<li>Browsers that consider “email” a valid <code>input</code> type will provide one (or more) of many potential enhanced experiences:
<ol type="a">
<li>In a virtual keyboard context, the browser may present a keyboard that is tailored toward quickly entering email addresses.</li>
<li>In a browser that supports auto-completion, it may use this as a cue to suggest entering a commonly-entered email or one that has been stored in the user’s profile.</li>
<li>In a browser that supports HTML5 validation, the browser may validate this field for proper email formatting when the user attempts to submit the form.</li>
<li>In a browser that does not support HTML5 validation or that doesn’t actively block submission on validation errors—<a href="https://bugs.webkit.org/show_bug.cgi?id=28649">like Safari</a>—a developer-supplied JavaScript program may use the <code>type</code> attribute as a signal that it should validate the field for proper email address formatting.</li>
</ol>
</li>
</ol>

That means that there are between 5 and 13 potential experiences (given all of the different possible combinations of these layers) in this one single single element… it’s kind of mind-boggling to think about, right? And the clincher here is that any of these experiences can be a good experience. Heck for nearly 15 years of the Web, the plain-ol’ text `input` was the only way we had for entering an email address. Anything better than that is gravy.

Progressive enhancement embraces the idea of experience as a continuum rather than some singular ideal. It recognizes that every person is different and we all have special requirements for Web access. Some may depend on our browser, the device we’re on, and the network we are using. Others may be the result of a limitation we have dealt with since birth, are dealing with temporarily as the result of an injury or incident, or are simply a factor of our current situation. We all experience the world differently and progressive enhancement not only respects that, it embraces that variability.

How does it do this? Progressive enhancement takes advantage of the fault tolerant nature of HTML and CSS. It also uses JavaScript’s own ability to test for browser features to tailor programmatic enhancements to the given device and situation. That’s right: progressive enhancement and JavaScript go hand-in-hand.

## Why are so many JavaScript folks hostile to progressive enhancement?

As a member of the JavaScript community for over a decade now, I have theory for why many JavaScript developers are so antagonistic toward progressive enhancement. Part of it has to do with history and part of it has to do with programming culture. Let’s tackle the history first.

When progressive enhancement was first proposed, the Web was getting more standardized, but things were still a bit of a mess… especially in the JavaScript world. Many JavaScript programs were poorly-written, contained lots of browser-specific code, and were generally unfriendly to anyone who fell outside of the relatively narrow band of "normal" Web use… like screen reader users, for example. It’s not surprising though: Graceful degradation was the name of the game at the time.

Because JavaScript programs were creating barriers for users who just wanted to read news articles, access public services, and check their bank accounts, many accessibility advocates recommended that these folks disable JavaScript in their browsers. By turning off JavaScript, the theory went, users would get clean and clear access to the content and tasks they were using the Web for. Of course that was in the days before Ajax, but I digress.

This recommendation served as a bit of a wake-up call for many JavaScript developers who had not considered alternate browsing experiences. Some chose to write it off and continued doing their own thing. Others, however, accepted the challenge of making JavaScript more friendly to the folks who relied on assistive technologies (AT). Many even went on to write code that actually improved the experience specifically for folks who are AT-dependent. Dojo and YUI, though sadly out of favor these days, were two massive libraries that prioritized accessibility. In fact, I’d go so far as to say they ushered in a period of alignment between JavaScript and accessibility.

Even though JavaScript and accessibility are no longer at odds (and really haven’t been for the better part of a decade), there are still some folks who believe they are. People routinely come across old articles that talk about JavaScript being inaccessible and they turn around and unfairly demonize JavaScript developers as unsympathetic toward folks who rely on screen readers or other AT. It’s no wonder that some JavaScript developers become immediately defensive when the subject of accessibility comes up… especially if it’s not something they’re all that familiar with.

<hr>

I also mentioned that programming culture plays a part in the antagonistic relationship between the progressive enhancement camp and the JavaScript community. If you’ve been a programmer for any amount of time, you’ve probably borne witness to the constant finger-pointing, belittling, and arrogance when it come to the languages we choose to program in or the tools we use to do it.

As a programmer, you receive a near constant barrage of commentary on your choices… often unsolicited. *You’re using PHP? That’s so 1996! You’re still using TextMate?! You still use jQuery? How quaint!* I’m not exactly sure where this all began, but it’s unhealthy and causes a lot of programmers to get immediately defensive when anyone challenges their language of choice or their process. And this hostile/defensive environment makes it very difficult to have a constructive conversation about best practices.

Progressive enhancement should not be viewed as a challenge to JavaScript any more than concepts like [namespacing](https://www.safaribooksonline.com/library/view/learning-javascript-design/9781449334840/ch13s15.html), [test driven development](https://en.wikipedia.org/wiki/Test-driven_development), or [file concatenation & minification](http://www.yottaa.com/company/blog/application-optimization/how-does-reducing-javascript-requests-minifying-javascript/) are; it’s just another way to improve your code. That said, progressive enhancement does introduce a wrinkle many for hardcore JavaScript programmers seem unwilling to concede: JavaScript is fragile. At least on the client side, JavaScript development requires far more diligence when it comes to error handling and fallbacks than traditional programming because, unlike with traditional software development, [we don’t control the execution environment](https://www.aaron-gustafson.com/notebook/a-fundamental-disconnect/).

[Douglas Crockford](http://www.crockford.com/) (in)famously declared the Web “the most hostile software engineering environment imaginable” and he wasn’t wrong. A lot of things have to go right for our code to reach our users precisely the way we intend. Here are just a few of these requirements:

1. Our code must be bug-free;
2. Included 3rd party code must be bug free and must not interfere with our code;
3. Intermediaries—ISPs, routers, etc.—must not inject code or if they do, it must be bug free and not interfere with our code;
4. Browser plugins must not interfere with our code;
5. The browser must support every language feature and API we want to use; and
6. The device must have enough RAM and a fast enough processor to run our code.

Some of these can be addressed by programming defensively using test-driven development, [automated QA testing](http://www.slideshare.net/simonguest/automated-web-testing-using-javascript), [feature detection](https://developer.mozilla.org/docs/Using_Web_Standards_in_your_Web_Pages/Developing_cross-browser_and_cross-platform_pages#Using_Object.2FFeature_support_detection_approach:_best_and_overall_most_reliable), and markup detection. These aren’t guaranteed to catch everything—markup can change after a test has run but before the rest of the code executed, [JavaScript objects are mutable](http://javascriptissexy.com/javascript-objects-in-detail/) meaning features can accidentally disappear, etc.—but they are incredibly helpful for creating robust JavaScript programs. You can also run your projects under HTTPS to avoid intermediaries manipulating your code, though [that’s not fool-proof either](http://arstechnica.com/security/2015/01/gogo-issues-fake-https-certificate-to-users-visiting-youtube/).

The devices themselves, we have no control over. It’s not like we can send a new device to each and every user (or prospective user) we have just to ensure they have the appropriate hardware and software requirements to use our product.[^2] Instead, we need to [write JavaScript programs that play well in a multitude of of scenarios (including resource-limited ones)](https://www.smashingmagazine.com/2012/11/writing-fast-memory-efficient-javascript/).

And, of course, none of this addresses network availability. In many instances, a user’s network connection has the greatest impact on their experience of our products. If the connection is slow (or the page’s resources are exceptionally large) the page load experience can be excruciatingly painful. If the connection goes down and dependencies aren’t met, the experience can feel disjointed or may be flat out broken. Using [Service Worker](https://developer.mozilla.org/docs/Web/API/Service_Worker_API) and client-side storage ([`indexedDB`](https://developer.mozilla.org/docs/Web/API/IndexedDB_API) and [Web Storage](https://developer.mozilla.org/docs/Web/API/Web_Storage_API)) can definitely help mitigate these issues for repeat visits, but they don’t do much to help with initial load. They also don’t work at all if your JavaScript program doesn’t run. Which brings me to my last point.

When you love a language like JavaScript (as I do), it can be difficult to recognize (or even admit) it’s shortcomings, but recognizing them is part of becoming a better programmer. The Web is constantly evolving and our understanding of the languages we use to build it expands as fast as—or often faster than—their capabilities do. As such, we need to remain open to new and different ways of doing things. Change can be scary, but it can also be good. Being asked to consider a non-JavaScript experience shouldn’t be seen as an affront to JavaScript, but rather a challenge to create more robust experiences. After all, our last line of defense in providing a good user experience is providing one with [the least number of dependencies](https://www.smashingmagazine.com/2016/05/developing-dependency-awareness/). That’s what progressive enhancements asks us to do.

## JavaScript & PE kissing in a tree?

All of this is to say I don’t think JavaScript and progressive enhancement are diametrically opposed and I don’t think folks who love the JavaScript language or tout the progressive enhancement philosophy should be either. Together they have the potential to making the Web the best it can possibly be.

Progressive enhancement’s focus on providing a baseline experience that makes no assumptions about browser features will provide a robust foundation for any project. It also guides us to be smarter about *how* we apply technologies like HTML, CSS, JavaScript and ARIA by asking us to consider what happens when those dependencies aren’t met.

JavaScript absolutely makes the user experience better for anyone who can benefit from it. It can make interfaces more accessible. It can help mitigate networking issues. It can create smoother, more seamless experiences for our users. And it can reduce the friction inherent in accomplishing most tasks on the Web. JavaScript is an indispensable part of the modern Web.

In order to come together, however, folks [need to stop demonizing and dismissing one another](https://www.baldurbjarnason.com/notes/debating-web-development/). Instead we need to rally together to make the Web better. But before we can do that, we need to start with a common understanding of the nature of JavaScript. The progressive enhancement camp needs to concede that all JavaScript is not evil, or even bad—JavaScript can be a force for good and it’s got really solid support. The JavaScript camp needs to concede that, despite its ubiquity and near universal support, we can never be absolutely guaranteed our JavaScript programs will run.

I fully believe we can heal this rift, but it’s probably gonna take some time. I fully intend to do my part and I hope you will as well.

<ins datetime="2016-10-18T11:11:00-04:00">**Update:** This post was updated to clarify that graceful degradation can take many forms and to explicitly tie progressive enhancement and graceful degradation together.</ins>

[^1]: Full disclosure: We both work at Microsoft, but on different teams.

[^2]: It’s worth noting that [one company, NursingJobs, actually did this](http://gizmodo.com/website-opts-to-buy-customers-new-computers-rather-than-1513186669).
