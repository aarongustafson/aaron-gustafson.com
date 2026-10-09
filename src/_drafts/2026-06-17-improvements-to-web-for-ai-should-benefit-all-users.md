---
title: "Improvements to the Web for AI Should Benefit All Users"
date: 2026-06-17 10:00:00 +00:00
comments: true
tags: ["accessibility", "AI/ML", "web standards", "ARIA"]
description: "Apple’s WebKit team opposed a separate semantic layer for AI agents, echoing concerns I’d raised when I first learned about WebMCP."
twitter_text: "If we improve the web for AI agents, we should begin with the semantics authors already provide for people—not create a parallel layer that can leave them behind."
in_reply_to: https://github.com/WebKit/standards-positions/issues/670#issuecomment-4608432694
via:
  name: "Jason Grigsby"
  url: "https://cloudfour.com/thinks/improvements-to-web-for-ai-should-benefit-all-users/"
---

Apple’s WebKit team recently [opposed the WebMCP proposal](https://github.com/WebKit/standards-positions/issues/670#issuecomment-4608432694), arguing that it creates a separate semantic layer for agents when we should be improving the shared layers people, assistive technology, and agents already use. [Jason Grigsby’s post](https://cloudfour.com/thinks/improvements-to-web-for-ai-should-benefit-all-users/) led me to Apple’s comment, but the concern itself was familiar: I’d made a similar case over email back in April, when I first learned about the proposal for [WebMCP](https://developer.chrome.com/docs/ai/webmcp).

<!-- more -->

Apple’s WebKit team put the heart of the issue plainly:

<blockquote cite="https://github.com/WebKit/standards-positions/issues/670#issuecomment-4608432694">

Although browser-integrated agents could struggle to act on interfaces built for humans, we do not think a parallel agent-facing tool layer is the right solution. When a site’s actions are hard for an agent to use, that is a gap in the page’s own semantics, and the fix, in our opinion, is to close it in the platform’s shared layers (HTML and ARIA), where the user, assistive technology, and agents all benefit.

</blockquote>

That echoes what I proposed in April. Many of the declarative attributes being discussed for WebMCP mirror semantics already available in markup. My suggestion was to let a developer opt a form in, then gather its labels, descriptions, and other details from the information already available.

Browsers already derive a great deal of useful information from a well-built interface: labels, descriptions, relationships, states, and more. If we’ve already done the work to make a form understandable and operable for people—including people using assistive technology—exposing that form to an agent should build on that work, not require us to re-encode the same information a second time for a “new” audience. What happened to [the DRY principal](https://en.wikipedia.org/wiki/Don't_repeat_yourself)?

What I’d like to see us do is…

1. Write the label, description, and other semantics for the people using the interface.
2. Let the agent draw from that existing information by default.
3. If the agent genuinely needs more specificity, provide a narrowly scoped, agent-specific override.

That last piece is needed because a label or description written for a human might not give an agent enough info to interact reliably. It should be an option of last resort, but there should be a path to supply agent-specific instructions when the human ones don’t suffice. It should be an _enhancement_, rather than a requirement.

Leveraging existing semantics also places a lower burden on authors and reinforces best practices with respect to accessibility. It also eliminates—or at least reduces—the liklihood a control will have one description for people and another for agents _and_ they fall out of sync. Even worse, creating a parallel semantic layer will likely lead to some developers lavishing attention on agents while neglecting the people who also need to use their sites.

We should incentivize folks to move in the other direction: Writing accessible HTML should light up as much agentic functionality as possible. This would reinforce accessible authoring rather than undermining it.

There are broader opportunities here too. I’m particularly interested in how agent capabilities could connect to [Web App Manifest](https://www.w3.org/TR/appmanifest/) features such as shortcuts and share targets. I’m also curious about the potential role for [Service Workers](https://github.com/webmachinelearning/webmcp/blob/main/docs/service-workers.md) in this new era. WebKit is right to call out the importance of consent, security, and human oversight of authenticated tools running in a headless environment though. All this said, PWA technologies may prove useful for agents if we approach them carefully.

Jason connects WebKit’s position to the [W3C’s Priority of Constituencies](https://www.w3.org/TR/design-principles/#priority-of-constituencies) which is the right way to frame this. [His discussion](https://cloudfour.com/thinks/improvements-to-web-for-ai-should-benefit-all-users/) is worth reading in full. Wherever agents eventually fit into that order, they shouldn’t leapfrog the people they’re meant to serve.
