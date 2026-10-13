---
title: "Sortable Tables with Progressive Enhancement"
date: 2026-10-12 19:50:32 +00:00
comments: true
tags:
  [
    "web components",
    "progressive enhancement",
    "HTML",
    "accessibility",
    "tables",
  ]
description: "My table-sortable web component adds accessible, customizable sorting to ordinary HTML tables while keeping their core structure and semantics intact."
twitter_text: "Need sortable tables? My table-sortable web component adds accessible, customizable sorting to ordinary HTML tables—and they still work when JavaScript doesn’t."
atUri: "at://did:plc:6rmgrvblxflqh34omwywu6ib/site.standard.document/3mxrnvyrt772w"
---

Many years ago, I made a little jQuery plugin called [Easy Sortable Tables](https://github.com/easy-designs/jquery.easy-sortable-tables.js). It works exactly as promised: point it at a table and it upgrades the UI so a reader can sort the rows by clicking a column heading. The functionality is still useful, but I can’t even remember the last time I added jQuery to a site.

The web platform’s changed quite a bit since I wrote that plugin, so I decided to modernize it as a web component: [`<table-sortable>`](https://github.com/aarongustafson/table-sortable).

<!-- more -->

## It all starts with a table

Just like the original, this web component upgrades a real table when you wrap it:

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

If the custom element never loads, the browser rightfully ignores it—thanks to the fault-tolerant nature of HTML—and renders the `<table>`. People can read it, navigate it, copy from it, or print it in the order it’s written.

When the element initializes, it turns each table header’s text into a button. I chose actual `<button>` elements over `<div>`s because they naturally participate in the tab order and respond to <kbd>Enter</kbd> and <kbd>Space</kbd>. A click on “Age” sorts the rows by age; the next click reverses them.

That interaction changes more than the row order. The script updates `aria-sort` on the active `<th>` and politely announces “Age sorted ascending.” The visible indicator, header state, and announcement all describe the same change, making it easier for everyone to follow.

## What you see isn’t always what to sort

If your table contains just strings and numbers, that’s all you really need. If, however, it contains things like people’s names, prices, and dates, you’re probably going to want to customize the way the data sorts.

You can customize the way a value sorts by using `data-sort-value`:

```html
<tr>
  <td data-sort-value="WIDGET-B">Widget B (Premium)</td>
  <td data-sort-value="50">$50.00</td>
  <td data-sort-value="2026-10-05">October 5, 2026</td>
</tr>
```

Readers see a human-friendly value; the sorting logic sees a computer-friendly one.

If you want to sort by only a portion of the value, this component supports that too. For example, if you want to sort a name like “John Smith” by “Smith,” you can indicate that with `data-sort-as`:

```html
<td>John <span data-sort-as>Smith</span></td>
```

With this in place, the component puts “Smith” before the rest of the cell’s value when it builds the sort key. People can still read the name naturally, but the table sorts it by last name.

## Stay with your group!

If you’re working with a particularly complex table, you might want to keep related rows together based on a shared characteristic, such as people within the same department. You can do that with `data-table-sort-group`. Put it on a `<tbody>` to give all of its rows the same group:

```html
<tbody data-table-sort-group="engineering">
  <!-- Engineering rows -->
</tbody>
```

You can also apply `data-table-sort-group` to individual `<tr>` elements. Rows with the same value will stay together, regardless of whether they started in the same `<tbody>`. If you happen to use both approaches, the value on the `<tr>` takes precedence.

## Accessible by default

Accessibility isn’t a nice-to-have; it’s a core principle of all my work. And so it is with this web component. Here are a few of its accessibility features:

- True `<button>` elements that receive focus and work with any input method
- UI state represented with ARIA
- The real `<table>` remains in the light DOM, preserving its core structure and semantics
- Sort changes announced using `ariaNotify()`, with a fallback to an injected live region

I also took care to make those announcements adaptable to whatever language your audience speaks.

## <i lang="es" aria-label="What direction are you going?">¿En qué dirección vas?</i>

Since I primarily speak English, the sort labels and announcements default to English. You can adapt them to another language—or just override my phrasing—with a few attributes. Here’s an example <i lang="fr" aria-label="in French">en français</i>:

<div lang="fr">

```html
<table-sortable
  label-sortable="Cliquer pour trier par ordre croissant"
  label-ascending="trié croissant. Cliquer pour trier décroissant"
  label-descending="trié décroissant. Cliquer pour trier croissant"
>
  <!-- the table -->
</table-sortable>
```

</div>

## Sort with style

Because `<table-sortable>` works in the light DOM, it gives designers a remarkable amount of control over the table’s styles. Here are a few useful selectors:

- `th[aria-sort="none"]` - column header in the unsorted state
- `th[aria-sort="ascending"]` - column header in the ascending sort state
- `th[aria-sort="descending"]` - column header in the descending sort state
- `th[aria-sort] > button` - the button used to handle sorting; combine with above to generate directional arrows into the UI
- `col.sorted` - the currently sorted column

You’ll see these put to good use in the demo below.

## Get yourself sorted

You can [try the examples in the live demo](https://aarongustafson.github.io/table-sortable/demo/).

<figure class="media-container">
<fullscreen-control class="talk__slides__embed video-embed__video">
<iframe src="https://aarongustafson.github.io/table-sortable/demo/" class="talk__slides__embed video-embed__video" frameborder="0"></iframe>
</fullscreen-control>
</figure>

If you’d like to put this web component to use on your own site, you can find out more on [the `<table-sortable>` project page](https://github.com/aarongustafson/table-sortable).

If you use it on your site, please do let me know. The incredibly talented [Zach Leatherman](https://zachleat.com)—creator of Eleventy and an impressive number of useful web components—did, and he called it [“a very good web component!”](https://fediverse.zachleat.com/@zachleat/117221563504038933), which was awfully nice to hear.
