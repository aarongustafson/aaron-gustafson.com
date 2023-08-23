---
to: src/appearances/podcasts/<%= h.getFilename(locals) %>.md
sh: "open 'src/appearances/podcasts/<%= h.getFilename(locals) %>.md'"
---
---
title: "<%= h.escapeQuotes(title) %>"
date: <%= date %> 00:00:00 +00:00
tags: ["<%- tags.join('\", \"') %>"]
publisher: "<%= publisher %>"
url: "<%= url %>"
<% if (locals.episode) { -%>
episode: "<%= episode %>"	
<% } -%>
---

<%= description %>
