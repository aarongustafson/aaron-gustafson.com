---
title: "Bring Focus to the First Form Field with an Error"
date: 2022-08-22 14:16:02 -07:00
comments: true
tags: ["accessibility", "forms", "HTML", "inclusive design", "JavaScript", "progressive enhancement", "WAI-ARIA", "web design"]
description: "While filling out a long form the other day, I couldn’t figure out why it wasn’t submitting. Turns out I’d forgotten to fill in a field, but I didn’t know that because it had scrolled out of the viewport."
twitter_text: "When highlighting form errors, moving focus to the first error encountered will ensure the error is seen and remedied."
hero:
  src: /i/posts/2022-08-22/hero.jpg
  credit: Aaron Gustafson × DALL·E
  alt: "In a green field filled with only yellow flowers, a cute robot has found a single red flower, digital art"
  url: https://labs.openai.com/s/VE3r9ViDjS0aBzK6NDrGYrru
  offset: "100"
series:
  name: "Modern Web Form Best Practices"
  tag: "series-forms"
  ordinal: "third"
crossposted:
  Codementor: https://www.codementor.io/@aarongustafson/bring-focus-to-the-first-form-field-with-an-error-23ckq7nj58/
---

While filling out a long form the other day, I couldn’t figure out why it wasn’t submitting. Turns out I’d forgotten to fill in a field, but I didn’t know that because it had scrolled out of the viewport. This is a common problem on the web, but easily remedied with a little bit of JavaScript.

<!-- more -->

## Step 1: Make the Most of Your Markup

Whenever you’re building a form, you should use every tool in your toolbox for building that form properly. That means:

1. [Associate labels with their fields](/notebook/labeled-with-love/)
1. Use specialized `input` types (e.g., email, URL) as appropriate
1. Identify required fields with `required` and `aria-required`
1. If you’re expecting a field to match a particular format, note that with `pattern` and provide an example with `placeholder`
1. Additional information about a field should be bound to it using `aria-describedby`

By following these steps, you’re likely already in a good place when it comes to your form’s UX and accessibility. Browsers will pay attention to the instructions in the markup, validate the user’s input, and even provide guidance on how to correct issues without you having to lift a finger. They’ll even focus the first invalid field on your behalf!

But what if you want to customize the experience?

## Step 2: Enhanced Browser Validation

When you use proper markup for your forms, enhancing them with JavaScript becomes straightforward, thanks to the [Constraint Validation API](https://developer.mozilla.org/docs/Web/API/Constraint_validation). Consider the following form field:

```html
<input id="name"
       name="name"
       required
       aria-required="true"
       >
```

Using JavaScript, we can check to see it’s validity at any point:

```js
document.getElementById("name").validity.valid;
// Is either true or false
```

There are also a host of other properties on the field’s `validity` property that provide even more detail as to the state of the field’s validity (hence the name: [`ValidityState`](https://developer.mozilla.org/docs/Web/API/ValidityState)). In the case of the field above, if `valueMissing` is `true` (relating back to that `required` attribute), `valid` is `false`.

Armed with that knowledge, you could use another feature of the [Constraint Validation API](https://developer.mozilla.org/docs/Web/API/Constraint_validation) to show a custom error message in the browser UI:

```js
var input = document.getElementById("name");
if ( ! input.validity.valid ){
  input.setCustomValidity("Please enter your name");
  input.reportValidity();
}
```

The thing is, you don’t really want to litter your JavaScript with strings like that. It’s not maintainable. Thankfully, we can leverage markup to achieve the same goal:

```html
<input id="name"
       name="name"
       required
       aria-required="true"
       data-error-required="Please enter your name"
       >
```

The `input` in this example has a [data attribute](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes) containing the error string (`data-error-required`). We can create whatever data attributes we want and access them using that element’s `dataset` property. It’s worth noting that hyphenated property names become camelCase when accessed as a named property of `dataset`.

```js
var input = document.getElementById("name");
if ( ! input.validity.valid ){
  input.setCustomValidity(input.dataset.errorRequired);
  input.reportValidity();
}
```

With that, we get the same result with far looser coupling between individual fields and the JavaScript handling validation.

<figure id="fig-2022-08-22-01" class="media-container">

![This custom validation string as rendered in the error tooltip in Safari 15.6]({{ site.url }}/i/posts/2022-08-22/01.jpg)

</figure>

You can even extend the approach to handle different kinds of errors:

```html
<input type="email"
       id="email"
       name="email"
       required
       aria-required="true"
       data-error-required="Please enter your email"
       data-error-invalid="Your email doesn’t look right"
       >
```

Here I’m using two different data attributes to apply in different error scenarios and the one I show will depend on the type of error a user has encountered. Pretty cool!

And since we’re still operating in the context of the browser’s built-in validation experience, users will still get directed to the first field with an error when they submit the form.

But what if you want to bypass the built-in experience and go full custom?

## Step 3: Going Rogue

The built-in browser validation UI is pretty great, but maybe it’s not your cup of tea. Thankfully, it’s pretty easy to take the training wheels off. You just add a `novalidate` attribute to the `form` element. But before you go dropping that attribute in your markup, consider that your custom validation code will all be JavaScript and if that fails to run—[yes, it happens](/notebook/progressive-misconceptions/)—the browser won’t step in and fill the void. So instead of putting it in your markup, inject it into the `form` when you know absolutely all of the JavaScript code necessary to run your custom validation experience is loaded and ready to rock. In fact, it should be the last line of code to execute:

```js
// Validation Logic Definition
// including validateMe() function

document.querySelectorAll("form")
        .forEach(function($form){
          $form.addEventListener('submit', validateMe, false);
          $form.setAttribute('novalidate','');
        });
```

With that in place, we can turn our attention to handling the validation setup. 

For simplicity, and based on personal preference, I am going to start with setting up my form to validate when the form is submitted rather than whenever an individual field is changed (hence the "submit" event listener). When the event is fired, the event handler will loop through the fields in the form and validate each one. For the sake of the widest possible browser compatibility, I’m foregoing fat arrow functions and other ES2015 goodies and rockin’ this old school.

```js
function validateMe( e ) {
  var $form = e.target,
      i = 0,
      field_count = $form.elements.length,
      $first_error = false;
  
  for ( i; i< field_count; i++) {
    var $field = $form.elements[i],
        valid = isValid($field);
    if ( !$first_error && !valid ) {
      $first_error = $field;
    }
  }

  if ( $first_error ){
    e.preventDefault();
    $first_error.focus();    
  }
}
```

First, I get a reference to the form that needs to be validated, then I set up the loop for each of the fields. I also set up a reference to the first field with an error—that is the point of the article after all—as <var>$first_error</var> and set it to `false`.

Within the loop, I grab a reference to the field and pipe it into another function that will do the actual validation (`isValid()`). That function will return `true` if the field is valid and `false` if it isn’t. The last bit of the loop checks to see if <var>$first_error</var> has been set already and, if it hasn’t, sets it to the current field if it isn’t valid.

Finally, I check to see if <var>$first_error</var> is set (i.e., true) and if it is, the form has an issue, so I prevent the default behavior of the submit event (using `preventDefault()`) and focus the field captured in <var>$first_error</var>.

## Addendum: Associating Custom Error Messages

I don’t want to get too into the weeds with my `isValid()` method, as you can see the end result at the bottom of this post, but I do want to take a moment to describe how you should be handling inline field errors.

First off, you will need to add `aria-invalid="true"` to any fields that have an error. Secondly, you will want to inject the error message into the markup, give its container an `id`, and [associate it with the field using `aria-errormessage`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Attributes/aria-errormessage). So when your JavaScript is done with it, your field will look something like this:

```html
<label for="name">What’s Your Name?</label>
<input id="name"
       name="name"
       required
       aria-required="true"
       data-error-required="Please enter your name"
       aria-errormessage="name-validation-error"
       aria-invalid="true"
       >
<strong class="form-validation-error"
        id="name-validation-error"
        >Please enter your name</strong>
```

It’s also worth noting that you’ll want to reset and re-validate the form field once the user has changed the contents of the field (and hopefully remediated the error). Resetting the field will involve removing the `aria-invalid` attribute and doing one of two things with the error message: either remove it from the markup entirely or simply hide it (e.g., `display: none`). Once the `aria-invalid` state is reset, it doesn’t matter that there is an existing `aria-errormessage` attribute. That said, I generally prefer to totally reset the field entirely, removing both attributes and the validation error element as well.

Here you can see [a complete working prototype of this approach](https://codepen.io/aarongustafson/pen/eYMXMPP):

{% CodePen "https://codepen.io/aarongustafson/pen/eYMXMPP", "result", "400" %}

Hopefully this helps you with the development of your own forms. Good luck!
