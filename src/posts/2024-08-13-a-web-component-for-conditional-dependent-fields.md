---
title: "A Web Component for Conditional Dependent Fields"
date: 2024-08-13 20:26:03 -07:00
comments: true
tags: ["forms", "HTML", "JavaScript", "progressive enhancement", "web components", "web forms"]
description: "Sometimes you need to require a value in one form field only if another field is filled in or if that field has a specific value. I ported an old jQuery plugin of mine that made this work to a web component you can use easily right now."
twitter_text: "Sometimes you need to require a form field only if another field is filled in or has a specific value. Here’s a web component to enable that."
series:
  name: "Modern Web Form Best Practices"
  tag: "series-forms"
  ordinal: "6"
---

A few weeks back I released [a web component to enable you to add requirement rules to checkbox groups](https://www.aaron-gustafson.com/notebook/requirement-rules-for-checkboxes/). Continuing in the form utility space, I’ve created a new web component that allows you to make fields required based on the values of other fields: `form-required-if`.

<!-- more -->

The `form-required-if` web component, which is based on [a jQuery plugin I’d written in 2012](https://github.com/easy-designs/jquery.easy-dependent-required-fields.js), looks like this:

```html
<form-required-if
  conditions="email=*"
  >
  <label>Required if there’s an email value
    <input name="depends-on-email">
  </label>
</form-required-if>
```

You wrap any field (and its `label`) in the component and then declare the conditions under which it should be required in the `conditions` attribute.

## Defining the requirement conditions

Each condition is a key/value pair where the key aligns to the `name` of the field you need to observe and the value is the value that could trigger the dependency. If any value should trigger the dependency, you use an asterisk (*) as the value. In the example above, the field will become required when any value is assigned to the field matching `[name="email"]`.

This `conditions` attribute can be populated with as many or as few dependencies as make sense for your use case. Multiple conditions are separated by double vertical pipes (`||` a.k.a. _or_) as in this example:

```html
<form-required-if 
  conditions="email=*||test=3"
  >
  <label>Depends on email or test field
    <input name="depends-on-email-or-test">
  </label>
</form-required-if>
```

Here the field depends on one of the following conditions being true:

1. the field matching `[name="email"]` has a value, _or_
2. the field matching `[name="test"]` has a value of "3"

If the field you reference doesn’t exist, no errors will be thrown, it will just quietly exit.

## Visually indicating a field is required

If you typically use an asterisk or similar to indicate a field is required, this web component can support that through one or both of the following attributes:

* `indicator` -  This attribute is where you define the indicator itself. It could be something as simple as a string (e.g., *), or even full-blown HTML.
* `indicator-placement` - As you can probably guess, this attribute is used to set the position of the indicator. If you want it at the start of the label text, you give it the value "before." If you want it after the text, you use "after" or don’t use the attribute at all. Indicators will be placed after the label text by default.

Here’s an example with a custom indicator that is HTML:

```html
<form-required-if
  conditions="email=*"
  indicator="<b>*</b>"
  >
  <label>Depends on email
    <input name="dep2">
  </label>
</form-required-if>
```

If you don’t include markup in your indicator, it will be automatically wrapped in `span` when injected into the DOM. The `hidden` and `aria-hidden` attributes are used to toggle its visibility, relative to the requirement state of the field.

## Demo

I put together a relatively simple demo of the web component over on GitHub:

<figure class="video-embed video-embed--4x3">
<iframe src="https://aarongustafson.github.io/form-required-if/demo.html" class="talk__slides__embed video-embed__video" frameborder="0"></iframe>
</figure>

## Grab It

You can view the entire project (and suggest enhancements) over on [the `form-required-if` component’s Github repo](https://github.com/aarongustafson/form-required-if).