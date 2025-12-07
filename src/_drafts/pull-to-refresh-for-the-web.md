---
title: "Pull-to-Refresh for the Web"
date: 2025-12-06 10:00:00 -07:00
comments: true
tags: ["web components", "progressive enhancement", "HTML", "JavaScript", "mobile", "UX"]
description: "The pull-to-refresh gesture is second nature on mobile apps, but rare on the web. The pull-to-refresh web component brings this familiar interaction pattern to your web applications."
twitter_text: "Want pull-to-refresh in your web app? Here's a web component that makes it happen."
---

Anyone who's used a mobile app is familiar with pull-to-refresh—drag down from the top, release, and watch the content update. It's such an established pattern that users instinctively try it on web pages. The `pull-to-refresh` web component brings this interaction to the web, complete with touch optimization, visual feedback, and comprehensive localization.

<!-- more -->

## Basic usage

Wrap your content and listen for the refresh event:

```html
<pull-to-refresh>
  <div class="content">
    <h1>My Content</h1>
    <p>Pull down from the top to refresh!</p>
  </div>
</pull-to-refresh>

<script type="module">
  import '@aarongustafson/pull-to-refresh';

  const ptr = document.querySelector('pull-to-refresh');

  ptr.addEventListener('ptr:refresh', (e) => {
    // Fetch new data
    fetch('/api/data')
      .then(response => response.json())
      .then(data => {
        updateContent(data);
        // Signal completion
        e.detail.complete();
      });
  });
</script>
```

The component handles the gesture detection, visual feedback, and state management. You just fetch your data and call `complete()` when done.

## Customizing the threshold

The default pull distance is 80 pixels. Adjust it with the `threshold` attribute:

```html
<pull-to-refresh threshold="120">
  <div>Content here</div>
</pull-to-refresh>
```

Users now need to pull 120 pixels before triggering the refresh. This can reduce accidental triggers.

## Custom messages

Customize the text shown during different states:

```html
<pull-to-refresh
  indicator-text="⬇ Swipe down"
  release-text="🔄 Let go!"
  refreshing-text="⏳ Loading...">
  <div>Content here</div>
</pull-to-refresh>
```

The component shows these messages as users pull, reach the threshold, and while refreshing.

## Preventing text selection

By default, text selection is allowed during pull gestures. Use `disable-selection` to prevent accidental text selection while pulling:

```html
<pull-to-refresh disable-selection>
  <div>Content here</div>
</pull-to-refresh>
```

This can improve the user experience on touch devices.

## Built-in localization

The component includes translations for 16 languages. Set the `lang` attribute and messages automatically adapt:

```html
<!-- Spanish -->
<pull-to-refresh lang="es">
  <div>Contenido aquí</div>
</pull-to-refresh>

<!-- French -->
<pull-to-refresh lang="fr">
  <div>Contenu ici</div>
</pull-to-refresh>

<!-- Japanese -->
<pull-to-refresh lang="ja">
  <div>ここにコンテンツ</div>
</pull-to-refresh>
```

Language detection follows a cascade: the element's `lang` attribute, nearest ancestor's `lang`, document's `lang`, then defaults to English.

Supported languages include English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese (Mandarin), Hindi, Arabic, Bengali, Punjabi, Javanese, and Vietnamese. Regional variants automatically fall back to base languages.

Register custom translations:

```javascript
import { PullToRefreshElement } from '@aarongustafson/pull-to-refresh';

PullToRefreshElement.registerTranslations({
  'pt-BR': {
    indicator: '↓ Puxe para atualizar',
    release: '↻ Solte para atualizar',
    refreshing: '⏳ Atualizando...'
  }
});
```

## Event lifecycle

The component fires events throughout the pull-to-refresh lifecycle:

- `ptr:pull-start` - Pull gesture starts
- `ptr:pull-move` - During pull (includes distance)
- `ptr:pull-end` - Pull gesture ends
- `ptr:refresh` - Refresh triggered (call `complete()` when done)
- `ptr:refresh-complete` - Refresh completes

```javascript
ptr.addEventListener('ptr:pull-start', () => {
  console.log('User started pulling');
});

ptr.addEventListener('ptr:pull-move', (e) => {
  console.log('Pull distance:', e.detail.distance);
});

ptr.addEventListener('ptr:refresh', (e) => {
  doAsyncWork().then(() => {
    e.detail.complete(); // Must call this
  });
});
```

**Important:** Always call `event.detail.complete()` in your `ptr:refresh` handler to signal completion. If you don't, the component auto-completes after 2 seconds.

## Styling with CSS custom properties

Customize the indicator appearance:

```css
pull-to-refresh {
  --ptr-indicator-height: 3.75rem;
  --ptr-indicator-bg: #f0f0f0;
  --ptr-indicator-color: #1976d2;
  --ptr-indicator-font-size: 1rem;
  --ptr-transition-duration: 0.3s;
}
```

Available properties:
- `--ptr-indicator-height` - Height of indicator area (default: 3.125rem)
- `--ptr-indicator-bg` - Background color (default: ButtonFace)
- `--ptr-indicator-color` - Text color (default: ButtonText)
- `--ptr-indicator-font-size` - Font size (default: 0.875rem)
- `--ptr-transition-duration` - Transition duration (default: 0.2s)

## Disabling pull-to-refresh

Temporarily disable the functionality:

```html
<pull-to-refresh disabled>
  <div>No refresh available</div>
</pull-to-refresh>
```

Or toggle programmatically:

```javascript
ptr.disabled = true;
```

## Practical example

Here's a complete example with fetch:

```javascript
const ptr = document.querySelector('pull-to-refresh');

ptr.addEventListener('ptr:refresh', async (e) => {
  try {
    const response = await fetch('/api/latest');
    const data = await response.json();
    renderData(data);
  } catch (error) {
    console.error('Refresh failed:', error);
  } finally {
    e.detail.complete();
  }
});
```

The `finally` block ensures `complete()` is called even if the fetch fails.

## Accessibility

The component includes proper ARIA attributes and screen reader support. The indicator has semantic HTML and announces state changes using the customizable or localized labels.

## Touch optimization

The component provides smooth pull gestures with momentum and visual feedback. It handles touch events properly, distinguishing between vertical pulls (refresh) and horizontal swipes (ignore).

## Progressive enhancement

If JavaScript fails to load, the content displays normally—users just don't get pull-to-refresh functionality. Nothing breaks, you just lose the enhancement.

## Demo

Check out [the demo](https://aarongustafson.github.io/pull-to-refresh/demo/) with various configurations:

<figure id="fig-2025-12-06-05" class="media-container">
  {% CodePen "https://codepen.io/aarongustafson/pen/PENDING", "result", "400" %}
</figure>

## Grab it

View the project on [GitHub](https://github.com/aarongustafson/pull-to-refresh). Install via npm:

```bash
npm install @aarongustafson/pull-to-refresh
```

Import and use:

```javascript
import '@aarongustafson/pull-to-refresh';
```

Bring a familiar mobile interaction pattern to your web applications—no framework required.
