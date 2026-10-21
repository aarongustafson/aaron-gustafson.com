---
title: "Isomorphic Web Components"
ref_source: "Jake Lazaroff"
date: 2026-10-21 14:00:00 +00:00
comments: true
tags: ["web components", "HTML", "progressive enhancement"]
description: "Jake Lazaroff explores server-rendering web components, including a proof of concept that runs component code against an emulated DOM."
twitter_text: "Web components and server-rendered HTML aren’t at odds. Jake Lazaroff explores several approaches, including running the same component code in both places."
ref_url: https://jakelazaroff.com/words/isomorphic-web-components/
in_reply_to: https://jakelazaroff.com/words/isomorphic-web-components/
---

Jake Lazaroff has a useful response to the idea that web components can’t be rendered on the server: he walks through how to do it. His proof of concept uses an emulated DOM to run component code outside the browser and serialize the result, including declarative shadow DOM.

I’m still partial to sending useful HTML and enhancing it, without needing to run the component’s JavaScript on the server first. But those approaches aren’t mutually exclusive. If the generated HTML lets someone accomplish their task before the client-side code arrives—or when it never does—that’s the part I care about. Sharing the rendering code is an implementation choice, not a reason to give up that baseline.
