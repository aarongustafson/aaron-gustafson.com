---
title: "On CrowdStrike, dependencies, and building robust products on the web"
date: 2024-07-25 10:20:26 -07:00
comments: true
tags:
  [
    "progressive enhancement",
    "hazards",
    "CSS",
    "JavaScript",
    "web design",
    "web development",
  ]
description: "The CrowdStrike meltdown last week should be a cautionary tale for web designers and web developers."
twitter_text: "The #CrowdStrike meltdown last week should be a cautionary tale for #WebDesigners and #WebDevleopers."
---

I have no opinion on CrowdStrike as a company or service. I’ve never used their products. In fact, prior to [the incident last week](https://wikipedia.org/wiki/2024_CrowdStrike_incident), I had only a passing familiarity with their name — likely from headlines in the tech press I’d scrolled past at some point in time. I now have a vague understanding of what they do, but that’s only based on what I learned about [the cause of the incident](https://www.crowdstrike.com/wp-content/uploads/2024/07/CrowdStrike-PIR-Executive-Summary.pdf). In reflecting on this unfortunate incident, I can’t help but think of the lesson it holds for web designers and developers.

<!-- more -->

The incident was caused when a bug in CrowdStrike’s code made it out into production. The results were catastrophic: It caused roughly 8.5 million servers to crash. Hospitals weren’t able to serve the people that needed them. Airline passengers were stranded. People couldn’t access their money in banks. Folks in distress could not get the emergency services they needed. On top of that, the financial fallout is estimated to be somewhere around US$10 billion.

Bugs happen. I’d hate to be the person who was responsible for that particular bug (or the people in the quality assurance team that should have caught it), but the reality is that none of us who write code write _perfect_ code. We all make mistakes and sometimes those mistakes make it into production. Other times, the code we write works perfectly during development and testing, but causes an unexpected issue in production. Sometimes only in very specific "edge case" circumstances that we didn’t have the foresight to consider.

Which brings me to the lesson I took away from the CrowdStrike incident: minimize the impact dependencies can have on your customers’ ability to complete critical tasks. In other words, [develop dependency awareness](https://www.smashingmagazine.com/2016/05/developing-dependency-awareness/).

The web is a hostile operating environment. Sometimes network connections are slow to resolve or time out completely, which may cause issues with your JavaScript, may result in broken images or videos, or could make it so your user never receives your CSS. Sometimes 3rd party scripts ship bugs that can hose your site completely. Sometimes a customer’s browser plugin can wreak havoc on your site by adjusting markup or injecting code. If any (or all) of those things were to happen, could your customers still accomplish their key tasks? Could they even understand your site at all?

This is why it’s so critical to start with a fully-functional website that relies only on semantic, accessible HTML and regular ol’ links and form submissions. They aren’t sexy, but they’re solid. Then _progressively enhance_ that experience to improve things when the CSS is downloaded. And improve some more when your JavaScript executes properly. Build an awareness for the kinds of dependencies you have in your code so you can ensure there is always a fallback.

When I think about building robust websites like this, I often think of the Chrysler Imperial. The 1964-1966 model is one of the few cars that has been outright banned from entering demolition derby events. It is just too well built. It just takes the hits and keeps on driving. We should aspire to that kind of resilience in the websites we build.

Bugs happen. Can your site withstand them? Or will you let the failure of a single dependency (a.k.a., site fragility) ruin your customers’ day?

https://www.youtube.com/watch?v=-9GGDOUDLhc&start=7&end=17
