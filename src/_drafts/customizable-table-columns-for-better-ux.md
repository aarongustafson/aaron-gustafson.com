---
title: "Customizable Table Columns for Better UX"
date: 2025-12-10 10:00:00 -07:00
comments: true
tags:
  [
    "web components",
    "progressive enhancement",
    "HTML",
    "tables",
    "accessibility",
    "user experience",
  ]
description: "The table-modifiable web component lets users hide and show table columns using the Popover API, making wide data tables a lot easier to live with."
twitter_text: "Let users choose which table columns they actually want to see."
---

Data tables are powerful, but they can get unwieldy fast, especially when you’ve got a dozen columns all trying to elbow one another off the screen. The `table-modifiable` web component gives users control over which columns they see, using the native Popover API to create a clean, accessible column selector.

<!-- more -->

This is not just about responsive tables that hide columns on mobile, though it certainly helps there too. It is about giving users agency. Maybe they only care about product names and prices, not stock levels or suppliers. Let them choose.

## Simplest usage

Specify which columns can be toggled:

```html
<table-modifiable removable="Name,Email,Phone">
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>John Doe</td>
        <td>john@example.com</td>
        <td>555-1234</td>
      </tr>
    </tbody>
  </table>
</table-modifiable>
```

This creates a “Modify Table” button above your table. Click it and you get a popover with checkboxes for each column. Uncheck a column and it disappears from the table; check it again and it reappears. Nice and straightforward.

All columns listed in `removable` are shown by default. The component won’t let users hide every column—at least one must remain visible.

## Control initial visibility

Start with some columns hidden:

```html
<table-modifiable
  removable="Product,Price,Stock,Category,Supplier"
  start-with="Product,Price"
>
  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th>Price</th>
        <th>Stock</th>
        <th>Category</th>
        <th>Supplier</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Widget</td>
        <td>$9.99</td>
        <td>42</td>
        <td>Tools</td>
        <td>Acme Corp</td>
      </tr>
    </tbody>
  </table>
</table-modifiable>
```

The `start-with` attribute specifies which columns appear on page load. In this example, Stock, Category, and Supplier are hidden initially but users can show them via the popover.

This is especially handy for mobile-first responsive design: start with the essentials, then let users opt into more detail when they want it.

## Custom button labels

Tailor the interface to your content:

```html
<table-modifiable
  removable="Name,Email,Phone,Address"
  button-label="⚙️ Customize View"
  button-aria-label="Customize which columns are visible in the table"
  tools-label="Choose Columns to Display"
>
  <table>
    <!-- table content -->
  </table>
</table-modifiable>
```

The `button-label` sets the visible button text (default: “Modify Table”), `button-aria-label` provides a more descriptive announcement for screen readers (defaults to matching `button-label`), and `tools-label` changes the heading inside the popover (default: “Show/Hide Columns”).

Use this to match your site’s voice or just make the control a little clearer about what it actually does.

## Listen to changes

Track which columns users hide or show:

```javascript
const table = document.querySelector("table-modifiable");

table.addEventListener("table-modifiable:change", (event) => {
  console.log(
    `Column "${event.detail.column}" is now ${event.detail.visible ? "visible" : "hidden"}`,
  );
});
```

The `table-modifiable:change` event fires whenever a column’s visibility changes. The event detail includes:

- `column`: The column name (matches the text in the `<th>`)
- `visible`: Boolean indicating whether the column is now shown or hidden

You can use this to save user preferences to localStorage, update analytics, or sync state across multiple tables. Or ignore all that and just let people hide columns in peace.

## How it works

The component:

1. Reads your `removable` attribute to know which columns can be toggled
2. Creates a button that triggers a native popover
3. Generates checkboxes for each removable column
4. Caches column indices for performance
5. Toggles `display: none` on header and body cells when checkboxes change
6. Prevents unchecking the last visible column

It uses light DOM, so your table remains in the regular DOM tree and participates normally in forms and CSS. The column names in your `removable` attribute must match the text content of your `<th>` elements exactly (whitespace trimmed).

## Simple tables only

This component works with straightforward tables: one header row, matching body cells. It does not support `colspan` or `rowspan` because tracking column indices across merged cells gets messy fast. Keep it simple and the component will happily do its thing.

## Style the popover

The component uses the native Popover API and generates elements with specific classes, making them easy to style:

```css
/* Style the toggle button */
.modification-tools-toggle {
  background: #0969da;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

/* Style the popover */
.modification-tools {
  background: white;
  color: #333;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #d0d7de;
  box-shadow: 0 8px 24px rgba(140, 149, 159, 0.2);
  min-width: 250px;
}

/* Style the checkboxes */
.modification-tools label {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modification-tools label:hover {
  background: #f6f8fa;
  border-radius: 3px;
}
```

You can also use CSS custom properties for theming:

```css
:root {
  --table-modifiable-tool-bg: #f5f5f5;
  --table-modifiable-tool-color: #222;
}
```

## Installation

Install via npm:

```bash
npm install @aarongustafson/table-modifiable
```

Import it in your JavaScript:

```javascript
import "@aarongustafson/table-modifiable";
```

Or load from a CDN:

```html
<script type="module">
  import { defineTableModifiable } from "https://unpkg.com/@aarongustafson/table-modifiable@latest/define.js?module";
  defineTableModifiable();
</script>
```

## Browser support

The component requires:

- Custom Elements v1
- ES Modules
- Popover API (currently in modern browsers)

For older browsers or those without Popover API support, you’ll need polyfills. The component does graceful degradation—if it can’t initialize, users just see the regular table.

## Why I built this

I kept running into data tables with 15+ columns that were nearly impossible to scan, especially on smaller screens. Hiding columns on mobile helps, but why should the developer decide which columns matter most to users? Different people care about different data.

This component lets users make that choice themselves. Show what matters to you, hide what doesn’t. It’s a small UX improvement that makes data tables significantly more pleasant to use.

The Popover API was perfect for this: no z-index battles, automatic focus management, and built-in dismissal behavior. It is refreshingly civilized.

Check out the [live demo](https://aarongustafson.github.io/table-modifiable/demo/) to see it in action, or grab the source from [GitHub](https://github.com/aarongustafson/table-modifiable).
