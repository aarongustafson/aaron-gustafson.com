---
title: "JAIL-ing images in ExpressionEngine"
date: 2013-07-22 18:04:00
comments: true
tags:
  - "performance"
  - "images"
  - "ExpressionEngine"
description: "A while back I came across a link to Sebastiano Armeli-Battana’s jQuery Asynchronous Image Loader ( JAIL ) and filed it away to revisit when I had some time. I finally made some time this weekend."
canonical: "https://blog.easy-designs.net/archives/jail-ing-images-in-expressionengine/"
atUri: "at://did:plc:6rmgrvblxflqh34omwywu6ib/site.standard.document/3mxrnwnsaq725"
image: "/i/share-cards/jail-ing-images-in-expressionengine.jpg"
meta_description: "A while back I came across a link to Sebastiano Armeli-Battana’s jQuery Asynchronous Image Loader (JAIL) and filed it away to revisit when I had some time."
social_description: "A while back I came across a link to Sebastiano Armeli-Battana’s jQuery Asynchronous Image Loader (JAIL) and filed it away to revisit when I had some time. I finally made some time this weekend."
---

A while back I came across a link to [Sebastiano Armeli-Battana’s jQuery Asynchronous Image Loader](https://github.com/sebarmeli/JAIL) (JAIL) and filed it away to revisit when I had some time. I finally made some time this weekend.

<!-- more -->

JAIL’s a cool little script that takes care of lazy loading images for you in order to speed up initial page rendering. To use it, you implement the following markup pattern:

```html
  <img class="jail" src="blank.gif" data-src="foo.png" alt=""/>
  <noscript>
   <img src="foo.png" alt=""/>
  <noscript>
```

This is pretty ingenious actually. Without JS, the actual image is served up, but with JavaScript, the blank image is displayed until JAIL lazy loads the real image path stored in the `data-src` attribute. You initialize JAIL like this:

```js
  $(function(){
   $('img.jail').jail();
  });
```

Simple, right? Well, yes and no.

On a site that isn’t updated frequently and where a skilled front-end coder is involved, this is cake. That, however, is seldom the reality. Heck, even on this blog, remembering to use that pattern while authoring content in the backend is not terribly likely. I needed a way to make it easier. So I [automated JAIL as an ExpressionEngine plug-in](https://github.com/easy-designs/easy_jail.ee_addon).

With this plug-in I can automatically enable (or remove) JAIL at the template level with a simple tag pair: `exp:easy_jail:prep`

```html
  {exp:easy_jail:prep}
    {body}
  {/exp:easy_jail:prep}
```

The plugin will hunt for any image elements inside the tag pair and convert them to use the JAIL markup pattern. By default, it uses a base-64 encoded representation of a blank GIF (a.k.a. a [Data URI](https://en.wikipedia.org/wiki/Data_URI_scheme)) to reduce the number of requests, but you can override that with the path to your own image (or a different Data URI) using the `blank_img` property. You can also customize the `class` used for the blank image using the `class_name` property.

```html
  {exp:easy_jail:prep blank_img="/i/blank.gif" class_name="my_class"}
    {body}
  {/exp:easy_jail:prep}
```

Then it’s just a matter of including the JAIL JavaScript code and executing it. You can, of course, include Sebastiano’s script and your JAIL config in your own JavaScript build, but the plug-in also includes a convenience function to drop it in for you. Simply add the `exp:easy_jail:js` tag before the close of the `<body>` element (after jQuery of course):

```html
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
  <script>window.jQuery || document.write('<script src="/j/jquery.js"><\/script>')</script>
  {exp:easy_jail:js}
```

As with the `exp:easy_jail:prep` tag, you can customize the JavaScript output using the `class_name` property to tell JAIL what to lazy load. You can also customize the JAIL configuraiton using the `config` property. Just pass in a valid JSON object describing the configuration you want. JAIL is pretty darn configurable. There are a ton of options available, but the most intriguing to me currently is `offset`. We’re using it here on the blog to load images when you scroll to within 300px of the top of the image. Here’s how you’d do that using the plug-in:

```html
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
  <script>window.jQuery || document.write('<script src="/j/jquery.js"><\/script>')</script>
  {exp:easy_jail:js config="{offset:300}"}
```

And there you have it. Simple, lazy loaded images without having to train content editors to author the relatively complex markup pattern. If you want to have a play, feel free to [grab the code from Github](https://github.com/easy-designs/easy_jail.ee_addon) or [you can fork it and help us to make it even more useful](https://github.com/easy-designs/easy_jail.ee_addon/fork).
