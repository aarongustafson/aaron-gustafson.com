---
to: src/posts/<%= h.getFilename(locals) %>.md
sh: "open 'src/posts/<%= h.getFilename(locals) %>.md'"
---
---
title: "<%= title %>"
date: <%= h.getTimestamp() %>
comments: true
tags: ["<%- tags.join('\", \"') %>"]
description: "<%= description %>"
twitter_text: <%= twitter_text %>
<% if (locals.in_reply_to) { -%>
in_reply_to: <%= in_reply_to %>
<% } -%>
---

Intro paragraph.

<!-- more -->

Other stuff.

Note: Twitter, CodePen, and YouTube links will automatically be embedded.