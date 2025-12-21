const debugAssets = process.env.KEEP_CONSOLE === "true";

export default {
	/**
	 * When KEEP_CONSOLE is enabled we want Eleventy to load expanded bundles so
	 * console diagnostics survive regardless of minified asset state.
	 */
	debugAssets,
};
