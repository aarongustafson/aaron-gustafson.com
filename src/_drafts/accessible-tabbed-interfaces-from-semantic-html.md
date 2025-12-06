---
title: "Accessible Tabbed Interfaces from Semantic HTML"
date: 2025-12-06 10:00:00 -07:00
comments: true
tags: ["web components", "progressive enhancement", "HTML", "accessibility", "ARIA"]
description: "The tabbed-interface web component transforms heading-structured content into an accessible tabbed interface with full keyboard navigation and ARIA support—no complex markup required."
twitter_text: "Turn semantic HTML into accessible tabs automatically. Here's how."
---

Creating accessible tabbed interfaces usually requires careful attention to ARIA attributes, keyboard navigation, and complex markup patterns. The `tabbed-interface` web component takes a different approach—it transforms simple heading-structured content into fully accessible tabs automatically.

<!-- more -->

This is a modern web component port of my original [TabInterface](https://github.com/easy-designs/TabInterface.js), bringing progressive enhancement and accessibility to tabbed content.

## Basic usage

Wrap heading-structured content in the component:

```html
<tabbed-interface>
  <h2>First Tab</h2>
  <p>Content for the first tab panel.</p>

  <h2>Second Tab</h2>
  <p>Content for the second tab panel.</p>

  <h2>Third Tab</h2>
  <p>Content for the third tab panel.</p>
</tabbed-interface>
```

The component automatically:
- Creates tab buttons from your headings
- Builds accessible tab panels from the content
- Adds proper ARIA attributes
- Enables keyboard navigation
- Hides headings in panels (by default)

All you provide is semantic HTML.

## Showing headings in panels

By default, headings are hidden inside panels. Keep them visible with `show-headers`:

```html
<tabbed-interface show-headers>
  <h2>Overview</h2>
  <p>Content here.</p>

  <h2>Details</h2>
  <p>More content.</p>
</tabbed-interface>
```

The heading appears both as a tab and inside the panel.

## Positioning tabs

Put tabs below the content with `tablist-after`:

```html
<tabbed-interface tablist-after>
  <h2>First</h2>
  <p>Content appears above tabs.</p>

  <h2>Second</h2>
  <p>More content.</p>
</tabbed-interface>
```

Useful for unconventional layouts or specific design requirements.

## Setting the default tab

Specify which tab is active initially:

```html
<tabbed-interface default-tab="1">
  <h2>Tab 0</h2>
  <p>First tab.</p>

  <h2>Tab 1</h2>
  <p>This tab is active by default.</p>

  <h2>Tab 2</h2>
  <p>Third tab.</p>
</tabbed-interface>
```

Use a zero-based index, or reference a heading's `id`:

```html
<tabbed-interface default-tab="features">
  <h2 id="intro">Introduction</h2>
  <p>Intro content.</p>

  <h2 id="features">Features</h2>
  <p>Feature content.</p>
</tabbed-interface>
```

## Auto-activation behavior

By default, users must press Enter or Space to activate a tab after focusing it with arrow keys (manual activation). This follows ARIA best practices for better accessibility.

Enable auto-activation to make tabs activate immediately on focus:

```html
<tabbed-interface auto-activate>
  <h2>Tab One</h2>
  <p>Content here.</p>

  <h2>Tab Two</h2>
  <p>More content.</p>
</tabbed-interface>
```

With auto-activation, arrow keys both focus and activate tabs. Without it, arrow keys focus tabs and Enter/Space activates them.

## Keyboard navigation

The component includes full keyboard support:

- **Arrow Left/Up** - Previous tab
- **Arrow Right/Down** - Next tab
- **Home** - First tab
- **End** - Last tab
- **Enter/Space** - Activate focused tab and focus first focusable element in panel (when auto-activate is off)

When a user activates a tab with Enter or Space, focus automatically moves to the first focusable element in that panel, making keyboard navigation seamless.

## Custom tab titles

Use `data-tab-short-name` to show different text in tabs than in headings:

```html
<tabbed-interface>
  <h2 data-tab-short-name="Intro">Introduction and Getting Started Guide</h2>
  <p>Full content with the complete heading visible in the panel.</p>
</tabbed-interface>
```

The tab shows "Intro" while the full heading text remains available to screen readers via `aria-label`.

## Hash navigation

The component supports deep linking via URL hashes:

```html
<a href="#features">Go to Features</a>

<tabbed-interface>
  <h2 id="intro">Introduction</h2>
  <p>Intro content.</p>

  <h2 id="features">Features</h2>
  <p>Feature content.</p>
</tabbed-interface>
```

Clicking the link activates the matching tab. Users can bookmark specific tabs.

## Styling with CSS parts

The component uses Shadow DOM, but exposes parts for styling:

```css
/* Style the tab list container */
tabbed-interface::part(tablist) {
  gap: 4px;
  background: #f0f0f0;
  padding: 8px;
}

/* Style individual tabs */
tabbed-interface::part(tab) {
  padding: 0.75em 1.5em;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px 4px 0 0;
}

/* Style tab panels */
tabbed-interface::part(tabpanel) {
  padding: 2em;
  border: 1px solid #ccc;
  background: white;
}
```

Target active tabs using attribute selectors:

```css
tabbed-interface::part(tab)[aria-selected="true"] {
  background: white;
  border-bottom-color: white;
  font-weight: bold;
}
```

Available parts:
- `tablist` - Container for all tabs
- `tab` - Individual tab buttons
- `tabpanel` - Individual tab panel containers

## Events

Listen for tab changes:

```javascript
document.querySelector('tabbed-interface')
  .addEventListener('tabbed-interface:change', (e) => {
    console.log(`Switched to tab ${e.detail.tabIndex}`);
    console.log('Tab ID:', e.detail.tabId);
    console.log('Panel ID:', e.detail.tabpanelId);
  });
```

## Programmatic control

Control tabs via JavaScript:

```javascript
const tabs = document.querySelector('tabbed-interface');

// Navigate
tabs.next();
tabs.previous();
tabs.first();
tabs.last();

// Set active tab directly
tabs.activeIndex = 2;
```

Properties are also available:

```javascript
tabs.activeIndex; // Get current tab index
tabs.showHeaders = true; // Show/hide headers
tabs.tablistAfter = true; // Move tabs below content
tabs.autoActivate = true; // Toggle auto-activation
```

## Accessibility

The component is built with accessibility as a core feature:

- **ARIA roles**: Proper `role="tablist"`, `role="tab"`, `role="tabpanel"`
- **ARIA states**: `aria-selected`, `aria-controls`, `aria-labelledby`
- **Keyboard navigation**: Full arrow key support following ARIA practices
- **Focus management**: Proper focus indication and movement
- **Screen reader support**: Descriptive labels and announcements

## Theming examples

**Pill-style tabs:**

```css
.pills::part(tablist) {
  gap: 8px;
  background: transparent;
}

.pills::part(tab) {
  border-radius: 20px;
  background: #e0e0e0;
}

.pills::part(tab)[aria-selected="true"] {
  background: #007bff;
  color: white;
}
```

**Minimal style:**

```css
.minimal::part(tab) {
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
}

.minimal::part(tab)[aria-selected="true"] {
  border-bottom-color: #007bff;
}
```

## Progressive enhancement

If JavaScript fails, users see all the headings and content in a standard document outline. Everything remains accessible and readable—you just lose the tabbed interaction pattern.

## Demo

Explore [the demo](https://aarongustafson.github.io/tabbed-interface/demo/) with various configurations and styling examples:

<figure id="fig-2025-12-06-06" class="media-container">
  {% CodePen "https://codepen.io/aarongustafson/pen/PENDING", "result", "400" %}
</figure>

## Grab it

Check out the project on [GitHub](https://github.com/aarongustafson/tabbed-interface). Install via npm:

```bash
npm install @aarongustafson/tabbed-interface
```

Import and use:

```javascript
import '@aarongustafson/tabbed-interface';
```

Based on my original [TabInterface](https://github.com/easy-designs/TabInterface.js) and its [jQuery port](https://github.com/easy-designs/jquery.TabInterface.js), now as a modern Custom Element.
