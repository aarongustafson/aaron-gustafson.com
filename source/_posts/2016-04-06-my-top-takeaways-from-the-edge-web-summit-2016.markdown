---
layout: post
title: "My Top Takeaways From the 2016 Edge Web Summit"
date: 2016-04-06 15:18:15 -0400
comments: true
categories: [browsers,conferences]
twitter_text: "My top takeaways from the 2016 Edge Web Summit: "
---

Earlier this week, my colleagues on the Microsoft Edge team put on the second of what has now become an annual event: The Edge Web Summit. The format was a little different this year, with team members from across the organization delivering quick, punchy 30-minute talks on topics ranging from standard implementations to the user experience of a browser to real-time communications. I live-tweeted quite a few of the talks, but I thought I’d provide a bit of a round-up of what was revealed, discussed, and more so you can read it all in one place.

<!-- more -->

* Since launching Edge 8 months ago, the team has pushed 12 update releases, 128 new features, and 6,527 bug fixes!
* The team has launched a new, highly transparent bug tracker for Edge: [issues.microsoftedge.com](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/).
* The Edge team has done a ton of research into what specs are being used and how they are being used on the open Web. They are starting to share this information on [data.microsoftedge.com](https://developer.microsoft.com/en-us/microsoft-edge/platform/data/). It currently consists of 2 parts: 1) [usage data](https://developer.microsoft.com/en-us/microsoft-edge/platform/usage/) from real sites that looks at not only CSS properties in use, but values too; and 2) [a catalog of available APIs](https://developer.microsoft.com/en-us/microsoft-edge/platform/catalog/) and a detailed analysis of browser support, down to specific configuration and property values.
* Hot on the tails of [RemoteIE](https://developer.microsoft.com/en-us/microsoft-edge/tools/remote/) opening up for Linux users, RemoteEdge is coming soon! Jacob Rossi showed [a screenshot of an Edge instance running on Azure, within Chrome](https://twitter.com/aarongustafson/status/717022717652828163). So cool!
* [Text-to-speech](https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#tts-section) directly from within JavaScript!
* The [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)!
* [Beacons](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon) as an alternative to blocking JavaScript requests for telemetry data: `navigator.sendBeacon( uri, data )`.
* [Web notifications](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)!
* [WOFF 2](https://www.w3.org/TR/WOFF2/) font support for better compression and faster downloads/decompression!
* The team is currently prototyping and investigating [Service Workers](https://www.w3.org/TR/service-workers/), [Push Notifications](https://developer.mozilla.org/en-US/docs/Web/API/Push_API), [Shadow DOM](https://www.w3.org/TR/shadow-dom/), [Custom Elements](https://www.w3.org/TR/custom-elements/), [Web Payments](https://www.w3.org/Payments/), [Web Assembly](https://www.w3.org/community/webassembly/), and [ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).
* Cortana in Edge has gotten some major upgrades, such as being able to "Ask Cortana" about an image to get more information (like a recipe for the cookies you saw on Pinterest that did’t include a link).
* Microsoft open-sourced [the CSS crawler powering their data portal](https://github.com/MicrosoftEdge/css-usage) so other browser vendors can run it too.
* [FIDO](https://en.wikipedia.org/wiki/FIDO_Alliance)-based login (like [Windows Hello](http://windows.microsoft.com/en-us/windows-10/getstarted-what-is-hello)) is coming to the Web!
* [Microsoft’s Narrator](http://windows.microsoft.com/en-us/windows/hear-text-read-aloud-narrator) screen reader now supports a "Developer Mode" that blanks out the current app (such as your browser window) in order to enable you to more easily debug accessibility issues.
* The F12 tools in Edge now enable you to view the previously mysterious [Accessibility Tree](https://www.paciellogroup.com/blog/2015/01/the-browser-accessibility-tree/) in addition to allowing you to drill more deeply into the various properties of an element that relate to its accessibility.

I didn’t take a ton of notes in the second half of the day as I was prepping for [my own session on accessibility](https://channel9.msdn.com/Events/WebPlatformSummit/edgesummit2016/ES1612), but other highlights included building & debugging [extensions for Edge](https://blogs.windows.com/msedgedev/2016/03/17/preview-extensions/) (tldr; you can easily port Chrome extensions) and cool things you can do using [Continuum](https://www.microsoft.com/en-us/windows/Continuum).

Overall, the event was incredibly informative and has me really excited about the work the Edge team is doing and where the browser is going. The new stuff that‘s ready for prime time will be out for the public in [the Anniversary Update of Windows 10](https://blogs.windows.com/windowsexperience/2016/03/30/windows-10-anniversary-update-brings-new-experiences-and-developer-opportunity/) this Summer, but some of it is has already landed in [Windows Insider](https://insider.windows.com/) builds.