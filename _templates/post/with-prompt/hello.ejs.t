---
to: src/posts/<%= h.getFilename(locals) %>.md
sh: "open 'src/posts/<%= h.getFilename(locals) %>.md'"
---
---
title: "<%= h.escapeQuotes(title) %>"
date: <%= h.getTimestamp() %>
comments: true
tags: ["<%- tags.join('\", \"') %>"]
description: "<%= h.escapeQuotes(description) %>"
twitter_text: "<%= h.escapeQuotes(twitter_text) %>"
<% if (locals.in_reply_to) { -%>
in_reply_to: <%= in_reply_to %>
<% } -%>
<% if (locals.series) { -%>
series:
  name: "<%= h.getSeriesName(series) %>"
  tag: "<%= series %>"
  ordinal: ""
<% } -%>
---

Intro paragraph.

<!-- more -->

Other stuff.

Note: Twitter, CodePen, and YouTube links will automatically be embedded.