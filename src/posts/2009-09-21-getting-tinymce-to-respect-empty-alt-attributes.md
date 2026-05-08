---
title: "Getting TinyMCE to respect empty alt attributes"
date: 2009-09-21 12:36:24
comments: true
tags:
  - "accessibility"
  - "web development"
description: "This one took a little futzing around and digging through the TinyMCE forum to figure out, but it’s been nagging at me for a while. By default (or at least in the default configuration provided under the LG TinyMCE extension for..."
canonical: "https://blog.easy-designs.net/archives/getting-tinymce-to-respect-empty-alt-attributes/"
---

<p>This one took a little futzing around and digging through the <a href="http://tinymce.moxiecode.com/punbb/">TinyMCE forum</a> to figure out, but it’s been nagging at me for a while. By default (or at least in the default configuration provided under the <a href="http://leevigraham.com/cms-customisation/expressionengine/lg-tinymce/">LG TinyMCE extension for ExpressionEngine</a>), <a href="http://tinymce.moxiecode.com/">TinyMCE</a> will remove the <code class="html">alt</code> attribute if it is empty. Obviously, for accessibility and validation reasons, this is highly undesirable and needs correcting. Thankfully, the fix is pretty simple: add the following to your <a href="http://wiki.moxiecode.com/index.php/TinyMCE:Configuration">TinyMCE configuration options</a>:</p>
<script src="https://gist.github.com/easy-designs/313562.js"></script>
