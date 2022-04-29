---
title: "Make Beautifully Resilient Apps With Progressive Enhancement"
date: 2022-04-29T16:14:04.855Z
tags: ["progressive enhancement", "JavaScript"]
ref_url: https://blog.pwabuilder.com/posts/announcing-pwa-studio-the-vs-code-extension-for-building-progressive-web-apps!/
in_reply_to: https://blog.pwabuilder.com/posts/announcing-pwa-studio-the-vs-code-extension-for-building-progressive-web-apps!/
twitter_text: "A good walkthrough on how to build a form that hooks into an API and works either with or without JavaScript."
ref_source: "Austin Gil"
---

A good walkthrough on how to build a form that hooks into an API and works either with or without JavaScript.

One note however: Austin in incorrect in that you absolutely can define nested objects in your forms. I’ve done it many times. Your field names just need to use bracket notation like this:

```
<input name="foo['bar']['baz']">
```

That will pipe through as the value for the <var>baz</baz> property of <var>bar</var> within <var>foo</var>.
