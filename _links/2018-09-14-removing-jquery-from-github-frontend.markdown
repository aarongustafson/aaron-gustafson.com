---
title: "Removing jQuery from GitHub.com frontend"
date: 2018-09-14 13:32:44 -0700
tags: [JavaScript, "progressive enhancement"]
ref_url: https://githubengineering.com/removing-jquery-from-github-frontend/
in_reply_to: https://githubengineering.com/removing-jquery-from-github-frontend/
ref_source: GitHub Engineering
---

There’s so much great stuff in here. Of particular note:

> As part of our refined approach to building frontend features on GitHub.com, we focused on getting away with regular HTML foundation as much as we could, and only adding JavaScript behaviors as progressive enhancement. As a result, even those web forms and other UI elements that were enhanced using JS would usually also work with JavaScript disabled in the browser. In some cases, we were able to delete certain legacy behaviors altogether instead of having to rewrite them in vanilla JS.

If you need to brush up on what progressive enhancement is and how to do it with aplomb, consider picking up a copy of my book, [<cite>Adaptive Web Design</cite>](https://adaptivewebdesign.info).