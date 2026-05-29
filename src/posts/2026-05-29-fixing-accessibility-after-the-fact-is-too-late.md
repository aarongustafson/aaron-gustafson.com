---
title: "Fixing Accessibility After the Fact Is Too Late"
date: 2026-05-29 09:00:00 +00:00
comments: true
tags: ["accessibility", "AI/ML"]
description: "At Ability Summit 2026, I moderated a panel on shifting accessibility left in the age of AI with Yumeng Ma, Dylan Barrell, Navin Thadani, and Ed Summers."
twitter_text: "At Ability Summit 2026, I moderated a panel on shifting accessibility left in the age of AI with Yumeng Ma, Dylan Barrell, Navin Thadani, and Ed Summers."
---

At Ability Summit 2026, I had the pleasure of moderating a panel on a topic that feels more urgent by the day: how we prevent accessibility defects before they are baked into AI-assisted workflows and shipped at scale.

> As AI accelerates how software and content are created, accessibility risks emerge earlier and propagate faster than traditional testing and remediation can handle. This panel explores what “shifting left” means in the age of AI, from evaluating foundation models and code generation for accessibility, to embedding inclusive intent directly into design and development workflows. Panelists discuss how AI-assisted design tooling, automated scanning, and remediation in engineering pipelines can work together to prevent defects before they ship. Drawing on internal and external perspectives, the session presents a closed-loop view of accessibility that spans creation, evaluation, and remediation at AI speed.

<!-- more -->

Joining me were four people doing important work from very different angles:

- [Dylan Barrell](https://www.linkedin.com/in/dylanbarrell/) of Deque Systems, who is focused on making accessibility sustainable and practical within modern engineering workflows.
- [Yumeng Ma](https://www.linkedin.com/in/momentine/), a PhD student at the University of Washington whose research examines AI, accessibility, and how code generation systems perform on real accessibility tasks.
- [Ed Summers](https://www.linkedin.com/in/edsummersnc/), Head of Accessibility at GitHub, who has been helping shape how accessibility can show up in tools, pull requests, and developer culture.
- [Navin Thadani](https://www.linkedin.com/in/nthadani/), co-founder and CEO of Evinced, whose team works on deterministic accessibility testing and remediation at scale.

Our conversation centered on what “shifting left” means in the age of AI: improving model inputs, tightening prompts and instructions, adding deterministic checks, and building accessibility directly into the harnesses and processes that increasingly guide software creation.

Unfortunately, the panel wasn’t recorded, but my good friend [Kelly Goto](https://www.kellygoto.com/) recorded the audio, so I was able to put together the following transcript. It’s a bit rough — some of the audio was garbled — but I think it captures the spirit of the conversation and the key points that were made. I hope you find it useful!

## Full Transcript

**Aaron Gustafson:** Welcome to our session, “Fixing Accessibility After the Fact Is Already Too Late.” Before we jump into the content, I’m going to ask everyone to introduce themselves. But because I’m cheeky, we’re going to introduce ourselves using name, role, and value. So I’ll take moderator privilege to go first. My name is Aaron Gustafson. I am a Principal TPM on the Accessibility Innovation Team here at Microsoft, and one of my values is our differences. I think we all have unique perspectives and experiences, and when we feel safe to bring our whole selves to work and to our social interactions, you really create better products and a better culture. I’m going to pass it over to Yumeng.

**Yumeng Ma:** Yeah, hi, my name is Yumeng Ma. I’m a computer science PhD student at the University of Washington and my research is on human-computer interaction, but my interest lies in the intersection of AI and accessibility. A lot of my current work actually looks at how AI generates code and whether that code is even accessible to begin with. Something I value is making impact on people’s lives. For example, when people say AI is helping with accessibility, what drives my motivation and curiosity is really understanding how it’s helping and what ways we can improve it.

**Dylan Barrell:** Hi, my name is Dylan Barrell. My role is cat herder at Deque Systems. I have been focusing on making accessibility sustainable. I think that’s the important thing. And in doing that, one thing that I value is how to use technology to do that. So, very excited to talk today about how we can use AI in particular and what the pitfalls and the advantages of that are, and how we can do that in a practical way. Because for us, in order for accessibility to be sustainable, it also needs to be practical.

**Navin Thadani:** So my name is Navin Thadani. My role is the co-founder and CEO at Evinced. We’re a digital accessibility technology company. And my value, I like to think it’s a lot, but my team doesn’t let me commit code anymore.

**Ed Summers:** I have the same problem. My name is Ed Summers. I’m head of accessibility at GitHub. And the thing that I value most is this lovely accessibility community that we have. I mean, it’s great to be with you all here. More IRL community.

**Aaron:** Awesome. All right, so to kick us off... AI didn’t just change how we build software, it changed how defects are born and how quickly they propagate. We’re shipping code faster than ever, which is super risky, and numerous studies have shown that code generation models are not that great when it comes to generating accessible code from the jump. On top of that, the latest WebAIM Million Survey shows an uptick in accessibility violations on top home pages across the web. I’m going to direct our first question to the folks on the panel who are working to address accessibility issues at scale: What are you seeing out there? Is the uptick in the WebAIM Million an early indicator of the tsunami of accessibility issues that AI will be generating? Ed, why don’t you kick us off on that?

**Ed:** Okay, let’s go. I don’t want to be an AI apologist or anything, but I think that the WebAIM, this year’s survey did see the increase from 51 errors or barriers found per page on average to 56. That’s kind of what we’ve been referring to here. I don’t think that is an indicator of a tsunami.

I think that a couple of things are going on. The AI models, the foundational models are trained on years and years and years of human output. So they mirror back what we do as humans. So the AI bias is human bias. And I think that’s right, and we need to work diligently to remove that bias.

But for the purposes of this discussion, can we expect a tsunami of accessibility errors due to the increases of AI? I don’t think so. I think it’s a multiply by one in the sense that we’re just going to get more of what we’ve been getting in the past as we use AI more and more. And I think if you look at the trend of the WebAIM data, for example, for the last eight years, those numbers of barriers per page, they’ve been between the range of 60 and 50. And 56 this year, 51 last year, the year before that, it was 56. So I think there’s just some noise in that data and it’s kind of roughly in line. I think what’s exciting to me is the opportunity that we have, the lever that we have with AI in order to remove bias at scale, which is obviously what we’re here to talk about.

**Aaron:** Dylan, you had some thoughts you wanted to add on.

**Dylan:** Yeah, I think there is, there’s been some studies that we put out. The problem with any study about AI is that AI moves so fast that by the time the study comes out, it’s sort of obsolete. It’s kind of one of those things that go on. So with that being said, one of the studies that has come out recently, for example, we’re slightly biased, of course, I understand that, but is that just defects in general are going up as we ship more code. And I think this is one of the big problems that organizations are facing today is we can generate code.

So the constraint that we used to have in our organization was often not how quickly we could create the code. And we’ve shifted that constraint from how quickly we can create code to how quickly we can determine whether the code that we’ve created is the right quality in all the different ways in order to be able to ship it. And so quality as a whole, as a problem, has become this sort of bottleneck.

People who are doing code reviews, for example, are now the bottleneck that we have to deal with. And so organizations are straining and a lot of them are putting out code and whether the bugs that they have are accessibility related, whether it’s just quality related, dealing with that problem of that new constraint is one of the biggest things that organizations have to deal with. And accessibility is a big part of that as well.

**Aaron:** What Dylan was talking about in terms of the speed these models are changing... Yumeng, I wonder if you could talk about your research and how trying to figure out what models to map your research against was super challenging because of the models constantly changing under you.

**Yumeng:** I think one thing we struggled the most when coming up with my research study was to select what models to evaluate. In research, a lot of what we capture is a snapshot in time, whereas models are constantly changing. Let’s say we benchmark some models now, after a few months, new models will come out. And so that’s really challenging, right?

So one way to combat this is that I have designed a testbed called PACE, which stands for Prompt Accessibility Controlled Evaluation. And essentially it’s like a playground where users have the freedom to configure how many models they select, what models they select, and alongside with what prompt they choose. And so kind of bringing that system or that testbed in, we can reuse that system to evaluate models now and even in the future.

**Aaron:** Navin, anything you’d like to add from what you’re seeing?

**Navin:** Yeah. So before I get to that, real quick, I did want to point out one thing. We all look at this WebAIM study every year, and we sort of kind of beat ourselves up about it a little bit. Because it doesn’t show much progress and all that. And while it’s an OK barometer at a macro level, I think that when you start kind of dissecting things, things aren’t as bad as it seems. I just want to point that out.

Our view is a lot more optimistic about where things are at, because you focus on the Fortune 500 companies, for instance, as opposed to a small online retailer in Kuwait, which is part of the WebAIM Survey. I’m not saying that’s not important, but when you look at, think of it as frequency weighting, you know, what people actually use, we find that the number of defects on a per page level are much lower, and it’s actually a good thing, and when you look at critical defects, even lower than that.

When you look at web applications as opposed to websites, people aren’t doing a good job. They’re trying. I mean, it’s far from perfect, but it’s nowhere near the doom and gloom that we all kind of think about when we look at the web. That’s the first point.

Second point is, I’m with Ed on this. The models, so far at least, are trained on the code that humans have written. And it’s mostly open source code that they’re trained on, which we all know open source is great and known for a lot of things. Accessibility unfortunately is not among them. So they do produce a lot of issues for the most part. But on a unit basis, we can expect AI to generate the same thing.

The problem is that there’s more code being written. Because it’s easy to write code now. So the total number of defects that you’re going to find could actually increase. But on a unit level, it’s probably going to be around the same. But from a, again, total perspective, it is going to increase. So that’s one inflection point that if we don’t do anything, that’s the risk.

But on the other hand, quite frankly, I think it’s easier to harness AI to actually generate accessible code much more than it is to train a developer. You look at what we’ve been doing as an industry for a long time. We’re training 100 developers; tomorrow, 33 of them are gone.

Literally, people change their job once every three years on average. And forget about the fact that it’s hard to remember what you studied. I don’t remember anything of what I studied in undergrad. Let me tell you that, for instance. So it’s very difficult to remember what you studied. And on top of that, you’re losing 33% of your employees every year.

When you look at it from an opportunity perspective, I believe we have the right opportunity and the right tools and the right motivation right now to actually reverse that trend and drive it down as close to zero as possible. So I’m very optimistic about what we can do with AI.

**Ed:** Can I jump in?

**Aaron:** Of course.

**Ed:** Thank you.

Those are great points, and I think that the turnover is such a great point. It’s a challenge for us.

We talk about AI in isolation because it’s the latest tool. I think, you know, we can’t lose sight of the fact that the developer culture, you know, the culture of the relatively small number of people that build the things that the rest of the digital things that the rest of the community uses is so incredibly important. And last year, GitHub took a challenge. We took a pledge to help improve the accessibility of open source.

Part of it is what you just said about the training. And most people don’t know this, but 70 to 90% of the source code in your typical website or your typical application is open source code. If you take all the source code and put it in one big file, 70 to 90% of that source code is open source. So we have a lot of work to do there. And in improving the accessibility of open source, I think, building a culture of accessibility across the global developer community can put us in a position where accessibility becomes a portable skill that you take from one job with you to the next, as opposed to showing up for the job and like, oh, they want us to do accessibility. Okay, I’ll do it here, but I’ll do it after that. I think that’s one of our challenges here.

**Navin:** You can always have this point using technology like MCP and all that to start going out and automatically remediating some of these issues that are out there that are common and what people use, it’s another great opportunity and definitely something that should be done. But I was reading the other day how in the Linux kernel now, there’s so many automated patches that are coming in that we just can’t keep up with that anymore. So we don’t want that same problem when we try to remediate some of the open source code. But I do think if it’s not right, that is one way to do it, we should do it.

**Ed:** One more thing. Open source developers are amazing, and this is in no way, shape, or form. Most of us, some get paid, not that many. I don’t want to criticize them. We want you to go support open source.

**Aaron:** But also, to Navin’s point, don’t overwhelm them with giant commits, like 10,000 file changes. Those teams cannot parse that, right? It’s not possible to go through that. So if you want to commit to open source, which I highly recommend, make sure that your commits are discrete and fixing a very specific thing and you don’t just dump a bunch of work in their lap because that’s going to be totally overwhelming.

One more thing I want to pick up on, going back to the survey, and I think that Ed and Navin both make really good points about this. We don’t talk an awful lot, or at least we don’t index really heavily on the fact that it’s home pages. And home pages, if anybody has ever worked on a home page, they are very political. They are very marketing-driven. They are not necessarily where the best choices are made. I’m just gonna throw that out there. And they’re not where people go to do tasks, right?

And so they’re not the key things that people are going to to interact with your website. They are a front door. And yes, we want that front door to be accessible. But at the same time, to your point, they’re not representative necessarily of the quality of the code that’s in the rest of the site.

All right, let’s pivot a bit...

So as everyone up here is focused on shifting left, I want to shift as far left as we can go when it comes to AI models and talk about the work we need to do in that space to improve the quality of the code that’s recommended to us. A little bit of touching on that. I think the point about this was trained on code that we all collectively wrote, which was not always code that we are proud of. I think that’s really important.

I have a friend that coined the term the “full StackOverflow developer” and I think of AI as the “full StackOverflow developer at scale” because there’s lots of stuff out there on StackOverflow that is not the best advice. And there is a real risk, to Navin’s point, as there is more AI-generated code out there, that this gets fed into the models, just like when we talk about slop content. We have slop code out there, and it becomes like the snake eating its own tail, the ouroboros, right?

So I think this is something that we need to be thinking a bunch about.

For years, we’ve been working to improve the tools and procedures that we have when it comes to identifying and remediating accessibility bugs. But that work often comes late in the software development lifecycle. When it was humans designing the UI and authoring the code, we talked about the importance of education when it comes to accessibility. And now we’re in an era where these models have nearly immediate access to far more information than humans can retain. And yet it seems that we’re struggling to get them to properly index on the right things when it comes to accessibility.

So my question is, are the issues that we’re facing in terms of code quality fundamentally about a lack of proper training data, or is it more a question of how we direct codegen models to access the data they already have? Yumeng, why don’t you kick us off on this topic? What have you seen in your research?

---

**Yumeng:** Yeah, I think one thing that I’ve seen in my research is that code quality isn’t just attributed to the training data and not just a prompting problem either.

For example, if we train, if we even have this ideal training data that we give to the model, the model itself is still essentially a black box. How the model, the way it interprets or thinks about the training data is also a problem. And in my research, we also looked at generating AI code with different models and with different prompting conditions. But the prompting, there wasn’t a universal prompt that made all the models reliably more accessible. There wasn’t a path where the models would output accessible code. And so it may even come down to maybe thinking of ways to even guide the AI models in a way that is interpretable for machines to learn.

Another thing that we’ve seen is that it might also be a measurement problem because a lot of the automated tools that we’re seeing. Some of the code that is generated by AI actually passes automated tools. But if you look at the semantic structure, because in my research, I’m focusing on a lot of HTML code, the semantic structure is not exactly accessible to people with disabilities.

**Aaron:** Maybe technically valid, but not actually.

**Yumeng:** Right.

**Aaron:** Do you have something you want to add Dylan?

**Dylan:** Well, yeah. I think people are talking about trust. Can we trust what the models are outputting? And I don’t think that’s even a relevant question, because we don’t trust the code that our human collaborators create either.

So for me, it’s not about trust at all. It’s about how do we take the output that’s being generated and how do we test it to make sure that it, in fact, has the quality that we want, or which one of them is accessible, right? And this comes back to the question I talked about with scaling this, because this becomes a scaling problem.

But aside from the scaling problem, there are certain approaches that we can take. And some approaches are better than others.

If we, for example, take agents and we use them to test the output of other agents, and we give them very specific prompts on what to do, they can do a decent job of improving the quality of that code overall. But one of the things that we found, and I think this is interesting because Ed, I think Ed’s gonna probably talk about this later, a study that Eric Bailey of GitHub did surfaced this as well and there’s a couple of problems that he had with that.

First of all, models in and of themselves have been trained to want to output something, right? And, in fact, the head of Anthropic product development said this. They’ve explicitly trained Claude to be a willing partner that can do and that’s action oriented, right? And so everything they’ve put into the way that they created system prompts and the way they’ve trained it makes it a great tool for us interacting with it when we’re coding. But that same attribute also makes it really bad at doing a comprehensive job of auditing anything, actually.

And you see this explicitly in code reviews. If you ask Copilot to do a code review for you, and then you ask it to do a code review again, on the same code, without having changed anything in between, you’re going to get two different perhaps overlapping sets of results back. So what you need to understand is the strengths and weaknesses of the models, what they’re good at and what they’re not good at, right?

One of the things that you find, if you try to use the agents to just audit each other, is total costs start skyrocketing. And total costs is going to become more and more of a problem. Early on, Anthropic and the other companies had been subsidizing the token costs a lot. And we’ve been using them a lot. But now you’re starting to see the pricing models change. So token cost becomes a big thing. And I think in Eric’s study that he did, that was one of the first things they ran into.

So I think what you’ve got to do is you’ve got to take a combination of more deterministic things that don’t eat up your token costs and you’ve got to combine those with the strengths of the models to really get to where you need to get to.

Looking at the speed, speed is another thing. The agents take a long time. So speed, token cost, and determinism are sort of important attributes. And that’s, I think, where some of the approaches that we’re taking at Deque can really tie together with this. Where we enhance the agents in a deterministic way with things that do comprehensive audits that bring the same results back over and over and over again. And you tie those together with the capabilities of the model is where you achieve the best results. I think that that’s sort of the approach that you have to take toward accessibility in these AI workflows.

Because for me, as Navin pointed out, that is the opportunity here. The opportunity is to teach your agentic workflows how to do accessibility. And if you can do that and do a good job of that, then we can really leverage the power of AI to not only move us forward in all the innovative areas, but to do that in a way that’s also accessible at the same time. So that, for me, is the way we should be thinking about this, using the AI where the AI is powerful and using other approaches where that’s more appropriate.

**Aaron:** I’m going to skip over to Navin real quick and go to Ed, since Eric’s piece was mentioned a couple times. I don’t know, Ed, do you want to talk to Eric’s piece that just came out?

**Ed:** Yeah, I’ll give you the TL;DR. So Eric Bailey is a designer at GitHub on our accessibility team, our accessibility design team. And just simply an amazing accessibility professional. He’s worked for the last few months, two or three months, building our internal accessibility agent inside of GitHub. He just published a blog post Thursday, this past Thursday, maybe it was Friday, on github.com/blog. If you look for it, just look for the accessibility tag.

**Aaron:** It’s in the resources as well.

**Ed:** Okay, great. It’s a treasure. I reread it again this morning and I was like, oh yeah, there’s so many things that we can learn that he was able to back into, I don’t know, like a thousand words. I want to highlight a couple of those as well.

One thing is the work that Eric did building our agent leveraged years of meticulous human effort of manually testing, manually auditing, and tracking and curating our own data set, our accessibility violations that we found within the company. I mean, literally thousands of them, most of them have been fixed, but they’re all cataloged and tagged with WCAG criteria and steps to reproduce, just really well curated data. Much of that, by the way, thanks to Dennis Lembree, who runs our governance program.

And from this knowledge, this corpus of data, oh, by the way, important thing, in addition to excellent issue descriptions, there’s a link to the PR that resolved those issues. Okay, so we have this diff. And it’s not just random, it’s our tools, our design system, the way that we work at GitHub, which is critically important to get that context, I think. And from this corpus of knowledge of data, Eric built this agent. And it’s starting to deliver really nice results. We’ve got it kind of pinned down on the lab bench, and we’re running a pilot study right now internally.

One of the ways we’re using it is on reviews of pull requests that come in for github.com. And we’re getting really great results from that. Part of the reason they’re getting great results, I think it was about 60% resolution rate for those pull requests.

There was one more point I wanted to make about that was... oh yes, the bias towards action that Dylan mentioned. AI models, they’re going to go try and do something for you. Regardless of what you tell them, they’re going to do something. It may be what you want. It may be what you don’t want. But what Eric was able to do is he put a lot of limiting factors on this agent. So we put it in a box and tell it “Okay, these are the things you’re good at. Don’t try anything outside of that box and just don’t generate noise.”

Some of the things that are outside of that box are really complex interactions, like, for example, drag and drop, or data grids or tree grids. These are the things that are really hard to get right. And we just walled off the agent and said, “No, the humans are going to take care of that for now.” And that allows us to build confidence and trust in the PRs, the feedback that the agent’s given on PRs. I encourage you to check out the blog post if you get a chance.

**Aaron:** Yeah, I love the idea of feeding our own bug data. I think that’s such an unused treasure trove of information. And, similar to the GitHub team’s experience, in my own tests, taking and remediating bad code coming from AI coding agents, remediating that manually and then feeding those diffs back to the agents resolved the issues 100% of the time going forward. So having that as part of the training corpus really improved things.

Navin, I’d love your thoughts on this.

**Navin:** I’m going to echo a little bit of what Dylan said as well, because I think, and I’ll add a couple points to that, at the end of the day, the problem is quite straightforward. AI models are non-deterministic. They’re going to generate code, different kinds of code, every time you ask them. The only way to actually make it useful and ensure that things like accessibility are done is via deterministic testing. That is it. And right now, of course, it’s evident to see that if you ask AI to generate a web page, we found so many times there are so many studies out there. 47 errors, and even if you prompt it, then it becomes 46 errors, whatever.

But let’s say we’re optimistic, and eventually we get however long it takes for improvements. But even if AI is generating accessible code for the most part, you always want to validate it. You have to. So now the question is, what kind of deterministic testing do you have? How much are you covering? How accurate is it? And the kind of things that you were talking about earlier in terms of semantic structure and not being tested by. But I can tell you that those kinds of things are possible. And we’re doing those today. So the more you cover, the more you can fix automatically and ensure that what comes out is an even higher level of accessibility. So this stuff really matters.

**Aaron:** Absolutely!

A couple of folks had mentioned the pull request, the humble pull request. It’s often the last line of defense when it comes to preventing accessibility bugs from reaching customers. Catching it directly, remediating bugs, or at least proposing remediations with a human-in-the-loop scenario is something AI agents have proven to be really good at.

How should we be thinking about these automated systems as part of the software development lifecycle loop? Is the PR the right place for these gates and checks to live. Dylan, do you want to start us off?

**Dylan:** Well, I think the PR is too late.

As I’ve always said, we need to shift it as far left as possible. And we need to shift it all the way into design. And then during code generation, we need to be testing the code as we’re generating it before we even submit the pull request. So I think at every step along the way, you have to inject tests into that.

So, for me, the pull request is a necessary thing. We have to have the tests in the pull request because they catch things that slip through in our process, things that slip through in our technology, in our approach, and in our testing. So we need it, but it’s not enough. So for me, it’s about what are those type moves?

Everybody talks about agentic development. What most people are doing today is sitting in front of the coder and they’re asking it to do stuff and then they’re testing that, right? But where it’s moving towards is sort of fully agentic development where you have humans at particular points. In fact, that’s the only way we’re really going to scale is by elevating humans to the points where they can make the really high quality decisions. And then the coding agents do the rest.

So for me, as we see this evolution from where we are to where we’re moving towards, the question becomes “How do you test at every stage in the loops where, as Matt Pocock likes to call it, the AFK loop, right, where the human is away from keyboard and the agents are working. For me, it’s about how do we insert accessibility thinking, accessibility coding, and accessibility testing at every stage along the way, including where the human is away from the keyboard? As well as presenting that information to the human so that they can make a determination. Has this agent, has this agent’s coding loop, have they done the accessibility testing in the way that they should have done that? And we need to be looking at the results.

So for me, that’s kind of where things are moving to and those sort of approaches that we should be thinking about.

**Aaron:** Yeah, I love that.

I’m curious, just kind of for the audience: from y’all’s perspective, there are so many tools that we have now for when we’re working with agents in the coding context. We have instruction files, we have agent files, we have sub-agents, we have orchestrators, we have skills. We have deterministic tools that we can have the agents run, like axe-core or Evinced’s unit testing tools, those sorts of things. How should people be thinking about all of these tools and how they work together and how to get the most bang for the buck? And I didn’t even mention MCP.

All of these different things... Navin... do you want to kick us off on that one?

**Navin:** Yeah, I can describe what we see as a basic scenario and then I’ll talk about a little bit more advanced one.

At the basic level, you know, you imagine you’re a developer sitting in front of or whatever, and you just build your feature, some form on some page, drop downs, whatever. Where you can just go ahead and say, “All right, but remediate that,” or “fix that,” or whatever. And it’ll basically run a deterministic test. It’ll then come back with a set of issues. And then you can give the machine, the agent, in this case, agent-specific fix instructions. You manage the context in a certain way. And all of that can now be fixed automatically. So, as Dylan was saying, when you do your pull request, it’s already cleaned, at least for the most part, right?

That’s one way to do it, but there is a problem in that: the developer still has to do something. They have to go out and actively say, I want to fix any accessibility issues in this piece of code that I just developed before I push it further down the line. Sometimes it’s hard to do even that, to be honest. That’s just where we are.

There are many ways that you can get around that and have it have this sort of deterministic testing, these guardrails or the new word these days is “harness”. Harness engineering or whatever. But you get in many ways. There’s the skill files you mentioned, there’s configurations at the repo level, there’s all kinds of things you can do. You can integrate it into automated tests that happen as well.

So you write an automated test, the agent writes an automated test, inserts accessibility in there. If there’s an issue, a GitHub Action gets triggered, code gets fixed, and there you go.

It can happen automatically as well. So I think it really depends on your development model. It depends on the architecture that you have internally. But all the necessary ingredients are there already to be able to significantly improve the quality of code from an accessibility perspective, which is out of the box right now.

**Dylan:** I think two words you said triggered me because I think about these a lot. And these are things that I think everybody who’s in the accessibility industry should be paying attention to. There’s two words: “harness engineering” and “context engineering,” right? And if you hear these words inside your organization, this is your opportunity because, I think Navin hinted at it if he didn’t say it, but one of the things that’s a huge opportunity from an AI coding perspective, from an accessibility perspective is AI agents do what you tell them to do. They don’t complain about it. They don’t say, no, that’s too much work, or I don’t know how to do that, whatever. They just do it. And the better the context you give them and the better the tools that you give them in order to be able to do that, the better the job that they’re going to do.

So what harness and context engineering is about is about how we engineer these tools that are becoming more and more automated. What sort of process we build, where the human gets pulled into it and when they don’t, what gets created as the artifact that comes out of that, that then has to be reviewed.

And the context is important because context is at least three things:

- It’s the context of the repo that you’re working on. What are the rules of that repo? What sort of tools are available in that repo? How do you do testing in that repo, et cetera?
- And then there’s a context more generically about how do we do accessibility testing in this company. That’s sort of repo agnostic.
- And you have to tie these things together in order to achieve the outcome.

So harness engineering is not only about creating that, but it’s also about looking at the data as stuff is moving through that and analyzing what is working well. This is a much bigger topic than just accessibility, but accessibility is one of those things.

So one of the things you can do if you’re setting up your harness correctly is you can create these history files where you can look at the interactions between the different agents and what caused that churn. And churn is bad from a lot of perspectives. It costs money, it costs time. And you can then say, why are they churning? And then you can modify your context and your tools and your harness to eliminate that source of churn.

When you hear people talking about this is an opportunity for you as an accessibility practitioner to say “How do I get involved in those activities within my team or within my organization? So I can accessibility-enable those AI processes.” Because if organizations right now are redesigning the way they do software development, that’s a huge opportunity for us to get accessibility baked in.

So if you hear those keywords, jump on it and find out how you can get involved in making those harnesses and those context engineering accessibility-enabled. If there’s one takeaway that I’d like you to take away from what I’m saying up here today, it’s look for that and do that, because that’s the opportunity.

**Aaron:** I want to pick out one thing that each of you touched on.

In terms of reading your model’s logs, I think that there’s huge value in doing that to look for those kinds of inefficiencies. With one caveat: There’s been some research that actually the models are lying about their chain of thought in some cases.

The second thing is, Navin mentioned, having AI help you by writing tests. I think that can be super useful, but at the same time, a lot of these models, they want to please. So they want to create a test that is going to be green.

So it would not surprise me, because I’ve seen it, I see agents mock all sorts of different API endpoints, I would not be surprised if one had mocked axe-core to have always return green.

I think those are some of the things that we need to also be aware of when we’re working with these models and just being sort of realistic about what their strengths and weaknesses are.

[To Yumeng] I’m wondering, from your research, because you were looking a lot at the ways that we were prompting models and a lot of that can then feed into the way that we’re writing agent files or skills, how we’re addressing the model. I wonder if you could share some of your insights from your research.

**Yumeng:** Yeah. So what we looked at is different levels. In my research, we looked at different levels of accessibility guidance. So the lowest guidance would be no guidance. And then the second level would be just saying the keyword “accessible” in the prompt. And then the third would just be taking some factors from WCAG and turning it into the guidance and seeing how the AI responded. But I think it dives deeper than just prompting, because what we found is that there’s not a magical prompt that made the AI code output more accessible.

I think it’s not as simple as just saying, oh, just tell the AI agent to write accessible code. I think that puts a lot of pressure on the user and a lot of trust on the AI model. And so I think there’s a lot of factors beyond just prompting and just guiding the model.

So again, it feels like a big black box where we’re not certain what the factor is. It could be the evaluation, it could be the model prompting, could be even that prompting can be configured with this overall system instruction versus the specific request or task you’re asking it to do or what you’re asking it to output. Because what we’re seeing in my research, we’re looking at specifically HTML form components, is variability. Easier form components like, for example, a submit button might be just more accessible by default. As opposed to, let’s say, something more complicated like a toggle switch or something with validation or helper text, et cetera.

**Aaron:** All right.

Ed, I wanted to come over to you, and I actually wanted to ask you a little bit to talk about the GitHub Accessibility Scanner and some of the work that you’re doing in the PR space. You made an interesting point as well in one of our early discussions about this, about the opportunity for just-in-time training for engineers who are reviewing PRs from your accessibility agent.

**Ed Summers:** Yeah, sure. So recently, in the last few months, we released our accessibility scanner.

There’s a couple key things about that. One, it’s based on our deterministic scanning. And then we just recently added the plugin architecture, which has opened up lots of new possibilities for interactive testing.

The first built-in plugin that we’re shipping, that’s available to everybody, as opposed to something you can do on your end in your repo, tests for reflow. 1.4.10? I think it’s 1.4.10. Yeah, definitely, I can’t remember the numbers. So stay tuned for more interesting things coming out there.

Also, if you’re using the scanner, you can start to build your own custom extensions there. So by default, the scanner will assign issues that it creates, which are the descriptions that we see are good for prompting, we’ve been working a lot on prompting. The description of the issues that are filed are essentially prompts for GitHub Copilot to create a PR for the fixes. And those prompts, like Yumeng is saying, they really do matter.

Then the other thing that’s really relevant here, and that everybody can do, this is almost a freebie, you know, there are certain things we can do that are almost, they’re really easy to do, and they’re gonna have a pretty large positive impact with relatively few negative impacts, is to use custom instructions, which we also might call the system prompts.

The place to go look for the latest thinking on custom instructions is Michael Fairchild. He works in Microsoft’s security division. He’s done really great work on evaluating how custom instructions affect outputs with different models. Do you have that in our resources?

**Aaron:** Yep, it’s there.

**Ed:** It’s called the A11y LLM Eval. And if you combine this kind of automatic assignment of issues to Copilot with custom instructions in your repo, with good model selection, because we know that model selection matters, you can just really, you can start to eliminate accessibility debt before it gets started, which is really what we want to do.

**Dylan:** Yeah, we found the same thing, actually.

We have, as part of our MCP tool, we have a remediation tool where you pass it the context of the defect. And it uses the Deque University knowledge in the back end to then give you back the exact context you need on how to address that problem. And we found that that, together with the fact that the agent itself has the context of the source code, allows it to then really translate that very specific guidance on that particular type of issue into a really high quality remediation very, very, very consistently.

So yeah, there’s ways you can do that in a sort of a static way and then there’s ways you can do it sort of more dynamically like that as well.

**Navin:** Yeah, there’s one point I’d like to make.

We’re talking about these sorts of things and in some ways there’s a bigger risk that we haven’t addressed. We’re kind of sitting here, for the most part, all of us care a lot about accessibility. We’re also involved with our development teams, and we think about it a lot. But unfortunately, this is a bit of an echo chamber, because we’re not considering what the rank and file front-end developer has to go through and is thinking about on a day-to-day basis. And it’s not very much accessibility, unfortunately.

So I can give you an example, and it’s best to understand this through an example. I was talking to an engineer, front-end engineer, at a healthcare company. And we kind of challenged her and turned around and said, “All right, but how are you going to solve accessibility? Forget the tooling and all that. What’s your basic problem here?” So she goes to Claude Code and says, “Test for accessibility.” And it came back with some number of issues.

Then she said, “OK, go fix these issues.” So no validation of whether the issues are correct, not this or that. Go ahead, fix these issues, and it turns out that the 30 issues that Claude tried to fix all at once just inundated the context entirely. There were no guardrails, there was nothing. And talk about thrashing, this was token burning. This is what’s going on. I mean, people think like that.

So, yeah, we can all sit here and say, we’ve got tools, we’ve got harnesses, and we can remediate things automatically, this and that. But at the end of the day, front-end architects in these large development teams need to be the ones to actually integrate these sorts of technologies into the fabric. Because otherwise it’s not happening.

**Aaron:** Yeah, put some rigor around that process.

**Navin:** Yeah, I mean, not everybody’s like Ed. Not every company is like Microsoft, where you can try to build your own tools and this and that. Certainly, you can try. And if you’re an average enterprise out there, do you want to be in the business of building accessibility tooling for yourself?

**Ed:** This comes back to one of your questions you had earlier that we forgot to mention, the kind of the opportunities around PRs, and including AI and PRs. And that’s a just-in-time training opportunity for those developers. Because that developer can go off and say, “OK, test accessibility,” then fix all those. And then she’s going to create a PR, but if all that’s trash, then we can put a system in place to catch that slop at the PR. And, in doing so, in order to address the issue comments or PR comments that are being raised by a good accessibility agent, that required the human developer to read those and accept or reject them. In reading those, and I see this all the time in the work that we do at GitHub, the explanations of why the diff is being suggested in PR are really good.

In one of our discussions when we were preparing for this panel, we discussed taking the outputs and pulling them back around. If we can go back to the humans and train them along the way, especially at scale, because every PR and every code change that you ship in your organization has to go through a PR process and you’re getting feedback to your developers and just in time training literally hundreds of thousands of those a day, that’s going to make a big difference.

**Dylan:** Actually, your organization put out, together with The Pragmatic Engineer, a study. I read it yesterday. So, interesting thing when you mentioned developers reading comments... I don’t think they read them anymore. And I think one of the things that came out of that study was leadership and organizations pushing more and more for more and more speed, and they don’t care about the code quality as much anymore.

So there’s a lot of pressure on developers to just sort of say, fix it, like Navin said. That’s the response. “Oh, you found these things? OK, fix them” becomes the challenge, becomes the standard response.

So I think that’s a reality that we have to accept. We’re moving into a situation where developers, they’re no longer writing code. They don’t write code, nobody writes code. But they’re going to stop reading code pretty soon too. And they’re not going to read any lines of code ever. So I think it’s great to talk about kind of where the past was, but I think what we should be thinking about is where it’s moving too, because we need to set ourselves up for that future where developers aren’t reading code, developers aren’t writing code. And so now what do we need?

**Aaron:** It becomes really important that we teach people how to ask the right questions for the model and ask, “Oh, why did you approach it this way?” Or, before they start coding, say “Develop a plan for me to explain why you need to make all of the changes that you’re suggesting and what they’re going to fix.”

Circling back to the tons of issues that get found by AI, I’d say the same thing goes for accessibility testers. If your accessibility testers aren’t particularly knowledgeable, you can end up with a lot of noise in that space as well, where you’ve got things that people are suggesting, fixes that are actually going to make the system less accessible.

We’ve got about 10 minutes left, so I’m going to try and steer us towards the end here.

No single org can solve this alone. The ecosystem has to interoperate and we have to learn from each other if we’re going to crack that nut, which is why I have all of you on stage. So, to meet this moment, we need to get all hands on deck. We need to improve the models themselves. We need to consider how we prompt them. We need to consider the tools that we hand them, how they integrate into our current and future processes.

We also need to recognize that AI’s ability to help us scale up our ability to find remediate bugs is not the end of the story, it’s only the beginning. If anything, it frees us up to shift the focus from simple accessibility bugs that we just can’t seem to eradicate to more complex interactions that we need time to ponder and to explore, places that we need to apply our human creativity and our human ingenuity.

So as we close out, I’d like to pass the mic around one more time to our panel and ask everyone to please share something that excites you about this moment or something that you would like to encourage our audience to investigate further.

Navin, do you want to kick us off?

**Navin:** Yeah, I think there’s only one thing, and I’ll say it again. It’s deterministic testing. That is the most important thing in today’s day and age.

**Ed:** I’ll make it quick too. I’ve come up with a little metaphor for a strong accessibility leader in today’s rapidly changing environment. Because, you know, we talked so much about AI, but the people, and this whole thing are so important. The accessibility professionals out there who are dealing with this rapid change that’s being forced upon them, you know, and are rapidly adopted, might be overwhelming.

Most accessibility programs are one person. So I was thinking, you know, what does a strong accessibility leader look like today? My metaphor for that is a dumbbell, you know. And on one end of the dumbbell, we have an eagerness, an embracing of this opportunity that we have with AI, knowing that it’s changing everything, knowing all the uncertainties and how rapidly it’s changing. But the only way to deal with that, it’s one thing that going blind teaches you: When change comes, you just kind of get in there and embrace it. You cannot fight this. So I think leaders need to embrace this change and jump into these discussions, with these panelists here and the other folks that were mentioned.

And then the other end of the dumbbell is a focus on the humans. That’s the humans that use our technologies that need accessibility with a focus on user research. User testing with our friends from Fable or other organizations like that is absolutely critical. Design, actual thoughtful design. And also a good understanding of the human psychology of the developers, the people that are in the pressures upon them, both in the open source community and in the private sector. Because the psychology of those developers, those designers, those professionals is a factor that can make or break our success when we’re putting together, when we’re building accessibility programs.

And then the bar between those two ends of the dumbbell is that strong leader that’s embracing the human side and the rapidly changing AI side.

**Aaron:** Okay, Yumeng.

**Yumeng Ma:** Yeah, what a great metaphor. I’m going to say that I would encourage everyone to look at the gap between accessibility checkers or checks and support accessible use. That comes down to evaluation design. Because a lot of AI right now is, essentially, all the benchmarks that I’ve been seeing is always so automated. And a lot of these automated checks might say something is accessible. For example, alt text is a great way to think about it, where the automated checker might look at alt text and be like, oh, well, yeah, this image has alt text, so it passes on automated checker. But if alt text isn’t meaningful, then what’s the point of having alt text to begin with? And so yeah, just seeing what are we even evaluating. What’s missing? What are we really incentivizing AI to look at? And because if our metrics are shallow, then the models that it’s trained on might just learn accessibility that’s shallow as well.

**Aaron:** Dylan, would you like to take us home?

**Dylan Barrell:** Yeah, I think you probably could guess what I’m going to focus on.

You know, Ed said something very important, I think, which we need to take into account when thinking about what to recommend to people: If there’s one accessibility person in the organization, what do you do in a world where AI is becoming more and more the way we do things? AI is speeding everything up. It’s shifting constraints. We’re struggling as organizations on how to deal with those constraints. What can a single person do or a small number of people do?

They can find the leverage, the high leverage points and try to insert themselves there.

So when I talked about context engineering, harness engineering, those are the points that they can look to insert themselves in to get the most leverage, right? Don’t spend your time evaluating alt text of images. Don’t spend your time doing manual audits or whatever. Try to spend your time figuring out how to make that process, that AI-driven process, accessible so that you can elevate yourself into the position where you can do things that are more valuable. Because the stuff at the end or the beginning in terms of user research is where accessibility experts should be spending their time. But if they’re constantly spending their time evaluating alt text and doing accessibility audits manually, then they never get the time to do that.

And AI, for me, AI leveraged in the right way is a huge opportunity for them to get out of the job of dealing with that really grunt work and doing the stuff that really matters. And there’s two things that matter. It’s the stuff at the front and the back end, the discussion and the user research. And it’s making the process produce accessible stuff by default.

**Aaron:** Awesome. What a great note to end on.

I want to thank our panel very much for their insights today, for sharing their time with us.

And to the audience, I want to thank all of you for having us. If you don’t mind taking a moment and sharing your feedback on the session, we would absolutely appreciate that as well.

## Thank You

My thanks again to Yumeng Ma, Dylan Barrell, Navin Thadani, and Ed Summers for a thoughtful conversation and for sharing so much practical insight from their respective corners of the accessibility and AI ecosystem.

## Resources Shared During the Panel

- [GitHub Accessibility Scanner](https://github.com/github/accessibility-scanner)
- [Building a general-purpose accessibility agent-and what we learned in the process](https://github.blog/ai-and-ml/github-copilot/building-a-general-purpose-accessibility-agent-and-what-we-learned-in-the-process/)
- [AIMAC: The AI Model Accessibility Checker](https://aimac.ai/)
- [Prompt Accessibility Controlled Evaluation (PACE)](https://github.com/momentine/pace)
- [A11y LLM Eval](https://microsoft.github.io/a11y-llm-eval-report/)