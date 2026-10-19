import path from "node:path";

export const shareCardOptions = {
	baseImagePath: "./src/_images/share-card.jpg",
	outputDir: "./src/static/i/share-cards",
	outputUrlPath: "/i/share-cards",
	cacheFile: "./_cache/share-cards.json",
	imageWidth: 1200,
	imageHeight: 630,
	verbose: true,
	layers: [
		{
			font: "Source Serif Pro",
			fontFallback: "serif",
			fontPath:
				"node_modules/@fontsource/source-serif-pro/files/source-serif-pro-latin-700-normal.woff2",
			fontSize: 68,
			fontWeight: 700,
			color: "#2C2825",
			x: 450,
			y: { from: "bottom", value: 193 },
			maxWidth: 713,
			lineSpacing: -17,
			scaleX: 0.9,
		},
		{
			font: "Open Sans",
			fontFallback: "sans-serif",
			fontPath:
				"node_modules/@fontsource/open-sans/files/open-sans-latin-300-normal.woff2",
			fontSize: 34,
			fontWeight: 300,
			color: "#5b5b5b",
			x: 450,
			y: { from: "top", value: 475 },
			maxWidth: 713,
			lineSpacing: -5,
			constrainToWidth: true,
			actualWidthFactor: 1.15,
		},
	],
};

export const heroShareCardOptions = {
	outputDir: shareCardOptions.outputDir,
	outputUrlPath: shareCardOptions.outputUrlPath,
	cacheFile: "./_cache/hero-share-cards.json",
	imageWidth: shareCardOptions.imageWidth,
	imageHeight: shareCardOptions.imageHeight,
	jpegQuality: 90,
	staticDir: "./src/static",
	sourceDir: "./src/_images",
};

export function tagsToShareCardText(tags = []) {
	return tags
		.slice(0, 3)
		.map((tag) => `#${tag.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}`)
		.join(" ");
}

export function postSlugFromPath(filePath) {
	return path
		.basename(filePath, path.extname(filePath))
		.replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

export function shareCardUrl(slug) {
	return `${shareCardOptions.outputUrlPath}/${slug}.jpg`;
}

export function shareCardOutputPath(slug) {
	return path.join(shareCardOptions.outputDir, `${slug}.jpg`);
}
