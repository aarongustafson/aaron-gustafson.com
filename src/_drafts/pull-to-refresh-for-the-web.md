---
title: "Pull-to-Refresh for the Web"
date: 2025-12-06 10:00:00 -07:00
comments: true
tags:
  [
    "web components",
    "progressive enhancement",
    "HTML",
    "JavaScript",
    "mobile",
    "user experience",
  ]
description: "I wanted to see what it would take to add pull-to-refresh to a web page as an optional touch enhancement, without making the hidden gesture the only way to refresh."
twitter_text: "I wanted to see what it would take to add pull-to-refresh to a web page as an optional enhancement. The gesture works, but important refreshes still need a visible control."
---

I wanted to see what it would take to bring pull-to-refresh to the web.

Not because every website has been quietly waiting to become a mobile feed. The gesture is familiar on touch devices, and I was curious whether I could add it as an optional enhancement without taking over the page. That experiment became [`@aarongustafson/pull-to-refresh`](https://github.com/aarongustafson/pull-to-refresh), now at version 1.1.0.

<!-- more -->

The basic markup is small:

```html
<pull-to-refresh>
  <main>
    <h1>Latest updates</h1>
    <div id="updates">
      <!-- server-rendered updates -->
    </div>
  </main>
</pull-to-refresh>
```

The custom element wraps the part of the page that can be refreshed. Until its script runs—or if it never does—the browser displays the heading and the server-rendered updates normally. There’s no gesture, but there’s also no missing content.

Once the component is active, a touch that starts at the top can pull the content downward. The indicator first asks the reader to keep pulling, changes when the threshold has been crossed, then reports that a refresh is underway after release. Its status text is exposed through an assertive live region so the changing state isn’t communicated by movement alone.

The component doesn’t know how your site gets new data. Instead, it dispatches `ptr:refresh` and hands the listener a `complete()` function:

```javascript
const pullToRefresh = document.querySelector("pull-to-refresh");

pullToRefresh.addEventListener("ptr:refresh", async (event) => {
  try {
    const response = await fetch("/api/latest");

    if (!response.ok) {
      throw new Error(`Refresh failed: ${response.status}`);
    }

    const data = await response.json();
    renderUpdates(data);
  } catch (error) {
    console.error(error);
  } finally {
    event.detail.complete();
  }
});
```

Calling `complete()` retracts the indicator and dispatches `ptr:refresh-complete`. The `finally` block is important. A failed request is still finished; without that call, the interface would sit there claiming to refresh long after the network had given up. The component has a two-second fallback in case a listener forgets, but the code doing the actual work knows when that work ends.

## A hidden gesture needs backup

Pull-to-refresh has an obvious limitation: there’s no control to see until you start pulling. A keyboard user can’t perform the touch gesture, and someone who hasn’t met the pattern before has little reason to discover it.

If getting fresh data matters, I’d provide a button, too:

```html
<button type="button" id="refresh-updates">Refresh updates</button>

<pull-to-refresh>
  <div id="updates"><!-- updates --></div>
</pull-to-refresh>
```

The button and `ptr:refresh` listener can call the same refresh function. The gesture then rewards familiarity without becoming a toll booth for everyone else.

The hidden nature of the interaction also affected a few smaller choices. You can raise or lower the default 80-pixel threshold to suit the content:

```html
<pull-to-refresh threshold="120">
  <!-- refreshable content -->
</pull-to-refresh>
```

And because the indicator carries the instructions, its text follows the element’s `lang`, the nearest ancestor language, or the document language. Version 1.1.0 includes translations for 16 languages and falls back from regional tags such as `es-MX` to their base language. Individual strings can be overridden when a project uses different wording.

Those options don’t make the gesture accessible to a keyboard. They make the touch interaction less cryptic for the people who can use it. The visible button still has a different job.

You can [try the gesture and its different states in the demo](https://aarongustafson.github.io/pull-to-refresh/demo/). Install and register the component with:

```bash
npm install @aarongustafson/pull-to-refresh
```

```javascript
import "@aarongustafson/pull-to-refresh/define.js";
```

I like pull-to-refresh as a shortcut on the right kind of frequently updated page. I wouldn’t make anyone depend on it.
