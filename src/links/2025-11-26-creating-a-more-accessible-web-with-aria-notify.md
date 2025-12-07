---
title: "Creating a more accessible web with ARIA Notify"
date: 2025-11-26T18:40:45.708Z
tags: ["accessibility", "JavaScript"]
ref_url: https://blogs.windows.com/msedgedev/2025/05/05/creating-a-more-accessible-web-with-aria-notify/
in_reply_to: https://blogs.windows.com/msedgedev/2025/05/05/creating-a-more-accessible-web-with-aria-notify/
twitter_text: "ARIA Notify looks like it could solve a lot of problems with screen reader announcements by simplifying the process."
ref_source: "Microsoft Edge Blog"
---

I just saw this very exciting announcement on the Edge Dev Blog:

> ARIA Notify is an ergonomic and predictable way to tell assistive technologies (ATs), such as screen readers, exactly what to announce to users and when.
> 
> In its simplest form, developers can call the ariaNotify() method with the text to be announced to the user.

Here’s what it looks like:

```js
// Dispatch a normal priority notification
document.ariaNotify(
  "Background task completed",
  { "priority": "normal" }
);
```

I’m particularly excited by this because of how much it simplifies the update process for engineers. Previously they needed to manage upates to an `aria-live` DOM node with the appropriate announcement level and hope for the best. This approach was plagued with issues ranging from lag — because, DOM manipulation — to confusion between whether "polite" or "assertive" was the right choice.

The ARIA Notify proposal is clear, concise, and far more likely to get used and — more importantly — used properly.

It’s currently in Origin Trial. Please give your feedback so we can get this into every browser sooner rather than later.
