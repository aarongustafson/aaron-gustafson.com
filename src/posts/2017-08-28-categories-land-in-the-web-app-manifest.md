---
title: "Categories land in the Web App Manifest"
date: 2017-08-28 10:17:10 -04:00
comments: true
tags: ["progressive web apps"]
description: "This optional member will be really useful in store and catalog scenarios."
---

Starting in early May, [Rob Dolin](https://github.com/RobDolinMS) began advocating for adding a `categories` member to [the Web App Manifest spec](https://www.w3.org/TR/appmanifest/). It was something we’d been discussing for a while now. It’s a feature that will be incredibly useful to users, especially as it relates to [PWAs in the Windows Store](https://www.aaron-gustafson.com/notebook/progressive-web-apps-and-the-windows-ecosystem/#how-does-a-user-discover-a-progressive-web-app), other app stores, and in catalogs. This weekend, our hard work paid off and [it was added to the spec](https://github.com/w3c/manifest/commit/bf14335a4e50ca4049c21a5071d160620ae96d56)!

<!-- more -->

## So what does it do and how do I use it?

First off, the new [`categories` member](https://www.w3.org/TR/appmanifest/#categories-member) is totally optional. It’s there if you think it offers a benefit for your users, but is by no means necessary.

According to the spec:

> The categories member is only meant as a hint to catalogs or stores listing web applications and it is expected that these will make a best effort to find appropriate categories (or category) under which to list the web application. Like search engines and meta keywords, catalogs and stores are not required to honor this hint.

The `categories` member is a list of categorizations you want to apply to your site. There are no pre-defined categories, but the W3C is maintaining [a list of common categories](https://github.com/w3c/manifest/wiki/Categories) shared by most app stores and catalogs. You will probably want to use at least one of those to ensure your site gets filed properly.

Here’s quick example of a hypothetical manifest for a web version of the book [<cite>Gojiro</cite> by Mark Jacobson](https://en.wikipedia.org/wiki/Gojiro):

```json
{
  "name": "Gojiro",
  "description": "Gojiro, a freak mutation with a cynical worldview, suffers the pain of solitude as well as several maladies experienced by entertainers, including drug abuse and suicidal tendencies.",
  "icons": [
    {
      "src": "images/icon.png",
      "sizes": "192x192"
    }
  ],
  "categories": [
    "books",
    "fiction",
    "science fiction & fantasy",
    "kaiju",
    "怪獣"
  ]
}
```

Here you can see 5 categories being assigned to the book. I chose to start with one of the top-level categories from the list and then get more specific, kinda like [how `class` names were originally conceived](https://adaptivewebdesign.info/1st-edition/read/chapter-2.html#ad-hoc-semantics). The genre "Kaiju" is a sub-classification of "science fiction & fantasy" novels, which are a sub-classification of "fiction", which is a sub-classification of "books".

Though the W3C list is in English (as with most web specs), there is no requirement to have all of your categories in English. The final entry, "<i lang="jp">怪獣</i>", is "Kaiju" in Japanese.

<hr>

This addition to the Web App Manifest was much-needed and, along with [IARC rating](https://www.w3.org/TR/appmanifest/#iarc_rating_id-member) (which [we also landed recently](https://github.com/w3c/manifest/pull/567)) will help our users more easily find the resources they’re looking for. Many hearty congrats to Rob for landing this update and for [being added as an editor of the spec](https://github.com/w3c/manifest/pull/604)!
