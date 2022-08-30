---
to: src/_talks/<%= h.getFilename(locals, false) %>.md
sh: "open 'src/_talks/<%= h.getFilename(locals, false) %>.md'"
---
---
layout: talk
title: "<%= h.escapeQuotes( title ) %>"
description: "<%= h.escapeQuotes( description ) %>"
<% if (locals.copresenter.name != '') { -%>
with:
  - name: "<%= h.escapeQuotes( copresenter.name ) %>"
    url: <%= copresenter.url %>
<% } -%>
category: <%= category %>
tags: [ "<%- tags.join('\", \"') %>" ]
events: [ <%- events.join(', ') %> ]
<% if (locals.has_slides) { -%>
slides:
  notist_id: <%= slides.notist_id %>
  download: <%= slides.slidesdownload %>
<% } -%>
<% if (locals.has_video) { -%>
video:
  event: <%= videoevent %>
  link: <%= video.videourl %>
  embed: <%= video.videoembed %>
<% } -%>
---

Full talk description, etc. goes here.
