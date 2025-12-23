---
title: "Lessons in Averaging"
date: 2016-12-14 13:01:32 -05:00
comments: true
tags:
  [
    "progressive enhancement",
    design,
    "web design",
    "user experience",
    accessibility,
  ]
description: "We look at averages all the time in our work. Some, like average Time To Interactive (TTI) for instance, are useful measurements that allow us to improve our work; others, like the “average” user are decidedly less so."
crossposted:
  Medium: https://medium.com/@AaronGustafson/80018015fc4f
---

In the work that we do on the Web (as well as in our daily lives), we’re often confronted, informed, or judged based on averages. I never really stopped to think about it, beyond being bugged by the fact that averages aren’t truly representative of reality. Then I listened to [99% Invisible’s episode "On Average"](http://99percentinvisible.org/episode/on-average/). It was incredibly enlightening and the stories shared in that episode provide sage wisdom that is very relevant to the work that we do.

<!-- more -->

Do you know where our fascination with averages began? It all started with Adolphe Quételet, a Belgian mathematician and astronomer:

> In the 1830s, astronomers were some of the only people that regularly calculated averages, since early telescopes were extremely imprecise. To obtain more accurate data for say, tracking the orbits of planets, astronomers would take multiple measurements (all of which were slightly different) add them together, then divide by the number of observations to get a better approximation of the true value.

Quetelet decided to apply this tool to people, starting with Scottish soldiers’ chest sizes. Turns out the average chest size of a Scottish soldier in the 1830s was 39.75 inches. File that one away for Pub Trivia.

Quetelet believed that the average was the "true" size of something… something that we should strive for or that nature would attempt to create. The [Platonic ideal](https://en.wikipedia.org/wiki/Platonic_idealism) if you will:

> In Quetelet’s mind, human averages had a certain moral mandate. By his logic, if everyone were optimally fed and lived under the same environmental conditions, they would be average. And this is what society should be striving for: the continual improvement of the average of the group.

We look at averages all the time in our work. Some, like average [Time To Interactive (TTI)](https://developers.google.com/web/tools/lighthouse/audits/time-to-interactive), are useful measurements that allow us to improve our work; others, like the "average" user are decidedly less so. <span data-quotable>The "average" person (or dog or flower) is a myth. Everyone and everything is unique to some equally unique degree.</span> [Even mass-produced objects have variance](https://en.wikipedia.org/wiki/Factory_second).

Designing for the "average" user is incredibly problematic. The episode I mentioned captured this perfectly in a story about the U.S. Army’s design of airplane cockpits:

> [I]n 1926, when the Army designed its first airplane cockpit, they measured the physical dimensions of male pilots and calculated the average measurement of their height, weight, arm-length and other dimensions.

> The results determined the size and shape of the seat, the distance to the pedals and the stick, and even the shape of the flight helmets. This mean that, in part, pilots were selected based on their ability to fit into the cockpit designed for the average 1920s man.

> This worked more or less up until World War II, when the Army began recruiting hundreds of new pilots to expand its air forces (which became a separate branch of the military in 1947). But with the birth and expansion of the Air Force came a decline in performance and a rash of deaths. Even with no war, pilots continued to die during training, as they were unable to control their planes.

> The high death rate in the Air Force was a mystery for many years, but after blaming the pilots and their training programs, the military finally realized that the cockpit itself was to blame, that it didn’t actually fit most pilots.

In 1950, the Air Force sent Gilbert S. Daniels out to collect ten measurements from thousands of airmen—yes, they were all men at the time—across the U.S. in order to establish a new average. After collecting the data, Daniels got curious and decided to see how many of the airmen he measured hit the average on all ten measurements. Not a single one. How about three of the measurements? Less than five percent. He realized that <span data-quotable>in designing for an average, they were, in fact, designing for no one.</span> Based on this discovery, the Air Force commissioned new equipment that including features like adjustable foot pedals, helmet straps, flight suits, and seats. And, wonder of wonders, pilot performance improved dramatically.

When we design, we need to be cognizant of the variety of human experience and plan accordingly. <span data-quotable>For our work to be successful, we need to accommodate the adjustments our users require for _them_ to be successful.</span> Responsive layouts, adaptive interfaces, support for assistive technologies… all of these approaches enable our work to go further by enabling it to be tailored to the permanent, temporary, and/or situational needs of our users.

All of this is to say, this episode made me an even more ardent believer in the idea of [progressive enhancement](http://alistapart.com/article/understandingprogressiveenhancement) and the continuum of experience it enables. You should go listen to it now, I promise there’s more to the story.
