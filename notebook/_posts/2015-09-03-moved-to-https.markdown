---
layout: post
title: "Moved to HTTPS"
date: 2015-09-03 16:06:03 -0400
comments: true
tags: ["web design",security,"this site"]
description: "So, as much as it pains me to abandon good old fashioned HTTP, I’ve decided to lock things down a bit."
---

I’ve been complaining about ["man in the middle" attacks brought on by internet service providers](https://www.aaron-gustafson.com/notebook/more-proof-we-dont-control-our-web-pages/) a bunch over the last year. The only way to keep uninvited third parties from injecting JavaScript and more—potentially screwing up your page—is to move to HTTPS. So, as much as it pains me to abandon good old fashioned HTTP, I’ve decided to lock things down a bit.

<!-- more -->

I was using [Github](https://github.com/) to host my site as a [Github page](https://pages.github.com/). It worked really well given this is a static site, but you can’t run Github-hosted sites under HTTPS unless you go with their `*.github.io` domain name (they have a [wildcard certificate](https://en.wikipedia.org/wiki/Wildcard_certificate) for that domain). There’s been [a ton of interest in Github allowing custom cert installation, but no movement yet](https://github.com/isaacs/github/issues/156), so… <i>onward!</i>[^1]

I opted to move to [DigitalOcean](https://www.digitalocean.com/?refcode=5270a681c6fe) since [my consultancy](http://easy-designs.net) recently relocated all of its sites there in a mass exodus from MediaTemple. Migrating the site was as simple as [setting up the DigitalOcean server as a new "live" `remote` on my local git install](https://www.digitalocean.com/community/tutorials/how-to-set-up-automatic-deployment-with-git-with-a-vps) and pushing it up there. Since it’s a static site, I didn’t have to worry too much about the server config. Apache is really great at hosting static files.

With the contents in place, I went through [the rather convoluted process of getting SSL set up following the instructions from DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-set-up-apache-with-a-free-signed-ssl-certificate-on-a-vps). I opted for the free [StartSSL](http://www.startssl.com/) certificate to begin with (a rather convoluted process, but we got there in the end) and then flipped the DNS records to point to the new box. Given that the StartSSL certificate needs to be renewed every 30 days, I may opt for a paid certificate in the not too distant future.

Once the DNS propagated, I had to go back and button up a few scripts that were requesting non-HTTPS content. I also had to tweak my Jekyll plugins and Rake tasks to include the legacy "http://" URLs when querying for webmentions and the like (since I didn’t want to lose those references). I also updated the Apache’s `VirtualHost` configuration for the non-secure site to make all traffic redirect:

	Redirect permanent / https://www.aaron-gustafson.com/

All in all, it was a relatively painless migration. Admittedly, the initial re-build of the site (after updating the Rake tasks) did re-submit all of the webmentions I’d previously sent in order to provide the new address. If I referenced you a bunch in the past, I apologize for the flood of traffic, but it had to be done.

Anyway, so now this site is running under HTTPS. If you encounter any issues, please let me know. And if you want to read a really good account of migrating a site to HTTPS, you should definitely [read Jeremy Keith’s step-by-step guide](https://adactio.com/articles/7435).

[^1]: It’s worth noting that [the source of the site](https://github.com/aarongustafson/aarongustafson.github.io/tree/source) (and even [a back-up build](https://github.com/aarongustafson/aarongustafson.github.io/tree/master)) will remain on Github for the forseeable future.
