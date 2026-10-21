---
title: "margin-trim"
ref_source: "Jen Simmons, WebKit"
date: 2026-10-21 14:00:00 +00:00
comments: true
tags: ["CSS", "web design", "progressive enhancement"]
description: "Jen Simmons explains how margin-trim lets a container remove margins at its edges without needing to predict the content inside it."
twitter_text: "A heading, a paragraph, or an image might come first. margin-trim lets the container handle that edge spacing without needing to guess."
ref_url: https://webkit.org/blog/16854/margin-trim/
in_reply_to: https://webkit.org/blog/16854/margin-trim/
---

This is a familiar bit of CSS housekeeping: give a container some padding, then undo the first and last child’s margins so the spacing comes out right. Until the content changes, of course.

Jen Simmons’ explanation of `margin-trim` gets at why putting that decision on the container is so useful. The container knows which edges need trimming; the content can keep its own spacing rules. I particularly like the examples where nested content makes the usual first-child and last-child selectors less straightforward. Check support for the browsers you need to reach, and keep a reasonable fallback, but this is a very welcome way to express what we meant in the first place.
