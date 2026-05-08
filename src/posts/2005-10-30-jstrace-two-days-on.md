---
title: "jsTrace two days on"
date: 2005-10-30 01:04:04
comments: true
tags:
  - "JavaScript"
  - "web development"
description: "The reception for our latest script release , jsTrace , has been fantastic. From the write-up on the DOM Scripting Task Force blog to all of the emails and comments, it’s been great."
canonical: "https://blog.easy-designs.net/archives/jstrace-two-days-on/"
---

<p>The reception for our <a href="/notebook/debugging-javascript-just-got-a-little-bit-easier/">latest script release</a>, <a href="http://www.easy-designs.net/code/jsTrace/"><code>jsTrace</code></a>, has been fantastic. From <a href="http://domscripting.webstandards.org/?p=28">the write-up on the <abbr title="Document Object Model"><span class="caps">DOM</span></abbr> Scripting Task Force blog</a> to all of the emails and comments, it’s been great.</p>

<!-- more -->

<p>The past few days have seen many ideas, requests and enhancements sent my way. Some have been rolled into <a href="http://www.easy-designs.net/code/jsTrace/">the jsTrace 1.1 release</a> which I made public today. One such enhancement (brought to us by <a href="http://web.archive.org/web/20070205045737/www.io.com/~acroyear/">Joe Shelby</a>) I have dubbed “memory,” as it allows the debugging window to remember both its position and size the next time it is opened (via cookies). Further enhancements have been made to the underlying code to streamline development of additional tools for the bottom toolbar and the font size of the bottom toolbar has also been increased (per several requests).</p>
<p>I hope you all enjoy the improvements. Keep ‘em coming.</p>
<p><ins datetime="2005-10-31T9:42:55+00:00"><strong>Update:</strong> We’ve also been mentioned in <a href="http://www.domscripting.com/blog/display/30">DOMScripting.com</a>.</ins></p>
<p><ins datetime="2005-10-31T01:36:48+00:00"><strong>Another update (to 1.2):</strong> I added a buffer to handle traces executed prior to the <code>jsTrace</code> window being generated. The buffer is written to the viewport once it is generated.</ins></p>
