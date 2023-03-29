---
layout: page
title: My Official Biographies
description: "My official bio for conferences and the like."
show_title: false
show_footer: false
sharing: false
sidebars: 
  - "partials/asides/networks.html"
  - "partials/asides/events.html"
---

{% set oneliner %}
[Aaron Gustafson](http://www.aaron-gustafson.com/) is a Principal Accessibility Innovation Strategist at [Microsoft](http://www.microsoft.com/) and the author of [<cite>Adaptive Web Design</cite>](https://adaptivewebdesign.info/).
{% endset %}

{% set brief %}
As would be expected from a former manager of the [Web Standards Project](http://webstandards.org), Aaron Gustafson has been working to make the web more equitable for nearly three decades now. He is a Principal Accessibility Innovation Strategist at [Microsoft](http://www.microsoft.com/). In a prior role, he worked on the Edge browser team with a focus on Progressive Web Apps and developer-focused user experiences. He penned the seminal book on progressive enhancement, [<cite>Adaptive Web Design</cite>](https://adaptivewebdesign.info/), and has been known to have some opinions, many of which he shares at [aaron-gustafson.com](https://www.aaron-gustafson.com/).
{% endset %}

{% set full %}
As would be expected from a former manager of the [Web Standards Project](http://webstandards.org), Aaron Gustafson has been working to make the web more equitable for nearly three decades now.

As a web designer, developer, and consultant, Aaron has worked with <a href="https://www.aaron-gustafson.com/clients/" rel="nofollow">a number of companies you’ve probably heard of</a>. In 2015, he joined [Microsoft](http://www.microsoft.com/) as a web standards advocate to work closely with their browser team, where he established the developer-engagement platform [the Web We Want](https://webwewant.fyi) and worked to chart the future of Progressive Web Apps (PWAs) as a member of [the <abbr title="World Wide Web Consortium">W3C</abbr>’s Web Applications Working Group](https://www.w3.org/groups/wg/webapps), an editor of several PWA-related specifications, and author of [numerous feature proposals](https://github.com/MicrosoftEdge/MSEdgeExplainers). In 2022, Aaron shifted his focus to leading [Microsoft’s AI for Accessibility grant program](https://www.microsoft.com/en-us/ai/ai-for-accessibility), where he identifies and funds innovations in accessibility on a global scale.

Aaron loves to share his knowledge and insights in written form. His [three-part series on progressive enhancement for *A List Apart*](http://alistapart.com/author/agustafson) is a perennial favorite and his seminal book on the subject, [*Adaptive Web Design*](https://adaptivewebdesign.info/), earned him numerous accolades and honors. When he’s not writing, Aaron is frequently on the road [presenting at conferences and running workshops](https://www.aaron-gustafson.com/speaking-engagements/) across the globe.

You can find out more about Aaron at [aaron-gustafson.com](https://www.aaron-gustafson.com/).
{% endset %}

# Biographies

<aside class="alternate">{{ headshot_promo | markdownify | safe }}</aside>

## One-liner ({{ oneliner | wordcount }} Words)

{{ oneliner | safe }}


## Brief Bio ({{ brief | wordcount }} Words)

{{ brief | safe }}


## Full Bio ({{ full | wordcount }} Words)

{{ full | safe }}