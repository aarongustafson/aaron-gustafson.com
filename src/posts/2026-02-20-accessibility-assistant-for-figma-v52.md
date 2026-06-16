---
title: "Accessibility Assistant for Figma v52"
date: 2026-02-20 23:27:28 +00:00
comments: true
tags: ["accessibility", "design", "inclusive design", "Microsoft", "user experience", "WAI-ARIA"]
description: "I just hit “publish” on Accessibility Assistant for Figma v52 and I wanted to share some details on why this is a monumental release for us."
twitter_text: "I just hit “publish” on Accessibility Assistant for Figma v52 and I wanted to share some details on why this is a monumental release for us."
---

I just hit “publish” on [Accessibility Assistant for Figma](https://www.figma.com/community/plugin/731310036968334777/accessibility-assistant) v52, and I wanted to share why this release matters so much to our team.

<!-- more -->

We’re in the middle of a major overhaul. To get there, we needed a lot of foundational infrastructure work to modernize the plugin and prepare for new features that help designers produce more accessible work, faster. This release includes a big chunk of that groundwork, notably:

* Annotations are now presented as Figma-native Dev Mode annotations; this greatly reduces the working overhead of the plugin and reduces visual clutter in the document. We’ve also color-coordinated the icons in the Annotation Set viewer to the labels you see in the Dev Mode annotations, making it easier to scan.
* Legacy annotation tables will automatically be migrated into the new system. The visual readout tables will be hidden when this happens, but are still accessible if you need to copy or reference them. We’ve also included a tool to clean up these old layers when you’re ready.
* Annotations are now managed in a single UI rather than split by focus-order impact. That means you no longer need to jump back and forth between tools to annotate designs correctly.
* We’ve organized and expanded the list of W3C roles available in the role picker. Additionally, the form now adapts to the role, offering you only the relevant fields and reducing distraction. We also added a description field, should you need it.

We also fixed duplication bugs. You can now copy layers and keep their annotations as a new Annotation Set. Similarly, duplicating pages now regenerates page-bound annotations automatically. On especially large pages, that regeneration may take a little time.

This release has been a long time coming, and I’m incredibly proud of the team behind it, especially Ashish Singh from HCL, and Michael Fairchild, Scott O’Hara, and Ben Truelove from Microsoft. Their care, and their depth of accessibility knowledge, has been instrumental in getting this project to where it is today.

And there’s more to come!