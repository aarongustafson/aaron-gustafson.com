---
title: "A new “onload” scheme"
date: 2010-01-18 21:30:45
comments: true
tags:
  - "JavaScript"
  - "web development"
description: "A few projects back, I decided to rethink our JavaScript organization strategy and came up with a new technique that, I think, helps us better manage behaviors from page to page."
canonical: "https://blog.easy-designs.net/archives/a-new-onload-scheme/"
atUri: "at://did:plc:6rmgrvblxflqh34omwywu6ib/site.standard.document/3mxrnwweiat2a"
image: "/i/share-cards/a-new-onload-scheme.jpg"
meta_description: "I reconsidered our JavaScript organization strategy and developed a technique for managing behaviors from page to page."
social_description: "A few projects back, I decided to rethink our JavaScript organization strategy and came up with a new technique that, I think, helps us better manage behaviors from page to page."
---

A few projects back, I decided to rethink our JavaScript organization strategy and came up with a new technique that, I think, helps us better manage behaviors from page to page.

<!-- more -->

For years, when I needed page-specific interactions, I would either embed the JS (unobtrusively, of course) at the bottom of the page or externalize it to a separate page-specific file. In some sites, that became a difficult setup to manage because we were juggling so many files and we were also forcing our users to download each of those files individually.

Looking for a better way to manage all of the code, I built [FunctionHandler](http://github.com/easy-designs/FunctionHandler.js). This script takes lets you declare blocks of JavaScript and then target them at pages based on the `id`{.html} attribute on the `<body>`{.html} element. When the targeted `id`{.html} is encountered, the code block is executed on DOM ready. Here’s a quick example:

```js
  FunctionHandler.register(
   ['home'],
   function(){
   alert("I'm gonna run some code here.");
   });
```

As you can see, using it is pretty simple: you make a call to FunctionHandler’s `register`{.javascript} method and pass it two arguments. The first is an array of the `id`{.html} values you want this code block to execute on and the second is an anonymous function that wraps your code block.

What we’ve found really nice about this setup is that it encourages you to create discrete JavaScript components while, at the same time, easily allowing you to adjust the pages that those components run on by simply adding to or subtracting from the `id`{.html} stack. You can even blanket every page with a given script by supplying a string value of “\*” as the initial argument:

```js
  FunctionHandler.register(
   '*',
   function(){
   // Typekit
   // Google Analytics
   // etc.
   });
```

Anyway, I just wanted to take a brief moment to share this script because we’ve found it pretty handy. Perhaps you will too.

PS - FunctionHandler is available in 3 flavors: native JS, jQuery, and Prototype.
