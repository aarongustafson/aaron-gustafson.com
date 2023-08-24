---
layout: "home"
title: "Hi!"
description: "Hi there, I’m Aaron and I work on the Web."
body_class: "home"
ogtype: "website"
sitemap: true
---

## Hi there, I’m Aaron and I work on the web.

Every day I strive to make the web (and world) more [accessible](/tags/accessibility/), [open](/tags/web-standards/),
and [equitable](/tags/inclusive-design/) place for people to live, play, and work.

Over the last {{ helpers.currentYear() - 1996 }} years, I’ve written
<a href="/publications/#books">{{ collections.books | filterTo("type", "authored") | length }} books</a> (contributing to 
{{ ( collections.books | length ) - ( collections.books | filterTo("type", "authored") | length ) }}
more) and <a href="/publications/#articles">{{ collections.articles | length }} articles</a> with that focus. I’ve also presented on [these and related topics](/speaking-engagements/#talks) at
<a href="/speaking-engagements/">over {{ speaking_engagements | length }} events</a> in
{{ ( cities | length ) - 1 }} cities across the globe.

I’m a Principal Accessibility Innovation Strategist at Microsoft, where I run the $25<abbr title="million">M</abbr> [AI for Accessibility grant program](https://www.microsoft.com/ai/ai-for-accessibility) and lead the charge on accessibility innovation. In my prior role on the Edge browser team, I steered our investments in [Progressive Web Apps (PWAs)](/tags/progressive-web-apps/).

I’m also deeply involved in culture work within Microsoft, providing [allyship and related training](/tags/inclusion/) across a broad swath of Microsoft product teams.

I’m a spec editor at [the <abbr title="World Wide Web Consortium">W3C</abbr>](https://www.w3.org/), a former manager of the [Web Standards Project](http://webstandards.org), Editor-in-chief of [<cite>A List Apart</cite>](http://alistapart.com), and the creator of [the Web We Want](https://webwewant.fyi).

If you’re interested in learning more about what I’m up to, [check out what I’m working on right now](/now/).
