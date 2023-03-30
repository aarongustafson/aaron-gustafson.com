---
title: "Speeding Things Up with Service Worker, Resource Hints, and More"
date: 2015-11-20 16:39:09 -05:00
comments: true
tags: ["web design","progressive enhancement",experiments,"web development"]
description: "User experience encompasses more than just the interface. Download speed, render performance, and the cost of accessing a site are often overlooked areas when it comes to the practice of UX, but they all affect how users experience what we build on the Web."
---

User experience encompasses more than just the interface. Download speed, render performance, and the cost of accessing a site are often overlooked areas when it comes to the practice of UX, but they all affect how users experience what we build on the Web.

<!-- more -->

I’m always looking for ways to improve these aspects of my own site. And, since it’s my own personal playground, I often use it as a test-bed for new technologies, ideas, and techniques. My latest adventure was inspired by a bunch of [articles and posts I’ve linked to recently](https://www.aaron-gustafson.com/notebook/links/), especially

* [Jeremy Keith’s “My First Service Worker”](https://adactio.com/journal/9775),
* [Nicolas Bevacqua’s “Making a Simple Site Work Offline with ServiceWorker”](https://css-tricks.com/serviceworker-for-offline/),
* [Dean Hume’s “Service Workers: Dynamic Responsive Images Using Webp Images”](http://deanhume.com/Home/BlogPost/service-workers--dynamic-responsive-images-using-webp-images/10132/), and
* [Malte Ubl’s “Not so micro optimizations”](https://medium.com/@cramforce/not-so-micro-optimizations-f867c47b832d#.satdv0fap)

After reading these pieces, I decided to see how much I could do to improve the performance of this site, especially on posts with a lot of images and embedded code samples, like [my recent post on form labels](https://www.aaron-gustafson.com/notebook/labeled-with-love/).

## Using Resource Hints

To kick things off, I followed Malte’s advice and used [Resource Hints](https://w3c.github.io/resource-hints/) to *prime the pump* for any third-party servers hosting assets I use frequently (e.g. Disqus, Twitter, etc.). I used the code Malte references in [the AMP Project](https://github.com/ampproject/amphtml) as my starting point and [added two new methods (`preconnect()` and `prefetch()`) to my global `AG` object](https://github.com/aarongustafson/aaron-gustafson.com/blob/main/src/_javascript/main/resource-hints.js). With that library code in place, I can call those methods as necessary from within my other JavaScript files. Here’s a simplified extract from [my Disqus integration script](https://github.com/aarongustafson/aaron-gustafson.com/blob/old-jekyll/_javascript/post/disqus.js.removed):

```js
if ( 'AG' in window && 'preconnect' in window.AG ) {
  window.AG.preconnect( '//disqus.com/' );
  window.AG.prefetch( '//' + disqus_shortname + '.disqus.com/count.js' );
}
```

While a minor addition, the speed improvement in [supporting browsers](http://caniuse.com/#search=resource%20hints) was noticeable.[^1] 

## Integrating Service Worker

With that in the bag, I set about making my first [Service Worker](http://www.w3.org/TR/service-workers/). I started off gently, using Dean’s piece as a guide. I added a WebP conversion bit to [my image processing Gulp task](https://github.com/aarongustafson/aaron-gustafson.com/blob/old-jekyll/_tasks/gulp/images.js) to get the files in place and then I created the Service Worker. By default, [Dean’s code](https://gist.github.com/deanhume/c04478df744ce833925c#file-client-hints-service-worker-js) converts *all* JPG and PNG requests to WebP responses, so I set it up to limit the requests to only those files being requested directly from my server. I have no way of knowing if WebP equivalents of every JPG and PNG exist on the open web (probably not), but I know they exist on my server. Here’s the updated code:

```js
"use strict";

self.addEventListener('fetch', function(event) {

    var request = event.request,
        url = request.url,
        url_object = new URL( url ),
        re_jpg_or_png = /\.(?:jpg|png)$/,
        supports_webp = false, // pessimism
        webp_url;

    // Check if the image is a local jpg or png
    if ( re_jpg_or_png.test( request.url ) &&
         url_object.origin == location.origin ) {

        // console.log('WORKER: caught a request for a local PNG or JPG');

        // Inspect the accept header for WebP support
        if ( request.headers.has('accept') )
        {
            supports_webp = request.headers.get('accept').includes('webp');
        }

        // Browser supports WebP
        if ( supports_webp )
        {
            // Make the new URL
            webp_url = url.substr(0, url.lastIndexOf('.')) + '.webp';

            event.respondWith(
                fetch(
                    webp_url,
                    { mode: 'no-cors' }
                )
            );
        }
    }
});
```

When I began tucking to the caching possibilities of Service Workers, following Nicolas’ and Jeremy’s posts, I [opted to tweak Nicholas’ caching setup a bit](https://github.com/aarongustafson/aaron-gustafson.com/blob/old-jekyll/_javascript/serviceworker/fetch.js). I’m still not completely thrilled with it, but it’s a work in progress. I’m sure I will tweak as I get more familiar with the technology.

To keep my Service Worker code modularized (like my other JavaScript code), I opted to [break it up into separate files](https://github.com/aarongustafson/aaron-gustafson.com/tree/main/src/_javascript/serviceworker) and am using Gulp to merge them all together and move the combined file into the root of the site. If you’d like to follow a similar path, feel free to adapt this Gulp task (which builds all of my JavaScript):

```js
var gulp = require('gulp'),
    path = require('path'),
    folder = require('gulp-folders'),
    gulpIf = require('gulp-if'),
    insert = require('gulp-insert'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    //handleErrors = require('handleErrors'),
    source_folder = 'source/_javascript',
    destination_root = 'source',
    destination_folder = destination_root + '/j',
    public_root = 'public'
    public_folder = public_root + '/j',
    rename_serviceworker = rename({
        dirname: "../"
    });

gulp.task('scripts', folder(source_folder, function(folder){
    return gulp.src(path.join(source_folder, folder, '*.js'))
        .pipe(concat(folder + '.js'))
        .pipe(insert.transform(function(contents, file){
            // insert a build time variable
            var build_time = (new Date()).getTime() + '';
            return contents.replace( '{{BUILD_TIME}}', build_time );
         }))
        .pipe(gulp.dest(destination_folder))
        .pipe(gulp.dest(public_folder))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulpIf(folder=='serviceworker',rename_serviceworker))
        .pipe(gulp.dest(destination_folder))
        .pipe(gulp.dest(public_folder))
        .pipe(notify({ message: 'Scripts task complete' }));
        //.on('error', handleErrors);
}));
```

As most of the walkthroughs recommended that you version your Service Worker if you’re doing any caching, I set mine up to be auto-versioned by inserting a timestamp (lines 23-27, above) into my Service Worker header file (line 3, below):

```js
'use strict';

var version = 'v{{BUILD_TIME}}:',
    default_avatar = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&f=y',
    missing_image = 'https://i.imgur.com/oWLuFAa.gif';
```

Service Workers are still pretty new (and [modestly supported](http://caniuse.com/#feat=serviceworkers)), but it’s definitely interesting to see what’s possible using them. [Like Jeremy](https://adactio.com/journal/9844), I want to do a bit more exploration into caching and how it may actually *increase* the monetary cost of accessing a website if not used properly. Like any powerful tool, we need to wield it wisely.

<figure id="fig-2015-11-20-01">

<img src="https://media.giphy.com/media/dlmcYrvalMmAw/giphy.gif" alt="Animated GIF of a guy accidentally launching a board into his helper while power sanding." loading="lazy">

</figure>

## Making Gists Static

On particularly code-heavy posts (yes, like this one), I make liberal use of Gists. They’re quite useful, but [the Gist plugin for Jekyll](https://gist.github.com/BinaryMuse/803483), while good, still requests a script from Github in order to load the pretty printed version of the Gist. On some posts, that can mean 5 or more additional network requests, not to mention execution time for the JavaScript. It’s yet another dependency that could prohibit you from quickly getting to the content you’re looking for. Additionally, [if JavaScript should be available, but isn’t](https://gds.blog.gov.uk/2013/10/21/how-many-people-are-missing-out-on-javascript-enhancement/), you get nothing (since the `noscript` content is only evaluated if JavaScript support isn’t available or if a user turns it off).

With all of this in mind, I decided to revise the plugin and make it capable of downloading the JavaScript code directly. It then extracts the HTML markup that the JavaScript would be writing into the page and just embeds it directly. It also caches the result, which is handy for speeding up the build process.

You can grab [my fork of the Gist Jekyll Plugin as, well, a Gist](https://gist.github.com/aarongustafson/b98add8f3580f6707cf5). It’s also [in the source of this site on Github](https://github.com/aarongustafson/aaron-gustafson.com/blob/old-jekyll/_plugins/gist_tag.rb).

## (Hopefully) A Little Faster

All told, these changes have gotten the render time of this site down significantly across the board.[^2] Even more so on browsers that support Service Workers and Resource Hints. I’ll likely continue tweaking as I go, but I wanted to share my process, code, and thoughts in case any of it might be useful to you in your own work. In the end, it’s all about creating better experiences for our users. How our sites perform is a big part of that.

[^1]: Sadly I forgot to run some speed tests prior to rolling out this change and I didn’t feel like rolling back the site, so I don’t have solid numbers for you. That said, it seemed to shave nearly 2 seconds off of the load time on heavy pages like the post I mentioned.
[^2]: Again, I don’t have the numbers, but I am routinely seeing `DOMContentLoaded` reached between 400-600ms with Service Worker caching in play.
