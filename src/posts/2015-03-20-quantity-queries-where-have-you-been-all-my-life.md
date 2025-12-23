---
title: "Quantity Queries… Where Have You Been All My Life?"
date: 2015-03-20 11:00:03 -04:00
comments: true
tags: ["web design", CSS]
description: "I love-love-love Heydon Pickering’s “quantity queries” technique."
---

[Heydon Pickering](http://twitter.com/heydonworks)’s [Quantity Queries for CSS](http://alistapart.com/article/quantity-queries-for-css) is sheer brilliance and it’s so simple I’m surprised we hadn’t landed on the idea sooner.

<!-- more -->

We've all experienced this feeling: _I have no idea how many modules will be in this block, but I would love to lay them out differently depending on that number._ Short of writing exhaustive CSS to (hopefully, optimistically) cover all of your bases, we had not figured out a good way to do this.

Heydon to the rescue!

Here’s Heydon’s first quantity query example:

```css
li:nth-last-child(6):first-child,
li:nth-last-child(6):first-child ~ li {
  color: green;
}
```

With these selectors, the rule set would only apply if the total count of list items was exactly 6. Here’s what he is selecting:

1. A list item (`li`) that is 6th sibling in a group of list item siblings when counted backwards (`:nth-last-child(6)`), but only if it is also the first of those siblings (`:first-child`); and
2. Any list item (`li`) siblings that follow the one selected above (`~`).

Brilliant! [Heydon breaks it down way more eloquently](http://alistapart.com/article/quantity-queries-for-css#section4) (and with illustrated squid to boot). To use this in your own projects, simply swap the "6" for whatever count you are looking for it to be equal to.

But Heydon doesn’t stop there. He also gives us ways to test for more than or equal to and fewer than or equal to a certain number. We’ll start with the  
"more than" variant (because everyone always wants more):

```css
li:nth-last-child(n + 6),
li:nth-last-child(n + 6) ~ li {
  /* properties here */
}
```

This one is slightly more complex, using the `nth-*` formula to manage the calculation. In English, this selects:

1. A list item (`li`) which is the sixth, seventh, eighth, etc. sibling in a collection of list item siblings when counted backwards from the end of that collection (`:nth-last-child(n+6)`); and
2. Any list item (`li`) siblings that follow the one(s) selected above (`~`).

The magic is in the formula: _n+6_.

The way `nth-*` formulae work is that the "n" portion is about dividing the siblings into smaller groups based on the _n_ multiplier. So "2n" means for every group of 2, "3n" means for every group of 3, and so on. In Heydon’s case, "n" simply means for every group of 1. The _n_ multiplier starts as zero (for the first group) and then becomes 1, 2, 3, etc. in succession.

The number added or subtracted from this number ("+6" in the example) can be though of as the item in the count. Most often we see this in use as "2n+2" which stands for the second sibling in every group of two. It’s usually common to see this number be smaller than the grouping number ("3n+2", "5n+3", etc.). In Heydon’s example, however there is no grouping, so that logic doesn’t really apply. Instead you can think of it as simply adding the multiplier to 6: 0+6 (6), 1+6 (7), 2+6 (8), etc.

Now count from the end and then select that and everything that follows and you get a "more than or equal to" count based on the number (6 in his case, but again you can swap it out). Brilliant!

The final example he gives is for fewer than or equal to a particular number:

```css
li:nth-last-child(-n + 6):first-child,
li:nth-last-child(-n + 6):first-child ~ li {
  /* properties here */
}
```

This one is largely the same as the "more than" example, but the multiplier is reversed (with the minus sign) which means the count runs backward: 0+6 (6), -1+5 (5), -2+6 (4), and so on.

I am just overjoyed with how brilliant this is. I can think of so many places to use it (and will likely be doing so quite soon).

## Bonus: Now with SASS

[Daniel Guillan](https://twitter.com/danielguillan) has [ported this functionality (and more) to SASS](https://github.com/danielguillan/quantity-queries) using a handful of really straightforward mixins. Here’s a demo:

<figure id="fig-2015-03-20-01" class="media-container">
  {% CodePen "https://codepen.io/danielguillan/pen/GgBOxm", "result", "331" %}
</figure>

Happy counting!
