---
title: "ARIA live timing"
ref_source: "Russ Weakley, Max Design"
date: 2026-10-21 14:00:00 +00:00
comments: true
tags: ["accessibility", "ARIA", "JavaScript"]
description: "Russ Weakley separates the browser’s delivery of live-region updates from a screen reader’s speech queue, helping explain why announcement timing varies."
twitter_text: "Updating a live region and hearing its contents aren’t the same event. Russ Weakley digs into what happens between the two."
ref_url: https://www.maxdesign.com.au/articles/aria-live-timing.html
in_reply_to: https://www.maxdesign.com.au/articles/aria-live-timing.html
---

Worth keeping handy the next time a live-region announcement seems to arrive whenever it pleases. Russ Weakley walks through two different parts of the journey: the browser exposing an update to assistive technology and the screen reader deciding when to speak it.

That distinction is useful when debugging, but I’d be careful about turning any observed delay into a magic timeout. A delay that works with one browser and screen reader isn’t a delivery guarantee. And switching everything to `assertive` so it gets heard sooner means interrupting whatever someone was already listening to. That’s a pretty steep price for announcing that we saved their preferences.
