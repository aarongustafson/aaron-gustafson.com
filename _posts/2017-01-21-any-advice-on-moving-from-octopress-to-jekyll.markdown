---
layout: post
title: "Any Advice on Moving From Octopress to Jekyll?"
date: 2017-01-21 11:55:37 -0500
comments: true
tags: ["this site",jekyll,octopress]
twitter_text: "I’m moving from @octopress to @jekyllrb on Tuesday. Any advice or recommended reading?"
---

Next Tuesday I’m planning to take the day to do a little refresh on this site. The largest part of that effort will be moving this project off of [Octopress](http://octopress.org/) to [Jekyll](https://jekyllrb.com/). I’m not expecting it to be a huge challenge—Jekyll underpins Octopress anyway—but I’m sure there are some gotchas I should look out for. If you’ve made the leap yourself in the past and have any advice or recommended reading, please leave a comment or [Web Mention](https://indieweb.org/Webmention).

<!-- more -->

In case you’re curious why I’m making the shift, it’s pretty simple:

* Octopress development seems [relatively stalled](https://github.com/octopress/octopress/graphs/code-frequency);
* Octopress includes dependencies I don’t really need;
* I’ve been [writing a lot of Jekyll plugins](https://github.com/aarongustafson?utf8=%E2%9C%93&amp;tab=repositories&amp;q=jekyll&amp;type=public&amp;language=ruby) and maintaining them without using them on the latest Jekyll is challenging;
* I’m comfortable writing my own [Rake](http://rake.rubyforge.org/) commands; and
* This is the big one: [Incremental builds](http://idratherbewriting.com/2015/11/04/jekyll-30-released-incremental-regeneration-rocks/).

I’m hopeful this shift will make it easier for me to get content published more quickly and more reliably. I may even move my build processes into [Travis CI](https://travis-ci.org/) to further offload the work. But I’m getting ahead of myself… let’s see how Tuesday goes first.
