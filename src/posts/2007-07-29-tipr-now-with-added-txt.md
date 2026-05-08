---
title: "Tipr, now with added txt"
date: 2007-07-29 18:50:19
comments: true
tags:
  - "mobile"
  - "API"
  - "JavaScript"
description: "So, as it turns out, this little app I built for myself is actually useful to other folks."
canonical: "https://blog.easy-designs.net/archives/tipr-now-with-added-txt/"
---

<p>So, as it turns out, <a href="http://tipr.mobi">this little app I built for myself</a> is actually useful to other folks.</p>

<!-- more -->

<p>Over the 3 weeks since it launched, I’ve been keeping an eye on the traffic patterns, reviews, and mentions of Tipr across the intarwebs, but I’ve also been busily adding some new features, which brings me to this post. I knew people with iPhones and other capable mobile browsers were quite happy with Tipr, but folks without a mobile browser or with a sucky one were not, in my opinion, getting as much out of Tipr as I’d like them to. I wanted to correct that.</p>
<p>My first thought was to create an SMS service for Tipr, but there’s no way I can afford to rig up a server capable of receiving and replying to SMS messages and I certainly could not afford to pay the $1000-2000/month for an SMS short code (after all, I’m not making any money on this thing). Then the answer dawned on me: <a href="http://twitter.com">Twitter</a>.</p>
<p><img alt="" class="alt-feature" src="http://farm2.static.flickr.com/1228/942768366_aae7fe823b_o.png"/></p>
<p>Since Twitter offers an SMS interface (40404 once you register your mobile), I could simply piggy back on their service to offer Tipr via SMS. All I had to do was build a TwitterBot capable of receiving and responding to messages. Lots of folks have built <abbr title="Instant Message">IM</abbr> bots in the past, but there weren’t that many TwitterBots and there was even less information about building one. Even with the odds stacked against me, however, after about an hour of reading <a href="http://groups.google.com/group/twitter-development-talk/web/api-documentation">the Twitter <abbr title="Application Programming Interface">API</abbr> documentation</a> and 6 hours of actual programming, I had built a working <abbr title="Hypertext PreProcessor">PHP</abbr>-based TwitterBot class.</p>
<p>The whole thing works using Twitter’s direct message functionality and runs several independent services to do things like reciprocate friendships, check the inbox, process responses, and send messages back. Unfortunately, the <abbr title="Application Programming Interface">API</abbr> was only able to get me so far, so I did have to resort to a little hackery to get some of it to work, but in the end, the Tipr TwitterBot, which sits on top of my generic TwitterBot class is pretty solid and quite responsive — even with the 70 <abbr title="Application Programming Interface">API</abbr> calls in 60 minutes limitation, most messages receive a response in approximately 45 seconds (depending on your network and whether Twitter is releasing a new feature and takes the service offline for a few minutes).</p>
<p>Overall, I’m pretty happy with the results and the early beta testers seem to be liking it as well. Hopefully some of you out there will find it as useful (if not more so) than the web interface. If you’re on Twitter, <a href="http://tipr.mobi/twitter.php">give it a shot</a> and let me know what you think.</p>
