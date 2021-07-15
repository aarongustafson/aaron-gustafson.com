---
title: "Lies, Damn Lies, and JavaScript"
date: 2015-04-27 15:10:11 -04:00
comments: true
tags: [JavaScript,"user experience"]
description: "There is no reason to fake a progress bar. It’s pointless."
---

Late last week I stumbled on a video from [Graeme Pyle](https://twitter.com/graemepyle) that exposed a UX lie in the [First National Bank of South Africa](https://www.fnb.co.za/).

<!-- more -->
 
https://www.youtube.com/watch?v=gpBWwl-Ngak

On the off chance you don’t want to watch the video, I’ll recap: When accessing certain screens on the FNB site, a progress meter is shown to indicate new content is being flowed into the browser. But it’s not.

As Graeme uncovered, the site uses JavaScript to create the progress bar, but the progress is not tied to anything except some basic JavaScript logic. The progress bar has no grounding in reality. It uses timeouts and follows a steady incrementation for a bit, then jumps up randomly for a bit before finishing.

Taking the easy way out like this may seem like a non-issue, but what happens when your user loses network connectivity? You guessed it: The progress meter still runs. *Doh!*

Tracking true activity progress (like time to upload a file) involves constant communication between the server and the client. It used to be pretty difficult to do (and [required Perl](http://search.cpan.org/~lgoddard/CGI-ProgressBar-0.05/lib/CGI/ProgressBar.pm)), but nowadays we have [WebSockets](http://www.w3.org/TR/websockets/) and it’s much easier to keep the lines of communication between client and server open.

There is no reason to fake a progress bar. It’s pointless. Especially when you don’t even check to see if the user’s connection is still online.
