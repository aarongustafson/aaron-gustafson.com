---
title: "Dialogs, modality and popovers seem similar. How are they different?"
ref_source: "Hidde de Vries"
date: 2026-10-21 14:00:00 +00:00
comments: true
tags: ["accessibility", "HTML", "design systems"]
description: "Hidde de Vries separates modality, focus, dismissal, and layering so we can discuss interface behavior more precisely than calling every overlay a modal."
twitter_text: "A backdrop doesn’t make something modal. Hidde de Vries’ breakdown of dialogs, popovers, and their behaviors is useful shared vocabulary for a team."
ref_url: https://hidde.blog/dialog-modal-popover-differences/
in_reply_to: https://hidde.blog/dialog-modal-popover-differences/
---

Worth sharing with your team before the next conversation where everyone says “modal” and means something different. Hidde de Vries separates the characteristics—modality, dismissal, focus, layering—from the components that combine them.

His distinction between a backdrop, a focus trap, and making the rest of the page inert is particularly helpful. They’re not interchangeable, even when the screenshot looks right. Some implementation and browser-support notes reflect when this was written, but the questions remain useful: can someone still interact with the rest of the page, where does focus go, and how do they get back out? Those answers tell us much more than a component name.
