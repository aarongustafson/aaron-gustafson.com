---
title: "Tabbed Interface: The Web Component"
date: 2026-10-07 04:04:09 +00:00
comments: true
tags:
  ["web components", "progressive enhancement", "HTML", "accessibility", "ARIA"]
description: "I’ve been building tabbed interfaces from document headings since 2007. My new custom element carries that approach forward and now drops the tabs when they don’t fit."
twitter_text: "I keep coming back to tabbed interfaces."
---

I keep coming back to tabbed interfaces.

<!-- more -->

Back in 2007, I built [`TabInterface.js`](https://easy-designs.github.io/TabInterface.js/). It used the document outline—a heading followed by some content, then another heading and more content—and turned those implicit sections into tabs. The only markup required was a single wrapper.

I shared that work in my “Fundamental Progressive Enhancement” talk at Web Builder 2.0 in 2008, then wrote it up in a two-part article for <cite>NET Magazine</cite> in 2009 ([Part 1](https://www.aaron-gustafson.com/docs/create-a-tabbed-interface-part-1.pdf) and [Part 2](https://www.aaron-gustafson.com/docs/create-a-tabbed-interface-part-2.pdf)). When responsive design became a thing, I started recommending another step: only make the tabs when they fit; leave the content alone when the tabs wouldn’t.

Nearly two decades on, I’ve built the idea yet again. [`@aarongustafson/tabbed-interface`](https://github.com/aarongustafson/tabbed-interface) is the latest incarnation—as a custom element.

## Something old, something new

The markup requirement looks a lot like it did back in 2007; the only difference is that the `div` wrapper is now a `tabbed-interface` element:

```html
<tabbed-interface>
  <h2 id="overview">Overview</h2>
  <p>A summary of the service.</p>

  <h2 id="requirements">Requirements</h2>
  <p>What you need before getting started.</p>

  <h2 id="support">Support</h2>
  <p>Where to go when things get weird.</p>
</tabbed-interface>
```

As you can see, it’s still several implicit sections in a sensible reading order. The headings give each section a name, the `id` attributes provide link targets, and the content is available even if JavaScript fails or hasn’t loaded yet.

When the component boots, it uses those headings to create the tab controls. The headings, paragraphs, form controls, and any other elements contained within remain in the light DOM. The component assigns them to slots, retaining their connections to other elements, events, and such—like you (as the author) intended.

The component generates the necessary controls and wires everything up. Buttons with `role="tab"` sit in a `role="tablist"`, each button points to a `div[role="tabpanel"]`, and `aria-selected` indicates which one is active. Arrow keys move focus among the tabs; <kbd>Home</kbd> and <kbd>End</kbd> jump to either end. All as you’d expect.

By default, moving focus between the tabs doesn’t activate the associated panel. <kbd>Enter</kbd> and <kbd>Space</kbd> do that. You can override that default by adding the `auto-activate` attribute. With that attribute, moving focus changes the visible panel:

```html
<tabbed-interface auto-activate>
  <!-- headings and content -->
</tabbed-interface>
```

Neither choice is inherently better; they’re just options. If changing panels takes noticeable time—or simply causes a lot of visual commotion—I’d stick with manual activation.

## Anchors aweigh!

In 2026, adding `id` attributes to headings has become quite commonplace because they provide direct access to portions of the page through fragment identifiers. They also make super-stable targets for tabbed interfaces. One way I’ve leveraged them in this component is to set which tabpanel activates by default (if you don’t want it to be the first one):

```html
<tabbed-interface default-tab="requirements">
  <h2 id="overview">Overview</h2>
  <p>...</p>

  <h2 id="requirements">Requirements</h2>
  <p>...</p>
</tabbed-interface>
```

Here, the component opens “Requirements” initially. I’ve also enabled a tabpanel to be activated through the fragment identifier itself—a link to `#requirements` will activate that section when tabs are present; without tabs, the browser scrolls to the same heading as you’d expect.

This is a perfect example of carrying forward the intent of a tool like a fragment identifier into an alternate display widget.

## No squeezing, no scrolling

My early responsive versions estimated whether tabs would fit based on the viewport width and character length, but that’s not reliable. A media query can only tell us so much and it can’t say how long a translated label will become, whether a web font has arrived, or how much room the component’s actual container provided. Container queries can help with that last bit, but only so much.

In this latest incarnation, I’m measuring the fully styled tablist instead. The component builds a hidden measurement copy, applies the currently selected state, and checks whether the list can fit on one row inside the component. A `ResizeObserver` checks again when the container changes. Font loading, label changes, padding, borders, gaps, and custom styles all feed into the component’s measurement too.

If the row fits, the component renders tabs. If it doesn’t, the content is displayed in a linear fashion instead. It helpfully records the display mode as either `data-layout="tabs"` or `data-layout="linear"`, should you need a layout-specific style.

There’s no breakpoint to keep in sync with the component. You can resize the browser, adjust the font size, and rotate your device all you want—you’ll never be stuck with a bad layout. The script measures over and over, choosing between the two presentations as the available space changes.

### If you’re dead-set on tabs…

Just because I think it’s a good idea to toggle between the tabbed presentation and the linear one doesn’t mean you feel likewise. We don’t have to agree. You can opt out using the `fixed-tabs` attribute:

```html
<tabbed-interface fixed-tabs>
  <!-- headings and content -->
</tabbed-interface>
```

`fixed-tabs` ensures tabs are always shown, whether they fit or not. If you decide to go this way, however, you’re assuming responsibility for making the tabs work at whatever dimensions someone happens to view your site. Be prepared to handle overflow—you own it. Side-scrolling tabs are an abomination in my opinion, but you may feel differently.

## Printable tabs? Hell yeah!

I don’t know about you, but I love it when sites think about the print experience. So few do. When I find a site where the author has clearly put time and effort into their print styles, I get chills. Yeah, I know I’m odd.

Anyway, I hate it when widgets print like garbage, so I set this one up to print better than most: before the print dialog opens, the component switches to the linear layout so every heading and section appears on paper. Afterward, it measures again and brings back the tabs.

No more missing content!

## Give it a spin

I put together a [live demo](https://aarongustafson.github.io/tabbed-interface/demo/) of the component so you can check it out.

<figure class="media-container">
<fullscreen-control class="talk__slides__embed video-embed__video">
<iframe src="https://aarongustafson.github.io/tabbed-interface/demo/" class="talk__slides__embed video-embed__video" frameborder="0"></iframe>
</fullscreen-control>
</figure>

If it seems useful to you, head on over to [the `tabbed-interface` project page](https://github.com/aarongustafson/tabbed-interface) for the installation options and a complete list of features and options.

And if you use it on your site, let me know. Happy tabbing!