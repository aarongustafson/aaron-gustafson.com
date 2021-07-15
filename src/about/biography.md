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
[Aaron Gustafson](http://www.aaron-gustafson.com/) is a web standards and accessibility advocate working at [Microsoft](http://www.microsoft.com/).
{% endset %}

{% set brief %}
As would be expected from a former manager of the [Web Standards Project](http://webstandards.org), Aaron Gustafson is passionate about web standards and accessibility. He’s been working on the Web for over two decades now and is a web standards advocate at [Microsoft](http://www.microsoft.com/). In addition to working closely with the Edge team, Aaron works with partners on Progressive Web Apps, with a focus on cross-platform compatibility. He penned the seminal book on progressive enhancement, [<cite>Adaptive Web Design</cite>](http://adaptivewebdesign.com), and has been known to have some opinions, many of which you can read at [aaron-gustafson.com](https://www.aaron-gustafson.com/).
{% endset %}

{% set full %}
As would be expected from a former manager of the [Web Standards Project](http://webstandards.org), Aaron Gustafson is passionate about web standards and accessibility.

In his more than two decades working on the Web, Aaron has worked with a number of companies you’ve probably heard of including Box, Happy Cog, Major League Baseball, McAfee, *the New York Times*, SAS, StubHub, the U.S. Environmental Protection Agency, Vanguard, Walgreens, and Yahoo. He joined [Microsoft](http://www.microsoft.com/) as a web standards advocate to work closely with their browser team and is currently spending a lot of his time thinking about Progressiv Web Apps.

Aaron loves to share his knowledge and insights in written form. His [three-part series on progressive enhancement for *A List Apart*](http://alistapart.com/author/agustafson) is a perennial favorite and his seminal book on the subject, [*Adaptive Web Design*](http://adaptivewebdesign.com), has earned him numerous accolades and honors. When he’s not writing, Aaron is frequently on the road [presenting at conferences and running workshops](https://web.archive.org/web/http://lanyrd.com/profile/aarongustafson/) across the globe.

Aaron also founded the [Chattanooga Open Device Lab](http://chadevicelab.org) and is a longtime member of [Rosenfeld Media’s "experts" group](http://rosenfeldmedia.com/experts/aaron-gustafson/) and has been known to have some opinions, many of which you can read at [aaron-gustafson.com](https://www.aaron-gustafson.com/).
{% endset %}

# Biographies

<aside class="alternate">{{ headshot_promo | markdownify | safe }}</aside>

## One-liner ({{ oneliner | wordcount }} Words)

{{ oneliner | safe }}


## Brief Bio ({{ brief | wordcount }} Words)

{{ brief | safe }}


## Full Bio ({{ full | wordcount }} Words)

{{ full | safe }}