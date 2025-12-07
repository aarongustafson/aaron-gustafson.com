---
title: "Requirement Rules for Checkboxes"
date: 2024-07-05 14:08:34 -07:00
last_updated_at: 2025-12-06 10:00:00 -07:00
comments: true
tags: ["accessibility", "forms", "HTML", "JavaScript", "progressive enhancement", "web components", "web forms"]
description: "Currently, we can only make checkboxes required or not, individually. In some cases you need to be able to set a specific number of checkboxes that need to be checked. My `form-required-checkboxes` web component enables that."
twitter_text: "Currently, we can only make checkboxes required or not, individually. In some cases you need to be able to set a specific number of checkboxes that need to be checked. My `form-required-checkboxes` web component enables that."
series:
  name: "Modern Web Form Best Practices"
  tag: "series-forms"
  ordinal: "5"
---

HTML checkboxes debuted as [part of HTML 2.0 in 1995](https://datatracker.ietf.org/doc/html/rfc1866#section-8.1.2.3). Our ability to mark an individual checkbox as being required became part of the HTML5 spec that published in 2014. A decade later, we can still only make checkboxes required on a case-by-case basis. To overcome this limitation, I had created [a jQuery plugin that allowed me to indicate that a user should choose a specific number of items from within a checkbox group](https://github.com/easy-designs/easy-checkbox-required.js). Yesterday I turned that plugin into a web component: [`form-required-checkboxes`](https://github.com/aarongustafson/form-required-checkboxes).

<!-- more -->

## Markup Assumptions

Before I tuck into the details, I’ll start by saying that the web component begins with the assumption that you are following best practices with respect to form markup:

* Your checkbox group should be in a `fieldset` with a `legend`
* All of the checkbox elements must have the same `name` (e.g., "foo[]").

In other words, they should look something like this:

```html
<fieldset>
  <legend>Group 1 label</legend>
	<ul>
		<li><label>
      <input type="checkbox" name="foo[]" value="1">
      First item
    </label></li>
		<li><label>
		  <input type="checkbox" name="foo[]" value="2">
		  Second item
	  </label></li>
		<!-- options continue -->
	</ul>
</fieldset>
```

To use the web component, you wrap the group in a `form-required-checkboxes` element and then include the JavaScript to initialize it.

```html
<form-required-checkboxes>
  <fieldset>
    <legend>Group 1 label</legend>
	  <!-- etc. -->
  </fieldset>
</form-required-checkboxes>

<!-- at the end of your document -->
<script src="/js/web-components/form-required-checkboxes.js" async></script>
```

If you’re following right along, there’s an error waiting for you in the `console` — we need to set the requirement rules.

## The API

The `form-required-checkboxes` element requires at least one attribute to function, but using some of the others you can more fully customize the experience for users:

* `required` - Represents the range of required values. You can set this up in one of three ways depending on your needs:
  * Single number (e.g., 3) requires exactly that number of choices.
  * Range (e.g., 3-5) requires a minimum of the first number and a max of the second number be chosen.
  * Max (e.g., 0-3) requires a minimum of zero and a max of the second number to be chosen.
* `notice` (optional) - This is a string description that explains details of the required value in plain language. If you don't supply one, the component will create one for you based on the current language (if supported). This description will be added as a `small` element within the component (as a sibling to the `fieldset`).
* `error` (optional) - This is a string validation error you'd like to be shown when the validation criteria is not met. If not provided, an appropriate error message will be generated based on the current language (if supported).
* `lang` (optional) - Language code for localized messages (e.g., “en,” “es,” “fr,” “de”). Falls back to the nearest ancestor’s `lang` attribute or the document language.

## Localization

The component now includes built-in translations for 16 languages: English, Chinese (Mandarin), Hindi, Spanish, French, Arabic, Bengali, Portuguese, Russian, Japanese, German, Punjabi, Javanese, Korean, Vietnamese, and Italian. Messages are automatically generated based on the `lang` attribute.

You can use it like this:

```html
<form-required-checkboxes required="3" lang="es">
  <fieldset>
    <legend>Opciones</legend>
    <!-- Will display: "Elija 3 de la lista" -->
  </fieldset>
</form-required-checkboxes>
```

The component automatically detects the language from the `lang` attribute on the element itself, the nearest ancestor element, or the document's `lang` attribute, falling back to English if none is found.

You can also register custom translations or override existing ones using the `FormRequiredCheckboxesElement.registerTranslations()` static method. Regional language codes (e.g., `en-US`, `es-MX`) automatically fall back to their base language.

## Demo

I put together a relatively simple demo of the web component over on GitHub:

<figure class="video-embed video-embed--4x3">
<iframe src="https://aarongustafson.github.io/form-required-checkboxes/demo/" class="talk__slides__embed video-embed__video" frameborder="0"></iframe>
</figure>

## Grab It

You can view the entire project (and suggest enhancements) over on [the component’s Github repo](https://github.com/aarongustafson/form-required-checkboxes).
