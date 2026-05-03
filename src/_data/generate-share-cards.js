/**
 * Shared share-card generator for all collections.
 *
 * Centralized to ensure there's only ONE generator instance managing the cache,
 * preventing race conditions when multiple data files try to read/write the
 * same _cache/share-cards.json simultaneously.
 */

import { createGenerator } from "@aarongustafson/eleventy-plugin-share-card";

const rawGenerateShareCard = createGenerator({
  baseImagePath: "./src/_images/share-card.jpg",
  outputDir: "./src/static/i/share-cards",
  outputUrlPath: "/i/share-cards",
  cacheFile: "./_cache/share-cards.json",
  imageWidth: 1280,
  imageHeight: 669,
  layers: [
    {
      // Post title — Source Serif Pro Bold, anchored to the bottom of the text area
      font: "Source Serif Pro",
      fontFallback: "serif",
      fontPath:
        "node_modules/@fontsource/source-serif-pro/files/source-serif-pro-latin-700-normal.woff2",
      fontSize: 72,
      fontWeight: 700,
      color: "#2C2825",
      x: 480,
      y: { from: "bottom", value: 205 },
      maxWidth: 760,
      lineSpacing: -18,
      scaleX: 0.9,
    },
    {
      // Hashtag tagline — Open Sans Light, anchored to the top of the text area
      font: "Open Sans",
      fontFallback: "sans-serif",
      fontPath:
        "node_modules/@fontsource/open-sans/files/open-sans-latin-300-normal.woff2",
      fontSize: 36,
      fontWeight: 300,
      color: "#5b5b5b",
      x: 480,
      y: { from: "top", value: 505 },
      maxWidth: 760,
      lineSpacing: -5,
      constrainToWidth: true,
      actualWidthFactor: 1.15,
    },
  ],
  verbose: true,
});

// Eleventy can invoke computed data in parallel. The plugin currently loads and
// saves the JSON cache per call, so parallel calls can race and cause broad
// timestamp churn. Serialize calls through one queue until the plugin handles
// cache reads/writes atomically.
let queue = Promise.resolve();

export function generateShareCard(texts, slug) {
  const run = queue.then(() => rawGenerateShareCard(texts, slug));
  queue = run.catch(() => undefined);
  return run;
}
