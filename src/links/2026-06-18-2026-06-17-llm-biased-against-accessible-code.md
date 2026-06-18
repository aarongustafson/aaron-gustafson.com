---
title: "LLM biased against accessible code (Claude Code issue #56079)"
ref_source: "EstiShay on GitHub"
date: 2026-06-18 14:03:30 +00:00
comments: true
tags: ["accessibility", "AI/ML", "progressive enhancement"]
description: "Making accessibility a project requirement and still having the coding model treat a11y fixes as optional? It’s not you. It’s the model."
twitter_text: "Making accessibility a project requirement and still having the coding model treat a11y fixes as optional? It’s not you. It’s the model."
ref_url: https://github.com/anthropics/claude-code/issues/56079
---

EstiShay filed a bug report that’s concerning. They found that Claude Code treats accessibility fixes as optional, even when the project’s requirements file explicitly specifies “WCAG 2.2 AA minimum.” When asked, the model explains:

> Claude treats accessibility fixes as optional trade-offs rather than requirements, even when the project’s own rules say otherwise. That’s distinct from just not knowing the right ARIA pattern — it’s a values problem in how the model weighs competing priorities.

So… not a lack of knowledge (the model performs well when reviewing code); it’s a conscious choice, a prioritization failure. Accessibility becomes a “nice to have” in pursuit of coding speed, just like we’ve deprioritized it in human-made software for decades.

The models learned from us and are repeating all of our mistakes. At scale.
