import fs from "node:fs";
import path from "node:path";
import config from "../_tasks/config.js";
import { buildImages } from "../_tasks/images.js";

export default function staticPipeline(
	eleventyConfig,
	{
		sourceDir = `${config.source}/_images`,
		staticDir = config.static,
		cacheDir = config.cache,
	} = {},
) {
	// Serve generated output, not aliases pointing back at unoptimized sources.
	eleventyConfig.setServerPassthroughCopyBehavior("copy");
	eleventyConfig.addPassthroughCopy(
		{ [staticDir]: "/" },
		{
			filter(relativePath) {
				const relative = relativePath.split(path.sep).join("/");
				if (
					!/^i\/.+\.(jpg|png|gif|svg|mp4|mov|mp3|ogg)$/.test(relative) ||
					relative.includes(".sketch/")
				) {
					return true;
				}
				return !fs.existsSync(path.join(sourceDir, relative.slice(2)));
			},
		},
	);
	eleventyConfig.addWatchTarget(sourceDir);
	// Run after passthrough copying, including incremental single-file copies.
	eleventyConfig.on("eleventy.after", async ({ directories }) => {
		await buildImages({
			sourceDir,
			outputDir: path.join(directories.output, "i"),
			cacheDir,
		});
	});
}
