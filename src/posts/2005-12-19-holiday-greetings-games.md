---
title: "Holiday Greetings & Games"
date: 2005-12-19 11:20:14
comments: true
tags:
  - "CSS"
  - "JavaScript"
  - "animation"
description: "This has been one crazy Fall work-wise, so I apologize for the scarcity of posts, but I do have a few holiday treats for you."
canonical: "https://blog.easy-designs.net/archives/holiday-greetings-games/"
atUri: "at://did:plc:6rmgrvblxflqh34omwywu6ib/site.standard.document/3mxrnx4nptz2l"
image: "/i/share-cards/holiday-greetings-games.jpg"
---

This has been one crazy Fall work-wise, so I apologize for the scarcity of posts, but I do have a few holiday treats for you.

<!-- more -->

From my day job at [Cronin and Company](http://www.cronin-co.com), we’ve got Cronin’s “[Grab Bag of Goodness](http://www.croninholiday.com).” As with most internal projects, this was a major rush job. I take no credit for the design (which was handed to me with no wiggle room), but when it comes to the CSS and DOM Scripting, that I’ll proudly take credit for. Use the code “9301″ to get in. Of particular note in this piece:

- Taking a page from Dan’s [Bulletproof Logos](http://www.simplebits.com/notebook/2005/10/05/bplogos.html), most all of the text is in (shock) images. Toss in the text as an `alt` attribute and with images and CSS off, you’re still golden. As this was a one-off, sIFR seemed like overkill.
- Ooh, check out that marquee. Brings back memories, doesn’t it. Well, this one’s a little different. The markup is an `<ul>` and each item is a `<li>`. CSS makes it all `display: inline;` and then JavaScript keeps reducing the `margin-left` of the first `<li>` by 2px until the absolute value of it’s `margin-left` is greater than the `<li>`’s width. That `<li>` is then plucked from the front of the list and appended to the end. Though I am not a big fan of scrolling marquees, this was a pretty fun experiment.
- Those animated icons you can click to make a donation are actually form controls. Originally, I had made them into custom submit `<input>`s, but Safari’s inability to customize certain form controls made me abandon that element in favor of `<button>`. It’s a great effect too (<abbr title="in my humble opinion">IMHO</abbr><abbr>).</abbr>

Then there’s the [Easy Designs](http://www.easy-designs.net) holiday card. I will spare the commentary on this one with the exception of giving major props to Dave for building the game in a day. I’m pretty darn proud of it, especially since we pretty much went from concept to execution in a matter of days (yeah, procrastination’s a bitch). If you’re interested, you can [see a rough approximation of the email that went out](http://www.easy-designs.net/holiday/2005/email.html) (our first [Campaign Monitor](http://www.campaignmonitor.com) mailing) or simply [play the game](http://www.easy-designs.net/holiday/2005/).
