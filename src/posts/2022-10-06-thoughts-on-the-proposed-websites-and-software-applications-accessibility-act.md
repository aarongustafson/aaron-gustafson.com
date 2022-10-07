---
title: "Thoughts on the proposed Websites and Software Applications Accessibility Act"
date: 2022-10-07 09:41:58 -07:00
comments: true
tags: ["accessibility", "inclusive design", "software development", "web design", "web development"]
description: "Senator Duckworth and Representative Sarbanes introduced the WSAAA to explicitly bring websites—and other forms of digital media that didn’t exist when the ADA was signed into law—into the purview of the Americans with Disabilities Act (ADA)."
twitter_text: "Some thoughts on the Websites and Software Applications Accessibility Act proposed by @SenDuckworth and @RepSarbanes"
in_reply_to: https://www.prnewswire.com/news-releases/senator-duckworth-and-representative-sarbanes-introduce-bill-to-make-websites-and-mobile-applications-accessible-to-individuals-with-disabilities-301637276.html
hero:
  src: /i/posts/2022-10-07/hero.jpg
  credit: Aaron Gustafson × DALL·E
  alt: "A photograph of a sledgehammer leaning against a pile of bricks and rubble."
  url: https://labs.openai.com/s/5TVrwg4U549xQrE7rMtoWoO6
  offset: "300"
---

Last month, Senator Tammy Duckworth (D-Ill.) and Representative John P. Sarbanes (D-Md.) introduced the Websites and Software Applications Accessibility Act—I’m gonna call it the WS3A for short—simultaneously in the U.S. Senate ([S. 4998](https://www.congress.gov/bill/117th-congress/senate-bill/4998)) and House of Representatives ([H.R. 9021](https://www.congress.gov/bill/117th-congress/house-bill/9021)) to explicitly bring websites—and other forms of digital media that didn’t exist when the ADA was signed into law—into the purview of the Americans with Disabilities Act (ADA). I am definitely in favor of this effort as it removes the ambiguity that currently exists in U.S. law as to whether websites are governed by the ADA. The WS3A is a reasonable framework, but there is still a lot of work to be done when it (hopefully) passes.

<!-- more -->

On reading [the text of the WS3A](https://www.duckworth.senate.gov/imo/media/doc/22.09.28%20-%20Websites%20and%20Software%20Applications%20Accessibility%20Act%20BILL%20TEXT%20FINAL1.pdf), I really appreciated the thought they put into the way it’s structured. In a nutshell, it

1. Affirms that the (ADA) prohibits discrimination against people with disabilities in their use of websites.
2. Tasks the Department of Justice (DOJ) and the Equal Employment Opportunity Commission (EEOC) with establishing, updating, and enforcing accessibility standards for websites and applications.
3. Sets up a committee to work with these government offices to establish the rules that govern digital accessibility. It also establishes a central repository (and governing committee) to provide guidance on how to achieve compliance. Both committees must include representatives from numerous named disability communities as well as digital accessibility experts.
3. Identifies who needs to abide by these standards (e.g., the government, employers, commercial entities).
4. Establishes the legal grounding for litigation (from both the government and citizens) of violations of the established standards.

There’s more to it than that, but it’s a reasonable summary. I suggest reading [Senator Duckworth’s summary doc](https://www.duckworth.senate.gov/imo/media/doc/22.09.27%20SxS%20-%20Websites%20and%20Software%20Applications%20Accessibility%20Act%20FINAL.pdf) for more detail as well.

## We don’t all need "the same" experience

In Section 3 of the WS3A, a part of the definition for "accessibility" is the requirement for people with disabilities to be able “to engage in the same interactions as” people without disabilities. This sounds good on first blush, but I think "the same" could be misleading.

A number of years back, I was consulting with a financial services firm. Their web team was quite interested in putting accessibility into practice on their website after spending a few days talking about it with me. When I circled back a few months later, things weren’t going so well. The team that was focused on accessibility was two sprints behind "because of accessibility" and management was ready to give up on it. And so I asked them to walk me through what was going on.

The problem was an interactive graph they had built for a page in their company’s marketing site. It allowed users to see how much they’d save in fees over a certain number of years based on an initial investment amount that could be adjusted via a slider control. The slider allowed the initial investment amount to range from a low of $5,000 to something like $5,000,000 in increments of $5,000. They had run into all sorts of delays in getting the slider to work *identically* for people using either a mouse (the default they’d considered) or a keyboard.

After getting the details, I had them take a step back and look at the big picture. I asked them to consider the goal of the interface: to help people understand the more they invest with this company, the more they will save in fees. Then I asked them if the keyboard experience of that slider was a good one. It wasn’t; no one is going to move the slider potentially several hundred times to get to the exact amount they’re considering investing, nor should they have to. So I asked them to reconsider their approach and come up with other ways to achieve the goal. After all, this was for a marketing site; they weren’t displaying someone’s actual account information, where they would need to be more exacting in their approach.

They realized the same goal could be achieved in two ways. First, they could ensure the copy that came before the visualization offered the same information in textual form. Second, they could simplify the slider interface to have a set number of stops for keyboard users, to give users a sense of how things would change, but without making the interface tedious to use. These were both excellent alternatives and provided a better, some might say *more* accessible experience for folks who relied on a keyboard to both navigate and interact with he web.

When it comes to accessibility, it’s easy to get hung up while trying to provide an *identical* experience when that isn’t always the best thing. Everyone should be granted the opportunity to accomplish the core goal of an interface, but they don’t necessarily need to do it in the same way. If we get too caught up in providing the same experience, it’s easy to miss out on providing the right experience.

So, in reflecting on the WS3A’s definition of accessibility, I would prefer to see a little more nuance. I did notice that later, in the Rulemaking section, they use the phrase “equally effective experiences for users with disabilities and users without disabilities.” That’s a much better goal here. The same opportunities need to exist; parity is important, but not everyone requires the same accommodations.

This applies in other contexts too. For example, some images are informational, others are decorative; strict reading of a requirement for "the same" experience might lead folks to believe all images require descriptions, which they don’t. Similarly, users need to have control over how they receive information. They need to be able to adjust font sizes, stop things form moving around on the screen, change the colors of the interface to improve readability, eliminate distractions, and so on. We need to be building interfaces that can *adapt* to serve our users’ individualized needs across a wide range of intersections encompassing their own capabilities and disabilities as well as those of their device, their network, and the influence of their environment. (Insert shameless plug for [my book](https://adaptivewebdesign.info/) here.)

## We need to better-define an "undue burden"

The WS3A provides two pathways for an entity to side-step their obligations under the ADA. One seems pretty reasonable: if compliance would "fundamentally alter the nature" of the entity’s offerings, they can be excused from having to comply. The other reason creates a huge loophole, however: if compliance would "impose an undue burden" on the entity in violation.

What exactly is an "undue burden"? [According to the ADA](https://www.ada.gov/reachingout/l2factors.html), it means "significant difficulty or expense," which is determined in consideration of:

> 1. The nature and cost of the action needed under this part;
> 2. The overall financial resources of the site or sites involved in the action; the number of persons employed at the site; the effect on expenses and resources; legitimate safety requirements that are necessary for safe operation, including crime prevention measures; or the impact otherwise of the action upon the operation of the site;
> 3. The geographic separateness, and the administrative or fiscal relationship of the site or sites in question to any parent corporation or entity;
> 4. If applicable, the overall financial resources of any parent corporation or entity; the overall size of the parent corporation or entity with respect to the number of its employees; the number, type, and location of its facilities; and
> 5. If applicable, the type of operation or operations of any parent corporation or entity, including the composition, structure, and functions of the workforce of the parent corporation or entity.

The exact math is not exactly clear-cut—especially when we’re talking about digital products as opposed to physical structures—and I could see a number of corporations declaring something an "undue burden" when, in fact, it is relatively easy to address. It would be nice to see some guidance around what is considered to be a regular "cost of doing accessible business" in terms of percentage of operating revenue or percentage of staff dedicated to identifying and remediating accessibility issues.

## Other things I hope to see addressed

Below are a some additional questions and thoughts I think the commissions operating under the WS3A should seek to address:

* **If we agree accessibility is a journey, not a destination (i.e., we’re never "done"), how can we declare something is “accessible” (or not)?** It feels like the [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/) offer some solid guidance and that will likely set the bar for this effort, especially given that [Section 508 of the Rehabilitation Act](https://www.section508.gov/) relies on that set of guidelines as well. I’m encouraged by their recognition that what’s needed is ongoing evaluation of the guidance as well, but it still presents challenges around how we define "accessible enough." Additionally, digital products are different because they are easily changed, updated, and improved (as opposed to, say, a giant set of concrete stairs).
* **We don’t really have clarity around the mechanisms for informing non-compliant entities of their violations.** It’s also unclear as to whether there is a reasonable grace period for them to remediate the issue and report back for validation. Having a grace period to address issues will also be key for heading litigation trolls off at the pass.
* **We need some guidance around how much of a disruption is grounds for a formal complaint.** Many organizations ship code pretty much constantly and may introduce an accessibility bug and then address it within a few minutes, hours, or days. Again, a grace period starting when the entity is made aware of the violation would be key for addressing this.
* **Third-party code is not addressed at all in the WS3A.** Whose responsibility is it? A huge percentage of the web (and other software projects) are built using  open source and commercial codebases that they don’t own or control. If an entity tests a piece of third-party code and determines that it meets their obligations under ADA and then an update to that code introduces an accessibility bug and they are unaware, who is at fault and who is responsible for the remediation? The process seems a little more straightforward with open source code, provided the library maintainer is open to contributions that improve accessibility, but commercial code is a whole other thing.

<hr>

On the whole, I really appreciate what Senator Duckworth and Representative Sarbanes (and their staff and partners) are trying to do here. I hope it passes and look forward to keeping tabs on the work of the various commissions tasked with providing the necessary guidance and resources that will lead to a more inclusive web.

🤞🏻
