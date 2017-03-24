---
layout: post
title: "How to Apply Progressive Enhancement When JavaScript Seems Like a Requirement"
date: 2015-04-02 09:14:40 -0500
comments: true
tags: ["web design","progressive enhancement",javascript]
description: "On Stack Overflow last week, JamHam asked how to apply progressive enhancement in interfaces that seem to require JavaScript. Unfortunately he deleted the question before I could post my response, so I thought I would post it all here for posterity."
---

On Stack Overflow last week, [JamHam](http://stackoverflow.com/users/4719194/jamham) asked how to apply progressive enhancement in interfaces that seem to require JavaScript. Unfortunately he deleted the question before I could post my response, so I thought I would post it all here for posterity.

<!-- more -->

> I've been trying to make my site (a content publishing "web app") work fully without JavaScript, however, I've found myself in situations where I can't honestly think how I would do some features without it.

> For instance:

> * I have a form submission page where you change certain settings, and the form changes accordingly.This is alright, I can apply query strings in the url and have some logic in my layout so that certain fields are shown/hidden according to the query string. The thing is, I also need to update a "price" dynamically, according to what fields are filled in, how they are filled in, and some other factors, and I don't honestly see how I could do that without JavaScript.
* I have a messaging section where I'm using WebSockets (with the help of Socket.io). The UI of the messaging (and of course, the
WebSockets) stuff pretty much depends on JavaScript, with 'messages' being created as they arrive and appended into DOM and also a form that allows you to quickly look up an user via AJAX so you can send a message easily, among many other things.

> I mean, I could probably come up with very complicated solutions for each situation, and obviously the functionality wouldn't be the same. I'm thinking I might as well just require JavaScript for the whole thing

> But it kinda sucks, since I've been making everything work without JavaScript, up until this point. And I would like some consistency across the whole site. In these kind of situations, is it acceptable to not support non-js clients? What would you suggest in this case?

My response (which I was drafting when he deleted the question):

> First off, I applaud your interest in using progressive enhancement. It will ensure the most users possible have access to your content and will also result in a more robust application overall. As a general guiding principle, look to the past. How did we solve these issues before widespread JavaScript availability? Those "Web 1.0" solutions will still work and can be overtaken by supplanted by your JavaScript solution whenever it is possible to do so.

> Every situation is different, but it is even possible to reuse a lot of code in both scenarios.

> Now to address your interfaces…

> **Your Submission Page** - I could be wrong, but this sounds like a shopping cart to me (at least in essence). You are on the right track with query parameters, but you could also store info about the cart (and the user’s capabilities) in a session or cookie.

> In terms of updating the "cart", a simple "update" submit button that posts the form and triggers a redirection back to this page with the updated info would be sufficient. And if you need to show or hide fields based on choices made, you simply apply that logic on the server side. You could even have the server generate that same markup into the page, but hidden for situations where JavaScript is available.

> **Your Messaging App** - This can seem like a daunting challenge, but before we had web sockets and even Ajax, we relied on a small form which posts messages to the back end and a running feed of messages being sent from the back-end. One of the most common way to handle this involved frames and a "meta refresh" like this one:

>     <meta http-equiv="refresh" content="30">

> That simple `meta` tag will make any browser refresh the page every 30 seconds. Now if you put that in an `iframe` to keep it from causing a refresh of the entire interface, any new messages would be picked up and displayed automatically at that interval (which you should tune to be appropriate for your app).

> Once that is in place the page itself could even post to that frame by using the non-standard but well-supported `_target` attribute on the `form`.

> Obviously with JavaScript enabled, you’d probably throw away that `iframe`, but the rest of the setup (including the templates for displaying the messages) could certainly be reused with WebSockets.

I hope this helps. Progressive enhancement may seem like a huge challenge, but when you take a few moments to think about how we handled these challenges in the past, the way forward becomes clear.
