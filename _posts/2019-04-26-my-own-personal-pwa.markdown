---
layout: post
title: "My own, personal, PWA"
date: 2019-04-26 09:00:39 -0700
comments: true
tags: ["progressive web apps", "this site"]
description: "While I was redoing the Service Worker implementation on this site —to improve performance for you, dear reader—I decided to throw in a little goody for me as well."
---

Progressive Web Apps are often something we think of as building for others, but while I was redoing the Service Worker implementation on this site—to improve performance for you, dear reader—I decided to throw in a little goody for me as well, in the form of the [Share Target](https://wicg.github.io/web-share-target/).

<!-- more -->

Early last year, [Tim Kadlec shared his bookmarklet for saving links to his site](https://timkadlec.com/remembers/2018-02-06-saving-links-to-my-site-with-a-bookmarklet/). I thought it was a brilliant setup, especially for a static site:

1. The bookmarklet captures the URL, page title, and any selection you’ve made and pipes it over to a form on your site;
2. The form contains the code that will generate a new static file in you site’s GitHub repo.

Smartly, the form requires you to log in with your GitHub credentials. That keeps it from being abused by others. Sadly, I always struggled to get this setup working fluidly on mobile. With the introduction of the Share Target, it’s become a lot easier.

You define a Share Target in your [Web App Manifest](https://developer.mozilla.org/docs/Web/Manifest). The original design only allowed for links and text to be shared, but version 2 is coming soon with support for any file type.[^1] Pretty cool stuff! As you’d expect, the key is `share_target` and it takes a JSON object that looks a lot like a form configuration:

```json
"share_target": {
  "action": "linky/poo/",
  "method": "GET",
  "enctype": "application/x-www-form-urlencoded",
  "params": {
    "title": "title",
    "text": "body",
    "url": "url"
  }
}
```

The first key is the `action` page. In this case, it points at my link posting form. I want the shared data passed via the query string, so I’m using GET as the method (but you could use other HTTP request methods as well). I set the encoding (`enctype`) and then identify the parameters I want to send and what they should be called in the payload.

With this in place, I installed my site on my phone and could immediately share links directly to it:

<figure id="fig-2019-04-26-01" class="media-container">
{% adaptive_image /i/posts/2019-04-26/share-target.png [alt="Screenshot of my PWA as a share target in Android"] %}
  <figcaption>This screenshot shows my PWA as a share target available within Android.</figcaption>
</figure>

On the receiving end, everything works pretty well. Android doesn’t support sharing selected text along with the title of the page and the URL (like Tim’s bookmarklet does), but I can always copy the text I want to quote before I share the page. Another oddity in Android is that it currently sends the URL over as the body for some strange reason, but I set the JavaScript up on the resulting page to enable me to look for a URL in that field and pop it into the right spot. That way, when Android fixes the issue, it won’t cause any issues with a true text body (like your text selection—hint, hint).

Another nice enhancement I added to the form was autocomplete for the tag field. Using [a `datalist` element](https://developer.mozilla.org/docs/Web/HTML/Element/datalist), I have all of my site’s tags ready to autocomplete that field. Unfortunately, autocomplete doesn’t work great for multiple items out of the box, so I got some inspiration from [this StackOverflow solution](https://stackoverflow.com/posts/47232367/revisions) and implemented [a vanilla JavaScript multiple choice `datalist`-driven input](https://github.com/aarongustafson/aaron-gustafson.com/blob/4bd713d2440edd1fd33dab3a22292af60b9e93b3/linky/poo.html#L353-L436). Sweet!

While we often think of PWAs as being something we build for others, I’m totally stoked that I can also add PWA functionality that’s just for me (or, more broadly, internally-focused). That’s pretty exciting and demonstrates just how powerful and adaptable PWAs are.

[^1]: Incidentally, the [Share Target implementation for Universal Windows Apps](https://docs.microsoft.com/en-us/windows/uwp/app-to-app/receive-data) has supported file type association for a long time now, which is why the Windows Store version of Twitter (which is a PWA) can receive images, videos, and more, right from the File Manager.