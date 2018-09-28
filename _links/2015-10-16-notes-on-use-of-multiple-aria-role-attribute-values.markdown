---
layout: link
title: "Notes on use of multiple ARIA role attribute values"
date: 2015-10-16 17:07:04 -0400
comments: false
ref_url: https://www.paciellogroup.com/blog/2015/10/notes-on-use-of-multiple-aria-role-attribute-values/
in_reply_to: https://www.paciellogroup.com/blog/2015/10/notes-on-use-of-multiple-aria-role-attribute-values/
ref_source: The Paciello Group
---

Did you know the ARIA `role` attribute allows for multiple values? It’s how `role` supports fault tolerance: the first value (of the space separated list) is applied, but if the assistive technology in use doesn’t understand it, the second value will be tried, etc. until a usable alternative is found. It works a lot like font stacks.