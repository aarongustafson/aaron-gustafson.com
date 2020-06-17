---
layout: post
title: "Dynamic shortcuts questions"
date: 2020-06-16 14:57:19 -0700
comments: true
tags: ["progressive web apps"]
description: ""
---

You may or may not be aware, but [the Shortcuts feature](https://www.w3.org/TR/appmanifest/#shortcuts-member) for PWAs [has begun rolling out in Chromium-based browsers](https://www.windowslatest.com/2020/01/20/microsoft-is-adding-shortcuts-menu-to-chrome-pwas/) and implementation is underway in other browsers as well. The first version of Shortcuts provides you with the ability to define a small set of links in your Manifest. Rayan Kanso and I are currently working on [a proposal for Shortcuts v2](https://github.com/rayankans/app-shortcuts) which will introduce a JavaScript API for managing these links and we’d love your input too.

<!-- more -->

If you are unfamiliar with Shortcuts, this feature lets you declare a handful of links that will appear as part of the context menu of your PWA’s icon within the host OS. On most desktop operating systems, these actions are accessed by right clicking on the app icon. In iOS, you "force touch" or "long touch" (depending on your device generation) the icon, and on Android they appear when you "long press" the icon. You can [learn more about Shortcuts in the Explainer](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/Shortcuts/explainer.md).

In Shortcuts v2, we are looking at enabling JavaScript to add to or modify Shortcuts menu items. When I originally thought about this, I had assumed all of the Shortcuts defined in the Manifest would be able to be removed or adjusted via the JavaScript API. So, for example, a shortcut to "Now Playing" in a music app could be updated to "Now Playing: Phone by Lizzo" when that track is playing. In this case, the URL might remain exactly the same, but the label would be updated.

[When discussing this with Rayan (and others)](https://github.com/rayankans/app-shortcuts/issues/1), it appears that Android draws a distinction between "static" shortcuts and "dynamic" ones. Static shortcuts are generated when the app is installed; dynamic shortcuts don’t appear until the app has been run the first time. Static shortcuts are immutable (i.e., can’t be changed); dynamic shortcuts can be replaced by application logic at any time. These two different classes of shortcut also exist in different collections in the context menu and cannot be intertwined in the same menu system (i.e., all static shortcuts are in one group and all dynamic shortcuts are in another).

Further complicating things, iOS draws a distinction between "static" and "dynamic" shortcuts, but based on my cursory reading of [the docs](https://developer.apple.com/documentation/uikit/uiapplicationshortcutitem), even dynamic shortcuts are immutable once created. From what I’ve read, desktop OSes do not seem to support distinct shortcut types.

In order to set expectations properly and spec out the API, we need to decide on a direction to go in. That’s where you come in. I’ve created a Twitter Poll (below) that will allow you to vote for your preference. This will help us get a better sense of what you (folks who make websites) want and expect from a Shortcuts JavaScript API. If it means we need to come up with creative ways to manage the implementation under the hood in order to provide the right user experience and developer ergonomics, we’ll figure that out.

Poll (to be created on Twitter)

How would you prefer to manage PWA Shortcuts?

Separate: I want immutable static shortcuts and separate dynamic shortcuts accessible from JavaScript.
Combined: I want JavaScript access to all shortcuts, regardless of how they are defined.

() Separate
() Combined
