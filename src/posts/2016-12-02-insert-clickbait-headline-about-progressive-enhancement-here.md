---
title: "[Insert Clickbait Headline About Progressive Enhancement Here]"
date: 2016-12-06 14:45:25 -05:00
comments: true
tags: ["progressive enhancement", "web design", JavaScript]
description: "Late last week, Josh Korr, a project manager at Viget, posted at length about what he sees as a fundamental flaw with the argument for progressive enhancement. In reading the post, it became clear to me that Josh really doesn’t have a good grasp on progressive enhancement or the reasons its proponents think it’s a good philosophy to follow."
crossposted:
  Medium: https://medium.com/@AaronGustafson/8255218a37d6
thanks:
  "Sara Soueidan": "https://sarasoueidan.com/"
  "Baldur Bjarnasun": "https://www.baldurbjarnason.com/"
  "Jason Garber": https://sixtwothree.org/
  "Tim Kadlec": "https://timkadlec.com/"
---

Late last week, Josh Korr, a project manager at Viget, posted at length about [what he sees as a fundamental flaw with the argument for progressive enhancement](https://www.viget.com/articles/the-case-against-progressive-enhancements-flimsy-moral-foundation). In reading the post, it became clear to me that Josh really doesn’t have a good grasp on progressive enhancement or the reasons its proponents think it’s a good philosophy to follow. Despite claiming to be “an expert at spotting fuzzy rhetoric and teasing out what’s really being said”, Josh makes a lot of false assumptions and inferences. My response would not have fit in a comment, so here it is…

<!-- more -->

Before I dive in, it’s worth noting that Josh admits that he is not a developer. As such, he can’t really speak to the bits where the rubber really meets the road with respect to progressive enhancement. Instead, he focuses on the argument for it, which he sees as a purely moral one… and a flimsily moral one at that.

I’m also unsure as to how Josh would characterize me. I don’t think I fit his mold of PE “hard-liners”, but since I’ve written two books and countless articles on the subject and he quotes me in the piece, I’ll go out on a limb and say he probably thinks I am.

Ok, enough with the preliminaries, let’s jump over to his piece…

<hr>

Right out of the gate, Josh demonstrates a fundamental misread of progressive enhancement. If I had to guess, it probably stems from his source material, but he sees progressive enhancement as a moral argument:

> It’s a moral imperative that everything on the web should be available to everyone everywhere all the time. Failing to achieve — or at least strive for — that goal is inhumane.

Now he’s quick to admit that no one has ever explicitly said this, but this is his takeaway from the articles and posts he’s read. It’s a pretty harsh, black & white, [_you’re either with us or against us_](https://en.wikipedia.org/wiki/You're_either_with_us,_or_against_us) sort of statement that has so many people picking sides and lobbing rocks and other heavy objects at anyone who disagrees with them. And everyone he quotes in the piece as examples of why he thinks this is progressive enhancement’s central conceit is much more of an "it depends" sort of person.

To clarify, progressive enhancement is neither moral or amoral. It’s a philosophy that recognizes the nature of the Web as a medium and asks us to think about how to build products that are robust and capable of reaching as many potential customers as possible. It isn’t concerned with any particular technology, it simply asks that we look at each tool we use with a critical eye and consider both its benefits and drawbacks. And it’s certainly not anti-JavaScript.

I could go on, but let’s circle back to Josh’s piece. Off the bat he makes some pretty bold claims about what he intends to prove in this piece:

<blockquote cite="https://www.viget.com/articles/the-case-against-progressive-enhancements-flimsy-moral-foundation">
<ol><li>Progressive enhancement is a philosophical, moral argument disguised as a practical approach to web development.</li><li>This makes it impossible to engage with at a practical level.</li><li>When exposed to scrutiny, that moral argument falls apart.</li><li>Therefore, if PEers can’t find a different argument, it’s ok for everyone else to get on with their lives.</li></ol>
</blockquote>

For the record, I plan to address _his_ arguments quite practically. As I mentioned, progressive enhancement is not solely founded on morality, though that can certainly be viewed as a facet. The reality is that progressive enhancement is quite pragmatic, addressing the Web as it exists not as we might hope that it exists or how _we_ experience it.

Over the course of a few sections—which I wish I could link to directly, but alas, the headings don’t have unique `id`s—he examines a handful of quotes and attempts to tease out their hidden meaning by following the [LSAT](https://en.wikipedia.org/wiki/Law_School_Admission_Test)’s [Logic Reasoning](https://en.wikipedia.org/wiki/Logical_reasoning) framework. We’ll start with the first one.

## Working without JavaScript

<blockquote cite="https://www.viget.com/articles/the-case-against-progressive-enhancements-flimsy-moral-foundation">
<h4>Statement</h4>
<ul><li>“When we write JavaScript, it’s critical that we recognize that we can’t be guaranteed it will run.” — <a href="https://www.aaron-gustafson.com/notebook/missed-connections/">Aaron Gustafson</a></li><li>“If you make your core tasks dependent on JavaScript, some of your potential users will inevitably be left out in the cold.” —&nbsp;<a href="https://adactio.com/journal/7706">Jeremy Keith</a></li></ul>
<p>Unstated assumptions:</p>
<ul><li><em>Because there is some chance JavaScript won’t run, we must always account for that chance.</em></li><li><em>Core tasks can always be achieved without JavaScript.</em></li><li><em>It is always bad to ignore some potential users for any reason.</em></li></ul>
</blockquote>

His first attempt at teasing out the meaning of these statements comes close, but ignores some critical word choices. First off, neither Jeremy nor I speak in absolutes. As I mentioned before, we (and the other folks he quotes) all believe that the right technical choices for a project depend on specifically on the purpose and goals of _that specific project_. In other words _it depends_. We intentionally avoid absolutist words like "always" (which, incidentally, Josh has no problem throwing around, on his own or on our behalf).

For the development of _most_ websites, the benefits of following a progressive enhancement philosophy far outweigh the cost of doing so. I’m hoping Josh will take a few minutes to read my post on [the true cost of progressive enhancement in relation to actual client projects](http://blog.easy-designs.net/archives/the-true-cost-of-progressive-enhancement/). As a project manager, I hope he’d find it enlightening and useful.

It’s also worth noting that he’s not considering the reason we make statements like this: Many sites rely 100% on JavaScript without needing to. The reasons why sites (like news sites, for instance) are built to be completely reliant on a fragile technology is somewhat irrelevant. But what isn’t irrelevant is that it happens. Often. That’s why I said “it’s critical that we _recognize_ that we can’t be guaranteed it will run” (emphasis mine). A lack of acknowledgement of JavaScript’s fragility is one of the main problems I see with web development today. I suspect Jeremy and everyone else quoted in the post feels exactly the same. To be successful in a medium, you need to understand the medium. And the (sad, troubling, interesting) reality of the Web is that [we don’t control a whole lot](https://www.aaron-gustafson.com/notebook/a-fundamental-disconnect/). We certainly control a whole lot less than we often believe we do.

As I mentioned, I disagree with his characterization of the argument for progressive enhancement being a moral one. Morality can certainly be one argument for progressive enhancement, and as [a proponent of egalitarianism](https://www.aaron-gustafson.com/notebook/egalitarianism/) I certainly see that. But it’s not the only one. If you’re in business, there are a few really good business-y reasons to embrace progressive enhancement:

- **Legal:** Progressive enhancement and accessibility are very closely tied. Whether [brought by legitimate groups](https://en.wikipedia.org/wiki/National_Federation_of_the_Blind_v._Target_Corp.) or [opportunists](http://chrishofstader.com/stop-the-ada-trolls/), lawsuits over the accessibility of your web presence can happen; following progressive enhancement _may_ help you avoid them.
- **Development Costs:** As I mentioned earlier, progressive enhancement is a more cost-effective approach, especially for long-lived projects. Here’s that link again: [The True Cost of Progressive Enhancement](http://blog.easy-designs.net/archives/the-true-cost-of-progressive-enhancement/).
- **Reach:** The more means by which you enable users to access your products, information, etc., the more opportunities you create to earn their business. Consider that no one thought folks would buy big-ticket items on mobile just a few short years ago. Boy, were they wrong. Folks buy cars, planes, and more from their tablets and smartphones on the regular these days.
- **Reliability:** When your site is down, not only do you lose potential customers, you run the risk of losing existing ones too. There have been [numerous](http://blogs.wsj.com/digits/2011/02/07/gawker-outage-causing-twitter-stir) [incidents](http://www.theguardian.com/technology/2014/jan/28/sky-broadband-blocks-jquery-web-critical-plugin) where big sites got hosed due to JavaScript dependencies and they didn’t have a fallback. Progressive enhancement ensures users can always do what they came to your site to do, even if it’s not the ideal experience.

Hmm, no moral arguments for progressive enhancement there… but let’s continue.

## Some experience vs. no experience

<blockquote cite="https://www.viget.com/articles/the-case-against-progressive-enhancements-flimsy-moral-foundation">
<h4>Statement</h4>
<ul><li>“[With a PE approach,] Older browsers get a clunky experience with full page refreshes, but that’s still much, much better than giving them nothing at all.” — <a href="https://adactio.com/journal/7706">Jeremy Keith</a></li><li>“If for some reason JavaScript breaks, the site should still work and look good. If the CSS doesn’t load correctly, the HTML content should still be there with meaningful hyperlinks.” — <a href="http://blog.teamtreehouse.com/progressive-enhancement-past-present-future">Nick Pettit</a></li></ul>
<p>Unstated assumptions:</p>
<ul><li><em>A clunky experience is always better than no experience.</em></li><li><em>HTML content — i.e. text, images, unstyled forms — is the most important part of most websites.</em></li></ul>
</blockquote>

You may be surprised to hear that I have no issue with Josh’s distillation here. Clunky is a bit of a loaded word, but I agree that _an_ experience _is_ better than no experience, especially for critical tasks like checking your bank account, registering to vote, making a purchase from an online shop. In my book, I talk a little bit about a strange thing we experienced [when <cite>A List Apart</cite> stopped delivering CSS to Netscape Navigator 4](http://alistapart.com/article/netscape) way back in 2001:

> We assume that those who choose to keep using 4.0 browsers have reasons for doing so; we also assume that most of those folks don’t really care about “design issues.” They just want information, and with this approach they can still get the information they seek. In fact, since we began hiding the design from non–compliant browsers in February 2001, ALA’s Netscape 4 readership has increased, from about 6% to about 11%.

Folks come to our web offerings for a reason. Sometimes its to gather information, sometimes it’s to be entertained, sometimes it’s to make a purchase. It’s in our best interest to remove every potential obstacle that can preclude them from doing that. That’s good customer service.

## Project priorities

<blockquote cite="https://www.viget.com/articles/the-case-against-progressive-enhancements-flimsy-moral-foundation">
<h4>Statement</h4>
<ul><li>“Question any approach to the web where fancy features for a few are prioritized &amp; basic access is something you’ll ‘get to’&nbsp;eventually.” — <a href="https://twitter.com/tkadlec/status/565951127225896961">Tim Kadlec</a></li></ul>
<p>Unstated assumptions:</p>
<ul><li><em>Everything beyond HTML content is superfluous fanciness.</em></li><li><em>It’s morally problematic if some users cannot access features built with JavaScript.</em></li></ul>
</blockquote>

Not to put words in Tim’s mouth (like Josh is here), but what Tim’s quote is discussing is [hype-driven](https://blog.daftcode.pl/hype-driven-development-3469fc2e9b22#.ly6bqxv9s) (as opposed to [user-centered](https://en.wikipedia.org/wiki/User-centered_design)) design. We (as developers) often [prioritize our own convenience/excitement/interest over our users’ actual needs](https://www.aaron-gustafson.com/notebook/who-should-pay/). It doesn’t happen all the time (note I said _often_), but it happens frequently enough to require us to call it out now and again (as Tim did here).

As for the "unstated assumptions", I know for a fact that Tim would never call "everything beyond HTML" superfluous. What he is saying is that we should _question_—as in weigh the pros and cons—of each and every design pattern and development practice we consider. It’s important to do this because there are always tradeoffs. Some considerations that should be on your list include:

- Download speed;
- Time to interactivity;
- Interaction performance;
- Perceived performance;
- Input methods;
- User experience;
- Screen size & orientation;
- Visual hierarchy;
- Aesthetic design;
- Contrast;
- Readability;
- Text equivalents of rich interfaces for visually impaired users _and_ headless UIs;
- Fallbacks; and
- Copywriting.

This list is by no means exhaustive nor is it in any particular order; it’s what came immediately to mind for me. Some interfaces may have fewer or more considerations as each is different. And some of these considerations might be in opposition to others depending on the interface. It’s critical that we consider the implications of our design decisions by weighing them against one another before we make any sort of decision about how to progress. Otherwise we open ourselves up to potential problems and the cost of changing things goes up the further into a project we are:

<figure id="fig-2016-12-06-01" class="media-container">

![]({{ site.url }}/i/posts/2016-12-06/01.png)

<figcaption>The cost of changing your mind goes up the further into any project you are. Just ask any contractor you hire to work on your house.</figcaption>
</figure>

As a project manager, I’m sure Josh understands this reality.

As to the "morally problematic" bit, I’ll refer back to [my earlier discussion of business considerations](#working-without-javascript). Sure, morality can certainly be part of it, but I’d argue that it’s unwise to make assumptions about your users regardless. It’s easy to fall into the trap of thinking that all of or users are like us (or like the personas we come up with). My employer, Microsoft, makes a great case for why we should avoid doing this in their [Inclusive Design materials](https://www.microsoft.com/en-us/design/inclusive):

<figure id="fig-2016-04-11-02" class="media-container">

![]({{ site.url }}/i/posts/2016-04-11/02.png)

<figcaption>When we design only for others like us, we exclude everyone who is not like us.</figcaption>
</figure>

If you’re in business, it doesn’t pay to exclude potential customers (or alienate current ones).

## Erecting unnecessary barriers

<blockquote cite="https://www.viget.com/articles/the-case-against-progressive-enhancements-flimsy-moral-foundation">
<h4>Statement</h4>
<ul><li>“Everyone deserves access to the sum of all human knowledge.” — <a href="http://blog.teamtreehouse.com/progressive-enhancement-past-present-future">Nick Pettit</a></li><li>“[The web is] built with a set of principles that — much like the principles underlying the internet itself — are founded on ideas of universality and accessibility. ‘Universal access’&nbsp;is a pretty good rallying cry for the web.” — <a href="https://adactio.com/journal/8245">Jeremy Keith</a></li><li>“The minute we start giving the middle finger to these other platforms, devices and browsers is the minute where the concept of The Web starts to erode. Because now it’s not about universal access to information, knowledge and interactivity. It’s about catering to the best of breed and leaving everyone else in the cold.” — <a href="http://bradfrost.com/blog/mobile/support-vs-optimization/">Brad Frost</a></li></ul>
<p>Unstated assumptions:</p>
<ul><li><em>What’s on the web comprises the sum of&nbsp;human knowledge.</em></li><li><em>Progressive enhancement is fundamentally about universal access to this sum of human knowledge.</em></li><li><em>It is always immoral if something on the web isn’t available to everyone.</em></li></ul>
</blockquote>

I don’t think anyone quoted here would argue that the Web (taken in its entirety) is "the sum of all human knowledge"—Nick, I imagine, was using that phrase somewhat hyperbolically. But there is a lot of information on the Web folks should have access too, whether from a business standpoint or a legal one. What Nick, Jeremy, and Brad are really highlighting here is that we often make somewhat arbitrary design & development decisions that can block access to useful or necessary information and interactions.

In my talk [_Designing with Empathy_](https://vimeo.com/70018634) ([slides](http://www.slideshare.net/AaronGustafson/designing-with-empathy-beyond-tellerrand-2013)), I discussed ["mystery meat" navigation](https://en.wikipedia.org/wiki/Mystery_meat_navigation). I can’t imagine any designer sets out to make their site difficult to navigate, but we are influenced by what we see (and are inspired by) on the web. Some folks took inspiration from web-based art projects like this Toyota microsite:

<figure id="fig-2016-12-06-02" class="media-container">

![]({{ site.url }}/i/posts/2016-12-06/02.png)

<figcaption><a href="https://web.archive.org/web/20150222123910/http://www.northkingdom.com/cases/i-huvudet-pa-toyota/">On Toyota’s Mind</a> is a classic example of mystery meat navigation. It’s a Flash site and you can navigate when you happen to mouse over "hotspots" in the design. I’m pointing to one with a big red arrow here.</figcaption>
</figure>

Though probably not directly influenced by On Toyota’s Mind, [Yeshiva of Flatbush](https://www.flatbush.org/) was certainly influenced by the concept of "experiential" (which is a polite way of saying "mystery meat") navigation.

<figure id="fig-2016-12-06-03" class="media-container">

![]({{ site.url }}/i/posts/2016-12-06/03.png)

<figcaption><a href="https://www.flatbush.org/">Yeshiva of Flatbush</a> uses giant circles for their navigation. Intuitive, right?</figcaption>
</figure>

That’s a design/UX example, but development is no different. How many Single Page Apps have you see out there that really didn’t need to be built that way? Dozens? We often put the cart before the horse and decide to build a site using a particular stack or framework without even considering the type of content we’re dealing with or whether that decision is in the best interest of the project or its end users. That goes directly back to [Tim’s earlier point](#project-priorities).

Progressive enhancement recognizes that [**experience is a continuum**](https://adaptivewebdesign.info/1st-edition/read/chapter-1.html#figure-1-2) and we all have different needs when accessing the Web. Some are permanent: Low vision or blindness. Some are temporary: Imprecise mousing due to injury. Others are purely situational: Glare when your users are outside on a mobile device or have turned their screen brightness down to conserve battery. When we make our design and development decisions in the service of the project and the users who will access it, everyone wins.

## Real answers to real questions

In the next section, Josh tries to say we only discuss progressive enhancement as a moral imperative. Clearly I don’t (and would go further to say no one else who was quoted does either). He argues that ours is "a philosophical argument, not a practical approach to web development". I call bullshit. As I’ve just discussed in the previous sections, progressive enhancement is a practical, fiscally-responsible, developmentally robust philosophical approach to building for the Web.

But let’s look at some of the questions he says we don’t answer:

> "Wait, how often do people turn off JavaScript?"

Folks turning off JavaScript isn’t really the issue. It used to be, but that was years ago. I discussed [the misconception that this is still a concern](https://www.aaron-gustafson.com/notebook/progressive-misconceptions/) a few weeks ago. The real issue is whether or not JavaScript is available. Obviously your project may vary, but [the UK government pegged their non-JavaScript usage at 1.1%](https://gds.blog.gov.uk/2013/10/21/how-many-people-are-missing-out-on-javascript-enhancement/). The more interesting bit, however, was that only 0.2% of their users fell into the "Javascript off or no JavaScript support" camp. 0.9% of their users _should have_ gotten the JavaScript-based enhancement on offer, but didn’t. [The potential reasons are myriad](http://kryogenix.org/code/browser/everyonehasjs.html). JavaScript is great, but you can’t assume it’ll be available.

> "I’m not trying to be mean, but I don’t think people in Sudan are going to buy my product."

This isn’t really a question, but it is the kinda thing I hear every now and then. An even more aggressive and ill-informed version I got was "I sell TVs; blind people don’t watch TV". As a practical person, I’m willing to admit that your organization probably knows its market pretty well. If your products aren’t available in certain regions, it’s probably not worth your while to cater to folks in that region. But here’s some additional food for thought:

- **When you remove barriers to access for one group, you create opportunities for others.** A perfect example of this is the curb cut. Curb cuts were originally created to facilitate folks in wheelchairs getting across the road. In creating curb cuts, we’ve also enabled kids to ride bicycles more safely on the sidewalk, delivery personnel to more easily move large numbers of boxes from their trucks into buildings, and parents to more easily cross streets with a stroller. Small considerations for one group pay dividends to more. What rational business doesn’t want to enable more folks to become customers?
- **Geography isn’t everything.** I’m not as familiar with specific design considerations for Sudanese users, but since about 97% of Sudanese people are Muslim, let’s tuck into that. Ignoring translations and right-to-left text, let’s just focus on cultural sensitivity. For instance, a photo of a muscular, shirtless guy is relatively acceptable in much of the West, but [would be incredibly offensive to a traditional Muslim population](http://www.instantshift.com/2015/04/23/website-designs-for-various-cultures/). Now your target audience may not be 100% Muslim (nor may your content lend itself to scantily-clad men), but if you are creating sites for mass consumption, knowing this might help you art direct the project better and build something that doesn’t offend potential customers.

Reach is incredibly important for companies and is something the Web enables quite easily. To squander that—whether intentionally or not—would be a shame.

## Failures of understanding

Josh spends the next section discussing what he views as failures of the argument for progressive enhancement. He’s of course, still debating it as a purely moral argument, which I think I’ve disproven at this point, but let’s take a look at what he has to say…

The first "fail" he casts on progressive enhancement proponents is that we "are wrong about what’s actually on the Web." Josh offers three primary offerings on the Web:

<blockquote cite="https://www.viget.com/articles/the-case-against-progressive-enhancements-flimsy-moral-foundation">
<ul><li>Business and personal software, both of which have exploded in use now that <a href="http://www.wsj.com/articles/SB10001424053111903480904576512250915629460">software has eaten the world</a> and is accessed primarily via the web</li><li>Copyrighted news and entertainment content (text, photos, music, video, video games)</li><li>Advertising and marketing content</li></ul>
</blockquote>

This is the fundamental issue with seeing the Web only through the lens of your own experience. Of course he would list software as the number one thing on the Web—I’m sure he uses Basecamp, Harvest, GitHub, Slack, TeamWork, Google Docs, Office 365, or any of a host of business-related Software as a Service offerings every day. As a beneficiary of fast network speeds, I’m not at all surprised that entertainment is his number two: Netflix, Hulu, HBO Go/Now… It’s great to be financially-stable and live in the West. And as someone who works at a web agency, of course advertising would be his number three. A lot of the work Viget, and most other agencies for that matter, does is marketing-related; nothing wrong with that. **But the Web is so much more than this.** Here’s just a fraction of the stuff he’s overlooked:

- eCommerce,
- Social media,
- Banks,
- Governments,
- Non-profits,
- Small businesses,
- Educational institutions,
- Research institutions,
- Religious groups,
- Community organizations, and
- Forums.

It’s hard to find figures on anything but porn—which incidentally accounts for [somewhere between 4% and 35% of the Web](http://www.bbc.com/news/technology-23030090), depending on who you ask—but I have to imagine that these categories he’s overlooked probably account for the vast majority of "pages" on the Web even if they don’t account for the majority of traffic on it. Of course, as of 2014, [the majority of traffic on the Web was bots](http://www.smithsonianmag.com/smart-news/majority-web-traffic-comes-robots-180950398/), so…

The second "fail" he identifies is that our "concepts of universal access and moral imperatives… make no sense" in light of "fail" number one. He goes on to provide a list of things he seems to think we want even though advocating for progressive enhancement (and even universal access) doesn’t mean advocating for any of these things:

- _All software and copyrighted news/entertainment content accessed via the web should be free._ and _Netflix, Spotify, HBO Now, etc. should allow anyone to download original music and video files because some people don’t have JavaScript._ I’ve never heard anyone say that… ever. Advocating a smart development philosophy doesn’t make you anti-copyright or against making money.
- _Any content that can’t be accessed via old browsers/devices shouldn’t be on the web in the first place._ No one made that judgement. We just think it behooves you to increase the potential reach of your products and to have a workable fallback in case the ideal access scenario isn’t available. You know, smart business decisions.
- _Everything on the web should have built-in translations into every language._ This would be an absurd idea given that the number of languages in use on this planet top 6,500. Even if you consider that 2,000 of those have less than 1,000 speakers it’s still absurd. I don’t know anyone who would advocate for translation to every language.[^1]
- _Honda needs to consider a universal audience for its marketing websites even though (a) its offline advertising is not universal, and (b) only certain people can access or afford the cars being advertised._ To you his first point, Honda does actually offline advertising in multiple languages. They even <a href="http://news.honda.com/newsandviews/article.aspx?id=8340-en">issue press releases mentioning it</a>: "The newspaper and radio advertisements will appear in Spanish or English to match the primary language of each targeted media outlet." As for his second argument… making assumptions about target audience and who can or cannot afford your product seems pretty friggin’ elitist; it’s also incredibly subjective. For instance, we did a project for a major investment firm where we needed to support Blackberry 4 & 5 even though there were many more popular smartphones on the market. The reason? They had several high-dollar investors who loved their older phones. You can’t make assumptions.
- _All of the above should also be applied to offline software, books, magazines, newspapers, TV shows, CDs, movies, advertising, etc._ Oh, I see, he’s being intentionally ridiculous.

[^1]: Of course, last I checked, over 55% of the Web was in English and just shy of 12% of the world speaks English, so…

I’m gonna skip the third fail since it presumes morality is the only argument progressive enhancement has and then chastises the progressive enhancement community for not spending time fighting for equitable Internet access and net neutrality and against things like censorship (which, of course, many of us actually do).

---

In his closing section, Josh talks about progressive enhancement moderates and he quotes [Matt Griffin on <cite>A List Apart</cite>](http://alistapart.com/article/the-future-of-the-web):

> One thing that needs to be considered when we’re experimenting ... is who the audience is for that thing. Will everyone be able to use it? Not if it’s, say, a tool confined to a corporate intranet. Do we then need to worry about sub-3G network users? No, probably not. What about if we’re building on the open web but we’re building a product that is expressly for transferring or manipulating HD video files? Do we need to worry about slow networks then? ... Context, as usual, is everything.

In other words, _it depends_, which is what we’ve all been saying all along.

I’ll leave you with these facts:

- Progressive enhancement has many benefits, not the least of which are resilience and reach.
- You don’t have to like or even use progressive enhancement, but that doesn’t detract from its usefulness.
- If you ascribe to progressive enhancement, you may have a project (or several) that aren’t really good candidates for it (e.g., online photo editing software).
- JavaScript is a crucial part of the progressive enhancement toolbox.
- JavaScript availability is never guaranteed, so it’s important to consider offering fallbacks for critical tasks.
- Progressive enhancement is neither moral nor amoral, it’s just a smart way to build for the Web.

Is progressive enhancement necessary to use on every project?

_No._

Would users benefit from progressive enhancement if it was followed on more sites than it is now?

_Heck yeah._

Is progressive enhancement right for your project?

_It depends._
