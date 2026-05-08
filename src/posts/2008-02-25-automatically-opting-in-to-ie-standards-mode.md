---
title: "Automatically opting-in to IE8’s Standards Mode"
date: 2008-02-25 23:18:14
comments: true
tags:
  - "web standards"
  - "browsers"
description: "As some of you have read (or heard ), WaSP organized a Round Table discussion on IE 8’s standards mode and its default behavior of opting-out any sites that don’t engage in version targeting . We discussed a few different aspects of the..."
canonical: "https://blog.easy-designs.net/archives/automatically-opting-in-to-ie-standards-mode/"
---

<p><img alt="Web standards Project" src="/i/posts/2008-02-25/wasp-logo.png" style="float: left;"/>As some of you have <a href="http://www.webstandards.org/2008/02/24/wasp-round-table-ie8s-default-version-targeting-behavior/">read</a> (or <a href="http://www.webstandards.org.nyud.net/files/wasp_ie8_round_table_discussion_final.mp3">heard</a>), WaSP organized a Round Table discussion on IE8’s standards mode and its default behavior of opting-out any sites that don’t engage in <a href="http://www.alistapart.com/articles/beyonddoctype">version targeting</a>. We discussed a few different aspects of the issues this presents for standards-aware developers (and progress on the web in general) and discussed a few tacks Microsoft could take to make IE8 more standardista-friendly.</p>

<!-- more -->

<p>One proposal that, to me, appeared to hold the most promise was one that involved extending IE8’s scheme of automatically opting-in unknown valid DOCTYPEs to also include Strict DOCTYPEs of <abbr title="HyperText Markup Language">HTML</abbr> and XHTML currently in use. The current proposal hinges on the relative popularity (or unpopularity) of a given DOCTYPE: unrecognized DOCTYPEs are assumed to be future or custom DOCTYPEs and will automatically be opted-in to the latest and greatest standards mode of any given future version of <abbr title="Internet Explorer">IE</abbr>; that is, <strong>until</strong> that DOCTYPE becomes “popular” enough to warrant associating it with a given version of <abbr title="Internet Explorer">IE</abbr>. This, in a nutshell, means that if a new DOCTYPE were to come along after IE8 launches—say, <abbr title="HyperText Markup Language">HTML</abbr> 5—IE8 would render it in standards mode, but if that DOCTYPE became “popular” before IE9 came out, IE9 would likely act as though it was IE8 when rendering those pages.</p>
<p>Chris Wilson did not have numbers on the relative popularity of Strict mode DOCTYPEs vs. Transitional and Frameset on either <abbr title="HyperText Markup Language">HTML</abbr> or XHTML, but given that most authoring tools do not automatically generate Strict documents, it is a strong possibility that the popularity of Strict mode DOCTYPEs may make them a candidate for being automatically opted-in to standards mode, at least in IE8. That would be great news for standards-aware developers who want IE8’s standards improvements, but don’t want to engage in version targeting.</p>
