---
title: "A new “onload” scheme"
date: 2010-01-18 21:30:45
comments: true
tags:
  - "web standards"
  - "HTML"
  - "CSS"
  - "JavaScript"
  - "web development"
description: "A few projects back, I decided to rethink our JavaScript organization strategy and came up with a new technique that, I think, helps us better manage behaviors from page to page."
canonical: "https://blog.easy-designs.net/archives/a-new-onload-scheme/"
---

<p>A few projects back, I decided to rethink our JavaScript organization strategy and came up with a new technique that, I think, helps us better manage behaviors from page to page.</p>

<!-- more -->

<p>For years, when I needed page-specific interactions, I would either embed the <span class="caps">JS</span> (unobtrusively, of course) at the bottom of the page or externalize it to a separate page-specific file. In some sites, that became a difficult setup to manage because we were juggling so many files and we were also forcing our users to download each of those files individually.</p>
<p>Looking for a better way to manage all of the code, I built <a href="http://github.com/easy-designs/FunctionHandler.js">FunctionHandler</a>. This script takes lets you declare blocks of JavaScript and then target them at pages based on the <code class="html">id</code> attribute on the <code class="html">body</code> element. When the targeted <code class="html">id</code> is encountered, the code block is executed on <span class="caps">DOM</span> ready. Here’s a quick example:</p>
```js
  FunctionHandler.register(
   ['home'],
   function(){
   alert("I'm gonna run some code here.");
   });
```
<p>As you can see, using it is pretty simple: you make a call to FunctionHandler’s <code class="javascript">register</code> method and pass it two arguments. The first is an array of the <code class="html">id</code> values you want this code block to execute on and the second is an anonymous function that wraps your code block.</p>
<p>What we’ve found really nice about this setup is that it encourages you to create discrete JavaScript components while, at the same time, easily allowing you to adjust the pages that those components run on by simply adding to or subtracting from the <code class="html">id</code> stack. You can even blanket every page with a given script by supplying a string value of “*” as the initial argument:</p>
```js
  FunctionHandler.register(
   '*',
   function(){
   // Typekit
   // Google Analytics
   // etc.
   });
```
<p>Anyway, I just wanted to take a brief moment to share this script because we’ve found it pretty handy. Perhaps you will too.</p>
<p><span class="caps">PS</span> - FunctionHandler is available in 3 flavors: native <span class="caps">JS</span>, jQuery, and Prototype.</p>
