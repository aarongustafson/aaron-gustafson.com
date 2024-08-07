---
title: "A Fundamental Disconnect"
date: 2014-09-13 15:01:58 -04:00
comments: true
tags: ["web design", "web development", JavaScript, hazards]
description: "The Web is ubiquitous. The Web is messy. And, as much as we might like to control a user’s experience down to the very pixel, those of us who have been working on the Web for a while understand that it’s a fool’s errand and have adjusted our expectations accordingly. Unfortunately, this new crop of Web developers doesn’t seem to have gotten that memo."
redirect_from: /notebook/2014/a-fundamental-disconnect/
crossposted:
  Medium: https://medium.com/@AaronGustafson/a-fundamental-disconnect-e0a238ed232a
---

Yesterday at [BlendConf](https://2014.blendconf.com/), [Scott Hanselman](https://www.hanselman.com/) gave a fantastically-entertaining keynote entitled “JavaScript, The Cloud, and the rise of the New Virtual Machine.” In it, he chronicled all of the ways Web development and deployment has changed—for the better—over the years. He also boldly declared that JavaScript is now, effectively, a virtual machine in the browser.

<!-- more -->

This is a topic that has been weighing on my mind for quite some time now. I’ll start by saying that I’m a big fan of JavaScript. I write a lot of it and I find it incredibly useful, both as a programming language and as a way to improve the usability and accessibility of content on the Web. That said, I know its limitations. But I’ll get to that in a minute.

In the early days of the Web, “proper” software developers shied away from JavaScript. Many viewed it as a “toy” language (and felt similarly about HTML and CSS). It wasn’t as powerful as Java or Perl or C in their minds, so it wasn’t really worth learning. In the intervening years, however, JavaScript has changed a lot.

Most of these developers first began taking JavaScript seriously in the mid ’00s when Ajax became popular. And with the rise of JavaScript MVC frameworks and their ilk—Angular, Ember, etc.—many of these developers made their way onto the Web. I would argue that this, overall, is a good thing: We need more people working on the Web to make it better.

The one problem I’ve seen, however, is the fundamental disconnect many of these developers seem to have with the way deploying code on the Web works. In traditional software development, we have some say in the execution environment. On the Web, we don’t.

I’ll explain.

If we’re writing server-side software in Python or Rails or even PHP, one of two things is true:

1. We control the server environment: operating system, language versions, packages, etc.; or
2. We don’t control the server environment, but we have knowledge of it and can author your program accordingly so it will execute as anticipated.

In the more traditional installed software world, we can similarly control the environment by placing certain restrictions on what operating systems our code can run on and what the dependencies for its use may be in terms of hard drive space and RAM required. We provide that information up front and users can choose to use our software or use a competing product based on what will work for them.

On the Web, however, all bets are off. The Web is ubiquitous. The Web is messy. And, as much as we might like to control a user’s experience down to the very pixel, those of us who have been working on the Web for a while understand that it’s a fool’s errand and [have adjusted our expectations accordingly](https://dowebsitesneedtolookexactlythesameineverybrowser.com/). Unfortunately, this new crop of Web developers doesn’t seem to have gotten that memo.

We do not control the environment executing our JavaScript code, interpreting our HTML, or applying our CSS. Our users control the device (and, thereby, its processor speed, RAM, etc.). Our users choose the operating system. Our users pick the browser and which version they use. Our users can decide which add-ons they put in the browser. Our users can shrink or enlarge the fonts used to display our Web pages and apps. And the Internet providers that sit between us and our users, dictating the network speed, latency, and ultimately [controlling how—and what part of—our content makes it to our users](https://aaron-gustafson.com/notebook/2014/the-network-effect/).

All we can do is author a compelling, adaptive experience, cross our fingers, and hope for the best.

The fundamental problem with viewing JavaScript as the new VM is that it creates the illusion of control. Sure, if we are building an internal Web app, we might be able to dictate the OS/browser combination for all of our users and lock down their machines to prevent them from modifying those settings, but that’s not the reality on the open Web.

The fact is that we can’t absolutely rely on the availability of any specific technology when it comes to delivering a Web experience. Instead, we must look at *how* we construct that experience and make smarter decisions about how we use specific technologies in order to take advantage of their benefits while simultaneously understanding that their availability is not guaranteed. This is why progressive enhancement is such a useful philosophy.

The history of the Web is littered with JavaScript disaster stories. That doesn’t mean we shouldn’t use JavaScript or that it’s inherently bad. It simply means we need to be smarter about our approach to JavaScript and build robust experiences that allow users to do what they need to do quickly and easily even if our carefully-crafted, incredibly well-designed JavaScript-driven interface won’t run.
