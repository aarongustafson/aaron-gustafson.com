---
title: "Complaining About Designers Fiddling with Figma Solves Nothing"
date: 2025-03-24 09:11:54 -07:00
comments: true
tags: ["design", "web development", "industry"]
description: "Michael F. Buckley posted a somewhat imflamatory piece to the UX Collective blog over on Medium and I had some strong reactions to it I wanted to share."
twitter_text: "Michael F. Buckley posted a somewhat imflamatory piece to the UX Collective blog over on Medium and I had some strong reactions to it I wanted to share."
in_reply_to: https://uxdesign.cc/figmas-not-a-design-tool-it-s-a-rube-goldberg-machine-for-avoiding-code-2a24f11add5d
---

Michael F. Buckley posted [a somewhat imflamatory piece to the UX Collective blog over on Medium](https://uxdesign.cc/figmas-not-a-design-tool-it-s-a-rube-goldberg-machine-for-avoiding-code-2a24f11add5d) and I had some strong reactions to it I wanted to share. You should read it first before continuing.

<!-- more -->

First off, I agree with his core message: designers should understand the medium they are working in, be it web or an OS-specific UI. That’s where my agreements end, however.

> They pat themselves on the back, believing they’ve mastered digital design. Meanwhile, a developer glances at the file, sighs, and codes the button in five minutes.

Condescention toward designers aside, this also assumes a high degree of competency and understanding of nuance on the engineering side which — in my experience — is not guaranteed. I cannot tell you how often I’ve designed an interface that calls for a button to submit a form and I get back a `div` with a click handler that can’t accept focus and has no design considerations for hover, focus, etc. In other words, if I provided a design with a single button on it, I get that button exactly. Sometimes exactly to those explicit  dimensions, text overflow be damned.
 
There needs to be an acknowledgement and appreciation that designers know their craft and (generally) have good reasons for being overly prescriptive. Do some designers stray into realms of self-indulgence… absolutely! But so do engineers.
 
I think where we need to get to is a place where handoff provides enough information to inform the engineer of the totality of what’s needed. Sure, to a seasoned engineer that may seem overly detailed, but to a junior engineer it can be incredibly helpful in learning all of the considerations of something as seemingly simple as a button. And even a seasoned engineer might learn a thing (or three) from annotations regarding accessibility and such. Communication is the key to success here.
 
Also, some prototyping in a tool like Figma can help with catching issues — like keyboard traps, for instance — before they are codified into code. Making changes in Figma or other design tools is generally a lot cheaper that doing it in code. Back of the napkin math — which is generally agreed upon across the industry — is that catching & fixing an accessibility issue in design costs about $100. In development, it’s like $1,000. If it sneaks into production, it’s gonna be more like $10,000.
 
To be clear, I’m not disagreeing with the piece in its entirety — designers should learn their medium (which is coding to a degree but also UX expectations) and Figma’s **not** the medium — but I think there’s more nuance to it. I also dislike the us vs. them framing; we’re all in this together.
