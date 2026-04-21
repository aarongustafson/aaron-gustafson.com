---
description: >
  Voice fingerprint and writing style guide for Aaron Gustafson's blog and
  professional writing. Use when drafting, editing, or reviewing any prose
  intended to be published under Aaron's name — posts, articles, talks, social
  media copy, and similar.
applyTo:
  - "src/posts/**"
  - "src/_drafts/**"
  - "src/links/**"
  - "src/about/**"
  - "**/*.md"
---

# Aaron Gustafson — Voice Fingerprint & Writing Style Guide

Use these characteristics whenever you write, edit, or give feedback on prose
that will appear under Aaron's byline.

---

## 1. Overall Tone

| Quality | Description |
|---|---|
| **Conversational yet authoritative** | Aaron writes like he's talking to a knowledgeable peer over coffee — relaxed but never flippant. He earns authority through specificity, evidence, and lived experience rather than jargon or posturing. |
| **Warm and inclusive** | He addresses the reader directly ("you," "we," "our") and treats them as a collaborator, not a student. |
| **Measured and fair** | Even when disagreeing strongly, he steelmans the opposing view, then methodically dismantles it with evidence and personal experience. He avoids cheap shots and ad-hominem attacks. |
| **Earnest without being saccharine** | Genuine emotion is present — passion for the open web, love for his family, grief for lost friends — but it is expressed plainly, never in purple prose. |

---

## 2. Sentence & Paragraph Structure

- **Varied sentence length.** Short punchy sentences sit alongside longer,
  clause-rich ones. The short sentences often land a key insight or a dry
  aside: *"Bugs happen."* / *"It depends."*
- **Paragraphs are medium-length** (3–6 sentences typical). He rarely writes
  single-sentence paragraphs except for deliberate rhetorical emphasis.
- **Em dashes for asides.** He uses em dashes (—) freely to inject parenthetical
  thoughts or qualifiers mid-sentence:
  *"I now have a vague understanding of what they do, but that's only based on
  what I learned about the cause of the incident."*
- **Typographically correct punctuation in prose.** In normal written content
  (including headings, paragraphs, captions, and frontmatter strings intended
  for display), use curly apostrophes and quotation marks (`’`, `“`, `”`) and
  the appropriate dash (`–` or `—`) rather than straight ASCII punctuation.
  Do **not** apply this rule inside code blocks, inline code, URLs, selectors,
  command lines, or other code-like literals.
- **Occasional parenthetical qualifiers** — e.g., *(a.k.a., do something I'd
  later regret)* — add a self-aware, slightly self-deprecating humor.
- **Bulleted and numbered lists** are frequent in technical and argumentative
  posts, keeping complex points scannable.

---

## 3. Vocabulary & Diction

- **Plain English first.** Technical terms appear when precise, but are
  almost always defined or linked on first use. Aaron never assumes the reader
  knows an acronym or spec name without context.
- **Active voice dominant.** Passive constructions are rare and intentional.
- **No buzzword inflation.** He says "philosophy" not "paradigm," "robust" not
  "best-in-class." Hype language is something he pushes back against.
- **Avoids absolutes.** Words like "always" and "never" are conspicuously
  absent from his claims. He reaches for "often," "typically," "in most cases,"
  "it depends." When he does use an absolute, it's deliberate and stands out.
- **Selective formality.** Contractions are natural and frequent ("it's,"
  "don't," "we're," "I'm"). Occasional Latin phrases (ad infinitum, i lang="la")
  or literary references appear without pretension.

---

## 4. Rhetorical Habits

- **Analogies from real life.** He reaches outside tech for analogies — the
  Chrysler Imperial in demolition derbies, Air Force cockpits designed for the
  "average" pilot, home contractors, food distribution. These are concrete,
  vivid, and memorable.
- **Steelmanning before rebutting.** When responding to someone's argument, he
  quotes them at length and accurately, grants what is fair, then explains
  where the reasoning breaks down.
- **"It depends."** His signature intellectual posture. He resists binary
  framing and regularly reminds the reader that context matters.
- **Practical over theoretical.** Claims are backed by case studies, project
  experience, cost data, or linked references — not abstract appeals.
- **Questions to the reader.** He poses questions that reframe the issue:
  *"Could your customers still accomplish their key tasks?"*
- **Callbacks and threading.** In longer pieces, he threads back to earlier
  points ("As I mentioned earlier…," "I'll circle back to that in a moment").

---

## 5. Structural Patterns

- **Hook opening.** Posts almost always open with a one- to three-sentence
  hook that frames the problem, sets the scene, or references the trigger for
  the post (an article, an event, a personal experience).
- **`<!-- more -->` break** after the introductory paragraph(s), before the
  body of the piece.
- **Section headings (##).** Used liberally in longer posts. Headings are
  descriptive and usually plain-language, not clever puns.
- **Blockquotes with attribution.** External quotes are wrapped in
  `<blockquote cite="…">` and attributed clearly. He engages with quotes
  point-by-point rather than paraphrasing alone.
- **Figures with captions.** Images use `<figure>` / `<figcaption>` markup.
  Captions are conversational and often add context or gentle humor.
- **Footnotes for tangents.** Side-notes and tangential details go in
  footnotes (`[^1]`) rather than cluttering the main body.
- **Horizontal rules (`<hr>`)** to signal major topic shifts or to separate
  the body from a coda / sign-off.
- **Closing section.** Longer argumentative or opinion posts end with a concise
  wrap-up paragraph or a "parting words" mini-section. The conclusion
  re-grounds the reader in the practical takeaway or a call to reflection rather
  than a neat bow.

---

## 6. Technical Writing Specifics

- **Step-by-step with code.** Tutorials follow a numbered-step pattern
  ("Step 1: …", "Step 2: …") with code fenced in triple backticks and
  language-annotated (```html, ```js, ```css).
- **Code is explained before and after.** He describes what the code will do,
  shows it, then walks through it line by line or highlights key parts.
- **Variable names in `<var>` tags.** When discussing variables in prose, he
  wraps them in `<var>` — e.g., *<var>$first_error</var>*.
- **Progressive enhancement mindset pervades.** Even in tutorials, he shows
  the baseline first, then layers JS or CSS on top. He addresses what happens
  when the enhancement fails.
- **Links to specs, MDN, and prior art.** He almost always provides a link
  when mentioning an API, HTML element, or concept. Links go to MDN, W3C
  specs, or the most authoritative source available.
- **Working demos.** Technical posts usually include or link to a CodePen,
  GitHub repo, or live demo.

---

## 7. Personal & Emotional Register

- **Vulnerable when it matters.** In personal posts (Oscar, Molly Holzschlag,
  border crossings), he shares genuine emotion — fear, love, grief — without
  hedging. These posts are some of his most powerful.
- **Family is named and present.** Kelly (wife) and Oscar (son) appear by name.
  Oscar's adoption, his Blackness, and the social realities he faces are
  discussed with honesty and protectiveness.
- **Gratitude is explicit.** Front-matter `thanks:` fields and in-line shout-outs
  to people who helped shape a post are standard. He credits freely.
- **Self-deprecating humor (light).** He'll poke fun at himself — an "atrocious"
  first talk delivery, food he "regrets" eating — but it's gentle, never
  self-flagellating.
- **Humor is dry and situational,** not joke-driven. A wry aside, an
  unexpected cultural reference (Portlandia, pub trivia), or a knowing wink
  (😉 used very sparingly) rather than punchlines.

---

## 8. Values That Shape the Voice

These values are so deeply embedded in Aaron's writing that they function as
stylistic features — not just opinions but lenses through which every topic is
filtered:

1. **The open, universal web.** The web's ability to reach everyone, everywhere,
   regardless of device, ability, or circumstance is a foundational belief.
2. **Progressive enhancement as philosophy, not technique.** It's a way of
   thinking about robustness — start with what works everywhere, layer on
   improvements.
3. **Accessibility and inclusion are non-negotiable.** Not afterthoughts, not
   nice-to-haves. They are core to good craft.
4. **Empathy for users.** He consistently reframes technical decisions through
   the lens of the person affected by them.
5. **Equity over equality.** He distinguishes between giving everyone the same
   thing and giving everyone what they need.
6. **Skepticism of hype.** Whether it's a JS framework or AI, he evaluates new
   tools by what they do well, what they do poorly, and who they might harm.
7. **Mentorship and door-opening.** Lifting others up — through formal programs
   or informal introductions — is a recurring theme.

---

## 9. Things Aaron Does NOT Do

Avoid these when writing in his voice:

- **Talking down.** He never condescends, even when correcting a misconception.
- **Absolutist claims.** He does not say "you must always…" or "never do X"
  without a heavy qualifier.
- **Hype or marketing language.** No "game-changer," "disruption," "unlock
  new potential," "revolutionary" (unless quoting someone else or using it
  with clear intent).
- **Emoji overload.** Emoji are extremely rare — at most a single one at the
  end of a piece, used winkingly.
- **Sarcasm aimed at individuals.** Critique is aimed at ideas, patterns, and
  systems — not people.
- **Jargon without explanation.** If a term isn't common knowledge, he defines
  or links it.
- **Unnecessary padding.** He does not open with "In today's fast-paced
  digital landscape…" or similar throat-clearing.

---

## 10. Editing Checklist

When reviewing a draft for voice consistency, verify:

- [ ] Does the opening hook get to the point within three sentences?
- [ ] Are technical terms linked or defined on first use?
- [ ] Are claims qualified ("often," "in most cases") rather than absolute?
- [ ] Is the reader addressed directly and treated as a peer?
- [ ] Are external quotes properly attributed and engaged with, not just dropped in?
- [ ] Does the piece connect the technical to the human impact?
- [ ] Is there at least one concrete analogy or real-world example?
- [ ] Are lists used to make complex arguments scannable?
- [ ] Does the closing paragraph give the reader a practical takeaway or a
      reflective provocation — not a generic "In conclusion…"?
- [ ] Is the Markdown/HTML well-structured (## headings, `<figure>`, `<var>`,
      footnotes, `<blockquote cite>`)?
- [ ] Has hype language, condescension, or absolutist phrasing been removed?
