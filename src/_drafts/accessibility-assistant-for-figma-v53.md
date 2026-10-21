---
title: "Accessibility Assistant for Figma v53: From Design Decisions to Handoff"
date: 2026-10-20 00:00:00 +00:00
comments: true
permalink: false
eleventyExcludeFromCollections: true
tags: ["accessibility", "design", "inclusive design", "Microsoft", "user experience", "WAI-ARIA"]
description: "Accessibility Assistant for Figma v53 brings annotations, assessments, issues, and accessibility specs together in projects."
twitter_text: "Accessibility Assistant for Figma v53 connects annotation, assessment, issue tracking, and handoff in a project-based workflow."
---

In an internal analysis of accessibility bugs, a colleague found that roughly half could be traced back to design decisions. These were issues we should have caught earlier, before someone codified them in code and ages before anyone encountered them in a shipped product.

That finding is a big part of why I started working on [Accessibility Assistant for Figma](https://www.figma.com/community/plugin/731310036968334777/accessibility-assistant). I wanted to help designers catch issues while they were still designing and help them build their accessibility knowledge along the way. Version 53 brings more of that work together, organizing annotations, assessments, issues, and handoff around projects.

<!-- more -->

In [my previous post](/notebook/accessibility-assistant-for-figma-v52/), I talked about the foundational work we were doing: moving to Figma-native Dev Mode annotations, simplifying annotation management, and making the plugin sturdier. This release builds on that foundation and offers a clearer path to "ready."

## Make the experience explicit

Consider a `dialog`. Often, there’s a “close” button in the upper corner. Reading top to bottom, that would logically be the first interactive element you’d encounter. But is that the first element that should receive keyboard focus when the dialog opens?

Perhaps. But if someone has opened a dialog to complete a task, directing them to the “close” button can feel a bit like opening your front door to greet a visitor and skipping right past the pleasentries to ask them if they’d like you to shut it again.

Where they should start depends on the function of the dialog. If someone opened it to fill out a short form, their attention is best drawn to the first field. If they’re reading something, letting them naturally move to that content is ideal. If someone is confirming an irreversible action, they may benefit from focus starting at the least destructive option.[^dialog]

[^dialog]: The [ARIA Authoring Practices Guide’s dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) walks through these considerations.

Initial focus and the order people move through controls are related, but they aren’t the same decision. We also need to decide how the dialog is named, how someone dismisses it, and so on. A picture of a user interface doesn’t communicate any of that.

These are user experience decisions that have a profound effect on the accessibility of a UI. Thinking about them through a disability lens helps us describe an experience that doesn’t depend on someone seeing the whole screen or using a mouse. Recording that intent using annotations gives the people implementing the design something more useful than guesswork.

## Keep the work organzed

Many of the teams I’ve worked with use a single Figma file for any number of features.In previous versions of Accessibility Assistant for Figma (and A11y Focus Order before it), you could create sets of annotations and conduct an assessment of your project’s accessibility, but those activites were disconncted and frequently tied to a page within the Figma file.

That’s not how everyone works, but it also isn’t helpful when trying to remember whether the accessibility checklist you created actually applies to the entire UI or justa. single screen.

In v53, we’ve organized the entire experience around “projects.” You can choose to create projects at the page level (the default) or you can build a project around a single screen or multiple screens within a page. You can also name the project, set its target platform (e.g., web or iOS), identify the design system being used, and even note if it’s connected to work happening outside of Figma, such as a GitHub Issue. Each project supports multiple annotation sets, has its own, distinct assessment progress, and allows you to track any issues you uncover in one location.

When you first use the new workflow, the plugin gathers existing Dev Mode annotations, checklists, and issues into an Imported project so you don’t need to start over. But you can scrap that and start over if you like. If you open a file with legacy (non-Dev Mode) annotations, we leave those alone and don’t import them.

We now support a larger set of target platforms: Web, Android, iOS, macOS, Windows Win32, Windows WinUI 3, and Windows WPF. These flow down into the annotations that are available to you within a project. That context matters, because controls don’t all behave the same way and keyboard navigation conventions differ. We’ve also improved focus-order calculations to account for platform-specific focusable roles, focusable children, and controls that use arrow keys or internal navigation.

In the updated UI, we enable you to visualize the focus order of an annotation set directly on the canvas while editing it. That gives you a way to inspect the intended sequence alongside the design, rather than trying to hold the whole thing in your head.

## Review, learn, and follow through

We’ve reorganized the assessment checklists around the four [Web Content Accessibility Guidelines principles](https://www.w3.org/WAI/WCAG22/Understanding/intro#understanding-the-four-principles-of-accessibility): Perceivable, Operable, Understandable, and Robust (POUR). We’ve also rewritten the review guidance to support the decisions designers need to make.

New, automated checks can flag concerns with contrast, target size, text resizing, reflow, and images of text. New canvas tools also support reviews of Focus Order, Reflow and Resize Text, and Use of Color to help designers make more informed decisions. Those checks are useful prompts for analysis, but aren’t proof that a design is accessible. A greyscale view, for instance, can help you spot information conveyed only through color; it can’t tell you whether someone understands what an error message is asking them to do. Designers still need to exercise judgment and should involve people with disabilities in feature planning.

When a designer (or one of our audotmated checks) finds an issue, it can br tracked in the new Issues feature. This makes it easy for designers to log their findings along the way and then circle back to that work or delegate it to others. When there are issues to be resolved, they show up on the Project overview screen as well, reminding designers they need to be fixed before the project is considered ready.

## Give the next person something useful

Another new feature enables designers to download an accessibility spec as HTML or copy it as Markdown.

That artifact can be useful for handoff to an engineer who needs to understand how to build the UI, but it’s also useful for conducting reviews with accessibility specialists and for writers to reference when writing documentation. We’ve also had really good results handing them off to CodeGen AI models to help with UI creation and debugging.

I [discussed some of our early experiments with that last use at Microsoft Build](/notebook/can-your-ai-pass-the-accessibility-test/). The spec gives us a way to carry accessibility intent beyond the design file, whether the next person doing the work is writing code themselves or directing an agent.

## A few more improvements

We included a lot of everyday improvements in this release too:

* You can now resize the plugin within supported limits, and it remembers your preferred size.
* The accessibility of the plugin itself was improved by adding settings for color scheme, text size, and control size preferences. By default, the plugin will adapt to your system’s color scheme or the one you’ve set for Figma.
* Keyboard navigation, focus treatment, semantics, announcements, contrast, non-color cues, and reduced-motion support are more consistent across the plugin now.
* Large operations, including duplicating annotated pages, stay more responsive. Imports do a better job of preventing duplicates and repairing inconsistent artifacts.
* Deleting annotated canvas items and switching pages clean up dangling annotation records more reliably.

One limitation to know about: if you delete a project’s scoped page, the project remains stored in the file but can’t accept new annotations. We did this to avoid data loss, but it’s something to be aware of. Designers can still delete the disconnected project to keep the plugin tidy though.

---

My thanks to Divyanshu Dwivedi, Ashish Singh, and Ganji Srikanth from HCL, and Anna Cook, Michael Fairchild, Scott O’Hara, David Snow, and Ben Truelove from Microsoft. Some of the people who helped get us here have since retired, including David and Ben; I’m grateful for the care and accessibility knowledge they brought to this work.

If you [give v53 a try](https://www.figma.com/community/plugin/731310036968334777/accessibility-assistant), I’d love to hear where it helps you make a better design decision—and where you still need more support.
