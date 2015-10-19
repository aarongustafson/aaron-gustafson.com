---
layout: post
title: "Strapless"
date: 2015-10-16 17:13:37 -0400
comments: true
categories: ["web design",pranks]
description: "I wrote a silly little extension that stops Bootstrap dead in its tracks."
---

On Friday, [Kelly](https://twitter.com/ShirleyTemper) and I were having a conversation over lunch about the ubiquity of Bootstrap. It’s a topic we’ve been kvetching about for the the last few years—we’ve grown tired of seeing the same site everywhere we look.

<!-- more -->

It’s not that we have any issues with Bootstrap specifically. It’s a solid framework for rapidly prototyping an idea before deciding if it’s got legs. It’s also a great tool to learn from when considering your own pattern library. That said, we don’t think it should be used in the way it so often is: as the entirety of your front end design with only a teensiest amount of theming applied.

The reasons we aren’t big Bootstrap fans are manifold. [Steve Fisher](https://twitter.com/hellofisher), [Yesenia Perez-Cruz](https://twitter.com/yeseniaa), [Samantha Warren](https://twitter.com/samanthatoy) and I hashed out a bunch of them in our SXSW panel [“The Real Responsive Process?”](http://schedule.sxsw.com/2013/events/event_IAP137). Here are a few of the highlights:

1. **Bootstrap doesn’t solve your problems.** Design is problem solving. The design decisions made by the creators/maintainers of Bootstrap solve *their* problems, not *yours*. You may share some of those problems—a need for responsive layouts, for example—but not others. You need a system that is tailored to solve your problems and only you (and your team) know what those problems are. Have you ever tried on an article of clothing that’s "one size fits all"? How well did it fit your body type? Unless you are absolutely average in all respects, probably not all that well. Solve *your* problems with [*your own* Bootstrap-esque pattern library](http://daverupert.com/2013/04/responsive-deliverables/).
2. **Bootstrap offers more than you’ll need.** Bootstrap contains a lot of components and design patterns. It was created to address a wide array of project needs (“one size fits all”, see above). As such, there’s a lot of code in there. The defaults with some basic theming put you at a minimum of around 200KB for the CSS, JavaScript, and fonts (and that doesn’t include jQuery, which is also required). [Customizing your Bootstrap build can help](http://getbootstrap.com/customize/), but if you’re gonna use Bootstrap in production, you need to ruthlessly rip out anything you aren’t using. That takes time. And then you need to maintain your customized version of Bootstrap, making upgrading to new versions of the framework painful.
3. **Differentiating yourself from you competition is harder.** Bootstrap sites have a very common look to them. You can easily pick them out of a lineup and they are especially prolific within the startup space. If you’re trying to separate your company from the pack, having a site that looks just like every other startup (including your competition) is probably not a great idea. Spend some time (and, yes, money) creating a design that matches your brand and reflects who *you* are.

I’m not saying these things because I’m a Bootstrap hater. I’m not, I just think it’s a crutch for a lot of people and it’s led to an era of bland, look-alike design on the web I’d love to see us transcend.

In my conversation with Kelly, I jokingly said it would be funny to create a browser extension that removed Bootstrap’s CSS and JavaScript from any page that included it. Something subversive along the lines of [Eric Meyer’s hilariously destructive table layout and `font` demolishing user stylesheet](http://archive.oreilly.com/pub/a/network/2000/07/21/magazine/css_anarchist.html) or [Richard Harrington’s “disrupt” to ”bullshit” converter](https://github.com/richardharrington/disrupt-to-bullshit). On Friday I decided to see what I could throw together in 15 minutes and I dubbed the result “Strapless”. Using [Crossrider](https://crossrider.com/), I converted [some simple JavaScript](https://gist.github.com/aarongustafson/081d6e950c1f2cc57e22) into an extension for [Chrome](https://chrome.google.com/webstore/detail/strapless/ninnlimehlghihnalgelhhafbmhlhojg), [Firefox](http://crossrider.com/download/ff/79799), and [Internet Explorer](http://download.ourinfoonlinestack.com/installer/79799/0/0/0/0/setup.exe). I didn’t bother with Safari as I couldn’t justify spending $99 to add a prank extension to their catalog.

Enjoy!