---
title: "Enhancing the Manifest"
date: 2021-10-26 11:57:19 -07:00
comments: true
tags: ["progressive web apps","web standards"]
description: "I briefly presented on a bunch of the different efforts I’m involved with at the W3C’s TPAC yesterday. Here’s a rundown of what I discussed as well as links you can follow if you want to get involved."
---

Since joining the esteemed group of editors maintaining the [Web App Manifest spec](https://www.w3.org/TR/appmanifest/) for the [W3C](https://www.w3.org/), I’ve been on the lookout for ways to enhance both web apps themselves—in terms of functionality—and how web apps are represented in app catalogs and digital storefronts. Some of that work is finally gaining traction and I’d love to get your input.

<!-- more -->

I briefly presented on a bunch of the different efforts I’m involved with at the [W3C’s TPAC](https://www.w3.org/2021/10/TPAC/) yesterday. Here’s a rundown of what I discussed as well as links you can follow if you want to get involved.

## Indicating an app’s policies & other legalese

Many app catalogs enable developers to provide links to things like their app’s Privacy Policy and Terms of Use. There is no way, however, to semantically indicate this information in your markup; the closest you can get is `link[rel="license"]`, but that’s limited in scope. Rather than propose including more `link` or `meta` elements (which would need to be included on _every_ page of your site), we think it makes more sense to roll this information into the Manifest as part of a `policies` object.

[My proposal](https://github.com/w3c/manifest-app-info/pull/46) enables developers to provide URLs for an app’s accessibility statement, content license, and policies governing privacy, security, support, and usage. Developers would be free to include whichever policies their app has and they can be URLs within the app itself or link off to other websites (such as the publisher’s). Here’s what that could look like:

```json
"policies": {
  "accessibility": "/accessibility",
  "usage": "/terms",
  "privacy": "http://publisher.tld/privacy"
}
```

So far, this seems to meet the needs of several of the app catalogs I’ve spoken with. I don’t know that browsers will make use of this information, but I could see it being useful in the context of an installed PWA as well as in app listings within the browser UI too.

In a related effort, I’m pushing for the Microsoft Store to support accessibility statements, which are helpful for explaining application functionality and providing details of any known accessibility limitations within an app.

## Identifying an app’s publisher

When you’re considering installing any app, you want to know you can trust who’s behind it. Phishing sites are everywhere though, so we have to believe that phishing apps are here too (or not too far off). You want to be able to trust that an app purporting to be from your bank actually is from your bank. With such high stakes, opening up the possibility for an app to identify its publisher is quite dangerous, which is why this proposal has taken a while to germinate.

From the developer side of things, [my proposed implementation](https://github.com/w3c/manifest-app-info/pull/47) is relatively straightforward. First, the app identifies its `publisher` in the Manifest:

```json
"publisher": {
  "name": "Organization Name",
  "url": "https://organization.tld/"
}
```

The problem is that I could put anything in there, declaring my publisher to be any company or individual. In order to substantiate my app’s claim, the listed publisher needs to claim the app too. The publisher could do this by enumerating the apps it owns in a text file located at https://organization.tld/.well-known/published-web-apps:

```txt
https://origin1.tld/manifest.json
https://origin2.tld/static/manifest.json
```

Instead of using a text file, it may be possible to piggyback on the proposed [`web-app-origin-association` file](https://web.dev/pwa-url-handler/#the-web-app-origin-association-file), but I’m concerned with [overloading `web-app-origin-association` and confusing developers](https://github.com/w3c/manifest-app-info/pull/47#issuecomment-952169632) who are using it for URL handling.

Regardless of the mechanism, even with this bi-directional attestation, however, the system still has a gaping security hole: the `publisher["name"]` string can’t be validated this way. It would be relatively easy for an attacker to host 2 websites, one of which looks like your bank’s app and the other which merely hosts the `published-web-apps` file in order to support the bogus app’s claim of being published by your bank.

This is where [the proposed processing algorithm adds an opaque validation step](https://github.com/w3c/manifest-app-info/pull/47/files#diff-0eb547304658805aad788d320f10bf1f292797b5e6d745a3bf617584da017051R504-R512). Implementors are encouraged to verify that the publisher’s domain actually matches the claimed name. There are a number of services that offer name-to-url (or _vice versa_) lookup, but an implementor could even have a manual process in place to verify the provided information (which app catalogs do as a regular part of their business).

In the end, the publisher value will either be a validated name and URL pair or, if validation fails, the web app’s URL host string (e.g., "twitter.com"), which many implementors already use as the publisher name.

## Enabling server-side content negotiation

Though many folks these days focus their efforts on running as much code as possible on the client, there is a lot of value in making significant changes to your app on the server, before responding to a request. We’ve heard a number of use cases from folks building PWAs and have put together three proposals to help address them:

1. **[A Client Hint to indicate whether the app is installed](https://github.com/w3c/manifest-app-info/pull/32).** The `Sec-CH-App-Installed` header would give a server information about whether or not a user agent is representing the app in an "installed" state. The value would be a boolean `true` or `false`. We are discussing [exposing this information via a DOM API as well](https://github.com/w3c/manifest-app-info/pull/32#issuecomment-825288114).
2. **[A Client Hint to indicate the `display` mode](https://github.com/w3c/manifest/pull/977).** We already have a way of detecting the `display` mode of a web app using `matchMedia()` and [CSS’s `display-mode` media feature](https://w3c.github.io/manifest/#the-display-mode-media-feature), but that is all client side code. The `Sec-CH-Display-Mode` header would provide the `display` value (taking into account [`display_override`](https://github.com/w3c/manifest/pull/932)) on the server side as well.
3. **[Using the `Referer` header to indicate installation source](https://github.com/w3c/manifest-app-info/issues/19#issuecomment-858137411)**. I was working with a partner that wanted to beta their PWA to only people who’d installed their PWA from a specific app catalog. Even if they had supplied a separate Manifest with a unique `start_url` to that catalog, that would not have allowed them to limit their app’s distribution if the URL was shared. And so we proposed that the browser provide a catalog-associated `Referer` header when the PWA is first launched (and in the absence of a true referral). This feature has shipped in Edge for PWAs installed via the Microsoft Store and we are encouraging other app catalogs and browsers to consider the same approach.

It’s worth noting that all of these features can be used for analytics and (potentially) to violate someone’s privacy. That is why we’ve suggested they sit under the umbrella of the [Privacy Sandbox](https://developer.chrome.com/docs/privacy-sandbox/overview/).

## Adapting app UI to user preferences

Shortly after OSes began rolling out support for color schemes (e.g., "light" and "dark" modes), I saw a need for web apps to be able to adapt to these user preferences. In CSS we have the [`prefers-color-scheme` Media Query](https://drafts.csswg.org/mediaqueries-5/#descdef-media-prefers-color-scheme), but the Manifest had no way of accounting for these sorts of changes. My initial proposal centered around [adding support for Media Queries in the `ImageResource` spec](https://github.com/w3c/image-resource/issues/26). Short of having CSS-driven, adaptive SVG web app icons (which I’m also working on), being able to associate an `ImageResource` bitmap with a Media Query seems like the way to go.

Here’s what that might look like in the context of the `icons` member:

```json
"icons": [
  {
    "src": "/icons/play-later.png",
    "type": "image/png",
    "size": "512x512",
    "media": "(prefers-color-scheme: light)"
  },
  {
    "src": "/icons/play-later-reverse.png",
    "type": "image/png",
    "size": "512x512",
    "media": "(prefers-color-scheme: dark)"
  }
]
```

This approach would be applicable wherever `ImageResource` gets used, which includes app icons, shortcut icons, and screenshots within the context of the Manifest as well as the Notifications and Payment Request APIs.

Beyond images, however, [as Jen Simmons pointed out, we need the ability to adapt colors within the Manifest as well](https://github.com/w3c/manifest/issues/975). It’s early days in discussing this right now, but we’re thinking about adding a generic means of redefining Manifest keys, based on a particular context. It is going to be a challenge to figure this out because we don’t want to force Manifest authors to redefine an entire nested structure (such as a shortcut) just to swap out a single part of that object. But more on that in a moment.

Here is a simple example of how this might look:

```json
"user_preferences": [{
  "context": "(prefers-color-scheme: dark)",
  "redefine": {
    "theme_color": "#bdbdbd",
    "background_color": "#000000"
  }
}],
```

Ideally developers would not use this mechanism for redefining their icons, using the `ImageResource` option instead, but it does open the door to complexity.

## Web app translations

Speaking of complexity, have you ever tried to build a web app that is translated into multiple languages? It’s an incredibly challenging task and the Manifest does not make it any easier. At present, the guidance for creating multi-lingual Manifests is to use a separate file for each language or make it a dynamic file that can be adjusted on the server side based on path or query string adjustments.

I’m currently working on [a proposal to address this within a single document by introducing a `translations` member](https://github.com/w3c/manifest/issues/676). My proposal offers two approaches, one favoring simpler Manifests, the other more useful for complex Manifests.

For simple Manifests, translations could be embedded directly within the Manifest file as members of the translations object, keyed by language code:

```json
{
  "name": "Good dog",
  "description": "An app for dogs",
  "lang": "en",
  "translations": {
    "fr": {
      "name": "Bon chien",
      "description": "Une application pour chiens"
    }
  },
}
```

For complex Manifests that may need to redefine text in shortcuts, screenshot labels, and the like, I proposed enabling translations to be managed in a separate file, offering alternative strings only for the items that need it. Using this approach, the above example could become:

```json
// manifest.json
{
  "name": "Good dog",
  "description": "An app for dogs",
  "lang": "en",
  "translations": {
    "fr": "manifest.fr.json"
  }
}

// manifest.fr.json:
{
  "name": "Bon chien",
  "description": "Une application pour chiens"
}
```

One serious challenge (as with the `user_preferences` block, discussed above) is how to manage changing individual parts of a complex Manifest component. For example, you would likely need to change the text label of a shortcut, but may not need to change its `url` or icon. [Thomas Steiner suggested](https://github.com/w3c/manifest/issues/975#issuecomment-870430956) that [JSON Path](https://github.com/json-path/JsonPath#getting-started) may be a good solution here as it could enable you to do something like

```json
{
  "name": "Good dog",
  "description": "An app for dogs",
  "lang": "en",
  "shortcuts": [
    {
      "name": "Pet Me",
      "url": "/pet-me/"
    },
    {
      "name": "Feed Me",
      "url": "/feed-me/"
    }
  ],
  "translations": {
    "fr": {
      "name": "Bon chien",
      "description": "Une application pour chiens",
      "$['shortcuts'][0]['name']": "Nourrissez-moi",
      "$['shortcuts'][1]['name']": "Caressez-moi"
    }
  },
}
```

This is still something we are actively working through, but it’s promising for sure.

## Consider getting involved

There is a lot of really interesting work happening in Manifest-land these days. If you’d like to get involved, please follow the links and chime in on the discussions. We’d love to have you!
