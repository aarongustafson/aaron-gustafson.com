---
title: "Debugging JavaScript just got a little bit easier"
date: 2005-10-27 01:59:39
comments: true
tags:
  - "JavaScript"
  - "developer tools"
  - "web development"
description: "Like many of you, I’m sure, I hate debugging JavaScript. Really, it’s not the debugging, per se , as much as it’s using alert() to echo stuff out to the screen. It’s stupid and distracting and takes for ever if you’re debugging a lot of..."
canonical: "https://blog.easy-designs.net/archives/debugging-javascript-just-got-a-little-bit-easier/"
---

<p>Like many of you, I’m sure, I hate debugging JavaScript. Really, it’s not the debugging, <dfn lang="la" title="in itself">per se</dfn>, as much as it’s using <code>alert()</code> to echo stuff out to the screen. It’s stupid and distracting and takes for ever if you’re debugging a lot of stuff.</p>

<!-- more -->

<p>For the last few months, I’ve been toying with a few different means of error reporting and echoing out debugging information, but hadn’t been really satisfied with anything I’d come up with. I used to do quite a bit of Flash work back in the day (before Dave came along and put my best efforts to shame) and always loved the Trace window. I liked that you could just echo stuff out to it and it acted as a running tally of pretty much anything you wanted to track: variable values, messages, etc. Two days ago I decided that was what I wanted for JavaScript.</p>
<p>I toyed with the idea of spawning a popup and tracing the info to that, but I don’t like popups. They are possibly more annoying than alert messages (well… maybe not). I decided to echo the messages out to a <code>div</code> on the page instead. Then feature creep set in. Before I knew it, it was a draggable, scalable window with some nifty features. Never one to be selfish, I thought other people could find a use for it too, so I’ve released it for anyone who wants it: <a href="http://www.easy-designs.net/code/jsTrace/">here it is</a>. Use it, play with it and improve on it as you see fit.</p>
<p>The script currently has the following features:</p>
<ul>
<li>the window drags & scales,</li>
<li>you can output a delimeter quickly to help further organize your tracing,</li>
<li>you can quickly clear the window,</li>
<li>the system is <em>very</em> easy to implement (even for a novice DOM scripter), and</li>
<li>it’s easily removable once your debugging is complete.</li>
</ul>
<p>Special thanks go out to <a href="http://www.youngpup.net/">Aaron Boodman</a>, whose <a href="http://www.youngpup.net/2001/domdrag">DOM Drag</a> was perfect for the dragging <em>and</em> enabled me to hook up a window stretcher pretty easily, <a href="http://www.clagnut.com">Richard Rutter</a>, whose <a href="http://www.clagnut.com/blog/1405/">Browser Stickies</a> were also somewhat of an inspiration, and Dave, for helping me debug the scaling code.</p>
<p>Aside: one nice feature of the script is that, once it was operational, I was able to use it to debug itself… how cool is that?</p>
