---
title: "Joomla 3.4.6 Fixes Zero-Day Remote Execution Bug Used in the Wild"
description: "I harp on this a lot: You can never trust the client."
twitter_text: "I harp on this a lot: You can never trust the client. Joomla did & it bit them in the tush."
date: 2015-12-21 15:42:14 -06:00
comments: false
ref_url: http://news.softpedia.com/news/joomla-3-4-6-fixes-zero-day-remote-execution-bug-used-in-the-wild-497599.shtml
in_reply_to: http://news.softpedia.com/news/joomla-3-4-6-fixes-zero-day-remote-execution-bug-used-in-the-wild-497599.shtml
ref_source: Softpedia
---

I harp on this a lot: You can never trust the client (as in “the browser”). In this case, Joomla was not sanitizing User Agent strings before storing them in the database, [opening a garage door-sized security hole](https://developer.joomla.org/security-centre/630-20151214-core-remote-code-execution-vulnerability.html).