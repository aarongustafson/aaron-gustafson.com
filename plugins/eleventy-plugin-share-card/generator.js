/**
 * Core share-card image generator.
 *
 * Creates a JPEG share-card by compositing SVG text layers over a base image
 * using sharp. Fonts are embedded directly in the SVG as base64 data URIs so
 * the generator works in any Node.js environment without system-level font
 * installation.
 *
 * All I/O (reading the base image, writing output files, reading/writing the
 * cache) is done here so the generator module is the single place that touches
 * the filesystem.
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { buildTextElements, escapeXml } from "./text-layout.js";

// ---------------------------------------------------------------------------
// Cache helpers
// ---------------------------------------------------------------------------

/**
 * Load the JSON cache from disk.
 * Returns an empty object when the file doesn't exist or is unreadable.
 *
 * @param {string} cacheFile - absolute or relative path to the JSON cache file
 * @returns {Record<string, {hash:string, url:string, generated:string}>}
 */
function loadCache(cacheFile) {
	try {
		return JSON.parse(fs.readFileSync(cacheFile, "utf8"));
	} catch {
		return {};
	}
}

/**
 * Persist the cache object to disk.
 *
 * @param {string} cacheFile
 * @param {object} cache
 */
function saveCache(cacheFile, cache) {
	try {
		fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
		fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
	} catch (err) {
		console.error("[share-card] Could not write cache:", err.message);
	}
}

// ---------------------------------------------------------------------------
// Font embedding
// ---------------------------------------------------------------------------

/**
 * Read a font file and return a base64 data URI string, or an empty string if
 * the path cannot be resolved or the file is missing.
 *
 * Supports both absolute paths and paths relative to process.cwd().
 *
 * @param {string} fontPath
 * @returns {string} base64 data URI or ''
 */
function loadFontAsDataUri(fontPath) {
	if (!fontPath) return "";

	const resolved = path.isAbsolute(fontPath)
		? fontPath
		: path.resolve(process.cwd(), fontPath);

	try {
		const data = fs.readFileSync(resolved);
		const ext = path.extname(resolved).toLowerCase().replace(".", "");
		const mime =
			ext === "woff2" ? "font/woff2"
			: ext === "woff" ? "font/woff"
			: ext === "ttf" ? "font/ttf"
			: ext === "otf" ? "font/otf"
			: "font/ttf";
		return `data:${mime};base64,${data.toString("base64")}`;
	} catch {
		return "";
	}
}

// ---------------------------------------------------------------------------
// SVG builder
// ---------------------------------------------------------------------------

/**
 * Build the full SVG overlay string for all configured text layers.
 *
 * @param {object[]} layers - layer configs (each with resolved fontData if any)
 * @param {string[]} texts  - one text string per layer, in order
 * @param {object}   dims   - { imageWidth, imageHeight }
 * @returns {string} SVG markup
 */
function buildSvg(layers, texts, { imageWidth, imageHeight }) {
	// Collect @font-face declarations
	const fontFaces = layers
		.filter((l, i) => l.fontData && texts[i])
		.map((l) => {
			return `\t\t@font-face { font-family: '${escapeXml(l.font)}'; font-weight: ${l.fontWeight ?? 400}; src: url('${l.fontData}') format('${l.fontFormat ?? "woff2"}'); }`;
		})
		.join("\n");

	// Build text element groups
	const textMarkup = layers
		.map((layer, i) => {
			const text = texts[i];
			if (!text) return "";
			return buildTextElements(layer, text, imageHeight);
		})
		.filter(Boolean)
		.join("\n");

	return [
		`<svg xmlns="http://www.w3.org/2000/svg" width="${imageWidth}" height="${imageHeight}">`,
		fontFaces
			? `\t<defs>\n\t\t<style>\n${fontFaces}\n\t\t</style>\n\t</defs>`
			: "",
		textMarkup,
		"</svg>",
	]
		.filter(Boolean)
		.join("\n");
}

// ---------------------------------------------------------------------------
// Content hash
// ---------------------------------------------------------------------------

/**
 * Compute a short SHA-256 hex digest from the combined text strings.
 * Used to detect when the text for a given slug has changed so the image
 * can be regenerated.
 *
 * @param {string[]} texts
 * @returns {string} first 12 hex chars of the SHA-256 digest
 */
function contentHash(texts) {
	return crypto
		.createHash("sha256")
		.update(texts.join("\x00"))
		.digest("hex")
		.slice(0, 12);
}

// ---------------------------------------------------------------------------
// Public factory
// ---------------------------------------------------------------------------

/**
 * Create a share-card generator function bound to a specific configuration.
 *
 * Call this once (at module level in a data file) and re-use the returned
 * async function for every post/page.
 *
 * @param {object} options
 * @param {string}   options.baseImagePath  - path to the template JPEG/PNG
 * @param {string}   options.outputDir      - directory to write generated images into
 * @param {string}   options.outputUrlPath  - URL prefix used in the returned path  (e.g. '/i/share-cards')
 * @param {string}  [options.cacheFile]     - path to JSON cache (default: './_cache/share-cards.json')
 * @param {number}  [options.imageWidth]    - base image width  (default: 1280)
 * @param {number}  [options.imageHeight]   - base image height (default: 669)
 * @param {number}  [options.jpegQuality]   - output JPEG quality 1-100 (default: 90)
 * @param {object[]} options.layers         - text layer configs (see README for full shape)
 *
 * Each layer object supports:
 * @param {string}  layer.font        - CSS font-family name
 * @param {string} [layer.fontPath]   - path to a WOFF2/TTF/OTF font file to embed
 * @param {number}  layer.fontSize    - font size in pixels
 * @param {number} [layer.fontWeight] - CSS font-weight (default: 400)
 * @param {string} [layer.color]      - hex color, with or without '#' (default: '#000000')
 * @param {number}  layer.x           - left offset in pixels
 * @param {number|{from:'top'|'bottom', value:number}} layer.y - vertical position
 * @param {number}  layer.maxWidth    - text-area width for word-wrapping in pixels
 * @param {number} [layer.lineSpacing] - extra pixels between lines, may be negative (default: 0)
 *
 * @returns {function(texts: string[], slug: string): Promise<string>}
 *   Async function that accepts an array of text strings (one per layer) and a
 *   unique slug for the output filename. Returns the public URL of the image.
 */
export function createGenerator(options = {}) {
	const {
		baseImagePath,
		outputDir,
		outputUrlPath,
		cacheFile = "./_cache/share-cards.json",
		imageWidth = 1280,
		imageHeight = 669,
		jpegQuality = 90,
		layers = [],
	} = options;

	if (!baseImagePath) throw new Error("[share-card] options.baseImagePath is required");
	if (!outputDir) throw new Error("[share-card] options.outputDir is required");
	if (!outputUrlPath) throw new Error("[share-card] options.outputUrlPath is required");

	// Resolve the base image path once
	const resolvedBaseImage = path.isAbsolute(baseImagePath)
		? baseImagePath
		: path.resolve(process.cwd(), baseImagePath);

	// Pre-load fonts and attach them to the layer configs
	const preparedLayers = layers.map((layer) => {
		const fontData = loadFontAsDataUri(layer.fontPath);
		const ext = layer.fontPath
			? path.extname(layer.fontPath).toLowerCase().replace(".", "")
			: "woff2";
		const fontFormat =
			ext === "woff2" ? "woff2"
			: ext === "woff" ? "woff"
			: ext === "ttf" ? "truetype"
			: ext === "otf" ? "opentype"
			: "woff2";
		return { ...layer, fontData, fontFormat };
	});

	// Ensure output directory exists
	fs.mkdirSync(path.resolve(process.cwd(), outputDir), { recursive: true });

	/**
	 * Generate (or return a cached) share-card image.
	 *
	 * @param {string[]} texts - one string per layer, in the same order as `layers`
	 * @param {string}   slug  - unique identifier used as the output filename
	 * @returns {Promise<string>} public URL path to the generated image (e.g. '/i/share-cards/my-post.jpg')
	 */
	return async function generateShareCard(texts, slug) {
		if (!slug) {
			console.warn("[share-card] No slug provided; skipping image generation.");
			return "";
		}

		const hash = contentHash(texts);
		const filename = `${slug}.jpg`;
		const outputPath = path.resolve(process.cwd(), outputDir, filename);
		const publicUrl = `${outputUrlPath.replace(/\/$/, "")}/${filename}`;

		// Check the cache — skip generation if the hash matches and the file exists
		const cache = loadCache(cacheFile);
		if (cache[slug]?.hash === hash && fs.existsSync(outputPath)) {
			return publicUrl;
		}

		// Generate the SVG overlay
		const svg = buildSvg(preparedLayers, texts, { imageWidth, imageHeight });

		try {
			await sharp(resolvedBaseImage)
				.composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
				.jpeg({ quality: jpegQuality, progressive: true, mozjpeg: true })
				.toFile(outputPath);

			// Update the cache
			cache[slug] = { hash, url: publicUrl, generated: new Date().toISOString() };
			saveCache(cacheFile, cache);
		} catch (err) {
			console.error(`[share-card] Failed to generate image for "${slug}":`, err.message);
			return "";
		}

		return publicUrl;
	};
}
