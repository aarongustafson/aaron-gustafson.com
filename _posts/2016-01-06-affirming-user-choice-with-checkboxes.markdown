---
layout: post
title: "Affirming User Choice with Checkboxes"
date: 2016-01-06 14:24:31 -0500
comments: true
tags: [forms, "web design", accessibility]
description: "“Checkbox” form controls have long been a part of software, enabling users to provide a simple binary response—yes or no. Here are some best practices for using them on the Web."
crosspost_to_medium: true
series:
  name: "Modern Web Form Best Practices"
  tag: web-forms
  ordinal: second
---

“Checkbox” form controls have long been a part of software. They enable users to provide a simple binary response—yes or no. On the Web, we often see them in two scenarios: confirmations and multiple choice.

<!-- more -->

## Confirmation Checkboxes

Standalone checkboxes are often employed to enable users to affirm a statement, as in [this example](#fig-2016-01-06-01) from [the American Express login form](https://online.americanexpress.com/myca/logon/us/action/LogonHandler?request_type=LogonHandler&Face=en_US#lilo_loginForm) where a customer can indicate they’d like the site to remember them.

<figure id="fig-2016-01-06-01" class="media-container">{% adaptive_image /i/posts/2016-01-06/01.png %}<figcaption>American Express’ login form offers users the option of being remembered. As that is a binary choice (e.g. yes or no), the checkbox makes sense.</figcaption></figure>

Here’s a simplification of the markup they’re using:

{% gist d281f889a11634b45280 american-express-login-simplified.html %}

This works really well, though I generally prefer to [combine explicit and implicit labeling](https://www.aaron-gustafson.com/notebook/labeled-with-love/#an-alternate-approach) to simplify my CSS selectors and broaden their applicability. Here’s how I would rewrite this control:

{% gist d281f889a11634b45280 american-express-login-reimagined.html %}

Regardless of the markup pattern itself, it’s important to note the explicit association of the form control and the `label` element (using the `for` attribute). You’ll also notice the input has a straightforward `name` value which will be submitted to the back end if the user ticks the box.

It’s worth noting that some back-end systems may require a value be submitted for the given variable name (in this case, "REMEMBERME") regardless of whether the user has ticked the checkbox. If that’s a requirement, you can alter the pattern to use a hidden `input` as well:

{% gist d281f889a11634b45280 american-express-login-with-hidden.html %}

The source order matters because with matching `name` values, the final submittable `value` will always be the one the back-end receives. With this setup, the `value` of "no" (from the hidden `input`) will be submitted by default. If the checkbox is ticked, its `value` is submitted instead, setting REMEMBERME to "yes".

## Multiple Choice Checkboxes

The other way we often see checkboxes used is to enable users to choose zero or more items from a collection of options. Consider [this example](#fig-2016-01-06-02) from [the Chattanooga Open Device Lab’s reservation form](http://chadevicelab.org/book-time). It allows users to choose the devices they’d like to include in their test matrix:

<figure id="fig-2016-01-06-02" class="media-container">{% adaptive_image /i/posts/2016-01-06/02.png %}<figcaption>In this excerpt from the reservation form on the Chattanooga Open Device Lab website, users can choose to include gaming system options.</figcaption></figure>

The markup they employ is pretty well-organized and straightforward: it’s a list of checkbox options.

{% gist d281f889a11634b45280 chaodl-checkbox-list.html %}

As this is an instance where a user could choose more than one option, the back end needs to be able to capture that information in what’s called an "array". An array, if you’re unfamiliar, is a collection of values. You’ll notice that the `name` given to each of these checkbox `input` elements is the same: "reservation_requested_device[]". The square brackets ("[]") at the end of the `name` are the magic bit that allows the values of *each* chosen "reservation_requested_device" checkbox to be submitted as the value of "reservation_requested_device".

## Applicable Attributes

Checkbox controls only use a subset of the typical `input` attributes. In particular, you’ll need to include

* `name` - This is the variable name you want to hold the user’s response. As mentioned in [the previous section](#multiple-choice-checkboxes), appending "[]" to the variable name will allow the variable to hold all of the user’s choices as opposed to only the final one.
* `value` - This is the value that should be captured if the user ticks the checkbox.
* `id` - The unique identifier you’re using for the control in order to explicitly associate it with a `label`.

There are a few optional attributes you might consider including as well.

* `checked` - Use this null attribute if you want the default state of the checkbox to be ticked. This attribute should be used with caution. **Don’t** use this attribute to automatically check confirmation boxes for things like mailing list opt-ins. **Do** use this attribute when you are displaying sensible default settings or displaying confirmations the user has already made (e.g. in the user’s profile or when re-displaying the form when it has a submission error).
* `required` - Use this to indicate the checkbox must be ticked for the form to be valid. It’s important to note that this attribute is typically only useful in confirmation checkbox scenarios. If you need a user to choose at least one from a multiple choice checkbox collection, it’s useless unless you need them to pick a specific one. To require one (or more) of a multiple choice checkbox group, you currently need to use JavaScript, like [the one the Chattanooga Open Device Lab uses](https://github.com/easy-designs/easy-checkbox-required.js).

## Checkbox vs. Other Controls

Checkboxes excel at allowing users to indicate preference from a pre-defined set of options. But there are other form control types that allow for similar control over user responses. That can make it difficult to decide which element to use.

### Dropdown List (`select`)

The `select` element is another tried and true option for allowing users to indicate preference. A simple two-choice `select` could achieve the same goal as a confirmation checkbox, but it’s a little clunkier. In terms of user interface, `select` elements require more clicks of your users. They also obscure the complete list of choices from view because only one options is displayed at a time. Their appearance makes them more compact, but can make it difficult to get a complete picture of what choices are available when you can’t see them all.

You can enable multiple choice in a  `select` element by adding the `multiple` attribute to it, but depending on the number of `option` elements, it could also be a little unwieldy. Depending on the size of the `select` and the number of options, you could also create an inner scroll that could be awkward on certain touch-based devices.

The `select` element has its place, but should be used sparingly. I’ll go in-depth with `select` elements in a future post.

### Choose One (`input[type=radio]`)

For simple confirmation questions, it’s completely valid to use a radio form control in lieu of a single checkbox. In fact, in some cases, it may offer a more explicit choice for your users. Consider [this example](#fig-2016-01-06-03) from [Subway’s online ordering tool](https://order.subway.com).

<figure id="fig-2016-01-06-03" class="media-container">{% adaptive_image /i/posts/2016-01-06/03.png %}<figcaption>In this excerpt from Subway’s online ordering tool, they use a checkbox to confirm the user wants their sandwich toasted.</figcaption></figure>

A checkbox labelled "Fresh Toasted", isn’t terribly clear. A better approach would be to ask something like “Would you like your sandwich toasted?” with radio controls for “yes” and “no”. Alternately, if they absolutely wanted to keep it as a checkbox, they could use a better label: “Please toast my sandwich”.

<figure id="fig-2016-01-06-04" class="media-container">{% adaptive_image /i/posts/2016-01-06/04.png %}<figcaption>An alternate approach to the Subway interface, using radio controls.</figcaption></figure>

Radio controls have their place, but are not often a one-to-one replacement for checkboxes. I will discuss radio controls in greater depth in another post.

## Check ’Em Out

Checkboxes are an invaluable tool in the form building tool chest. Understanding their purpose and capabilities is key to using them properly and ensuring your forms are usable to the broadest number of users.
