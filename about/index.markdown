---
layout: page
title: A Bit About Me
description: "My bio, headshots, etc."
footer: true
show_title: false
sharing: false
sidebars: [asides/networks.html,asides/events.html]
---

<figure id="headshot-2014" class="media-container media-container--right">
<img class="photo" src="/i/headshots/2014-sm.jpg" srcset="/i/headshots/2014-sm.jpg 310w, /i/headshots/2014.jpg 713w" alt="" width="310" height="310">
</figure>

{% include about.markdown %}

<hr>

{{ site.data.microcopy.about.bio_promo | append:" " | append:site.data.microcopy.about.headshot_promo | markdownify }}