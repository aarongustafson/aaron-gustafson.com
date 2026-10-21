---
title: "Config Proposal: Accessibility Decisions Belong in Design"
permalink: false
eleventyExcludeFromCollections: true
---

# Config proposal working draft

Submission form: <https://docs.google.com/forms/d/e/1FAIpQLScT24VG0O3bKKRk0A7L_SaB3HISzSWNwiT93Ok41KyFZqm0mA/viewform>

The public-facing fields below are separate from the planning notes and pitch script. The submission requires a description of no more than 600 characters and a video of no more than three minutes; no title length limit has been confirmed. The full description is preserved below, followed by a shorter version for the form. Nothing has been submitted.

## Talk title

Accessibility Decisions Belong in Design

### Alternative titles

* Before the Handoff: Designing the Accessible Experience
* What Your Mockup Doesn’t Say About Accessibility

## Talk description

When our team traced accessibility bugs in production back to their origins, roughly half came from design decisions. Catching those issues earlier means fewer barriers for people with disabilities—and less rework for everyone building the product.

Consider a dialog: where should keyboard focus land when it opens? How is it named? Where does focus return when it closes? A polished mockup can leave each of those questions unanswered.

In this practical session, Aaron Gustafson will walk through a design using Accessibility Assistant for Figma to make interaction intent explicit, review potential barriers, and document decisions for implementation. You’ll learn how to examine a design through a disability lens, combine automated checks with human judgment, and create an accessibility spec that supports specialist review, documentation, and handoff to human or agentic engineers.

You’ll leave with a repeatable design-review workflow and concrete questions to bring to your next critique. The aim isn’t to turn every designer into an accessibility specialist; it’s to help teams make better-informed decisions while those decisions are still easier to change.

## Short talk description (600-character limit)

Roughly half the accessibility bugs our team traced in production originated in design decisions. What could we catch before handoff? Aaron Gustafson will use Accessibility Assistant for Figma to show how to examine designs through a disability lens, make interaction intent explicit, and create an accessibility spec for specialist review and human or agentic engineers. You’ll leave with a repeatable review workflow that combines automated checks with human judgment, helping you prevent barriers and reduce rework while decisions are still easier to change.

Character count, including spaces: **561**.

## Supporting links

* [Accessibility Assistant for Figma](https://www.figma.com/community/plugin/731310036968334777/accessibility-assistant): the plugin used for the practical walkthrough.
* [Accessibility Assistant for Figma v52](https://www.aaron-gustafson.com/notebook/accessibility-assistant-for-figma-v52/): background on the annotation workflow and foundational improvements.
* [Can Your AI Pass the Accessibility Test?](https://www.aaron-gustafson.com/notebook/can-your-ai-pass-the-accessibility-test/): Microsoft Build 2026 session transcript, including design-time accessibility and early experiments with spec-driven agentic implementation.

Add the v53 post’s public URL only after publication.

## Links to past talks

* [Designing with Empathy—recording](https://www.youtube.com/watch?v=mj5sKRllwHM): a solo talk on designing with people’s varied capabilities and circumstances in mind. [Talk details](https://www.aaron-gustafson.com/speaking-engagements/designing-with-empathy/).
* [Fixing Accessibility After the Fact Is Too Late—recording](https://www.youtube.com/watch?v=1FRbEqzzfYw): Ability Summit 2026 panel moderated by Aaron, on preventing accessibility defects earlier in the development process. [Talk details and transcript link](https://www.aaron-gustafson.com/speaking-engagements/fixing-accessibility-after-the-fact-is-too-late/).
* [Can Your AI Pass the Accessibility Test?—slides](https://presentations.aaron-gustafson.com/TOk1Mh/can-your-ai-pass-the-accessibility-test): Microsoft Build 2026 session with Jessie Lorenz and Carie Fisher. [Session details](https://www.aaron-gustafson.com/speaking-engagements/can-your-ai-pass-the-accessibility-test/). This link is a slide deck, not a recording.

## Video submission script

Aim for a finished video around 2:40–2:50, leaving room below the three-minute maximum. Timing is a rehearsal target, not a measured recording. Speak the paragraphs below; bracketed cues are production directions.

### 0:00–0:35 — On camera

Hi, I’m Aaron Gustafson. I work in Microsoft Accessibility Engineering, and I’ve been working on Accessibility Assistant for Figma.

When we looked at the accessibility bugs we were finding in production, roughly half traced back to design decisions. We were finding them after people had already encountered the barriers.

I want to help designers catch those issues earlier, while also building their accessibility knowledge.

### 0:35–1:15 — Show the dialog design

[Show a prepared dialog with a heading, close button, and two labeled form fields. Keep the canvas and annotations large enough to read.]

Take this dialog. The close button is up here, but should it be the first thing you encounter when the dialog opens?

That can feel like opening your front door to say hello and immediately asking your visitor if they’d like you to shut it again.

For this short form, we’ll start in the first field. A longer explanation might need focus on the heading instead. That initial placement is a separate decision from the order you move through the controls.

### 1:15–2:05 — Show the annotated experience and spec

[Open the prepared annotation set and show its focus-order visualization. Point out the dialog’s name and the documented requirements for initial focus and focus return. Copy the Markdown spec and show the prepared destination. Don’t narrate every click.]

Here, we’ve named the dialog, made the navigation order explicit, and documented where focus should go when it opens and closes.

These are design decisions. The annotations describe the intended experience; we still need to test the working implementation.

And this accessibility spec can travel with the design: to an accessibility specialist for review, to a documentation writer, or to an engineer—whether they’re writing the code themselves or working with an agent.

### 2:05–2:40 — Back on camera

At Config, I’ll walk through how to review a design through a disability lens, use automated checks without mistaking them for a complete assessment, and carry that intent into implementation.

We’ll also look at why waiting creates more rework: a change to a design can become a change to code, tests, and documentation once the product is built.

You’ll leave with a repeatable review workflow and questions you can use in your next design critique. I’d love to share this with the Config community.

## Session planning notes—not submission copy

### Audience and approach

Product designers, design-system practitioners, and design leads. A practical talk with a focused plugin demonstration, not a tour of every v53 feature. Session duration remains unconfirmed.

### Suggested flow

1. **Why this work started.** The team’s finding about production bugs, what it prompted Aaron to change, and the opportunity for designers to prevent barriers.
2. **What a mockup leaves open.** Walk through a clearly illustrative dialog: accessible name, initial focus, tab sequence, dismissal, and focus return. Consider keyboard and screen-reader use without treating either as a proxy for every disability.
3. **A repeatable review.** Scope a project, annotate the intended experience, review it using the Perceivable, Operable, Understandable, and Robust principles, and track a concern through resolution. Distinguish automated findings from decisions that need human judgment.
4. **Carry the decisions forward.** Export the spec for specialist review, engineering, and documentation. Mention agentic handoff as one use, not the reason to document intent.
5. **Show the cost of waiting.** Follow one missed decision from design through implementation, testing, release, and remediation. Explain the accumulating work without inventing a multiplier or presenting an illustrative curve as measured data.
6. **Close with a usable practice.** Bring interaction requirements into design critiques, record unresolved questions, and verify the experience with people with disabilities and in the implemented product.

### Demo and recording preparation

* Prepare one Web-scoped project and a small dialog example in advance; avoid spending pitch time configuring the plugin.
* Use an ordinary, non-destructive form so starting in the first field has a clear rationale. Keep the close control reachable and the navigation sequence logical.
* Verify how v53 records initial focus and focus-return requirements. Use the appropriate annotation or description fields; don’t imply the focus-order visualization alone expresses either requirement.
* Show annotations as design intent, not as a working keyboard or screen-reader demonstration of the Figma canvas.
* Use a prepared spec destination. Confirm the exported artifact includes the requirements being discussed before recording.
* Keep the cursor movement deliberate, describe the important visual changes aloud, and provide accurate captions.
* Rehearse and measure the entire video, including pauses, transitions, and demo actions. Cut material rather than speeding up if it approaches three minutes.

### Items to confirm before publication or submission

* Confirm that the internal “roughly half” observation is cleared for public use, and whether its scope or review period should be named. It is not an industry-wide statistic.
* If we use an exponential cost-of-change curve, supply the source and define what it measures. The current copy describes accumulating rework without claiming a measured exponential relationship.
* Confirm David’s surname and preferred credit for the companion v53 post. The other named contributors come from the v52 post; retirement details come from Aaron.
* Confirm the conference year, session duration, and any title length limit. The description limit is 600 characters.
* Check the linked recordings before choosing the final past-talk links. The Build link currently supplies slides and a transcript, not a verified recording.
* Consider adding a screenshot to the v53 post showing the project overview or focus-order review once a suitable image is available.
