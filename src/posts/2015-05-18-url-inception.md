---
title: "URL Inception"
date: 2015-05-18 14:38:29 -04:00
comments: true
tags: ["web design", URLs]
description: "The awesomeness of this URL is almost indescribable."
---

It’s like a snake eating its own tail:

	https://m.facebook.com/ClydesOnMain?refsrc=https%3A%2F%2Fwww.facebook.com%2FClydesOnMain#!/ClydesOnMain?refsrc=https%3A%2F%2Fwww.facebook.com%2FClydesOnMain

Wonder what’s going on? Well, Facebook’s mobile site (`m.facebook.com/ClydesOnMain`) is tracking the URL (using the `refsrc` GET parameter) I came from (`www.facebook.com/ClydesOnMain#!/ClydesOnMain`)—a single page "web app", hence the hash-bang: `#!`—that was tracking the original referral page (`www.facebook.com/ClydesOnMain`).

I hope they got all that.
