---
title: "Polishing your typography with line height units"
ref_source: "Jen Simmons, WebKit"
date: 2026-10-21 14:00:00 +00:00
comments: true
tags: ["CSS", "typography", "progressive enhancement"]
description: "Jen Simmons demonstrates how lh and rlh units can tie spacing to the text itself, with a straightforward fallback for browsers that don’t understand them."
twitter_text: "A little CSS detail with a lovely payoff: use line-height units to keep paragraph spacing in step with the text."
ref_url: https://webkit.org/blog/16831/line-height-units/
in_reply_to: https://webkit.org/blog/16831/line-height-units/
---

I love a small CSS improvement you can actually see. Jen Simmons’ side-by-side examples of paragraph margins set in `em` and `lh` make a good case for giving line-height units a look. The space between paragraphs becomes part of the text’s rhythm rather than a measurement that happens to sit near it.

And the fallback is delightfully ordinary: declare an `em` value, then the `lh` value. Browsers that don’t understand the latter keep the former. No script, no measuring text after it renders, no need to hold the whole design hostage to a typographic refinement.
