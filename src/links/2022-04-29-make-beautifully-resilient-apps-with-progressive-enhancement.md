---
title: "Make Beautifully Resilient Apps With Progressive Enhancement"
date: 2022-04-29T16:14:04.855Z
tags: ["progressive enhancement", "JavaScript"]
ref_url: https://austingil.com/resilient-applications-progressive-enhancement/
in_reply_to: https://austingil.com/resilient-applications-progressive-enhancement/
twitter_text: "A good walkthrough on how to build a form that hooks into an API and works either with or without JavaScript."
ref_source: "Austin Gil"
---

A good walkthrough on how to build a form that hooks into an API and works either with or without JavaScript.

One note however: Austin in incorrect in that you absolutely can define nested objects in your forms. I’ve done it many times. Your field names just need to use bracket notation like this:

```html
<input name="foo['bar']['baz']" />
```

That will pipe through as the value for the <var>baz</baz> property of <var>bar</var> within <var>foo</var>.
