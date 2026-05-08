---
title: "Face It: You Can’t Rely on JavaScript"
date: 2011-02-09 05:51:28
comments: true
tags:
  - "accessibility"
  - "progressive enhancement"
  - "web standards"
  - "JavaScript"
  - "user experience"
description: "I’ve been cautioning folks against over-reliance on JavaScript for the better part of a decade. In that time, I harped a lot on Lala.com (which was eventually bought by Apple and shuttered) because they loaded all of their content via..."
canonical: "https://blog.easy-designs.net/archives/you-cant-rely-on-javascript/"
---

<p>I’ve been cautioning folks against over-reliance on JavaScript for the better part of a decade. In that time, I harped a lot on Lala.com (which was eventually bought by Apple and shuttered) because they loaded all of their content via Ajax. If you showed up to the page with JavaScript disabled, you were greeted with a curt “you must be this high to ride” type message and, my favorite feature, a “loading” indicator:</p>
<p><figure><img alt="" src="/i/posts/2011-02-09/lala-fail.png"/></figure></p>

<!-- more -->

<p>Of course, without JavaScript, nothing was loading; the site was devoid of content and completely unusable. Even the search box was pointless as it had no submit button and relied on predictive typing to find anything.</p>
<p>That was four years ago. Skip ahead to the relaunch of the Gawker Media platform and you have a company (that should really know better) putting all of their eggs in the JavaScript basket yet again. True, they certainly haven’t been the only ones to launch a site design that relied 100% on JavaScript since Lala, but their epic fail yesterday proved, yet again, that you can’t rely on JavaScript (and Ajax).</p>
<figure><img alt="" src="/i/posts/2011-02-09/lifehacker-fail.png"/></figure>
<p>So why can’t you rely on JavaScript? Let’s go through the list:</p>
<ol>
<li>Users may choose to turn JavaScript off in their browser (for performance reasons, as a low-fi way to block pop-ups and ads, or because they ascribe to the age-old misconception that JavaScript is inaccessible).</li>
<li>Network administrators may block JavaScript at the firewall (usually because they think it’s insecure).</li>
<li>A JavaScript issue as simple as a typo could cause a fatal error that causes JavaScript execution to be aborted completely.</li>
<li>In the case of Ajax, the service you are relying on to deliver content to the browser may, itself, experience an error and return nothing or a bunch of error code.</li>
</ol>
<p>For these reasons, you should always build your website following progressive enhancement: start with the reliable baseline of <span class="caps">HTTP</span> and good copywriting; add semantic <span class="caps">HTML</span> (and microformats); apply <span class="caps">CSS</span> in layers to create visual hierarchies; use Hijax and other progressively-enhanced JavaScript patterns to improve the interactivity; and cap it off with accessibility enhancements in the form of <span class="caps">ARIA</span> roles and states.</p>
<p>For musings on the Gawker redesign, progressive enhancement, and JavaScript-focused “hash-bang” URLs, read <a href="http://adactio.com/journal/4346/">Jeremy’s excellent post</a> and <a href="http://isolani.co.uk/blog/javascript/BreakingTheWebWithHashBangs">Mike’s in-depth analysis</a>.</p>
