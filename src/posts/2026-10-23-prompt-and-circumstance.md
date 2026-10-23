---
title: "Prompt and Circumstance"
date: 2026-10-23 19:58:58 +00:00
comments: true
tags: [accessibility, "AI/ML", HTML, forms]
description: "I co-authored a paper evaluating accessibility in AI-generated HTML form components, looking at how prompts, models, components, and evaluation methods affect the results."
meta_description: "Our ASSETS ’26 paper examines accessibility across 26,100 AI-generated HTML form components using PACE, a controlled evaluation testbed."
social_description: "What makes AI-generated forms accessible? Our ASSETS ’26 paper examines how prompts, models, components, and evaluation methods affect the answer."
twitter_text: "I co-authored an ASSETS ’26 paper on accessibility in AI-generated HTML form components. We looked at 26,100 outputs—and why how we evaluate them matters."
image: "/i/share-cards/prompt-and-circumstance.jpg"
atUri: "at://did:plc:6rmgrvblxflqh34omwywu6ib/site.standard.document/3mykxt7c23q2w"
---

Back at [Ability Summit, I moderated a conversation about shifting accessibility left in the age of AI](/notebook/fixing-accessibility-after-the-fact-is-too-late/). During that discussion, Yumeng Ma described a problem she’d encountered in her research: there wasn’t a magical prompt that made generated code accessible. The component mattered. The model mattered. And what we chose to measure mattered too.

That research is the subject of a paper I co-authored with Yumeng Ma, Jacob O. Wobbrock, Joe Devon, Michael Fairchild, Jennifer Mankoff, and Venkatesh Potluri: [“Prompt and Circumstance: Evaluating Accessibility in LLM-Generated HTML Form Components”](https://dl.acm.org/doi/10.1145/3797867.3828975), for ASSETS ’26, the ACM SIGACCESS Conference on Computers and Accessibility.

<!-- more -->

## Looking at the components

If you ask an AI tool to generate an entire page and then evaluate its accessibility, you can learn something about that page. Working out *why* it turned out that way is harder. Was it the model? The instructions? A particular component it included?

To help separate those factors, we introduced PACE—Prompt Accessibility Controlled Evaluation—a testbed focused on HTML form components. The study covers:

- 58 form components;
- five large language models;
- three system prompts with increasing accessibility guidance;
- three request variants with increasing detail about each component; and
- 10 trials per configuration.

That adds up to 26,100 outputs. The repeated trials matter: one promising response doesn’t tell us how consistently a model will produce something useful.

As [the research summary explains](https://make4all.org/portfolio/accessibility-of-llm-generated-form-components/), accessibility varied with prompt construction and the surrounding circumstances, including the model, form component, and measure used to assess the output. That makes a broad claim like “this model generates accessible code” difficult to interpret without knowing how someone arrived at it.

## What are we measuring?

One of the points Yumeng raised during our Ability Summit conversation has stuck with me: an automated check can establish that an image has alternative text without establishing that the text is meaningful. Both questions matter, but they aren’t the same question.

Forms give us plenty of reasons to make that distinction too. Can someone identify what a field is asking for? Can they reach and operate a control with their keyboard? If they make a mistake, can they find the error and work out how to fix it? Those are practical questions I want us to keep asking when we evaluate generated interfaces, alongside whatever automated checks we run.

For me, the useful direction here is more specific evaluation. If we want to improve the code these tools generate, we need to understand where it falls short and which changes actually help. Otherwise, we risk treating a better score as an answer to a question the test didn’t ask.

You can [read the paper on ACM](https://dl.acm.org/doi/10.1145/3797867.3828975), find an [author-hosted PDF](https://make4all.org/wp-content/uploads/prompt_and_circumstance-2.pdf), or explore [PACE](https://a11yhood.org/product/pace). My thanks to my co-authors for the work that went into this. I’m looking forward to seeing how others use and build on it.
