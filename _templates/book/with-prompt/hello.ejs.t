---
to: src/publications/books/<%= h.getFilename(locals, false) %>.md
sh: "open 'src/publications/books/<%= h.getFilename(locals, false) %>.md'"
---
---
title: "<%= h.escapeQuotes(title) %>"
<% if (locals.subtitle) { -%>
subtitle: "<%= url %>"
<% } -%>
date: <%= date %> 00:00:00 +00:00
author: "<%= author %>"
type: "<%= type %>"
tags: ["<%- tags.join('\", \"') %>"]
publisher: "<%= publisher %>"
url: "<%= url %>"
cover: "<%= h.getFilename(locals, false) %>.jpg"
width: "134"
<% if (locals.full_text) { -%>
full_text: "<%= full_text %>"
<% } -%>
---

<%= description %>
