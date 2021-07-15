---
title: "Opera Mini server upgrade"
description: "The server-side Presto rendering engine that drives Opera Mini has gotten a major upgrade, introducing some great new features."
date: 2015-03-18 15:12:32 -04:00
comments: false
ref_url: https://dev.opera.com/blog/opera-mini-server-upgrade/
in_reply_to: https://dev.opera.com/blog/opera-mini-server-upgrade/
ref_source: Dev.Opera
---

The server-side Presto rendering engine that drives Opera Mini has gotten a major upgrade, introducing some great new features including

* [flexbox](http://www.w3.org/TR/css3-flexbox/)
* [rem units](http://www.w3.org/TR/css3-values/#rem-unit), and
* [a bit of ECMAScript 5](https://dev.opera.com/blog/opera-mini-server-upgrade/#ecmascript-5).

HTML5 input types are on the docket. They won’t be displayed properly in clients until they get an upgrade, but the parse is aware of them now and they will fall back to "text" inputs until the client roll-out happens.