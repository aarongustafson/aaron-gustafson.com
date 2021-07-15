---
title: "Moved from Octopress to Jekyll"
date: 2017-03-23 14:43:26 -04:00
comments: true
tags: ['this site',Octopress,Jekyll]
description: "It took a few days, but I think the site is pretty stable in Jekyll now. That said, there are likely some bugs yet to be discovered. Let me know if you find one."
---

A while back I mentioned my desire to move this site from [Octopress](http://octopress.org/) to [Jekyll](https://jekyllrb.com/). I liked Octopress when I re-christened this site, but I didn’t really see much benefit to moving to [Octopress 3](https://github.com/octopress/octopress) over stripping away the Octopress 2 bits and going with a core Jekyll install.

<!-- more -->

Octopress was built on top of Jekyll, so I figured the move would be fairly easy. On the whole, it was. I was able to move the content over without too much difficulty. I ended up having to back out some of the Octopress plugins and either write the functionality myself or look for alternatives. Thankfully none were a terribly big deal.

The only major change was to the overall structure of the site. I opted to move [my blog](/notebook/) and [linkblog](/notebook/links/) into [Jekyll collections](https://jekyllrb.com/docs/collections/), which worked out pretty well. I opted to go with the newer [`jekyll-paginate-v2` gem](https://github.com/sverrirs/jekyll-paginate-v2) to build out the archive pages for each and used [`jekyll-tagging`](https://github.com/pattex/jekyll-tagging) to generate the tag archive pages. In the process, I also moved all of my post "categories" over to being "tags", since that was more appropriate to how I was using them anyway.

It took a few days to get it to the point where I feel I can merge the Jekyll-only branch back and publish for the first time, but I think it is pretty stable. That said, there are likely some bugs yet to be discovered. Please let me know if you find one; more sets of eyes are always better.