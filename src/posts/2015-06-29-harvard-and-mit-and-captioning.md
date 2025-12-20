---
title: "Harvard, MIT, and Captioning"
date: 2015-06-29 14:23:28 -04:00
comments: true
tags: [accessibility, "web design"]
description: "The U.S. Department of Justice has sided with the National Association of the Deaf in their cases against Harvard and MIT over online captioning."
---

The U.S. Department of Justice (DOJ) has published Statements of Interest in two cases brought by the National Association of the Deaf (NAD) against [Harvard (PDF)](http://www.ada.gov/briefs/harvard_soi.pdf) and [MIT (PDF)](http://www.ada.gov/briefs/mit_soi.pdf), respectively. The NAD is suing the two universities for violations of Title III of the Americans with Disabilities Act (ADA) and Section 504 of the Rehabilitation Act because the video and audio materials they are making available as part of their online learning offerings are not captioned.

<!-- more -->

The DOJ Statements make it quite clear that

> Both the ADA and Section 504 currently obligate Harvard to provide effective communication to ensure equal access to its online programming services, and resolution of Plaintiffs’ claim involves a straightforward application of longstanding statutory and regulatory requirements. For more than two decades, federal courts have resolved effective communication claims brought under the ADA and Section 504 in a wide range of contexts, including claims alleging unequal access to goods, benefits and services provided through websites or other electronic media. And the Departments of Justice and Education have routinely required covered entities to ensure equal access to goods, benefits and services, electronic or otherwise, through the provision of captioning or other auxiliary aids or services.

Also…

> [T]he Department issued an Advanced Notice of Proposed Rulemaking (“ANPRM”) on Accessibility of Web Information and Services of State and Local Government Entities and Public Accommodations, announcing the Department’s interest in developing more specific requirements or technical standards for website accessibility. … In the ANPRM, the Department reaffirmed its longstanding position that the ADA applies to websites of public accommodations, and reiterated, consistent with the preamble to the 1991 regulations, that the ADA regulations should be interpreted to keep pace with developing technologies.

Neither case has been settled yet, but the fact that the DOJ is siding with the NAD will lend more credence to their complaints and will likely result in one or both institutions settling out of court and, eventually, captioning their videos.

Captions are critical for the deaf and hard of hearing as they let them know what’s being said, who is saying it, how it’s being said, and inform them of any other sounds that are germane to the content. Reading captions is the equivalent of hearing with your eyes.

Are your videos captioned? If your content is aimed at a broad audience, it might be worth your time (and even your money) to get them captioned.

No doubt, accurate captioning is time-consuming. There are some ways of automating it ([YouTube does this](https://support.google.com/youtube/answer/3038280), for instance), but there are also services like [Casting Words](https://castingwords.com/), [Rev](https://www.rev.com/caption), and [3Play Media](http://www.3playmedia.com/) that will do it for a nominal fee.

It’s worth noting that the HTML `video` element supports subtitles and captions via [the `track` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track) ([browser support](http://www.iandevlin.com/blog/2015/04/html5/html5-video-captions-current-browser-status), [Can I Use data](http://caniuse.com/#search=track)). YouTube also allows you to [add captions and subtitles to your videos manually](https://support.google.com/youtube/answer/2734796). But keep in mind that [captions and subtitles are not the same thing](http://screenfont.ca/learn/); captions need to capture more than just the words that are said.
