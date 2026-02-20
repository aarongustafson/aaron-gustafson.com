---
title: "Accessibility Assistant for Figma v52"
date: 2026-02-20 23:27:28 +00:00
comments: true
tags: ["accessibility", "design", "inclusive design", "Microsoft", "user experience", "WAI-ARIA"]
description: "I just hit “publish” on Accessibility Assistant for Figma v52 and I wanted to share some details on why this is a monumental release for us."
twitter_text: "I just hit “publish” on Accessibility Assistant for Figma v52 and I wanted to share some details on why this is a monumental release for us."
---

I just hit “publish” on [Accessibility Assistant for Figma](https://www.figma.com/community/plugin/731310036968334777/accessibility-assistant) v52 and I wanted to share some details on why this is a monumental release for us.

<!-- more -->

We’re in the process of a major overhaul to this plugin. There was a lot of infrastructural work to do to modernize the plugin and set the stage for a host of new features to make designers more productive when it comes to making their designs more accessible. This release incorporates a lot of that foundational work, notably:

* Annotations are now presented as Figma-native Dev Mode annotations; this greatly reduces the working overhead of the plugin and reduces visual clutter in the document. We’ve also color-coordinated the icons in the Annotation Set viewer to the labels you see in the Dev Mode annotations, making it easier to scan.
* Legacy annotation tables will automatically be migrated into the new system. The visual readout tables will be hidden when this happens, but are still accessible if you need to copy or reference them. We’ve also included a tool to clean up these old layers when you’re ready.
* Annotations are now managed in a single UI rather than being separated, based on whether they impact focus order. This means you don’t need to jump back & forth between tools to properly annotate your designs.
* We’ve organized and expanded the list of W3C roles available in the role picker. Additionally, the form now adapts to the role, offering you only the relevant fields and reducing distraction. We also added a description field, should you need it.

We also fixed bugs related to duplicating layers. You can now copy layers and the annotations will go along for the ride, becoming a new Annotation Set. Similarly, you can now duplicate pages and the annotations — which are page-bound — will be re-generated. It’s worth noting that this may take some time on particularly large pages.

This release has been a long time coming, but I’m incredibly proud of the team that’s been working so diligently on this, particularly Ashish Singh from HCL and Michael Fairchild, Scott O’Hara, and Ben Truelove from Microsoft. Their attention to detail and encyclopedic knowledge of accessibility has been instrumental in getting this project to the place that it is.

And there’s more to come!