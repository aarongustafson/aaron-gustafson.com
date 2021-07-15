---
title: "Client-side MVC's Major Bug"
date: 2015-02-12 21:05:36 -05:00
comments: false
ref_url: http://timkadlec.com/2015/02/client-side-templatings-major-bug/
in_reply_to: http://timkadlec.com/2015/02/client-side-templatings-major-bug/
ref_source: Time Kadlec’s Blog
---

Astute observations (as always) from [Tim Kadlec](http://twitter.com/tkadlec). I’ll let Tim set the scene:

> Over the past year I conducted performance audits on a handful of sites that all used client-side MVC’s, typically Angular but not always. Each site had their own optimizations that needed to take place to improve performance. Yet a pattern emerged: client-side MVC’s were the major bottleneck for each. It slowed down the initial rendering of the page (particularly on mobile) and it limited our ability to optimize the critical path.

Obviously Tim knows what he’s talking about.

He goes on to bring in the voices of the Filament Group and PPK (both of whom I’ve [linked to previously](http://aaron-gustafson.com/notebook/links/researching-the-performance-costs-of-javascript-mvc-frameworks/) [for the same reasons](http://aaron-gustafson.com/notebook/links/the-problem-with-angular/)): lots of smart people have come to the conclusion that relying on client-side generation of web pages is a bad idea. Tim goes so far as to say “if your client-side MVC framework does not support server-side rendering, that is a bug” and I can’t help but agree.

His post is great, you should read it. Frankly, I wish I’d written it.