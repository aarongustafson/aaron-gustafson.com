---
title: "The Incredible Overcomplexity of the Shadcn Radio Button"
ref_source: "Paul Hebert"
date: 2026-04-29 12:15:00 +00:00
comments: true
tags: ["HTML", "accessibility", "web development"]
description: "It’s just a radio button. Paul’s teardown is a good illustration of how far modern front-end practice can drift from the simple, robust platform primitives we already have."
twitter_text: "It’s just a radio button. We really don’t need two component libraries, ARIA role remapping, and client-side JS to do what HTML already does."
ref_url: https://paulmakeswebsites.com/writing/shadcn-radio-button/
in_reply_to: https://paulmakeswebsites.com/writing/shadcn-radio-button/
via:
  name: "mvneerven on LinkedIn"
  url: "https://www.linkedin.com/posts/mvneerven_puredesignsystem-webstandards-shadcn-share-7433473431062450176-IyP1/"
---

_It’s just a radio button._

Paul’s teardown is a good illustration of how far modern front-end practice can drift from the simple, robust platform primitives we already have.

> If you can use a native HTML element or attribute with the semantics and behavior you require already built in, instead of re-purposing an element and adding an ARIA role, state or property to make it accessible, then do so.

Reading this reminded me of a pair of pieces I’ve linked to before: [Making radio buttons and checkboxes easier to use](/links/2015-09-01-making-radio-buttons-and-checkboxes-easier-to-use/) and [There can be only one: Options for building “choose one” fields](/links/2022-12-11-there-can-be-only-one-options-for-building-choose-one-fields/).

We have spent an astonishing amount of time and energy overcomplicating a control HTML already gives us, often in the name of developer experience or styleability. More often than not, all we’re really doing is trading resilience for ceremony.
