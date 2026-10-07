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
description: "I rebuilt my old jQuery Easy Sortable Tables plugin as a custom element, keeping the HTML table intact while adding buttons, sort state, and better handling for displayed data."
twitter_text: "I rebuilt my old jQuery Easy Sortable Tables plugin as a custom element. Here’s how table-sortable 2.0.4 adds useful sorting without replacing the table underneath."
---

Many years ago, I made a little jQuery plugin called [Easy Sortable Tables](https://github.com/easy-designs/jquery.easy-sortable-tables.js). It did what the name promised: point it at a table, and a reader could sort the rows by activating a column heading.

I still need that behavior from time to time. I don’t need the jQuery part anymore.

So I revisited the idea as [`@aarongustafson/table-sortable`](https://github.com/aarongustafson/table-sortable), a custom element now at version 2.0.4. The browser has changed quite a bit since I wrote the original plugin, but my starting point hasn’t: the table should be useful before the script does anything to it.

<!-- more -->

## The table is already the fallback

Here’s the whole setup:

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

If the custom element never loads, the browser ignores the unfamiliar wrapper and renders the table. You can read it, navigate it, copy from it, or print it in the order the server supplied. Sorting is useful, but it isn’t required to recover the data.

When the element initializes, its script turns each heading’s text into a button. I chose actual buttons because they already participate in the tab order and respond to <kbd>Enter</kbd> and <kbd>Space</kbd>. A click on “Age” sorts the rows by age; the next click reverses them.

That interaction changes more than the row order. The script updates `aria-sort` on the active `<th>` and writes an announcement such as “Age sorted ascending” to a polite live region. The visible indicator, header state, and announcement all describe the same change. Nothing here is especially exotic, but leaving out any one of those pieces makes the result harder for someone to follow.

## What you see isn’t always what you sort

The first version of a sortable table usually behaves beautifully with names and integers. Then real data arrives.

Prices include currency symbols. Dates are written for people rather than parsers. A product name grows a parenthetical note. That doesn’t mean the displayed content should get uglier just to make the comparison easier.

For those cases, I added `data-sort-value`:

```html
<tr>
  <td data-sort-value="WIDGET-B">Widget B (Premium)</td>
  <td data-sort-value="50">$50.00</td>
  <td data-sort-value="2026-10-05">October 5, 2026</td>
</tr>
```

The reader still sees a friendly price and date; the script compares `50` and `2026-10-05`. This also gives the author control when the browser’s best guess would be wrong.

Names presented another small wrinkle. If the cell says “John Smith,” I may want it filed under Smith without maintaining a second, invisible copy of the whole name. Marking the useful fragment with `data-sort-as` handles that:

```html
<td>John <span data-sort-as>Smith</span></td>
```

The component puts “Smith” first when it builds the comparison key, then includes the rest of the cell text. The name remains natural to read, and the sorting behavior reflects the choice I made for that table.

## A couple of details that mattered later

Some tables use multiple rows for one logical item—perhaps a summary followed by details. Giving those rows the same `data-table-sort-group` value keeps them together while the groups move. That feature came from the sort of table that looks simple right up until one row wanders away from the explanation beneath it.

The text attached to the controls can be localized as well:

```html
<table-sortable
  label-sortable="Cliquer pour trier"
  label-ascending="trié croissant. Cliquer pour trier décroissant"
  label-descending="trié décroissant. Cliquer pour trier croissant"
>
  <!-- the table -->
</table-sortable>
```

Those strings tell a screen-reader user both what happened and what another activation will do, so they need the same translation care as the visible page.

You can [try the examples in the live demo](https://aarongustafson.github.io/table-sortable/demo/). To use the component in a project, install and register it:

```bash
npm install @aarongustafson/table-sortable
```

```javascript
import "@aarongustafson/table-sortable/define.js";
```

Zach Leatherman called it [“a very good web component!”](https://fediverse.zachleat.com/@zachleat/117221563504038933), which was awfully nice to hear.

The new version does more than my jQuery plugin did, but it still leaves the original table in charge of the data. That’s the part I wanted to keep.
