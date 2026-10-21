---
title: "enterkeyhint"
ref_source: "MDN Web Docs"
date: 2026-10-21 14:00:00 +00:00
comments: true
tags: ["HTML", "web forms", "user experience"]
description: "The enterkeyhint attribute lets us suggest a useful label for a virtual keyboard’s Enter key, without replacing native form controls."
twitter_text: "A useful bit of HTML to keep in your forms toolkit: enterkeyhint can make a virtual keyboard’s Enter key describe the action someone expects."
ref_url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/enterkeyhint
in_reply_to: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/enterkeyhint
---

A small HTML detail worth remembering: `enterkeyhint` lets us suggest what the Enter key on a virtual keyboard should say. `search` for a search field, `send` for a message, `next` when there’s another field to fill out. A little more context, right where someone’s already looking.

The important bit is that it’s a hint about the key’s label, not an implementation of the action. Adding `enterkeyhint="next"` doesn’t wire up focus management for you. Match the hint to what your form actually does, and keep the label and submit button doing their jobs too.
