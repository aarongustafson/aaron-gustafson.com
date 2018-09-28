---
layout: link
title: "A (not so) short note on ARIA to the rescue"
description: "Getting multiple inter-dependent programs on the same page sometimes requires that we do things we’d rather not do"
date: 2016-10-25 11:31:24 -0400
comments: false
ref_url: https://www.paciellogroup.com/blog/2016/10/a-not-so-short-note-on-aria-to-the-rescue/
in_reply_to: https://www.paciellogroup.com/blog/2016/10/a-not-so-short-note-on-aria-to-the-rescue/
ref_source: The Paciello Group
---

Accessibility is hard. It’s a broad term encompassing a variety of special needs ranging from low vision and color blindness to motor impairment and language barriers (to name but a few) which means guaranteeing our projects are "100% accessible" is a significant challenge.

Accessibility becomes even more of a challenge when you begin to factor in the dependency chain. Blind and low-vision users, for example, often use screen readers in order to access the Web. With screen readers, we need to consider the capabilities of both the browser *and* the screen reader being used. If either piece of software isn’t up to the task or contains a bug our users suffer for it.

Getting multiple inter-dependent programs on the same page sometimes requires that we do things we’d rather not do. This post from Steve Faulkner chronicles one such case where the particular versions of Chrome and JAWS required for a project didn’t see eye-to-eye on the semantics of heading levels. He talks about the issue and the less-than-optimal fix he had to put in place to ensure users got the experience they were meant to.