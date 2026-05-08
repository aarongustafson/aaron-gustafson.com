---
title: "A better createElementWithName()"
date: 2007-08-27 14:43:59
comments: true
tags:
  - "JavaScript"
  - "web standards"
description: "Back in 2005, I wrote a piece about IE ’s abysmal generation of NAME d elements via the DOM (which, interestingly enough, has proven to be one of the most popular posts on the blog, pointing to the fact that this is an obvious pain..."
canonical: "https://blog.easy-designs.net/archives/a-better-createelementwithname/"
---

<p>Back in 2005, I wrote <a href="/notebook/death-to-bad-dom-implementations/">a piece about <abbr title="Internet Explorer">IE</abbr>’s abysmal generation of <code>NAME</code>d elements via the DOM</a> (which, interestingly enough, has proven to be one of the most popular posts on the blog, pointing to the fact that this is an obvious pain point for many DOM scripters out there). The the time, I wrote</p>

<!-- more -->

```js
  function createElementWithName( type, name ){
   var element;
   // First try the IE way; if this fails then use the standard way
   if( document.all ){
   element =
   document.createElement( '< '+type+' name="'+name+'" />' );
   }else{
   element = document.createElement( type );
   element.setAttribute( 'name', name );
   }
   return element;
  }
```
<p>It was a complete hack, but it worked. More importantly, however, it began a discussion of a better way to fix the problem in a cross-browser way. The best solution offered was <a href="http://www.arantius.com/" rel="external">Anthony Lieuallen</a>’s very efficient one-time function definition:</p>
```js
  function createElementWithName(){}
  (function(){
   try {
   var el=document.createElement( '<div name="foo">' );
   if( 'DIV'!=el.tagName ||
   'foo'!=el.name ){
   throw 'create element error';
   }
   createElementWithName = function( tag, name ){
   return document.createElement( '<' + tag + ' name="' +
   name + '"></' + tag + '>' );
   }
   }catch( e ){
   createElementWithName = function( tag, name ){
   var el = document.createElement( tag );
   // setAttribute might be better here ?
   el.name = name;
   return el;
   }
   }
  })();
```
<p>And now <a href="http://lojic.com/blog/" rel="external">Brian Adkins</a> has refactored the script to be even fewer lines of code:</p>
```js
  var createElementWithName = ( function(){
   try {
   var el = document.createElement( '<div name="foo">' );
   if( el.tagName !== 'DIV' || el.name !== 'foo' ){
   throw 'create failed';
   }
   return function( tag, name ){
   return document.createElement( '<' + tag + ' name="' +
   name + '"></' + tag + '>' );
   };
   }catch( e ){
   return function( tag, name ){
   var el = document.createElement( tag );
   el.setAttribute( 'name', name );
   return el;
   };
   }
  })();
```
<p>Geat job Brian, thanks for sharing.</p>
