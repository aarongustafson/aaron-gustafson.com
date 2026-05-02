# eleventy-plugin-share-card

Build-time social share-card (OG image) generator for [Eleventy](https://www.11ty.dev/). No external services required — images are composited locally at build time using [sharp](https://sharp.pixelplumbing.com/) and cached on disk so unchanged posts are never re-processed.

## Features

- 🖼 Composites any number of text layers onto a base template image
- 🔤 Embeds custom fonts (WOFF2 / TTF / OTF) directly into the SVG — no system font installation needed
- 💾 Disk cache keyed by content hash — only regenerates when text changes
- 🧩 Works as an **Eleventy plugin** (registers a `shareCard` filter) **or** as a standalone **generator factory** for use inside `eleventyComputed` data files
- 🚫 Zero calls to Cloudinary, imgix, or any other external image API

## Installation

```bash
npm install eleventy-plugin-share-card sharp
```

> `sharp` is a peer dependency. If your project already has it, you're all set.

### Optional: fonts via fontsource

The plugin accepts any local font file — you can source them however you like. [Fontsource](https://fontsource.org/) is an easy option:

```bash
npm install @fontsource/source-serif-4 @fontsource/open-sans
```

---

## Quick start

### Option A — Eleventy plugin (adds a `shareCard` filter)

```js
// .eleventy.js
import shareCardPlugin from "eleventy-plugin-share-card";

export default (eleventyConfig) => {
  eleventyConfig.addPlugin(shareCardPlugin, {
    baseImagePath: "./src/_images/share-card.jpg",
    outputDir:     "./src/static/i/share-cards",
    outputUrlPath: "/i/share-cards",
    cacheFile:     "./_cache/share-cards.json",
    imageWidth:    1280,
    imageHeight:   669,
    layers: [
      {
        font:        "Source Serif 4",
        fontPath:    "node_modules/@fontsource/source-serif-4/files/source-serif-4-latin-700-normal.woff2",
        fontSize:    72,
        fontWeight:  700,
        color:       "#2C2825",
        x:           480,
        y:           { from: "bottom", value: 205 },
        maxWidth:    760,
        lineSpacing: -18,
      },
      {
        font:        "Open Sans",
        fontPath:    "node_modules/@fontsource/open-sans/files/open-sans-latin-300-normal.woff2",
        fontSize:    36,
        fontWeight:  300,
        color:       "#505050",
        x:           480,
        y:           { from: "top", value: 505 },
        maxWidth:    760,
        lineSpacing: -5,
      },
    ],
  });
};
```

### Option B — Generator factory in an `eleventyComputed` data file

This is the recommended pattern for data files because it gives you full control over which text goes into each layer.

```js
// src/posts/posts.11tydata.js
import { createGenerator } from "eleventy-plugin-share-card";

const generateShareCard = createGenerator({
  baseImagePath: "./src/_images/share-card.jpg",
  outputDir:     "./src/static/i/share-cards",
  outputUrlPath: "/i/share-cards",
  layers: [
    { font: "Source Serif 4", fontPath: "...", fontSize: 72, fontWeight: 700,
      color: "#2C2825", x: 480, y: { from: "bottom", value: 205 }, maxWidth: 760, lineSpacing: -18 },
    { font: "Open Sans",      fontPath: "...", fontSize: 36, fontWeight: 300,
      color: "#505050", x: 480, y: { from: "top",    value: 505 }, maxWidth: 760, lineSpacing: -5  },
  ],
});

export default {
  eleventyComputed: {
    image: async (data) => {
      if (data.hero) return `${data.site.url}${data.hero.src}`;
      // Pass texts in layer order, then a unique slug for the filename
      return generateShareCard(
        [data.title, myTagsToHashtags(data.tags)],
        data.page.fileSlug,
      );
    },
  },
};
```

---

## Options reference

### Top-level options

| Option | Type | Required | Default | Description |
|---|---|---|---|---|
| `baseImagePath` | `string` | ✅ | — | Path to the template image (JPEG or PNG). Relative paths are resolved from `process.cwd()`. |
| `outputDir` | `string` | ✅ | — | Directory where generated share-card images are written. Created automatically if missing. |
| `outputUrlPath` | `string` | ✅ | — | URL prefix returned in the generated image path (e.g. `"/i/share-cards"`). |
| `cacheFile` | `string` | | `./_cache/share-cards.json` | Path to the JSON cache file. |
| `imageWidth` | `number` | | `1280` | Width of `baseImagePath` in pixels (used for SVG canvas size). |
| `imageHeight` | `number` | | `669` | Height of `baseImagePath` in pixels. |
| `jpegQuality` | `number` | | `90` | Output JPEG quality (1–100). |
| `layers` | `Layer[]` | ✅ | — | Text layer definitions — see below. |

### Layer options

Each entry in `layers` configures one text block composited over the base image.

| Option | Type | Required | Default | Description |
|---|---|---|---|---|
| `font` | `string` | ✅ | — | CSS `font-family` value (e.g. `"Source Serif 4"`). |
| `fontPath` | `string` | | — | Path to a WOFF2, WOFF, TTF, or OTF file. When provided the font is embedded as a base64 data URI so the generator works without system fonts. Relative paths are resolved from `process.cwd()`. |
| `fontSize` | `number` | ✅ | — | Font size in pixels. |
| `fontWeight` | `number` | | `400` | CSS font-weight (e.g. `700` for bold, `300` for light). |
| `color` | `string` | | `"#000000"` | Hex color with or without leading `#`. |
| `x` | `number` | ✅ | — | Left edge of the text area in pixels from the left of the image. |
| `y` | `number \| {from, value}` | ✅ | — | Vertical position. A plain number is treated as pixels from the top. Pass `{ from: "bottom", value: N }` to anchor the *bottom* of the text block N pixels from the bottom of the image (like Cloudinary's `south_west` gravity). |
| `maxWidth` | `number` | ✅ | — | Maximum text-area width in pixels. Text is word-wrapped to fit. |
| `lineSpacing` | `number` | | `0` | Adjustment to the default `1.2×` line height in pixels. Negative values tighten lines (same semantic as Cloudinary's `line_spacing` parameter). |

### Generator function signature

```ts
generateShareCard(texts: string[], slug: string): Promise<string>
```

| Argument | Description |
|---|---|
| `texts` | Array of strings, one per configured layer (in the same order). Empty strings skip that layer. |
| `slug` | Unique identifier used as the output filename (e.g. `data.page.fileSlug`). The cache is also keyed by slug. |

**Returns** the public URL path (e.g. `"/i/share-cards/my-post.jpg"`) or `""` on error.

---

## Caching

Generated images are cached by slug. On each build the generator:

1. Computes a SHA-256 hash of all text strings for that image.
2. Looks up the slug in `cacheFile`.
3. If the hash matches **and** the output file exists → returns the cached URL immediately (no image processing).
4. Otherwise → generates the image, writes the file, and updates the cache.

This means only posts whose titles or tags have changed (or new posts) will trigger image generation on incremental builds.

### Netlify / CI

Add `_cache/share-cards.json` and your `outputDir` to your Netlify cache plugin configuration to persist the cache and generated images between deploys:

```toml
# netlify.toml
[[plugins]]
package = "netlify-plugin-cache-folder"
```

---

## How text layout works

The plugin uses a **character-width estimation** algorithm rather than full font shaping. It categorises each character into one of six width buckets (narrow punctuation, wide letters like `m`/`w`, uppercase, digits, spaces, and average lowercase) and sums them to estimate line widths. This approach:

- Requires no native addons or browser APIs
- Works accurately enough for Latin titles and tags
- Can be tuned per layer via (future) `charWidthRatio` override

If you find that a particular font renders significantly wider or narrower, open an issue or PR — the algorithm is small and easy to adjust.

---

## Migrating from `@jlengstorf/get-share-image`

`@jlengstorf/get-share-image` generates a Cloudinary URL; this plugin generates the image itself. The layer options map directly to Cloudinary's text overlay parameters:

| Cloudinary | This plugin |
|---|---|
| `cloudName` / `imagePublicID` | `baseImagePath` |
| `titleFont` | `layers[0].font` |
| `titleFontSize` | `layers[0].fontSize` |
| `titleExtraConfig: "_700_..."` | `layers[0].fontWeight: 700` |
| `titleLeftOffset` | `layers[0].x` |
| `titleBottomOffset` | `layers[0].y: { from: "bottom", value: N }` |
| `textAreaWidth` | `layers[0].maxWidth` |
| `textColor` | `layers[0].color` |
| `taglineGravity: "north_west"` | `layers[1].y: { from: "top", value: N }` |

---

## License

MIT
