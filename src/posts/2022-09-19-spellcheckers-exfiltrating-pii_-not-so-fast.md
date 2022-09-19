---
title: "Spellcheckers exfiltrating PII… not so fast"
date: 2022-09-19 14:34:51 -07:00
comments: true
tags: ["browsers", "forms", "HTML", "security"]
description: "A recent post from the Otto JS research team highlighted how spellcheck services can inadvertently exfiltrate sensitive user data, including passwords, from your site. To be honest, I found the post a tad alarmist and lacking when it came to recommending solid protections. Consider this your no-nonsense guide to protecting your users’ sensitive information."
twitter_text: "A collection of ways you can keep sensitive user data protected from accidental exfiltration."
in_reply_to: https://www.otto-js.com/news/article/chrome-and-edge-enhanced-spellcheck-features-expose-pii-even-your-passwords
series:
  name: "Modern Web Form Best Practices"
  tag: "series-forms"
  ordinal: "fourth"
---

A recent post from the [Otto JS](https://www.otto-js.com) research team highlighted [how spellcheck services can inadvertently exfiltrate sensitive user data, including passwords](https://www.otto-js.com/news/article/chrome-and-edge-enhanced-spellcheck-features-expose-pii-even-your-passwords), from your site. To be honest, I found the post a tad alarmist and lacking when it came to recommending solid protections. Consider this your no-nonsense guide to protecting your users’ sensitive information.

<!-- more -->

## Background

In their research, the Otto JS team found that Chrome and Edge each use their own web services to drive their spellchecking services. In Chrome’s case it seems to only be with their "advanced spellcheck" feature turned on. I was able to validate this behavior using Charles on macOS Monterey using the latest Chrome Stable and the latest Edge Canary. I did not see the same exfiltration happen with Safari or Firefox. I created [a CodePen form with several fields to test different permutations of form field attributes and behaviors](https://codepen.io/aarongustafson/pen/gOzWNgM). What I am sharing, below, is a result of that testing.

## What gets sent?

In both Chrome and Edge, the information sent to their services is the text value itself, disconnected from any specific field name. Chrome also sends the user’s language, and country. Edge, which uses the Microsoft Editor service under the hood, also sends a bunch of licensing details and the user’s language.

## Password fields are safe

```html
<input type="password" id="password" name="password">
```

Browsers do a lot to protect the contents of password fields already, so I wasn’t surprised to see that the contents of password fields are **not** passed to a spellcheck service.

If you are not using a true password field, however, the contents of that field are not protected in the same way. If you build a custom password control, you’re on the hook to replicate the entirety of the browser’s feature set when it comes to protecting user data. Unless you’re a glutton for punishment, you should probably just use the built-in password field instead.

## Fields marked readonly and disabled are not exposed

As you’d hope, neither read-only fields nor disabled fields are exposed ot the service. This even holds true when you change the values of these fields programmatically or via DevTools.

I should note, however, that `readonly` fields *are* send to the server when the form is submitted and their contents are editable via JavaScript and DevTools, so you should always assume `readonly` fields are informational for the user only and never trust their contents on the server side. Fields that are marked `disabled`, in contrast, are never sent to the server.

## You can protect interactive fields with `spellcheck="false"`

```html
<input id="no-spellcheck" name="no-spellcheck" spellcheck="false">
```

The `spellcheck` attribute can be applied to any element and setting it to "false" instructs browsers to turn off spellchecking services for its contents. The post from Otto JS showed this being used globally on the `body` element, but that is overkill. It would be better to use the attribute on specific fields you want to protect, as shown above.

## Don‘t forget about password controls that support show/hide

Edge has a neat feature in its password field implementation where it enables a user to toggle the visibility of the password within the control itself. When users show their password using that built-in functionality, no content is shared with the spellchecker. Not all browsers have this feature, however, which has led to JavaScript-based implementations that simply swap the "password" `type` value for "text" to show the contents and then swap it back again to hide the contents. Here’s a quick & dirty example of what the toggle button’s event handler might look like:

```js
function togglePassword(e) {
  var $btn = e.target,
      $field = $btn.parentNode.querySelector("input"),
      state = $field.type;
  if ( $btn && $field ) {
    if ( state == "password" ) {
      $field.type = "text";
      $btn.innerText = "Hide";
    } else {
      $field.type = "password";
      $btn.innerText = "Show";
    }
    e.preventDefault();
    e.stopPropagation();
  }
}
```

The problem with this approach, when it comes to the spellchecker, is that the text field is considered fair game for checking. Its contents aren’t sent right away, but if the field receives focus or its value is changed in any way while in the "text" state, its contents are sent to the spellcheck service.

Protecting the field’s contents are fairly easy, however: turn off the spellchecker for that field, even in its "password" state.

```html
<input type="password" id="password-show-nospellcheck" name="password-show-nospellcheck" spellcheck="false">
```

With `spellcheck="false"` in place, you can turn the field into a text field safely, without the contents being exposed to the spellcheck service.

<hr>

HTML is a pretty powerful language and, when wielded properly, can be an excellent tool for protecting user data, provided we use it properly. And know that you know how to protect your users’ sensitive data, minimize this tab and start filing those pull requests…
