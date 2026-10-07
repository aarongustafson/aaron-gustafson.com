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
description: "After running into one 15-column table after another, I built a custom element that lets readers choose which columns to show without removing anything from the source table."
twitter_text: "I kept running into 15-column tables that were miserable to scan on smaller screens, so I built table-modifiable to let readers choose which columns they need."
---

I kept running into data tables with 15 columns. Sometimes more.

Even on a roomy screen, finding the two values you need in a row like that can feel like tracking a tennis ball from the cheap seats. On a smaller screen, the usual response is to hide whichever columns the development team considers less important. That never sat well with me. We know how much room the layout has; we don’t necessarily know which bit of information the person at the other end needs today.

I built [`@aarongustafson/table-modifiable`](https://github.com/aarongustafson/table-modifiable) to try a different arrangement: authors provide a sensible starting view, and readers can change it.

<!-- more -->

## Keep the whole table in the HTML

The source contains every column:

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

`removable` names the columns the reader is allowed to toggle. `start-with` says which of those the component should show initially. In this example, Product and Price make up the compact view; Stock, Category, and Supplier are one control away.

The names have to match the trimmed text in the first header row. It’s a deliberately small API, although it does mean changing “Supplier” to “Vendor” requires changing the attribute as well.

If the script doesn’t run, the browser ignores `start-with` and shows the full table. That fallback matters here. Hiding columns in the source—or with CSS that has no corresponding control—would leave some readers with less information and no way to ask for it.

## Let the browser build the interaction

When the custom element initializes, its script adds a “Modify Table” button before the table. The button targets a native popover containing labeled checkboxes, one for each removable column. Uncheck Supplier and the script hides that header and the cells beneath it; check Supplier again and they return.

I used a button, checkboxes, and the [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) because those controls already have the behavior this little interface needs. The popover can sit in the browser’s top layer, dismiss when someone clicks elsewhere, and close with <kbd>Escape</kbd>. The checkboxes expose which columns are currently visible. There was no upside in re-creating all of that with clickable `<div>` elements and optimism.

The component also prevents the last visible removable column from being unchecked. A table with no columns would be a faithful response to the controls, technically, but not a particularly useful one.

Authors still have to choose `start-with` carefully. I’d base it on the most common task and the available space, not on which headings happen to produce the tidiest screenshot. The checkboxes are there because someone else’s task may differ.

## There is a boundary

Version 1.1.0 supports simple tables: one header row, body cells that line up with those headers, and no `colspan` or `rowspan`.

That’s an implementation constraint. The script hides cells by column index. Once a cell spans two columns—or a header describes a more complex relationship—“hide column four” stops being a single, reliable operation. The component isn’t designed for those tables; supporting them would require a more complete model of the table’s structure.

For simple tables, the component dispatches `table-modifiable:change` whenever a checkbox changes:

```javascript
const table = document.querySelector("table-modifiable");

table.addEventListener("table-modifiable:change", (event) => {
  const { column, visible } = event.detail;
  saveColumnPreference(column, visible);
});
```

That gives the surrounding application a place to save someone’s choices if persistence makes sense. I left storage out of the component itself; a one-time comparison table and a dashboard someone uses every morning don’t need the same memory.

The [demo](https://aarongustafson.github.io/table-modifiable/demo/) shows a few starting views and column sets. To use the component:

```bash
npm install @aarongustafson/table-modifiable
```

```javascript
import "@aarongustafson/table-modifiable/define.js";
```

I’m still choosing a default when I add `start-with`. The difference is that the reader can correct me.
