---
title: "Responsive Tables"
date: 2013-02-02 17:32:27
comments: true
tags:
  - "responsive web design"
  - "HTML"
  - "accessibility"
description: "A few smart folks have already put together their thoughts on responsive tables and, while I think the proposed methods are pretty good, I think there might be room for improvement. As such, I’ve been tinkering for a while and came up..."
canonical: "https://blog.easy-designs.net/archives/responsive-tables/"
atUri: "at://did:plc:6rmgrvblxflqh34omwywu6ib/site.standard.document/3mxrnwogfss2w"
image: "/i/share-cards/responsive-tables.jpg"
meta_description: "A few thoughts on “Responsive Tables”"
social_description: "A few smart folks have already put together their thoughts on responsive tables and, while I think the proposed methods are pretty good, I think there might be room for improvement."
---

A few smart folks have already put together their thoughts on responsive tables and, while I think the proposed methods are pretty good, I think there might be room for improvement. As such, I’ve been tinkering for a while and came up with the following strategy when it comes to tables.

<!-- more -->

**Step 1:** Use `data-*`{.html} attributes to hold information about the column header(s) associated with the markup:

```html
  <table>
   <thead>
   <tr>
   <th scope="col">Name</th>
   <th scope="col">Email</th>
   <th scope="col">Dept, Title</th>
   <th scope="col">Phone</th>
   </tr>
   </thead>
   <tbody>
   <tr class="vcard">
   <th scope="row" class="n" data-title="Name">
   <b class="family-name">Smith</b>,
   <b class="given-name">Laura</b>
   </th>
   <td data-title="Email">
   <a class="email" href="mailto:laura.smith@domain.com">laura.smith@domain.com</a>
   </td>
   <td data-title="Dept, Title">Biology, Director</td>
   <td class="tel" data-title="Phone">
   <a href="tel:+1123456789">123-456-789</a>
   </td>
   </tr>
   <tr class="vcard">
   <th scope="row" class="n" data-title="Name">
   <b class="family-name">Johnson</b>,
   <b class="given-name">Ron</b>
   </th>
   <td data-title="Email">
   <a class="email" href="mailto:ron.johnson@domain.com">ron.johnson@domain.com</a>
   </td>
   <td data-title="Dept, Title">Purchasing, Director</td>
   <td class="tel" data-title="Phone">
   <a href="tel:+11234567891">123-456-7891</a>
   </td>
   </tr>
   </tbody>
  </table>
```

**Step 2:** When the screen is below a certain threshold, set the `<table>`{.html} elements to `display: block`{.html} (thereby linearizing the table), hide the `<thead>`{.html} where assistive tech won’t see it, and use generated content to expose the `data-*`{.html} attributes. Here’s a snippet of Sass & Compass that does that:

```scss
  // undo tables for small screens
  // $break-4 is the px-width break at which you want to cut it off
  @media (max-width: px-to-ems($break-4 - 1px)) {
   
   // make each table separate from other ones
   table {
  
   border: 0;
   @include trailing-border;
   padding-bottom: 0;
   display: block;
   width: 100%;
   
   // make sure captions are displayed
   caption {
   display: block;
      }
   
   /* 
       * wipe the thead from the face of the earth
       * modern screen readers will expose the 
       * generated content
   */
   thead {
   display: none;
   visibility: hidden;
      }
   
   /*
       * make everything display block so it 
       * aligns vertically
   */
   tbody, tr, th, td {
   border: 0;
   display: block;
   padding: 0;
   text-align: left;
   white-space: normal;
      }
   
   // give each row a little space
   tr {
   @include trailer;
      }
   
   /* Labeling
       * adding a data-title attribute to the cells
       * lets us add text before the content to provide
       * the missing context
       * 
       * Markup: 
       *   <td data-title="Column Header">Content Here</td>
       * 
       * Display:
       *   Column Header: Content Here
   */
   th[data-title]:before,
   td[data-title]:before {
   content: attr(data-title) ":\00A0";
   font-weight: bold;
      }
   th:not([data-title]) {
   font-weight: bold;
      }
   
   // hide empty cells
   td:empty {
   display: none;
      }
    }
  }
```

We’ve been using this approach on a number of sites currently in development and it works really well. I put together [a demo of this technique](http://codepen.io/aarongustafson/pen/ucJGv) so you could play around with it yourself.

**Notes:**

1. I chose to use a `data-*`{.html} attribute (`data-title`{.html}) instead of `title`{.html} as the `title`{.html} attribute could be read out by assistive technology and in the case of the `<thead>`{.html} being available as well (when not `display: none`{.html}), resulting in the information being read twice (which is not ideal). [That’s not a certainty however](http://www.paciellogroup.com/resources/articles/WE05/#slide9), so you could choose to go the `title`{.html} route if that’s your preference. I prefer to avoid the potential issue.
2. If you have multiple header rows over a cell (say a parent row and then a child row), I’d recommend making the `data-title`{.html} something like “Parent Header - Child Header.<span class="final quote">”</span>
3. While you could use JavaScript to auto-generate the `data-title`{.html} attributes by referencing the column headers, I feel this is information that should exist even if JavaScript is not available. You may disagree.
