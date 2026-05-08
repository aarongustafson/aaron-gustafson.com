---
title: "Be a good localStorage neighbor"
date: 2010-08-02 12:17:28
comments: true
tags:
  - "JavaScript"
  - "best practices"
description: "Most JavaScript developers are keenly aware of what they add to the global object and do their best to namespace their work or sequester it in closures . Namespacing and closures reduce the likelihood that necessary functions and..."
canonical: "https://blog.easy-designs.net/archives/be-a-good-localstorage-neighbor/"
---

<p>Most JavaScript developers are keenly aware of what they add to the global object and do their best to <a href="http://www.dustindiaz.com/namespace-your-javascript/">namespace their work</a> or <a href="http://robertnyman.com/2008/10/09/explaining-javascript-scope-and-closures/">sequester it in closures</a>. Namespacing and closures reduce the likelihood that necessary functions and variables will be accidentally overwritten, causing errors to be thrown and interfaces to break. Unfortunately, <a href="http://dev.w3.org/html5/webstorage/#the-localstorage-attribute">the <code class="js">localStorage</code> API</a> (available in most modern browsers) doesn’t inherently support creating isolated caches for each script because the cache is site-specific and consists simply of key-value pairs. <a href="http://msdn.microsoft.com/en-us/library/ms531424(VS.85).aspx">Internet Explorer’s <code class="js">userData</code> behavior</a> (which is available all the way back to IE5) does support sequestering the cache to a degree because you need to provide a name for it, but the API doesn’t make a whole lot of sense and isn’t at all equivalent to <code class="js">localStorage</code>.</p>

<!-- more -->

<p>Using the native APIs, it’s quite easy to accidentally overwrite an existing key in the cache. Beyond that, a simple call to <code class="js">localStorage.clear()</code> will wipe out not only your own data, but anything else stored in the local cache. It’s not good.</p>
<p>While working on <a href="http://eCSStender.org">eCSStender</a>’s implementation of client-side caching, I came to realize the problems with the current state of things and sought to address them by implementing faux namespacing via prefixed keys. I’ve since copied that code out of eCSStender and created a small library named <a href="http://github.com/easy-designs/Squirrel.js">Squirrel.js</a> that not only evens out the differences between <code class="js">localStorage</code> and <code class="js">userData</code>, but also makes it easier to manage your client-side data store in a manner unlikely to cause issues with other scripts also using client-side caching.</p>
<p>Here is a quick rundown of how Squirrel.js works:</p>
```js
  // create a Squirrel instance
  var $S = new Squirrel( 'scale-song' );
  
  // write a value to the cache
  $S.write( 'doe', 'ray' );
  // read it back
  $S.read( 'doe' ); // 'ray'
  
  // write a value to a sub-cache
  $S.write( 'song', 'doe', 'a dear, a female dear' );
  // read back the original value
  $S.read( 'doe' ); // 'ray'
  // read back the sub-cached value
  $S.read( 'song', 'doe' ); // 'a dear, a female dear'
  
  // removing a single property from the sub-cache
  $S.remove( 'song', 'doe' );
  // try to read the sub-cached value
  $S.read( 'song', 'doe' ); // null
  // read the root value
  $S.read( 'doe' ); // 'ray'
  
  // add some more content to the sub-cache
  $S.write( 'song', 'doe', 'a dear, a female dear' );
  $S.write( 'song', 'ray', 'a drop of golden sun' );
  // clear the whole sub-cache
  $S.clear( 'song' );
  // check that it's been cleared
  $S.read( 'song', 'doe' ); // null
  $S.read( 'song', 'ray' ); // null
  // check that the root value's still instact
  $S.read( 'doe' ); // 'ray'
  
  // remove a property form the main cache
  $S.remove( 'doe' );
  // check it's value
  $S.read( 'doe' ); // null
  
  // write a bit more data in the root and in a sub-cache
  $S.write( 'doe', 'ray' );
  $S.write( 'song', 'doe', 'a dear, a female dear' );
  $S.write( 'song', 'ray', 'a drop of golden sun' );
  // clear the whole cache
  $S.clear();
  // check it's all gone
  $S.read( 'song', 'doe' ); // null
  $S.read( 'song', 'ray' ); // null
  $S.read( 'doe' ); // null
```
<p>For more, check out <a href="http://github.com/easy-designs/Squirrel.js">the Github page</a>. Feel free to let me know your thoughts on how easy it is to use and how it can be improved.</p>
