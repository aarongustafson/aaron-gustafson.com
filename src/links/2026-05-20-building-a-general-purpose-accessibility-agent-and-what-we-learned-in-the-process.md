---
title: "Building a general-purpose accessibility agent—and what we learned in the process"
ref_source: "Eric Bailey on the GitHub Blog"
date: 2026-05-20 21:33:33 +00:00
comments: true
tags: ["accessibility", "AI/ML", "software development"]
description: "A useful look at GitHub’s accessibility agent experiment and a nice complement to my recent posts on accessibility data gaps in codegen models and optimizing codebases for AI coding agents."
twitter_text: "A useful look at GitHub’s accessibility agent experiment and what it takes to make these systems genuinely helpful rather than merely busy."
ref_url: https://github.blog/ai-and-ml/github-copilot/building-a-general-purpose-accessibility-agent-and-what-we-learned-in-the-process/
in_reply_to: https://github.blog/ai-and-ml/github-copilot/building-a-general-purpose-accessibility-agent-and-what-we-learned-in-the-process/
---

This post is a detailed and useful look at GitHub’s accessibility agent experiment.

It dovetails nicely with [my post on identifying accessibility data gaps in codegen models](/notebook/identifying-accessibility-data-gaps-in-codegen-models/) and [my follow-up on optimizing codebases for AI coding agents](/notebook/optimizing-your-codebase-for-ai-coding-agents/). The former argued that these systems are already biased toward reproducing the web’s accessibility failures; the latter argued that if we want agents to be useful, we need to give them clearer structure, better documentation, and better examples.

What I especially appreciate here is how grounded the whole effort seems to be. One takeaway is that you can’t just wave your hands and tell an LLM to “do accessibility”; you need concrete guidance, clear expectations, and solid examples. Another is that accessibility work is too contextual to treat as a simple linting problem. And, perhaps most importantly, this is a good reminder that if we want AI systems to help improve accessibility, we have to be intentional about the data, patterns, and codebases we are feeding them. Otherwise they’ll just automate the same mistakes faster.
