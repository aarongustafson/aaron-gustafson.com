---
layout: post
title: "What Would You Do With 10kB?"
date: 2016-08-17 14:48:27 -0400
comments: true
categories: ["web design", accessibility, Microsoft, performance, "progressive enhancement"]
description: "I’m thrilled to announce that the 10k Apart contest is back and brings with it a handful of new challenges."
canonical: "https://blogs.windows.com/msedgedev/2016/08/15/10k-apart/"
---

Sixteen years ago, [Stewart Butterfield](https://twitter.com/stewart) conceived of a contest that would test the mettle of any web designer: [The 5k](http://web.archive.org/web/20000510010054/http:/www.sylloge.com/5k/home.html). The idea was that entrants would build [an entire site in 5kB of code or less](http://alistapart.com/article/5k). Its aim was to force us to get creative by putting a bounding box on what we could do:

> Between servers and bandwidth, clients and users, HTML and the DOM, browsers and platforms, our conscience and our ego, we’re left in a very small space to find highly optimal solutions. Since the space we have to explore is so small, we have to look harder, get more creative; and that’s what makes it all interesting.

<!-- more -->

The 5k contest ran from 2000 until 2002. In 2010, [An Event Apart and Microsoft revived the idea](http://www.zeldman.com/2010/07/29/10k-apart-%E2%80%93%C2%A0inspire-the-web/) with an updated limit and a new name: [10k Apart](http://web.archive.org/web/20100730090946/http:/10k.aneventapart.com/). Staying true to its roots, this new incarnation, which ran for two years, continued to push designers and developers to get creative within a pretty extreme (though slightly expanded) limit while incorporating new goodies like HTML5 and responsive design.

I’m thrilled to announce that [the 10k Apart contest is back](https://a-k-apart.com/) and brings with it a handful of new challenges:

1. **Each page must be usable in 10kB or less.** The 10kB limit no longer applies to the size of a ZIP archive of your entry; the 10kB limit now applies to the total initial download size of the baseline experience of each page in your project. When we say “baseline experience,” we’re talking small screen devices running older, less capable browsers. The 10kB limit will apply to every page and whatever assets it loads by default; that means images, CSS, JavaScript, and so on.
2. **Progressive enhancement is the name of the game.** Your project should start with a super-basic, bare-bones-but-usable experience that will work no matter what (including without JavaScript). You can use clever CSS and JavaScript techniques to enhance that experience as it makes sense to do so. For example: You might lazy load an image using JavaScript if the screen size is above a certain threshold or when certain other conditions are met. Entries that depend entirely on JavaScript to render the front-end won’t be accepted. If you need a primer on progressive enhancement, [consult the pages of <cite>A List Apart</cite>](http://alistapart.com/search?keywords=progressive%20enhancement).
3. **Back ends are in this year.** In previous iterations, each entry comprised client-side code submitted via ZIP file. Over time, that limitation led to an over-reliance on JavaScript for rendering. No more. This year, you can create dynamic experiences that work without front-end JavaScript using Node, PHP, Python or .Net. You will submit your entry as public GitHub repository (so we can all learn from your awesome code) and we’ll spin up a dedicated [Azure](https://azure.microsoft.com/) instance running the appropriate stack.
4. **Entries should be accessible.** In line with the philosophy of progressive enhancement, your entry should be usable by the broadest number of users possible. [Accessibility is not a checklist](http://www.accessiq.org/news/commentary/2012/09/web-accessibility-is-a-mindset-not-a-checklist), but if you’re clueless about where to start, [these techniques](https://www.w3.org/TR/WCAG20-TECHS/) can offer some guidance.
5. **Nothing comes for free.** In previous years, we gave a pass if you wanted to use jQuery or load some fonts from Typekit. This year we decided to change it up, not because we don’t love these products (we do), but because we wanted to force every piece of code, every asset, to fight for its place in your entry. Anything you add should be added with purpose.

As with previous editions, your entry should use web standards and work in all modern browsers. You can use HTML, CSS, and JavaScript features and APIs that don’t have across-the-board support as long as you do so in keeping with the progressive enhancement philosophy. In other words, your entry can’t depend on that technology or feature in order to be usable.

All of this may sound like a tall order, but it’s entirely possible. In fact, the site we built for the contest also abides by these rules. My colleagues and I will touch on some of the techniques we used (and concessions we made) in building the site in future posts.

If you’ve read this far, you might be wondering *What’s in it for me?* Well, bragging rights, of course, but we’ve got some awesome prizes too! We’re giving away $10,000 to the top three entries, plus [tickets to An Event Apart](http://aneventapart.com/events), complete collections of [A Book Apart titles](https://abookapart.com/collections/standards-collection), and copies of [my book](http://adaptivewebdesign.info/2nd-edition/) too. [Complete details of the prizes](https://a-k-apart.com/#prizes) are over on [the contest site](https://a-k-apart.com/).

We’ve lined up an amazing group to judge the entires this year too: [Rachel Andrew](https://twitter.com/rachelandrew), [Lara Hogan](https://twitter.com/lara_hogan), [Mat Marquis](https://twitter.com/wilto), [Heydon Pickering](https://twitter.com/Heydonworks), [Jen Simmons](https://twitter.com/jensimmons), and [Sara Soueidan](https://twitter.com/SaraSoueidan) will all be putting your entry through its paces and peering under the hood at your code. There’s also a People’s Choice award which will be based on votes you cast. Voting will open October 1st and run through October 14th.

The contest opened Monday and we will accept entries until 5pm Pacific Time on September 30th. [Everything you should need to know about the contest, eligibility, etc.](https://a-k-apart.com/legal) is up on [the 10k Apart site](https://a-k-apart.com/), but if you have additional questions, [you can always reach out](https://a-k-apart.com/hi).

I can’t wait to see what you come up with! Happy coding!