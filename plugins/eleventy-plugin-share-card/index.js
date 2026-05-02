/**
 * eleventy-plugin-share-card
 *
 * Build-time social share-card (OG image) generator for Eleventy.
 * No external services — images are composited locally at build time using
 * sharp and cached on disk.
 *
 * Two ways to use this package:
 *
 * 1. As an Eleventy plugin (registers a `shareCard` universal filter):
 *
 *    import shareCardPlugin from 'eleventy-plugin-share-card';
 *    eleventyConfig.addPlugin(shareCardPlugin, options);
 *
 * 2. As a standalone generator factory (ideal for eleventyComputed data files):
 *
 *    import { createGenerator } from 'eleventy-plugin-share-card';
 *    const generateShareCard = createGenerator(options);
 *    // later:
 *    const imageUrl = await generateShareCard(['My Title', '#tag1 #tag2'], 'my-post-slug');
 *
 * See README.md for the full options reference and worked examples.
 */

export { createGenerator } from "./generator.js";

import { createGenerator } from "./generator.js";

/**
 * Eleventy plugin entry point.
 *
 * Registers a `shareCard(texts, slug)` universal async filter.
 *
 * @param {import('@11ty/eleventy').UserConfig} eleventyConfig
 * @param {object} options - same options object accepted by createGenerator()
 */
export default function shareCardPlugin(eleventyConfig, options = {}) {
	const generate = createGenerator(options);

	/**
	 * Universal async filter: `shareCard`
	 *
	 * Nunjucks example (pass texts array and slug as argument):
	 *   {{ [title, tags | tagsToHashtags] | shareCard(page.fileSlug) }}
	 *
	 * JavaScript/data-file example:
	 *   const url = await this.shareCard([title, tagline], slug);
	 */
	eleventyConfig.addFilter("shareCard", async function (texts, slug) {
		return generate(Array.isArray(texts) ? texts : [texts], slug);
	});
}
