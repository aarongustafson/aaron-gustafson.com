---
title: "Opportunities for AI in Accessibility"
date: 2023-06-09 14:57:16 -07:00
comments: true
tags: ["accessibility", "AI/ML", "inclusive design", "the future"]
description: "I want to take a little time to talk about the potential of AI to aid in accessibility, in hopes we’ll get there one day."
twitter_text: "A rumination on #AI and #accessibility"
in_reply_to: https://www.joedolson.com/2023/06/accessibility-and-artificial-intelligence/
hero:
  src: /i/posts/2023-06-09/hero.jpg
  credit: "Aaron Gustafson × DALL·E"
  alt: "A child’s drawing of a cute red robot whose hands are hammers. The robot is centered."
  url: https://labs.openai.com/s/FxVDwMouozWRdhBp7OVP8nY0
  offset: "50"
thanks:
  "Kartik Sawhney": "https://twitter.com/kartiks22"
---

In reading through [Joe Dolson’s recent piece on the intersection of AI and accessibility](https://www.joedolson.com/2023/06/accessibility-and-artificial-intelligence/), I absolutely appreciated the skepticism he has for AI in general as well as the ways in which many have been using it. In fact, I am very skeptical of AI myself, despite my role at Microsoft being that of an Accessibility Innovation Strategist helping run the AI for Accessibility grant program. As with any tool, AI can be used in very constructive, inclusive, and accessible ways _and_ it can used in destructive, exclusive, and harmful ones. And there are a ton of uses somewhere in the mediocre middle as well.

I’d like you to consider this a “yes… and” piece to compliment Joe’s post. I don’t seek to refute any of what he’s saying, but rather provide some visibility to projects and opportunities where AI can make a meaningful difference for people with disabilities (PwD) across the globe. To be clear, I am not saying there aren’t real risks and pressing issues with AI that need to be addressed—there are, and we needed to address them like yesterday—but I want to take a little time to talk about what’s possible, in hopes we’ll get there one day.

<!-- more -->

## Alternative text

Joe’s piece spends a lot of time talking about computer vision models generating alternative text. He highlights a ton of valid issues with the current state of things. And while computer vision models continue to improve in terms of the quality and richness of detail in their descriptions, the results are not great. As he rightly points out, the current state of image analysis is pretty poor—especially for certain image types—and the current systems examine images in isolation rather than within the context in which they sit (a consequence of having separate foundation models for text analysis and image analysis). 

These models are also not currently trained to distinguish an image that is contextually relevant (for which there should probably be a description) from one that is purely decorative. Of course this is something we humans struggle with as well… the right answer is often somewhere between the author’s intent and the user’s needs/preferences.

All of that said, there is potential in this space.

As Joe mentions, human-in-the-loop authoring of `alt` text should absolutely be a thing. And if AI can pop in to offer a starting point—even if that starting point is prompting you to say *What is this B.S.? That’s not right at all… let me fix it*—I think that’s a win.

Taking things a step further, if we can specifically train a model to analyze image usage in context, it could help us more quickly identify which ones are likely to be presentational and which ones likely require a description. That will help reinforce the importance of descriptions in the appropriate context _and_ improve the efficiency with which authors can make their pages more accessible.

While complex images—graphs, charts, etc.—are challenging to describe in any sort of succinct way (even for humans), [the image example shared in the GPT4 announcement](https://openai.com/research/gpt-4#:~:text=Visual%20inputs:%20VGA%20charger) points to an interesting opportunity here as well. Let’s say the description of a chart was simply the title of the chart and the kind of visualization it was. For example: _Pie chart comparing smartphone usage to feature phone usage among U.S. households making under $30,000 a year._ If the browser knows it’s a pie chart (because an onboard model verified this), imagine a world where a user could ask questions about the graphic. 

* _Do more people use smartphones or feature phones?_
* _How many more?_
* _Is there a group of people that don’t fall into either of these buckets?_
* _How many is that?_

Setting aside the realities of [Large Language Model (LLM) hallucinations](https://machinelearningmastery.com/a-gentle-introduction-to-hallucinations-in-large-language-models/) for a moment, the opportunity to interface with image data in this way could be revolutionary for blind and low-vision folks as well as people with various forms of color blindness, cognitive disabilities, and so on. It could also be useful in an educational context to teach people who _can_ see the chart, as authored, to read a pie chart.

Taking things a step further, what if you could ask your browser to simplify a complex chart, perhaps isolating a single line on a line graph? What if you could ask the browser to transpose the colors of the different lines to work better for the specific form of color blindness you have? What if you could swap colors for patterns? Given the chat-based interface and our ability to manipulate existing images in currently available AI tools, that certainly seems like a possible future.

Now imagine a purpose-built model that could extract the information from that chart and convert it to another format. For example, it could turn that pie chart (or better yet, a series of them) into a more accessible (and useful) format like a spreadsheet. That would be amazing!

## Matching Algorithms

Safiya Umoja Noble absolutely hit the nail on the head with the title of her book [_Algorithms of Oppression_](http://algorithmsofoppression.com/). While it was focused on search engines reinforcing racism, all computer models have the potential to amplify conflict, bias, and intolerance. Whether it’s Twitter always showing you the latest tweet from a bored billionaire, YouTube sending us into a Q-hole, or Instagram warping our idea of what a natural body looks like, we know poorly authored and maintained algorithms are incredibly harmful. A lot of this stems from a lack of diversity among the people who shape and/or build them. When built inclusively, however, there is real potential for algorithm development to benefit people with disabilities.

Take [Mentra](https://www.mentra.com/), for example. They are an employment network for neurodivergent people. They employ an algorithm to match job seekers with potential employers, based on over 75 different data points. On the job seeker side of things, it takes into account the candidate’s strengths, necessary workplace accommodations (and preferred ones), environmental sensitivities, and so on. On the employer side, it takes into account the work environment, communication factors related to the job, and the like. As a company run by neurodivergent folks, Mentra made the decision to flip the script when it comes to typical employment sites. They use their algorithm to propose available candidates to the companies, who can then connect with job seekers they are interested in; reducing the emotional and physical labor on the job seeker side of things.

When more people with disabilities are involved in the creation of algorithms, there is a lessened likelihood that these algorithms will be used to inflict harm on their communities. This is why diverse teams are so important.

Imagine if a social media company’s recommendation engine was tuned to analyze who you’re currently following and prioritized recommending that you follow people who talked about similar things, but who were different in some key way from your existing sphere of influence. For example, if you follow a bunch of non-disabled white male academics who talk about AI, it could suggest you follow academics who are disabled or aren’t white or aren’t male who also talk about AI. If you took its recommendations, you’d likely get a much more holistic and nuanced understanding of what is happening in the AI field.

## Other Ways AI Helps PwD

If I weren’t trying to put this together between other tasks, I’m sure I could go on, <i lang="la">ad infinitum</i>, providing all kinds of examples of how AI can be used to the benefit of people with disabilities, but I’m going to make this last section into a bit of a lightning round. In no particular order:

* **Voice preservation.** You may have seen [the VALL-E paper](https://arxiv.org/abs/2301.02111) or [Apple’s GAAD announcement](https://www.apple.com/newsroom/2023/05/apple-previews-live-speech-personal-voice-and-more-new-accessibility-features/) or you may be familiar with offerings from [Microsoft](https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/custom-neural-voice), [Acapela](https://www.acapela-group.com/voices/voice-banking/), and others. It is possible to train an AI model to replicate your voice, which is tremendous for people who have ALS/MDN and other medical conditions that lead to dysarthria. This is, of course, the same tech that can be used to create audio deepfakes, so it’s something we need to approach *[responsibly](https://www.microsoft.com/en-us/ai/responsible-ai)*, but the tech has truly transformative potential.
* **Voice recognition.** Researchers like those in the [Speech Accessibility Project](https://speechaccessibilityproject.beckman.illinois.edu/) are paying people with disabilities for their assistance in collecting recordings of people with atypical speech. As I type, they are actively recruiting people with Parkinson’s and related conditions and they have plans to expand this to other etiologies as the project progresses. This research will result in more inclusive data sets that will enable more people with disabilities to use voice assistants, dictation software, and voice response services as well as control their computers and other devices more easily, using only their voice.
* **Text transformation.** The current generation of LLMs is quite capable of making adjustments to existing text content without injecting hallucinations. This is hugely empowering for people with cognitive disabilities who may benefit from a text summary or the text being simplified or even from it being prepped for [bionic reading](https://bionic-reading.com/).

## The Importance of Diverse Teams and Data

Of course to do things like this, we need to recognize that differences do matter. Our lived experiences are influenced by the intersections of identity in which we exist. Those lived experiences—with all of their complexity (and joy and pain)—are valuable inputs to the software, services, and societies we shape. They need to be represented in the data we use to train new models and the folks who contribute that valuable information need to be compensated for sharing it with us. Inclusive data sets yield more robust models that enable more equitable outcomes.

Want a model that doesn’t demean or patronize or objectify people with disabilities? Make sure content about disability, authored by people with a range of disabilities is well-represented in the training data.

Want a model that doesn’t use ableist language? Use [existing data sets](https://www.selfdefined.app/) to build a filter that can intercept and remediate ableist language before it reaches an end user.

Want a coding co-pilot that gives you accessible recommendations from the jump? Train it on code that is known to be accessible.

<hr>

I have no doubt that AI can and will harm people… today, tomorrow, and well into the future. However, I also believe that we can acknowledge that and, with an eye towards accessibility (and, more broadly, inclusion), make thoughtful, considerate, intentional changes in our approaches to AI that will reduce harm over time as well. Today, tomorrow, and well into the future.
