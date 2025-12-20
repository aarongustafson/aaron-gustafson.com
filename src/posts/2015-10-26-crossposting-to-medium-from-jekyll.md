---
title: "Crossposting to Medium from Jekyll"
date: 2015-10-26 15:27:00 -04:00
comments: true
tags: [Jekyll, Octopress, blogging, "indie web"]
description: "Last week, Jeremy Keith posted about syndicating his content to Medium using their new API."
crossposted:
  Medium: https://medium.com/@AaronGustafson/crossposting-to-medium-from-jekyll-eb52aa3379cb
---

Last week, [Jeremy Keith posted about syndicating his content to Medium using their new API](https://adactio.com/journal/9694). Before they added [the API](https://github.com/Medium/medium-api-docs), there was no way to automatically publishing to [Medium](https://medium.com) from your own blog. And doing it manually was quite tedious.

Jeremy posted in detail about how to set it all up and provided [the PHP code he’s using](https://gist.github.com/adactio/c174a4a68498e30babfd) to make it all work. As I’m running a static site on [Octopress](http://octopress.org/), I ported it to Ruby as a [Jekyll Generator](http://jekyllrb.com/docs/plugins/#generators). I’ve [posted it to Github](https://github.com/aarongustafson/jekyll-crosspost_to_medium), so you can grab it there if you so desire.
