---
title: "When IE gave us beautiful, fast touch interactions, and nobody cared"
description: "I never even saw this proposal, but how cool would it be to set snap points for scrolling content in  CSS?!"
date: 2015-03-16 17:26:36 -04:00
comments: false
ref_url: https://paulbakaus.com/2015/03/13/when-ie-gave-us-beautiful-fast-touch-interactions-and-nobody-cared/
in_reply_to: https://paulbakaus.com/2015/03/13/when-ie-gave-us-beautiful-fast-touch-interactions-and-nobody-cared/
ref_source: The Sea of Ideas
---

I never even saw this proposal, but how cool would it be to set snap points for scrolling content in CSS?!

```css
.container {
  width: 500px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  /* Set up points to which scrolling will snap */
  -ms-scroll-snap-points-x: snapInterval(0px, 100%);
  /* Require that scrolling always end at a snap point */
  -ms-scroll-snap-type: mandatory;
}
```
