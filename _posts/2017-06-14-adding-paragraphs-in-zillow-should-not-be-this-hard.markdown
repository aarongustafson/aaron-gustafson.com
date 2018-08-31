---
layout: post
title: "Adding Paragraphs in Zillow Should Not be This Hard"
date: 2017-06-14 20:20:07 -0400
comments: true
tags: [forms, "web development"]
description: "Paragraphs serve as a distinct piece of writing. They generally encapsulate one idea or series of related ones. The space between them also gives your eyes a moment to rest and your brain a moment to process what you just read. Without them, text is just one big jumble."
crosspost_to_medium: true
---

Kelly and I are in the process of [selling our (beautiful) home](https://www.zillow.com/homedetails/1115-Hanover-St-Chattanooga-TN-37405/41420955_zpid/?fullpage=true) and I have been amazed at how difficult it’s been for our agents to break up the listing description into paragraphs, especially on [Zillow](https://www.zillow.com). After a ton of trial and error—after all, I wasn’t gonna let poor software design trump readability—I found a solution.

> TLDR; Insert a blank line between the paragraphs and put "  " (that’s a space followed by a tab) on that line.

<!-- more -->

_Note: I wouldn’t normally blog about something like this. My preference would have been to leave a comment on [the Zillow Questions thread on this topic](https://www.zillow.com/advice-thread/How-to-add-line-breaks-or-paragraph-separation-in-home-description/506436/), but [that forum has been shut down](https://www.zillow.com/advice-thread/Zillow-Advice-is-Shutting-Down/699188/). I wanted to make sure other people would be able to find and use this solution._

## The Problem

On Zillow (and many other real estate and other sites), you are only given a standard `textarea` to enter a description. Ignoring the fact that they hard-code it to be 78px high, I’m cool with that. The problem is that their field does not respect hard or soft returns and reduces them to a single line break.

This has been [the subject of much consternation within the Zillow community](https://www.zillow.com/advice-thread/How-to-add-line-breaks-or-paragraph-separation-in-home-description/506436/) and the source of a lot of cludgey "workarounds" like putting single underscores on otherwise empty lines just to get some semblance of paragraph-level separation. Blech!

## Why is This a Big Deal?

Paragraphs serve as a distinct piece of writing. They generally encapsulate one idea or series of related ones. The space between them also gives your eyes a moment to rest and your brain a moment to process what you just read. Without them, text is just one big jumble.

Here’s an excerpt from our home’s description without the paragraph separation:

> Welcome to quintessential Northshore living! This 3 bedroom, 2 and a half bathroom home features beautifully restored original built-ins, wood trim, wavy glass windows, and vintage light fixtures throughout. Open and spacious, this craftsman bungalow lets you live with the comfort of new construction amenities while still enjoying the quality craftsmanship and elegance rarely found in newer homes. The main floor features large dining and living areas meant for entertaining, complete with a two-story private deck. The second floor is designed for family, with a spacious master suite and relaxing spa bathroom. The additional second floor bedrooms provide room for a growing family or visiting guests, and unlike many period homes, this house also has ample storage in both built-ins and closets. The second full bathroom features a clawfoot tub and shower, as well as a convenient and discrete laundry closet.

That’s rough. Broken up, it flows much better:

> Welcome to quintessential Northshore living! This 3 bedroom, 2 and a half bathroom home features beautifully restored original built-ins, wood trim, wavy glass windows, and vintage light fixtures throughout. Open and spacious, this craftsman bungalow lets you live with the comfort of new construction amenities while still enjoying the quality craftsmanship and elegance rarely found in newer homes.

> The main floor features large dining and living areas meant for entertaining, complete with a two-story private deck. The second floor is designed for family, with a spacious master suite and relaxing spa bathroom. The additional second floor bedrooms provide room for a growing family or visiting guests, and unlike many period homes, this house also has ample storage in both built-ins and closets. The second full bathroom features a clawfoot tub and shower, as well as a convenient and discrete laundry closet.

Expand that to the full description (around 440 words) and you quickly realize how much paragraphs matter.

## Coming up With a Solution

Having seen the forum discussions, I already knew inserting `br` elements was out. The field treated the element as text and would literally display "&lt;br&gt;" on the page. No dice.

One enterprising user discovered that an underscore on a blank line worked. The underscore was visible, sure, but it didn’t bother her. It did, however, bother me. So I opted to riff on her idea and test every invisible character I knew. There are a bunch of them. Here are a small selection:

* space,
* non-breaking space,
* tab,
* em-space,
* en-space,
* thin space,
* zero-width space,
* etc.

Sadly, on their own, none of these seemed to work (despite one user having luck with a single space a few years back). The system must be doing some basic sanitization on the back-end to remove white space. Knowing this, I began to play around with combinations, hoping to trip it up. Finally I discovered that a <kbd>space</kbd> followed by a <kbd>tab</kbd> worked reliably.

As <kbd>tab</kbd> is not easily typed in forms (browsers will move focus to the next field), I offer the two characters in this code block for your copy and paste pleasure, should you ever need it:

```
  
```

I honestly hope Zillow fixes their form at some point, but given that this has been a request for more than three years, I don’t think it’s likely to get fixed any time soon. Fingers crossed they’ll get to it one day. And while they’re at it, maybe they can make the texture a little taller too. Or at least give us back the ability to resize it.