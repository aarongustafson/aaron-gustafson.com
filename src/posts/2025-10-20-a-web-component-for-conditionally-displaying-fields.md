---
title: "A Web Component for Conditionally Displaying Fields"
date: 2025-10-20 16:05:50 -07:00
comments: true
tags: ["web components", "web forms", "progressive enhancement", "HTML"]
description: "Sometimes you only want a field to show when certain other fields have a (particular) value. The `form-show-if` web component enables that."
twitter_text: "Sometimes you only want a field to show when certain other fields have a (particular) value. The `form-show-if` web component enables that."
---

Building on my recent work in the [form utility space](https://www.aaron-gustafson.com/notebook/series/forms/), I’ve created a new web component that allows you to conditionally display form fields based on the values of other fields: `form-show-if`.

<!-- more -->

This component tackles a common UX pattern that HTML doesn’t natively support. You know the scenario—you have a form where certain fields should only appear when specific conditions are met. Maybe you want to show shipping address fields only when someone checks “Ship to different address,” or display a text input for “Other” when someone selects that option from a dropdown. This web component makes that setup effortless — and declarative.

You set up `form-show-if` like this:

```html
<form-show-if conditions="contact_method=phone">
  <label for="phone">Phone Number
    <input type="tel" id="phone" name="phone">
  </label>
</form-show-if>
```

You wrap any field and its `label` in the component and then declare the conditions under which it should be displayed in the `conditions` attribute.

## Defining the display conditions

Each condition is a key/value pair where the key aligns to the `name` of the field you need to observe and the value is the value that triggers the display. If any value should trigger the display, use an asterisk (`*`) as the value. In the example above, the field will become visible only if — in a theoretical contact method choice — a user chooses “phone” as the method they want used.

The `conditions` attribute can be populated with as many dependencies as you need. Multiple conditions are separated by double vertical pipes (`||`), as in this example:

```html
<form-show-if conditions="contact_method=phone||contact_method=text_message">
  <label for="phone-number">Phone Number
    <input type="tel" id="phone" name="phone">
  </label>
</form-show-if>
```

Here the field depends on one of the following conditions being true:

1. the field matching `[name="contact_method"]` has a value of “phone” _or_
2. the field matching `[name="contact_method"]` has a value of “text_message”

If the field you reference doesn’t exist, no errors will be thrown—it will just quietly exit.

## Customizing the show/hide behavior

By default, the component uses the `hidden` attribute to hide the wrapped content when it’s not needed. But you can customize this behavior using CSS classes instead:

```html
<form-show-if 
  conditions="shipping-method=express"
  disabled-class="fade-out"
  enabled-class="fade-in">
  <label for="delivery-date">Express Delivery Date
    <input type="date" id="delivery-date" name="delivery-date">
  </label>
</form-show-if>
```

When using custom classes:

- **`disabled-class`** is applied when the condition is not met (field should be hidden)
- **`enabled-class`** is applied when the condition is met (field should be shown)

Both are optional. Just remember that if you define a `disabled-class`, the `hidden` attribute will not be used — you will need to accessibly hide the content yourself.

This gives you complete control over the visual presentation. You could use CSS transitions for smooth animations, apply different styling states, or integrate with your existing design system's utility classes.

## Handling form state properly

The component doesn’t just toggle visibility—it also manages the form state correctly. When fields are hidden, they’re automatically disabled using the `disabled` attribute. If there are any sibling fields in the component, they will be disabled as well. This prevents these fields from being submitted with the form and ensures they don’t interfere with form validation.

When conditions are met and fields become visible, they’re re-enabled automatically. This behavior works seamlessly with both native form validation and custom validation scripts.

## Real-world examples

Here are some practical use cases where this component shines:

**“Other” option handling:**

```html
<fieldset>
  <legend>How did you hear about us?</legend>

  <label><input type="radio" name="source" value="google"> Google</label>
  <label><input type="radio" name="source" value="friend"> Friend</label>
  <label><input type="radio" name="source" value="other"> Other</label>
  
  <form-show-if conditions="source=other">
    <label for="source-other">Please specify
      <input type="text" id="source-other" name="source-other">
    </label>
  </form-show-if>
</fieldset>
```

**Specific value matching:**

```html
<form-show-if conditions="email=test@example.com">
  <label for="debug-info">Debug Information
    <textarea id="debug-info" name="debug-info"></textarea>
  </label>
  <small>This field only shows for test accounts</small>
</form-show-if>
```

## Progressive enhancement in action

Like all good web components, `form-show-if` follows progressive enhancement principles. If JavaScript fails to load or the browser doesn’t support custom elements, your form still works—users just see all the fields all the time. Not ideal for the user experience, but nothing breaks either.

The component is lightweight, has no dependencies, and works in all modern browsers.

## Demo

I’ve put together [a comprehensive demo showing various use cases and configurations](https://aarongustafson.github.io/form-show-if/demo.html) over on GitHub.

The demo includes examples of:

- Basic show/hide functionality
- Multiple condition logic
- Custom CSS class integration
- Complex form scenarios with radio buttons and checkboxes
- Different field grouping approaches

## Grab it

You can view the entire project (and suggest enhancements) over on [the form-show-if component’s GitHub repo](https://github.com/aarongustafson/form-show-if). The component is available as both a standard script and an ES module, so you can integrate it however works best for your project.

Installation is straightforward—just include the script in your page and start using the `form-show-if` element. No build step required, no framework dependencies, just clean, standards-based progressive enhancement.