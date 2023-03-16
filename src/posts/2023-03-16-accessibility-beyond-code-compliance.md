---
title: "Accessibility Beyond Code Compliance"
date: 2023-03-16 10:50:39 -07:00
comments: true
tags: ["presentations", "accessibility", "AI/ML", "inclusion", "industry"]
description: "This is a (rough) transcript of my talk for axe-con 2023. In it, I provide examples of other areas of our industry that can benefit from developers’ accessibility skills and knowledge."
twitter_text: "I cobbled together a rough transcript of my #AxeCon talk."
hero:
  src: /i/posts/2023-03-16/hero.png
  credit: "Aaron Gustafson"
  alt: ""
---

*I had the great pleasure of delivering a talk about career opportunities for accessibility devs at [axe-con](https://www.deque.com/axe-con) earlier today. You can [view the slides](https://presentations.aaron-gustafson.com/SE8HHb/accessibility-beyond-code-compliance) or [watch the recording](https://www.deque.com/axe-con/sessions/accessibility-beyond-code-compliance/) of this talk, but what follows is an approximation my talk’s content, taken from my notes and slides.*

<!-- more -->

Good morning, good afternoon, and good evening to you, wherever you are in the world. My name is Aaron Gustafson. My pronouns he, him, and his. I am a middle-aged white man with long, wavy hair, glasses, and a red and grey beard my wife refers to as “salt & paprika.” I am speaking to you from Seattle, WA on the unceded lands of the Coast Salish peoples, most notably the Duwamish, whose longhouse is not too far from my home.

Some of you may be familiar with my work. I’ve been a web designer and developer since the mid ’90s. In that time I’ve [authored dozens of articles and a few books](/publications/) and [given over a hundred talks on web development](/speaking-engagements/). In fact, if my math is correct, I believe this is my 150th talk.

Over the years I’ve been best known for my work in [progressive enhancement](/tags/progressive-enhancement/) and [accessibility](/tags/accessibility/), but I also led the [Web Standards Project](https://webstandards.org) back in the day and am the Editor in Chief of [<cite>A List Apart</cite>](https://alistapart.com).

I have deep roots in the web dev community, particularly in the accessibility space, but that’s not why I’m here today. I’m here today because about 9 months ago I decided to change things up and use my accessibility skills in other ways.

In my case, I joined the Microsoft Accessibility Innovation team to lead our investments through the [AI for Accessibility grant program](https://www.microsoft.com/en-us/ai/ai-for-accessibility).
But I’m not here to talk about AI, I’m here to talk about how _you_ can put your accessibility skills to work, beyond finding and remediating accessibility bugs.

## Cruel irony: accessibility devs face barriers too

In my career, I’ve found it’s really easy to get typecast or pigeon-holed when you’re a developer whose focus is accessibility. This is a bit of a cruel irony as many of us are driven by a desire to tear down the barriers to access for others.

Our companies, organizations, and sometimes even our colleagues put us in a box. They don’t seem to realize that knowledge of how to make products accessible has huge value beyond compliance (and avoiding lawsuits). In our careers, we might be able to level up from a junior to senior role or even make it to principal, based on our performance, but growth beyond that is often limited to moving into people management, which is a wholly different skill set. And maybe that’s your aspiration… that’s totally cool if it is, but what if you want to grow as an independent contributor?

When our organizations put us in a box, they make it really difficult to grow our scope and increase the impact we can have for both the organization and the people we serve.

Don’t get me wrong, I love compliance work. I’m not here to disparage it in any way; it’s critically important and means so much to our customers. But after years in this industry, I also see the downsides of life in the “accessibility dev” box. Perhaps you relate to a few of these:

* Colleagues don’t understand (or value) what I do.
* I need like three (or more) of me to handle the workload.
* Teams are resistant to changing the way they do things.
* Progress feels glacially slow and some days I feel I’m going backwards.
* I feel isolated on the team or the company

Again, I am not trying to cast code compliance work in a bad light, and I’m not trying to get you down on it. What I want to do is build you up.

## You’ve got so much more to offer

I believe you, as a developer interested in accessibility, have so much to offer your organizations, your customers, and this industry. That’s what I am here to talk to you about today. 

I’m here to talk to you about opportunity!

When I was doing this work on the regular, I struggled to see how I could grow my impact. In the intervening years, however, I’ve discovered a bunch of ways we can bring our knowledge and passion for accessibility to other areas of both web development and the tech industry overall.

As I mentioned, I’ve been in this industry and held a lot of different roles since the mid ’90s. I’ve held just about every web-related role you could name. I’ve been an educator, publisher, spec editor at the W3C. I’ve worked in Developer Relations and strategic roles. I’ve worn an awful lot of hats (which is totally fine with me as my hair is thinning in the back).

All of this is to say that I’ve seen and experienced a lot of ways you can be valuable to your current employer or, perhaps, a future one.
I am going to share 5 of them with you today:

1. Design Systems
2. Product Design
3. Data Science
4. AI Research & Ethics
5. Diversity & Inclusion

These are by no means your only options and, as I mentioned, if you’re happy with what you’re doing, please don’t consider this talk a nudge to get you to change things up. I just want to make you aware of the value you can bring to other kinds of roles, some of which you may not have considered before.

Also: I want to make it clear that I am not advocating that you take on any of these responsibilities in addition to your current work. Far too often, organizations ask those of us with accessibility skills to do things beyond our job description without any additional compensation for that work. Please don’t fall into that trap as it will lead to burnout.

## Codify coding best practices (Design Systems & Strategies)

If you’re really interested in software development, an area that keeps you in that area is working on design systems.

I’m not going to go deep on design systems—there are a bunch of talks and [even whole conferences](https://clarityconf.com) focused on that topic—but I will give you the Cliffs Notes if you’re unfamiliar: Design systems (and pattern libraries within them) codify your organization’s design and coding guidelines in such a way that the software you produce is consistent and the teams working on delivering that software are able to be more efficient because they aren’t having to design and build every interface from scratch.
Having a design system that is accessible enables teams to avoid introducing new accessibility bugs in the process of creating bespoke interfaces. It also means finding and fixing an accessibility bug in the design system should fix it in all of the products using that design system. (That last part isn’t always perfect, but I don’t have time to get into that today.)

If you work in a small organization, it’s possible that you aren’t working with a design system yet. Knowing what you do about their accessibility benefits, you could advocate for the creation of one and for its creating, care & maintenance to be your job.

In this role, you can:

* Work directly with other engineers to create system components.
* Audit the system regularly for compliance issues (paying special attention to how combinations of components can create issues).
* Provide in-house accessibility training to the design & engineering folks to help them level-up their own skills.
* Provide design system training and implementation guidance to the folks implementing the design system and new hires as they come in.
* Celebrate the successes of teams using the design system, particularly when it comes to their accessibility wins; you could do this in-person, in online meetings, or via email depending on the size and distribution of your team.

If you’re in a larger organization that already has a design system, you could be a bit more strategic in your approach:

* Being the accessibility advocate within the design system as well as in the context of all software development practices within your organization.
* Be the conduit to your organization’s senior management as well as individual product owners to ensure accessibility is top of mind for them and baked into their roadmaps. Part of that is also advocating for the necessary funding to achieve your accessibility goals (and alleviating the issue we often face on not being appropriately-resourced).
* Provide guidance and create structure within your organization to ensure your accessibility goals are met.
* Educate and mentor folks from across your organization on accessibility.
* And again, celebrate the heck out of any and all accessibility wins, no matter how small. We’ve already discussed some of the challenges we face ad accessibility devs, and getting publicly recognized for our accomplishments can really boost morale.

As an accessibility dev, your unique perspective and skills will help build greater alignment on accessibility among teams and improve morale by speeding up development & reducing bugs!

## Shape what you build (Product Design)

As I mentioned, the role in larger orgs can be more strategic. Another strategic role is shaping the products that we build, as a product designer, product owner, product manager, or similar. (Different companies have different titles for this kind of work.)

In this kind of a role, we can put the “shift left” credo we advocate for regularly into practice. It involves

* Embedding yourself with feature teams to understand what motivates them. Understanding their vision in goals will help you frame your recommendations in a way that they will be welcomed and embraced. Being embedded with a team also means you can discover potential hazards early and eliminate them; you can educate them as to the issue and how to avoid it which makes it less likely they will run into it again.
* Asking questions and offering to up-skill the team, helping them learn to build products that will reach and be usable by more customers.
* Making sure people with disabilities are included (and paid for their contributions) in all research, co-creation, and testing so the team has a better understanding of their needs.

All of this work has huge business value for your organization:

1. It saves your engineering and quality assurance teams a ton of time, and time is money.
2. You reduce the legal risk to your company for lack of compliance, which also saves money in legal fees (not to mention settlements).
3. You will build products that work better for more people, leading to better overall customer satisfaction and reduced churn.
4. You’ll also create new revenue opportunities by increasing the number of folks you can serve.

On that last point, I often point to WhatsApp as a perfect example of this. When they launched, there were nearly 8,000 chat apps in the iOS App Store. If they’d only offered their app to that audience, they would not have found the level of success they did because the competition was so high. They expanded their potential customer base by supporting OSes others were ignoring: older Android versions, Blackberry, Symbian, Nokia Series 40, Windows Phone. Some of those weren’t even smartphone OSes! When WhatsApp sold to Facebook for $19B, they had over 600M users worldwide because they made their product accessible—in a broader sense—to more people.

By considering accessibility in the same way as WhatsApp considered OS support, we can grow—or to think about it another way, stop artificially suppressing—our customer base and succeed where our competition fails.

As an accessibility dev, your unique perspective and skills will ensure your company ships higher quality products, with fewer bugs, for less money!

## Measure the right things (Data Science)

Moving a bit further afield, I want to talk about how much we need your skills in the world of data science. As part of a data science team, you could bring attention to accessibility in our product metrics by

* Ensuring key business metrics include data from people with disabilities.
* Adding new product metrics that reflect the experience of different disability communities.
* Measuring the time necessary to complete key tasks when using different AT and track improvements & regressions for them over time.

Apart from products, you could also have a profound impact on your organizations’ internal processes, especially around how compliance work is done and tracked:

* Capture automated testing passes and track compliance over time.
* Highlight accessibility bug activity
    * How many new?
    * How many remediated?
    * How many outstanding?
    * How many marked “won’t fix”?
    * Average age of outstanding bugs
* Include this data in top-level product reports

And if you wanted to keep working in the UI space, you could put your skills to work improving the quality of the dashboards and tools used by your company:

* Ensure all analysis tools are accessible.
* Ensure charts are accessible.
* Provide access to raw data tables.
* Enable API access to data to enable colleagues to create additional tooling that works better for them.

This is incredibly necessary work as we often neglect the accessibility of our own internal tools.

As an accessibility dev, your unique perspective and skills can help your company make decisions that result in more inclusive and accessible products that provide a better user experience (and may even increase revenue).

## Protect us from ”the machines” (AI Research & Ethics)

The fourth area desperately in need of your skills and perspective is AI research and ethics. AI is a hot topic right now, for sure, and it absolutely has the potential to meaningfully improve people’s lives, including those of people with disabilities, but to get there, organizations need your help!

You have the knowledge and connections in this space to harness the power of AI in service of people with disabilities.

As part of an AI research team you can…

 * Observe how people with disabilities interact with the world today and consider how AI can
     * increase their independence;
     * make certain actions easier, more intuitive, or efficient; and
     * increase the richness of experiences for them.
 * Co-design with folks from a range of disability communities; but remember not to assume everyone from a given community wants the same thing.

This is the space I’m very grateful to be in right now. As part of the Accessibility Innovation team at Microsoft, I get to identify and fund projects that are using AI to improve the lives of people with disabilities.

For example: the ORBIT project. There’s been lots of work in the object detection space, but there is a lot of focus on labelling "high-quality" images. This doesn’t really help folks in the real world. A blind person, for instance, is likely to have a hard time providing the image recognizer a with a perfectly-framed, perfectly focused capture of an object they need identified.

The Orbit project, from the City University of London, worked to enable “few-shot learning” of novel objects by training the model on brief videos taken by blind & low vision collectors. These videos are “imperfect” in that they are likely to be poorly framed, blurry, and so on.
This increases the noise-to-signal ratio, which is actually a good thing in training a machine learning model. Enabling AI systems to recognize objects captured in imprecise ways makes for a more robust recognizer that is capable of identifying objects in less than ideal contexts.
That, in turn, improves the overall quality of these systems for everyone.

Another example is Mentra, who has been using AI to help pair neurodivergent folks with employers who recognize the profound contributions they can make in their companies. Mentra’s platform collects holistic data on job seekers:

* cognitive strengths,
* aptitudes,
* environmental sensitivities,
* and necessary accommodations.

It takes these into account when matching individuals to available positions (which also include comparable information).

Mentra takes care not to “screen out” individuals with non-traditional backgrounds. It also works in a “reverse job fair” model, where applicants only fill in one profile, letting Mentra’s AI recommend them for jobs that are a good fit. Employers indicate their interest and invite job seekers to interview, lessening the stress level on the job seeker.

Mentra’s straightforward approach also reduces the need for job seekers to "cover" in a new role as they’ve made it clear what accommodations they need in order to be successful.

The third project I’ll share with you is iWill, who are working in the mental health space.

There are tons of cognitive behavioral therapy (CBT) chatbots out there, but we were really intrigued by work being undertaken by iWill in India. First of all, there is a profound scarcity of mental health professionals in India. Training and deploying enough professionals to meet the mental health needs of the population is not feasible in the near term, which is why chat bots are a compelling stop-gap.

Most CBT chatbots are trained in English. We are funding them to train a CBT model end-to-end in Hindi as we believe it’s the only way to avoid potential problems inherent in translation (Hindi to English for the ML then back again) and biases that would be inherent from the involvement of English.

I could spend hours talking about all of the good AI can do in the world, but I also recognize that AI can also perpetuate or exacerbate exclusion.

AI teams need your skills to help them address bias toward and exclusion of people with disabilities. They also need you to be there protecting the privacy of people with disabilities.

You would bring a lot to an AI team in this regard:

* Identify bias (or potential bias) in datasets.
* Promote representation of people with disabilities in datasets.
* Ensure people with disabilities are not exploited by datasets.
* Ensure all interfaces to the AI tools are accessible.
* Ensure the products created by AI are accessible.
* Validate that the products of AI are not directly biased or exclusionary and they they cannot be used to perpetuate bias or exclusion.

As an accessibility dev, your unique perspective and skills can help can ensure advancements in AI/ML are beneficial (and not harmful) to people with disabilities!

## Build & grow inclusive teams (Diversity & Inclusion)

The last role I’ll talk about is probably the furthest afield from development, but it also has the most profound impact on the teams that do the work and that’s D&I. I don’t imagine I need to spend a ton of time making a case to this audience for why diversity matters, but here’s a quick run-down just in case:

* Diverse teams bring with them diverse perspectives & lived experiences.
* If valued, that knowledge can make it easier to identify potential barriers (and opportunities) earlier in a project.
* Diverse teams are more likely to exhibit empathy toward all users, including those with disabilities.
* Diverse teams are more innovative.
* Diverse teams make better decisions

For more on those last two points, you should [read this piece in the Harvard Business Review](https://hbr.org/2016/11/why-diverse-teams-are-smarter).

As someone who is keenly aware of the importance of having diverse teams to build inclusive products, you can do a lot to ensure your organization embraces diversity in its recruiting efforts. Fixing leaks in "the pipeline," if you will.

A lot of it starts with asking important questions:

* Do we have a disability hiring policy?
* Are our recruiters “screening in” people with disabilities?
* Where are we posting jobs? Are they
reaching people with disabilities?
* Is the language of our job postings exclusionary?
* Is our interview process inclusive and accommodating of people’s disabilities?

It’s also important to actively solicit disabled talent for roles in your company. 

Some of this is actually work you could do without being part of any official D&I team, if you wanted, but if it is something you want to focus on, you might consider a job in recruiting.

A lot of folks focus on the pipeline, but in my experience that’s not where the bulk of the problems lie. If we want diverse teams, we need to ensure we have an environment and culture that values and supports them. Diverse talent will flee an unwelcoming environment and employee churn is expensive.

In order to retain diverse talent, we need to make sure the teams they join recognize the value they bring to an organization. This is where D&I training and coaching comes in.

You can influence team culture to improve retention by framing diversity in the context of your business goals and organizational success:

* Lack of diversity creates knowledge gaps.
* Diverse hiring helps to fill those gaps.
* Diverse colleagues’ knowledge & lived
experiences have value.

Once the framing has been established, be sure to “call in” non-inclusive/biased behaviors. Leading with curiosity can help you understand where someone is coming from so you can help them grapple with concepts like privilege and bias. Don’t burn yourself out trying to change the mind of folks who are openly antagonistic to this message, but you’ll often be surprised at how a non-confrontational, nonjudgmental conversation can both diffuse a tense situation and help to shift someone’s perspectives.

Another step you can take to improve retention include examining the inclusiveness (or lack thereof) of your team’s processes, built environments, and such. Are your hybrid meetings being monopolized by folks in the physical meeting space, alienating people on the call? Are your team morale events all scheduled in the evenings, making it hard for parents or caregivers on the team? Are they being held in bars, which makes it uncomfortable for folks who don’t drink alcohol, or in inaccessible venues?

Finally, it can be really beneficial to normalize disability in everyday interactions, especially if you are someone with privilege in your workplace as you can create space for others to acknowledge their own disabilities.

I was thankful that my last role enabled me to make this kind of D&I work a formal third of my core responsibilities. With my management’s backing, I was able to lead D&I trainings and events across the company while still being able to do the other work I love.

Many companies have formal D&I teams (some in HR, some not) for whom this is their whole job, so there are certainly opportunities there. That said, those teams often rely on advocacy from elsewhere in the company for their efforts to be successful, so you might also be able to formally support their efforts from outside that organization, as I did.

<hr>

> If there is no room for diverse talent to grow in their careers, many will leave

As I mentioned, churn is expensive. And just as not feeling respected & valued will likely result in a diverse employee leaving, the same goes for not having the same career advancement opportunities enjoyed by people from more privileged groups. Depending on where you are in your organization, you can help address this problem in different ways:

1. Write recommendations for colleagues, prioritizing them for colleagues whose diversity needs to be seen as an asset.
2. Observe promotions and ask questions of management if you don’t see diverse representation.
3. Mentor and reverse-mentor colleagues with a goal of growing the careers of people with disabilities.

This work is especially important to undertake if you are from a privileged group in your organization as your advocacy carries more weight. Treat your privilege as a currency and spend it on your colleagues.

Finally, and in perhaps the most formal way, working full-time in D&I you can shape company policies & trainings:

* Suggest edits to existing company policies.
* Draft new policies.
* Suggest freely-available accessibility and D&I trainings to colleagues.
* Create (or co-create) workshops & trainings for your company or team.
* Push for your company to mandate accessibility and D&I training; be sure to include additional training specifically for people managers as they have more to consider in this regard.
* Advocate for diverse representation and the modeling of inclusive behavior in all in-house trainings.

As an accessibility dev, your unique perspective and skills can help increase the inclusiveness of your company for fellow employees, which will lead to the creation of more inclusive products and services!

## These are just five areas that need you

In this talk, I introduced five areas desperately in need of your skills and perspectives: Design Systems, Product Design, Data Science, AI Research & Ethics, and Diversity & Inclusion. 

There are way more (I only have so much time).

If you’re feeling stuck, hopefully this gives you some idea of the kinds of opportunities that are out there for you. And if you only come away from this session with one thing, let it be this:

**You are more valuable than you realize.**

**You are change maker.**

Thank you!