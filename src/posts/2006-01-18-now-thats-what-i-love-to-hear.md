---
title: "Now that’s what I love to hear"
date: 2006-01-18 18:07:40
comments: false
tags:
  - "JavaScript"
  - "developer tools"
description: "I got an email the other day from Steven Mading, a developer at the BioMagnetic Resonance Bank at the University of Wisconsin . In it, he shared his experience using jsTrace and, with his permission, I’m sharing it with all of you:"
canonical: "https://blog.easy-designs.net/archives/now-thats-what-i-love-to-hear/"
---

<p>I got an email the other day from Steven Mading, a developer at the <a href="http://www.bmrb.wisc.edu">BioMagnetic Resonance Bank at the University of Wisconsin</a>. In it, he shared his experience using <a href="http://www.easy-designs.net/code/jsTrace/">jsTrace</a> and, with his permission, I’m sharing it with all of you:</p>
<blockquote>
<p>I just thought I’d give a quick thank you to you for the little jsTrace JavaScript utility you made available online. I found it from a Google search and it was exactly what I needed.</p>

<!-- more -->

<p>It really helped me a lot.  I had a problem with some widgets on an <abbr title="HyperText Markup Language">HTML</abbr> form that had a lot of JavaScript hooks (things like <code>onblur</code>, <code>onclick</code>, <code>onfocus</code>, etc). The events were occurring in a weird order and I couldn’t trace what was happening. Using the standard <code>alert()</code> function was useless because making an alert window <abbr title="Short for POP3, the Post Office Protocol for email">POP</abbr> up caused the events to be different and changed the relevant behavior (since <code>onfocus</code> and <code>onblur</code> were a relevant part of the behavior, popping up a window changes the focus and invalidates the debugging information when what I’m trying to do is figure out why the focus changes aren’t happening the way I expect.)</p>
<p>Your jsTrace allowed me to figure out the problem (which, as it turns out, was that when I clicked on Widget B, I was calling BOTH the <code>onclick</code> for Widget B and the <code>onblur</code> for Widget A, but not always in a predictable order). So once I knew that was happening, I was able to redesign my code to work either way and thus fix the bug.</p>
<p>Again, thank you for making this tool publicly available.</p>
</blockquote>
<p>I love it when things work out like that. It makes it all worthwhile.</p>
<p>Have you had an experience with using <a href="http://www.easy-designs.net/code/jsTrace/">jsTrace</a> that you’d like to share? Do you use it or  any <a href="http://www.easy-designs.net/code/">other scripts we’ve built</a> often? Are any of the user enhancement scripts in use on production websites? Let us know your thoughts, good or bad.</p>
