---
to: src/links/<%= h.getFilename(locals) %>.md
sh: "open 'src/links/<%= h.getFilename(locals) %>.md'"
---
---
title: "<%= h.escapeQuotes(title) %>"
ref_source: "<%= h.escapeQuotes(source) %>"
date: <%= h.getTimestamp() %>
comments: true
tags: ["<%- tags.join('\", \"') %>"]
description: "<%= h.escapeQuotes(description) %>"
twitter_text: "<%= h.escapeQuotes(twitter_text) %>"
ref_url: <%= url %>
in_reply_to: <%= url %>
<% if (locals.via_name) { -%>
via:
  name: "<%= h.escapeQuotes(locals.via_name) %>"
  url: <%= locals.via_url %>
<% } -%>
---

Text

<% if (locals.quote) { -%>
> <%= quote %>
<% } -%>

Note: Twitter, CodePen, and YouTube links will automatically be embedded.
