---
title: "JAIL-ing images in ExpressionEngine"
date: 2013-07-22 18:04:00
comments: true
tags:
  - "performance"
  - "web standards"
  - "HTML"
  - "CSS"
  - "JavaScript"
description: "A while back I came across a link to Sebastiano Armeli-Battana’s jQuery Asynchronous Image Loader ( JAIL ) and filed it away to revisit when I had some time. I finally made some time this weekend."
canonical: "https://blog.easy-designs.net/archives/jail-ing-images-in-expressionengine/"
---

<p>
	A while back I came across a link to <a href="https://github.com/sebarmeli/JAIL">Sebastiano Armeli-Battana’s jQuery Asynchronous Image Loader</a> (<span class="caps">JAIL</span>) and filed it away to revisit when I had some time. I finally made some time this weekend.</p>

<!-- more -->

<p>
<span class="caps">JAIL</span>’s a cool little script that takes care of lazy loading images for you in order to speed up initial page rendering. To use it, you implement the following markup pattern:</p>
```html
  <img class="jail" src="blank.gif" data-src="foo.png" alt=""/>
  <noscript>
   <img src="foo.png" alt=""/>
  <noscript>
```
<p>
	This is pretty ingenious actually. Without <span class="caps">JS</span>, the actual image is served up, but with JavaScript, the blank image is displayed until <span class="caps">JAIL</span> lazy loads the real image path stored in the <code>data-src</code> attribute. You initialize <span class="caps">JAIL</span> like this:</p>
```js
  $(function(){
   $('img.jail').jail();
  });
```
<p>
	Simple, right? Well, yes and no.</p>
<p>
	On a site that isn’t updated frequently and where a skilled front-end coder is involved, this is cake. That, however, is seldom the reality. Heck, even on this blog, remembering to use that pattern while authoring content in the backend is not terribly likely. I needed a way to make it easier. So I <a href="https://github.com/easy-designs/easy_jail.ee_addon">automated <span class="caps">JAIL</span> as an ExpressionEngine plug-in</a>.</p>
<p>
	With this plug-in I can automatically enable (or remove) <span class="caps">JAIL</span> at the template level with a simple tag pair: <code>exp:easy_jail:prep</code></p>
```html
  {exp:easy_jail:prep}
    {body}
  {/exp:easy_jail:prep}
```
<p>
	The plugin will hunt for any image elements inside the tag pair and convert them to use the <span class="caps">JAIL</span> markup pattern. By default, it uses a base-64 encoded representation of a blank <span class="caps">GIF</span> (a.k.a. a <a href="https://en.wikipedia.org/wiki/Data_URI_scheme">Data <span class="caps">URI</span></a>) to reduce the number of requests, but you can override that with the path to your own image (or a different Data <span class="caps">URI</span>) using the <code>blank_img</code> property. You can also customize the <code>class</code> used for the blank image using the <code>class_name</code> property.</p>
```html
  {exp:easy_jail:prep blank_img="/i/blank.gif" class_name="my_class"}
    {body}
  {/exp:easy_jail:prep}
```
<p>
	Then it’s just a matter of including the <span class="caps">JAIL</span> JavaScript code and executing it. You can, of course, include Sebastiano’s script and your <span class="caps">JAIL</span> config in your own JavaScript build, but the plug-in also includes a convenience function to drop it in for you. Simply add the <code>exp:easy_jail:js</code> tag before the close of the <code>body</code> element (after jQuery of course):</p>
```html
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
  <script>window.jQuery || document.write('<script src="/j/jquery.js"><\/script>')</script>
  {exp:easy_jail:js}
```
<p>
	As with the <code>exp:easy_jail:prep</code> tag, you can customize the JavaScript output using the <code>class_name</code> property to tell <span class="caps">JAIL</span> what to lazy load. You can also customize the <span class="caps">JAIL</span> configuraiton using the <code>config</code> property. Just pass in a valid <span class="caps">JSON</span> object describing the configuration you want. <span class="caps">JAIL</span> is pretty darn configurable. There are a ton of options available, but the most intriguing to me currently is <code>offset</code>. We’re using it here on the blog to load images when you scroll to within 300px of the top of the image. Here’s how you’d do that using the plug-in:</p>
```html
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
  <script>window.jQuery || document.write('<script src="/j/jquery.js"><\/script>')</script>
  {exp:easy_jail:js config="{offset:300}"}
```
<p>
	And there you have it. Simple, lazy loaded images without having to train content editors to author the relatively complex markup pattern. If you want to have a play, feel free to <a href="https://github.com/easy-designs/easy_jail.ee_addon">grab the code from Github</a> or <a href="https://github.com/easy-designs/easy_jail.ee_addon/fork">you can fork it and help us to make it even more useful</a>.</p>
