/**
 * Netlify Build Plugin: share-cards-cache
 *
 * Persists the locally-generated OG share-card images between Netlify deploys
 * so they are not regenerated from scratch on every build.
 *
 * The eleventy-plugin-share-card generator already keeps its own content-hash
 * cache in _cache/share-cards.json (handled by netlify-plugin-cache-folder),
 * but the actual image files must also survive between builds or the generator
 * will re-create them even when nothing has changed.
 */
export default {
	async onPreBuild({ utils }) {
		await utils.cache.restore("./src/static/i/share-cards");
	},
	async onPostBuild({ utils }) {
		await utils.cache.save("./src/static/i/share-cards");
	},
};
