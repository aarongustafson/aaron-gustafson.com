---
title: "Optimizing Your Codebase for AI Coding Agents"
date: 2025-10-21 22:11:32 +00:00
comments: true
tags: ["AI/ML", "software development"]
description: "By looking at how a model reasons over a codebase to solve tasks, I found ways to help it — as well as the human engineers working in the same project — reduce wasted time."
twitter_text: ""
hero:
  src: /i/posts/2025-10-21/hero.jpg
  credit: "Aaron Gustafson × Designer"
  alt: "A cute red robot is adrift in a choppy, foggy sea. A lighthouse on a cliff in the distance is beaming light across the sea, creating a safe, clear path to a nearby shore. The robot is steering the boat toward shore, following the path through the fog created by the lighthouse. Vintage travel poster aesthetic."
  orientation: landscape
---

I’ve been playing around a bit with GitHub Copilot as an autonomous agent to help with software development. The results have been mixed, but positive overall. I made an interesting discovery when I took the time to read through the agent’s reasoning over a particular task. I thought the task was straightforward, but I was wrong. Watching the agent work was like watching someone try to navigate an unfamiliar room, in complete darkness, with furniture and Lego bricks scattered everywhere.

<!-- more -->

The good news? Most of the issues weren’t actually _code_ problems; they were organizational and documentation problems. The kinds of problems that make tasks hard for humans too.

As I watched the agent struggle, I realized that optimizing for AI agents is really just about removing ambiguity and making implicit knowledge explicit. In other words: it’s just good engineering.

## What did I learn?

After reviewing the agent’s execution logs (which read like a stream-of-consciousness diary of confusion), several patterns emerged:

### 1. **Documentation sprawl is an efficiency killer**

The agent spent roughly 40% of its time just trying to figure out which documentation to trust. We had instructions in workflow comments, the README, task specific instructions, and more. In other words, we had no clear source of truth. Pieces of that truth were scattered across multiple files and the docs were inconsistent and — in some cases — contradictory.

Sound familiar? It’s the equivalent of having five different “getting started” guides that all got written at different times by different people and nobody bothered to consolidate them. (If you’ve ever worked on a project that’s been around for more than a year with no one in charge of documentation, you know exactly what I’m talking about.)

**The fix:** Establish a single source of truth. Ruthlessly. We consolidated everything into one comprehensive guide and updated all references to point _only_ there. Deprecated docs were deleted and/or redirected, as appropriate. No more choose your own adventure. No more guessing.

### 2. **Agents won’t optimize themselves**

Here’s a fun one: the agent ran several full production builds—complete with image processing, template compilation… the whole shebang—just to validate a markdown file was in the right format. These builds took 30-60 seconds. _Each time._

This is like requiring someone to assemble an entire car just to check if the owner’s guide is displaying the right “check engine” symbol. Technically it works, but yikes.

**The fix:** Write fast, focused validation scripts. One tool for each job. Tell the agent what the utility is, where to find it, and how to use it. Give it explicit instructions to use utility scripts in lieu of full site builds whenever possible.

### 3. **Ambiguity breeds confusion (and wasted tokens)**

The agent spent 15+ minutes having an internal philosophical debate about whether to process test data. Should it reject it? Accept it? Create a placeholder? The instructions didn’t say, so the agent did what any of us would do: it agonized — or at least feigned agonizing — over the decision and tried to infer intent from context clues.

**The fix:** Be explicit about edge cases. We added a dedicated section for handling test form submissions. No more guessing.

## There’s a pattern here

If you squint, all of these issues share a common root cause: **implicit assumptions**.

We assumed humans would know to check one doc instead of five. We assumed the difference between validation and building was obvious. We assumed everyone would understand how to handle edge cases.

AI agents don‘t — can’t? — make those assumptions. They need explicit instructions, clear boundaries, and unambiguous inputs. Honestly? So do humans. We’re just better at muddling through — or think we are.

## Early results

After implementing these changes, we expect (and early testing confirms):

- ~40% reduction in processing time,
- ~75% reduction in token usage, and
- &gt;80% reduction in confusion and circular reasoning.

But here's the thing: these improvements don't just help the AI agent. They help _everyone_. The consolidated documentation is easier to navigate. The fast validation scripts are useful for humans too. The explicit edge case handling prevents future questions.

## The key to reducing toil: excellent docs and tools

Optimizing for AI agents isn't really about AI. It’s about removing ambiguity, eliminating redundancy, and making implicit knowledge explicit. It’s about writing code and documentation that doesn’t require a deep understanding of the project to comprehend.

In other words: it’s just good engineering.

So if you’re working with AI coding agents — or planning to — invest in your docs and tooling. Don’t think of it as wasted time “writing for robots.” Think of it as paying down documentation debt and building an efficient engineering process.

Your future self, your teammates, and the bots will thank you.

## Afterword

Interestingly, an AI agent was a particularly useful partner in finding and addressing the technical debt we’d been living with. Sometimes you need a pedantic robot to point out that your house is a mess.
