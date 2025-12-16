---
title: "Dynamic Datalist: Autocomplete from an API"
date: 2025-12-16 19:46:29 +00:00
comments: true
tags: ["forms", "HTML", "JavaScript", "progressive enhancement", "web components", "web forms", "API"]
description: "The `datalist` element is great for autocomplete, but it's static. The `dynamic-datalist` web component brings dynamic, API-driven suggestions to your text fields as users type."
twitter_text: "Want API-driven autocomplete suggestions in your forms? Here’s a web component that makes it happen."
series:
  name: "Modern Web Form Best Practices"
  tag: "series-forms"
  ordinal: "9"
---

HTML’s `datalist` element provides native autocomplete functionality, but it’s entirely static—you have to know all the options up front. The `dynamic-datalist` web component solves this by fetching suggestions from an API endpoint as users type, giving you the benefits of native autocomplete with the flexibility of dynamic data.

<!-- more -->

This component is a modern replacement for [my old jQuery predictive typing plugin](https://github.com/easy-designs/jquery.easy-predictive-typing.js). I’ve reimagined it as a standards-based web component.

## Basic usage

To use the component, wrap it around your `input` field and specify an endpoint:

```html
<dynamic-datalist endpoint="/api/search">
  <label for="search">Search
    <input type="text" id="search" name="search"
           placeholder="Type to search..."
           >
  </label>
</dynamic-datalist>
```

As users type, the component makes GET requests to that endpoint, passing in the typed value as the "query" parameter (e.g., `/api/search?query=WHAT_THE_USER_TYPED`). The response fromm the endpoint is used to populates a dynamic `datalist` element with the results.

The structure of the response should be JSON with an `options` array of string values:

```json
{
  "options": [
    "option 1",
    "option 2",
    "option 3"
  ]
}
```

## How it works

Under the hood, the component:

1. Adopts (or creates) a `datalist` element for your `input`,
2. Listens for "input" events,
3. Debounces requests (waiting at least 250ms) to avoid overwhelming your API,
4. Sends requests to your endpoint with the current value of the `input`,
5. Reads back the JSON response,
6. Updates the `datalist` `option` elements, and
7. Dispatches the update event.

All of this happens transparently—users just see autocomplete suggestions appearing as they type.

## Need POST?

You can change the submission method via the `method` attribute:

```html
<dynamic-datalist endpoint="/api/lookup" method="post">
  <label for="lookup">Lookup
    <input type="text" id="lookup" name="lookup">
  </label>
</dynamic-datalist>
```

This sends a POST request with a JSON body: `{ "query": "..." }`. Currently GET and POST are supported, but I could add more if folks want them.

## Custom variable names

As I mentioned, the component uses "query" as the parameter name by default, but you can easily change it via the `key` attribute:

```html
<dynamic-datalist endpoint="/api/terms" key="term">
  <label for="search">Term search
    <input type="text" id="search" name="term">
  </label>
</dynamic-datalist>
```

This sends the GET request `/api/terms?term=...`.

## Working with existing datalists

If your `input` already has a `datalist` defined, the component will inherit it and replace the existing options with the fetched results, which makes for a nice progressive enhancement:

```html
<dynamic-datalist endpoint="/api/cities">
  <label for="city">City
    <input type="text" id="city" list="cities-list"
           placeholder="Type a city…"
           >
  </label>
  <datalist id="cities-list">
    <option>New York</option>
    <option>Los Angeles</option>
    <option>Chicago</option>
  </datalist>
</dynamic-datalist>
```

Users see the pre-populated cities immediately, and as they type, API results supplement the list. If JavaScript fails or the web component doesn’t load, users still get the static options. Nothing breaks.

## Event handling

If you want to tap into the component’s event system, it fires three custom events:

- `dynamic-datalist:ready` - Fired when the component initializes
- `dynamic-datalist:update` - Fired when the `datalist` is updated with new options
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

Each event provides helpful `detail` objects with references to the `input`, `datalist`, and other relevant data.

## Demo

Check out [the demo](https://aarongustafson.github.io/dynamic-datalist/demo/) for live examples (there are also [unpkg](https://aarongustafson.github.io/dynamic-datalist/demo/unpkg.html) and [ESM](https://aarongustafson.github.io/dynamic-datalist/demo/esm.html) builds if you want to test CDN delivery):

<figure id="fig-2025-12-06-03" class="media-container">
<fullscreen-control class="talk__slides__embed video-embed__video">
<iframe src="https://aarongustafson.github.io/dynamic-datalist/demo/" class="talk__slides__embed video-embed__video" frameborder="0"></iframe>
</fullscreen-control>
</figure>

## Grab it

The project is available on [GitHub](https://github.com/aarongustafson/dynamic-datalist). You can also install via npm:

```bash
npm install @aarongustafson/dynamic-datalist
```

If you go that route, there are a few ways to register the element depending on your build setup:

### Option 1: Define it yourself

```javascript
import { DynamicDatalistElement } from '@aarongustafson/dynamic-datalist';

customElements.define('dynamic-datalist', DynamicDatalistElement);
```

### Option 2: Let the helper guard registration

```javascript
import '@aarongustafson/dynamic-datalist/define.js';
// or, when you need to wait:
import { defineDynamicDatalist } from '@aarongustafson/dynamic-datalist/define.js';

defineDynamicDatalist();
```

### Option 3: Drop the helper in via a `<script>` tag

```html
<script src="./node_modules/@aarongustafson/dynamic-datalist/define.js" type="module"></script>
```

Regardless of how you register it, there are no framework dependencies—just clean autocomplete powered by your API. As I mentioned, it’s also available via CDNs, such as unpkg too, if you’d prefer to go that route.
