---
layout: post
title: "Indecisiveness and URLs"
date: 2014-12-16 10:23:15 -0500
description: "I have been struggling with some of my initial decisions with respect to URLs on this site and finally decided to make some changes before too many links to its content get out there."
comments: true
categories: ["web design","this site"]
---

If you know me, you know I am a pretty indecisive guy. It is not uncommon for [Kelly](https://twitter.com/shirleytemper) and I to spend 15 minutes or more just trying to figure out where we want to grab a meal.

<!-- more -->

What I’m trying to say (or rather excuse) is that I have been struggling with some of my initial decisions with respect to URLs on this site and finally decided to make some changes before too many links to its content get out there. I was a bit reluctant to do so as we all know [what Sir Tim Berners-Lee says](http://www.w3.org/Provider/Style/URI.html)

> Cool URIs don’t change.

Well, consider me uncool as I decided to change some things around here:

1. I dropped the year indicator from blog post URLs. I realized that the likelihood of me having two posts with the same name was pretty much nil, so it was unnecessary to disambiguate like that. Plus it would save me from having to create the annual archives I would feel compelled to make in order to justify the “2014“ directory in the URL.
2. I consolidated my book and article pages to [a single page or publications](/publications). I thought it might be nice to maintain them separately, but in retrospect that seems unnecessarily complicated.
3. I changed the URL to my speaking engagements from “events” to “speaking-engagements” as it just made more sense.

On the off chance you ever consider changing URLs on a Jekyll or Octopress site, I thought I’d share my process.

## Redirecting Old Links

I was quite concerned concerned about old links being broken in this site. It’s just not a good thing to do.

In a traditional hosting scenario, I could use `.htaccess` to set up [302 redirects](https://en.wikipedia.org/wiki/HTTP_302), but I am hosting on Github so that isn’t an option. On top of that, this site is built using Octopress (and Jekyll), so there is no dynamic system in place to programmatically manage those redirects.

Thankfully, there is [a plugin for Jekyll to manage redirects](https://github.com/jekyll/jekyll-redirect-from). With it, you can redirect from an an existing page in the YAML front matter using the `redirect_to` key or you can use the `redirect_from` key in the YAML front matter on the destination page. I ended up using the former for old pages (articles, books, and events), and the latter for blog posts.

The plugin covers all the bases. It generates pages at the old URLs that redirect using the good old `meta` refresh, a JavaScript redirect, and a fallback link just in case neither of those work. Oh, and it sets the new URL as the [canonical reference](https://support.google.com/webmasters/answer/139066?hl=en) to boot.

Done and done.

## Keeping Webmentions

As I mentioned a few weeks back, I wrote [a Jekyll plugin to enable webmentions](/notebook/enabling-webmentions-in-jekyll/). As web mentions are tied to the “mentioned” URL, changing a post’s URL was going to cause me to lose any previous webmentions. I didn’t like that idea, so [I talked to Aaron about adding multiple URL support to the webmention.io API](https://github.com/aaronpk/webmention.io/issues/31) and he agreed it was a good idea.

The feature landed late last week and I adjusted [my Jekyll Webmention.io plugin](https://github.com/aarongustafson/jekyll-webmention_io) to allow you to supply multiple URLs. While I was at it, I did some other upgrades: I added caching, downloading of webmention titles if the API didn’t supply one, and a test for the existence of avatars before inserting them (so you don’t end up with missing images).

If you were using the plugin, I definitely recommend upgrading as it performs a lot better now. I also added [a Rake task for sending webmentions](https://github.com/aarongustafson/jekyll-webmention_io/blob/master/webmention.Rakefile) which is super handy.

## Pardon My Dust

I apologize for changing URLs on you, but I am hopeful this will be the last major change on the site. As it (currently) says at the top, [this is an open redesign](/notebook/a-grand-experiment/), so there are bound to be a few bumps here and there. That said, I will try to keep them to a minimum in the future.