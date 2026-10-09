---
title: "Improvements to the Web for AI Should Benefit All Users"
date: 2026-10-09 16:44:38 +00:00
comments: true
tags: ["accessibility", "AI/ML", "web standards", "ARIA"]
description: "Apple’s WebKit team opposed a separate semantic layer for AI agents, echoing concerns I’d raised when I first learned about WebMCP."
twitter_text: "If we improve the web for AI agents, we should begin with the semantics authors already provide for people—not create a parallel layer that can leave them behind."
in_reply_to: https://github.com/WebKit/standards-positions/issues/670#issuecomment-4608432694
via:
  name: "Jason Grigsby"
  url: "https://cloudfour.com/thinks/improvements-to-web-for-ai-should-benefit-all-users/"
---

Apple’s WebKit team recently [opposed the WebMCP proposal](https://github.com/WebKit/standards-positions/issues/670#issuecomment-4608432694), arguing that it creates a separate semantic layer for agents when we should instead improve the shared layers people, assistive technology, and agents already use. [Jason Grigsby’s post](https://cloudfour.com/thinks/improvements-to-web-for-ai-should-benefit-all-users/) led me to Apple’s comment, and I share the concerns raised in both. In fact, I’d made a similar case over email back in April, when I first learned about [WebMCP](https://developer.chrome.com/docs/ai/webmcp).

<!-- more -->

Apple’s WebKit team put the heart of the issue plainly:

<blockquote cite="https://github.com/WebKit/standards-positions/issues/670#issuecomment-4608432694">

Although browser-integrated agents could struggle to act on interfaces built for humans, we do not think a parallel agent-facing tool layer is the right solution. When a site’s actions are hard for an agent to use, that is a gap in the page’s own semantics, and the fix, in our opinion, is to close it in the platform’s shared layers (HTML and ARIA), where the user, assistive technology, and agents all benefit.

</blockquote>

That echoes what I proposed in April. Many of the declarative attributes being discussed for WebMCP duplicate info that’s already available in the markup. I suggested letting a developer opt a form in, then having the browser gather its labels, descriptions, and other details from what’s already there.

Browsers already derive a great deal of useful info from a well-built interface: labels, descriptions, relationships, states, and more. If we’ve done the work to make a form understandable and operable for people—including people using assistive technology—exposing that form to an agent should build on that work, not require us to encode the same info a second time for a “new” audience. What happened to [the DRY principle](https://en.wikipedia.org/wiki/Don't_repeat_yourself)?

What I’d like to see us do is…

1. Write the labels, descriptions, and other semantics for the people using the interface.
2. Let the browser draw from that existing info by default when exposing the UI to an agent.
3. If the agent genuinely needs more specificity, provide a narrowly scoped, agent-specific override.

That last bit matters because a label or description written for a person might not give an agent enough info to interact reliably. An override should be an option of last resort, but there needs to be a path for supplying agent-specific instructions when the human-facing ones don’t suffice. It should be an _enhancement_, though, not a requirement.

Building on existing semantics would place less of a burden on authors and reinforce accessibility best practices. It would also reduce the likelihood that a control ends up with one description for people and another for agents—and that the two fall out of sync. The risk here is that a parallel semantic layer would lead some developers to lavish attention on agents while neglecting the people who also need to use their sites.

We should push incentives in the other direction: Writing accessible HTML should light up as much agentic functionality as possible. That would reinforce accessible authoring rather than undermine it.

There are broader opportunities here, too. I’m particularly interested in how agent capabilities could connect to web app technologies such as [shortcuts](https://www.w3.org/TR/appmanifest/#shortcuts-member) and [share targets](https://w3c.github.io/web-share-target/). I’m also curious about the role [Service Workers](https://github.com/webmachinelearning/webmcp/blob/main/docs/service-workers.md) might play in this new era.

Those opportunities come with broader risks, of course. WebKit is right to call out the importance of consent, security, and human oversight when agents can invoke tools that act within authenticated sessions—especially in the background, with no open tab and no person present. These web platform technologies may prove useful for agents, but we’ll need to approach them carefully.

In his post, Jason connects WebKit’s position to the [W3C’s Priority of Constituencies](https://www.w3.org/TR/design-principles/#priority-of-constituencies), which is the right way to frame this. [His discussion](https://cloudfour.com/thinks/improvements-to-web-for-ai-should-benefit-all-users/) is worth reading in full. Wherever agents eventually fit into that order, they shouldn’t leapfrog the people on whose behalf they’re meant to act.
