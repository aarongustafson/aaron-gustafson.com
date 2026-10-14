---
title: "Flash of Faux Text"
date: 2015-01-27 08:56:47 -05:00
comments: false
ref_url: https://www.zachleat.com/web/foft/
in_reply_to: https://www.zachleat.com/web/foft/
ref_source: Zach Leatherman’s Blog
meta_description: "Zach Leatherman proposes loading a Roman font first, letting the browser synthesize bold and italic variants to reduce load time and reflow."
social_description: "Zach Leatherman proposes loading a Roman font first, letting the browser synthesize bold and italic variants to reduce load time and reflow. The real variants load later."
---

In his continuing exploration of font loading optimization, Zach Leatherman proposes loading a Roman (i.e. normal weight, non-italic) font first and letting the browser synthesize (i.e. fake) the bold, italic, etc. variants to reduce the load time and reflow of the document and let users start reading as soon as possible. Then he lazy loads the additional font weights and styles so the browser can swap out the synthesized glyphs for the actual ones.

Super clever stuff Zach!
