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
---

<p>This has been one crazy Fall work-wise, so I apologize for the scarcity of posts, but I do have a few holiday treats for you.</p>

<!-- more -->

<p>From my day job at <a href="http://www.cronin-co.com">Cronin and Company</a>, we’ve got Cronin’s “<a href="http://www.croninholiday.com">Grab Bag of Goodness</a>.” As with most internal projects, this was a major rush job. I take no credit for the design (which was handed to me with no wiggle room), but when it comes to the CSS and DOM Scripting, that I’ll proudly take credit for. Use the code “9301″ to get in. Of particular note in this piece:</p>
<ul>
<li>Taking a page from Dan’s <a href="http://www.simplebits.com/notebook/2005/10/05/bplogos.html">Bulletproof Logos</a>, most all of the text is in (shock) images. Toss in the text as an <code>alt</code> attribute and with images and CSS off, you’re still golden. As this was a one-off, sIFR seemed like overkill.</li>
<li>Ooh, check out that marquee. Brings back memories, doesn’t it. Well, this one’s a little different. The markup is an <code>ul</code> and each item is a <code>li</code>. CSS makes it all <code>display: inline;</code> and then JavaScript keeps reducing the <code>margin-left</code> of the first <code>li</code> by 2px until the absolute value of it’s <code>margin-left</code> is greater than the <code>li</code>’s width. That <code>li</code> is then plucked from the front of the list and appended to the end. Though I am not a big fan of scrolling marquees, this was a pretty fun experiment. </li>
<li>Those animated icons you can click to make a donation are actually form controls. Originally, I had made them into custom submit <code>input</code>s, but Safari’s inability to customize certain form controls made me abandon that element in favor of <code>button</code>. It’s a great effect too (<abbr title="in my humble opinion">IMHO</abbr><abbr>).</abbr></li>
</ul>
<p>Then there’s the <a href="http://www.easy-designs.net">Easy Designs</a> holiday card. I will spare the commentary on this one with the exception of giving major props to Dave for building the game in a day. I’m pretty darn proud of it, especially since we pretty much went from concept to execution in a matter of days (yeah, procrastination’s a bitch). If you’re interested, you can <a href="http://www.easy-designs.net/holiday/2005/email.html">see a rough approximation of the email that went out</a> (our first <a href="http://www.campaignmonitor.com">Campaign Monitor</a> mailing) or simply <a href="http://www.easy-designs.net/holiday/2005/">play the game</a>.</p>
