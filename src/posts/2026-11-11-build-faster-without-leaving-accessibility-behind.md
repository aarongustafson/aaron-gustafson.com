---
title: "Build faster without leaving accessibility behind"
date: 2026-11-11 17:46:47 +00:00
comments: true
tags: ["accessibility", "inclusive design", "open source"]
description: "AI can help us build software faster. The Accessibility Considerations Toolkit aims to help us avoid building barriers faster, too."
meta_description: ""
social_description: ""
twitter_text: "Building faster shouldn’t mean building barriers faster. Microsoft’s Accessibility Considerations Toolkit brings guidance on how people with disabilities use technology into design, development, and testing."
hero:
  src: /i/posts/2026-11-11/hero.png
  alt: "The Accessibility Considerations Toolkit README, showing its title, introduction, and overview of the guidance."
  credit: Microsoft
  url: https://aka.ms/A11yConsiderations
image: "/i/share-cards/build-faster-without-leaving-accessibility-behind.jpg"
atUri: "at://did:plc:6rmgrvblxflqh34omwywu6ib/site.standard.document/3n22j5ybpd523"
---

When accessibility questions come up, not every team has someone who can help answer them. Without that resource, teams can miss how their decisions affect people with disabilities—and leave barriers in place until someone encounters them.

AI-assisted development makes that gap more pressing. If the tools helping us build software don’t account for how people with disabilities use technology, they can repeat those mistakes across more interfaces, faster. We need to bring that understanding into the work while decisions are still being made.

Today, my team is open sourcing the [Accessibility Considerations Toolkit (ACT)](https://aka.ms/A11yConsiderations) to help close that gap.

<!-- more -->

## Start with how people use things

ACT brings together guidance on access strategies, assistive technologies, devices, and the contexts in which people are trying to get things done. It gives designers, developers, researchers, and evaluators a starting point for investigating barriers in an actual interface.

The emphasis on *actual* is important. Guidance alone can’t tell you whether something works. You need to examine the interface, consider how someone might interact with it, and gather evidence.

Consider someone filling out a form. They might increase browser zoom, pan around a magnified viewport, or use a high-contrast theme. Each approach can expose different barriers:

- When someone increases browser zoom, does the form reflow so they can still reach the Save button, or does it end up hidden behind a fixed toolbar?
- When someone using screen magnification selects Save, does the confirmation appear where they’re looking, or in another part of the screen they can’t see?
- In a high-contrast theme, can someone tell which fields need correcting, or do the error indicators disappear?

The answers to these questions help us understand whether someone can use what we’ve built under the conditions in which they need to use it. ACT helps teams ask those questions and investigate the answers.

## Better questions, earlier

The toolkit combines access considerations and interaction patterns with usability heuristics, evaluation methodology, and references to accessibility standards. People can read the Markdown directly; agents and evaluation pipelines can use the generated YAML.

We’re integrating this guidance into our own AI-assisted design, development, and testing workflows. Our goal is to inform decisions while there’s still an opportunity to change them.

But let’s be clear about the **limits of this guidance**:

1. It doesn’t replace co-design or testing with people with disabilities.
2. It doesn’t establish compliance with accessibility standards.
3. Potential issues still need human review to determine whether the evidence supports a finding.

An evaluation that doesn’t find issues hasn’t proved the experience is accessible. It may just not have found the barriers.

## Help us find what’s missing

We’re open-sourcing this resource so its guidance can be examined and improved. We welcome your feedback—including questions about its assumptions and examples of where it falls short.

If you’re a person with a disability, an accessibility practitioner, or both, I’d especially welcome your perspective.

<hr>

[Explore the Accessibility Considerations Toolkit](https://aka.ms/A11yConsiderations) and try bringing it into your own design, development, or evaluation process. Does it help you ask better questions? Uncover a barrier you might have missed? Where does it fall short? Please share what you learn so we can improve the guidance together.

Our goal isn’t just to get teams using the toolkit—it’s to help them build things more people can use.
