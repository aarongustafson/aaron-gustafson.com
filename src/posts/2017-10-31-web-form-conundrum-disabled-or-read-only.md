---
title: "Web Form Conundrum: `disabled` or `readonly`?"
date: 2017-10-31 12:07:39 -04:00
comments: true
tags: [forms, "web design 101", HTML, "user experience"]
description: "It’s hard to know which is the right way to go, especially when presented with a choice between two seemingly similar options for disallowing a field to be edited."
---

Web forms are complex beasts. There are a lot of field types to remember, each with dozens of attributes. It’s hard to know which is the right way to go, especially when presented with a choice between two seemingly similar options for disallowing a field to be edited: `disabled` and `readonly`.

TL;DR: If you really need it, which you probably don’t, `readonly` is what you want.

<!-- more -->

## The Use Case

There are times when you want to expose a bit of data to the user but don’t want them to be able to edit it. For example, your system might not allow a user to edit their username after completing the registration process. In situations like this, you may want to present the username in the context of a profile editing interface without allowing them to edit it.

The best choice in that situation would be to avoid using a form field to display the username, full stop, but if you’re hamstrung and need to drop it in an `input` field, you want to make sure the user can’t edit it. That’s when you need to make a choice between `disabled` and `readonly`.

Both of these attributes are "empty" attributes, meaning they don’t require value assignment:

```html
<label for="username-1">Disabled Username</label>
<input id="username-1" name="username-1" disabled value="AaronGustafson">
                                                                        
<label for="username-2">Readonly Username</label>
<input id="username-2" name="username-2" readonly value="AaronGustafson">
```

As expected, both also prohibit editing directly in the browser. 

## The Key Difference

So why do we have two attributes that do the same thing? Unfortunately this is where developers often get confused: the user experience is the same, but the mechanics are quite different.

Fields marked as `readonly` are collected along with all of the normal field values in a form submission (["successful controls" in the spec](https://www.w3.org/TR/html401/interact/forms.html#h-17.13.2)). The only difference between a `readonly` field and a regular field is the user experience.

Fields marked as `disabled` are ignored when collecting values from the form. In a traditional form submission, the action page would never receive values for a `disabled` field, regardless of whether it has a `name` attribute. In JavaScript, this is a little trickier as generic DOM access via a form’s `elements` collection includes all form controls, including `disabled` fields (and buttons, `output` elements, etc.). In order to ensure consistency with the spec, it is incumbent upon the JavaScript developer to keep an eye out for `disabled` fields so they can throw away their values before processing the form. 


<figure id="fig-2017-10-31-01" class="media-container">
  {% CodePen "https://codepen.io/aarongustafson/pen/jaPYLr", "result", "250" %}
</figure>

Thankfully, most library code I’ve found does this, so it’s not much of an issue if you are working with [jQuery’s `serialize()` method](https://api.jquery.com/serialize/) or even [the `form-serialize` module for Node](https://www.npmjs.com/package/form-serialize) (and React, etc.). Confusingly, the Node module enables developers to treat `disabled` fields as though they are `readonly`. Luckily, that’s not the default behavior.

## Don’t Assume

In many of my forms-related talks, I’ve discussed the need for server side validation of info sent from the browser. Even if you have the most robust client-side validation logic in the world, that JavaScript (and your HTML, etc.) is all easily manipulated via common developer tools. If you don’t have equally robust checks running on the server side (be it via an API or simply a form-posting endpoint), you’re opening your system up for abuse.

It’s inconsequential to inspect a form field in the browser, remove the `readonly` or `disabled` attribute, and submit the form with a change to that field. If you, as the developer, truly don’t want the value of a particular key touched, don’t provide it in a field to begin with. Additionally, don’t accept any values submitted for it. You don’t need to throw an error to the user since it’s an improper use of the system, but you might consider logging it in case you see continued abuse by that user.

## I Have Forms to Build, Which Do I Choose?

**I want to display data as information, but don’t want a user to update it.**

Don’t use a form field at all, display it as text.

**I want the data included with the form submission.**

Ideally, display the info as text (see above) and mix it into the form submission data on the server side. If that’s not possible, make it a `readonly` field an ensure there’s a validation check on the server side.

**I do not want the data included in the form submission.**

Display the info as text (see above).