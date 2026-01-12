---
title: "Identifying Accessibility Data Gaps in CodeGen Models"
date: 2025-10-16 12:12:02 -07:00
comments: true
tags: ["accessibility", "AI/ML", "HTML"]
description: "I probed an LLM’s responses to HTML code generation prompts to assess its adherence to accessibility best practices. The results showed key areas where better training data is needed."
twitter_text: "I probed an LLM’s responses to HTML code generation prompts to assess its adherence to accessibility best practices. The results showed key areas where better training data is needed."
hero:
  src: /i/posts/2025-10-15/hero.png
  credit: "Aaron Gustafson × Designer"
  alt: "A pop-art style illustration of a wide chasm. On the left side of the chasm stands a small, cute, red robot, gazing to the right, across the abyss. On the right side of the chasm is his destination: a finish line flag. The flag reads “Accessible.”"
  offset: ""
---

Late last year, I probed an LLM’s responses to HTML code generation prompts to assess its adherence to accessibility best practices. The results were unsurprisingly disappointing — roughly what I’d expect from a developer aware of accessibility but unsure how to implement it. The study highlighted key areas where training data needs improvement.

<!-- more -->

## Why take on this challenge?

I get it — you probably rolled your eyes at yet another “AI and accessibility” post. Maybe you think AI-assisted coding is overhyped, environmentally harmful, unreliable, or just plain dangerous for our craft. I share many of those concerns. But here’s the thing: whether we like it or not, codegen models aren’t going anywhere. GitHub Copilot has millions of users, and tools like Claude Code and Cursor are rapidly gaining popularity.

So we have a choice: we can complain about the inevitable tide of AI-generated garbage code, or we can get in there and figure out how to make it better — especially when it comes to accessibility.

We’re facing a looming wave of inaccessible code that will be extremely difficult to remediate later. The foundation models are already being trained on the collective output of the web’s development community — a community that doesn’t have a high bar high for accessibility already. Codegen models are a massive consultancy staffed with [full StackOverflow developers](https://christianheilmann.com/2015/07/17/the-full-stackoverflow-developer/). We need to figure out how to make them part of the solution, not part of the problem.

It’s also worth noting that the better we make the output of these models, the fewer bugs will be generated. That, in turn, means fewer accessibility issues to fix later. If we don’t, there are plenty of AI-assisted scanners out there happy to burn the rainforest to find and remediate the bugs after the fact. We risk doubling the environmental impact—once to generate the bug, and again to fix it. That’s not the future I want. The reality here is that the only way to deal with this flood of AI-generated code is to make sure it’s good code in the first place.

## How did I conduct my research?

Rather than relying on anecdotal evidence or cherry-picked examples, I built a systematic approach to evaluate how well LLMs — starting with GPT-4 — generate accessible HTML. The methodology is straightforward but comprehensive: I created a Python testing framework that sent carefully crafted prompts to Azure OpenAI’s GPT 4 model, collected the generated HTML responses, and then manually analyzed these responses for accessibility compliance.

Here’s how it works:

**Prompt Engineering**: I designed prompts that ask for specific UI components—form fields, navigation menus, interactive elements—without explicitly mentioning accessibility requirements. This gives us a baseline of what the model considers “standard” output. I included one prompt that specifically requested accessibility features to see if the model could improve when guided. I suspected it would often add ARIA attributes without addressing underlying issues, but I wanted to validate that too.

**Response Collection**: For each prompt, I generated 10 iterations at high temperature (0.95) to capture the model's range of responses. Each unique response got saved as an individual HTML file for analysis.

**Systematic Analysis**: I manually review each generated code snippet, cataloging accessibility errors, warnings, and missed opportunities. I tried using the LLM as a judge, but even with a detailed rubric, the results were poor. My eval looked specifically for things like:

- Improper semantic HTML usage
- Missing or incorrect ARIA attributes
- Keyboard navigation issues
- Screen reader compatibility problems
- Form labeling errors

When I identified errors, I remediated them and committed the remediated file to the repo with a commit message that included all of the issues and warnings on its own line.

**Diff-Based Retesting**: I wanted to see if diff data could improve future codegen requests, so I created a tool to generate a collection of `.diff` files for each pattern that included the commit message as a header in each file. I then used those diff files as part of a new instance of the prompt to test whether the model can improve its output when guided.

## What did I learn?

After analyzing hundreds of generated code snippets, the results are sobering. The model consistently demonstrates what I'd describe as superficial awareness without true understanding — it knows accessibility concepts exist but fundamentally misunderstands their purpose and proper implementation.

Here are some of the patterns I've documented:

**Form Label Disasters**: When asked to create a required text field, the model failed to include a visible label:

```html
<input
  type="text"
  id="orangeColor"
  name="orangeColor"
  required
  placeholder="What color is an orange?"
/>
```

Sure, the `placeholder` attribute is there, and in a pinch it will be included in a field’s accessible name calculation, but sighted users will lose the label as soon as they start typing.

**ARIA Attribute Confusion**: The model would routinely involve ARIA for no reason:

```html
<label for="color-question"
  >What color is an orange? <span style="color: red;">*</span></label
>
<input
  type="text"
  id="color-question"
  name="color-question"
  required
  aria-required="true"
  aria-labelledby="color-question"
/>
```

Here the `for` attribute already establishes the relationship between the label and input, so `aria-labelledby` is redundant. A bit of a nitpick, but the `aria-required="true"` is also unnecessary since the native `required` attribute already conveys that information to assistive technologies. `aria-required="true"` is only needed when creating custom form controls non-semantic markup.

**Redundant ARIA**: Keeping on the ARIA redundancy, consider examples like this:

```html
<input
  type="radio"
  id="option1"
  aria-labelledby="label1"
  aria-label="Option 1"
/>
<label for="option1" id="label1">Option 1</label>
```

This redundancy raises the question _why‽_

**Required Field Misapplication**: For checkbox groups where users need to select "one or more," the model often adds `required` to individual checkboxes:

```html
<fieldset>
  <legend>What fruits do you like?</legend>
  <div>
    <input
      type="checkbox"
      id="bananas"
      name="fruits"
      value="bananas"
      required
    />
    <label for="bananas">Bananas</label>
  </div>
  <div>
    <input
      type="checkbox"
      id="oranges"
      name="fruits"
      value="oranges"
      required
    />
    <label for="oranges">Oranges</label>
  </div>
  <div>
    <input type="checkbox" id="apples" name="fruits" value="apples" required />
    <label for="apples">Apples</label>
  </div>
  <div style="color: red; display: none;" id="validation-error">
    You must choose one or more fruits
  </div>
</fieldset>
```

This breaks the intended behavior—if any checkbox is marked required, it must be checked for form validation to pass. For a web component that addresses this limitation in HTML, see my post “[Requirement Rules for Checkboxes](/notebook/requirement-rules-for-checkboxes/).”

**Grouped Field Confusion**: Not understanding when to use `fieldset` and `legend` (or at least using `role="group"` and `aria-labelledby`) on a field group:

```html
<div>
  <label>Select Theme:</label>
  <div>
    <input type="radio" id="light" name="theme" value="light" />
    <label for="light">Light</label>
  </div>
  <div>
    <input type="radio" id="dark" name="theme" value="dark" />
    <label for="dark">Dark</label>
  </div>
  <div>
    <input type="radio" id="high-contrast" name="theme" value="high-contrast" />
    <label for="high-contrast">High Contrast</label>
  </div>
  <p>You can change this later</p>
</div>
```

Ideally, this would be a `fieldset` with a `legend` and the descriptive text would appear right after the `legend` and be associated with the group using `aria-describedby`.

**Color-Only Error Indication**: Generating error states that rely solely on color changes without text indicators or proper ARIA attributes to convey the error state to screen readers.

**Unnecessary Role Additions**: Adding redundant roles like `role="radiogroup"` to properly structured fieldsets containing radio inputs, where the native semantics already provide the correct accessibility tree.

**Missing Error State Management**: Failing to include `aria-invalid="true"` on fields with errors or properly associate error messages with their corresponding form controls.

**Lack of Wayfinding Help**: Failing to include navigational labels and `aria-current="page"` in a breadcrumb nav.

**Adding Unnecessary JavaScript**: Even though it was instructed to only generate JavaScript when absolutely necessary, the model would often inject JavaScript for simple tasks that could be handled with HTML and CSS alone.

## How Does This Help?

Here's where things get interesting — and hopeful. When I retested using prompts that included accessibility hints, the model’s output improved dramatically. Not just slightly better, but often going from fundamentally broken to genuinely accessible.

For example, when I added diff data related to fieldset use to a prompt about radio button groups, the model switched from generating meaningless `div` wrappers to proper semantic structures.

This suggests the model can produce quality code if properly primed. It also indicates that the training data likely lacks sufficient examples of well-implemented accessible components. If the model had been trained on a richer dataset of accessible code, it might not need such explicit guidance to produce good results.

## Where Do We Go From Here?

These findings point to several concrete approaches for improving accessibility in AI-generated code:

**Enhanced Training Data**: The models need exposure to more high-quality, accessible code examples. Current training data clearly overrepresents inaccessible implementations. We need comprehensive datasets of properly implemented accessible components across different frameworks and use cases.

**Accessibility-Aware Fine-Tuning**: Post-training refinement specifically focused on accessibility compliance could help models prioritize inclusive patterns. This could involve training on accessibility-annotated code pairs — showing inaccessible implementations alongside their accessible counterparts, like the diffs do.

**Prompt Engineering Guidelines**: Tool creators should integrate accessibility considerations into their default system prompts. Instead of just asking for "clean, semantic HTML," prompts should provide detailed instructions to demonstrate accessibility best practices rather than pointing at often vague guidelines like WCAG."

**Integrated Accessibility Validation**: IDE integrations should include real-time accessibility linting of AI-generated code, providing immediate feedback and suggestions for improvement.

**Community-Contributed Training Data**: We should coordinate our efforts to produce an open source, high-quality accessible code dataset so that this data can be integrated into future models.

<hr>

The data from this project provides a roadmap for where to focus these efforts. We’re not dealing with models that are fundamentally incapable of generating accessible code — we’re dealing with models that haven't been properly trained to prioritize accessibility by default.

## Want to Get Involved?

If you want to conduct similar evaluations with your preferred models or specific use cases, I've created a template repository with the testing framework: [CodeGen Model Eval and Refine Tools](https://github.com/aarongustafson/CodeGen-Model-Eval-and-Refine-Tools). It includes the Python testing harness, prompt templates, and analysis guidelines to get you started.

The complete findings, methodology details, and code samples for my research are available [on GitHub](https://github.com/aarongustafson/testing-llm-code-a11y). I encourage you to dig into the data — it’s eye-opening and frustrating, yes, but ultimately actionable.

There are other projects and research exploring this space as well. A few worth checking out:

- [AIMAC](https://aimac.ai/) - The AI Model Accessibility Checker (AIMAC) Leaderboard measures how well LLMs generate accessible HTML pages using neutral prompts without specific accessibility guidance. Checks are performed with axe-core.
- [A11y LLM Evaluation Harness and Dataset](https://github.com/microsoft/a11y-llm-eval) - A more recent research project to evaluate how well various LLM models generate accessible HTML content.

<hr>

We’re at a critical moment where the patterns established in AI-assisted development will shape the accessibility of the web for years to come. We can either let this technology amplify existing accessibility problems, or we can tackle the problems head-on and be part of the solution.
