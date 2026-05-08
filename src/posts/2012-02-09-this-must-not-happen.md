---
title: "This Must Not Happen!"
date: 2012-02-09 11:56:54
comments: true
tags:
  - "progressive enhancement"
  - "web standards"
  - "CSS"
  - "browsers"
  - "web development"
description: "When I opened my inbox this morning, I nearly fell over. According to Daniel Glazman , co-chair of the CSS Working Group at the W3C , browser makers are considering supporting the WebKit vendor prefix ( -webkit-* ) because the web..."
canonical: "https://blog.easy-designs.net/archives/this-must-not-happen/"
---

<p>When I opened my inbox this morning, I nearly fell over. According to <a href="http://glazman.org">Daniel Glazman</a>, co-chair of the <a href="http://www.w3.org/Style/CSS/members.en.php3"><span class="caps">CSS</span> Working Group at the W3C</a>, <a href="http://www.glazman.org/weblog/dotclear/index.php?post/2012/02/09/CALL-FOR-ACTION:-THE-OPEN-WEB-NEEDS-YOU-NOW">browser makers are considering supporting the WebKit vendor prefix (<code>-webkit-*</code>) because the web development community can’t be bothered to use the equivalent experimental properties for other browsers</a>:</p>
<blockquote cite="http://www.glazman.org/weblog/dotclear/index.php?post/2012/02/09/CALL-FOR-ACTION:-THE-OPEN-WEB-NEEDS-YOU-NOW">
<p>WebKit, the rendering engine at the heart of Safari and Chrome, living in iPhones, iPads and Android devices, is now the over-dominant browser on the mobile Web and technically, the mobile Web is full of <em>works-only-in-WebKit</em> web sites while other browsers and their users are crying. Many sites are sniffing the browser’s User-Agent string and filtering out non-WebKit browsers. As in the past with <span class="caps">IE</span>6, it’s not a question of innovation but a question of hardware market dominance and software bundled with hardware. But there is an aspect of the problem we did not have during the <span class="caps">IE</span>6 era: these web sites are also WebKit-specific because they use only “experimental” <span class="caps">CSS</span> properties prefixed with <code>-webkit-*</code> and not their Mozilla, Microsoft or Opera counterparts. So even if the browser sniffing goes away, web sites will remain broken for non-WebKit browsers…</p>

<!-- more -->

<p>In many if not most cases, the <code>-webkit-*</code> properties WebKit-specific web sites are using do have <code>-moz-*</code>, <code>-ms-*</code>, <code>-o-*</code> equivalents. Gradients, Transforms, Transitions, Animations, border-radius, all interoperable enough to be browser-agnostic. Their web authors need only a few minutes to make the site compatible with Mozilla, Microsoft or Opera. But they never did it.</p>
<p>Without your help, without a strong reaction, this can lead to one thing only and we’re dangerously not far from there: other browsers will start supporting/implementing themselves the <code>-webkit-*</code> prefix, turning one single implementation into a new world-wide standard. It will turn a market share into a <em>de facto</em> standard, a single implementation into a world-wide monopoly. Again. It will kill our standardization process. That’s not a question of <em>if</em>, that’s a question of <em>when</em>.</p>
</blockquote>
<p>This idea has been floated in conversations for a few years, but this portion of Dan’s post represents an official discussion at the <span class="caps">CSS</span> Working Group. An <strong>official discussion</strong> that Adobe, Apple, Disruptive Innovations, Google, <span class="caps">HP</span>, Microsoft, Mozilla, Opera and the W3C were all participating in.</p>
<p>While it is true that writing them all out is tedious, <a href="http://www.alistapart.com/articles/prefix-or-posthack/">vendor-specific prefixes serve a very valuable purpose: they allow a browser manufacturer to experiment with a property before it becomes an official part of the spec</a>. And during that experimental phase, the syntax can (and often does) change. If you use vendor-specific prefixes, <strong>you do so at your own risk</strong>. That’s not to say you shouldn’t use them, but it is to say that you should be careful about when and how you use them.</p>
<p>The value of vendor-specific prefixes is not really in question here though; they are not the problem. <strong>We are. </strong>We are apparently too lazy to implement <span class="caps">CSS</span> in a consistent cross-browser fashion. <span class="caps">WTF</span>?!</p>
<p>Please, I beg you: <strong>Take 10 minutes out of your day today and update every site you can to use the other vendor-specific prefixes (and non-prefixed) versions of each <code>-webkit-*</code> property you find, even if you’re not sure it exists yet</strong>. And if you need help, ask.</p>
<p><strong><span class="caps">UPDATE</span>:</strong> If you want to scan your server for files that might need adjustment, try this from the command line:</p>
```sh
  find /var/www -type f -name "*.css" -exec grep -il "webkit" {} \;
```
<p>If you want to run it locally on a Mac, you should change the folder to <code>~/Sites</code>.</p>
<p><strong><span class="caps">UPDATE</span> #2:</strong> I created a petition and a pledge:</p>
<ol>
<li>Tell Microsoft, Mozilla, and Opera not to implement the <code>-webkit-*</code> vendor prefix, and</li>
<li>Pledge to update every site you can to use the other vendor-specific prefixed (and non-prefixed) versions of each <code>-webkit-*</code> property you find, even if you’re not sure it exists yet</li>
</ol>
<p><a href="http://www.change.org/petitions/microsoft-mozilla-opera-dont-make-webkit-prefixes-a-de-facto-standard">Sign the petition “Don’t make -webkit- prefixes a de facto standard” on Change.org</a>.</p>
