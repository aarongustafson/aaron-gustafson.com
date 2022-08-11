---
title: "Locking down your GitHub-hosted Domains"
date: 2022-08-11 13:15:48 -07:00
comments: true
tags: ["hazards", "URLs", "the web"]
description: "The other day someone claimed a hostname on a domain I own and it took me a while to track down how. Turns out it was via GitHub pages."
twitter_text: "If you use GitHub Pages and don’t have your DNS properly configured, anyone can add a hostname to your domain"
---

The other day someone claimed a hostname on a domain I own and it took me a while to track down how. After a lot of digging around, trying to figure out how the hijack was accomplished, it turns out it was via GitHub Pages.

<!-- more -->

When you set up a custom domain with GitHub pages, you have to point your domain at GitHub’s servers. [There are a bunch of ways to do this](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), but if you use an A record, you need to be careful with your DNS settings. The site in question had a wildcard hostname (*) A record pointed at GitHub’s servers. At the time I’d set it up, that was the recommendation if you wanted all traffic to go to the same place.

Fast forward a few years and [it’s become a known exploit of GitHub Pages](https://medium.com/@jehy/hijacking-domain-using-github-pages-41c80ac57523): when wildcard hostnames are in play, any repo can add a CNAME file to their repository and claim ownership of a hostname belonging to that domain. GitHub even warns you not to do this anymore, but I hadn’t checked the docs in years. In my particular case, it was an archived domain that I don’t really use anymore, but I wouldn’t have been aware of the DNS hijack if the attacker hadn’t taken the step of claiming the domain on Google’s Webmaster Central.

Thankfully the fix was simple: Remove the wildcard A record and point the Apex domain at GitHub’s IP addresses.

If you use GitHub pages to host any of your own domains, I highly recommend auditing their DNS records to ensure this doesn’t happen to you. You can also use [domain verification for GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages) and [organizations](https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-organization-settings/verifying-or-approving-a-domain-for-your-organization) to further protect yourself.