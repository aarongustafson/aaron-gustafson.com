---
title: "Inside Microsoft’s New Rendering Engine For The &quot;Project Spartan&quot;"
date: 2015-01-27 11:32:05 -05:00
comments: false
ref_url: http://www.smashingmagazine.com/2015/01/26/inside-microsofts-new-rendering-engine-project-spartan/
in_reply_to: http://www.smashingmagazine.com/2015/01/26/inside-microsofts-new-rendering-engine-project-spartan/
ref_source: Smashing Magazine
---

This is Microsoft’s Jacob Rossi on how “Project Spartan” came to be and what is going on inside the browser that comes after Internet Explorer.

On that elated feeling of removing legacy code:

> [S]wathes of IE legacy were deleted from the new engine. Gone were document modes. Removed was the subsystem responsible for emulating IE8 layout quirks. VBScript eliminated. Remnants like attachEvent, X-UA-Compatible, currentStyle were all purged from the new engine. The codebase looks little like Trident anymore (far more diverged already than even Blink is from WebKit).

On a faster dev cycle for the new browser:

> [W]e’ll treat Windows 10 as a service—keeping users up to date and delivering features when they are ready (“auto-update”), not waiting for the next major release. This means the new rendering engine will always be truly evergreen.

On opening up the process: 

> Another welcomed change that we’ve been rolling out over the past year is a promise for increased openness about our web platform plans and roadmap. Over the last year, you’ve hopefully experienced some of this through our open standards roadmap15 (one of my personal side projects), our Reddit AMA16, regular dialog through @IEDevChat17, and sharing preview builds18 very early in our development process. You’ll see more of this over the next year.

Promising stuff all around. I am still wondering if we’ll eventually see the new browser appear on other operating systems (even if it’s  just the browser chrome and not the rendering engine—like Chrome on iOS). Time will tell.