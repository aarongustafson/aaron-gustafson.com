---
title: "Death to bad DOM Implementations"
date: 2005-09-02 19:10:52
comments: true
tags:
  - "JavaScript"
  - "web development"
  - "best practices"
description: "I just encountered a DOM implementation issue in IE which took about three hours to solve (and like a year off my life). The story goes like this:"
canonical: "https://blog.easy-designs.net/archives/death-to-bad-dom-implementations/"
---

<p>I just encountered a DOM implementation issue in <abbr title="Internet Explorer">IE</abbr> which took about three hours to solve (and like a year off my life). The story goes like this:</p>
<p>I could not, for the life of me, figure out why a form submitted in Firefox was coming through perfectly while it was missing fields in <abbr title="Internet Explorer">IE</abbr>. The <a href="http://www.bizhub.biz/info/" title="Don't submit it unless you really want a PDF brochure or print sample">form in question</a> has some normal fields and some dynamically generated ones (if JavaScript is enabled). The normal stuff was coming through fine, but I was getting no values for the dynamically generated fields when the form was submitted in <abbr title="Internet Explorer">IE</abbr>. I checked the <code>$_REQUEST</code> variable (I am using <abbr title="Hypertext PreProcessor">PHP</abbr>) to see what was coming through, just to be sure.</p>

<!-- more -->

<p>I immediately figured it was missing <code>name</code> attributes, but I was using the proper syntax to create the input elements via the DOM (note: the actual <abbr title="JavaScript">JS</abbr> is more generic than this)</p>
```js
  var inpt = document.createElement('input');
  inpt.setAttribute('name', 'company');
```
<p>Indeed, when I looked at the page through the <a href="http://www.nils.org.au/ais/web/resources/toolbar/index.html">Web Accessibility Toolbar</a>’s <a href="http://www.nils.org.au/ais/web/resources/toolbar/documentation_v2en.html#tools">View Generated Source</a>, it was indeed missing the <code>name</code> attribute:</p>
```html
  <INPUT id=company maxLength=255>
```
<p>After about another hour or two of fruitless Google-ing, I finally typed in the magic phrase (<a href="http://www.google.com/search?q=setting+the+name+attribute+in+Internet+Explorer&amp;btnG=Search">setting the name attribute in Internet Explorer</a>) and ended up on Bennett McElwee’s <a href="http://www.thunderguy.com/semicolon/2005/05/23/setting-the-name-attribute-in-internet-explorer/">blog post of the same name</a>. Suddenly it was all clear and (as I expected) <abbr title="Internet Explorer">IE</abbr>’s botched implementation of the DOM’s <code>createElement</code> function was to blame.</p>
<p>According to the <a href="http://msdn.microsoft.com/library/default.asp?url=/workshop/author/dhtml/reference/properties/name_2.asp"><abbr title="Microsoft Developers Network">MSDN</abbr><abbr> page on the <code>name</code> attribute</abbr></a> (linked and quoted in the blog entry):</p>
<blockquote cite="http://msdn.microsoft.com/library/default.asp?url=/workshop/author/dhtml/reference/properties/name_2.asp">
<p>The NAME attribute cannot be set at run time on elements dynamically created with the createElement method. To create an element with a name attribute, include the attribute and value when using the createElement method.</p>
</blockquote>
<p>It continued with the following example:</p>
<blockquote cite="http://msdn.microsoft.com/library/default.asp?url=/workshop/author/dhtml/reference/properties/name_2.asp">
```js
  var oAnchor = document.createElement("<A NAME='AnchorName'></A>");
```</blockquote>
<p>The script “solution” Bennett posted was somewhat of a red herring, however, as Firefox would actually execute the <code>createElement</code> intended for <abbr title="Internet Explorer">IE</abbr> and end up with an element named “&lt;input name=”company” /&gt;” which would be rendered on the page as</p>
```html
  <<input name="company" /> id="company" maxlength="255" />
```
<p>Perhaps you can see why this would be problematic.</p>
<p>I augmented Bennett’s script slightly and renamed the function <code>createElementWithName</code> so I wouldn’t have to use it on every element I created in the script:</p>
```js
  function createElementWithName(type, name) {
   var element;
   // First try the IE way; if this fails then use the standard way
   if (document.all) {
   element =
   document.createElement('< '+type+' name="'+name+'" />');
   } else {
   element = document.createElement(type);
   element.setAttribute('name', name);
   }
   return element;
  }
```
<p>I am not a super fan of the reference to <code>document.all</code> as it feels so much like browser sniffing. I am up for suggestions to improve the function if you have any ideas.</p>
<p>Anyway, I am posting this to hopefully save someone else from the major headache I had today.</p>
