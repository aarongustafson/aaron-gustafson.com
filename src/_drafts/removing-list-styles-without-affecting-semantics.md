---
title: "Removing list styles without affecting semantics"
ref_source: "Manuel Matuzović"
date: 2026-10-21 14:00:00 +00:00
comments: true
tags: ["accessibility", "CSS", "HTML"]
description: "Manuel Matuzović tests an empty string for list-style-type as an alternative to removing list markers with list-style: none."
twitter_text: "An interesting CSS finding from Manuel Matuzović: removing list markers with an empty string while preserving list announcements in his tests."
ref_url: https://www.matuzo.at/blog/2023/removing-list-styles-without-affecting-semantics
in_reply_to: https://www.matuzo.at/blog/2023/removing-list-styles-without-affecting-semantics
---

Well, this is an interesting wrinkle in the relationship between CSS and accessibility. Manuel Matuzović tried `list-style-type: ""` instead of `list-style: none` and found that it removed the markers while retaining list semantics in the browser and screen reader combinations he tested.

I appreciate that he includes those combinations and a demo you can test yourself. This is an older finding, not a promise about every browser someone might use today, and I’d treat it accordingly. But it’s a useful reminder that changing how something looks can affect how it’s announced. Inspecting the HTML alone won’t catch that.
