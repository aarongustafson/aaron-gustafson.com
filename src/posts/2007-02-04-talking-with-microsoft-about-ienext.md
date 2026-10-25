---
title: "Talking with Microsoft about IE.next"
date: 2007-02-04 18:49:50
comments: false
tags:
  - "Microsoft"
  - "web standards"
  - "browsers"
description: "You may recall that the DOM Scripting and Microsoft task forces, in collaboration with JS Ninjas, had been compiling a list of issues, needs, and wants for IE .next over the last few months (a list many of you contributed to as well..."
canonical: "https://blog.easy-designs.net/archives/talking-with-microsoft-about-ienext/"
atUri: "at://did:plc:6rmgrvblxflqh34omwywu6ib/site.standard.document/3mxrnwy4dwl2p"
image: "/i/share-cards/talking-with-microsoft-about-ienext.jpg"
meta_description: "The DOM Scripting and Microsoft task forces, working with JS Ninjas, compiled a list of needs and wants for IE.next."
social_description: "The DOM Scripting and Microsoft task forces, working with JS Ninjas, compiled a list of needs and wants for IE.next."
---

You may recall that the DOM Scripting and Microsoft task forces, in collaboration with <abbr title="JavaScript">JS</abbr> Ninjas, had been [compiling a list of issues, needs, and wants for <abbr title="Internet Explorer">IE</abbr>.next](http://www.webstandards.org/2006/11/04/you-can-improve-ie-next/) over the last few months (a list many of you contributed to as well, via your feedback). The list was to focus on what we wanted to see happen in terms of JavaScript support (as <abbr title="Internet Explorer 7">IE7</abbr> didn’t get much of an update in that area), but when it came down to it, there were other areas we really felt needed some love.

<!-- more -->

### The list

Last week, our groups voted for what we each saw as priorities and those votes were tallied to create a final list for me to present in Redmond. Though there is obviously a great deal more we want to see in <abbr title="Internet Explorer">IE</abbr>.next, we felt several things were critical and wanted to focus on those as a starting point.

Tied for first place, in order of priority, were some sort of fast, arbitrary node-matching <abbr title="Application Programming Interface">API</abbr> and better error reporting. In the realm of DOM Scripting, node-matching is key (just look at the number of scripts out there performing node matching based on CSS selectors, etc.), so being able to tap into a native XPath implementation (which we generally favored over the Selectors <abbr title="Application Programming Interface">API</abbr>) would greatly improve the speed of script execution. As for the error reporting, perhaps Justin Palmer (of <abbr title="JavaScript">JS</abbr> Ninjas) said it best:

> We could possibly find ways to fix all the other problems if we could tell what the hell was breaking and why. Without better error reporting, the remaining stuff on that list is just giving us a bigger gun to shoot ourselves in the foot with.

Next up in our list was a desire for mutable DOM prototypes. This would address the issues that arise from <abbr title="Internet Explorer">IE</abbr>’s implementation of DOM objects in JavaScript, where elements of the core DOM are not derived from the standard Object prototype. While not technically a standards-support issue, this request does not conflict with standards and it does provide JavaScript developers with the ability to address some of the issues the <abbr title="Internet Explorer">IE</abbr> team may not be able to address themselves in the next release. As Andrew Dupont (another Ninja) remarked, <q>I think it’s reasonable to ask that a DOM implementation in JavaScript behave like it’s part of JavaScript.</q>

Next up was a biggie: bring <abbr title="Internet Explorer">IE</abbr>’s event system in line with the <abbr title="World Wide Web Consortium">W3C</abbr> event model. This has been an issue for a lot of developers and the code to equalize the two event systems makes up a significant chunk of all of the major <abbr title="JavaScript">JS</abbr> libraries. Getting <abbr title="Internet Explorer">IE</abbr> to implement the <abbr title="World Wide Web Consortium">W3C</abbr> event system would be a real boon for standards support and would drop the size of many libraries considerably.

Finally, the last of our top 5 was not a <abbr title="JavaScript">JS</abbr> issue, but rather a CSS one: implement generated content. I don’t know that I really need to get into the reasons why this would be really nice to have.

Two “honorable mentions” were included in the list as well: fixing the issues with `getAttribute()` and `setAttribute()` and starting to implement some of the features of <abbr title="JavaScript">JS</abbr> 1.7 (such as block-scope variables using `let`, etc.).

Not willing to let the <abbr title="Internet Explorer">IE</abbr> team off that easy, the document presented also highlighted several other issues which really need addressing including (among others)

- fixing CSS bugs (including collapsing adjoining margins and `z-index`);
- various form control fixes (including implementations of the `<button>` element, `<label>`s, and the `disabled` attribute);
- correcting its support for `<object>`;
- adding support for the `<q>` element (which should be a breeze once generated content is enabled); and
- fixing attribute issues (such as `alt` being used for a tooltip, `cite` not being supported on `<q>` and `<blockquote>`, and `summary` not being supported on `<table>`s).

### The meeting

In Redmond, I met with Pete LePage, a Product Manager at Microsoft Web Platform and Tools, and several other key members on the <abbr title="Internet Explorer">IE</abbr> team. We discussed the list and its implications in great detail for nearly two hours. While I am not at liberty to discuss all of the details of the meeting, I can say for certain that the group I met with was keenly aware of the issues we brought up and are eager to address them. One team member even said that he could have easily guessed our top 5.

The one concern they have—especially with regard to the event model and `getAttribute()`/`setAttribute()`—is that any adjustments they make to bring <abbr title="Internet Explorer">IE</abbr> in line with the standards not “break the web” for the large number of sites using the proprietary <abbr title="Internet Explorer">IE</abbr> event model, etc. We discussed this particular topic at length as it is a valid concern and I’m happy to say that I think we’re close to a solution on that front.

I came away from this meeting with a real sense of hope about where <abbr title="Internet Explorer">IE</abbr> is going and am really encouraged by their willingness to engage the standards community (and web developers as a whole) in dialog like this. We did not resolve every issue in our two-hour talk, but I was assured that this was only the first of many steps toward improving <abbr title="Internet Explorer">IE</abbr>.next. The <abbr title="Internet Explorer">IE</abbr> team wants to continue this conversation and to continue to elicit feedback from the web community as a whole as things progress.
