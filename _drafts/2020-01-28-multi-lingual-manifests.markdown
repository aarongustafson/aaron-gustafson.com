---
layout: post
title: "Multi-lingual Manifests"
date: 2020-01-28 16:04:22 -0800
comments: true
tags: ["progressive web apps", HTML]
description: ""
---

As we begin to turn more sites in to Progressive Web Apps, it’s important to consider how we can truly serve a global audience with the technology options at our disposal. For instance, what happens when you have an app that is available in multiple languages? If that’s the case, you may need to generate a unique manifest file for each language you support, depending on how much customization you’ve done. In this post I’ll discuss some options for managing this process based on my experience with a handful of past projects that localized to several languages.

<!-- more -->

One of the key building blocks of a progressive web app is the Web App Manifest. This JSON file contains a bunch of "meta" information about your project that can be used in a variety of ways. The most common usage governs how a PWA is presented within the host operating system when it is installed, but it is starting to be used in other contexts as well. For example, some app stores use the manifest to build out a project’s store listing page. The manifest defines the kinds of content you can share into the project. And in the not too distant future, it will enable easy access to key project features, and enable a project to declare that it can handle specific URL protocols and file types too. More and more of these features will require us to author and maintain strings related to their behavior, which means we’ll also need to translate them if we have a project that supports multiple languages.

Here’s a bit of the manifest for this site.



If I were to offer a translation of it, I would need to translate that `description` at least.

## Translation approaches


## Serving the right manifest

