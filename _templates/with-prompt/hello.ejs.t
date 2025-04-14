---
to: src/talks/<%= h.getFilename(locals, false) %>.md
sh: "open 'src/talks/<%= h.getFilename(locals, false) %>.md'"
---
---
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
date: <%= date %>
hero: "<%= h.getFilename(locals, false) %>.png"
<% if (locals.has_slides) { -%>
slides:
  event: <%= slidesevent %>
  link: <%= slides.slideslink %>
  embed: <%= slides.slidesembed %>
  download: <%= slides.slidesdownload %>
  size: <%= slides.slidessize %>
<% } -%>
<% if (locals.has_video) { -%>
video:
  event: <%= videoevent %>
  link: <%= video.videourl %>
  embed: <%= video.videoembed %>
<% } -%>
<% if (locals.has_audio) { -%>
audio:
  event: <%= audioevent %>
  file: <%= audio.audiofile %>
<% } -%>
<% if (locals.text.texturl) { -%>
text: <%= text.texturl %>
<% } -%>
---

Full talk description, etc. goes here.
