---
title: "Lazy Loading Images Based on Screen Size"
date: 2025-12-10 17:15:54 +00:00
comments: true
tags: ["web components", "progressive enhancement", "HTML", "performance", "images", "responsive design"]
description: "The lazy-img web component goes beyond native lazy loading and srcset—it can completely skip loading images on small screens, saving bandwidth where it matters most."
twitter_text: "Want to skip loading images entirely on mobile? Here's a web component that does just that."
---

Native lazy loading and `srcset` are great, but they have a limitation: they always load *some* variant of the image. The `lazy-img` web component takes a different approach—it can completely skip loading images when they don't meet your criteria, whether that's screen size, container size, or visibility in the viewport.

This is particularly valuable for mobile users on slow connections or limited data plans. If an image is only meaningful on larger screens, why waste their bandwidth loading it at all?

<!-- more -->

## The performance benefit

Unlike `picture` or `srcset`, which always load some image variant, `lazy-img` can **completely skip loading images** on screens or containers below your specified threshold. Set `min-inline-size="768px"` and mobile users will never download that image at all—saving data and speeding up page loads.

Once an image is loaded, however, it remains loaded even if the viewport or container is resized below the threshold. This is intentional—the component prevents unnecessary downloads but doesn't unload images already in memory. You can control visibility with CSS if needed using the `loaded` and `qualifies` attributes (which we’ll get to shortly).

## Basic usage

The `lazy-img` works pretty much identically to a regular `img` element, with all the attributes you know and love:

```html
<lazy-img
  src="image.jpg"
  alt="A beautiful image">
</lazy-img>
```

But that’s not very interesting. The real power comes from conditional loading.

## Container queries (default)

Load an image only when its container reaches a minimum width:

```html
<lazy-img
  src="large-image.jpg"
  alt="Large image"
  min-inline-size="500px">
</lazy-img>
```

The image loads when the `lazy-img` element’s container reaches 500px wide. This is the default query mode—it uses `ResizeObserver` to watch the container size.

## Media queries

You can lazy load images based on viewport width instead by switching to media query mode:

```html
<lazy-img
  src="desktop-image.jpg"
  alt="Desktop image"
  min-inline-size="768px"
  query="media">
</lazy-img>
```

With this configuration, the image loads when the browser window is at least 768px wide.

## View mode (scroll-based loading)

Load images when they scroll into view using `IntersectionObserver` by switching to the "view" query type:

```html
<lazy-img
  src="image.jpg"
  alt="Loads when scrolled into view"
  query="view">
</lazy-img>
```

The default behavior (`view-range-start="entry 0%"`) loads as soon as any part of the image enters the viewport.

Control when images load with the `view-range-start` attribute:

**Load when 50% visible:**

```html
<lazy-img
  src="image.jpg"
  alt="Loads when half visible"
  query="view"
  view-range-start="entry 50%">
</lazy-img>
```

**Preload before entering viewport:**

```html
<lazy-img
  src="image.jpg"
  alt="Preloads 200px before visible"
  query="view"
  view-range-start="entry -200px">
</lazy-img>
```

This creates a smooth user experience—images are already loaded by the time users scroll to them.

## Responsive images

As with regular images, you can use `srcset` and `sizes` for responsive images:

```html
<lazy-img
  src="image-800.jpg"
  srcset="image-400.jpg 400w,
          image-800.jpg 800w,
          image-1200.jpg 1200w"
  sizes="(max-width: 600px) 400px,
         (max-width: 1000px) 800px,
         1200px"
  alt="Responsive image"
  min-inline-size="400px">
</lazy-img>
```

The component waits until the conditions are met before loading a real image and the browser takes over from there.

## Named breakpoints

You can also define named breakpoints using CSS custom properties:

```css
:root {
  --lazy-img-mq: small;
}

@media (min-width: 768px) {
  :root {
    --lazy-img-mq: medium;
  }
}

@media (min-width: 1024px) {
  :root {
    --lazy-img-mq: large;
  }
}
```

Then reference them in your markup:

```html
<lazy-img
  src="image.jpg"
  alt="Image with named breakpoints"
  named-breakpoints="medium, large"
  query="media">
</lazy-img>
```

The image loads when `--lazy-img-mq` matches "medium" or "large".

## Preventing layout shift

As with regular images, don’t forget to use `width` and `height` attributes to prevent Cumulative Layout Shift (CLS):

```html
<lazy-img
  src="image.jpg"
  alt="A beautiful image"
  width="800"
  height="600"
  min-inline-size="768px">
</lazy-img>
```

The browser reserves the correct space while the image loads, preventing content from jumping around.

## State attributes for styling

The component provides `loaded` and `qualifies` attributes you can use in CSS:

```css
/* Hide images that loaded but no longer meet conditions */
lazy-img[loaded]:not([qualifies]) {
  display: none;
}

/* Show a placeholder for images that qualify but haven't loaded */
lazy-img[qualifies]:not([loaded])::before {
  content: "Loading…";
  display: block;
  padding: 2em;
  background: #f0f0f0;
  text-align: center;
}
```

## Events

If you crave control, you can add your own functionality by listening for when images load:

```javascript
const lazyImg = document.querySelector('lazy-img');
lazyImg.addEventListener('lazy-img:loaded', (event) => {
  console.log('Image loaded:', event.detail.src);
});
```

## Performance

The component is highly optimized:

- **Throttled resize**: Resize events are throttled to prevent excessive checks
- **Shared `ResizeObserver`**: Multiple images observing the same container share a single ResizeObserver
- **Shared window resize listener**: Media query mode shares a single window resize listener
- **Shared `IntersectionObserver`**: View mode with the same `view-range-start` shares an `IntersectionObserver`
- **Clean disconnection**: Properly cleans up observers when elements are removed

Even with hundreds of `lazy-img` elements on a page, performance remains excellent.

## Progressive enhancement

If JavaScript fails to load, images simply don't appear (unless using immediate loading mode). This might sound problematic, but for non-critical images—decorative graphics, supplementary screenshots, marketing imagery—it's often exactly what you want. Your content remains accessible; you just lose the enhancements.

For critical images that are part of your content, use standard `img` tags. Use `lazy-img` for conditional enhancements.

## Demo

Explore [the demo](https://aarongustafson.github.io/lazy-img/demo/) to see container queries, media queries, scroll-based loading, and more in action:

<figure id="fig-2025-12-06-04" class="media-container">
<fullscreen-control class="talk__slides__embed video-embed__video">
<iframe src="https://aarongustafson.github.io/lazy-img/demo/" class="talk__slides__embed video-embed__video" frameborder="0"></iframe>
</fullscreen-control>
</figure>

## Grab it

Check out the project on [GitHub](https://github.com/aarongustafson/lazy-img). Install via npm:

```bash
npm install @aarongustafson/lazy-img
```

Import and use:

```javascript
import '@aarongustafson/lazy-img';
```

Based on my original [Easy Lazy Images](https://github.com/easy-designs/easy-lazy-images.js) concept, reimagined as a modern custom element.
