---
layout: page
title: My Official Biographies
description: "My official bio for conferences and the like."
show_title: false
show_footer: false
sharing: false
sidebars:
  - "partials/asides/networks.njk"
  - "partials/asides/events.njk"
---


{% set oneliner %}
[Aaron Gustafson](https://www.aaron-gustafson.com/) is a Principal Technical Program Manager in Microsoft Accessibility Engineering, where he builds AI systems that help teams find and fix accessibility issues early. He wrote [*Adaptive Web Design*](https://adaptivewebdesign.info/) and has advocated for web standards for more than 30 years.
{% endset %}

{% set brief %}
For more than three decades, [Aaron Gustafson](https://www.aaron-gustafson.com/) has worked to make technology more accessible, resilient, and equitable. He’s a Principal Technical Program Manager in Microsoft Accessibility Engineering, where he guides work on AI evaluation &  benchmarks, agentic tooling, and design software. Previously, Aaron directed Microsoft’s $25m AI for Accessibility portfolio and helped deliver speech-AI and custom neural-voice experiences with people who have disabilities. Earlier at Microsoft, he shaped Progressive Web App strategy for Edge and edited several W3C specifications. Aaron wrote [*Adaptive Web Design*](https://adaptivewebdesign.info/), co-authored the sixth edition of [*Learning Web Design*](https://www.oreilly.com/library/view/learning-web-design/9781098137670/), managed the Web Standards Project, and served as Editor in Chief of *A List Apart*.
{% endset %}

{% set full %}
For more than three decades, [Aaron Gustafson](https://www.aaron-gustafson.com/) has worked to make technology more accessible, resilient, and equitable.

Aaron began as a web designer, developer, and consultant, building products for organizations large and small. He became an early—and stubborn—advocate for web standards, progressive enhancement, and inclusive design as practical ways to reach more people under more conditions. He later managed the [Web Standards Project](http://webstandards.org), served as Editor in Chief of [*A List Apart*](http://alistapart.com), and helped practitioners around the world put those ideas to work.

In 2015, Aaron joined [Microsoft](https://www.microsoft.com/) as a web standards advocate. He worked closely with the Edge browser team, helped shape Microsoft’s Progressive Web App strategy, edited several PWA-related W3C specifications, and created [the Web We Want](https://webwewant.fyi) to gather and organize the web community’s priorities. The job put him in the messy middle of developer needs, standards debates, browser engineering, Windows integration, and Microsoft Store distribution.

Aaron shifted to accessibility innovation in 2022. He directed Microsoft’s $25 million AI for Accessibility portfolio, helped teams navigate Responsible AI requirements, and worked with researchers, product teams, and external partners to turn promising ideas into practical, proven products. He later helped deliver an end-to-end custom neural-voice pipeline for people with ALS and rebuilt Accessibility Assistant for Figma into a sturdier, more capable design-time accessibility tool.

Today, Aaron is a Principal Technical Program Manager in Microsoft Accessibility Engineering. He builds benchmarks & evaluation systems, agentic coding tools, and design software that help teams find and fix accessibility issues early. In one recent effort, his team raised detection of known accessibility issues from 9% to 88% through a custom instruction set; he wrung out the final 18 percentage points while cutting token use in half.

Aaron still writes, teaches, and speaks about the web, accessibility, and the choices we make when building technology. He wrote the seminal book on progressive enhancement, [*Adaptive Web Design*](https://adaptivewebdesign.info/), and co-authored the sixth edition of [*Learning Web Design*](https://www.oreilly.com/library/view/learning-web-design/9781098137670/). His [articles](https://www.aaron-gustafson.com/publications/#articles), [talks](https://www.aaron-gustafson.com/speaking-engagements/), and community work keep circling the same question: how can we build technology that works for more people without sanding away what makes the web the web?
{% endset %}

# Biographies

<aside class="alternate">{{ headshot_promo | markdownify | safe }}</aside>

## One-liner ({{ oneliner | wordcount }} Words)

{{ oneliner | safe }}

## Brief Bio ({{ brief | wordcount }} Words)

{{ brief | safe }}

## Full Bio ({{ full | wordcount }} Words)

{{ full | safe }}
