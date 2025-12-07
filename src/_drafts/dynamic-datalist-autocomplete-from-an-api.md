---
title: "Dynamic Datalist: Autocomplete from an API"
date: 2025-12-06 10:00:00 -07:00
comments: true
tags: ["forms", "HTML", "JavaScript", "progressive enhancement", "web components", "web forms", "API"]
description: "The datalist element is great for autocomplete, but it's static. The dynamic-datalist web component brings dynamic, API-driven suggestions to your text fields as users type."
twitter_text: "Want API-driven autocomplete suggestions in your forms? Here's a web component that makes it happen."
series:
  name: "Modern Web Form Best Practices"
  tag: "series-forms"
  ordinal: "9"
---

HTML's `datalist` element provides native autocomplete functionality, but it's entirely static—you have to know all the options up front. The `dynamic-datalist` web component solves this by fetching suggestions from an API endpoint as users type, giving you the benefits of native autocomplete with the flexibility of dynamic data.

<!-- more -->

This component is a modern replacement for [my old jQuery predictive typing plugin](https://github.com/easy-designs/jquery.easy-predictive-typing.js), reimagined as a standards-based web component.

## Basic usage

Wrap your input field and specify an endpoint:

```html
<dynamic-datalist endpoint="/api/search">
  <label for="search">Search
    <input type="text" id="search" name="search" placeholder="Type to search...">
  </label>
</dynamic-datalist>
```

As users type, the component makes GET requests to `/api/search?query=WHAT_THE_USER_TYPED` and populates a `datalist` with the results.

## POST requests

Need to use POST instead? Just add the `method` attribute:

```html
<dynamic-datalist endpoint="/api/lookup" method="post">
  <label for="lookup">Lookup
    <input type="text" id="lookup" name="lookup">
  </label>
</dynamic-datalist>
```

This sends a POST request with a JSON body: `{ "query": "..." }`.

## Custom variable names

By default, the component uses "query" as the parameter name. Change it with the `key` attribute:

```html
<dynamic-datalist endpoint="/api/terms" method="post" key="term">
  <label for="search">Term search
    <input type="text" id="search" name="term">
  </label>
</dynamic-datalist>
```

This sends `/api/terms?term=...` for GET requests, or `{ "term": "..." }` for POST requests.

## Working with existing datalists

If your input already has a datalist defined, the component preserves it and adds fetched results:

```html
<dynamic-datalist endpoint="/api/cities">
  <label for="city">City
    <input type="text" id="city" list="cities-list" placeholder="Type a city...">
  </label>
  <datalist id="cities-list">
    <option>New York</option>
    <option>Los Angeles</option>
    <option>Chicago</option>
  </datalist>
</dynamic-datalist>
```

Users see the pre-populated cities immediately, and as they type, API results supplement the list. This provides a great progressive enhancement—if JavaScript fails, users still get the static options.

## API response format

Your endpoint should return JSON in this format:

```json
{
  "options": [
    "option 1",
    "option 2",
    "option 3"
  ]
}
```

Keep it simple—just an array of strings in an `options` property.

## Real-world examples

**Product search:**

```html
<form action="/search" method="get">
  <dynamic-datalist endpoint="/api/products">
    <label for="product-search">Search products
      <input type="search" id="product-search" name="q" placeholder="Search for products..." required>
    </label>
  </dynamic-datalist>
  <button type="submit">Search</button>
</form>
```

**User mentions:**

```html
<form action="/comment" method="post">
  <dynamic-datalist endpoint="/api/users" key="username">
    <label for="mention">Mention a user
      <input type="text" id="mention" name="mention" placeholder="Start typing @...">
    </label>
  </dynamic-datalist>
  <button type="submit">Post</button>
</form>
```

**Address autocomplete:**

```html
<form action="/checkout" method="post">
  <label for="name">Name
    <input type="text" id="name" name="name" required>
  </label>

  <dynamic-datalist endpoint="/api/addresses">
    <label for="address">Address
      <input type="text" id="address" name="address" placeholder="Start typing your address..." required>
    </label>
  </dynamic-datalist>

  <button type="submit">Continue</button>
</form>
```

## Event handling

The component fires three custom events:

- `dynamic-datalist:ready` - Fired when the component initializes
- `dynamic-datalist:update` - Fired when the datalist is updated with new options
- `dynamic-datalist:error` - Fired when an error occurs fetching data

```javascript
const element = document.querySelector('dynamic-datalist');

element.addEventListener('dynamic-datalist:ready', (e) => {
  console.log('Component ready:', e.detail);
});

element.addEventListener('dynamic-datalist:update', (e) => {
  console.log('Options updated:', e.detail.options);
});

element.addEventListener('dynamic-datalist:error', (e) => {
  console.error('Error:', e.detail.error);
});
```

Each event provides helpful detail objects with references to the input, datalist, and relevant data.

## How it works

The component:

1. Detects or creates a `datalist` element for your input
2. Listens for input events
3. Debounces requests to avoid overwhelming your API
4. Sends requests to your endpoint with the current input value
5. Parses the JSON response
6. Updates the datalist options
7. Dispatches events to keep you informed

All of this happens transparently—users just see autocomplete suggestions appearing as they type.

## Progressive enhancement

If JavaScript fails to load or the browser doesn't support custom elements, the input still works perfectly—users just don't get dynamic suggestions. If you've provided a static `datalist`, those options remain available. Nothing breaks.

## Demo

Check out [the demo](https://aarongustafson.github.io/dynamic-datalist/demo/) for live examples:

<figure id="fig-2025-12-06-03" class="media-container">
  {% CodePen "https://codepen.io/aarongustafson/pen/PENDING", "result", "400" %}
</figure>

## Grab it

The project is available on [GitHub](https://github.com/aarongustafson/dynamic-datalist). Install via npm:

```bash
npm install @aarongustafson/dynamic-datalist
```

Import and use:

```javascript
import '@aarongustafson/dynamic-datalist';
```

No dependencies, just clean autocomplete powered by your API.
