---
title: "Enabling Webmentions in Jekyll"
date: 2014-11-18 17:01:08 -05:00
comments: true
categories:
  ["blogging", "web design", "indie web", "self-publishing", "decentralization"]
description: "A chronicle of my effort to get webmentions and Jekyll playing nicely together."
redirect_from: /notebook/2014/enabling-webmentions-in-jekyll/
---

While I am really happy with my choice to move away from a dynamic website/blog to a static one—powered by [Octopress](http://octopress.org/), hosted for free on [Github](https://github.com)—it’s been pretty limiting when it comes to integrating comments and other more necessarily dynamic components.

<!-- more -->

Like many folks in the Octopress/Jekyll community, I’ve opted to use [Disqus’ free service to manage comments](https://disqus.com/websites/), but I’m not in love with it. First of all, it requires JavaScript. You know [my stance on that](/notebook/2014/a-fundamental-disconnect/). Now I’m willing to accept comments as an [enhancement](https://en.wikipedia.org/wiki/Progressive_enhancement) to the reading process, but it doesn’t mean I like the situation. Secondly, they control the content and if they go away, so do all of your comments.

I’ve become quite intrigued by the potential of [webmentions](https://indiewebcamp.com/webmention) as a way of taking back control of our content. They are a brilliant way to loosely connect related posts on personal blogs and third-parties like Twitter, Facebook, and Google+. With my mind unable to think about anything else, I decided to see what it would take to get webmentions up and running here.

At first I went to [Aaron Parecki](https://aaronparecki.com/)’s [webmention.io](https://webmention.io) project and looked through [the docs](https://github.com/aaronpk/webmention.io/blob/master/README.md). It looked like it could fit the bill, but I noticed there was no way to directly apply for an account, so I moved on to [Pelle Wessman](https://voxpelli.com/)’s [webmention Heroku app](https://webmention.herokuapp.com/).

I really like Pelle’s solution and easily implemented it locally, but the JavaScript reliance was nagging at me. I returned to webmention.io and decided to [reach out to Aaron](https://twitter.com/aarongustafson/status/534394789152948224) on the off change he’d give me access to his service. [He responded pretty quickly](https://twitter.com/aaronpk/status/534398408815964160) and I was off to the races.

In preparation for building my plugin, I looked over a few other Jekyll plugins (Octopress is built on Jekyll) and got a sense of the structure and how to go about creating a [Liquid tag](https://github.com/Shopify/liquid/wiki/Liquid-for-Programmers#create-your-own-tags) (Liquid being the default templating language used by Jekyll). Then I created a new Ruby file and got cracking. Now I’ll warn you, I don’t normally write Ruby. The last time I did it professionally was when [Rails was at 0.12](https://github.com/rails/rails/tree/v0.12.0), so that should tell you something. That said, it was pretty easy to get back into the flow and I managed to put together [a basic Liquid Tag for webmentions and webmention counts](https://github.com/aarongustafson/jekyll-webmention_io) in about two hours.

The tag to display webmentions for a page is pretty simple:

```liquid
{% raw %}{% webmentions YOUR_URL %}{% endraw %}
```

This tag outputs a container `div` and an ordered list of every webmention found when the site is generated (or previewed). To show the current webmention count, you use a slightly different tag which just outputs a number:

```liquid
{% raw %}{% webmention_count YOUR_URL %}{% endraw %}
```

These two tags allows me to bypass the JavaScript used in webmention.io’s integration examples and have Ruby consult the API directly. The plugin then creates the necessary markup using the JSON data the API provided.

Unfortunately, Liquid tags are only processed by Jekyll when the site is compiled. The actual site exists only as static HTML files on Github’s servers, so any webmentions created after I generate the site won’t show up. That’s a little less than ideal.

I don’t regenerate the site that often, nor do I want to set up a cron to automatically do it in order to update the webmentions. I took the afternoon to mull over some options to address this challenge. _How do I add in missing webmentions dynamically when the site itself is static?_

Then it dawned on me: JavaScript can fill in the gaps. Using the examples Aaron had put together, I cobbled together a script to update the webmention list and fill in any missing mentions. In the interest of reducing dependencies, I used [the infamous Vanilla.js library](http://vanilla-js.com) to create and insert new webmentions when the page was loaded.

And, as an added bonus, I adapted another bit of Aaron’s code to make the webmention list update in real time as new mentions are created elsewhere on the Web. The code uses [WebSockets](http://www.w3.org/TR/websockets/), [if available](http://caniuse.com/#feat=websockets), to make the magic happen. It’s pretty nifty and I tip my hat to Aaron for implementing that feature in the webmention.io service.

It’s been a pretty fun mini-project. In the end, I created a useful bit of kit that provides three distinct experiences:

1. Static webmentions collected when the site was generated form the baseline experience;
2. JavaScript-enabled browsers get any webmentions that were published since I last generated the site; and
3. JavaScript-enabled browsers with WebSockets support get real-time updates with any webmentions that are published after the page loads.

And, even better, the next time I generate the site, any missing webmentions will be inserted into the static files for safe keeping.

That’s a pretty nice continuum of experience if you ask me.

If you are a Jekyll or Octopress user, you can pick up [the plugin and optional JavaScript file on Github](https://github.com/aarongustafson/jekyll-webmention_io). Feel free to fork and sent me your bug fixes and enhancements.
