---
layout: post
title: "Moved from Octopress to Jekyll"
date: 2017-03-23 14:43:26 -0400
comments: true
tags: ['this site',octopress,jekyll]
description: "It took a few days, but I think the site is pretty stable in Jekyll now. That said, there are likely some bugs yet to be discovered. Let me know if you find one."
---

A while back I mentioned my desire to move this site from Octopress to Jekyll. I liked Octopress when I re-christened this site, but I didn’t really see much benefit to moving to Octopress 3 over stripping away the Octopress bits and going with a core Jekyll install.

<!-- more -->

Octopress was already built on top of Jekyll, so I figured the move would be fairly easy. On the whole, it was. I was able to move the content over without too much difficulty. I ended up having to back out some of the Octopress plugins and either write the functionality myself or look for alternatives. Thankfully none were a terribly big deal.

The only major change was to the overall structure of the site. I opted to move my blog and linkblog into Jekyll collections, which worked out pretty well. I opted to go with the newer `jekyll-paginate-v2` gem to build out the archive pages for each and used `jekyll-tagging` to generate the tag archive pages. In the process, I also moved all of my post categories over to being tags, since that was more appropriate to how I was using them anyway.

It took a few days to get it to the point where I feel I can merge the source back into `master` and publish for the first time, but I think it is pretty stable. That said, there are likely some bugs yet to be discovered. Please let me know if you find one; more sets of eyes are always better.