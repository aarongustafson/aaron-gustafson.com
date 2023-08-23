---
to: src/publications/articles/<%= h.getFilename(locals, false) %>.md
sh: "open 'src/publications/articles/<%= h.getFilename(locals, false) %>.md'"
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
