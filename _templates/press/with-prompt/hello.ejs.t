---
to: src/appearances/press/<%= h.getFilename(locals) %>.md
sh: "open 'src/appearances/press/<%= h.getFilename(locals) %>.md'"
---
---
title: "<%= h.escapeQuotes(title) %>"
date: <%= date %> 00:00:00 +00:00
tags: ["<%- tags.join('\", \"') %>"]
publisher: "<%= publisher %>"
<% if (locals.url) { -%>
url: "<%= url %>"
<% } -%>
---

<%= description %>
