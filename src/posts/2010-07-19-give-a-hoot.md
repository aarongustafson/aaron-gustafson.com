---
title: "Give a hoot"
date: 2010-07-19 19:06:57
comments: false
tags:
  - "performance"
  - "HTML"
  - "CSS"
  - "JavaScript"
  - "web development"
description: "As any competent JavaScript knows, it’s not cool to litter the global namespace with variables, functions, and the like. It’s far better to encapsulate your code in an object, a series of objects, or even a closure, exposing only what..."
canonical: "https://blog.easy-designs.net/archives/give-a-hoot/"
---

<p>As any competent JavaScript knows, it’s not cool to litter the global namespace with variables, functions, and the like. It’s far better to encapsulate your code in an object, a series of objects, or even a closure, exposing only what you absolutely need to via the global namespace. This helps reduce the potential for collisions that will probably cause your site to break.</p>

<!-- more -->

<p>Occasionally, however, even closures won’t help you trap a given variable. Case in point:</p>
```js
  (function(){
   var a = b = 0;
  })();
```
<p>If you’re familiar with languages like <span class="caps">PHP</span>, you might think this simple closure creates two variables with the same value, but you’d be wrong. It creates a local variable, <code class="js">a</code> and a global variable <code class="js">b</code>, both of which have their value set to 0.</p>
```php
  <?php
  
  function example()
  {
   $a = $b = 0;
  }
  
  ?>
```
<p>In exp:easy_gists this means of sharing the value assignment of variables is perfectly legit; the difference, however, is how JavaScript and <span class="caps">PHP</span> treat variable scope. By default, every variable declared in <span class="caps">PHP</span> is scoped to the function it is called within. Global variables only come into play when you use the <code class="php">global</code> declaration or the <code class="php">$_GLOBALS</code> array. In JavaScript, by contrast, any variables not instantiated with a <code class="js">var</code> are added to the global namespace. Hence the namespace pollution in the above example.</p>
<p>Revisiting the closure, it’s best to rewrite it in one of two ways to maintain the variable scope:</p>
```js
  (function(){
   var a = 0, b = 0;
  })();
```
<p>or</p>
```js
  (function(){
   var a = 0, b = a;
  })();
```
<p>Which solution will work best is dependent solely on context. If you’re minifying the code and the value being assigned is anything more than a single character, the latter is probably the way to go.</p>
<p>To help you discover and mitigate pollution in your own scripts (or to help you see what additions your standard JavaScript libraries are making to the global namespace), I’ve created a little script called <a href="http://github.com/easy-designs/EmissionsTest.js">EmissionsTest.js</a>. It’s pretty easy to use, you simply include it as the first script on your page (preferably in the <code class="html">head</code> of your document) and it does the rest. It will attempt to report its findings to the console (if your browser has one) or it will create a floating notice at the top of the page.</p>
<p>You won’t want to include this script on a production site and it’s still pretty basic, but it could be very useful for tracking down any accidental emissions in your script.</p>
