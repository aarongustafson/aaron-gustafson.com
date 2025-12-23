---
title: "Sortable Tables with Progressive Enhancement"
date: 2025-12-06 10:00:00 -07:00
comments: true
tags:
  [
    "web components",
    "progressive enhancement",
    "HTML",
    "accessibility",
    "tables",
  ]
description: "The table-sortable web component adds client-side sorting to your tables with full keyboard navigation and screen reader support—without changing your markup."
twitter_text: "Add accessible table sorting without changing your HTML. Progressive enhancement at its finest."
---

HTML tables are great for displaying structured data, but they're static. Users often need to sort that data by different columns to find what they're looking for. The `table-sortable` web component adds client-side sorting with full accessibility support—and it requires zero changes to your existing table markup.

<!-- more -->

This is a modern web component port of my [jQuery Easy Sortable Tables](https://github.com/easy-designs/jquery.easy-sortable-tables.js), bringing progressive enhancement and accessibility to table sorting.

## Progressive enhancement

The beauty of this component is its simplicity. Just wrap your table:

```html
<table-sortable>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Age</th>
        <th>City</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Charlie Brown</td>
        <td>35</td>
        <td>New York</td>
      </tr>
      <tr>
        <td>Alice Cooper</td>
        <td>28</td>
        <td>Boston</td>
      </tr>
      <tr>
        <td>Bob Dylan</td>
        <td>42</td>
        <td>Chicago</td>
      </tr>
    </tbody>
  </table>
</table-sortable>
```

The component automatically creates accessible `<button>` elements inside each `<th>` for sorting. You don't add any buttons or links manually—the component handles that.

Click a column header to sort ascending, click again for descending. The component detects numeric values automatically and sorts them correctly (so 100 comes after 20, not after 1).

## Custom sort keys

Use `data-sort-value` to specify custom values for sorting:

```html
<tr>
  <td data-sort-value="WIDGET-B">Widget B (Premium)</td>
  <td>WDG-002</td>
  <td data-sort-value="50">$50.00</td>
  <td data-sort-value="15">Low (15)</td>
</tr>
```

This is useful for:

- Sorting formatted numbers (currency, percentages)
- Sorting dates by ISO format while displaying friendly formats
- Custom sorting logic (e.g., High > Medium > Low priority)

The "Price" and "Stock" columns use numeric values for sorting while displaying formatted text.

## Hidden sort keys

Use `[data-sort-as]` elements to provide hidden sort values:

```html
<td><span data-sort-as>Smith</span>John Smith</td>
```

Hide the element with CSS:

```css
[data-sort-as] {
  display: none;
}
```

This allows sorting by last name while displaying "First Last" format. The hidden value is used for sorting; the visible text appears to users.

## Grouped tables

Use multiple `<tbody>` elements with `data-table-sort-group` to maintain groupings:

```html
<table-sortable>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Score</th>
      </tr>
    </thead>
    <tbody>
      <tr data-table-sort-group="engineering">
        <td>Charlie (Engineering)</td>
        <td>85</td>
      </tr>
    </tbody>
    <tbody>
      <tr data-table-sort-group="design">
        <td>Alice (Design)</td>
        <td>92</td>
      </tr>
    </tbody>
    <tbody>
      <tr data-table-sort-group="sales">
        <td>Bob (Sales)</td>
        <td>78</td>
      </tr>
    </tbody>
  </table>
</table-sortable>
```

Each group (`tbody`) is sorted independently and maintains its structure. Multiple rows can exist within each group.

## Localization

Customize screen reader announcements with label attributes:

```html
<table-sortable
  label-sortable="Cliquer pour trier"
  label-ascending="trié croissant. Cliquer pour trier décroissant"
  label-descending="trié décroissant. Cliquer pour trier croissant"
>
  <table>
    <thead>
      <tr>
        <th>Nom</th>
        <th>Âge</th>
      </tr>
    </thead>
    <!-- table content -->
  </table>
</table-sortable>
```

The `label-ascending` and `label-descending` values are prefixed with the column name for context.

Available attributes:

- `label-sortable` - Label for unsorted columns (default: "Click to sort")
- `label-ascending` - Label when sorted ascending (default: "sorted ascending. Click to sort descending")
- `label-descending` - Label when sorted descending (default: "sorted descending. Click to sort ascending")

## Styling

The component uses light DOM, so you can style tables normally. It adds classes to help with sort indicators:

- `active` - Applied to the currently sorted `<th>`
- `up` - Applied when sorted ascending
- `down` - Applied when sorted descending
- `sorted` - Applied to the corresponding `<col>` element

The component automatically injects `<colgroup>` and `<col>` elements if they don't exist, allowing column-wide styling.

Customize sort indicators using CSS custom properties:

```css
table-sortable {
  --table-sortable-indicator-asc: "▲";
  --table-sortable-indicator-desc: "▼";
}

/* Style active column header */
thead th.active {
  background-color: #e3f2fd;
}

/* Highlight sorted column */
col.sorted {
  background-color: rgba(0, 102, 204, 0.05);
}
```

## Events

Listen for sort changes:

```javascript
const element = document.querySelector("table-sortable");

element.addEventListener("table-sortable:sort", (event) => {
  const { column, direction, header } = event.detail;
  console.log(
    `Sorted column ${column} (${header.textContent}) in ${direction}ending order`,
  );
});
```

The event detail includes:

- `column` - Zero-based column index
- `direction` - "asc" or "desc"
- `header` - The `<th>` element

## Keyboard navigation

Full keyboard support:

- **Tab** - Move focus to column headers
- **Enter** - Activate sorting
- **Space** - Activate sorting

All sortable headers are focusable and activatable via keyboard.

## Accessibility features

The component prioritizes accessibility:

1. **Keyboard navigation**: All headers are keyboard accessible
2. **Screen reader support**: `aria-sort` indicates column sort state (ascending, descending, none)
3. **Live region**: Announces sort changes using customizable labels
4. **Progressive enhancement**: Automatically creates accessible buttons
5. **Visual indicators**: CSS classes for active columns and sort direction
6. **Focus indicators**: Proper focus styles for keyboard navigation

## Sorting behavior

- **First click**: Sort ascending
- **Second click**: Sort descending
- **Text sorting**: Case-insensitive alphabetical
- **Numeric sorting**: Automatic detection and numeric comparison
- **Mixed content**: Text values sort before or after numbers depending on direction

The component is smart about numeric detection—values like "10", "20", "100" sort numerically rather than alphabetically.

## Column highlighting

The component provides automatic column highlighting via `<col>` elements. The currently sorted column receives a `.sorted` class on its corresponding `<col>`, allowing you to style entire columns:

```css
col.sorted {
  background-color: rgba(0, 0, 0, 0.03);
}
```

## Progressive enhancement philosophy

If JavaScript fails to load, you have a perfectly functional HTML table. Users can read all the data; they just can't sort it. Nothing breaks, you just lose the enhancement.

The component creates buttons inside `<th>` elements automatically—you write plain semantic HTML and get accessibility for free.

## Demo

Explore [the demo](https://aarongustafson.github.io/table-sortable/demo/) with various examples:

<figure id="fig-2025-12-06-08" class="media-container">
<fullscreen-control class="talk__slides__embed video-embed__video">
<iframe src="https://aarongustafson.github.io/table-sortable/demo/" class="talk__slides__embed video-embed__video" frameborder="0"></iframe>
</fullscreen-control>
</figure>

## Grab it

Check out the project on [GitHub](https://github.com/aarongustafson/table-sortable). Install via npm:

```bash
npm install @aarongustafson/table-sortable
```

Import and use:

```javascript
import "@aarongustafson/table-sortable";
```

Based on my [jQuery Easy Sortable Tables](https://github.com/easy-designs/jquery.easy-sortable-tables.js), now as a modern Custom Element with built-in accessibility.
