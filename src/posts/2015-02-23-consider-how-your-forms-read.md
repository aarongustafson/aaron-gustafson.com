---
title: "Consider How Your Forms Read"
date: 2015-02-23 11:21:24 -05:00
comments: true
tags: ["web design", accessibility, forms, "inclusive design"]
description: "We need to remember that we are authoring interfaces that will be used by actual people. When we are creating forms that don’t require that kind of scientific rigor, we can (and should) do whatever we can to make the interaction more human."
---

While listening to [Radiolab’s "The Trust Engineers"](http://www.radiolab.org/story/trust-engineers/), I’ll admit I got a little excited when they started talking about web form performance. And no, not "performance" in the time-to-download sense, but "performance" in terms of how well the forms performed in attempting to capture meaningful, actionable data.

<!-- more -->

I’ll set the scene: It’s the holiday season in 2011 and people are uploading photos to Facebook like crazy. In the span of a few days, Facebook processed more photo uploads than are contained in the entirety of Flickr. Seriously, that’s a lot of photos.

Anyway, one unintended consequence of this deluge of photo uploads was a significant uptick in [photo reports](https://www.facebook.com/help/189722821075378). Facebook received millions of them, but they made no sense: Moms holding babies reported for harassment, pictures of puppies reported for hate speech, and so on. Roughly 97% of these photo reports were miscategorized.

When Facebook engineers reached out to some of the users who had reported these photos for a bit more background behind their decisions, they discovered that many of the reports were because users didn’t want the photo on Facebook reasons other than the options provided. In some cases it was because they didn’t like how they looked in the photo and in others it was because the photo was of an ex or even a beloved pet they shared with an ex.

The existing photo reporting form had not done a good job of accounting for these more personal reasons for wanting a photo removed, so the Facebook engineers went to work. They added a step that asked _How does this photo make you feel?_ The options were simple:

- Embarrassing
- Upsetting
- Saddening
- Bad Photo
- Other

The "other" option also provided a free-response field to fill in.

With this system in place, they found that 50% of reporters would choose one of the provided options. That was pretty helpful, but there was still a problem: 34% of the "other" respondents were writing "It’s embarrassing" in the blank rather than choosing the "embarrassing" option already provided.

What they realized was that people were not identifying with the "embarrassing" text (or may have even thought it was referring to them, rather than assuming the implied "It’s"). A subtle shift in language was needed, so they changed the label to _Please describe the photo_. And they updated the options to mirror how people actually talk:

- It’s embarrassing
- It’s a bad photo of me
- It makes me sad

With this subtle change, they were able to increase the percentage of photo reporters who chose one of the options provided to a whopping 78%.

Sometimes we feel compelled to create forms that are very clinical. In the survey world we’re often taught to limit the "personality" of our forms in order to avoid influencing the responses.

That said, we need to remember that we are authoring interfaces that will be used by actual people. When we are creating forms that don’t require that kind of scientific rigor, we can (and should) do whatever we can to make the interaction more human.

Ask real questions: _What’s your name?_, _What’s your email?_, and _How would you prefer we contact you?_ are far more friendly than _Name_, _Email_, and _Contact Preference_.

A little thoughtful consideration for the people who need to fill in your form goes a long way toward making them feel at ease and also helps to ensure the feedback you receive is accurate, valuable, and actionable.
